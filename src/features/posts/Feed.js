import { useState } from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

import UserSearchWidget from './UserSearchWidget'
import UserSearchResults from './UserSearchResults'
import { FEED_MODE } from './consts'
import useAuthenticatedUser from "../auth/useAuthenticatedUser"
import client from "../../services/apiClient"

import styles from './Feed.module.css'

export default function Feed({ mode, ...props }) {
    
    const [ showUserSearchResults, setShowUserSearchResults ] = useState()
    const [ userSearchResults, setUserSearchResults ] = useState()

    const onUserSearchResults = (results) => {
        setUserSearchResults(results)
        setShowUserSearchResults(true)
    }

    const { user, token } = useAuthenticatedUser()
    const showEditor = mode === FEED_MODE.my ? true :
        (mode === FEED_MODE.world && user?.is_admin ? true : false)
    const [editorValue, setEditorValue] = useState('')
    const post = async () => {
      try {
        await client({
            url: `/posts/`,
            method: 'POST',
            token,
            args: { new_post: {
                post_type: mode,
                visibility: 2,
                title: '',
                contents: editorValue
            } }
        })
        setEditorValue('')
      } finally {
      }
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
            {showEditor &&
                <>
                    <ReactQuill 
                        theme="snow"
                        value={editorValue}
                        onChange={setEditorValue}
                    />
                    <input 
                        type="button"
                        value="Post"
                        onClick={post}
                    />
                </>
            }
        </div>
    )
}
