/**
 * AppRouter.jsx
 * Owner: Ryan
 * Description: Handles all routing for ReelBrief frontend with role-based protection.
 */

import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import PropTypes from "prop-types";
import { useAuth } from "../context/AuthContext";

//  Public Pages 
import LandingPage from "../pages/LandingPage";
import Login from "../pages/Login";
import Register from "../pages/Register";
import VerifyEmail from "../pages/VerifyEmail";

//  Admin Pages 
import AdminDashboard from "../pages/admin/AdminDashboard";
import FreelancerVetting from "../pages/admin/FreelancerVetting";
import EscrowManagement from "../pages/admin/EscrowManagement";
import AdminInvoiceDetail from "../pages/admin/Invoices/InvoiceDetail";
import AdminInvoiceList from "../pages/admin/Invoices/InvoiceList";

//  Freelancer Pages 
import FreelancerDashboard from "../pages/freelancer/FreelancerDashboard";
import FreelancerProjects from "../pages/freelancer/FreelancerProjects";
import FreelancerCreateInvoice from "../pages/freelancer/Invoices/CreateInvoice";
import FreelancerInvoiceDetail from "../pages/freelancer/Invoices/InvoiceDetail";
import FreelancerInvoiceList from "../pages/freelancer/Invoices/InvoiceList";

//  Client Pages 
import ClientDashboard from "../pages/client/ClientDashboard";
import ClientProjects from "../pages/client/ClientProjects";
import ClientInvoiceDetail from "../pages/client/Invoices/InvoiceDetail";
import ClientInvoiceList from "../pages/client/Invoices/InvoiceList";
import ClientInvoicePay from "../pages/client/Invoices/InvoicePayment";

//  Shared Protected Pages 
import Profile from "../pages/Profile";
import ProjectDetail from "../pages/ProjectDetail";

// Protected Route 
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role))
    return <Navigate to="/unauthorized" replace />;

  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node,
  allowedRoles: PropTypes.array,
};

//  ROUTES 
function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/*  Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* Email verification route */}
        <Route path="/verify-email/:token" element={<VerifyEmail />} />

        {/*  Admin Routes  */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/freelancers"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <FreelancerVetting />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/escrow"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <EscrowManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/invoices"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminInvoiceList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/invoices/:id"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminInvoiceDetail />
            </ProtectedRoute>
          }
        />

        {/*  Freelancer Routes  */}
        <Route
          path="/freelancer/dashboard"
          element={
            <ProtectedRoute allowedRoles={["freelancer"]}>
              <FreelancerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/freelancer/projects"
          element={
            <ProtectedRoute allowedRoles={["freelancer"]}>
              <FreelancerProjects />
            </ProtectedRoute>
          }
        />
        <Route
          path="/freelancer/invoices"
          element={
            <ProtectedRoute allowedRoles={["freelancer"]}>
              <FreelancerInvoiceList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/freelancer/invoices/create"
          element={
            <ProtectedRoute allowedRoles={["freelancer"]}>
              <FreelancerCreateInvoice />
            </ProtectedRoute>
          }
        />
        <Route
          path="/freelancer/invoices/:id"
          element={
            <ProtectedRoute allowedRoles={["freelancer"]}>
              <FreelancerInvoiceDetail />
            </ProtectedRoute>
          }
        />

        {/*  Client Routes  */}
        <Route
          path="/client/dashboard"
          element={
            <ProtectedRoute allowedRoles={["client"]}>
              <ClientDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/client/projects"
          element={
            <ProtectedRoute allowedRoles={["client"]}>
              <ClientProjects />
            </ProtectedRoute>
          }
        />
        <Route
          path="/client/invoices"
          element={
            <ProtectedRoute allowedRoles={["client"]}>
              <ClientInvoiceList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/client/invoices/:id"
          element={
            <ProtectedRoute allowedRoles={["client"]}>
              <ClientInvoiceDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/client/invoices/:id/pay"
          element={
            <ProtectedRoute allowedRoles={["client"]}>
              <ClientInvoicePay />
            </ProtectedRoute>
          }
        />

        {/*  Shared Protected Routes  */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute allowedRoles={["admin", "freelancer", "client"]}>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/projects/:id"
          element={
            <ProtectedRoute allowedRoles={["admin", "freelancer", "client"]}>
              <ProjectDetail />
            </ProtectedRoute>
          }
        />

        {/*  Fallback  */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
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
