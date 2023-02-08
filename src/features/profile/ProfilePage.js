import { useState } from "react"
import { useDispatch } from "react-redux"

import LightGallery from 'lightgallery/react'
import lgZoom from 'lightgallery/plugins/zoom'
import '../../assets/lightgallery/css/lightgallery.css'
import '../../assets/lightgallery/css/lg-zoom.css'

import styles from './Profile.module.css'

import EmailVerification from "../auth/EmailVerification"
import useAuthenticatedUser from "../auth/useAuthenticatedUser"
import { handleSubmit } from "../../utils/forms.js"
import { FormField, CallsignField } from "../../components"
import { profileUpdate, mediaUpload, mediaDelete, useProfile, PROFILE_MEDIA_LIMIT } from "./profileSlice"
import { MEDIA_TYPE } from '../../enums.js'
import defaultAvatarImage from "../../assets/img/default_avatar.jpg"
import addIcon from "../../assets/img/icons/add.svg"
import deleteIcon from "../../assets/img/icons/delete.svg"
import useModal from "../../components/Modal/useModal.js"


export default function ProfilePage({ ...props }) {
  const dispatch = useDispatch()
  const { user } = useAuthenticatedUser()
  const { profile, isLoading } = useProfile()
  const confirmModal = useModal()

  const [showPrevCallsigns, setShowPrevCallsigns] = useState(Boolean(profile.prevCallsigns))

  const uploadAvatar = async (file) => {
    if (!profile.avatar ||
        (await confirmModal({children: "Your current avatar will be replaced with the new one."}))) {
      await dispatch(mediaUpload({ mediaType: MEDIA_TYPE.avatar, file: file.files[0] }))
      file.value = null
	}
  }

  const deleteAvatar = async () => {
    if (await confirmModal({children: "Your current avatar will be deleted.", confirmCheckbox: true})) {
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

  const deleteMedia = async (media_id, e) => {
    e.preventDefault()
    e.nativeEvent.stopImmediatePropagation()
    if (await confirmModal({children: "This image will be deleted.", confirmCheckbox: true})) {
       dispatch(mediaDelete({
           mediaType: MEDIA_TYPE.profileImage,
           media_id
       }))
    }
  }

  const submitProfileUpdate = handleSubmit( (data) => dispatch(profileUpdate(data)) )

  return (
    <div className={styles.userPage}>
        <EmailVerification/>
        <form className={styles.form} onSubmit={submitProfileUpdate}>
            <div className={styles.columnsWrapper}>
                <div className={styles.column1}>
                    <CallsignField
                        full={false}
                        name='current_callsign'
                        defaultValue={profile.current_callsign}
                        className={styles.callsign}
                        title="callsign"
                    />
                    <input
                        type="checkbox"
                        onChange={(e) => setShowPrevCallsigns(e.target.checked)}
                        className={styles.checkboxEx}
                    /> ex-callsigns
                    {showPrevCallsigns && 
                        <FormField
                            name='prev_callsigns'
                            defaultValue={profile.prev_callsigns}
                            inputFilter={/[^a-zA-Z\d/ ]/gi}
                            type="textarea"
                            className={styles.prevCallsigns}
                        />
                    }
                    <FormField
                        name='full_name'
                        defaultValue={profile.full_name}
                        title="full name"
                        type="text"
                        className={styles.fullName}
                    />
                    <FormField
                        name='phone'
                        defaultValue={profile.phone}
                        title="phone"
                        type="tel"
                    />
                    <FormField
                        name='address'
                        defaultValue={profile.address}
                        title="home address"
                        type="textarea"
                    />
                    <FormField
                        name='bio'
                        defaultValue={profile.bio}
                        title="About yourself"
                        type="textarea"
                    />
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
                        <LightGallery plugins={[lgZoom]} mode="lg-fade">
                            {profile.media.map( (item)  =>
                                <a className={styles.controlsContainer} 
                                    key={item.id} href={item.url}>
                                    <img src={item.url} alt=""/>
                                    <img className={styles.controlDelete}
                                        src={deleteIcon}
                                        alt="Delete"
                                        onClickCapture={(e) => deleteMedia(item.id, e)}/>
                                </a>)}
                        </LightGallery>
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
            <input 
                type="submit"
                name="submit"
                disabled={isLoading}
                value="Save profile data"/>
        </form>
    </div>
    )
}
