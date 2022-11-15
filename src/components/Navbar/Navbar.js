import React from "react"

import styles from "./Navbar.module.css"
import logo from "../../assets/img/hambook_logo.svg"

import UserMenu from "./UserMenu/UserMenu"

const mainMenu = [
	"MYBOOK",
	"WORLDBOOK",
	"LOGBOOK",
	"PHOTOBOOK"
]
const MainMenuItems = mainMenu.map((entry, index) =>
	<span key={index}>{entry}</span>
)

export default function Navbar({ ...props }) {
  return (
	<div className={styles.navbar}>
	  <div className={styles.bgLine}/>
	  <div className={styles.mainMenu}>
        <a href="/">
	      <img className={styles.logoImg} src={logo} alt="Hambook logo"/>
		  <span className={styles.logoText}>HAMBOOK</span>
        </a>
		<div className={styles.mainMenuOptions}>
		  {MainMenuItems}
		</div>
	  </div>
      <UserMenu/>
	</div>
  )
}


