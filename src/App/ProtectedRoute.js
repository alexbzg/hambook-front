import React from "react"
import { useNavigate } from "react-router-dom"

import LoginPage from "../features/auth/LoginPage"
import useAuthenticatedUser from "../features/auth/useAuthenticatedUser"

export default function ProtectedRoute({ component: Component, requireNotAuthenticated, ...props }) {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuthenticatedUser()

  if (!isAuthenticated && !requireNotAuthenticated) return <LoginPage />

  if (isAuthenticated && requireNotAuthenticated) {
      navigate("/")
      return <></>
  }

  return <Component {...props} />
}


