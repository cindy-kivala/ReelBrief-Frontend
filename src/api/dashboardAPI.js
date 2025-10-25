/**
 * dashboardAPI.js
 * Owner: Caleb
 * Description: Fetches and aggregates dashboard data for admin, freelancer, and client dashboards.
 */

import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

/**
 * Helper function to get authorization headers
 */
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

/**
 * Fetch general dashboard stats depending on user role
 * @param {string} role - "freelancer" | "client" | "admin"
 */
export const fetchDashboardStats = async (role) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/dashboard?role=${role}`, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    throw error.response?.data || { message: "Failed to fetch dashboard stats" };
  }
};

/**
 * Fetch recent notifications for the logged-in user
 */
export const fetchNotifications = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/dashboard/notifications`, getAuthHeaders());
    return response.data.notifications || [];
  } catch (error) {
    console.error("Error fetching notifications:", error);
    throw error.response?.data || { message: "Failed to fetch notifications" };
  }
};

/**
 * Fetch recent activity feed (e.g., recent actions, updates)
 */
export const fetchActivityFeed = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/dashboard/activity`, getAuthHeaders());
    return response.data.activity || [];
  } catch (error) {
    console.error("Error fetching activity feed:", error);
    throw error.response?.data || { message: "Failed to fetch activity feed" };
  }
};

/**
 * Combined dashboard loader (optional helper)
 * Fetches stats, notifications, and activity in parallel
 */
export const fetchFullDashboardData = async (role) => {
  try {
    const [stats, notifications, activity] = await Promise.all([
      fetchDashboardStats(role),
      fetchNotifications(),
      fetchActivityFeed(),
    ]);

    return {
      stats,
      notifications,
      activity,
    };
  } catch (error) {
    console.error("Error fetching full dashboard data:", error);
    throw error;
  }
};
