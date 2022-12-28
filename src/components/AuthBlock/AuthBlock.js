import React from "react"

import styles from "./AuthBlock.module.css"

export const AuthBlock = (props) => <div {...props} className={styles.authBlock}></div>

export const AuthBlockTitle = ({ inactive, ...props }) =>
    <span {...props} className={`${styles.title} ${inactive ? styles.inactive : ''}`}></span>

