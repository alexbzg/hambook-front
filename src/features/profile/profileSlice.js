import { useSelector } from 'react-redux'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import client from '../../services/apiClient.js'
import { MEDIA_TYPE } from '../../enums.js'

export const profileUpdate = createAsyncThunk(
	'profile/update', 
    async ( profile_update, { rejectWithValue, getState } ) => {
        try {
            const data = await client({
         		url: `/profiles/me`,
                method: 'PUT', 
                args: { profile_update },
				getState, 
                successMessage: `Your profile was updated succefully.`
            })
            return data
        } catch (e) {
            return rejectWithValue(e)
        }
    }
)

export const mediaUpload = createAsyncThunk(
	'profile/mediaUpload', 
    async ( { mediaType, file }, { rejectWithValue, dispatch, getState } ) => {
   		const formData = new FormData()
    	formData.append('media_type', mediaType);
    	formData.append('file', file.file);
    	formData.append('fileName', file.name);
        try {
            const data = await client({
         		url: `/media`,
                method: 'POST', 
                args: formData,
				headers: {
					'content-type': 'multipart/form-data',
				},
				getState, 
            })
		    if (mediaType === MEDIA_TYPE.avatar) {
                dispatch(setAvatar(data.url))
            } else if (mediaType === MEDIA_TYPE.profileImage) {
                dispatch(addProfileImage(data))
            }
            return data
        } catch (e) {
            return rejectWithValue(e)
        }
    }
)

export const mediaDelete = createAsyncThunk(
	'profile/mediaDelete', 
    async ( { mediaType, mediaId }, { rejectWithValue, dispatch, getState } ) => {
        try {
            const data = await client({
         		url: `/media`,
                method: 'DELETE', 
                args: mediaId,
				getState, 
            })
		    if (mediaType === MEDIA_TYPE.avatar) {
                dispatch(setAvatar(null))
            } else if (mediaType === MEDIA_TYPE.profileImage) {
                dispatch(deleteProfileImage(mediaId))
            }
            return data
        } catch (e) {
            return rejectWithValue(e)
        }
    }
)


const initializeState = (state) => {
  state.loading = 'idle'
  state.mediaLoading = 'idle'
  state.error = null
  state.profile = null
  return state
}

const profileSlice = createSlice({
  name: 'auth',
  initialState: initializeState({}),
  reducers: {
    setProfile: (state, { payload }) => {
        state.profile = payload
    },
    setAvatar: (state, { payload }) => {
        state.profile.avatar = payload
    },
    deleteProfileImage: (state, { payload }) => {
        state.profile.images = state.profile.images.filter( ({ id }) => id !== payload )
    },
    addProfileImage: (state, { payload }) => {
        state.profile.images.push(payload)
    }
  },
  extraReducers: {
    // update profile
    [profileUpdate.pending]: (state) => {
      state.loading = 'loading'
      state.error = null
    },
    [profileUpdate.fulfilled]: (state, { payload }) => {
      state.loading = 'succeeded'
      state.profile = payload
    },
    [profileUpdate.rejected]: (state, { payload }) => {
      state.loading = 'failed'
      state.error = payload
    },
    //upload media
    [mediaUpload.pending]: (state) => {
      state.mediaIsLoading = 'loading'
    },
    [mediaUpload.fulfilled]: (state, { payload }) => {
      state.mediaIsLoading = 'succeeded'
    },
    [mediaUpload.rejected]: (state, { payload }) => {
      state.mediaIsLoading = 'failed'
    },
    //delete media
    [mediaDelete.pending]: (state) => {
      state.mediaIsLoading = 'loading'
    },
    [mediaDelete.fulfilled]: (state, { payload }) => {
      state.mediaIsLoading = 'succeeded'
    },
    [mediaDelete.rejected]: (state, { payload }) => {
      state.mediaIsLoading = 'failed'
    },
   
  },
})
export default profileSlice.reducer

export const { setProfile, setAvatar, addProfileImage, deleteProfileImage } = profileSlice.actions

export const useProfile = () => {
    const profile = useSelector((state) => state.profile.profile)
    const error = useSelector((state) => state.profile.error)
    const isLoading = useSelector((state) => state.profile.loading === 'loading')
    const mediaIsLoading = useSelector((state) => state.profile.mediaLoading === 'loading')

    return { profile, error, isLoading, mediaIsLoading }
}

