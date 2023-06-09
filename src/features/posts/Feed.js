import { useState, useEffect, useCallback } from 'react'

import UserSearchWidget from './UserSearchWidget'
import UserSearchResults from './UserSearchResults'
import PostEditor from './PostEditor'

import { FEED_MODE } from './consts'
import useAuthenticatedUser from "../auth/useAuthenticatedUser"
import client from "../../services/apiClient"

import styles from './Feed.module.css'

export default function Feed({ mode, ...props }) {
    
    const { user, token } = useAuthenticatedUser()

    const [ showUserSearchResults, setShowUserSearchResults ] = useState()
    const [ userSearchResults, setUserSearchResults ] = useState()

    const onUserSearchResults = (results) => {
        setUserSearchResults(results)
        setShowUserSearchResults(true)
    }

    const [ posts, setPosts ] = useState([])
    const getPosts = useCallback(async () => {
        try {
            const postsData = await client({
                url: `/posts/${mode === FEED_MODE.my ? '' : 'world'}`,
                method: 'GET',
                params: mode === FEED_MODE.my ? { user_id: user.id } : {},
                token
            })
            setPosts(postsData)
        } finally {
        }
    }, [token, mode, user])
    useEffect(() => {
        async function _load() {
            await getPosts()
        }
        _load()
    }, [])

    const showEditor = mode === FEED_MODE.my ? true :
        (mode === FEED_MODE.world && user?.is_admin ? true : false)

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
                <PostEditor
                    mode={mode}
                    onPost={getPosts}
                />
            }
            {posts.length &&
                    posts.map( (item) => 
                        <div 
                            className="styles.post" 
                            key={item.id}
                            dangerouslySetInnerHTML={{__html: item.contents}}                            
                        />)
            }
        </div>
    )
}
