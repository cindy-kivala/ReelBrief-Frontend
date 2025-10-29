import React from 'react';
import { Routes, Route, Navigate, useParams, useNavigate } from 'react-router-dom';
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
import VersionCompare from '../components/deliverables/VersionCompare';

// Protected Pages - Client
import ClientDashboard from '../pages/client/ClientDashboard';
import ClientProjects from '../pages/client/ClientProjects';

// Shared Protected Pages
import ProjectDetail from '../pages/ProjectDetail';
import DeliverableDetail from '../pages/DeliverableDetail';
import Profile from '../pages/Profile';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!isAuthenticated) {
    console.log('Not authenticated, redirecting to login');

    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    console.log('Access denied. User role:', user?.role, 'Allowed:', allowedRoles);
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node,
  allowedRoles: PropTypes.array,
};

function VersionCompareWrapper() {
  const { projectId } = useParams();
  const navigate = useNavigate();

  // Validate projectId
  if (!projectId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">No project ID provided</p>
          <button
            onClick={() => navigate(-1)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <VersionCompare 
      projectId={projectId}
      onBack={() => navigate(-1)}
    />
  );
}

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
        path="/projects/:projectId/versions"
        element={
          <ProtectedRoute>
            <VersionCompareWrapper />
          </ProtectedRoute>
        }
      />


      <Route
        path="/deliverables/:id"
        element={
          <ProtectedRoute>
            <DeliverableDetail />
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