import { useState, useEffect } from "react"

import styles from './CallsignLookup.module.css'

import useAuthenticatedUser from "../auth/useAuthenticatedUser"

import { Spinner } from "../../components"

import client from "../../services/apiClient"

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
                    url: `/callsigns/qrz/${callsign}`,
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
            {loading === 'rejected' &&
                <span className={styles.callsignNotFound}>No callsign info for {callsign.toUpperCase()}</span>
            }
            {lookupData?.image &&
                <img src={lookupData.image} alt={`From ${callsign} profile`}/>
            }
            {lookupData && 
                <>
                    <span className={styles.callsign}>{lookupData.call}</span><br/>
                    <span className={styles.name}>{lookupData.name_fmt}</span>
                    {Object.entries(lookupData).map( ([ prop, value ]) => (
                        <span key={prop} hidden>{prop}: {value}</span>) )}
                </>
            }
          </div>)

}

