import { useState, useEffect, useCallback } from "react"
import { useParams } from "react-router-dom"
import { useDispatch } from "react-redux"

import styles from './LogContent.module.css'

import useAuthenticatedUser from "../auth/useAuthenticatedUser"
import useModal from "../../components/Modal/useModal"

import client from "../../services/apiClient"

import NewQsoForm from "./NewQsoForm"
import EditQsoForm from "./EditQsoForm"
import Qso from "./Qso"
import LogMenu from "./LogMenu"
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

  const fetchQsos = useCallback( async (qsoFilter) => {
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
      return qsos
    } catch (error) {
      if (error === 'Qso not found' && Object.keys(qsoFilter).length) {
        setShowError(error)
      }
    }
    return null
  }, [logId])

  useEffect( () => {
    async function initialFetchQsos() {
      const qsos = await fetchQsos({})
      setLastQso(qsos?.length ? qsos[0] : null)
    }
    initialFetchQsos()
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
        />}
        <LogMenu logId={logId} onQsoFilter={fetchQsos}/>
        <div className={styles.logWindow}>
            {showError &&
                <div className={styles.qsoError}>{showError}</div>
            }
            <table>
                <tbody>{Qsos}</tbody>
            </table>
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
