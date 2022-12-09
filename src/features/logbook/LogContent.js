import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"

import styles from './LogsList.module.css'

import useAuthenticatedUser from "../auth/useAuthenticatedUser"
import useModal from "../../components/Modal/useModal"

import client from "../../services/apiClient"

import { FormField } from "../../components"

export default function LogContent({ ...props }) {
  const { user, token } = useAuthenticatedUser()
  const confirmModal = useModal()
  const { log_id } = useParams()

  const [qsos, setQsos] = useState([])
  const [editQsoId, setEditQsoId] = useState()

  useEffect( () => {
    async function fetchQsos() {
      try {
        const qsos = await client({
         		url: `/qso/logs/${log_id}/qso`,
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
         		url: `/qso/logs/${log_id}`,
                method: 'POST',
                token,
                args: { new_qso }
            })
         setQsos((qsos) => [ ...qsos, createdQso ])
       } catch {
       }
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
  }

  const Qsos = qsos.map( (qso) => (
      <Qso 
        data={qso}
        isEdited={editQsoId == qso.id}
        onEdit={() => setEditQsoId(qs.id)}
        postQsoUpdate={postQsoUpdate}
      />
  )

  return (
    <div className={styles.LogContent}>
        <NewQsoForm onSubmit={postNewQso}/>
        <table className={styles.qsoList}>
            {Qsos}
        </table>
    </div>
    )
}
