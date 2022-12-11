import { configureStore } from '@reduxjs/toolkit'

import { default as authReducer, fetchUserFromToken } from '../features/auth/authSlice'
import profileReducer from '../features/profile/profileSlice'
import logsReducer from '../features/logbook/logsSlice'


const store = configureStore({
  reducer: {
    auth: authReducer,
    profile: profileReducer,
    logs: logsReducer
  }
})

store.dispatch(fetchUserFromToken())

export default store

