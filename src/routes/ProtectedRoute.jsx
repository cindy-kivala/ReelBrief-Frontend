import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function ProtectedRoute({ children, roles = [] }) {
  const { user, loading } = useAuth();

  // wait for auth to finish checking token
  if (loading) return <div className="loading-screen">Loading...</div>;

  // redirect if not logged in
  if (!user) return <Navigate to="/login" replace />;

  // if roles are specified, check access (e.g., admin-only route)
  if (roles.length > 0 && !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}
