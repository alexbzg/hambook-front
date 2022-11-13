import React from "react"
import { connect } from "react-redux"

import { 
	AuthPageWrapper, 
	AuthPageTitle, 
	AuthForm, 
	AuthPageSubmit,
	AuthPageResponseOK,
	AuthPageResponseError } from "../../components"
import { useAuthForm } from "../../hooks/ui/useAuthForm"
import { extractErrorMessages } from "../../utils/errors"
import { Actions as authActions, REQUEST_PASSWORD_RESET_MESSAGE_SUCCESS } from "../../redux/auth"

function PasswordResetRequestMessage({ requestPasswordResetMessage }) {
  const getAction = () => requestPasswordResetMessage
  const getActionArgs = ({form, setRequestResult, setRequestErrors}) => ({
	email: form.email,
    callback: (res) => {
	  setRequestResult(res.type === REQUEST_PASSWORD_RESET_MESSAGE_SUCCESS)
      setRequestErrors(res.error ? extractErrorMessages(res.error.data) : [])
    }
  })
  const {
    AuthFormFields,
	requestResult,
	requestErrors,
    isLoading,
	handleSubmit
  } = useAuthForm({ initialFormState: {email: ""}, getAction, getActionArgs })

  return (
    <AuthPageWrapper>
      <AuthPageTitle>Password recovery</AuthPageTitle><br/>
	  <span>
		<b>We'll send you an email with a link.</b><br/>
		Use the link in the message to set your new password.<br/>
		If you don't see the message in your inbox, please check your spam folder.
	  </span><br/><br/>
      {requestResult === true && (
		  <AuthPageResponseOK>
			The message was sent successfully. Please check your inbox.
		  </AuthPageResponseOK>)}
	  {requestResult === false && (
		  <AuthPageResponseError>
			{requestErrors.map((error, index) => <span key={index}>{error}<br/></span>)}
		  </AuthPageResponseError>
	  )}
      {requestResult !== true && (
          <AuthForm onSubmit={handleSubmit}>
            {AuthFormFields([{
                title: "Your registered email",
                type: "text",
                name: "email"
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
    requestPasswordResetMessage: authActions.requestPasswordResetMessage
})(PasswordResetRequestMessage)
