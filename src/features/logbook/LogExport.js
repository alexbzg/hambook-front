import { useState } from "react"
import styles from './LogsList.module.css'

import { FormField, ModalForm } from "../../components"

export default function LogSettings({ modalResult, log, ...props }) {

    const [ exportAll, setExportAll ] = useState(true)

    return (
        <ModalForm modalResult={modalResult}>
          <div className={styles.logExport}>
            <div id={styles.exportAll}>
                <input
                type="checkbox"
                checked={exportAll}
                onChange={() => setExportAll( state => !state )}
                />
                export all 
            </div>
            <FormField
                name="date_begin"
                type="date"
                defaultValue={ new Date().toISOString().substring(0, 10)}
                disabled={exportAll}
                title="from"/>
            <FormField
                name="date_end"
                type="date"
                defaultValue={ new Date().toISOString().substring(0, 10)}
                disabled={exportAll}
                title="to"/>
          </div>
        </ModalForm>
    )

}

