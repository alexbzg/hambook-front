import { useState, useEffect } from "react"

import styles from './CallsignLookup.module.css'

import useAuthenticatedUser from "../auth/useAuthenticatedUser"

import client from "../../services/apiClient"

export default function CallsignLookup({ callsign, ...props }) {

  const { token } = useAuthenticatedUser()
  const [lookupData, setLookupData] = useState()
  const [loading, setLoading] = useState('idle')

  useEffect( () => {
    async function lookupRequest() {
        if (callsign) {
            setLookupData()
            setLoading('loading')
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
                setLoading('rejected')
            }
        }
    }
    lookupRequest()
  }, [callsign, token])

  return (lookupData && (
          <>
            {lookupData.image &&
                <img src={lookupData.image}/>
            }
            {Object.entries(lookupData).map( ([ prop, value ]) => (<>{prop}: {value}<br/></>) )}
          </>)
  )

}

