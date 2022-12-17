import { useId } from "react"

import Modal from "./Modal"

export default function ModalForm({ modalResult, children, ...props }) {

    const id = useId()

    const requestSubmit = () => {
      document.forms[id].requestSubmit()
      return document.forms[id].checkValidity()
    }

    const modalFormResult = (result) => {
      modalResult(result ? new FormData(document.forms[id]) : null)
    }

    return (
        <Modal 
            modalResult={modalFormResult} 
            requestSubmit={requestSubmit}
            {...props}
            >
            <form id={id} onSubmit={(e) => e.preventDefault()}>
                {children}
            </form>
        </Modal>
    )

}
 
