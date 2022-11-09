import React from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { LoginPage, Layout, ProtectedRoute, ProfilePage, PasswordResetRequest } from "../../components"

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/password_reset/request" element={<PasswordResetRequest />} />
          <Route path="/profile" element={<ProtectedRoute component={ProfilePage} />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}



