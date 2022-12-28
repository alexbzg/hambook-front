import { useState, useMemo } from "react"
import { useLocation } from "react-router-dom"

import { AuthBlock, AuthBlockTitle, FormField } from "../../components"

import client from "../../services/apiClient"

import { handleSubmit } from "../../utils/forms"

const sendRequest = ({ setLoading, token }) => async ({ password }) => {
        const password_reset = { password, token }
        setLoading('pending')
        try {
            await client({
                url: `/users/password_reset/`,
                method: 'POST', 
                token: 'skip',
                args: { password_reset },
                successMessage: 'Your password was reset successfully. You can login with your new password.'
            })
            setLoading('fulfilled')
        } catch (e) {
            setLoading('rejected')
        }
    }


export default function PasswordReset({ ...props }) {
  const [loading, setLoading] = useState('idle')

  const { search } = useLocation()
  const token = useMemo(() => {
      const params = new URLSearchParams(search)
      return params.get('token')
  }, [search])

  return (
    <AuthBlock>
      <AuthBlockTitle>Password recovery</AuthBlockTitle><br/>
      {loading !== 'fulfilled' && (
          <form onSubmit={handleSubmit(sendRequest({ setLoading, token}))}>
            <FormField
                required
                title="Your new password"
                type="password"
                name="password"
			    note="(8-20 symbols)"
            />
            <input 
                type="submit"
                disabled={loading === 'pending'}
                value="Send"/>
          </form> )}
    </AuthBlock>
  )
}

