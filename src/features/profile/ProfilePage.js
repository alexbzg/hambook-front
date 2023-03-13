import { useState, useEffect, useRef } from "react"
import { useDispatch } from "react-redux"

import LightGallery from 'lightgallery/react'
import lgZoom from 'lightgallery/plugins/zoom'
import '../../assets/lightgallery/css/lightgallery.css'
import '../../assets/lightgallery/css/lg-zoom.css'

import Select from 'react-select'

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
import { getCountries, getRegions, getRegionData } from "../../utils/countries.js"


export default function ProfilePage({ ...props }) {
  const dispatch = useDispatch()
  const { user } = useAuthenticatedUser()
  const { profile, isLoading } = useProfile()
  const confirmModal = useModal()

  const [showPrevCallsigns, setShowPrevCallsigns] = useState(Boolean(profile.prevCallsigns))

  const countrySelectRef = useRef()
  const regionSelectRef = useRef()
  const districtSelectRef = useRef()
  const [selectedCountry, setSelectedCountry] = useState(profile?.country)
  const [selectedRegion, setSelectedRegion] = useState(profile?.region)
  const [countries, setCountries] = useState([])
  const [regions, setRegions] = useState([])
  const [regionData, setRegionData] = useState({districts: [], cities: []})
  const [cityHints, setCityHints] = useState([])
  const onCityChange = (value) => {
    if (value?.length > 2) {
      setCityHints(regionData.cities.filter( (item) => 
          item.toLowerCase().startsWith(value.toLowerCase()) ))
    } else {
      setCityHints()
    }
  }
  useEffect( () => {
      const _getCountries = async () => {
        const _countries = await getCountries()
        setCountries(_countries)
        if (profile?.country) {
          const country = _countries.find( (item) => item.value === profile.country )
          countrySelectRef.current.setValue(country, 'set-value')
          setSelectedCountry(profile.country)
        }
      }
      _getCountries()
  }, [profile])
  useEffect( () => {
      const _getRegions = async () => {
        const _regions = await getRegions(selectedCountry)
        setRegions(_regions)
        if (profile?.region && profile?.country === selectedCountry) {
          const region = _regions.find( (item) => item.value === profile.region )
          regionSelectRef.current.setValue(region, 'set-value')
          setSelectedRegion(profile.region)
        }
      }
      setSelectedRegion()
      regionSelectRef.current.clearValue()
      districtSelectRef.current.clearValue()
      setRegions([])
      if (selectedCountry) {
        _getRegions()
      } 
  }, [selectedCountry, profile])
  useEffect( () => {
      const _getRegionData = async () => {
        const _regionData = await getRegionData(selectedCountry, selectedRegion)
        setRegionData(_regionData)
        if (profile?.district && profile?.region === selectedRegion) {
          const district = _regionData?.districts.find( (item) => item.value === profile.district )
          districtSelectRef.current.setValue(district, 'set-value')
        }
      }
      districtSelectRef.current.clearValue()
      setRegionData({districts: [], cities: []})
      if (selectedRegion) {
        _getRegionData()
      }
  }, [selectedRegion, profile])

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
                    <div className={styles.nameBlock}>
                      <FormField
                          name='first_name'
                          defaultValue={profile.first_name}
                          title="first name"
                          type="text"
                          inputFilter={/[^a-zA-Z \-]/}
                          className={styles.name}
                      />
                      <FormField
                          name='last_name'
                          defaultValue={profile.last_name}
                          title="last name"
                          type="text"
                          inputFilter={/[^a-zA-Z \-]/}
                      />
                    </div>
                    <FormField
                        name='phone'
                        defaultValue={profile.phone}
                        title="phone"
                        type="tel"
                    />
                    <div className={styles.countryBlock}>
                      <span className={styles.title}>country</span>
                      <Select
                          name="country"
                          ref={countrySelectRef}
                          defaultValue={profile.country}
                          className={styles.country}
                          onChange={ (option) => setSelectedCountry(option?.value) }
                          options={countries}
                      />
                    </div>
                    <div className={styles.regionBlock}>
                      <span className={styles.title}>Region/State</span>
                      <Select
                          name="region"
                          ref={regionSelectRef}
                          defaultValue={profile.region}
                          className={styles.country}
                          disabled={!selectedCountry}
                          onChange={(option) => setSelectedRegion(option?.value)}
                          options={regions}
                      />
                    </div>
                    <div className={styles.cityBlock}>
                      <span className={styles.title}>District/County</span>
                      <Select
                          name="district"
                          ref={districtSelectRef}
                          disabled={!selectedRegion}
                          defaultValue={profile.city}
                          className={styles.country}
                          options={regionData.districts}
                      />
                    </div>
                    <FormField
                        title="City"
                        name="city"
                        hints={cityHints}
                        defaultValue={profile?.city}
                        onChange={(e) => onCityChange(e.target.value)}
                    />
                    <FormField
                        name='zip_code'
                        defaultValue={profile.zip_code}
                        title="Zip (postal) code"
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
