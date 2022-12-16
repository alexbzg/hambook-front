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
            {props.qso_count} QSO
        </div>

        <DropDownMenu 
            items={[
                {
                    title: "Open",
                    handler: props.onOpen
                },
                {
                    title: "Log settings",
                    handler: props.onEdit
                },
                {
                    title: "Delete log",
                    handler: props.onDelete
                }
            ]}/>
    </>
  )
}
