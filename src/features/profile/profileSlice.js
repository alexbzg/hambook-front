import { useSelector } from 'react-redux'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import client from '../../services/apiClient.js'

export const profileUpdate = createAsyncThunk(
	'profile/update', 
    ( { profile_update }, { rejectWithValue, getState, dispatch } ) => {
        return client({
         		url: `/profiles/me`,
                method: 'PUT', 
                args: { profile_update },
				getState, 
                successMessage: `Your profile was updated succefully.`
            })
        }
)

const initializeState = (state) => {
  state.loading = 'idle'
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
  },
})
export default profileSlice.reducer

export const { setProfile } = profileSlice.actions

export const useProfile = () => {
    const profile = useSelector((state) => state.profile.profile)
    const error = useSelector((state) => state.profile.error)
    const isLoading = useSelector((state) => state.profile.loading === 'loading')

    return { profile, error, isLoading }
}

