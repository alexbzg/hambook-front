import { useState, useEffect, useCallback } from "react"
import { useParams } from "react-router-dom"
import { useDispatch } from "react-redux"

import styles from './LogContent.module.css'

import useAuthenticatedUser from "../auth/useAuthenticatedUser"
import useModal from "../../components/Modal/useModal"

import client from "../../services/apiClient"
import { excludeUnset } from "../../utils/forms"

import NewQsoForm from "./NewQsoForm"
import EditQsoForm from "./EditQsoForm"
import Qso from "./Qso"
import LogMenu from "./LogMenu"
import CallsignLookup from "./CallsignLookup"
import { modifyQsoCount } from "./logsSlice"

const qsoData = (formData) => {
    const { date, time, ...data } = Object.fromEntries(formData.entries())
    data.qso_datetime = `${date} ${time}`
    return data
}

export default function LogContent({ ...props }) {
  const dispatch = useDispatch()

  const { token } = useAuthenticatedUser()
  const confirmModal = useModal()
  const { logId } = useParams()

  const [qsos, setQsos] = useState([])
  const [lastQso, setLastQso] = useState()
  const [editQso, setEditQso] = useState()
  const [showError, setShowError] = useState(null)
  const [activeTab, setActiveTab] = useState('log')
  const [callsignLookup, setCallsignLookup] = useState()
  const [callsignLookupValid, setCallsignLookupValid] = useState()
  const [qsoFilter, setQsoFilter] = useState({})

  useEffect( () => {
    async function fetchQsos () {
        setShowError(null)
        setQsos([])
        try {
            const qsos = await client({
                    url: `/qso/logs/${logId}/qso`,
                    method: 'GET',
                    token,
                    params: qsoFilter,
                    suppressErrorMessage: true
                })
            setQsos(qsos)
            setLastQso( (state) => state === undefined ? 
                (qsos?.length ? qsos[0] : null) : state )
            return qsos
        } catch (error) {
            if (error === 'Qso not found' && Object.keys(qsoFilter).length) {
                setShowError(error)
            }
        }
        return null
    }
    fetchQsos()
  }, [token, logId, qsoFilter])

  const handleCallsignSearch = useCallback( (callsign_search) => {
      setQsoFilter( (state) => state.callsign_search !== callsign_search ?
            excludeUnset({ ...state, callsign_search }) : state )
      setCallsignLookupValid(callsign_search)
  }, [])

  const handleCallsignLookup = useCallback( (value) => {
      setCallsignLookup(value)
      setCallsignLookupValid(value)
  }, [])

  const postNewQso = async (result) => {
    if (result) {
        try {
            const createdQso = await client({
         		url: `/qso/logs/${logId}`,
                method: 'POST',
                token,
                args: { new_qso: qsoData(result) }
            })
         setQsos((qsos) => [ createdQso, ...qsos ])
         dispatch(modifyQsoCount({ logId, value: 1 }))
         return true
       } catch {
         return false
       }
    }
  }

  const postQsoUpdate = async (result) => {
      if (result) {
          try {
            const updatedQso = await client({
                url: `/qso/${editQso.id}`,
                method: 'PUT',
                token,
                args: { qso_update: qsoData(result) }
            })
            setQsos((qsos) => {
                const newQsos = [...qsos]
                const idx = newQsos.findIndex( qso => qso.id === editQso.id )
                newQsos[idx] = updatedQso
                return newQsos
            })
        } catch {}
      }
      setEditQso(null)
  }

  const deleteQso = async (qsoId) => {
     if (await confirmModal({
         children: "This qso will be deleted. Recovery is impossible.",
         confirmCheckbox: true
     })) {
        try {
            await client({
          		url: `/qso/${qsoId}`,
                method: 'DELETE',
                token
            })
            dispatch(modifyQsoCount({ logId, value: -1 }))
            setQsos((qsos) => qsos.filter( qso => qso.id !== qsoId ))
        } catch {
        }
    }
  }

  const Qsos = qsos.map( (qso) => (
      <Qso
        key={qso.id}
        data={qso}
        onCallsignClick={handleCallsignLookup} 
        onEdit={() => setEditQso(qso)}
        onDelete={() => deleteQso(qso.id)}
      />
  ))
 
  return (
    <div className={styles.LogContent}>
        {lastQso !== undefined &&
        <NewQsoForm 
            onSubmit={postNewQso} 
            logId={logId}
            prevQso={lastQso}
            onCallsignLookup={handleCallsignLookup}
        />}
        <LogMenu 
            activeTab={activeTab} 
            onActiveTab={setActiveTab}
            callsignLookup={callsignLookup}
            onCallsignLookup={setCallsignLookup}
            onCallsignLookupValid={setCallsignLookupValid}
            onCallsignSearch={handleCallsignSearch}
        />
        <div className={styles.logWindow}>
        {activeTab === 'log' &&
            <>
                {showError &&
                    <div className={styles.qsoError}>{showError}</div>
                }
                <table>
                    <tbody>{Qsos}</tbody>
                </table>
            </>
          }
        {activeTab === 'callsignLookup' &&
            <CallsignLookup
                callsign={callsignLookupValid}
            />
        }
        </div>
        {editQso &&
            <EditQsoForm
                qso={editQso}
                modalResult={postQsoUpdate}
            />
        }
    </div>
    )
}
