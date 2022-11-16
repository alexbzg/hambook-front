import React from "react"
import { connect } from "react-redux"

import { Actions as authActions, REQUEST_EMAIL_VERIFICATION_SUCCESS } from "../../redux/auth"
import { useAuthForm, AuthBlock, AuthBlockTitle } from "../../hooks/ui/useAuthForm"

function EmailVerification({ isLoading, requestEmailVerification }) {
  const getAction = () => requestEmailVerification
  const getActionArgs = ({ setRequestResult, setRequestErrors }) => (res) => {
	  setRequestResult(res.type === REQUEST_EMAIL_VERIFICATION_SUCCESS)
      setRequestErrors(res.error ? ['There was an unexpected error. Please contact support.'] : [])
    }
  const {
    AuthFormSubmit,
    AuthResultDisplay,
  } = useAuthForm({ initialFormState: {email: ""}, getAction, getActionArgs })

    return (
        <AuthBlock>
            <AuthBlockTitle>Email verification</AuthBlockTitle><br/>
            <span>
                <b>We already sent you an email with the verification link.</b><br/>
                Use the link in the message to verify your email.<br/>
                If you don't see it in your inbox, please check your spam folder.
            </span><br/>
            {AuthResultDisplay(`Repeat message was sent successfully. Please check your inbox.`)}
            <form>
                <AuthFormSubmit
                    value="Send the message once more"/>
            </form>
        </AuthBlock>
    )
}

const mapStateToProps = (state) => ({
  user: state.auth.user,
})
const mapDispatchToProps = (dispatch) => ({
  requestEmailVerification: (callback) => dispatch(authActions.requestEmailVerification(callback))
})

export default connect(mapStateToProps, mapDispatchToProps)(  
    ({user, requestEmailVerification}) => {
        if (user.email_verified) {
            return ''
        }
        else {
            return EmailVerification({requestEmailVerification})
        }
    })
