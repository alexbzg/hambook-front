import React from "react"
import { useDispatch } from "react-redux"
import { Link } from "react-router-dom"

import styles from './UserMenu.module.css'

import { userLogout } from "../auth/authSlice"
import useAutheticatedUser from "../auth/useAuthenticatedUser"
import { useProfile } from "../profile/profileSlice"
import userIcon from "../../assets/img/icons/user.svg"
import logoutImg from "../../assets/img/icons/logout.svg"
import defaultAvatarImage from "../../assets/img/default_avatar.jpg"


export default function UserMenu({ user, logUserOut, ...props }) {
  const dispatch = useDispatch()

  const { profile } = useProfile()
  const { isAuthenticated } = useAutheticatedUser()

  return (
    <div className={styles.userMenu}>
      {isAuthenticated ?
        (<div className={styles.icons}>
            <Link to="/profile">
                <img id={styles.avatar} alt="Your avatar" src={profile.avatar?.url || defaultAvatarImage} title="Your profile"/>
            </Link>
            <Link to="/profile">
                <img src={userIcon} title="Your profile" alt="Your profile"/>
            </Link>
            <img src={logoutImg} onClick={() => dispatch(userLogout())} title="Logout" alt="Logout"/>
        </div>) : 
        (<div className={`button ${styles.loginButton}`}>
            <Link to="/login">Login / Register</Link>
        </div>)}
    </div>
  )
}

