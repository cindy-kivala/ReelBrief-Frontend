
// clean, correct version

import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  FolderOpen,
  FileText,
  Star,
  Users,
  ShieldCheck,
  Briefcase,
  DollarSign,
  LogOut,
  UserCircle,
} from "lucide-react";

export const Sidebar = ({ role }) => {
  const navigate = useNavigate();

  // const getNavItems = () => {
  //   const baseItems = [
  //     { 
  //       name: "Dashboard", 
  //       path: `/${user.role}/dashboard`, 
  //       icon: LayoutDashboard 
  //     },
  //     { 
  //       name: "Profile", 
  //       path: "/profile", 
  //       icon: Users 
  //     },
  //   ];

  //   switch (user.role) {
  //     case "admin":
  //       return [
  //         ...baseItems,
  //         { name: "Freelancers", path: "/admin/freelancers", icon: Users },
  //         { name: "Escrow", path: "/admin/escrow", icon: DollarSign },
  //         { name: "Invoices", path: "/admin/invoices", icon: FileText },
  //         { name: "Project Approval", path: "/admin/project-approval", icon: CheckSquare },
  //       ];
  //     case "client":
  //       return [
  //         ...baseItems,
  //         { name: "Projects", path: "/client/projects", icon: Briefcase },
  //         { name: "Invoices", path: "/client/invoices", icon: FileText },
  //       ];
  //     case "freelancer":
  //       return [
  //         ...baseItems,
  //         { name: "Projects", path: "/freelancer/projects", icon: Briefcase },
  //         { name: "Invoices", path: "/freelancer/invoices", icon: FileText },
  //       ];
  //     default:
  //       return baseItems;
    // }
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
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
          { name: "Portfolio", path: "/portfolio", icon: Briefcase }, // keep this only
          { name: "Invoices", path: "/freelancer/invoices", icon: FileText },
        ];
      default:
        return baseItems;
    }
  };

  // Reusable sidebar link
  const SidebarLink = ({ to, icon: Icon, label }) => (
    <Link
      to={to}
      className="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-200 hover:bg-white/10 hover:text-white transition-all"
    >
      <Icon size={18} /> {label}
    </Link>
  );

  const sidebarBase =
    "bg-gray-900/90 backdrop-blur-md text-white w-64 h-screen fixed flex flex-col justify-between shadow-lg";

  let links = [];
  let title = "";

  if (role === "client") {
    title = "Client Portal";
    links = [
      { to: "/client/dashboard", icon: LayoutDashboard, label: "Dashboard" },
      { to: "/projects", icon: FolderOpen, label: "My Projects" },
      { to: "/client/invoices", icon: FileText, label: "Invoices" },
      { to: "/client/wallet", icon: DollarSign, label: "Wallet" }, // Added Wallet link
      // { to: "/client/reviews", icon: Star, label: "Reviews" },
    ];
  } else if (role === "freelancer") {
    title = "Freelancer Hub";
    links = [
      { to: "/freelancer/dashboard", icon: LayoutDashboard, label: "Dashboard" },
      { to: "/projects", icon: Briefcase, label: "Projects" },
      { to: "/freelancer/invoices", icon: FileText, label: "Invoices" },
      { to: "/freelancer/wallet", icon: DollarSign, label: "Wallet" }, // Added Wallet link
      { to: "/profile", icon: UserCircle, label: "Profile" },
    ];
  } else if (role === "admin") {
    title = "Admin Panel";
    links = [
      { to: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
      { to: "/admin/freelancers", icon: Users, label: "Freelancers" },
      { to: "/admin/escrow", icon: ShieldCheck, label: "Escrow" },
      { to: "/admin/invoices", icon: FileText, label: "Invoices" },
    ];
  }

  return (
    <aside className={sidebarBase}>
      {/* Top Section */}
      <div>
        <div className="flex items-center justify-center mt-6 mb-8">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            {title}
          </h2>
        </div>

        <nav className="flex flex-col space-y-2 px-4">
          {links.map((link, index) => (
            <SidebarLink key={index} {...link} />
          ))}
        </nav>
      </div>

      {/* Logout Section */}
      <div className="p-4 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-red-600 hover:text-white transition-all"
        >
          <LogOut size={18} /> Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;

