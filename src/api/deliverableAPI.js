/**
 * deliverableAPI.js
 * Owner: Cindy
 * Description: Handles API requests related to deliverables — upload, update, and retrieval.
 */
import axiosClient from './axiosClient';

// Fetch all deliverables for a project
//  @param {number} projectId - Project ID
//  @param {object} params - Query parameters (page, per_page, version, status)
//  @returns {Promise} Deliverables data
 
export const fetchDeliverables = async (projectId, params = {}) => {
  try {
    const response = await axiosClient.get(`/deliverables/projects/${projectId}`, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching deliverables:', error);
    throw error.response?.data || error.message;
  }
};

//  Fetch specific deliverable by ID
//  @param {number} id - Deliverable ID
//  @returns {Promise} Deliverable data with feedback
 
export const fetchDeliverableById = async (id) => {
  try {
    const response = await axiosClient.get(`/deliverables/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching deliverable:', error);
    throw error.response?.data || error.message;
  }
};
