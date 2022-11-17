import React from "react"
import { connect } from "react-redux"
import { useLocation } from "react-router-dom"

import { useAuthForm, AuthBlock, AuthBlockTitle } from "../../hooks/ui/useAuthForm"
import { extractErrorMessages } from "../../utils/errors"
import { Actions as authActions, REQUEST_PASSWORD_RESET_SUCCESS } from "../../redux/auth"


function PasswordResetRequest({ requestPasswordReset }) {
  const { search } = useLocation()
  const token = React.useMemo(() => {
      const params = new URLSearchParams(search)
      return params.get('token')
  }, [search])

  const getAction = () => requestPasswordReset
  const getActionArgs = ({form, setRequestResult, setRequestErrors}) => ({
	password: form.password,
    token,
    callback: (res) => {
	  setRequestResult(res.type === REQUEST_PASSWORD_RESET_SUCCESS)
      setRequestErrors(res.error ? extractErrorMessages(res.error.data) : [])
    }
  })
  const {
    AuthFormFields,
    AuthFormSubmit,
    requestResult,
	handleSubmit,
  } = useAuthForm({ 
      initialFormState: {password: ""}, 
      getAction, 
      getActionArgs,
      successMessage: ` Your password was changed. Now you can login with your new password.`
  })

  return (
    <AuthBlock>
      <AuthBlockTitle>Password recovery</AuthBlockTitle><br/>
      {requestResult !== true && (
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

export default connect(null, {
    requestPasswordReset: authActions.requestPasswordReset
})(PasswordResetRequest)
