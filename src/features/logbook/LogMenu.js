import {useRef, useState} from 'react'

import styles from './LogMenu.module.css'

import { CallsignSearchField } from "../../components"

const TABS = [{id: 'log', label: 'Log'}, {id: 'callsignLookup', label: 'Callsign info'}]

const LogMenu = ({ 
    onCallsignSearch, 
    onCallsignLookup,
    onCallsignLookupValid,
    callsignLookup, 
    onActiveTab, 
    ...props }) => {

  const [activeTab, setActiveTab] = useState('log')
  const callsignInputRef = useRef()

  const handleTabClick = (tabId) => {
    if (activeTab !== tabId) {
        if (tabId === 'callsignLookup') {
            onCallsignLookupValid(callsignInputRef.current.checkValidity() ? 
                callsignInputRef.current.value : null)
        }
        setActiveTab(tabId)
        onActiveTab(tabId)
    }
  }

  const Tabs = TABS.map( ({ id, label }) => (
      <span 
        key={id}
        className={activeTab === id ? styles.activeTab : ''}
        onClick={() => handleTabClick(id)}>
        {label}
      </span>
  ))

  return (
    <div className={styles.logMenu}>
      {Tabs}
      <CallsignSearchField
          ref={callsignInputRef}
          title={null}
          id={styles.callsign}
          onChange={(e) => onCallsignLookup(e.target.value)}
          searchExpression={callsignLookup}
          allowWildcards={activeTab === 'log'}
          onSearch={onCallsignSearch}
      />
    </div>
  )

}

export default LogMenu

