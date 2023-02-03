import { useRef } from "react"

import styles from "./LogsList.module.css"
import { DropDownMenu } from "../../components"

export default function LogsList({ ...props }) {

  const importFileRef = useRef()

  const handleImport = async (file) => {
    await props.onImport(file)
    importFileRef.current.value = null
  }

  return (
    <>
        <div className={styles.logCallsign}>
            {props.callsign}
        </div>
        <div className={styles.logDescription}>
            {props.description}
        </div>
       <div className={styles.logQso}>
            {props.qso_count ?? 0} QSO
        </div>

        <DropDownMenu
            items={[
                {
                    title: "Open log",
                    handler: props.onOpen
                },
                {
                    title: "Log settings",
                    handler: props.onEdit
                },
                {
                    title: "ADIF export",
                    handler: props.onExport
                },
                {
                    title: "ADIF import",
                    handler: () => importFileRef.current.click()
                },
                {
                    title: "Delete log",
                    handler: props.onDelete
                }
            ]}/>
        <input type="file"
            ref={importFileRef}
            id="importFile"
            hidden
            onChange={(e) => handleImport(e.target.files[0])}
            onClickCapture={(e) => e.nativeEvent.stopImmediatePropagation()}
        />
    </>
  )
}
