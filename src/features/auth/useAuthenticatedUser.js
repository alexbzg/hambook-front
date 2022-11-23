import { useDispatch, useSelector, shallowEqual } from "react-redux"

import { userLogout as userLogoutAction } from "./authSlice"

export const useAuthenticatedUser = () => {
  const dispatch = useDispatch()
  const error = useSelector((state) => state.auth.error)
  const isLoading = useSelector((state) => state.auth.loading === 'loading')
  const userLoaded = useSelector((state) => Boolean(state.auth.user))
  const isAuthenticated = useSelector((state) => Boolean(state.auth.user?.id))
  const user = useSelector((state) => state.auth.user, shallowEqual)
  const token = useSelector((state) => state.auth.token)

  const userLogout = () => dispatch(userLogoutAction())

  return { userLoaded, isLoading, error, isAuthenticated, user, userLogout, token }
}

export default useAuthenticatedUser
