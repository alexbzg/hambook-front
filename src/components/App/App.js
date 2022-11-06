import React from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { LoginPage, Layout, ProtectedRoute, ProfilePage } from "../../components"

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/profile" element={<ProtectedRoute component={ProfilePage} />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}



