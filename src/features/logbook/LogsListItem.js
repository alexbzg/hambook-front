import { useState } from "react"

import styles from './LogsList.module.css'
import threeDots from "../../assets/img/icons/three_dots.svg"

export default function LogsList({ ...props }) {
  const [menuExpanded, setMenuExpanded] = useState(false)

  const closeMenu = () => {
      setMenuExpanded(false)
  }

  const expandMenu = (e) => {
      e.preventDefault()
      //`:w
      e.nativeEvent.stopImmediatePropagation()

      setMenuExpanded(true)
  }

  const suppressClick = (e) => {
      e.preventDefault()
      //`:w
      e.nativeEvent.stopImmediatePropagation()
  }



  return (
    <>

        <div className={styles.logCallsign}>
            {props.callsign}
        </div>
        <div className={styles.logDescription}>
            {props.description}
        </div>
       <div className={styles.logQso}>
            {props.qso_count} QSO
        </div>

        <div
            className={styles.menuButton}
            tabIndex={0}
            onClickCapture={(e) => suppressClick(e)}
            onFocus={(e) => expandMenu(e)}
            onBlur={() => closeMenu()}>
            <img className={styles.controlDelete}
              src={threeDots}
              alt="Submenu"/>
            {menuExpanded &&
                <div className={styles.menuWrapper}>
                    <div className={styles.menuItem}
                        onClickCapture={props.onOpen}>
                            Open
                    </div>
                    <div className={styles.menuItem}
                        onClickCapture={props.onEdit}>
                        Log settings
                    </div>
                    <div className={styles.menuItem}
                        onClickCapture={props.onDelete}>
                        Delete log
                    </div>
                </div>
            }
        </div>
    </>
  )
}
