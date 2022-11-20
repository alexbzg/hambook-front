import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import client from '../services/_apiClient.js'

export const userLogin = createAsyncThunk(
	'auth/login', 
    ( { email, password }, { rejectWithValue, getState, dispatch } ) => {
        const formData = new FormData()
        formData.set("username", email)
        formData.set("password", password)
        return client({
         		url: `/users/login/token`,
                method: 'POST', 
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                }, 
                args: formData,
				getState, 
				rejectWithValue,
                onSuccess: (data) => {
                    // stash the access_token our server returns
/*                    const access_token = data?.access_token
                    localStorage.setItem("access_token", access_token)

                    return dispatch(fetchUserFromToken({token: access_token}))*/
                },

            })
			.then((data) => { 
                if (data?.access_token) {
				    dispatch(fetchUserFromToken(data.access_token))
                }
            })
        }
)

export const fetchUserFromToken = createAsyncThunk(
	'auth/fetchUserFromToken', 
    ( token, { rejectWithValue, getState, dispatch } ) => {
        return client({
         		url: `/users/me`,
                method: 'GET', 
				token,
                args: null,
				getState, 
				rejectWithValue,
                onSuccess: (res) => {
                    // stash the access_token our server returns

                    //return dispatch(fetchUserFromToken(access_token))
                },
            })
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
    }
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
     }
    // register user reducer...
  },
})
export default userSlice.reducer

export const { userLogout } = userSlice.actions
