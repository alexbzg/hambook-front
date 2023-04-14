import { useState } from 'react'

import UserSearchWidget from './UserSearchWidget'
import UserSearchResults from './UserSearchResults'

import styles from './Feed.module.css'

export default function Feed({ ...props }) {
    
    const [ showUserSearchResults, setShowUserSearchResults ] = useState()
    const [ userSearchResults, setUserSearchResults ] = useState()

    const onUserSearchResults = (results) => {
        setUserSearchResults(results)
        setShowUserSearchResults(true)
    }

    return (
        <div className={styles.feed}>
            <UserSearchWidget
                onSearchResults={onUserSearchResults}/>
            {showUserSearchResults &&
                <UserSearchResults
                    results={userSearchResults}
                    onHide={() => setShowUserSearchResults(false)}
                />}
            
        </div>
    )
}
