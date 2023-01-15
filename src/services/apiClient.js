import axios from "axios"

import { extractErrorMessages } from "../utils/errors"
import { showToast } from "../features/toasts/toasts"
import { formatURL } from "../utils/urls"

const client = async ({
	url, 
	method, 
    token,
	args, 
	params, 
    headers,
    getState,
    successMessage,
    suppressErrorMessage
    }) => {
    try {
      // get user data from store
      const urlPath = formatURL(url, params)

      // configure authorization header with user's token
      if (token !== 'skip') {
        token = token || getState()?.auth?.token
        if (token) {
            headers = { Authorization: `Bearer ${token}`, ...headers }
        }
      }

      const { data } = await axios({
		method,
        headers,
		url: urlPath, 
		data: args })
      if (successMessage) {
        showToast( <>{successMessage}</>, 'success' )
      }
      return data
    } catch (error) {
      console.log(error)
	  let rejectValue = error.message
      if (error.response?.data?.detail) {
        rejectValue = error.response.data.detail
      } 
      if (!suppressErrorMessage) {
        const userMessage = extractErrorMessages(rejectValue)
        if (userMessage) {
            showToast( <>{userMessage}</>, 'error' )
        }
      }
      throw rejectValue
    }
  }    

export default client

const resoursePromise = (params) => {
  let status = "pending"
  let result
  let suspend = client(params).then(
    (res) => {
        status = "succeeded"
        result = res
    },
    (err) => {
        status = "rejected"
        result = err
    }
  )
  return {
    read() {
      if (status === "pending") {
        throw suspend
      } else if (status === "rejected") {
        throw result
      } else {
        return result
      }
    }
  }
}
