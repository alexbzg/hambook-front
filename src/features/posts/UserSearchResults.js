import { React } from 'react'

import styles from './UserSearchResults.module.css'

export default function UserSearchResults({ results, onHide, ...props }) {

    const Content = results ? 
        results.map( (user) => (
            <div className={styles.user}>
                <span className={styles.callsign}>{user.current_callsign}</span>
                <span className={styles.name}>{`${user.first_name} ${user.last_name}`}</span>
            </div>) ) :
        <div className={styles.failure}>Not found</div>

    return (
        <div className={styles.wrapper} {...props} >
            <span 
                className={styles.hideButton} 
                onClick={onHide}
            >
                Hide
            </span>
            {Content}
        </div>
    )
}
