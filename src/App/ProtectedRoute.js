import React from "react"

import LoginPage from "../features/auth/LoginPage"
import useAuthenticatedUser from "../features/auth/useAuthenticatedUser"

export default function ProtectedRoute({ component: Component, ...props }) {
  
  const { isAuthenticated } = useAuthenticatedUser()

  if (!isAuthenticated) return <LoginPage />

  return <Component {...props} />
}


