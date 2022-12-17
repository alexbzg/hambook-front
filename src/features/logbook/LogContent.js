import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { useDispatch } from "react-redux"

import styles from './LogContent.module.css'

import useAuthenticatedUser from "../auth/useAuthenticatedUser"
import useModal from "../../components/Modal/useModal"

import client from "../../services/apiClient"

import NewQsoForm from "./NewQsoForm"
import Qso from "./Qso"
import { modifyQsoCount } from "./logsSlice"

export default function LogContent({ ...props }) {
  const dispatch = useDispatch()

  const { user, token } = useAuthenticatedUser()
  const confirmModal = useModal()
  const { logId } = useParams()

  const [qsos, setQsos] = useState([])
  const [editQso, setEditQso] = useState()

  useEffect( () => {
    async function fetchQsos() {
      try {
        const qsos = await client({
         		url: `/qso/logs/${logId}/qso`,
                method: 'GET',
                token,
                suppressErrorMessage: true
            })
        setQsos(qsos)
      } catch {
      }
    }
    fetchQsos()
  }, [])

  const postNewQso = async (new_qso) => {
       try {
         const createdQso = await client({
         		url: `/qso/logs/${logId}`,
                method: 'POST',
                token,
                args: { new_qso }
            })
         setQsos((qsos) => [ createdQso, ...qsos ])
         dispatch(modifyQsoCount({ logId, value: 1 }))
         return true
       } catch {
         return false
       }
     }
 
  const postQsoUpdate = async ({qso_id, qso_update}) => {
       try {
         const updatedQso = await client({
         		url: `/qso/${qso_id}`,
                method: 'PUT',
                token,
                args: { qso_update }
            })
         setQsos((qsos) => {
             const newQsos = [...qsos]
             const idx = newQsos.findIndex( qso => qso.id === qso_id )
             newQsos[idx] = updatedQso
             return newQsos
         })
       } catch {
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
        onEdit={() => setEditQso(qso)}
        onDelete={() => deleteQso(qso.id)}
      />
  ))

  return (
    <div className={styles.LogContent}>
        <NewQsoForm onSubmit={postNewQso} logId={logId}/>
        <div className={styles.logWindow}>
            {Qsos}
        </div>
    </div>
    )
}
