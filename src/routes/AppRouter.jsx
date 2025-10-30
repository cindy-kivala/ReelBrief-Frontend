// AppRouter.jsx
import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// Pages
import Login from '../pages/Login'
import Register from '../pages/Register'
import LandingPage from '../pages/LandingPage'
import ComponentTestPage from '../pages/ComponentTestPage'

// Loading component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p className="text-gray-600">Loading...</p>
    </div>
  </div>
)

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return <LoadingSpinner />
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return children
}

// Public Route component (redirect to dashboard if already authenticated)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return <LoadingSpinner />
  }

  if (isAuthenticated) {
    return <Navigate to="/test-components" replace />
  }

  return children
}

function AppRouter() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<LandingPage />} />
      <Route 
        path="/login" 
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } 
      />
      <Route 
        path="/register" 
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        } 
      />

      {/* Protected routes */}
      <Route 
        path="/test-components" 
        element={
          <ProtectedRoute>
            <ComponentTestPage />
          </ProtectedRoute>
        } 
      />

      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default AppRouter