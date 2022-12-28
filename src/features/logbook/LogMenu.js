import { useState } from 'react'

import styles from './LogMenu.module.css'

import { CallsignSearchField } from "../../components"
import { excludeUnset } from "../../utils/forms"

export default function LogMenu({ onQsoFilter, logId, ...props }) {

  const [qsoFilter, setQsoFilter] = useState({})

  const updateQsoFilter = (updateData) => {
      if (Object.keys(updateData).some( key => updateData[key] !== qsoFilter[key] )) {
        const newQsoFilter = excludeUnset({ ...qsoFilter, ...updateData })
        onQsoFilter(newQsoFilter)
        setQsoFilter(newQsoFilter)
      }
  }

  return (
    <div className={styles.logMenu}>
      <span>Log</span>
      <span>Callsign info</span>
      <CallsignSearchField
        title={null}
        id={styles.callsign}
        onSearch={(callsign_search) => updateQsoFilter({ callsign_search })}
      />
    </div>
  )

}

