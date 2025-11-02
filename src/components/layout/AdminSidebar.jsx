import React from "react";
import { Link } from "react-router-dom";

export const AdminSidebar = () => {
  return (
    <div className="bg-gray-800 text-white w-64 h-screen fixed p-6">
      <h2 className="text-xl font-bold mb-6">Admin</h2>
      <nav className="space-y-3">
        <Link to="/admin/dashboard" className="block hover:text-blue-400">Dashboard</Link>
        <Link to="/admin/users" className="block hover:text-blue-400">Users</Link>
        <Link to="/admin/projects" className="block hover:text-blue-400">Projects</Link>
        <Link to="/admin/reports" className="block hover:text-blue-400">Reports</Link>
      </nav>
    </div>
  );
};
