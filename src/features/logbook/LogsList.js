import { useState, useEffect } from "react"
import { useDispatch } from "react-redux"

import styles from './LogsList.module.css'

import { useLogs, logsFetch, logUpdate, logCreate, logDelete } from "./logsSlice"
import useModal from "../../components/Modal/useModal"


import LogsListItem from "./LogsListItem"
import LogSettings from "./LogSettings"

const ListItemWrapper = (props) => <div {...props} className={styles.logsListItem}/>

export default function LogsList({ ...props }) {
  const dispatch = useDispatch()
  const { logs, error, loading } = useLogs()
  const confirmModal = useModal()

  const [editLog, setEditLog] = useState()

  useEffect( () => {
    dispatch(logsFetch())
  }, [])

  const handleInputChange = (label, value) => {
      setEditLog( (editLog) => ({ ...editLog, [label]: value }) )
  }

  const handleEditItem = (item) => {
      setEditLog( item ? {id: item.id, callsign: item.callsign, description: item.description} : 
          {callsign: '', description: ''} )
  }

  const logSettingsModalResult = async (result) => {
        if (result) {
          dispatch( editLog.id ? 
            logUpdate({ log_id: editLog.id, log_update: editLog }) :
            logCreate( editLog )
          )
        } 
        setEditLog(null)
  }

  const handleDeleteItem = async (item) => {
     if (await confirmModal({children: "This log will be deleted with all its contents. Recovery is impossible."})) {
       dispatch(logDelete(item.id))
     }
  }

  const QsoLogs = logs.map( (item) => (
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
