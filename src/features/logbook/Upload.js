import { useState } from "react"
import styles from './LogsList.module.css'

import { FormField, ModalForm } from "../../components"

export default function LogSettings({ modalResult, log, ...props }) {

    const [ exportAll, setExportAll ] = useState(true)

    return (
        <ModalForm modalResult={modalResult}>
          <div className={styles.logExport}>
          </div>
        </ModalForm>
    )

}

