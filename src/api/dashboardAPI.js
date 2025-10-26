/**
 * dashboardAPI.js
 * Owner: Caleb
 * Description: Handles API operations related to dashboard data.
 */

import axiosClient from "./axiosClient";

const BASE_URL = "/dashboard";

/**
 * Fetch dashboard stats for the logged-in user
 * @returns {Promise<Object>} Dashboard summary (earnings, projects, etc.)
 */
export const fetchDashboardStats = async () => {
  const response = await axiosClient.get(`${BASE_URL}/stats`);
  return response.data;
};

/**
 * Fetch recent projects for the logged-in user
 * @returns {Promise<Object[]>} Recent projects
 */
export const fetchRecentProjects = async () => {
  const response = await axiosClient.get(`${BASE_URL}/recent-projects`);
  return response.data;
};

/**
 * Fetch recent transactions for the logged-in user
 * @returns {Promise<Object[]>} Recent payments or escrow records
 */
export const fetchRecentTransactions = async () => {
  const response = await axiosClient.get(`${BASE_URL}/transactions`);
  return response.data;
};

/**
 * Fetch notifications for dashboard
 * @returns {Promise<Object[]>} User notifications
 */
export const fetchNotifications = async () => {
  const response = await axiosClient.get(`${BASE_URL}/notifications`);
  return response.data;
};
