import React from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"

import Layout from './Layout'
import ProtectedRoute from './ProtectedRoute'
import LoginPage from '../features/auth/LoginPage'
import PasswordResetRequest from '../features/auth/PasswordResetRequest'
import PasswordReset from '../features/auth/PasswordReset'
import ProfilePage from '../features/profile/ProfilePage'

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/password_reset/request" element={<PasswordResetRequest />} />
          <Route path="/password_reset" element={<PasswordReset />} />
          <Route path="/profile" element={<ProtectedRoute component={ProfilePage} />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}



