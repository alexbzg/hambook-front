import React from "react"
import { connect } from "react-redux"

import styles from './Profile.module.css'

import { EmailVerification } from "../../components"
import { useAuthenticatedUser } from "../../hooks/auth/useAuthenticatedUser"
import { AuthBlock, useAuthForm } from "../../hooks/ui/useAuthForm"
import { extractErrorMessages } from "../../utils/errors"
import { Actions as authActions } from "../../redux/auth"

function ProfilePage({ updateUserProfile }) {
  const { user, error, isLoading } = useAuthenticatedUser()
  const getAction = () => updateUserProfile
  const getActionArgs = ({form}) => form
  const { created_at, updated_at, user_id, ...initialFormState } = user.profile
  const { 
      AuthForm, 
      AuthFormFields, 
      AuthFormSubmit, 
      AuthResultDisplay, 
      hasSubmitted, 
      handleSubmit } = useAuthForm({
      initialFormState,
      getAction,
      getActionArgs
  })

  const authErrorList = extractErrorMessages(error)
  const FormErrors = authErrorList.map((entry, index) =>
	<span key={index}>{entry}<br/></span>
  )

  return (
    <AuthBlock>
        <EmailVerification/>
        {AuthResultDisplay(`Your profile was updated succefully.`)}
        <AuthForm className={styles.form}>
            <div className={styles.columnsWrapper}>
                <div className={styles.column1}>
                    {AuthFormFields([
                        {
                            name: 'current_callsign',
                            defaultValue: user.profile.current_callsign,
                            inputClass: 'callsign',
                            title: "callsign",
                            type: "text",
                        },
                        {
                            name: 'full_name',
                            defaultValue: user.profile.full_name,
                            title: "full name",
                            type: "text",
                        },
                        {
                            name: 'prev_callsigns',
                            defaultValue: user.profile.prev_callsigns,
                            title: "ex-callsigns",
                            type: "textarea",
                        },
                        {
                            name: 'phone',
                            defaultValue: user.profile.phone,
                            title: "phone (format: +12345678901)",
                            type: "tel",
                            pattern: "\\+\\d{11}"
                        },
                        {
                            name: 'address',
                            defaultValue: user.profile.address,
                            title: "home address",
                            type: "textarea",
                        },
                        {
                            name: 'bio',
                            defaultValue: user.profile.bio,
                            title: "About yourself",
                            type: "textarea",
                        }
                    ])}

                </div>
                <div className={styles.column2}>
                    <div className={styles.mainPhoto}>
                        <img
                            src="/static/media/user.f1aa36f6a626a24cfd4b.jpg"
                            alt="Avatar"
                        />
                    </div>
                    <span className={styles.email}>{user.email}</span>
                    <div className={styles.photos}>
                        <span><img src="/static/media/user.f1aa36f6a626a24cfd4b.jpg" /></span>
                        <span><img src="/static/media/user.f1aa36f6a626a24cfd4b.jpg" /></span>
                        <span><img src="/static/media/user.f1aa36f6a626a24cfd4b.jpg" /></span>
                        <span><img src="/static/media/user.f1aa36f6a626a24cfd4b.jpg" /></span>
                        <span class="addImage">add image</span>
                    </div>
                </div>

            </div>
            <AuthFormSubmit
                value="Save changes"/>
        </AuthForm>
    </AuthBlock>
    )
}
export default connect(null, {
    updateUserProfile: authActions.updateUserProfile
})(ProfilePage)
