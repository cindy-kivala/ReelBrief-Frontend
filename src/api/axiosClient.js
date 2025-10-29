/**
 * axiosClient.js
 * Description: Axios instance with interceptors for API requests
 */

import axios from 'axios';

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
});

const TOKEN_KEY = 'access_token'

// Request interceptor - Add auth token
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Auth token attached to request'); // Debug log
    } else {
      console.warn('No auth token found'); // Debug log
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors
axiosClient.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.config.url, response.status); // Debug log
    return response;
  },
  (error) => {
    console.error('API Error:', error.config?.url, error.response?.status);

    if (error.response?.status === 401) {
      // Token expired or invalid
      console.warn('Unauthorized - redirecting to login');
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosClient;