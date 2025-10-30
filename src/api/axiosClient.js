// src/api/axiosClient.js
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

// Create axios instance
const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  // No withCredentials - using proxy instead
});

// Request interceptor
axiosClient.interceptors.request.use(
  (config) => {
    // Don't add Authorization header for login/register endpoints
    const isAuthEndpoint = config.url.includes('/auth/login') || config.url.includes('/auth/register');
    
    if (!isAuthEndpoint) {
      const token = localStorage.getItem('access_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log('Auth token attached to request:', config.url);
      } else {
        console.log('No auth token found for:', config.url);
      }
    } else {
      console.log('Auth endpoint - skipping token:', config.url);
    }
    
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
axiosClient.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.config.url} ${response.status}`);
    return response;
  },
  (error) => {
    console.error(`API Error: ${error.config?.url} ${error.response?.status}`);
    
    if (error.code === 'ERR_NETWORK') {
      console.error('Network error - Check backend connection');
      error.message = 'Unable to connect to server. Please check if the backend is running.';
    } else if (error.response?.status === 401) {
      console.error('Unauthorized - Redirecting to login');
      if (!error.config?.url.includes('/auth/login')) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export default axiosClient;
