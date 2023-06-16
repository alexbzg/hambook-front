import { useState, useEffect, useCallback } from 'react'

import { FEED_MODE } from './consts'
import useAuthenticatedUser from "../auth/useAuthenticatedUser"
import client from "../../services/apiClient"
import useModal from "../../components/Modal/useModal"


import UserSearchWidget from './UserSearchWidget'
import UserSearchResults from './UserSearchResults'
import EditPostForm from './EditPostForm'

import styles from './Feed.module.css'

export default function Feed({ mode, ...props }) {
    
    const { user, token } = useAuthenticatedUser()
    const confirmModal = useModal()

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

    const editPostFormModalResult = (result) => {
        setShowEditPostForm(false)
        setPostInEditor(null)
        if (result)
            getPosts()
    }

    const canEdit = mode === FEED_MODE.my ? true :
        (mode === FEED_MODE.world && user?.is_admin ? true : false)
    const [showEditPostForm, setShowEditPostForm] = useState(false)
    const [postInEditor, setPostInEditor] = useState(null)

    const deletePost = async (id) => {
      if (await confirmModal({
         children: "This post will be deleted. Recovery is impossible.",
         confirmCheckbox: true
      })) {
        try {
          await client({
            url: `/posts/${id}`,
            method: 'DELETE',
            token
          })
          setPosts( (posts) => posts.filter( item => item.id !== id ) )
        } catch {}
      }
    }

    const editPost = async (id) => {
        try {
          const post = await client({
            url: `/posts/${id}`,
            method: 'GET',
            token
          })
          setPostInEditor(post)
          setShowEditPostForm(true)
        } catch {}
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
            {canEdit &&
                    <span 
                        className={styles.addPost}
                        onClick={() => setShowEditPostForm(true)}>
                        New post
                    </span>
            }
            {showEditPostForm &&
                <EditPostForm
                    mode={mode}
                    postInEditor={postInEditor}
                    modalResult={editPostFormModalResult}
                />
            }
            {posts.length &&
                    posts.map( (item) => 
                        <div 
                            className={styles.post}
                            key={item.id}>
                            {canEdit &&
                                <div className={styles.postEditButtons}>
                                    <span
                                        className={styles.postDeleteButton}
                                        onClick={() => deletePost(item.id)}>
                                        Delete
                                    </span>
                                    <span
                                        className={styles.postEditButton}
                                        onClick={() => editPost(item.id)}>
                                        Edit
                                    </span>
                                </div>
                            }
                            <div 
                                className={styles.postContent}
                                dangerouslySetInnerHTML={{__html: item.contents}}/>
                        </div>
                    )
            }
        </div>
    )
}
