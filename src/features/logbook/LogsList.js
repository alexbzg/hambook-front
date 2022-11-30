import { useState, useEffect } from "react"

import styles from './LogsList.module.css'

import useAuthenticatedUser from "../auth/useAuthenticatedUser"
import useModal from "../modal/useModal"

import client from "../../services/apiClient"

import LogsListItem from "./LogsListItem"
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
         		url: `/qso/logs/${user.id}`,
                method: 'GET', 
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

  const handleSubmit = async () => {
        try {
            const update = editLog.id ? 
                await client({
         		    url: `/qso/logs/${editLog.id}`,
                    method: 'PUT', 
                    token,
                    args: {log_update: editLog}
                }) :
                await client({
         		    url: `/qso/logs/`,
                    method: 'POST', 
                    token,
                    args: {new_log: editLog}
                }) 
            editLog.id ? 
                setQsoLogs( (qsoLogs) => {
                    const newLogs = [...qsoLogs]
                    const idx = newLogs.findIndex( log => log.id === editLog.id )
                    newLogs[idx] = update
                    return newLogs
                }) :
                setQsoLogs( (qsoLogs) => {
                    const newLogs = [...qsoLogs]
                    newLogs.push(update)
                    return newLogs
                })
        } finally {
            setEditLog(null)
        }

  }
  
  const handleDeleteItem = async (item) => {
     if (await confirmModal({body: "This log will be deleted with all its contents. Recovery is impossible."})) {
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
            Start new log.
        </ListItemWrapper>
        {Boolean(editLog) &&
          <div className="editLog">
            <FormField
                name="callsign"
                isValid={() => true}
                defaultValue={editLog.callsign}
                title="Callsign"
                onChange={handleInputChange}/>
            <FormField
                name="description"
                isValid={() => true}
                defaultValue={editLog.description}
                title="Description"
                onChange={handleInputChange}/>
            <input 
                className={styles.editButtonCancel}
                type="button"
                onClick={() => setEditLog(null)}
                value="Cancel"/>
            <input 
                className={styles.editButtonOK}
                type="button"
                onClick={handleSubmit}
                value="Save"/>
         </div>
        }
        
    </div>
    )
}
