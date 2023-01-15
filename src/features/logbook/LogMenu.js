import { useState, useCallback, forwardRef } from 'react'

import styles from './LogMenu.module.css'

import { CallsignSearchField } from "../../components"
import { excludeUnset } from "../../utils/forms"

const TABS = [{id: 'log', label: 'Log'}, {id: 'callsignLookup', label: 'Callsign info'}]

const LogMenu = forwardRef(({ onCallsignSearch, activeTab, onActiveTab, logId, ...props }, ref) => {

  const [qsoFilter, setQsoFilter] = useState({})

  const handleCallsignSearch = useCallback( (updateData) => {
      if (activeTab === 'log') {
        if (Object.keys(updateData).some( key => updateData[key] !== qsoFilter[key] )) {
          const newQsoFilter = excludeUnset({ ...qsoFilter, ...updateData })
          onCallsignSearch(newQsoFilter)
          setQsoFilter(newQsoFilter)
        }
      } else if (activeTab === 'callsignLookup') {
        onCallsignSearch(updateData.callsign_search)
      }
  }, [onCallsignSearch, activeTab])

  const Tabs = TABS.map( ({ id, label }) => (
      <span 
        className={activeTab === id ? styles.activeTab : ''}
        onClick={() => onActiveTab(id)}>
        {label}
      </span>
  ))

  return (
    <div className={styles.logMenu}>
      {Tabs}
      <CallsignSearchField
          ref={ref}
          title={null}
          id={styles.callsign}
          allowWildcards={activeTab === 'log'}
          onSearch={(callsign_search) => handleCallsignSearch({ callsign_search })}
      />
    </div>
  )

})

export default LogMenu

