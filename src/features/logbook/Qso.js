import React from "react"

import styles from './Qso.module.css'

import { DropDownMenu } from "../../components"
import { formatDate } from "../../utils/datetime"

export default function Qso({ data, onDelete, onEdit, ...props }) {

  return (
      <tr className={styles.loqRow}>
        <td className={styles.date}>
            {formatDate(data.qso_datetime)}
        </td>
        <td className={styles.time}>
            {data.qso_datetime.substring(11, 16)}
        </td>
        <td className={styles.freq}>
            {data.freq}
        </td>
        <td className={styles.mode}>
            {data.qso_mode}
        </td>
        <td className={styles.callsign}>
            {data.callsign}
        </td>
        <td className={styles.rst}>
            {data.rst_s}
        </td>
        <td className={styles.rst}>
            {data.rst_r}
        </td>
        <td className={styles.name}>
            {data.name}
        </td>
        <td className={styles.qth}>
            {data.qth}
        </td>
        <td>
            <DropDownMenu
            styles={{
                menuButton: styles.menuButton,
                menuWrapper: styles.menuWrapper
            }}
            items={[
                {
                    title: "Edit QSO",
                    handler: onEdit
                },
                {
                    title: "Delete QSO",
                    handler: onDelete
                }
            ]}/>
        </td>
      </tr>
  )
}
