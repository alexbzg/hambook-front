import { useState } from "react"

import styles from './DropDownMenu.module.css'
import threeDots from "../../assets/img/icons/three_dots.svg"

export default function DropDownMenu({ items, ...props }) {
  const [menuExpanded, setMenuExpanded] = useState(false)

  const handleClick = (e) => {
      e.preventDefault()
      e.nativeEvent.stopImmediatePropagation()
      setMenuExpanded( (state) => !state )
  }

  return (
    <div
        className={[styles.menuButton, props.styles?.menuButton].join(' ')}
        tabIndex={0}
        onClickCapture={handleClick}
        onBlur={() => setMenuExpanded(false)}>
        <img 
            src={threeDots}
            alt="Submenu"/>
        {menuExpanded &&
            <div className={[styles.menuWrapper, props.styles?.menuWrapper].join(' ')}>
                {items.map( (item, index) => (
                    <div
                        key={index}
                        className={[styles.menuItem, props.styles?.menuItem].join(' ')}
                        onClickCapture={item.handler}>
                        {item.title}
                    </div>))}
            </div>
        }
    </div>
  )
}
