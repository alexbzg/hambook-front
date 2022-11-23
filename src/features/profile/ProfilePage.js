import { useState } from "react"
import { useDispatch } from "react-redux"

import styles from './Profile.module.css'

import EmailVerification from "../auth/EmailVerification"
import useAuthenticatedUser from "../auth/useAuthenticatedUser"
import { useAuthForm } from "../auth/useAuthForm"
import { profileUpdate, mediaUpload, mediaDelete, useProfile, PROFILE_MEDIA_LIMIT } from "./profileSlice"
import { MEDIA_TYPE } from '../../enums.js'
import defaultAvatarImage from "../../assets/img/default_avatar.jpg"
import addIcon from "../../assets/img/icons/add.svg"
import deleteIcon from "../../assets/img/icons/delete.svg"
import useModal from "../modal/useModal.js"


export default function ProfilePage({ ...props }) {
  const dispatch = useDispatch()
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
  const confirmModal = useModal()

  const [showPrevCallsigns, setShowPrevCallsigns] = useState(Boolean(profile.prevCallsigns))

  const uploadAvatar = async (file) => {
    if (!profile.avatar ||
        (await confirmModal({message: "Your current avatar will be replaced with the new one."}))) {
      await dispatch(mediaUpload({ mediaType: MEDIA_TYPE.avatar, file: file.files[0] }))
      file.value = null
	}
  }

  const deleteAvatar = async () => {
    if (await confirmModal({message: "Your current avatar will be deleted."})) {
       dispatch(mediaDelete({
           mediaType: MEDIA_TYPE.avatar,
           media_id: profile.avatar.id
       }))
    }
  }

  const uploadMedia = async (file) => {
      await dispatch(mediaUpload({ mediaType: MEDIA_TYPE.profileImage, file: file.files[0] }))
      file.value = null
  }

  const deleteMedia = async (media_id) => {
    if (await confirmModal({message: "This image will be deleted."})) {
       dispatch(mediaDelete({
           mediaType: MEDIA_TYPE.profileImage,
           media_id
       }))
    }
  }



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
                    <div className={`${styles.mainPhoto} ${styles.controlsContainer}`}>
                        <img
                            src={profile.avatar?.url || defaultAvatarImage}
                            alt="Avatar"
                        />
                        <label htmlFor="avatarFile">
                            <img className={styles.controlUpload}
                                src={addIcon}
                                alt="Upload new avatar"/>
                        </label>
                        <input type="file"
                            id="avatarFile"
                            style={{display: 'none'}}
                            onChange={(e) => uploadAvatar(e.target)}
                        />
                        {profile.avatar &&
                            <img className={styles.controlDelete}
                                src={deleteIcon}
                                alt="Delete avatar"
                                onClick={deleteAvatar}/>}
                    </div>
                    <span className={styles.email}>{user.email}</span>
                    <div className={styles.photos}>
                        {profile.media.map( (item)  =>
                            <span className={styles.controlsContainer} 
                                key={item.id}>
                                <img src={item.url} alt="uploaded by you"/>
                                <img className={styles.controlDelete}
                                    src={deleteIcon}
                                    alt="Delete"
                                    onClick={() => deleteMedia(item.id)}/>
                            </span>)}
                        {profile.media.length < PROFILE_MEDIA_LIMIT && (<>
                            <label htmlFor="mediaFile">
                                <span className={styles.addImage}>
                                    <img
                                        src={addIcon}
                                        alt="Add"/><br/>add image
                                </span>
                            </label>
                            <input type="file"
                                id="mediaFile"
                                style={{display: 'none'}}
                                onChange={(e) => uploadMedia(e.target)}
                            />
                            </>)
                        }
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
