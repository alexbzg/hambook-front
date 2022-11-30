import { useState } from "react"

import styles from './LogsList.module.css'


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
        <div 
            className={styles.menuButton} 
            tabIndex={0} 
            onFocus={() => expandMenu()} 
            onBlur={() => closeMenu()}>...
            {menuExpanded &&
                <div className={styles.menuWrapper}>
                    <div className={styles.menuItem}
                        onClick={() => editClick()}>
                        Edit
                    </div>
                    <div className={styles.menuItem}
                        onClick={() => deleteClick()}>
                        Delete
                    </div>
                </div>
            }
        </div>
        <div className={styles.logCallsign}>
            {props.callsign}
        </div>
        <div className={styles.logDesctiption}>
            {props.description}
        </div>
      </>
  )
}
