import { useState, useRef } from "react"

import { CSSTransition } from "react-transition-group";

import styles from "./Modal.module.css"

export default function Modal({ 
    modalResult, 
    title, 
    children, 
    confirmLabel, 
    cancelLabel, 
    confirmCheckbox, 
    requestSubmit,
    ...props
    }) {

  const [show, setShow] = useState(true)
  const [confirmChecked, setConfirmChecked] = useState(!confirmCheckbox)
  const nodeRef = useRef(null)

  const setResult = (result) => {
    if (result && requestSubmit && !requestSubmit()) {
        return
    }
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
