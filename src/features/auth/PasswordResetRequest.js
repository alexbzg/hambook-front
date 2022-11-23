import { useState } from "react"
import { createAsyncThunk } from '@reduxjs/toolkit'

import { useAuthForm, AuthBlock, AuthBlockTitle } from "./useAuthForm"
import client from "../../services/apiClient.js"

const sendRequest = (setLoading) => createAsyncThunk(
	'auth/passwordResetRequest', 
    async ( { email }, { rejectWithValue } ) => {
        setLoading('pending')
        try {
            const data = await client({
                url: `/users/password_reset/request/${email}`,
                method: 'GET', 
                token: 'skip',
                successMessage: 'The message was sent successfully. Please check your inbox.'
            })
            setLoading('fulfilled')
            return data
        } catch (e) {
            setLoading('rejected')
            return rejectWithValue(e)
        }
    }
)


export default function PasswordResetRequest({ ...props }) {
  const [loading, setLoading] = useState('idle')
  const getAction = () => sendRequest(setLoading)
  const {
    AuthFormFields,
    AuthFormSubmit,
    handleSubmit
  } = useAuthForm({ 
      initialFormState: {email: ""}, 
      getAction
  })

  return (
    <AuthBlock>
      <AuthBlockTitle>Password recovery</AuthBlockTitle><br/>
	  <span>
		<b>We'll send you an email with a link.</b><br/>
		Use the link in the message to set your new password.<br/>
		If you don't see the message in your inbox, please check your spam folder.
	  </span><br/><br/>
      {loading !== 'fulfilled' && (
          <form onSubmit={handleSubmit}>
            {AuthFormFields([{
                title: "Your registered email",
                type: "text",
                name: "email"
            }])}
            <AuthFormSubmit
                disabled={loading === 'pending'}
                value="Send"/>
          </form> )}
    </AuthBlock>
  )
}

