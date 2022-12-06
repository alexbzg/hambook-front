import { useState, useEffect } from "react"

import styles from './LogsList.module.css'

import useAuthenticatedUser from "../auth/useAuthenticatedUser"
import useModal from "../../components/Modal/useModal"

import client from "../../services/apiClient"

import LogsListItem from "./LogsListItem"
import LogSettings from "./LogSettings"
import { FormField } from "../../components"

const ListItemWrapper = (props) => <div {...props} className={styles.logsListItem}/>

export default function LogsList({ ...props }) {
  const { user, token } = useAuthenticatedUser()
  const confirmModal = useModal()

  const [qsoLogs, setQsoLogs] = useState([])
  const [editLog, setEditLog] = useState()

  useEffect( () => {
    async function fetchLogs() {
      try {
        const userLogs = await client({
         		url: `/qso/logs/`,
                method: 'GET',
                params: {user_id: user.id},
                token,
                suppressErrorMessage: true
            })
        setQsoLogs(userLogs)
      } catch {
      }
    }
    fetchLogs()
  }, [])

  const handleInputChange = (label, value) => {
      setEditLog( (editLog) => ({ ...editLog, [label]: value }) )
  }

  const handleEditItem = (item) => {
      setEditLog( item ? {...item} : {callsign: '', description: ''} )
  }

  const logSettingsModalResult = async (result) => {
        if (result) {
          try {
            const update = 
                await client( editLog.id ? {
         		    url: `/qso/logs/${editLog.id}`,
                    method: 'PUT',
                    token,
                    args: {log_update: editLog}
                } : {
         		    url: `/qso/logs/`,
                    method: 'POST',
                    token,
                    args: {new_log: editLog}
                })
            setQsoLogs( (qsoLogs) => {
                const newLogs = [...qsoLogs]
                if (editLog.id) {
                    const idx = newLogs.findIndex( log => log.id === editLog.id )
                    newLogs[idx] = update
                } else {
                    newLogs.push(update)
                }
                return newLogs
            })
          } finally {
            setEditLog(null)
          }
        }

  }

  const handleDeleteItem = async (item) => {
     if (await confirmModal({children: "This log will be deleted with all its contents. Recovery is impossible."})) {
       try {
         await client({
         		url: `/qso/logs/${item.id}`,
                method: 'DELETE',
                token
            })
         setQsoLogs((qsoLogs) => qsoLogs.filter( (log) => log !== item ))
       } catch {
       }
     }
  }

  const QsoLogs = qsoLogs.map( (item) => (
      <ListItemWrapper key={item.id}>
        <LogsListItem
            {...item}
            onDelete={() => handleDeleteItem(item)}
            onEdit={() => handleEditItem(item)}/>
      </ListItemWrapper>)
  )

  return (
    <div className={styles.logsList}>
        {QsoLogs}
        <ListItemWrapper
            onClick={() => handleEditItem(null)}>
            <span>Start new LOG</span>
        </ListItemWrapper>
        {Boolean(editLog) &&
            <LogSettings 
                modalResult={logSettingsModalResult}
                handleInputChange={handleInputChange}
                log={editLog}/>
        }

    </div>
    )
}
