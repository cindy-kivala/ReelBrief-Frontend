/**
 * userAPI.js
 * Owner: Ryan
 * Description: Handles user profile and account management requests.
 */

import api from "./axiosClient"; // Make sure axiosClient.js exports a configured Axios instance

/**
 * Get a user by ID
 * @param {number|string} id - User ID
 * @returns {Promise<Object>} User data
 */
export const getUserById = async (id) => {
  const res = await api.get(`/users/${id}`);
  return res.data;
};

/**
 * Update user profile
 * @param {number|string} id - User ID
 * @param {Object} data - Updated user details
 * @returns {Promise<Object>} Updated user
 */
export const updateUser = async (id, data) => {
  const res = await api.patch(`/users/${id}`, data);
  return res.data;
};

/**
 * Fetch all users (Admin only)
 * @param {number} page - Optional pagination
 * @returns {Promise<Object>} Paginated users
 */
export const getAllUsers = async (page = 1) => {
  const res = await api.get(`/users?page=${page}`);
  return res.data;
};
