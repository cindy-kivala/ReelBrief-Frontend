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
import AdminInvoiceDetail from '../pages/admin/Invoices/InvoiceDetail';
import AdminInvoiceList from '../pages/admin/Invoices/InvoiceList';

// Protected Pages - Freelancer
import FreelancerDashboard from '../pages/freelancer/FreelancerDashboard';
import FreelancerProjects from '../pages/freelancer/FreelancerProjects';
import FreelancerCreateInvoice from '../pages/freelancer/Invoices/CreateInvoice';
import FreelancerInvoiceDetail from '../pages/freelancer/Invoices/InvoiceDetail';
import FreelancerInvoiceList from '../pages/freelancer/Invoices/InvoiceList';

// Protected Pages - Client
import ClientDashboard from '../pages/client/ClientDashboard';
import ClientProjects from '../pages/client/ClientProjects';
import ClientInvoiceDetail from '../pages/client/Invoices/InvoiceDetail';
import ClientInvoiceList from '../pages/client/Invoices/InvoiceList';
import ClientInvoicePay from '../pages/client/Invoices/InvoicePayment';

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

// ----------------------- ROUTES -----------------------
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
      <Route
        path="/admin/invoices"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminInvoiceList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/invoices/:id"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminInvoiceDetail />
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
      <Route
        path="/freelancer/invoices"
        element={
          <ProtectedRoute allowedRoles={['freelancer']}>
            <FreelancerInvoiceList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/freelancer/invoices/create"
        element={
          <ProtectedRoute allowedRoles={['freelancer']}>
            <FreelancerCreateInvoice />
          </ProtectedRoute>
        }
      />
      <Route
        path="/freelancer/invoices/:id"
        element={
          <ProtectedRoute allowedRoles={['freelancer']}>
            <FreelancerInvoiceDetail />
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
      <Route
        path="/client/invoices"
        element={
          <ProtectedRoute allowedRoles={['client']}>
            <ClientInvoiceList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/client/invoices/:id"
        element={
          <ProtectedRoute allowedRoles={['client']}>
            <ClientInvoiceDetail />
          </ProtectedRoute>
        }
      />
      <Route
        path="/client/invoices/:id/pay"
        element={
          <ProtectedRoute allowedRoles={['client']}>
            <ClientInvoicePay />
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