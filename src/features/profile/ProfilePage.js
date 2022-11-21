import React from "react"

import styles from './Profile.module.css'

import EmailVerification from "../auth/EmailVerification"
import useAuthenticatedUser from "../auth/useAuthenticatedUser"
import { useAuthForm } from "../auth/useAuthForm"
import { profileUpdate, useProfile } from "./profileSlice"
import defaultAvatarImage from "../../assets/img/default_avatar.jpg"

export default function ProfilePage({ ...props }) {
  const { user } = useAuthenticatedUser()
  const { profile, isLoading } = useProfile()
  const { created_at, updated_at, user_id, ...initialFormState } = profile
  const {
      AuthFormFields,
      AuthFormSubmit,
      handleSubmit } = useAuthForm({
      initialFormState,
      getAction: () => profileUpdate
  })

  const [showPrevCallsigns, setShowPrevCallsigns] =
        React.useState(Boolean(profile.prevCallsigns))

  return (
    <div className={styles.userPage}>
        <EmailVerification/>
        <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.columnsWrapper}>
                <div className={styles.column1}>
                    {AuthFormFields([
                        {
                            name: 'current_callsign',
                            defaultValue: profile.current_callsign,
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
                            defaultValue: profile.prev_callsigns,
                            type: "textarea",
                            className: styles.prevCallsigns
                        }])}
                    {AuthFormFields([
                        {
                            name: 'full_name',
                            defaultValue: profile.full_name,
                            title: "full name",
                            type: "text",
                            className: styles.fullName
                        },
                        {
                            name: 'phone',
                            defaultValue: profile.phone,
                            title: "phone (format: +12345678901)",
                            type: "tel",
                            pattern: "\\+\\d{11}"
                        },
                        {
                            name: 'address',
                            defaultValue: profile.address,
                            title: "home address",
                            type: "textarea",
                        },
                        {
                            name: 'bio',
                            defaultValue: profile.bio,
                            title: "About yourself",
                            type: "textarea",
                        }
                    ])}

                </div>
                <div className={styles.column2}>
                    <div className={styles.mainPhoto}>
                        <img
                            src={profile.avatar_url || defaultAvatarImage}
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
                disabled={isLoading}
                value="Save profile data"/>
        </form>
    </div>
    )
}
