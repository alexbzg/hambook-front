import { useState, useEffect, useRef } from "react"

import styles from './LogContent.module.css'

import { useLogs } from "./logsSlice"

import { FormField } from "../../components"
import { BANDS, QSO_MODES } from "../../utils/hamRadio"

const currentDateTime = () => {
   const dtStr = (new Date()).toISOString()
   return [ dtStr.substring(0,10), dtStr.substring(11,16) ]
}


export default function NewQsoForm({ onSubmit, logId, ...props }) {

  const [form, setForm] = useState({
      callsign: null,
      qso_datetime: new Date(),
      band: Object.Keys(BANDS)[0],
      freq: 144508.5,
      qso_mode: Object.Keys(QSO_MODE)[0],
      rst_s: null,
      rst_r: null,
      name: '',
      qth: '',
      comments: ''
  })
  const { logs } = useLogs()

  const log = logs.find( item => item.id === logId )

  const timeInputRef = useRef()
  const dateInputRef = useRef()
  
  const [cancelDateTimeDefaults, setCancelDateTimeDefaults] = useState()

  useEffect( () => {
      const timer = setInterval(() => {
          if (timeInputRef.current) {
            timeInputRef.current.value = currentDateTime()[1]
            dateInputRef.current.value = currentDateTime()[0]
          }
      }, 1000)
      const cleanup = () => {
        clearTimeout(timer)
      }
      setCancelDateTimeDefaults(() => cleanup)
      return cleanup
  }, [])

  const handleInputChange = (name, value) => {
  }

  const handleDateTimeInputChange = (name, value) => {
    cancelDateTimeDefaults()
    handleInputChange(name, value)
  }

  return (
      <div className={styles.newQso}>
      {log && <>
        <div id={styles.callsign}>
            {log.callsign}
        </div>
        <div id={styles.qsoData}>
            <div className={styles.flexRow}>
                <div id={styles.time}>
                    <input
                        type="time"
                        ref={timeInputRef}
                        onChange={(e) => handleDateTimeInputChange("time", e.target.value)}
                        defaultValue={currentDateTime()[1]}
                    />
                    <input
                        type="date"
                        ref={dateInputRef}
                        onChange={(e) => handleDateTimeInputChange("date", e.target.value)}
                        defaultValue={currentDateTime()[0]}
                    />
                </div>
            </div>
        </div>  
        </>
      }
      </div>
  )
}
