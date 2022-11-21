import { configureStore } from '@reduxjs/toolkit'

import { default as authReducer, fetchUserFromToken } from '../features/auth/authSlice'
import profileReducer from '../features/profile/profileSlice'


const store = configureStore({
  reducer: {
    auth: authReducer,
    profile: profileReducer
  }
})

store.dispatch(fetchUserFromToken())

export default store

