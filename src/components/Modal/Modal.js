import { useState, useRef } from "react"

import { CSSTransition } from "react-transition-group";

import styles from "./Modal.module.css"

export default function Modal({ 
    modalResult, 
    title, 
    children, 
    confirmButton, 
    cancelButton, 
    confirmCheckbox, 
    requestSubmit,
    ...props
    }) {

  const [show, setShow] = useState(true)
  const [confirmChecked, setConfirmChecked] = useState(!confirmCheckbox)
  const nodeRef = useRef(null)

  const close = (result) => {
    setShow(false)
    modalResult(result)
  }

  const setResult = (result) => {
    if (result && requestSubmit) {
        const requestSubmitCheck = requestSubmit()
        if (requestSubmitCheck instanceof Promise) {
            requestSubmitCheck
                .then((requestSubmitResult) => {
                    if (requestSubmitResult)
                        close(result)
                })
            return
        } else if (!requestSubmitCheck)
            return
    } 
    close(result)
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
                <div className={[styles.modalContainer, props.styles?.container].join(' ')}>
                    {Boolean(title) &&
                      <div className={styles.modalHeader}>
                        {title}
                      </div>
                    }

                    <div className={styles.modalBody}>
                        {children}
                    </div>

                    <div className={styles.modalFooter}>
                        {confirmCheckbox && (
                            <div classname={styles.modalConfirmCheckboxContainer}>
                                <input type="checkbox" onChange={(e) => setConfirmChecked(e.target.checked)}/>
                                I confirm this operation.
                            </div>
                        )}
                        <button 
                            className={styles.modalDefaultButton} 
                            onClick={() => setResult(true)}
                            {...confirmButton}
                             disabled={!confirmChecked || confirmButton?.disabled}
                            >
                            {confirmButton?.label || `OK`}
                        </button>
                        <button 
                            className={styles.modalCancelButton} 
                            onClick={() => setResult(false)}
                            {...cancelButton}>
                            {cancelButton?.label || `Cancel`}
                        </button>

                    </div>
                </div>
            </div>
        </div>
    </CSSTransition>
    )
}
