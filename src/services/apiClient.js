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
      if (successMessage) {
        showToast(successMessage, 'success')
      }
      return data
    } catch (error) {
	  let rejectValue = error.message
      if (error.response?.data?.detail) {
        rejectValue = error.response.data.detail
      } 
     /* showToast( 
		extractErrorMessages(rejectValue).map(
            (error, index) => <span key={index}>{error}<br/></span>),
          'error')*/
      throw rejectValue
    }
  }    

export default client
