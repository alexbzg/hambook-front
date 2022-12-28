import { useState } from "react"

import { AuthBlock, AuthBlockTitle, FormField } from "../../components"

import client from "../../services/apiClient"

import { handleSubmit } from "../../utils/forms"

const sendRequest = (setLoading) => async ({ email }) => {
        setLoading('pending')
        try {
            await client({
                url: `/users/password_reset/request/${email}`,
                method: 'GET', 
                token: 'skip',
                successMessage: 'The message was sent successfully. Please check your inbox.'
            })
            setLoading('fulfilled')
        } catch (e) {
            setLoading('rejected')
        }
    }


export default function PasswordResetRequest({ ...props }) {
  const [loading, setLoading] = useState('idle')

  const passwordResetRequestSubmit = handleSubmit(sendRequest(setLoading))

  return (
    <AuthBlock>
      <AuthBlockTitle>Password recovery</AuthBlockTitle><br/>
	  <span>
		<b>We'll send you an email with a link.</b><br/>
		Use the link in the message to set your new password.<br/>
		If you don't see the message in your inbox, please check your spam folder.
	  </span><br/><br/>
      {loading !== 'fulfilled' && (
          <form onSubmit={passwordResetRequestSubmit}>
            <FormField
                required
                title="Your registered email"
                type="email"
                name="email"
            />
            <input 
                type="submit"
                disabled={loading === 'pending'}
                value="Send"
            />
          </form> )}
    </AuthBlock>
  )
}

