// ✅ clean, correct version

import React from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Briefcase, 
  FileText, 
  Users, 
  DollarSign,
  LogOut
} from "lucide-react";
import useAuth from "../../hooks/useAuth";

const Sidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  
  if (!user) return null;

  const getNavItems = () => {
    const baseItems = [
      { 
        name: "Dashboard", 
        path: `/${user.role}/dashboard`, 
        icon: LayoutDashboard 
      },
      { 
        name: "Profile", 
        path: "/profile", 
        icon: Users 
      },
    ];

    switch (user.role) {
      case "admin":
        return [
          ...baseItems,
          { name: "Freelancers", path: "/admin/freelancers", icon: Users },
          { name: "Escrow", path: "/admin/escrow", icon: DollarSign },
          { name: "Invoices", path: "/admin/invoices", icon: FileText },
        ];
      case "client":
        return [
          ...baseItems,
          { name: "Projects", path: "/client/projects", icon: Briefcase },
          { name: "Invoices", path: "/client/invoices", icon: FileText },
        ];
      case "freelancer":
        return [
          ...baseItems,
          { name: "Projects", path: "/freelancer/projects", icon: Briefcase },
          { name: "Portfolio", path: "/portfolio", icon: Briefcase }, // ✅ keep this only
          { name: "Invoices", path: "/freelancer/invoices", icon: FileText },
        ];
      default:
        return baseItems;
    }
  };

  const navItems = getNavItems();

  return (
    <div className="bg-gray-800 text-white w-64 h-screen fixed p-6 flex flex-col">
      {/* Logo */}
      <div className="mb-8">
        <h1 className="text-xl font-bold text-white">ReelBrief</h1>
        <p className="text-sm text-gray-400 capitalize">{user.role}</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white"
              }`}
            >
              <Icon size={20} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <button
        onClick={logout}
        className="flex items-center gap-3 px-3 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg transition-colors mt-auto"
      >
        <LogOut size={20} />
        <span>Logout</span>
      </button>
    </div>
  );
};

export default Sidebar;
