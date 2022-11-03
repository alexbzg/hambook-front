import axios from "axios"
import { formatURL } from "../utils/urls"

const getClient = (token = null) => {
  const defaultHeaders = {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : ""
  }

  return {
    get: (url, data, headers = {}) => axios.get(url, {headers: { ...defaultHeaders, ...headers }}),
    post: (url, data, headers = {}) => axios.post(url, data, {headers: { ...defaultHeaders, ...headers }}),
    put: (url, data, headers = {}) => axios.put(url, data, {headers: { ...defaultHeaders, ...headers }}),
    delete: (url, data, headers = {}) => axios.delete(url, {headers: { ...defaultHeaders, ...headers }})
  }
}

/**
 *
 * @param {String} url - relative api endpoint url
 * @param {String} method - "GET", "POST", "PUT", "DELETE"
 * @param {Object} types - object with three keys representing the different action types: REQUEST, SUCCESS, FAILURE
 * @param {Object} options - object with potential data, query params and headers
 * @param {Function} onSuccess - callback to run with the returned data, if any
 * @param {Function} onFailure - callback to run with the returned error, if any
 */
const apiClient = ({
  url,
  method,
  types: { REQUEST, SUCCESS, FAILURE },
  options: { data, params, headers },
  onSuccess = (res) => ({ type: res.type, success: true, status: res.status, data: res.data }),
  onFailure = (res) => ({ type: res.type, success: false, status: res.status, error: res.error })
}) => {
  return async (dispatch) => {
    const token = localStorage.getItem("access_token")
    const client = getClient(token)

    dispatch({ type: REQUEST })
    const urlPath = formatURL(url, params)

    try {
      const res = await client[method.toLowerCase()](urlPath, data, headers)

      dispatch({ type: SUCCESS, data: res.data })

      return onSuccess({ type: SUCCESS, ...res })
    } catch (error) {
      console.log(error)
      dispatch({
        type: FAILURE,
        error: error?.response?.data ? error.response.data : error
      })

      return onFailure({ type: FAILURE, status: error.status, error: error.response })
    }
  }
}

export default apiClient


