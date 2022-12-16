import React from "react"

import styles from './LogsList.module.css'

import { DropDownMenu } from "../../components"

export default function Qso({ data, onDelete, onEdit, ...props }) {

  return (
      <div className={styles.loqRow}>
        <div className={styles.date}>
            {data.qso_datetime}
        </div>
        <div className={styles.freq}>
            {data.freq}
        </div>
        <div className={styles.mode}>
            {data.qso_mode}
        </div>
        <div className={styles.callsign}>
            {data.callsign}
        </div>
        <div className={styles.rst}>
            {data.rst_s}
        </div>
        <div className={styles.rst}>
            {data.rst_r}
        </div>
        <div className={styles.name}>
            {data.name}
        </div>
        <div className={styles.qth}>
            {data.qth}
        </div>
        <DropDownMenu 
            items={[
                {
                    title: "Delete QSO",
                    handler: onDelete
                },
                {
                    title: "Edit QSO",
                    handler: onEdit
                }
            ]}/>

      </div>
  )
}
