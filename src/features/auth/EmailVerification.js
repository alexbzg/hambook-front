import { useState } from "react"
import { createAsyncThunk } from '@reduxjs/toolkit'

import { useAuthForm, AuthBlock, AuthBlockTitle } from "./useAuthForm"
import client from "../../services/apiClient.js"

const sendRequest = (setLoading) => createAsyncThunk(
	'auth/emailVerificationRequest', 
    async ( password_reset, { getState, rejectWithValue } ) => {
        setLoading('pending')
        try {
            const data = await client({
                url: `/users/email_verification/request`,
                method: 'GET', 
                getState,
                successMessage: 'The was sent again. Please check your inbox.'
            })
            setLoading('fulfilled')
            return data
        } catch (e) {
            setLoading('rejected')
            return rejectWithValue(e)
        }
    }
)

export default function EmailVerification({ ...props }) {
  const [loading, setLoading] = useState('idle')
  const getAction = () => sendRequest(setLoading)

  const {
    user,
    AuthFormSubmit,
    handleSubmit
  } = useAuthForm({ 
      initialFormState: {}, 
      getAction, 
  })
  if (user.email_verified) return null

  return (
        <AuthBlock>
            <AuthBlockTitle>Email verification</AuthBlockTitle><br/>
            <span>
                <b>We already sent you an email with the verification link.</b><br/>
                Use the link in the message to verify your email.<br/>
                If you don't see it in your inbox, please check your spam folder.
            </span><br/>
              <form onSubmit={handleSubmit}>
                <AuthFormSubmit disabled={loading === 'pending'}
                    value="Send the message once more"/>
            </form>
        </AuthBlock>
  )
}

