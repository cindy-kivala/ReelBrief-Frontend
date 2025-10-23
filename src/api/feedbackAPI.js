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

// Submit new feedback
// @param {object} feedbackData - Feedback data
// @param {number} feedbackData.deliverable_id - Deliverable ID (required)
// @param {string} feedbackData.feedback_type - Type: 'comment', 'revision', 'approval' (required)
// @param {string} feedbackData.content - Feedback content (required)
// @param {string} feedbackData.priority - Priority: 'low', 'medium', 'high'
// @param {number} feedbackData.parent_feedback_id - Parent ID for threaded replies
// @returns {Promise} Created feedback data
export const submitFeedback = async (feedbackData) => {
  try {
    const response = await axiosClient.post('/feedback/', feedbackData);
    return response.data;
  } catch (error) {
    console.error('Error submitting feedback:', error);
    throw error.response?.data || error.message;
  }
};

// Update feedback content
// @param {number} id - Feedback ID
// @param {object} data - Update data (content, priority)
// @returns {Promise} Updated feedback data
export const updateFeedback = async (id, data) => {
  try {
    const response = await axiosClient.patch(`/feedback/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating feedback:', error);
    throw error.response?.data || error.message;
  }
};

// Delete feedback
// @param {number} id - Feedback ID
// @returns {Promise} Success message
export const deleteFeedback = async (id) => {
  try {
    const response = await axiosClient.delete(`/feedback/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting feedback:', error);
    throw error.response?.data || error.message;
  }
};

// Mark feedback as resolved
// @param {number} id - Feedback ID
// @returns {Promise} Updated feedback data
export const resolveFeedback = async (id) => {
  try {
    const response = await axiosClient.patch(`/feedback/${id}/resolve`);
    return response.data;
  } catch (error) {
    console.error('Error resolving feedback:', error);
    throw error.response?.data || error.message;
  }
};

// Mark feedback as unresolved
// @param {number} id - Feedback ID
// @returns {Promise} Updated feedback data
export const unresolveFeedback = async (id) => {
  try {
    const response = await axiosClient.patch(`/feedback/${id}/unresolve`);
    return response.data;
  } catch (error) {
    console.error('Error unresolving feedback:', error);
    throw error.response?.data || error.message;
  }
};

// Fetch feedback statistics for a deliverable
// Get feedback statistics for deliverable
// @param {number} deliverableId - Deliverable ID
// @returns {Promise} Feedback statistics
export const getFeedbackStats = async (deliverableId) => {
  try {
    const response = await axiosClient.get(`/feedback/stats/${deliverableId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching feedback stats:', error);
    throw error.response?.data || error.message;
  }
};