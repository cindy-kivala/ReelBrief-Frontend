/**
 * reviewAPI.js
 * Owner: Caleb
 * Description: Handles API operations related to project or user reviews.
 */

import axiosClient from "./axiosClient";

const BASE_URL = "/reviews";

/**
 * Submit a new review (Client only)
 * @param {Object} data - Review payload
 * @returns {Promise<Object>} Created review object
 */
export const submitReview = async (data) => {
  const response = await axiosClient.post(`${BASE_URL}`, data);
  return response.data;
};

/**
 * Fetch reviews for a specific freelancer
 * @param {number} userId - Freelancer user ID
 * @param {number} [page=1]
 * @param {number} [perPage=5]
 * @returns {Promise<Object[]>} List of reviews
 */
export const fetchReviews = async (userId, page = 1, perPage = 5) => {
  const response = await axiosClient.get(
    `/users/${userId}/reviews?page=${page}&per_page=${perPage}`
  );
  return response.data;
};

/**
 * Fetch a review for a specific project
 * @param {number} projectId
 * @returns {Promise<Object>} Review for the project
 */
export const fetchProjectReview = async (projectId) => {
  const response = await axiosClient.get(`/projects/${projectId}/reviews`);
  return response.data;
};

/**
 * Update a review (Client only)
 * @param {number} reviewId - Review ID
 * @param {Object} data - Updated review fields
 * @returns {Promise<Object>} Updated review object
 */
export const updateReview = async (reviewId, data) => {
  const response = await axiosClient.patch(`${BASE_URL}/${reviewId}`, data);
  return response.data;
};

/**
 * Fetch rating summary for a freelancer
 * @param {number} freelancerId
 * @returns {Promise<Object>} Rating summary
 */
export const fetchRatingSummary = async (freelancerId) => {
  const response = await axiosClient.get(
    `/freelancers/${freelancerId}/rating-summary`
  );
  return response.data;
};
