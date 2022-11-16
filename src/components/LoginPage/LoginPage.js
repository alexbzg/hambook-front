import React from "react"
import styled from "styled-components"
import { Link } from "react-router-dom"
import { connect } from "react-redux"
import { useNavigate } from "react-router-dom"

import { useAuthForm, AuthBlock, AuthBlockTitle, AuthForm } from "../../hooks/ui/useAuthForm"
import { extractErrorMessages } from "../../utils/errors"
import { Actions as authActions } from "../../redux/auth"
import errorIconImage from "../../assets/img/icons/icon_error.gif"

import styles from "../../hooks/ui/AuthBlock.module.css"

const PasswordResetLink = styled(Link)`
	margin-top: 30px;
	color: var(--grey);
	font-style: italic;
	font-size: 14px;
	text-decoration: underline;
	cursor: pointer;

    &:hover{
	    color: var(--purple);
    }
`
const LoginFormUserAgreementWrapper = styled.div`
    padding-left: 0px;
    text-align: center;
`

function LoginPage({ requestUserLogin, registerNewUser }) {
  const [register, setRegister] = React.useState(false)

  const getAction = () => register ? registerNewUser : requestUserLogin
  const getActionArgs = ({form}) => ({ email: form.email, password: form.password })
  const {
    user,
    error,
    isAuthenticated,
	errors,
    setForm,
    setErrors,
    //AuthForm,
    AuthFormFields,
    AuthFormSubmit,
    AuthResultDisplay,
    setHasSubmitted,
    isLoading,
    submitRequested,
    setSubmitRequested,
    setRequestResult,
    setRequestErrors,
    hasSubmitted,
	handleSubmit,
  } = useAuthForm({ initialFormState: {email: "", password: ""}, getAction, getActionArgs })

  React.useEffect(() => {
    setForm((form) => {
        if (register)
            return {...form, confirmUserAgreement: false}
        else {
            const { confirmUserAgreement, ...rest } = form
            return rest
        }
    })
    setErrors({})
    setHasSubmitted(false)
    setSubmitRequested(false)
  }, [register])


  const navigate = useNavigate()
  React.useEffect(() => {
    if (user?.email && isAuthenticated) {
      navigate("/")
    }
    if (hasSubmitted && !isLoading && error) {
      setRequestResult(false)
      setRequestErrors(extractErrorMessages(error))
    }
  }, [user, navigate, isAuthenticated])

  const UserAgreementErrorIcon = register && errors.confirmUserAgreement &&
        <img src={errorIconImage} alt="Please confirm user agreement"/>
  const UserAgreement = register && (
        <LoginFormUserAgreementWrapper>
            {AuthFormFields([{
                preInputContent: UserAgreementErrorIcon,
                type: "checkbox",
                name: "confirmUserAgreement",
                postInputContent: (
                    <>
                        I agree with <a href="/path/to/agreement">Hambook User Agreement</a>
                    </>
                )
            }])}
        </LoginFormUserAgreementWrapper>
  )

  return (
    <AuthBlock>
		<AuthBlockTitle
			inactive={register}
			onClick={() => setRegister(false)}
			>
			Login
		</AuthBlockTitle>
		<AuthBlockTitle
			inactive={!register}
			onClick={() => setRegister(true)}>
			Register
		</AuthBlockTitle>
        <AuthResultDisplay/>
        <form onSubmit={handleSubmit}>
            {AuthFormFields([{
                    title: "Email",
                    note: register && "(requires confirmation)",
                    type: "text",
                    name: "email"
                }, {
                    title: "Password",
                    note: register && "(8-20 symbols)",
                    type: "password",
                    name: "password",
                }])
            }
            {UserAgreement}
            <AuthFormSubmit
                value={register ? "Create new account" : "Login"}/>
        </form>

        <PasswordResetLink to="/password_reset/request">
            Forgot your password? Let's recover it! ;)
        </PasswordResetLink>
    </AuthBlock>
  )
}


export default connect(null, {
    registerNewUser: authActions.registerNewUser,
    requestUserLogin: authActions.requestUserLogin
})(LoginPage)

