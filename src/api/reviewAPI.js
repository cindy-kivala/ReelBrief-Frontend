/**
 * reviewAPI.js
 * Owner: Caleb
 * Description: Handles API operations related to project or user reviews.
 */

import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/reviews";

/**
 * Submit a new review (Client only)
 * @param {Object} data - Review payload
 * @param {number} data.project_id
 * @param {number} data.rating
 * @param {number} [data.communication_rating]
 * @param {number} [data.quality_rating]
 * @param {number} [data.timeliness_rating]
 * @param {string} [data.review_text]
 * @param {boolean} [data.is_public]
 * @returns {Promise<Object>} Created review object
 */
export const submitReview = async (data) => {
  const token = localStorage.getItem("token");
  const response = await axios.post(`${API_BASE_URL}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

/**
 * Fetch reviews for a specific freelancer (public or own)
 * @param {number} userId - Freelancer user ID
 * @param {number} [page=1]
 * @param {number} [perPage=5]
 * @returns {Promise<Object[]>} List of reviews
 */
export const fetchReviews = async (userId, page = 1, perPage = 5) => {
  const token = localStorage.getItem("token");
  const response = await axios.get(
    `${API_BASE_URL.replace("/reviews", "")}/users/${userId}/reviews?page=${page}&per_page=${perPage}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};

/**
 * Fetch review for a specific project
 * @param {number} projectId
 * @returns {Promise<Object>} Review for the project
 */
export const fetchProjectReview = async (projectId) => {
  const token = localStorage.getItem("token");
  const response = await axios.get(
    `${API_BASE_URL.replace("/reviews", "")}/projects/${projectId}/reviews`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};

/**
 * Update a review (Client only)
 * @param {number} reviewId - Review ID
 * @param {Object} data - Updated review fields
 * @returns {Promise<Object>} Updated review object
 */
export const updateReview = async (reviewId, data) => {
  const token = localStorage.getItem("token");
  const response = await axios.patch(`${API_BASE_URL}/${reviewId}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

/**
 * Fetch rating summary for a freelancer
 * @param {number} freelancerId
 * @returns {Promise<Object>} Rating summary (overall, communication, quality, timeliness)
 */
export const fetchRatingSummary = async (freelancerId) => {
  const response = await axios.get(
    `${API_BASE_URL.replace("/reviews", "")}/freelancers/${freelancerId}/rating-summary`
  );
  return response.data;
};
