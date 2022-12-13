import { useState, useEffect, useRef, useCallback } from "react"

import styles from './NewQsoForm.module.css'

import { useLogs } from "./logsSlice"

import { useForm } from "../../components"
import useInterval from "../../hooks/useInterval"
import { BANDS, QSO_MODES } from "../../utils/hamRadio"

const currentDateTime = () => {
   const dtStr = (new Date()).toISOString()
   return [ dtStr.substring(0,10), dtStr.substring(11,16) ]
}


export default function NewQsoForm({ onSubmit, logId, ...props }) {

  const { logs } = useLogs()
  const log = logs.find( item => item.id === logId )
  const initialFormState = {
      station_callsign: log?.callsign,
      callsign: null,
      qso_datetime: new Date(),
      band: Object.keys(BANDS)[0],
      freq: 144508.5,
      qso_mode: Object.keys(QSO_MODES)[0],
      rst_s: 599,
      rst_r: 599,
      name: '',
      qth: '',
      comment: ''
  }
  const { handleInputChange, handleSubmit, FormFields } = useForm({ initialFormState, onSubmit })

  const timeInputRef = useRef()
  const dateInputRef = useRef()
  const [realDateTime, setRealDateTime] = useState([true, true])
  const updateDateTime = useCallback(() => handleInputChange("qso_datetime",
            `${dateInputRef.current.value} ${timeInputRef.current.value}`), [])
  const setDateTimeToReal = useCallback(() => {
    const dtStr = (new Date()).toISOString()
    if (realDateTime[1]) {
        timeInputRef.current.value = dtStr.substring(11,16)
    }
    if (realDateTime[0]) {
        dateInputRef.current.value = dtStr.substring(0,10)
    }
    updateDateTime()
  }, [realDateTime])
  useEffect( setDateTimeToReal, [setDateTimeToReal] )
  useInterval( setDateTimeToReal, 
      realDateTime[0] || realDateTime[1] ? 1000 : null )

  const handleDateTimeInputChange = useCallback((name, value) => {
    setRealDateTime( state => name === "date" ? [false, state[1]] : [state[0], false] )
    updateDateTime()
  }, [])

  return (
      <div className={styles.newQso}>
      {log &&
        <form onSubmit={handleSubmit}>
            <input type="submit" hidden/>
                <div className={styles.flexRow}>
                    <div id={styles.time}>
                        <span className={styles.note}>UTC</span><br/>
                        <input
                            type="time"
                            ref={timeInputRef}
                            onChange={(e) => handleDateTimeInputChange("time", e.target.value)}
                            defaultValue={currentDateTime()[1]}
                        />
                        <span className={styles.realDateTime}>
                            <input 
                                type="checkbox"
                                checked={realDateTime[1]}
                                onChange={() => setRealDateTime( state => [state[0], !state[1]])}
                            />
                            real time
                        </span>
                    </div>
                    <div id={styles.date}>
                        <span className={styles.note}>Date</span><br/>
                        <input
                            type="date"
                            ref={dateInputRef}
                            onChange={(e) => handleDateTimeInputChange("date", e.target.value)}
                            defaultValue={currentDateTime()[0]}
                        />
                        <span className={styles.realDateTime}>
                            <input 
                                type="checkbox"
                                checked={realDateTime[0]}
                                onChange={() => setRealDateTime( state => [!state[0], state[1]])}
                            />
                            real date
                        </span>
                    </div>
                    <div id={styles.band}>
                        <span className={styles.note}>Band</span><br/>
                        <select
                            name="band"
                            onChange={handleInputChange}
                            defaultValue={initialFormState.band}>
                            {Object.keys(BANDS).map( (band, index) =>
                                <option
                                    key={band}
                                    value={band}
                                >{band}</option>)}
                        </select>
                    </div>
                    {FormFields([{
                        id: styles.freq,
                        note: "Frequency",
                        noteClass: styles.note,
                        name: "freq",
                        type: "number",
                        step: 0.1
                    }])}
                    <div id={styles.mode}>
                        <span className={styles.note}>Mode</span><br/>
                        <select
                            name="qso_mode"
                            onChange={handleInputChange}
                            defaultValue={initialFormState.qso_mode}>
                            {Object.keys(QSO_MODES).map( (mode, index) =>
                                <option
                                    key={mode}
                                    value={mode}
                                >{mode}</option>)}
                        </select>
                    </div>
                </div>
                {FormFields([
                  {
                      id: styles.callsign,
                      name: "callsign",
                      type: "text"
                  },
                  {
                      id: styles.stationCallsign,
                      name: "station_callsign",
                      type: "text"
                  },
                ])}
                <div className={styles.flexRow}>
                     {FormFields([
                         {
                            id: styles.rsts,
                            note: "RST Sent",
                            noteClass: styles.note,
                            name: "rst_s",
                            type: "number"
                        },
                        {
                            id: styles.rstr,
                            note: "RST Received",
                            noteClass: styles.note,
                            name: "rst_r",
                            type: "number"
                        },
                        {
                            id: styles.name,
                            note: "Correspondent Name",
                            name: "name",
                            noteClass: styles.note,
                            type: "text"
                        },
                        {
                            id: styles.qth,
                            name: "qth",
                            note: "Correspondent QTH",
                            noteClass: styles.note,
                            type: "text"
                        },
                        {
                            id: styles.comment,
                            name: "comment",
                            note: "Comment",
                            noteClass: styles.note,
                            type: "text"
                        }
                     ])}
                </div>
        </form>
      }
      </div>
  )
}
