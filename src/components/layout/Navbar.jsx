import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Play, Bell, Settings, LogOut, Menu, X } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getDashboardLink = () => {
    if (user?.role === 'admin') return '/admin-dashboard';
    if (user?.role === 'freelancer') return '/freelancer-dashboard';
    if (user?.role === 'client') return '/client-dashboard';
    return '/';
  };

  return (
    <nav className="bg-white border-b border-gray-200 fixed top-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to={getDashboardLink()} className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Play className="w-6 h-6 text-white" fill="white" />
            </div>
            <span className="text-xl font-bold text-gray-900">ReelBrief</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to={getDashboardLink()} className="text-gray-600 hover:text-gray-900">
              Dashboard
            </Link>
            <Link to="/projects" className="text-gray-600 hover:text-gray-900">
              Projects
            </Link>
            
            <button className="relative text-gray-600 hover:text-gray-900">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
                3
              </span>
            </button>
            
            <Link to="/profile" className="text-gray-600 hover:text-gray-900">
              <Settings className="w-5 h-5" />
            </Link>
            
            <button onClick={handleLogout} className="text-gray-600 hover:text-gray-900">
              <LogOut className="w-5 h-5" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-600"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-4 py-4 space-y-3">
            <Link to={getDashboardLink()} className="block text-gray-600 hover:text-gray-900">
              Dashboard
            </Link>
            <Link to="/projects" className="block text-gray-600 hover:text-gray-900">
              Projects
            </Link>
            <Link to="/profile" className="block text-gray-600 hover:text-gray-900">
              Profile
            </Link>
            <button onClick={handleLogout} className="w-full text-left text-gray-600 hover:text-gray-900">
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;