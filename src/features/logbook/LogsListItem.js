import { useState } from "react"

import styles from './LogsList.module.css'
import threeDots from "../../assets/img/icons/three_dots.svg"

export default function LogsList({ ...props }) {
  const [menuExpanded, setMenuExpanded] = useState(false)

  const closeMenu = () => {
      setMenuExpanded(false)
  }

  const expandMenu = () => {
      setMenuExpanded(true)
  }

  const deleteClick = () => {
      closeMenu()
      props.onDelete()
  }

  const editClick = () => {
      closeMenu()
      props.onEdit()
  }

  return (
    <>

        <div className={styles.logCallsign}>
            {props.callsign}
        </div>
        <div className={styles.logDescription}>
            {props.description}
        </div>
        <div
            className={styles.menuButton}
            tabIndex={0}
            onFocus={() => expandMenu()}
            onBlur={() => closeMenu()}>
            <img className={styles.controlDelete}
              src={threeDots}
              alt="Submenu"/>
            {menuExpanded &&
                <div className={styles.menuWrapper}>
                    <div className={styles.menuItem}
                        onClick={() => editClick()}>
                        Log settings
                    </div>
                    <div className={styles.menuItem}
                        onClick={() => deleteClick()}>
                        Delete log
                    </div>
                </div>
            }
        </div>
    </>
  )
}
