import { useState } from "react"

import styles from './DropDownMenu.module.css'
import threeDots from "../../assets/img/icons/three_dots.svg"

export default function DropDownMenu({ items, ...props }) {
  const [menuExpanded, setMenuExpanded] = useState(false)

  const closeMenu = () => {
      setMenuExpanded(false)
  }

  const expandMenu = (e) => {
      setMenuExpanded(true)
  }

  const suppressClick = (e) => {
      e.preventDefault()
      e.nativeEvent.stopImmediatePropagation()
      setMenuExpanded(state => !state)
  }

  return (
    <div
        className={props.styles?.menuButton || styles.menuButton}
        tabIndex={0}
        onClickCapture={suppressClick}
        onFocus={expandMenu}
        onBlur={closeMenu}>
        <img 
            src={threeDots}
            alt="Submenu"/>
        {menuExpanded &&
            <div className={props.styles?.menuWrapper || styles.menuWrapper}>
                {items.map( (item, index) => (
                    <div
                        key={index}
                        className={props.styles?.menuItem || styles.menuItem}
                        onClickCapture={item.handler}>
                        {item.title}
                    </div>))}
            </div>
        }
    </div>
  )
}
