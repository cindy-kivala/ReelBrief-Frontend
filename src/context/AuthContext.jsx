// src/context/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import axiosClient from '../api/axiosClient';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is logged in on app start
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        setLoading(false);
        return;
      }

      console.log('Checking auth with token');
      const response = await axiosClient.get('/api/auth/me');
      
      // Handle different response structures
      if (response.data.user) {
        setUser(response.data.user);
        setIsAuthenticated(true);
        console.log('User authenticated:', response.data.user);
      } else if (response.data.success && response.data.user) {
        setUser(response.data.user);
        setIsAuthenticated(true);
        console.log('User authenticated:', response.data.user);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      // Clear invalid token
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Attempting login for:', email);
      
      const response = await axiosClient.post('/api/auth/login', {
        email,
        password
      });

      console.log('Login response:', response.data);

      const responseData = response.data;

      // Handle different possible response structures
      if (responseData.access_token) {
        // Structure: { access_token, refresh_token, user }
        const { user, access_token } = responseData;
        
        // Store token and user
        localStorage.setItem('access_token', access_token);
        localStorage.setItem('user', JSON.stringify(user));
        
        // Set auth state
        setUser(user);
        setIsAuthenticated(true);
        
        console.log('Login successful, user:', user);
        return { success: true, user };
        
      } else if (responseData.success && responseData.access_token) {
        // Structure: { success: true, access_token, user }
        const { user, access_token } = responseData;
        
        localStorage.setItem('access_token', access_token);
        localStorage.setItem('user', JSON.stringify(user));
        setUser(user);
        setIsAuthenticated(true);
        
        console.log('Login successful, user:', user);
        return { success: true, user };
        
      } else if (responseData.error) {
        // Structure: { error: 'message' }
        throw new Error(responseData.error);
        
      } else {
        // Unknown response structure
        throw new Error('Invalid response from server');
      }
      
    } catch (error) {
      console.error('Login failed:', error);
      
      let errorMessage = 'Login failed. Please check your credentials.';
      
      if (error.response?.status === 401) {
        errorMessage = 'Invalid email or password.';
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
    setError(null);
    console.log('User logged out');
  };

  const clearError = () => {
    setError(null);
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    error,
    login,
    logout,
    clearError,
    checkAuth
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};