import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import client from '../../services/apiClient.js'
import { setProfile } from '../profile/profileSlice.js'

export const userLogin = createAsyncThunk(
	'auth/login', 
    async ( { email, password }, { rejectWithValue, getState, dispatch } ) => {
        const formData = new FormData()
        formData.set("username", email)
        formData.set("password", password)
        try {
            const data = await client({
                url: `/users/login/token`,
                method: 'POST', 
                token: 'SKIP',
                args: formData,
            })
            if (data?.access_token) {
                dispatch(fetchUserFromToken(data.access_token))
            }
            return data
        } catch (e) {
            return rejectWithValue(e)
        }
    }
)

export const userSignUp = createAsyncThunk(
	'auth/register', 
    async ( { email, password }, { rejectWithValue, getState, dispatch } ) => {
        try {
            const data = await client({
                url: `/users/`,
                method: 'POST', 
                token: 'SKIP',
                args: {new_user: { email, password } },
            })
            if (data?.access_token) {
                const { profile } = data
                dispatch(setProfile(profile))
            }
            return data
        } catch (e) {
            return rejectWithValue(e)
        }
    }
)

export const fetchUserFromToken = createAsyncThunk(
	'auth/fetchUserFromToken', 
    async ( token, { rejectWithValue, getState, dispatch } ) => {
        if (!token) {
            const { auth } = getState()
            if (!auth.token) {
                return rejectWithValue('No token found')
            }
        }
        try {
            const data = await client({
         		url: `/users/me`,
                method: 'GET', 
				token,
                args: null,
				getState, 
            })
            if (data?.profile) {
                dispatch(setProfile(data.profile))
            }
            return data
        } catch (e) {
            return rejectWithValue(e)
        }
    }
)

const initializeState = (state) => {
  state.loading = 'idle'
  state.token = localStorage.getItem('access_token') ? 
        localStorage.getItem('access_token') : 
        null
  state.error = null
  state.user = null
  return state
}

const userSlice = createSlice({
  name: 'auth',
  initialState: initializeState({}),
  reducers: {
    userLogout: (state) => {
        localStorage.removeItem('access_token')
        initializeState(state, null)
    },
  },
  extraReducers: {
    // login user
    [userLogin.pending]: (state) => {
      state.loading = 'loading'
      state.error = null
    },
    [userLogin.fulfilled]: (state, { payload }) => {
      state.loading = 'succeeded'
      state.token = payload?.access_token
      localStorage.setItem("access_token", payload?.access_token)
    },
    [userLogin.rejected]: (state, { payload }) => {
      state.loading = 'failed'
      state.error = payload
    },
    //fetch user data by token
    [fetchUserFromToken.pending]: (state, { payload }) => {
      state.loading = 'loading'
	  state.error = null
    },
    [fetchUserFromToken.fulfilled]: (state, { payload }) => {
	  	const {profile, ...user} = payload
		state.user = user
		state.loading = 'succeeded'
    },
    [fetchUserFromToken.rejected]: (state, { payload }) => {
       	state.loading = 'failed'
		state.user = null
        state.error = payload
        state.user = {}
    },
    // register user 
    [userSignUp.pending]: (state) => {
      state.loading = 'loading'
      state.error = null
    },
    [userSignUp.fulfilled]: (state, { payload }) => {
      state.loading = 'succeeded'
      const { access_token, ...user } = payload
      state.token = access_token?.access_token
      state.user = user
      localStorage.setItem("access_token", state.token)
    },
    [userSignUp.rejected]: (state, { payload }) => {
      state.loading = 'failed'
      state.error = payload
    },

  },
})
export default userSlice.reducer

export const { userLogout, userRegistered } = userSlice.actions
