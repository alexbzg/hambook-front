import React from "react"
import styled from "styled-components"
import LoginFormField from "./LoginFormField"
import validation from "../../../utils/validation"

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

export default function LoginForm({
  requestUserLogin = async ({ email, password }) =>
    console.log(`Logging in with ${email} and ${password}.`),
  ...props
}) {

  const [form, setForm] = React.useState({
    email: "",
    password: ""
  })

  const [errors, setErrors] = React.useState({})

  const validateInput = (label, value) => {
    // grab validation function and run it on input if it exists
    // if it doesn't exists, just assume the input is valid
    const isValid = validation?.[label] ? validation?.[label]?.(value) : true
    // set an error if the validation function did NOT return true
    setErrors((errors) => ({ ...errors, [label]: !isValid }))
  }

  const handleInputChange = (label, value) => {
    validateInput(label, value)
    setForm((form) => ({ ...form, [label]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    // validate inputs before submitting
    Object.keys(form).forEach((label) => validateInput(label, form[label]))
    // if any input hasn't been entered in, return early
    if (!Object.values(form).every((value) => Boolean(value))) {
      setErrors((errors) => ({ ...errors, form: `You must fill out all fields.` }))
      return
    }
    await requestUserLogin({ email: form.email, password: form.password })
  }

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
        <LoginFormSubmit
            type="submit"
            name="submit"
            value={props.register ? "Create new account" : "Login"}/>
    </LoginFormWrapper>
  )
}


