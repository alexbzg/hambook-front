import apiClient from '../services/apiClient'

import initialState from "./initialState"

export const REQUEST_LOGIN = "@@auth/REQUEST_LOGIN"
export const REQUEST_LOGIN_FAILURE = "@@auth/REQUEST_LOGIN_FAILURE"
export const REQUEST_LOGIN_SUCCESS = "@@auth/REQUEST_LOGIN_SUCCESS"
export const REQUEST_LOG_USER_OUT = "@@auth/REQUEST_LOG_USER_OUT"
export const FETCHING_USER_FROM_TOKEN = "@@auth/FETCHING_USER_FROM_TOKEN"
export const FETCHING_USER_FROM_TOKEN_SUCCESS = "@@auth/FETCHING_USER_FROM_TOKEN_SUCCESS"
export const FETCHING_USER_FROM_TOKEN_FAILURE = "@@auth/FETCHING_USER_FROM_TOKEN_FAILURE"
export const REQUEST_USER_SIGN_UP = "@@auth/REQUEST_USER_SIGN_UP"
export const REQUEST_USER_SIGN_UP_SUCCESS = "@@auth/REQUEST_USER_SIGN_UP_SUCCESS"
export const REQUEST_USER_SIGN_UP_FAILURE = "@@auth/REQUEST_USER_SIGN_UP_FAILURE"

export default function authReducer(state = initialState.auth, action = {}) {
  switch(action.type) {

    case REQUEST_LOGIN:
      return {
        ...state,
        isLoading: true,
      }
    case REQUEST_LOGIN_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.error,
        user: {},
      }
    case REQUEST_LOGIN_SUCCESS:
      return {
        ...state,
        isLoading: false,
        error: null,
      }
    case REQUEST_LOG_USER_OUT:
      return {
        ...initialState.auth,
      }

    case FETCHING_USER_FROM_TOKEN:
      return {
        ...state,
        isLoading: true
      }
    case FETCHING_USER_FROM_TOKEN_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
        userLoaded: true,
        isLoading: false,
        user: action.data
      }
    case FETCHING_USER_FROM_TOKEN_FAILURE:
      return {
        ...state,
        isAuthenticated: false,
        userLoaded: true,
        isLoading: false,
        error: action.error,
        user: {}
      }

    case REQUEST_USER_SIGN_UP:
      return {
        ...state,
        isLoading: true,
      }
    case REQUEST_USER_SIGN_UP_SUCCESS:
      return {
        ...state,
        isLoading: false,
        error: null
      }
    case REQUEST_USER_SIGN_UP_FAILURE:
      return {
        ...state,
        isLoading: false,
        isAuthenticated: false,
        error: action.error
      }
          
    default:
      return state
  }
}

export const Actions = {}

Actions.logUserOut = () => {
  localStorage.removeItem("access_token")
  return { type: REQUEST_LOG_USER_OUT }
}

Actions.requestUserLogin = ({ email, password }) => {
  const formData = new FormData()
  formData.set("username", email)
  formData.set("password", password)
 
  return (dispatch) =>
    dispatch(
      apiClient({
        url: `/users/login/token`,
        method: `POST`,
        types: {
          REQUEST: REQUEST_LOGIN,
          SUCCESS: REQUEST_LOGIN_SUCCESS,
          FAILURE: REQUEST_LOGIN_FAILURE
        },
        options: {
          data: formData,
          headers: {
      		"Content-Type": "application/x-www-form-urlencoded",
    	  }
        },
        onSuccess: (res) => {
          // stash the access_token our server returns
          const access_token = res?.data?.access_token
          localStorage.setItem("access_token", access_token)

          return dispatch(Actions.fetchUserFromToken(access_token))
        },
        onFailure: (res) => ({ type: res.type, success: false, status: res.status, error: res.error })
      })
    )
}

Actions.fetchUserFromToken = (access_token) => {    
  const token = access_token || localStorage.getItem("access_token")
  return (dispatch) => {
    if (token) {
      dispatch(
        apiClient({
          url: `/users/me`,
          method: `GET`,
          types: {
            REQUEST: FETCHING_USER_FROM_TOKEN,
            SUCCESS: FETCHING_USER_FROM_TOKEN_SUCCESS,
            FAILURE: FETCHING_USER_FROM_TOKEN_FAILURE
          },
          options: {},
          onSuccess: (res) => ({ type: res.type, success: false, status: res.status, error: res.error }),
          onFailure: (res) => ({ type: res.type, success: false, status: res.status, error: res.error })
        })
      )
    } else 
      return dispatch({ type: FETCHING_USER_FROM_TOKEN_FAILURE, error: 'No token found.' })
  }
}

Actions.registerNewUser = ({ email, password }) => {
  return (dispatch) =>
    dispatch(
      apiClient({
        url: `/users/`,
        method: `POST`,
        types: {
          REQUEST: REQUEST_USER_SIGN_UP,
          SUCCESS: REQUEST_USER_SIGN_UP_SUCCESS,
          FAILURE: REQUEST_USER_SIGN_UP_FAILURE
        },
        options: {
          data: { new_user: { email, password } },
        },
        onSuccess: (res) => {
          // stash the access_token our server returns
          const access_token = res?.data?.access_token?.access_token
          localStorage.setItem("access_token", access_token)

          return dispatch(Actions.fetchUserFromToken(access_token))
        },
        onFailure: (res) => ({ type: res.type, success: false, status: res.status, error: res.error })
      })
    )
}

