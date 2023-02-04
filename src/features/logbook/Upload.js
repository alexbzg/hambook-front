import { useState, useEffect, useCallback } from "react"
import styles from './LogsList.module.css'

import { ModalForm, ProgressBar } from "../../components"

export default function Upload({  uploadData, uploadOperation, uploading, ...props }) {

    const [uploadProgress, setUploadProgress] = useState()

    const onUploadProgress = useCallback( (progressEvent) => {
        setUploadProgress(progressEvent.progress)
    }, [] )

    useEffect( () => {
        if (uploadData) {
            const abortController = new AbortController()
            uploadOperation({
                signal: abortController.signal,
                onUploadProgress
            })
            return () => abortController.abort()
        }
    }, [uploadData])

    const cancelButtonProps = {disabled: uploading !== 'loading'}
    const confirmButtonProps = {disabled: uploading === 'loading'}

    return uploadData &&
        <ModalForm 
            {...props}
            cancelButton={cancelButtonProps} 
            confirmButton={confirmButtonProps}
        >
          <div className={styles.logExport}>
            {uploading === 'loading' && 
                <>
                    Uploading {uploadData.file.name}<br/>
                    {uploadProgress &&
                    <ProgressBar bgcolor={"#6a1b9a"} completed={uploadProgress.toFixed(2)*100}/>
                    }
                </>
            }
            {uploading === 'succeeded' &&
                <>
                    File {uploadData.file.name} was uploaded to server and currently is being processed.<br/>
                    You will get notification when the processing is finished.
                </>
            }
            {uploading === 'rejected' &&
                <>
                    Upload failed. Please repeat the operation later or connect technical support.
                </>
            }
          </div>
        </ModalForm>

}
  
