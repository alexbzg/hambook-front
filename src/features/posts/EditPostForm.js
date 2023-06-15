import { useState, useEffect, useCallback, useMemo } from 'react'
import { useDispatch } from "react-redux"

import ReactQuill, { Quill } from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import ImageUploader from "quill-image-uploader"

import useAuthenticatedUser from "../auth/useAuthenticatedUser"
import client from "../../services/apiClient"
import { mediaUpload } from "../profile/profileSlice"
import { MEDIA_TYPE } from '../../enums.js'

import { Modal } from "../../components"

import styles from './EditPostForm.module.css'

Quill.register("modules/imageUploader", ImageUploader)

export default function EditPostForm({ mode, modalResult, ...props }) {
    const dispatch = useDispatch()

    const { user, token } = useAuthenticatedUser()

    const [editorValue, setEditorValue] = useState('')
    const [ images, setImages ] = useState([])

    const post = async () => {
      if (editorValue.length === 0)
        return false
      const post_images = []
      const deleted_images = []
      for (const image of images)
        if (editorValue.includes(image.url))
            post_images.push(image.id)
        else
            deleted_images.push(image.id)
      try {
        await client({
            url: `/posts/`,
            method: 'POST',
            token,
            args: { new_post: {
                post_type: mode,
                visibility: 2,
                title: '',
                contents: editorValue,
                post_images,
                deleted_images
            } }
        })
        setEditorValue('')
        setImages([])
        return true
      } catch {
        return false
      }
    }

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
                ['link', 'image', 'video'],  
                ['clean'],  
                [{ 'color': [] }]  
            ]
        },
        imageUploader: {
            upload: imageHandler
        }
    }), [])

    return (
        <Modal
            modalResult={(result) =>  modalResult(result)}
            requestSubmit={post}
            confirmButton={{label: 'Post'}}
            styles={{container: styles.modalContainer}}>
                <ReactQuill 
                    theme="snow"
                    value={editorValue}
                    onChange={setEditorValue}
                    modules={modules}
                />
        </Modal>
    )
}
