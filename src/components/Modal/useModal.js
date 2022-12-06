import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import Modal from "./Modal"

const useModal = () => (props) =>
  new Promise((resolve) => {
    const rootElement = document.createElement("div")
    document.body.appendChild(rootElement)
    const root = createRoot(rootElement)

    const modalResult = (result) => {
      root.unmount()
      rootElement.remove()
      resolve(result)
    }

    root.render(
      <StrictMode>
        <Modal modalResult={modalResult} {...props} />
      </StrictMode>
    )
  })

export default useModal

