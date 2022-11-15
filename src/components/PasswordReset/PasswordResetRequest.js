import React from "react"
import { connect } from "react-redux"

import { useAuthForm, AuthBlock, AuthBlockTitle } from "../../hooks/ui/useAuthForm"
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
    AuthFormSubmit,
    AuthResultDisplay,
	requestResult,
	handleSubmit
  } = useAuthForm({ initialFormState: {email: ""}, getAction, getActionArgs })

  return (
    <AuthBlock>
      <AuthBlockTitle>Password recovery</AuthBlockTitle><br/>
	  <span>
		<b>We'll send you an email with a link.</b><br/>
		Use the link in the message to set your new password.<br/>
		If you don't see the message in your inbox, please check your spam folder.
	  </span><br/><br/>
      {AuthResultDisplay(`The message was sent successfully. Please check your inbox.`)}
      {requestResult !== true && (
          <form onSubmit={handleSubmit}>
            {AuthFormFields([{
                title: "Your registered email",
                type: "text",
                name: "email"
            }])}
            <AuthFormSubmit
                value="Send"/>
          </form> )}
    </AuthBlock>
  )
}

export default connect(null, {
    requestPasswordResetMessage: authActions.requestPasswordResetMessage
})(PasswordResetRequestMessage)
