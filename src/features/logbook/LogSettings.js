import React from "react"
import styles from './LogsList.module.css'

import { FormField, Modal } from "../../components"


export default function LogSettings({ modalResult, log, handleInputChange, ...props }) {

    return (
        <Modal modalResult={modalResult}>
          <div className="logSettings">
            <FormField
                name="callsign"
                isValid={() => true}
                defaultValue={log.callsign}
                title="Callsign"
                onChange={handleInputChange}/>
            <FormField
                name="description"
                isValid={() => true}
                defaultValue={log.description}
                title="Description"
                onChange={handleInputChange}/>
         </div>
        </Modal>
    )

}
 
