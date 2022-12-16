import { useState, useEffect, useRef, useCallback } from "react"

import styles from './NewQsoForm.module.css'

import { useLogs } from "./logsSlice"

import { useForm, SelectFromObject } from "../../components"
import useInterval from "../../hooks/useInterval"
import { BANDS, QSO_MODES } from "../../utils/hamRadio"
import buttonClear from "../../assets/img/icons/clear.svg"
import { RE_STR_CALLSIGN_FULL } from "../../utils/validation"

const currentDateTime = () => {
   const dtStr = (new Date()).toISOString()
   return [ dtStr.substring(0,10), dtStr.substring(11,16) ]
}


export default function NewQsoForm({ logId, ...props }) {

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

  const callsignInputRef = useRef()
  const stationCallsignInputRef = useRef()

  const onSubmit = async (data) => {
    if (await props.onSubmit(data)) {
      callsignInputRef.current.value = null
    }
  }
  const { handleInputChange, setForm, handleSubmit, FormFields } = 
        useForm({ initialFormState, onSubmit })
  const _handleInputChange = useCallback((e) => 
      handleInputChange(e.target.name, e.target.value), [])

  useEffect(() => {
    if (stationCallsignInputRef.current && !stationCallsignInputRef.current.value) {
      stationCallsignInputRef.current.value = log?.callsign
    }
    setForm( state => ({ ...state, station_callsign: log?.callsign }) )
      
  }, [stationCallsignInputRef, log?.callsign])

  const timeInputRef = useRef()
  const dateInputRef = useRef()
  const [realDateTime, setRealDateTime] = useState(true)
  const updateDateTime = useCallback(() => handleInputChange("qso_datetime",
            `${dateInputRef.current.value} ${timeInputRef.current.value}`), [])
  const setDateTimeToReal = useCallback(() => {
    if (realDateTime && timeInputRef.current?.value) {
        const dtStr = (new Date()).toISOString()
        timeInputRef.current.value = dtStr.substring(11,16)
        dateInputRef.current.value = dtStr.substring(0,10)
        updateDateTime()
    }
  }, [realDateTime])
  useEffect( setDateTimeToReal, [setDateTimeToReal] )
  useInterval( setDateTimeToReal, realDateTime ? 1000 : null )

  const handleDateTimeInputChange = useCallback(() => {
    setRealDateTime( false )
    updateDateTime()
  }, [])

  return (
      <div className={styles.newQso}>
      {log &&
        <form id="qsoForm" onSubmit={handleSubmit}>
            <input type="submit" hidden/>
                <div className={styles.flexRow}>
                    <div id={styles.realtime}>
                        <span className={styles.realDateTime}>
                             <input
                                type="checkbox"
                                checked={!realDateTime}
                                onChange={() => setRealDateTime( state => !state )}
                            />
                            <span>manual<br/>time/date</span>
                        </span>
                    </div>
                    <div id={styles.time}>
                        <span className={styles.note}>utc</span><br/>
                        <input
                            required
                            type="time"
                            ref={timeInputRef}
                            onChange={handleDateTimeInputChange}
                            defaultValue={currentDateTime()[1]}
                        />
                    </div>
                    <div id={styles.date}>
                        <span className={styles.note}>date</span><br/>
                        <input
                            required
                            type="date"
                            ref={dateInputRef}
                            onChange={handleDateTimeInputChange}
                            defaultValue={currentDateTime()[0]}
                        />
                    </div>
                    {FormFields([{
                        required: true,
                        id: styles.freq,
                        note: "frequency",
                        noteClass: styles.note,
                        name: "freq",
                        type: "number",
                        step: 0.1
                    }])}
                    <div id={styles.band}>
                        <span className={styles.note}>band</span><br/>
                        <SelectFromObject
                            name="band"
                            onChange={_handleInputChange}
                            defaultValue={initialFormState.band}
                            options={BANDS}/>
                    </div>
                    <div id={styles.mode}>
                        <span className={styles.note}>mode</span><br/>
                        <SelectFromObject
                            name="qso_mode"
                            onChange={_handleInputChange}
                            defaultValue={initialFormState.qso_mode}
                            options={QSO_MODES}/>
                    </div>
                </div>
                <div className={styles.flexRow}>
                  <div id={styles.buttonClear}>
                    <img
                        src={buttonClear}
                        onClick={() => callsignInputRef.current.value = null}
                        alt="Clear callsign"
                        title="Clear callsign"/>
                  </div>
                  {FormFields([
                    {
                        required: true,
                        invalidMessage: 'Enter valid callsign.',
                        pattern: RE_STR_CALLSIGN_FULL,
                        ref: callsignInputRef,
                        id: styles.callsign,
                        name: "callsign",
                        type: "text"
                    }
                  ])}
                  <div 
                    id={styles.buttonOk}
                    onClick={() => document.forms.qsoForm.requestSubmit()}>
                    OK
                  </div>
                </div>
                <div className={styles.flexRow}>
                     {FormFields([
                         {
                            required: true,
                            id: styles.rsts,
                            note: "rst sent",
                            noteClass: styles.note,
                            name: "rst_s",
                            type: "number"
                        },
                        {
                            required: true,
                            id: styles.rstr,
                            note: "rst received",
                            noteClass: styles.note,
                            name: "rst_r",
                            type: "number"
                        },
                        {
                            id: styles.name,
                            note: "corr name",
                            name: "name",
                            noteClass: styles.note,
                            type: "text"
                        },
                        {
                            id: styles.qth,
                            name: "qth",
                            note: "corr qth",
                            noteClass: styles.note,
                            type: "text"
                        },
                        {
                            id: styles.comment,
                            name: "comment",
                            note: "comment",
                            noteClass: styles.note,
                            type: "text"
                        }
                     ])}
                </div>
                <div>
                  {FormFields([
                  {
                      ref: stationCallsignInputRef,
                      id: styles.stationCallsign,
                      name: "station_callsign",
                      type: "text"
                  }
                ])}
                </div>
        </form>
      }
      </div>
  )
}
