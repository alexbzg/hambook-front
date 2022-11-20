import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

import styles from "./toast.module.css"

export const Toasts = (props) => <ToastContainer {...props} className={styles.toastContainer}/>

export const showToast = ({content, toastType}) => toast( content, 
          {
            hideProgressBar: true,
            className: `${styles.toast} ${styles[toastType]}`,
            autoClose: toastType === 'success' ? 20000 : false
      } )

