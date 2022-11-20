import axios from "axios"
import { formatURL } from "../utils/urls"

const client = async ({
	url, 
	method, 
    token,
	args, 
	params, 
    headers,
    getState,
    rejectWithValue }) => {
    try {
      // get user data from store
      const { auth } = getState()
      const urlPath = formatURL(url, params)

      // configure authorization header with user's token
      token = token || auth.token
      if (token) {
        headers = { Authorization: `Bearer ${token}`, ...headers }
      }

      const { data } = await axios({
		method,
        headers,
		url: urlPath, 
		data: args })
      return data
    } catch (error) {
	  let rejectValue = error.message
      if (error.response && error.response.data.message) {
        rejectValue = error.response.data.message
      } 
      return rejectWithValue(rejectValue)
    }
  }    

export default client
