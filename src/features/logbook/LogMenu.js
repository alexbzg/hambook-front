import { useState } from 'react'

import styles from './LogMenu.module.css'

import { CallsignSearchField } from "../../components"
import { excludeUnset } from "../../utils/forms"

const TABS = [{id: 'log', label: 'Log'}, {id: 'callsignLookup', label: 'Callsign info'}]

export default function LogMenu({ onQsoFilter, activeTab, onActiveTab, logId, ...props }) {

  const [qsoFilter, setQsoFilter] = useState({})

  const updateQsoFilter = (updateData) => {
      if (Object.keys(updateData).some( key => updateData[key] !== qsoFilter[key] )) {
        const newQsoFilter = excludeUnset({ ...qsoFilter, ...updateData })
        onQsoFilter(newQsoFilter)
        setQsoFilter(newQsoFilter)
      }
  }

  const Tabs = TABS.map( ({ id, label }) => <span onClick={() => onActiveTab(id)}>{label}</span> )

  return (
    <div className={styles.logMenu}>
      {Tabs}
      {activeTab === 'log' &&
        <CallsignSearchField
            title={null}
            id={styles.callsign}
            onSearch={(callsign_search) => updateQsoFilter({ callsign_search })}
        />
      }
    </div>
  )

}

