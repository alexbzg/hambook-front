import React from "react"
import { useDispatch } from "react-redux"
import { Link, useNavigate } from "react-router-dom"

import { AuthBlock, AuthBlockTitle, FormField } from "../../components"
import { userLogin, userSignUp } from "./authSlice"
//import errorIconImage from "../../assets/img/icons/icon_error.gif"

import { handleSubmit } from "../../utils/forms"
import useAuthenticatedUser from "./useAuthenticatedUser"

import styles from "./LoginPage.module.css"

export default function LoginPage({ ...props }) {
  const [register, setRegister] = React.useState(false)
  const dispatch = useDispatch()
  const { isLoading, isAuthenticated } = useAuthenticatedUser()

  const onSubmit = handleSubmit((data) => dispatch((register ? userSignUp : userLogin)(data)))

  const navigate = useNavigate()
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate("/")
    }
  }, [navigate, isAuthenticated])

//  const UserAgreementErrorIcon = register && errors.confirmUserAgreement &&
//        <img src={errorIconImage} alt="Please confirm user agreement"/>
  const UserAgreement = register && (
        <div className={styles.userAgreement}>
            <FormField
               // preInputContent: UserAgreementErrorIcon,
                type="checkbox"
                name="confirmUserAgreement"
                required
                postInputContent={(
                    <>
                        I agree with <a href="/path/to/agreement">Hambook User Agreement</a>
                    </>
                )}
            />
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
        <form 
            onSubmit={onSubmit} 
            className={styles.loginForm}>
            <FormField
                required
                title="Email"
                note={register && "(requires confirmation)"}
                type="email"
                name="email"
            />
            <FormField
                required
                title="Password"
                note={register && "(8-20 symbols)"}
                type="password"
                name="password"
            />
            {UserAgreement}
            <input 
                type="submit"
                value={register ? "Create new account" : "Login"}
                disabled={isLoading}
            />
        </form>

        <Link to="/password_reset/request" className={styles.passwordReset}>
            Forgot your password? Let's recover it! ;)
        </Link>
    </AuthBlock>
  )
}


