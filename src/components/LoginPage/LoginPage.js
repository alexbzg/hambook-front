import React from "react"
import styled from "styled-components"
import LoginForm from "./LoginForm/LoginForm"

const LoginPageWrapper = styled.div`
	padding: 30px 50px 30px 50px;
	text-align: center;
	background-color: #fff;
	border: 1px solid #ddd;
	border-radius: 5px;
	position: relative;
	margin-top: 70px;
`
const LoginTypeSwitch = styled.span`
	display: inline-block;
	padding: 5px 20px;
	margin: 0 10px 30px 10px;
	font-size: 18px;
	font-weight: bold;
	line-height: 18px;
	color: var(--purple);

    ${({ active }) => !active && `
		cursor: pointer;
		font-weight: normal;
		text-decoration: underline;
		color: var(--grey);
    `}
`

export default function LoginPage({...props}) {
  const [register, setRegister] = React.useState(false)
  return (
    <LoginPageWrapper>
		<LoginTypeSwitch 
			active={!register} 
			onClick={() => setRegister(false)}
			>
			Login
		</LoginTypeSwitch>
		<LoginTypeSwitch 
			active={register}
			onClick={() => setRegister(true)}>
			Register
		</LoginTypeSwitch>
		<LoginForm register={register}/>
    </LoginPageWrapper>
  )
}




