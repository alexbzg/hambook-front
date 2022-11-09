import React from "react"
import { connect } from "react-redux"
//import styled from "styled-components"
import { Actions as authActions, 
    REQUEST_EMAIL_VERIFICATION_SUCCESS, 
    REQUEST_EMAIL_VERIFICATION_FAILURE } from "../../redux/auth"
import { AuthPageWrapper, AuthPageTitle, AuthForm, AuthPageSubmit } from "../../components"

function EmailVerification({ user, isLoading, requestEmailVerification }) {
    const [requestResult, setRequestResult] = React.useState(null)

    const handleSubmit = async (e) => {
      e.preventDefault()
      await requestEmailVerification((res) => setRequestResult(res.type))
    }

    const VerificationForm = () => {
        switch(requestResult) {
          case REQUEST_EMAIL_VERIFICATION_SUCCESS:
            return (
                <span><br/>Repeat message was sent successfully. Please check your inbox.</span>
            )
        case REQUEST_EMAIL_VERIFICATION_FAILURE:
            return (
                <span><br/>There was an unexpected error. Please contact support.</span>
            )
        default:        
            return (
                <AuthForm onSubmit={handleSubmit}>
                    <AuthPageSubmit
                        type="submit"
                        name="submit"
                        disabled={isLoading}
                        value="Send the message once more"/>
                </AuthForm>
            )
        }
    }

    return (
        <AuthPageWrapper>
            <AuthPageTitle>Email verification</AuthPageTitle><br/>
            <span>
                <b>We already sent you an email with the verification link.</b><br/>
                Use the link in the message to verify your email.<br/>
                If you don't see it in your inbox, please check your spam folder.
            </span><br/>
            <VerificationForm/>
        </AuthPageWrapper>
    )
}

const mapStateToProps = (state) => ({
  isLoading: state.auth.isLoading,
  user: state.auth.user,
})
const mapDispatchToProps = (dispatch) => ({
  requestEmailVerification: (callback) => dispatch(authActions.requestEmailVerification(callback))
})

export default connect(mapStateToProps, mapDispatchToProps)(  
    ({user, isLoading, requestEmailVerification}) => {
        if (user.email_verified) {
            return ''
        }
        else {
            return EmailVerification({user, isLoading, requestEmailVerification})
        }
    })
