/**
 * feedbackAPI.js
 * Owner: Cindy
 * Description: Handles API interactions for feedback on deliverables.
 */


import axiosClient from './axiosClient';

// Fetch all feedback for a deliverable
// @param {number} deliverableId - Deliverable ID
// @param {object} params - Query parameters (include_resolved, include_replies)
// @returns {Promise} Feedback data with statistics
export const fetchFeedback = async (deliverableId, params = {}) => {
  try {
    const response = await axiosClient.get(`/feedback/deliverables/${deliverableId}`, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching feedback:', error);
    throw error.response?.data || error.message;
  }
};

// Fetch specific feedback by ID
// @param {number} id - Feedback ID
// @returns {Promise} Feedback data with replies
export const fetchFeedbackById = async (id) => {
  try {
    const response = await axiosClient.get(`/feedback/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching feedback:', error);
    throw error.response?.data || error.message;
  }
};