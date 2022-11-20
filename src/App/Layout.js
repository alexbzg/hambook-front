import React from "react"
import { Helmet } from "react-helmet"

import Navbar from "../features/navbar/Navbar"
import { Toasts } from "../features/toasts/toasts"

import "../assets/css/fonts.css"
import "../assets/css/override.css"

import styles from "./Layout.module.css"

export default function Layout({ children }) {
  return (
    <React.Fragment>
      <Helmet>
        <meta charSet="utf-8" />
        <title>HAMBOOK.net - Amateur radio social network. Plus online-logger!</title>
        <link rel="canonical" href="https://hambook.net" />
      </Helmet>
      <div className={styles.layout}>
          <Navbar />
          <main className={styles.main}>
			<div className={styles.leftColumn}>{children}</div>
            {false && <div className={styles.rightColumn}></div>}
		  </main>
          <Toasts/>
      </div>
    </React.Fragment>
  )
}

