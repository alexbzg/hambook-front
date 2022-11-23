import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

import styles from "./toasts.module.css"

export const Toasts = (props) => <ToastContainer {...props} className={styles.toastContainer}/>

export const showToast = (content, toastType) => toast( content, 
          {
           // hideProgressBar: false,
            className: `${styles.toast} ${styles[toastType]}`,
            autoClose: toastType === 'success' ? 10000 : false
      } )

