import { useState, useEffect, useRef, useCallback, useId } from "react"

import styles from './NewQsoForm.module.css'

import { useLogs } from "./logsSlice"
import client from "../../services/apiClient"

import { FormField, SelectFromObject, CallsignField } from "../../components"
import useInterval from "../../hooks/useInterval"
import { BANDS, QSO_MODES } from "../../utils/hamRadio"
import buttonClear from "../../assets/img/icons/clear.svg"

const currentDateTime = () => {
   const dtStr = (new Date()).toISOString()
   return [ dtStr.substring(0,10), dtStr.substring(11,16) ]
}


export default function NewQsoForm({ logId, prevQso, onCallsignLookup, ...props }) {
  const ID = useId()
  const { logs } = useLogs()
  const log = logs.find( item => item.id === logId )

  const callsignInputRef = useRef()

  const [callsignHints, setCallsignHints] = useState()
  const [callsignInputState, setCallsignInputState] = useState('empty')

  const onCallsignChange = useCallback( async (value) => {
    const isValid = callsignInputRef.current.checkValidity()
    onCallsignLookup(isValid ? value : null)
    setCallsignInputState( value ? ( isValid ? 'valid' : 'non-empty' ) : 'empty' )
    let hints = null
    if (value?.length > 3) {
      try {
        hints = await client({
         		url: `/callsigns/autocomplete/${value}`,
                method: 'GET',
                token: 'skip',
                suppressErrorMessage: true
            })
      } catch {
      }
    }
    setCallsignHints(hints)
  }, [onCallsignLookup] )

  const clearCallsign = () => {
    callsignInputRef.current.value = null
    onCallsignLookup(null)
    setCallsignHints(null)
    setCallsignInputState('empty')
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    if (await props.onSubmit(new FormData(document.forms[ID]))) {
      clearCallsign()
    }
  }

  const timeInputRef = useRef()
  const dateInputRef = useRef()
  const rstrRef = useRef()
  const rstsRef = useRef()
  const bandRef = useRef()
  const modeRef = useRef()
  const freqRef = useRef()

  const setFreq = () => {
    const mode = modeRef.current.value
    const band = bandRef.current.value
    freqRef.current.value = QSO_MODES[mode].defFreqs?.[band] || BANDS[band].limits[0]
  }

  const onBandChange = () => {
    setFreq()
  }

  const onModeChange = (mode) => {
    setFreq()
    const rst = QSO_MODES[mode].rst
    rstrRef.current.value = rst
    rstsRef.current.value = rst
  }

  const onFreqChange = (freq) => {
    const strFreq = '' + freq
    if (strFreq.length > 1) {
      const MODE = QSO_MODES[modeRef.current.value]
      if (MODE.defFreqs) {
        const band = Object.keys(MODE.defFreqs).find( band => ('' + MODE.defFreqs[band]).startsWith(strFreq))
        if (band) {
            bandRef.current.value = band
            freqRef.current.value = MODE.defFreqs[band]
            return
        }
      }
      const band = Object.keys(BANDS).find( band => BANDS[band].limits[0] <= freq && BANDS[band].limits[1] >= freq)
      if (band) {
        bandRef.current.value = band
      }
    }
  }

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
                    <CallsignField
                        required
                        defaultValue={log.callsign}
                        id={styles.myCallsign}
                        note="my callsign"
                        noteClass={styles.note}
                        name="station_callsign"
                    />
                    <div id={styles.realtime}>
                      manual<br/>time/date<br/>
                      <input
                        type="checkbox"
                        checked={!realDateTime}
                        onChange={() => setRealDateTime( state => !state )}
                        />
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
                        ref={freqRef}
                        id={styles.freq}
                        onChange={(e) => onFreqChange(e.target.value)}
                        note="frequency"
                        noteClass={styles.note}
                        defaultValue={prevQso?.freq ?? Object.values(BANDS)[0].limits[0]}
                        name="freq"
                        type="number"
                        step="0.1"
                    />
                    <div id={styles.band}>
                        <span className={styles.note}>band</span><br/>
                        <SelectFromObject
                            name="band"
                            ref={bandRef}
                            defaultValue={prevQso?.band ?? Object.keys(BANDS)[0]}
                            onChange={(e) => onBandChange(e.target.value)}
                            options={BANDS}/>
                    </div>
                    <div id={styles.mode}>
                        <span className={styles.note}>mode</span><br/>
                        <SelectFromObject
                            name="qso_mode"
                            ref={modeRef}
                            onChange={(e) => onModeChange(e.target.value)}
                            defaultValue={prevQso?.qso_mode ?? Object.keys(QSO_MODES)[0]}
                            options={QSO_MODES}/>
                    </div>
                </div>
                <div className={styles.flexRow}>
                  {callsignInputState !== 'empty' &&
                  <div id={styles.buttonClear}>
                    <img
                        src={buttonClear}
                        onClick={clearCallsign}
                        alt="Clear callsign"
                        title="Clear callsign"/>
                  </div>
                  }
                  <CallsignField
                        title={null}
                        name="callsign"
                        required
                        hints={callsignHints}
                        onChange={(e) => onCallsignChange(e.target.value)}
                        ref={callsignInputRef}
                        id={styles.callsign}/>
                  {callsignInputState === 'valid' &&
                  <div
                    id={styles.buttonOk}
                    onClick={() => document.forms[ID].requestSubmit()}>
                    OK
                  </div>
                  }
                </div>
                <div className={styles.flexRow}>
                     <FormField
                        required
                        ref={rstsRef}
                        id={styles.rsts}
                        note="rst sent"
                        noteClass={styles.note}
                        defaultValue={(prevQso && QSO_MODES[prevQso.qso_mode].rst) ?? 599}
                        name="rst_s"
                        type="number"
                    />
                     <FormField
                        required
                        id={styles.rstr}
                        ref={rstrRef}
                        note="rst received"
                        noteClass={styles.note}
                        defaultValue={(prevQso && QSO_MODES[prevQso.qso_mode].rst) ?? 599}
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
        </form>
      }
      </div>
  )
}
