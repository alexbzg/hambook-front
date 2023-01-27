import { useRef } from "react"
import styles from './EditQsoForm.module.css'

import { CallsignField, FormField, Modal, SelectFromObject } from "../../components"
import { BANDS, QSO_MODES } from "../../utils/hamRadio"
import QsoForm from "./QsoForm"

export default function EditQsoForm({ modalResult, qso, logId, ...props }) {

    const formRef = useRef()

    return (
        <Modal
            modalResult={(result) => result || modalResult()}
            requestSubmit={() => formRef.current.requestSubmit()}
            styles={{container: styles.modalContainer}}>
            <QsoForm 
                ref={formRef}
                onSubmit={(data) => modalResult(data)} 
                logId={logId}
                qso={qso}
            />
        </Modal>
    )
}

