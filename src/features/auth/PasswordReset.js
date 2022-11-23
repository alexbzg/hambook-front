import { useState, useMemo } from "react"
import { createAsyncThunk } from '@reduxjs/toolkit'
import { useLocation } from "react-router-dom"

import { useAuthForm, AuthBlock, AuthBlockTitle } from "./useAuthForm"
import client from "../../services/apiClient.js"

const sendRequest = (setLoading) => createAsyncThunk(
	'auth/passwordReset', 
    async ( password_reset, { rejectWithValue } ) => {
        setLoading('pending')
        try {
            const data = await client({
                url: `/users/password_reset/`,
                method: 'POST', 
                token: 'skip',
                args: { password_reset },
                successMessage: 'Your password was reset successfully. You can login with your new password.'
            })
            setLoading('fulfilled')
            return data
        } catch (e) {
            setLoading('rejected')
            return rejectWithValue(e)
        }
    }
)


export default function PasswordReset({ ...props }) {
  const [loading, setLoading] = useState('idle')
  const getAction = () => sendRequest(setLoading)

  const { search } = useLocation()
  const token = useMemo(() => {
      const params = new URLSearchParams(search)
      return params.get('token')
  }, [search])

  const {
    AuthFormFields,
    AuthFormSubmit,
	handleSubmit,
  } = useAuthForm({ 
      initialFormState: { password: "", token }, 
      getAction, 
  })

  return (
    <AuthBlock>
      <AuthBlockTitle>Password recovery</AuthBlockTitle><br/>
      {loading !== 'fulfilled' && (
          <form onSubmit={handleSubmit}>
            {AuthFormFields([{
                title: "Your new password",
                type: "password",
                name: "password",
			    note: "(8-20 symbols)"
            }])}
            <AuthFormSubmit
                value="Send"/>
          </form> )}
    </AuthBlock>
  )
}

