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

    const onSubmit = (e) => {
      e.preventDefault()
      if (!modalFormResult) {
        modalFormResult(true)
      }
    }

    return (
        <Modal 
            modalResult={modalFormResult} 
            requestSubmit={requestSubmit}
            {...props}
            >
            <form id={id} onSubmit={onSubmit}>
                {children}
                <input type="submit" hidden/>
            </form>
        </Modal>
    )

}
 
