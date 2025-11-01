/**
 * escrowAPI.js
 * Owner: Caleb
 * Description: Handles API operations related to escrow management.
 */

import axiosClient from "./axiosClient";

const BASE_URL = "/escrow";

/**
 * Create a new escrow for a project
 * @param {Object} data - Escrow payload (projectId, amount, etc.)
 * @returns {Promise<Object>} Created escrow object
 */
export const createEscrow = async (data) => {
  const response = await axiosClient.post(`${BASE_URL}`, data);
  return response.data;
};

/**
 * Fetch all escrows for the logged-in user
 * @returns {Promise<Object[]>} List of escrow records
 */
export const fetchEscrows = async () => {
  const response = await axiosClient.get(`${BASE_URL}`);
  return response.data;
};

/**
 * Release escrow (Client action)
 * @param {number} escrowId
 * @returns {Promise<Object>} Released escrow data
 */
export const releaseEscrow = async (escrowId) => {
  const response = await axiosClient.post(`${BASE_URL}/${escrowId}/release`);
  return response.data;
};

/**
 * Cancel escrow (Admin or Client action)
 * @param {number} escrowId
 * @returns {Promise<Object>} Cancelled escrow data
 */
export const cancelEscrow = async (escrowId) => {
  const response = await axiosClient.post(`${BASE_URL}/${escrowId}/cancel`);
  return response.data;
};

/**
 * Fetch escrow by ID
 * @param {number} escrowId
 * @returns {Promise<Object>} Escrow details
 */
export const fetchEscrowById = async (escrowId) => {
  const response = await axiosClient.get(`${BASE_URL}/${escrowId}`);
  return response.data;
};
