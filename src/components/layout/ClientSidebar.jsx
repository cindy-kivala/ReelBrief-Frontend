import React from "react";
import { Link } from "react-router-dom";

export const ClientSidebar = () => {
  return (
    <div className="bg-gray-800 text-white w-64 h-screen fixed p-6">
      <h2 className="text-xl font-bold mb-6">Client</h2>
      <nav className="space-y-3">
        <Link to="/client/dashboard" className="block hover:text-blue-400">Dashboard</Link>
        <Link to="/client/projects" className="block hover:text-blue-400">My Projects</Link>
        <Link to="/client/invoices" className="block hover:text-blue-400">Invoices</Link>
        <Link to="/client/reviews" className="block hover:text-blue-400">Reviews</Link>
      </nav>
    </div>
  );
};
