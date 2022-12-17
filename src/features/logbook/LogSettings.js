import React from "react"
import styles from './LogsList.module.css'

import { CallsignField, FormField, Modal } from "../../components"
const FORM_ID = "logSettingsForm"

export default function LogSettings({ modalResult, log, handleInputChange, ...props }) {

    const requestSubmit = () => {
      document.forms[FORM_ID].requestSubmit()
      return document.forms[FORM_ID].checkValidity()
    }

    return (
        <Modal modalResult={modalResult} requestSubmit={requestSubmit}>
          <div className="logSettings">
            <form id={FORM_ID} onSubmit={(e) => e.preventDefault()}>
              <CallsignField
                defaultValue={log.callsign}
                required
                onChange={handleInputChange}/>
              <FormField
                name="description"
                defaultValue={log.description}
                title="Description"
                onChange={handleInputChange}/>
            </form>
          </div>
        </Modal>
    )

}
 
