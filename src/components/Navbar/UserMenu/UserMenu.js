import React from "react"
import { connect } from "react-redux"
import { Link } from "react-router-dom"

import styles from './UserMenu.module.css'

import { Actions as authActions } from "../../../redux/auth"
import userIcon from "../../../assets/img/icons/user.svg"
import userImg from "../../../assets/img/user.jpg"
import logoutImg from "../../../assets/img/icons/logout.svg"


function UserMenu({ user, logUserOut, ...props }) {
  return (
    <div className={styles.userMenu}>
      {user?.email ?
        (<div className={styles.icons}>
            <Link to="/profile">
                <img id={styles.avatar} alt="Your avatar" src={userImg} title="Your profile"/>
            </Link>
            <Link to="/profile">
                <img src={userIcon} title="Your profile" alt="Your profile"/>
            </Link>
            <img src={logoutImg} onClick={logUserOut} title="Logout" alt="Logout"/>
        </div>) : 
        (<div className={`button ${styles.loginButton}`}>
            <Link to="/login">Login / Register</Link>
        </div>)}
    </div>
  )
}

export default connect((state) => ({ user: state.auth.user }), {
  logUserOut: authActions.logUserOut
})(UserMenu)
