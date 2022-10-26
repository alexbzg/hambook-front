import React from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { LoginPage, Layout } from "../../components"

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}



