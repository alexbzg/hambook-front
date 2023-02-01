import React from "react"

import styles from "./LogsList.module.css"
import { DropDownMenu } from "../../components"

export default function LogsList({ ...props }) {

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
                    title: "Delete log",
                    handler: props.onDelete
                }
            ]}/>
    </>
  )
}
