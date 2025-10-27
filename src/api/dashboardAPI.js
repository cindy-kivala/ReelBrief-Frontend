/**
 * dashboardAPI.js
 * Owner: Caleb
 * Description: Handles dashboard API requests for all user roles
 */

import axiosClient from './axiosClient';

const dashboardAPI = {
  /**
   * Get dashboard data for the current user
   * Returns different data based on user role (freelancer/client/admin)
   */
  getDashboard: async () => {
    try {
      const response = await axiosClient.get('/dashboard');
      return response.data;
    } catch (error) {
      console.error('Dashboard API error:', error);
      throw error;
    }
  },

  /**
   * Get enhanced freelancer dashboard with seed.py features
   */
  getFreelancerDashboard: async () => {
    try {
      const response = await axiosClient.get('/dashboard/freelancer');
      return response.data;
    } catch (error) {
      console.error('Freelancer dashboard API error:', error);
      throw error;
    }
  },

  /**
   * Get enhanced client dashboard with seed.py features
   */
  getClientDashboard: async () => {
    try {
      const response = await axiosClient.get('/dashboard/client');
      return response.data;
    } catch (error) {
      console.error('Client dashboard API error:', error);
      throw error;
    }
  },

  /**
   * Get enhanced admin dashboard with seed.py features
   */
  getAdminDashboard: async () => {
    try {
      const response = await axiosClient.get('/dashboard/admin');
      return response.data;
    } catch (error) {
      console.error('Admin dashboard API error:', error);
      throw error;
    }
  },

  /**
   * Get notifications for current user
   */
  getNotifications: async () => {
    try {
      const response = await axiosClient.get('/dashboard/notifications');
      return response.data;
    } catch (error) {
      console.error('Notifications API error:', error);
      throw error;
    }
  },

  /**
   * Get recent activity for current user
   */
  getRecentActivity: async () => {
    try {
      const response = await axiosClient.get('/dashboard/activity');
      return response.data;
    } catch (error) {
      console.error('Activity API error:', error);
      throw error;
    }
  },


  /**
   * Get earnings summary
   */
  getEarningsSummary: async () => {
    try {
      const response = await axiosClient.get('/dashboard/earnings');
      return response.data;
    } catch (error) {
      console.error('Earnings summary API error:', error);
      throw error;
    }
  },

  /**
   * Get project statistics
   */
  getProjectStats: async () => {
    try {
      const response = await axiosClient.get('/dashboard/projects/stats');
      return response.data;
    } catch (error) {
      console.error('Project stats API error:', error);
      throw error;
    }
  }
};

export default dashboardAPI;