import { useState } from "react"

import styles from './LogsList.module.css'

export default function NewQsoForm({ onSubmit, ...props }) {

  const [form, setForm] = useState({})

  return (
      <div className={styles.newQso}>
      </div>
  )
}
