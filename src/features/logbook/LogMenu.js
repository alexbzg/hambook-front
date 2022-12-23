import { useState } from 'react'

import styles from './LogMenu.module.css'

import { CallsignSearchField } from "../../components"

export default function LogMenu({ onQsoFilter, logId, ...props }) {

  const [activeFilter, setActiveFilter] = useState(false)

  const onSubmit = (e) => {
    e.preventDefault()
    const filter = Object.fromEntries(Array.from(new FormData(e.target)).filter(
        (item) => item[1] !== ''))
    setActiveFilter(Object.keys(filter).length !== 0)
    onQsoFilter(filter)
  }

  const clear = (e) => {
    const form = e.target.closest('form')
    Array.from(form.elements).forEach( field => field.value = null )
    form.requestSubmit()
  }

  return (
    <div className={styles.logMenu}>
      <form onSubmit={onSubmit}>
            <CallsignSearchField
                title={null}
                id={styles.callsign}/>
            {activeFilter &&
                <span onClick={clear}>X</span>
            }
            <input type="submit" hidden/>
      </form>
    </div>
  )

}

