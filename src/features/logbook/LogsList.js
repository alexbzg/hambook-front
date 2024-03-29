import { useState, useCallback } from "react"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"

import fileDownload from 'js-file-download'

import styles from './LogsList.module.css'

import { useLogs, logUpdate, logCreate, logDelete, adifUpload } from "./logsSlice"
import useModal from "../../components/Modal/useModal"
import useAuthenticatedUser from "../auth/useAuthenticatedUser"

import client from "../../services/apiClient"

import LogsListItem from "./LogsListItem"
import LogSettings from "./LogSettings"
import LogExport from "./LogExport"
import Upload from "./Upload"

const ListItemWrapper = (props) => <div {...props} className={styles.logsListItem}/>

export default function LogsList({ ...props }) {
  const dispatch = useDispatch()
  const { token } = useAuthenticatedUser()

  const navigate = useNavigate()
  const { logs, uploading } = useLogs()
  const confirmModal = useModal()

  const [editLog, setEditLog] = useState()
  const [exportLog, setExportLog] = useState()
  const [adifUploadData, setAdifUploadData] = useState()

  const handleInputChange = useCallback((label, value) => {
      setEditLog( (editLog) => ({ ...editLog, [label]: value }) )
  }, [])

  const handleEditItem = useCallback((item) => {
      setEditLog( item ? {id: item.id, callsign: item.callsign, description: item.description} : 
          {callsign: '', description: ''} )
  }, [])

  const logSettingsModalResult = async (result) => {
    if (result) {
      const data = Object.fromEntries(result.entries())
      dispatch( editLog.id ? 
        logUpdate({ log_id: editLog.id, log_update: data }) :
        logCreate( data )
      )
    } 
    setEditLog(null)
  }

  const handleDeleteItem = async (item) => {
     if (await confirmModal({
         children: "This log will be deleted with all its contents. Recovery is impossible.",
         confirmCheckbox: true
     })) {
       dispatch(logDelete(item.id))
     }
  }

  const logExportModalResult = async (result) => {
    try {
        if (result) {
            const qso_filter = Object.fromEntries(result.entries())
            const adifDownload = await client({
                url: `/qso/logs/${exportLog.id}/adif`,
                method: 'POST',
                token,
                args: { qso_filter }
            })
            let fileName = exportLog.callsign.replace(/\//, '_')
            if (qso_filter.date_begin) {
                fileName = [fileName, qso_filter.date_begin, qso_filter.date_end].join('_')
            }
            fileDownload(adifDownload, `${fileName}.adi`)
        }
    } finally {
      setExportLog()
    }
  }

  const handleOpenItem = useCallback((item) => {
      navigate(`/logbook/${item.id}`)
  }, [])

  const doAdifUpload = useCallback( async ({ onUploadProgress, signal  }) => 
    dispatch(adifUpload({ ...adifUploadData, onUploadProgress, signal })), 
    [adifUploadData, dispatch, adifUpload])

  const QsoLogs = logs.map( (item) => (
      <ListItemWrapper 
        key={item.id}
        onClick={() => handleOpenItem(item)}>
        <LogsListItem
            {...item}
            onOpen={() => handleOpenItem(item)}
            onDelete={() => handleDeleteItem(item)}
            onEdit={() => handleEditItem(item)}
            onExport={() => setExportLog(item)}
            onImport={(file) => setAdifUploadData({ file, log_id: item.id })}
      />
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
        {Boolean(exportLog) &&
            <LogExport 
                modalResult={logExportModalResult}
                log={exportLog}/>
        }
        <Upload
            uploadData={adifUploadData}
            uploading={uploading}
            uploadOperation={doAdifUpload}
            modalResult={() => setAdifUploadData()}/>
    </div>
    )
}
