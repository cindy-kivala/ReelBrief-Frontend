/**
 * AuthContext.jsx
 * Owner: Ryan
 * Description: Provides authentication context to the React app.
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in on mount
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('access_token');
      
      if (token) {
        try {
          // Verify token with backend and get fresh user data
          const response = await axiosClient.get('/api/auth/me');
          
          // Handle both response formats: {user: {...}} or {...}
          const userData = response.data.user || response.data;
          
          setUser(userData);
          setIsAuthenticated(true);
          
          // Update stored user data
          localStorage.setItem('user', JSON.stringify(userData));
          
          console.log('✅ Token validated, user loaded:', userData);
        } catch (error) {
          console.error('⚠️ Token validation failed:', error);
          // Clear invalid token
          localStorage.removeItem('access_token');
          localStorage.removeItem('user');
          setUser(null);
          setIsAuthenticated(false);
        }
      }
      
      setLoading(false);
    };

    initAuth();
  }, []);

  /**
   * Login function
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<object>} - Returns user data and token
   */
  const login = async (email, password) => {
    try {
      const response = await axiosClient.post('/api/auth/login', { // FIXED: Added /api prefix
        email,
        password
      });

      console.log('📦 Full login response:', response.data); // DEBUG

      // FIXED: Handle different response structures
      const token = response.data.access_token || response.data.token;
      const userData = response.data.user || response.data;

      if (!token) {
        throw new Error('No token received from server');
      }

      // Store token - FIXED: Use 'access_token' to match axiosClient
      localStorage.setItem('access_token', token);
      
      // ALSO store user data for persistence
      localStorage.setItem('user', JSON.stringify(userData));

      // Update state
      setUser(userData);
      setIsAuthenticated(true);

      console.log('✅ Login successful:', userData);
      console.log('🔑 Token stored:', token.substring(0, 20) + '...');

      // Return the response so Login.jsx can redirect based on role
      return { user: userData, token };
      
    } catch (error) {
      console.error('❌ Login failed:', error);
      console.error('📦 Error response:', error.response?.data); // DEBUG
      
      // Clear any existing auth data
      localStorage.removeItem('access_token'); // FIXED: Use 'access_token'
      setUser(null);
      setIsAuthenticated(false);

      // Throw error with user-friendly message
      throw new Error(
        error.response?.data?.message || 
        error.response?.data?.error || 
        'Login failed. Please check your credentials.'
      );
    }
  };

  /**
   * Register function
   * @param {object} userData - User registration data
   * @returns {Promise<object>} - Returns user data and token
   */
  const register = async (userData) => {
    try {
      const response = await axiosClient.post('/api/auth/register', userData); // FIXED: Added /api prefix

      const token = response.data.access_token || response.data.token;
      const newUser = response.data.user || response.data;

      if (!token) {
        throw new Error('No token received from server');
      }

      // Store token - FIXED: Use 'access_token'
      localStorage.setItem('access_token', token);
      
      // ALSO store user data for persistence
      localStorage.setItem('user', JSON.stringify(newUser));

      // Update state
      setUser(newUser);
      setIsAuthenticated(true);

      return { user: newUser, token };
      
    } catch (error) {
      console.error('❌ Registration failed:', error);
      
      throw new Error(
        error.response?.data?.message || 
        error.response?.data?.error || 
        'Registration failed. Please try again.'
      );
    }
  };

  /**
   * Logout function
   */
  const logout = async () => {
    try {
      // Optional: Call backend logout endpoint if you have one
      // await axiosClient.post('/api/auth/logout');
      
      // Clear token - FIXED: Use 'access_token'
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      
      // Clear state
      setUser(null);
      setIsAuthenticated(false);

      console.log('✅ Logged out successfully');
      
    } catch (error) {
      console.error('❌ Logout error:', error);
      
      // Still clear local state even if backend call fails
      localStorage.removeItem('access_token'); // FIXED: Use 'access_token'
      localStorage.removeItem('user');
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  /**
   * Get current user (refresh user data)
   */
  const getCurrentUser = async () => {
    try {
      const response = await axiosClient.get('/api/auth/me'); // FIXED: Added /api prefix
      setUser(response.data.user);
      return response.data.user;
    } catch (error) {
      console.error('Failed to get current user:', error);
      throw error;
    }
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
    register,
    getCurrentUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};