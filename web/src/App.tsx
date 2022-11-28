import { useState } from 'react'
import { AuthContextProvider, useAuth } from './context/auth-provider'
import './styles/main.css'
import { Routes, Route, Outlet } from 'react-router-dom'

import Authenticated from './pages/authenticated'
import Login from './pages/login'
import Register from './pages/register'

function App() {
  const { user } = useAuth()
  console.log(user)
  return <AppRoutes />
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/home" element={<Authenticated />} />
    </Routes>
  )
}
export default App
