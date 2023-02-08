import { useState, useEffect, useRef, useCallback, forwardRef } from "react"
import { useDispatch } from "react-redux"


import styles from './QsoForm.module.css'

import { useLogs, logUpdate } from "./logsSlice"
import client from "../../services/apiClient"
import { excludeUnset } from "../../utils/forms"
import { FormField, SelectFromObject, CallsignField } from "../../components"
import QsoFieldExtra from "./QsoFieldExtra"
import useInterval from "../../hooks/useInterval"
import { BANDS, QSO_MODES, QSO_FIELDS_EXTRA } from "../../utils/hamRadio"
import buttonClear from "../../assets/img/icons/clear.svg"
import threeDots from "../../assets/img/icons/three_dots.svg"

const splitDateTime = (datetime) => {
   const dtStr = datetime || (new Date()).toISOString()
   return [ dtStr.substring(0,10), dtStr.substring(11,16) ]
}


const QsoForm = forwardRef( ({ logId, prevQso, qso, onCallsignLookup, ...props }, ref) => {
  const formRefFallback = useRef()
  const formRef = ref ?? formRefFallback
  const dispatch = useDispatch()

  const { logs } = useLogs()
  const log = logs.find( item => item.id === logId )

  const callsignInputRef = useRef()

  const [callsignHints, setCallsignHints] = useState()
  const [callsignInputState, setCallsignInputState] = useState('empty')
  const [showExtraFieldsRow, setShowExtraFieldsRow] = useState()

  const timeInputRef = useRef()
  const dateInputRef = useRef()
  const rstrRef = useRef()
  const rstsRef = useRef()
  const bandRef = useRef()
  const modeRef = useRef()
  const freqRef = useRef()

  const [extraFields, setExtraFields] = useState(log.extra_fields)
  const extraFieldsRefs = useRef([])
  const [extraFieldsValues, setExtraFieldsValues] = useState(qso ? {...qso.extra} :
    Object.fromEntries(extraFields.filter( field => QSO_FIELDS_EXTRA[field].persist ).
        map( field => [field, prevQso?.extra?.[field]] ) ) )

  const handleExtraFieldChange = useCallback( async (field, index) => {
    setExtraFields( (state) => {
        const newState = [...state]
        newState[index] = field
        return newState
    })
    extraFieldsRefs.current[index].value = extraFieldsValues[field] ?? ''
  }, [qso])
  useEffect( () => {
    if (JSON.stringify(extraFields) !== JSON.stringify(log.extra_fields)) {
      dispatch( logUpdate({ log_id: logId, log_update: { extra_fields: extraFields } }) )
    }
    setExtraFieldsValues( state => Object.fromEntries(extraFields.map( field => [field,  state[field]] )))
  }, [...extraFields, dispatch, log.extra_fields] )

  const handleExtraFieldValueChange = useCallback( async (value, index) => {
    const field = extraFields[index]
    extraFieldsRefs.current.forEach( (ref, _index) => {
      if (_index !== index && extraFields[_index] === field) {
        ref.value = value
      }
    })
    setExtraFieldsValues( state => ({ ...state, [field]: value }) )
  }, [...extraFields, extraFieldsRefs] )

  const onCallsignChange = useCallback( async (value) => {
    const isValid = callsignInputRef.current.checkValidity()    
    onCallsignLookup?.(isValid ? value : null)
    setCallsignInputState( value ? ( isValid ? 'valid' : 'non-empty' ) : 'empty' )
    if (!qso) {
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
    }
  }, [onCallsignLookup] )

  const clearCallsign = () => {
    callsignInputRef.current.value = null
    onCallsignLookup?.(null)
    setCallsignHints(null)
    setCallsignInputState('empty')
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!qso && document.activeElement !== callsignInputRef.current) {
        callsignInputRef.current.focus()
    } else {
        const { date, time, ...qsoData } = Object.fromEntries(new FormData(formRef.current))
        qsoData.qso_datetime = `${date} ${time}`
        qsoData.extra = excludeUnset(extraFieldsValues)
        if ( await props.onSubmit(qsoData) ) {
            clearCallsign()
            extraFields.forEach( (field, index) => {
                if (!QSO_FIELDS_EXTRA[extraFields[index]].persist) {
                    extraFieldsValues[field] = ''
                    if (extraFieldsRefs.current[index]) {
                        extraFieldsRefs.current[index].value = ''
                    }
                }
            })
        }
    }
  }

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
    freqRef.current.value = Number(freq).toFixed(1)
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

  const [realDateTime, setRealDateTime] = useState(!qso)
  const setDateTimeToReal = useCallback(() => {
    if (realDateTime && timeInputRef.current?.value) {
        const dtStr = (new Date()).toISOString()
        timeInputRef.current.value = dtStr.substring(11,16)
        dateInputRef.current.value = dtStr.substring(0,10)
    }
  }, [realDateTime])
  useEffect( setDateTimeToReal, [setDateTimeToReal] )
  useInterval( setDateTimeToReal, realDateTime ? 1000 : null )

  const _QsoFieldExtra = (id) => (
        <QsoFieldExtra
            key={id}
            field={extraFields[id]}
            value={extraFieldsValues[extraFields[id]]}
            ref={el => extraFieldsRefs.current[id] =  el }
            onFieldChange={(field) => handleExtraFieldChange(field, id)}
            onValueChange={(value) => handleExtraFieldValueChange(value, id)}/>
  )

  return (
      <div className={styles.newQso}>
      {log &&
        <form ref={formRef} onSubmit={onSubmit}>
            <input type="submit" hidden/>
                <div className={styles.flexRow}>
                    <CallsignField
                        required
                        defaultValue={log.callsign}
                        id={styles.myCallsign}
                        note="My callsign"
                        noteClass={styles.note}
                        name="station_callsign"
                    />
                    {!qso &&
                    <div id={styles.realtime}>
                      Manual<br/>time/date<br/>
                      <input
                        type="checkbox"
                        checked={!realDateTime}
                        onChange={() => setRealDateTime( state => !state )}
                        />
                    </div>
                    }
                    <div id={styles.time}>
                        <span className={styles.note}>UTC</span><br/>
                        <input
                            required
                            type="time"
                            name="time"
                            ref={timeInputRef}
                            defaultValue={splitDateTime(qso?.qso_datetime)[1]}
                        />
                    </div>
                    <div id={styles.date}>
                        <span className={styles.note}>Date</span><br/>
                        <input
                            required
                            type="date"
                            name="date"
                            ref={dateInputRef}
                            defaultValue={splitDateTime(qso?.qso_datetime)[0]}
                        />
                    </div>
                    <FormField
                        required
                        ref={freqRef}
                        id={styles.freq}
                        onChange={(e) => onFreqChange(e.target.value)}
                        note="Frequency"
                        noteClass={styles.note}
                        defaultValue={prevQso?.freq ?? Object.values(BANDS)[0].limits[0]}
                        name="freq"
                        type="number"
                        step="0.1"
                    />
                    <div id={styles.band}>
                        <span className={styles.note}>Band</span><br/>
                        <SelectFromObject
                            name="band"
                            ref={bandRef}
                            defaultValue={prevQso?.band ?? Object.keys(BANDS)[0]}
                            onChange={(e) => onBandChange(e.target.value)}
                            options={BANDS}/>
                    </div>
                    <div id={styles.mode}>
                        <span className={styles.note}>Mode</span><br/>
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
                        defaultValue={qso?.callsign}
                        onChange={(e) => onCallsignChange(e.target.value)}
                        ref={callsignInputRef}
                        id={styles.callsign}/>
                  {callsignInputState === 'valid' &&
                  <div
                    id={styles.buttonOk}
                    onClick={() => formRef.current.requestSubmit()}>
                    OK
                  </div>
                  }
                </div>
                <div className={styles.flexRow}>
                     <FormField
                        required
                        ref={rstsRef}
                        id={styles.rsts}
                        note="RST sent"
                        noteClass={styles.note}
                        defaultValue={(prevQso && QSO_MODES[prevQso.qso_mode].rst) ?? 599}
                        name="rst_s"
                        type="number"
                    />
                     <FormField
                        required
                        id={styles.rstr}
                        ref={rstrRef}
                        note="RST received"
                        noteClass={styles.note}
                        defaultValue={(prevQso && QSO_MODES[prevQso.qso_mode].rst) ?? 599}
                        name="rst_r"
                        type="number"
                    />
                    {[0, 1, 2].map( id => _QsoFieldExtra(id) )}
                </div>
                <div
                    id={styles.moreFieldsButton}
                    onClick={() => setShowExtraFieldsRow( state => !state)}>
                    <img
                        src={threeDots}
                        alt="More ADIF fields"
                        title="More ADIF fields"/>
                </div>
                {showExtraFieldsRow &&
                    <div className={styles.flexRow}>
                        {[3, 4, 5, 6].map( id => _QsoFieldExtra(id) )}
                    </div>
                }
        </form>
      }
      </div>
  )
})

export default QsoForm
