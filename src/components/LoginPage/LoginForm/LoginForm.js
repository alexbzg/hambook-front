import React from "react"
import styled from "styled-components"
import { connect } from "react-redux"
import { useNavigate } from "react-router-dom"

import { AuthForm, AuthPageSubmit, AuthPageField } from "../../../components"
import validation from "../../../utils/validation"
import { extractErrorMessages } from "../../../utils/errors"
import { Actions as authActions } from "../../../redux/auth"
import errorIconImage from "../../../assets/img/icons/icon_error.gif"

const LoginFormUserAgreementWrapper = styled.div`
    padding-left: 50px;
`
const LoginFormUserAgreementCheckbox = styled.input`
    width: 30px;
`


function LoginForm({ user, authError, isLoading, isAuthenticated, requestUserLogin, registerUser, ...props }) {

  const navigate = useNavigate()

  const [form, setForm] = React.useState({
    email: "",
    password: "",
  })
  React.useEffect(() => {
    setForm((form) => {
        if (props.register)
            return {...form, confirmUserAgreement: false}
        else {
            const { confirmUserAgreement, ...rest } = form
            return rest
        }
    })
    setErrors({})
    setHasSubmitted(false)
  }, [props.register])

  const [errors, setErrors] = React.useState({})
  const [hasSubmitted, setHasSubmitted] = React.useState(false)

  React.useEffect(() => {
    if (user?.email && isAuthenticated) {
      navigate("/")
    }
  }, [user, navigate, isAuthenticated])

  const validateInput = (label, value) => {
    const isValid = validation?.[label] ? validation?.[label]?.(value) : true
    setErrors((errors) => ({ ...errors, [label]: !isValid }))
  }

  const handleInputChange = (label, value) => {
    validateInput(label, value)
    setForm((form) => ({ ...form, [label]: value }))
  }

  const authErrorList = extractErrorMessages(authError)     

  const handleSubmit = async (e) => {
    setErrors({})
    e.preventDefault()
    Object.keys(form).forEach((label) => validateInput(label, form[label]))
    if (!Object.keys(form).every((value) => !Boolean(errors[value]))) {
      return
    }
    if (!Object.values(form).every((value) => Boolean(value))) {
   //   setErrors((errors) => ({ ...errors, form: `You must fill out all fields.` }))
      return
    }
    setHasSubmitted(true)
    await (props.register ? registerUser : requestUserLogin)(
        { email: form.email, password: form.password })
  }

  const getFormErrors = () => {
    const formErrors = []
    if (hasSubmitted && authErrorList.length && !isLoading) {
      formErrors.push(...authErrorList)
    }
    if (errors.form) {
      formErrors.push(errors.form)
    }
    return formErrors
  }
  const FormErrors = getFormErrors().map((entry, index) => 
	<span key={index}>{entry}</span>
  )

  const UserAgreementErrorIcon = errors.confirmUserAgreement ? 
        <img src={errorIconImage} alt="Please confirm user agreement"/> : ''

  const ConfirmUserAgreement = props.register ?
        <LoginFormUserAgreementWrapper>
            {UserAgreementErrorIcon}
            <LoginFormUserAgreementCheckbox 
                type="checkbox"
                onChange={(e) => handleInputChange(e.target.name, e.target.checked)}
                name="confirmUserAgreement"/>
            I agree with <a href="/path/to/agrrement">Hambook User Agreement</a>
        </LoginFormUserAgreementWrapper> : ''

  return (
    <AuthForm onSubmit={handleSubmit}>
		<AuthPageField
			title="Email"
			note="(requires confirmation)"
			type="text" 
			name="email"
			invalid={Boolean(errors.email)}
			onChange={handleInputChange}/>
		<AuthPageField
			title="Password"
			note="(8-20 symbols)"
			type="password" 
			name="password"
			invalid={Boolean(errors.password)}
			onChange={handleInputChange}/>
        {ConfirmUserAgreement}
        {FormErrors}
        <AuthPageSubmit
            type="submit"
            name="submit"
            disabled={isLoading}
            value={props.register ? "Create new account" : "Login"}/>
    </AuthForm>
  )
}

const mapStateToProps = (state) => ({
  authError: state.auth.error,
  isLoading: state.auth.isLoading,
  isAuthenticated: state.auth.isAuthenticated,
  user: state.auth.user,
})
const mapDispatchToProps = (dispatch) => ({
  requestUserLogin: ({ email, password }) => dispatch(authActions.requestUserLogin({ email, password })),
  registerUser:({ email, password }) => dispatch(authActions.registerNewUser({ email, password }))
})
export default connect(mapStateToProps, mapDispatchToProps)(LoginForm)
