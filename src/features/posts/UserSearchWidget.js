import { React } from 'react'

import { SearchField } from '../../components'
import client from "../../services/apiClient"

import styles from './UserSearchWidget.module.css'

export default function UserSearchWidget({ onSearchResults, ...props }) {

    const search = async (expr) => {
      if (expr) {
        try {
            const results = await client({
                url: `/profiles/search/${expr}`,
                method: 'GET',
                token: 'skip'
            })
            onSearchResults(results)
        } catch (error) {
            if (error === 'Users not found') 
                onSearchResults()
        } 
      }
    }

    return (
        <div className={styles.widget} {...props} >
            <span callsName={styles.title}>FIND PEOPLE</span>
            <SearchField onSearch={search} />
            <span className={styles.notes}>Callsign, last name or first name</span>
        </div>
    )
}
