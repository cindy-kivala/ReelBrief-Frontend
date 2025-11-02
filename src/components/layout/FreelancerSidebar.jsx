import React from "react";
import { Link } from "react-router-dom";

export const FreelancerSidebar = () => {
  return (
    <div className="bg-gray-800 text-white w-64 h-screen fixed p-6">
      <h2 className="text-xl font-bold mb-6">Freelancer</h2>
      <nav className="space-y-3">
        <Link to="/freelancer/dashboard" className="block hover:text-blue-400">Dashboard</Link>
        <Link to="/freelancer/projects" className="block hover:text-blue-400">My Projects</Link>
        <Link to="/freelancer/escrow" className="block hover:text-blue-400">Escrow</Link>
        <Link to="/freelancer/reviews" className="block hover:text-blue-400">Reviews</Link>
      </nav>
    </div>
  );
};
