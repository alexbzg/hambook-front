import React from "react"
import { connect } from "react-redux"

import styles from './Profile.module.css'

import {
	AuthPageWrapper,
	AuthPageSubmit,
	AuthPageResponseError,
	AuthPageResponseOK,
    EmailVerification } from "../../components"
import { useAuthenticatedUser } from "../../hooks/auth/useAuthenticatedUser"
import { useAuthForm } from "../../hooks/ui/useAuthForm"
import { extractErrorMessages } from "../../utils/errors"
import { Actions as authActions } from "../../redux/auth"

function ProfilePage({ updateUserProfile }) {
  const { user, error, isLoading } = useAuthenticatedUser()
  const getAction = () => updateUserProfile
  const getActionArgs = ({form}) => form
  const { created_at, updated_at, user_id, ...initialFormState } = user.profile
  const { AuthFormFields, hasSubmitted, handleSubmit } = useAuthForm({
      initialFormState, 
      getAction, 
      getActionArgs
  })

  const authErrorList = extractErrorMessages(error)
  const FormErrors = authErrorList.map((entry, index) =>
	<span key={index}>{entry}<br/></span>
  )

  return (
    <AuthPageWrapper>
        <EmailVerification/>
        {error && hasSubmitted &&
            <AuthPageResponseError>{FormErrors}</AuthPageResponseError>}
        {!error && !isLoading && hasSubmitted &&
            <AuthPageResponseOK>Your profile was updated succefully.</AuthPageResponseOK>}
        <form
            className={styles.form}
            onSubmit={handleSubmit}>
            <div className={styles.columnsWrapper}>
                <div className={styles.column1}>
                    <div className={styles.mainPhoto}>
                        <img
                            src="/static/media/user.f1aa36f6a626a24cfd4b.jpg"
                            alt="Avatar"
                        />
                    </div>
                    <span className={styles.email}>{user.email}</span>
                    {AuthFormFields([
                        {
                            name: 'phone',
                            defaultValue: user.profile.phone,
                            title: "phone",
                            note: '(format: +12345678901)',
                            type: "text",
                        },
                        {
                            name: 'address',
                            defaultValue: user.profile.address,
                            title: "home address",
                            type: "textarea",
                        }
                    ])}
                </div>
                <div className={styles.column2}>
                    {AuthFormFields([
                        {
                            name: 'current_callsign',
                            defaultValue: user.profile.current_callsign,
                            inputClass: 'callsign',
                            title: "callsign",
                            type: "text",
                        },
                        {
                            name: 'prev_callsigns',
                            defaultValue: user.profile.prev_callsigns,
                            title: "ex-callsigns",
                            type: "textarea",
                        },
                        {
                            name: 'full_name',
                            defaultValue: user.profile.full_name,
                            title: "Your full name",
                            type: "text",
                        }
                    ])}
                    <div className={styles.photos}>
                        <span>img</span><span>img</span><span>img</span><span>+ Add img</span>
                    </div>
                    {AuthFormFields([
                        {
                            name: 'bio',
                            defaultValue: user.profile.bio,
                            title: "About yourself",
                            type: "textarea",
                        }
                    ])}
                </div>
            </div>
            <AuthPageSubmit
                type="submit"
                name="submit"
                disabled={isLoading}
                value="Save changes"/>
        </form>
    </AuthPageWrapper>
    )
}
export default connect(null, {
    updateUserProfile: authActions.updateUserProfile
})(ProfilePage)
