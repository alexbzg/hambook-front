import { useState, useEffect, useRef, useCallback, useId } from "react"

import styles from './NewQsoForm.module.css'

import { useLogs } from "./logsSlice"

import { FormField, SelectFromObject, CallsignField } from "../../components"
import useInterval from "../../hooks/useInterval"
import { BANDS, QSO_MODES } from "../../utils/hamRadio"
import buttonClear from "../../assets/img/icons/clear.svg"

const currentDateTime = () => {
   const dtStr = (new Date()).toISOString()
   return [ dtStr.substring(0,10), dtStr.substring(11,16) ]
}


export default function NewQsoForm({ logId, ...props }) {
  const ID = useId()
  const { logs } = useLogs()
  const log = logs.find( item => item.id === logId )

  const callsignInputRef = useRef()
  const stationCallsignInputRef = useRef()

  const onSubmit = async (e) => {
    e.preventDefault()
    if (await props.onSubmit(new FormData(document.forms[ID]))) {
      callsignInputRef.current.value = null
    }
  }

  const timeInputRef = useRef()
  const dateInputRef = useRef()
  const [realDateTime, setRealDateTime] = useState(true)
  const setDateTimeToReal = useCallback(() => {
    if (realDateTime && timeInputRef.current?.value) {
        const dtStr = (new Date()).toISOString()
        timeInputRef.current.value = dtStr.substring(11,16)
        dateInputRef.current.value = dtStr.substring(0,10)
    }
  }, [realDateTime])
  useEffect( setDateTimeToReal, [setDateTimeToReal] )
  useInterval( setDateTimeToReal, realDateTime ? 1000 : null )

  return (
      <div className={styles.newQso}>
      {log &&
        <form id={ID} onSubmit={onSubmit}>
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
                            name="time"
                            ref={timeInputRef}
                            defaultValue={currentDateTime()[1]}
                        />
                    </div>
                    <div id={styles.date}>
                        <span className={styles.note}>date</span><br/>
                        <input
                            required
                            type="date"
                            name="date"
                            ref={dateInputRef}
                            defaultValue={currentDateTime()[0]}
                        />
                    </div>
                    <FormField
                        required
                        id={styles.freq}
                        note="frequency"
                        noteClass={styles.note}
                        defaultValue="144000"
                        name="freq"
                        type="number"
                        step="0.1"
                    />
                    <div id={styles.band}>
                        <span className={styles.note}>band</span><br/>
                        <SelectFromObject
                            name="band"
                            defaultValue={Object.keys(BANDS)[0]}
                            options={BANDS}/>
                    </div>
                    <div id={styles.mode}>
                        <span className={styles.note}>mode</span><br/>
                        <SelectFromObject
                            name="qso_mode"
                            defaultValue={Object.keys(QSO_MODES)[0]}
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
                  <CallsignField
                        title={null}
                        name="callsign"
                        required
                        ref={callsignInputRef}
                        id={styles.callsign}/>
                  <div 
                    id={styles.buttonOk}
                    onClick={() => document.forms[ID].requestSubmit()}>
                    OK
                  </div>
                </div>
                <div className={styles.flexRow}>
                     <FormField
                        required
                        id={styles.rsts}
                        note="rst sent"
                        noteClass={styles.note}
                        defaultValue="599"
                        name="rst_s"
                        type="number"
                    />
                     <FormField
                        required
                        id={styles.rstr}
                        note="rst sent"
                        noteClass={styles.note}
                        defaultValue="599"
                        name="rst_r"
                        type="number"
                    />
                     <FormField
                        id={styles.name}
                        note="corr name"
                        noteClass={styles.note}
                        name="name"
                    />
                     <FormField
                        id={styles.qth}
                        note="corr qth"
                        noteClass={styles.note}
                        name="qth"
                    />
                     <FormField
                        id={styles.comment}
                        note="comment"
                        noteClass={styles.note}
                        name="comment"
                    />
                </div>
                <div>
                  <CallsignField
                    ref={stationCallsignInputRef}
                    id={styles.stationCallsign}
                    name="station_callsign"
                    defaultValue={log.callsign}
                    required/>
                </div>
        </form>
      }
      </div>
  )
}
