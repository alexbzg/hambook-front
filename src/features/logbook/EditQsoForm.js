import React from "react"
import styles from './EditQsoForm.module.css'

import { CallsignField, FormField, ModalForm, SelectFromObject } from "../../components"
import { BANDS, QSO_MODES } from "../../utils/hamRadio"

export default function EditQsoForm({ modalResult, qso, ...props }) {

    return (
        <ModalForm modalResult={modalResult}>
            <div className={styles.flexRow}>
                <div id={styles.time}>
                    <span className={styles.note}>utc</span><br/>
                    <input
                        required
                        name="time"
                        type="time"
                        defaultValue={qso.qso_datetime.substring(11, 16)}
                    />
                </div>
                <div id={styles.date}>
                    <span className={styles.note}>date</span><br/>
                    <input
                        required
                        name="date"
                        type="date"
                        defaultValue={qso.qso_datetime.substring(0, 10)}
                    />
                </div>
                <FormField
                    required
                    id={styles.freq}
                    note="frequency"
                    noteClass={styles.note}
                    defaultValue={qso.freq}
                    name="freq"
                    type={"number"}
                    step="0.1"/>
                <div id={styles.band}>
                    <span className={styles.note}>band</span><br/>
                    <SelectFromObject
                        name="band"
                        defaultValue={qso.band}
                        options={BANDS}/>
                </div>
                <div id={styles.mode}>
                    <span className={styles.note}>mode</span><br/>
                    <SelectFromObject
                        name="qso_mode"
                        defaultValue={qso.qso_mode}
                        options={QSO_MODES}/>
                </div>
            </div>
            <div className={styles.flexRow}>
                <CallsignField
                    note="Correspondent callsign"
                    required
                    defaultValue={qso.callsign}
                    id={styles.callsign}/>
            </div>
            <div className={styles.flexRow}>
                <FormField
                    required
                    id={styles.rsts}
                    defaultValue={qso.rst_s}
                    note="rst sent"
                    noteClass={styles.note}
                    name="rst_s"
                    type="number"
                />
                <FormField
                    required
                    id={styles.rstr}
                    defaultValue={qso.rst_r}
                    note="rst received"
                    noteClass={styles.note}
                    name="rst_r"
                    type="number"
                />
                <FormField
                    id={styles.name}
                    note="corr name"
                    name="name"
                    defaultValue={qso.name}
                    noteClass={styles.note}
                />
                <FormField
                    id={styles.qth}
                    name="qth"
                    note="corr qth"
                    defaultValue={qso.qth}
                    noteClass={styles.note}
                />
                <FormField
                    id={styles.comment}
                    name="comment"
                    note="comment"
                    noteClass={styles.note}
                    defaultValue={qso.comment}
                    type="text"
                />
            </div>
            <div>
                <CallsignField
                    id={styles.stationCallsign}
                    name="station_callsign"
                    defaultValue={qso.station_callsign}
                    required
                />
            </div>
        </ModalForm>
    )
}
 
