import React from "react"
import { connect } from "react-redux"
import { useLocation } from "react-router-dom"

import { 
	AuthPageWrapper, 
	AuthPageTitle, 
	AuthForm, 
	AuthPageSubmit,
	AuthPageResponseOK,
	AuthPageResponseError } from "../../components"
import { useAuthForm } from "../../hooks/ui/useAuthForm"
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
	errors,
	requestResult,
	requestErrors,
    isLoading,
	submitRequested,
    handleInputChange,
	handleSubmit
  } = useAuthForm({ initialFormState: {password: ""}, getAction, getActionArgs })

  return (
    <AuthPageWrapper>
      <AuthPageTitle>Password recovery</AuthPageTitle><br/>
      {requestResult === true && (
		  <AuthPageResponseOK>
            Your password was changed. Now you can login with your new password.
		  </AuthPageResponseOK>)}
	  {requestResult === false && (
		  <AuthPageResponseError>
			{requestErrors.map((error, index) => <span key={index}>{error}<br/></span>)}
		  </AuthPageResponseError>
	  )}
      {requestResult !== true && (
          <AuthForm onSubmit={handleSubmit}>
            {AuthFormFields([{
                title: "Your new password",
                type: "password",
                name: "password",
			    note: "(8-20 symbols)"
            }])}
            <AuthPageSubmit
                type="submit"
                name="submit"
                disabled={isLoading}
                value="Send"/>
          </AuthForm> )}
    </AuthPageWrapper>
  )
}

export default connect(null, {
    requestPasswordReset: authActions.requestPasswordReset
})(PasswordResetRequest)
