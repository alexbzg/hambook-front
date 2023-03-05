import { useState, useEffect, useCallback } from "react"
import {useDispatch } from "react-redux"
import styles from './LogsList.module.css'

import { ModalForm } from "../../components"
import { useLogs, setImportTaskBackground, deleteImportTask } from "./logsSlice"
import AdifImportResult from "./AdifImportResult"

export default function Upload({  uploadData, uploadOperation, uploading, ...props }) {
    const dispatch = useDispatch()

    const [importTaskId, setImportTaskId] = useState()

    const { useImportTask } = useLogs()
    const importTask = useImportTask(importTaskId)

    useEffect( () => {

        const abortController = new AbortController()

        async function _upload() {
            const uploadResult = await uploadOperation({
                signal: abortController.signal,
            })
            setImportTaskId(uploadResult.payload.id)
        }
        
        if (uploadData) {
            _upload()
            return () => abortController.abort()
        }

    }, [uploadData])

    const cancelButtonProps = {
        label: uploading !== 'loading' && !importTask?.result ? 'Import in background' : null,
        hidden: Boolean(importTask?.result)
    }
    const confirmButtonProps = {hidden: uploading === 'loading' || Boolean(!importTask?.result)}

    const handleModalResult = (result) => {
      if (importTaskId) {
        dispatch((result ? deleteImportTask : setImportTaskBackground)({ importTaskId }))
      }
      props.modalResult?.(result)
    }

    return uploadData &&
        <ModalForm 
            {...props}
            cancelButton={cancelButtonProps}
            modalResult={handleModalResult}
            confirmButton={confirmButtonProps}
        >
          <div className={styles.logExport}>
            {uploading === 'loading' && 
                <>
                    Uploading {uploadData.file.name}...
                </>
            }
            {uploading === 'succeeded' && !importTask?.result &&
                <>
                    File &quot;{uploadData.file.name}&quot; was uploaded to server and currently is being processed.<br/>
                    You will be notified when the processing is finished.
                </>
            }
            {uploading === 'succeeded' && importTask?.result && 
                <AdifImportResult {...importTask}/>}
            {uploading === 'rejected' &&
                <>
                    Upload failed. Please repeat the operation later or connect technical support.
                </>
            }
          </div>
        </ModalForm>

}
  
