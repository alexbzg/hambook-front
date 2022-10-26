import React from "react"
import styled from "styled-components"
import LoginFormField from "./LoginFormField"

const LoginFormWrapper = styled.form`
	width: 300px;
	margin: 0 auto;
	text-align: left;
`
/*
const LoginFormSubmit = styled.input`
	display: block;
	width: auto;
    margin: 20px auto;
    background-color: var(--orange);
    color: var(--black);
    cursor: pointer;
`
*/
export default function LoginForm({
  requestUserLogin = async ({ email, password }) =>
    console.log(`Logging in with ${email} and ${password}.`)
}) {
  const [form, setForm] = React.useState({
    email: "",
    password: ""
  })

  const handleInputChange = (label, value) => {
    setForm((form) => ({ ...form, [label]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    await requestUserLogin({ email: form.email, password: form.password })
  }

  return (
    <LoginFormWrapper onSubmit={handleSubmit}>
		<LoginFormField
			title="Email"
			note="(requires confirmation)"
			type="text" 
			name="email"
			onChange={handleInputChange}/>
    </LoginFormWrapper>
  )
}


