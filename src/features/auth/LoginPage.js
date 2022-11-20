import React from "react"
import { Link } from "react-router-dom"
import { useNavigate } from "react-router-dom"

import { useAuthForm, AuthBlock, AuthBlockTitle } from "./useAuthForm"
import { extractErrorMessages } from "../../utils/errors"
import { userLogin } from "./authSlice"
import errorIconImage from "../../assets/img/icons/icon_error.gif"

import styles from "./LoginPage.module.css"

export default function LoginPage({ ...props }) {
  const [register, setRegister] = React.useState(false)

  const getAction = () => register ? null : userLogin
  const getActionArgs = ({form}) => ({ email: form.email, password: form.password })
  const {
    user,
    error,
    isAuthenticated,
	errors,
    setForm,
    setErrors,
    AuthFormFields,
    AuthFormSubmit,
    setHasSubmitted,
    isLoading,
    setSubmitRequested,
    setRequestResult,
    setRequestErrors,
    hasSubmitted,
	handleSubmit,
  } = useAuthForm({ 
      initialFormState: {email: "", password: ""}, 
      getAction, 
      getActionArgs,
  })

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
  }, [user, navigate, isAuthenticated, isLoading, hasSubmitted, error])

  const UserAgreementErrorIcon = register && errors.confirmUserAgreement &&
        <img src={errorIconImage} alt="Please confirm user agreement"/>
  const UserAgreement = register && (
        <div className={styles.userAgreement}>
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
        </div>
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
        <form onSubmit={handleSubmit} className={styles.loginForm}>
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

        <Link to="/password_reset/request" className={styles.passwordReset}>
            Forgot your password? Let's recover it! ;)
        </Link>
    </AuthBlock>
  )
}


