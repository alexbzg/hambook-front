import React from "react"
import { connect } from "react-redux"

import styles from './Profile.module.css'

import { EmailVerification } from "../../components"
import { useAuthenticatedUser } from "../../hooks/auth/useAuthenticatedUser"
import { useAuthForm } from "../../hooks/ui/useAuthForm"
import { extractErrorMessages } from "../../utils/errors"
import { Actions as authActions } from "../../redux/auth"
import defaultAvatarImage from "../../assets/img/default_avatar.jpg"

function ProfilePage({ updateUserProfile }) {
  const { user, error, isLoading } = useAuthenticatedUser()
  const getAction = () => updateUserProfile
  const getActionArgs = ({form}) => form
  const { created_at, updated_at, user_id, ...initialFormState } = user.profile
  const {
      AuthFormFields,
      AuthFormSubmit,
      setRequestResult,
      setRequestErrors,
      hasSubmitted,
      handleSubmit } = useAuthForm({
      initialFormState,
      getAction,
      getActionArgs,
      successMessage: `Your profile was updated succefully.`
  })

  const [showPrevCallsigns, setShowPrevCallsigns] =
        React.useState(Boolean(user.profile.prevCallsigns))

  React.useEffect(() => {
    if (hasSubmitted && !isLoading) {
      setRequestResult(!Boolean(error))
      if (error) {
        setRequestErrors(extractErrorMessages(error))
      }
    }
  }, [isLoading, hasSubmitted, error])

  return (
    <div className={styles.userPage}>
        <EmailVerification/>
        <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.columnsWrapper}>
                <div className={styles.column1}>
                    {AuthFormFields([
                        {
                            name: 'current_callsign',
                            defaultValue: user.profile.current_callsign,
                            className: styles.callsign,
                            title: "callsign",
                            type: "text",
                        }
                    ])}
                    <input
                        type="checkbox"
                        onChange={(e) => setShowPrevCallsigns(e.target.checked)}
                        className={styles.checkboxEx}
                    /> ex-callsigns
                    {showPrevCallsigns && AuthFormFields([
                        {
                            name: 'prev_callsigns',
                            defaultValue: user.profile.prev_callsigns,
                            type: "textarea",
                            className: styles.prevCallsigns
                        }])}
                    {AuthFormFields([
                        {
                            name: 'full_name',
                            defaultValue: user.profile.full_name,
                            title: "full name",
                            type: "text",
                            className: styles.fullName
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
                            src={user.profile.avatar_url || defaultAvatarImage}
                            alt="Avatar"
                        />
                    </div>
                    <span className={styles.email}>{user.email}</span>
                    <div className={styles.photos}>
                        <span><img src="/static/media/user.f1aa36f6a626a24cfd4b.jpg" alt=""/></span>
                        <span><img src="/static/media/user.f1aa36f6a626a24cfd4b.jpg" alt=""/></span>
                        <span><img src="/static/media/user.f1aa36f6a626a24cfd4b.jpg" alt=""/></span>
                        <span><img src="/static/media/user.f1aa36f6a626a24cfd4b.jpg" alt=""/></span>
                        <span className={styles.addImage}>add image</span>
                    </div>
                </div>

            </div>
            <AuthFormSubmit
                value="Save profile data"/>
        </form>
    </div>
    )
}
export default connect(null, {
    updateUserProfile: authActions.updateUserProfile
})(ProfilePage)
