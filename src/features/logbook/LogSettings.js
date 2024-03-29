import React from "react"
import styles from './LogsList.module.css'

import { CallsignField, FormField, ModalForm } from "../../components"

export default function LogSettings({ modalResult, log, ...props }) {

    return (
        <ModalForm modalResult={modalResult}>
          <div className={styles.logSettings}>
              <CallsignField
                defaultValue={log.callsign}
                title="Log callsign"
                required/>
              <FormField
                name="description"
                defaultValue={log.description}
                title="Log description"/>
          </div>
        </ModalForm>
    )

}

