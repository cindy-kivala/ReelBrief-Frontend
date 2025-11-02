// Layout.jsx
import React from "react";
import { Sidebar } from "./Sidebar";
import { useAuth } from "../../context/AuthContext";

const Layout = ({ children }) => {
  const { user, loading } = useAuth();
  const role = user?.role?.toLowerCase();

  if (loading) return null; // or a spinner

  console.log("🧠 Current user role:", role);

  return (
    <div className="flex">
      <Sidebar role={role} />
      <div className="flex-1 ml-64 bg-gray-100 min-h-screen">{children}</div>
    </div>
  );
};

export default Layout;
