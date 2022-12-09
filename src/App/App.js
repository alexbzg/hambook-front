import React from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"

import Layout from './Layout'
import ProtectedRoute from './ProtectedRoute'
import LoginPage from '../features/auth/LoginPage'
import PasswordResetRequest from '../features/auth/PasswordResetRequest'
import PasswordReset from '../features/auth/PasswordReset'
import ProfilePage from '../features/profile/ProfilePage'
import LogsList from '../features/logbook/LogsList'
import LogContent from '../features/logbook/LogContent'

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/password_reset/request" 
            element={<ProtectedRoute 
                        component={PasswordResetRequest} 
                        requireNotAuthenticated/>} 
          />
          <Route path="/password_reset" 
            element={<ProtectedRoute 
                        component={PasswordReset} 
                        requireNotAuthenticated/>}
            />
          <Route path="/profile" element={<ProtectedRoute component={ProfilePage} />} />
          <Route path="/logbook" element={<ProtectedRoute component={LogsList} />} />
          <Route path="/logbook/:log_id" element={<ProtectedRoute component={LogContent} />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}



