import React from "react"
import styled from "styled-components"
import { connect } from "react-redux"
import { useNavigate } from "react-router-dom"

import LoginFormField from "./LoginFormField"
import validation from "../../../utils/validation"
import { Actions as authActions,  FETCHING_USER_FROM_TOKEN_SUCCESS } from "../../../redux/auth"

const LoginFormWrapper = styled.form`
	width: 300px;
	margin: 0 auto;
	text-align: left;
`
const LoginFormSubmit = styled.input`
	display: block;
	width: auto;
    margin: 20px auto;
    background-color: var(--orange);
    color: var(--black);
    cursor: pointer;
    font-weight: bold;
`

function LoginForm({ user, authError, isLoading, isAuthenticated, requestUserLogin, registerUser, ...props }) {

  const navigate = useNavigate()
  const [form, setForm] = React.useState({
    email: "",
    password: ""
  })
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    Object.keys(form).forEach((label) => validateInput(label, form[label]))
    if (!Object.values(form).every((value) => Boolean(value))) {
      setErrors((errors) => ({ ...errors, form: `You must fill out all fields.` }))
      return
    }
    setHasSubmitted(true)
    const action = await (props.register ? registerUser : requestUserLogin)(
        { email: form.email, password: form.password })
    if (action.type !== FETCHING_USER_FROM_TOKEN_SUCCESS) setForm(form => ({ ...form, password: "" }))    
  }

  const getFormErrors = () => {
    const formErrors = []
    if (authError && hasSubmitted && !isLoading) {
      formErrors.push(`Invalid email/password. Please try again.`)
    }
    if (errors.form) {
      formErrors.push(errors.form)
    }
    return formErrors
  }
  const FormErrors = getFormErrors().map((entry, index) => 
	<span key={index}>{entry}</span>
  )

  return (
    <LoginFormWrapper onSubmit={handleSubmit}>
		<LoginFormField
			title="Email"
			note="(requires confirmation)"
			type="text" 
			name="email"
			invalid={Boolean(errors.email)}
			onChange={handleInputChange}/>
		<LoginFormField
			title="Password"
			note="(8-20 symbols)"
			type="password" 
			name="password"
			invalid={Boolean(errors.password)}
			onChange={handleInputChange}/>
        {FormErrors}
        <LoginFormSubmit
            type="submit"
            name="submit"
            disabled={isLoading}
            value={props.register ? "Create new account" : "Login"}/>
    </LoginFormWrapper>
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
