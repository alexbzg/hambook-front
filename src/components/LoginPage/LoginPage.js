import React from "react"
import LoginForm from "./LoginForm/LoginForm"
import { AuthPageWrapper, AuthPageTitle } from "../../components"

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
    </AuthPageWrapper>
  )
}




