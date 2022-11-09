import React from "react"
import styled from "styled-components"
import { Link } from "react-router-dom"

import LoginForm from "./LoginForm/LoginForm"
import { AuthPageWrapper, AuthPageTitle } from "../../components"

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

export default function LoginPage({...props}) {
  const [register, setRegister] = React.useState(false)
  return (
    <AuthPageWrapper>
		<AuthPageTitle
			inactive={register} 
			onClick={() => setRegister(false)}
			>
			Login
		</AuthPageTitle>
		<AuthPageTitle 
			inactive={!register}
			onClick={() => setRegister(true)}>
			Register
		</AuthPageTitle>
		<LoginForm register={register}/>
        <PasswordResetLink to="/password_reset/request">
            Forgot your password? Let's recover it! ;)
        </PasswordResetLink>
    </AuthPageWrapper>
  )
}




