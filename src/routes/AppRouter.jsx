import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PropTypes from 'prop-types';

// Public Pages
import LandingPage from '../pages/LandingPage';
import Login from '../pages/Login';
import Register from '../pages/Register';

// Protected Pages - Admin
import AdminDashboard from '../pages/admin/AdminDashboard';
import FreelancerVetting from '../pages/admin/FreelancerVetting';
import EscrowManagement from '../pages/admin/EscrowManagement';

// Protected Pages - Freelancer
import FreelancerDashboard from '../pages/freelancer/FreelancerDashboard';
import FreelancerProjects from '../pages/freelancer/FreelancerProjects';

// Protected Pages - Client
import ClientDashboard from '../pages/client/ClientDashboard';
import ClientProjects from '../pages/client/ClientProjects';

// Shared Protected Pages
import ProjectDetail from '../pages/ProjectDetail';
import Profile from '../pages/Profile';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node,
  allowedRoles: PropTypes.array,
};



function AppRouter() {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Admin Routes */}
      <Route
        path="/admin-dashboard"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/freelancers"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <FreelancerVetting />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/escrow"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <EscrowManagement />
          </ProtectedRoute>
        }
      />

      {/* Freelancer Routes */}
      <Route
        path="/freelancer-dashboard"
        element={
          <ProtectedRoute allowedRoles={['freelancer']}>
            <FreelancerDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/freelancer/projects"
        element={
          <ProtectedRoute allowedRoles={['freelancer']}>
            <FreelancerProjects />
          </ProtectedRoute>
        }
      />

      {/* Client Routes */}
      <Route
        path="/client-dashboard"
        element={
          <ProtectedRoute allowedRoles={['client']}>
            <ClientDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/client/projects"
        element={
          <ProtectedRoute allowedRoles={['client']}>
            <ClientProjects />
          </ProtectedRoute>
        }
      />

      {/* Shared Protected Routes */}
      <Route
        path="/projects/:id"
        element={
          <ProtectedRoute>
            <ProjectDetail />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRouter;