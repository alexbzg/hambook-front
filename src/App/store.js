import { configureStore, combineReducers, getDefaultMiddleware } from '@reduxjs/toolkit'

import { default as authReducer, fetchUserFromToken } from '../features/auth/authSlice'
import profileReducer from '../features/profile/profileSlice'
import logsReducer from '../features/logbook/logsSlice'

const combinedReducer = combineReducers({
    auth: authReducer,
    profile: profileReducer,
    logs: logsReducer
})

const rootReducer = (state, action) => {
  if (action.type === 'auth/userLogout') {
    state = undefined;
  }
  return combinedReducer(state, action);
}

const store = configureStore({
  reducer: rootReducer,
  middleware: [...getDefaultMiddleware()]
})

store.dispatch(fetchUserFromToken())

export default store

