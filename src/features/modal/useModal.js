import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import Modal from "./Modal";

const useModal = () => (props) =>
  new Promise((resolve) => {
    const elementRoot = document.createElement("div");
    document.body.appendChild(elementRoot);
    const root = createRoot(elementRoot);

    const modalResult = (result) => {
      root.unmount();
      document.body.removeChild(elementRoot);
      resolve(result);
    };

    root.render(
      <StrictMode>
        <Modal modalResult={modalResult} {...props} />
      </StrictMode>
    );
  });

export default useModal;

