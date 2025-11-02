// src/api/feedbackAPI.js - FIXED VERSION
import axiosClient from './axiosClient';

class APIError extends Error {
  constructor(message, status = 0, details = null) {
    super(message);
    this.name = 'APIError';
    this.status = status;
    this.details = details;
  }
}

// POST /api/feedback - Submit new feedback
export const submitFeedback = async (feedbackData) => {
  try {
    console.log('Submitting feedback:', feedbackData);
    
    const response = await axiosClient.post('/api/feedback', feedbackData);
    console.log('Feedback submitted successfully:', response.data);
    return response.data;
    
  } catch (error) {
    console.error('Submit feedback error:', error);
    throw new APIError(
      error.response?.data?.error || 'Failed to submit feedback',
      error.response?.status,
      error.response?.data
    );
  }
};

// GET /api/feedback/deliverable/:deliverableId - SIMPLIFIED VERSION
export const fetchFeedback = async (deliverableId) => {
  try {
    console.log('Fetching feedback for deliverable:', deliverableId);
    
    if (!deliverableId) {
      throw new APIError('Deliverable ID is required');
    }

    // Use the correct endpoint that we know works
    const response = await axiosClient.get(`/api/feedback/deliverable/${deliverableId}`);
    
    console.log('Feedback fetched successfully:', response.data);
    return response.data;
    
  } catch (error) {
    console.error('Fetch feedback error:', error);
    
    // Handle specific error cases
    if (error.response?.status === 404) {
      // If no feedback found, return empty array instead of error
      console.log('No feedback found for this deliverable, returning empty array');
      return {
        success: true,
        feedback: [],
        total_count: 0,
        unresolved_count: 0
      };
    }
    
    throw new APIError(
      error.response?.data?.error || 'Failed to fetch feedback',
      error.response?.status,
      error.response?.data
    );
  }
};