import { useState, useEffect } from "react"

import LightGallery from 'lightgallery/react'
import lgZoom from 'lightgallery/plugins/zoom'
import '../../assets/lightgallery/css/lightgallery.css'
import '../../assets/lightgallery/css/lg-zoom.css'

import styles from './CallsignLookup.module.css'

import useAuthenticatedUser from "../auth/useAuthenticatedUser"

import { Spinner } from "../../components"

import client from "../../services/apiClient"
import { stripCallsign } from "../../utils/hamRadio"

import qrzcomLogo from "../../assets/img/qrz_com.svg"

export default function CallsignLookup({ callsign, ...props }) {

  const { token } = useAuthenticatedUser()
  const [lookupData, setLookupData] = useState()
  const [loading, setLoading] = useState('idle')

  useEffect( () => {
    async function lookupRequest() {
        if (callsign) {
            setLookupData()
            setLoading('pending')
            try {
                const data = await client({
                    url: `/callsigns/qrz/${stripCallsign(callsign)}`,
                    method: 'GET',
                    token,
                    suppressErrorMessage: true
                })
                setLookupData(data)
                setLoading('succeeded')
            } catch (error) {
                setLookupData()
                setLoading('rejected')
            }
        } else {
            setLoading("idle")
            setLookupData()
        }
    }
    lookupRequest()
  }, [callsign, token])

  return (
          <div id={styles.callsignLookup}>
            {loading === "pending" &&
                <Spinner/>
            }
            {loading === 'rejected' && callsign &&
                <span className={styles.callsignNotFound}>No callsign info for {stripCallsign(callsign.toUpperCase())}</span>
            }
            <div id={styles.callsignInfoRow}>
                    {lookupData?.image &&
                        <div id={styles.callsignPhoto}>
                            <LightGallery plugins={[lgZoom]} mode="lg-fade">
                                <a href={lookupData.image}>
                                    <img
                                        id={styles.qrzcomImage}
                                        src={lookupData.image}
                                        alt={`${callsign} profile photo`}/>
                                </a>
                            </LightGallery>
                        </div>
                    }
                <div id={styles.callsignPerson}>
                    {lookupData &&
                        <>
                            <span className={styles.callsign}>{lookupData.call}</span><br/>
                            <span className={styles.name}>{lookupData.name_fmt}</span><br/>
                            <span className={styles.email}>{lookupData.email}</span>
                            {Object.entries(lookupData).map( ([ prop, value ]) => (
                                <span key={prop} hidden>{prop}: {value}</span>) )}
                        </>
                    }
                </div>
                <div id={styles.callsignAddr}>
                    {lookupData &&
                        <>
                            {lookupData.addr1}<br/>
                            {lookupData.addr2}<br/>
                            {lookupData.zip}<br/>
                            <span className={styles.country}>{lookupData.country}</span>
                         </>
                    }
                </div>
            </div>
            <div id={styles.callsignInfoRow}>
                    {lookupData &&
                        <>
                            <table><tr>
                            <td className={styles.qth}>Latitude: <b>{lookupData.lat}</b></td>
                            <td className={styles.qth}>Longtude: <b>{lookupData.lon}</b></td>
                            <td className={styles.qth}>Grid: <b>{lookupData.grid}</b></td>
                            <td className={styles.qth}>CQ zone: <b>{lookupData.cqzone}</b></td>
                            <td className={styles.qth}>ITU zone: <b>{lookupData.ituzone}</b></td>
                            </tr></table>
                         </>
                    }
            </div>
            <img
                id={styles.qrzcomLogo}
                src={qrzcomLogo}
                alt="QRZ.com info" />

          </div>)

}

