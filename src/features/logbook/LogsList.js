import { useState, useEffect } from "react"

import styles from './LogsList.module.css'

import useAuthenticatedUser from "../auth/useAuthenticatedUser"
import useModal from "../modal/useModal"

import client from "../../services/apiClient"

import LogsListItem from "./LogsListItem"

const ListItemWrapper = (props) => <div {...props} className={styles.logsListItem}/>

export default function LogsList({ ...props }) {
  const { user, token } = useAuthenticatedUser()
  const confirmModal = useModal()

  const [qsoLogs, setQsoLogs] = useState([])

  useEffect( () => {
    async function fetchLogs() {
      try {
        const userLogs = await client({
         		url: `/qso/logs/${user.id}`,
                method: 'GET', 
                token
            })
        setQsoLogs(userLogs)
      } catch {
      }
    }
    fetchLogs()  
  }, [])

  const handleEditItem = (item) => {
  }
  
  const handleDeleteItem = async (item) => {
     if (await confirmModal({body: "This log will be deleted with all contents. Recovery is impossible."})) {
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
      <ListItemWrapper>
        <LogsListItem 
            {...item}
            key={item.id}
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
    </div>
    )
}
