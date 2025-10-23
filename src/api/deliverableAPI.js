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

// Upload new deliverable
// @param {FormData} formData - Form data with file and metadata
// @returns {Promise} Created deliverable data

export const uploadDeliverable = async (formData) => {
  try {
    const response = await axiosClient.post('/deliverables/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error uploading deliverable:', error);
    throw error.response?.data || error.message;
  }
};

// Update deliverable metadata
// @param {number} id - Deliverable ID
// @param {object} data - Update data (title, description)
// @returns {Promise} Updated deliverable data
export const updateDeliverable = async (id, data) => {
  try {
    const response = await axiosClient.patch(`/deliverables/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating deliverable:', error);
    throw error.response?.data || error.message;
  }
};

// Delete deliverable
// @param {number} id - Deliverable ID
// @returns {Promise} Success message

export const deleteDeliverable = async (id) => {
  try {
    const response = await axiosClient.delete(`/deliverables/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting deliverable:', error);
    throw error.response?.data || error.message;
  }
};

//Approve deliverable
//@param {number} id - Deliverable ID
// @returns {Promise} Approved deliverable data

export const approveDeliverable = async (id) => {
  try {
    const response = await axiosClient.post(`/deliverables/${id}/approve`);
    return response.data;
  } catch (error) {
    console.error('Error approving deliverable:', error);
    throw error.response?.data || error.message;
  }
};

// Request revision on deliverable
// @param {number} id - Deliverable ID
// @param {object} revisionData - Revision request data (content, priority)
// @returns {Promise} Deliverable with feedback

export const requestRevision = async (id, revisionData) => {
  try {
    const response = await axiosClient.post(`/deliverables/${id}/request-revision`, revisionData);
    return response.data;
  } catch (error) {
    console.error('Error requesting revision:', error);
    throw error.response?.data || error.message;
  }
};

// Reject deliverable
// @param {number} id - Deliverable ID
// @param {string} reason - Reason for rejection
// @returns {Promise} Rejected deliverable data

export const rejectDeliverable = async (id, reason = '') => {
  try {
    const response = await axiosClient.post(`/deliverables/${id}/reject`, { reason });
    return response.data;
  } catch (error) {
    console.error('Error rejecting deliverable:', error);
    throw error.response?.data || error.message;
  }
};

// Get all versions of a deliverable
// @param {number} id - Deliverable ID
// @returns {Promise} Array of all versions

export const getDeliverableVersions = async (id) => {
  try {
    const response = await axiosClient.get(`/deliverables/${id}/versions`);
    return response.data;
  } catch (error) {
    console.error('Error fetching versions:', error);
    throw error.response?.data || error.message;
  }
};

// Compare two deliverable versions
// @param {number} version1Id - First version ID
// @param {number} version2Id - Second version ID
// @returns {Promise} Comparison data
 
export const compareVersions = async (version1Id, version2Id) => {
  try {
    const response = await axiosClient.post('/deliverables/compare', {
      version1_id: version1Id,
      version2_id: version2Id,
    });
    return response.data;
  } catch (error) {
    console.error('Error comparing versions:', error);
    throw error.response?.data || error.message;
  }
};
