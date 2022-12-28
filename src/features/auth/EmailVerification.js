import { useState } from "react"

import { AuthBlock, AuthBlockTitle } from "../../components"
import { useAuthenticatedUser } from "./useAuthenticatedUser"
import { handleSubmit } from "../../utils/forms"

import client from "../../services/apiClient"

const sendRequest = ({ setLoading, token }) => async () => {
        setLoading('pending')
        try {
            await client({
                url: `/users/email_verification/request`,
                method: 'GET', 
                token,
                successMessage: 'The message was sent again. Please check your inbox.'
            })
            setLoading('fulfilled')
        } catch (e) {
            setLoading('rejected')
        }
    }

export default function EmailVerification({ ...props }) {
  const [loading, setLoading] = useState('idle')
  
  const { user, token } = useAuthenticatedUser()
  if (user.email_verified) return null

  const emailVerificationSubmit = handleSubmit(sendRequest({ setLoading, token }))

  return (
        <AuthBlock>
            <AuthBlockTitle>Email verification</AuthBlockTitle><br/>
            <span>
                <b>We already sent you an email with the verification link.</b><br/>
                Use the link in the message to verify your email.<br/>
                If you don't see it in your inbox, please check your spam folder.
            </span><br/>
              <form onSubmit={emailVerificationSubmit}>
                <input 
                    type="submit" 
                    disabled={loading === 'pending'}
                    value="Send the message once more"
                />
            </form>
        </AuthBlock>
  )
}

