import { useState, useEffect, useCallback, useMemo } from 'react'
import { useDispatch } from "react-redux"

import ReactQuill, { Quill } from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import ImageUploader from "quill-image-uploader"

import useAuthenticatedUser from "../auth/useAuthenticatedUser"
import client from "../../services/apiClient"
import { mediaUpload } from "../profile/profileSlice"
import { MEDIA_TYPE } from '../../enums.js'

import styles from './PostEditor.module.css'

Quill.register("modules/imageUploader", ImageUploader)

export default function PostEditor({ mode, onPost, ...props }) {
    const dispatch = useDispatch()

    const { user, token } = useAuthenticatedUser()

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
        onPost()
      } finally {
      }
    }

    const [ images, setImages ] = useState([])
    const imageHandler = useCallback(async (file) => {
        try {
            const uploadResult = await dispatch(mediaUpload({ mediaType: MEDIA_TYPE.postMedia, file }))
            const image = uploadResult.payload
            setImages( state => [image, ...state] )
            return image.url           
        }
        finally {}
    }, [])

    const modules=useMemo(() => ({
        toolbar: {  
            container: [  
                [{ 'header': [1, 2, 3, 4, 5, 6, false] }],  
                ['bold', 'italic', 'underline'],  
                [{ 'list': 'ordered' }, { 'list': 'bullet' }],  
                [{ 'align': [] }],  
                ['link', 'image'],  
                ['clean'],  
                [{ 'color': [] }]  
            ]
        },
        imageUploader: {
            upload: imageHandler
        }
    }), [])

    return (
                <div className="editor">
                    <ReactQuill 
                        theme="snow"
                        value={editorValue}
                        onChange={setEditorValue}
						modules={modules}
                    />
                    <input 
                        type="button"
                        value="Post"
                        onClick={post}
                    />
                </div>
    )
}
