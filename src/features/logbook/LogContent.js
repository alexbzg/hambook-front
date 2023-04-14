import { useState, useEffect, useCallback } from "react"
import { useParams } from "react-router-dom"
import { useDispatch } from "react-redux"

import styles from './LogContent.module.css'

import useAuthenticatedUser from "../auth/useAuthenticatedUser"
import useModal from "../../components/Modal/useModal"

import client from "../../services/apiClient"
import { excludeUnset } from "../../utils/forms"

import QsoForm from "./QsoForm"
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
        let qsos = []
        try {
            qsos = await client({
                    url: `/qso/logs/${logId}/qso`,
                    method: 'GET',
                    token,
                    params: qsoFilter,
                    suppressErrorMessage: true
                })
            setQsos(qsos)
        } catch (error) {
            if (error === 'Qso not found' && Object.keys(qsoFilter).length) {
                setShowError(error)
            }
        } finally {
            setLastQso( (state) => state === undefined ?
                (qsos?.length ? qsos[0] : null) : state )
            return qsos
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
                args: { new_qso: result }
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
     try {
        if (result) {
            const updatedQso = await client({
                url: `/qso/${editQso.id}`,
                method: 'PUT',
                token,
                args: { qso_update: result }
            })
            setQsos((qsos) => {
                const newQsos = [...qsos]
                const idx = newQsos.findIndex( qso => qso.id === editQso.id )
                newQsos[idx] = updatedQso
                return newQsos
            })
        }
      } finally {
        setEditQso()
      }
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
      <table className={styles.logContentLayout}>
        <tr>
          <td colspan="2" className={styles.newQsoWindow}>
            {lastQso !== undefined &&
            <QsoForm
                onSubmit={postNewQso}
                logId={logId}
                prevQso={lastQso}
                onCallsignLookup={handleCallsignLookup}
            />}
          </td>
          <td className={styles.hambookProfileWindow}>HAMBOOK profile</td>
          <td rowspan="3"className={styles.dxClusterWindow}>DX cluster</td>
        </tr>
        <tr>
          <td className={styles.qrzComWindow}>QRZ.com</td>
          <td className={styles.qrzRuWindow}>QRZ.ru</td>
          <td className={styles.statsWindow}>Stats</td>
        </tr>
        <tr>
          <td className={styles.logWindow} colspan="3">
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
                    logId={logId}
                    modalResult={postQsoUpdate}
                />
            }
          </td>
        </tr>
      </table>
    </div>
    )
}
