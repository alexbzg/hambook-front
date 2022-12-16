import { useState, useRef } from "react"

import { CSSTransition } from "react-transition-group";

import styles from "./Modal.module.css"

export default function ({ modalResult, title, children, confirmLabel, cancelLabel, confirmCheckbox }) {

  const [show, setShow] = useState(true)
  const [confirmChecked, setConfirmChecked] = useState(!confirmCheckbox)
  const nodeRef = useRef(null)

  const setResult = (result) => {
    setShow(false)
    modalResult(result)
  }


  return (
    <CSSTransition
      nodeRef={nodeRef}
      in={show}
      timeout={500}
      classNames={{
        enterActive: styles.modalEnterActive,
        enterDone: styles.modalEnterDone,
        exitActive: styles.modalExit,
        exitDone: styles.modalExitActive
      }}
    >
        <div className={styles.modalMask} ref={nodeRef}>
            <div className={styles.modalWrapper}>
                <div className={styles.modalContainer}>

                    {Boolean(title) &&
                      <div className={styles.modalHeader}>
                        {title}
                      </div>
                    }

                    <div className={styles.modalBody}>
                        {children}
                        {confirmCheckbox && (
                            <div classname={styles.confirmCheckboxContainer}>
                                <input type="checkbox" onChange={(e) => setConfirmChecked(e.target.checked)}/>
                                I confirm this operation.
                            </div>
                        )}
                    </div>

                    <div className={styles.modalFooter}>
                        <button 
                            disabled={!confirmChecked}
                            className={styles.modalDefaultButton} 
                            onClick={() => setResult(true)}>
                            {confirmLabel || `OK`}
                        </button>
                        <button 
                            className={styles.modalCancelButton} 
                            onClick={() => setResult(false)}>
                            {cancelLabel || `Cancel`}
                        </button>

                    </div>
                </div>
            </div>
        </div>
    </CSSTransition>
    )
}
