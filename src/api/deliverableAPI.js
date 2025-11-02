// src/api/deliverableAPI.js - FIXED to match your backend routes
import axiosClient from './axiosClient';

class APIError extends Error {
  constructor(message, status = 0, details = null) {
    super(message);
    this.name = 'APIError';
    this.status = status;
    this.details = details;
  }
}

// GET /api/deliverable/freelancer/my-deliverables - Get all my deliverables
export const fetchMyDeliverables = async () => {
  try {
    console.log('Fetching my deliverables...');
    const response = await axiosClient.get('/api/deliverable/freelancer/my-deliverables');
    console.log('My deliverables fetched:', response.data);
    return response.data;
  } catch (error) {
    console.error('Fetch my deliverables error:', error);
    throw new APIError(
      error.response?.data?.error || 'Failed to fetch deliverables',
      error.response?.status,
      error.response?.data
    );
  }
};

// POST /api/projects/ - Create new project
export const createProject = async (projectData) => {
  try {
    console.log('Creating project:', projectData);
    const response = await axiosClient.post('/api/projects/', projectData);
    console.log('Project created:', response.data);
    return response.data;
  } catch (error) {
    console.error('Create project error:', error);
    throw new APIError(
      error.response?.data?.error || 'Failed to create project',
      error.response?.status,
      error.response?.data
    );
  }
};

// GET /api/deliverable/:deliverableId - Get single deliverable by ID
export const fetchDeliverableById = async (deliverableId) => {
  try {
    console.log('Fetching deliverable:', deliverableId);
    const response = await axiosClient.get(`/api/deliverable/${deliverableId}`);
    console.log('Deliverable fetched:', response.data);
    return response.data;
  } catch (error) {
    console.error('Fetch deliverable error:', error);
    throw new APIError(
      error.response?.data?.error || 'Failed to fetch deliverable',
      error.response?.status,
      error.response?.data
    );
  }
};

// GET /api/deliverable/projects/:projectId - Get deliverables by project ID
export const fetchDeliverablesByProject = async (projectId) => {
  try {
    console.log('Fetching deliverables for project:', projectId);
    const response = await axiosClient.get(`/api/deliverable/projects/${projectId}`);
    console.log('Project deliverables fetched:', response.data);
    return response.data;
  } catch (error) {
    console.error('Fetch project deliverables error:', error);
    throw new APIError(
      error.response?.data?.error || 'Failed to fetch project deliverables',
      error.response?.status,
      error.response?.data
    );
  }
};

// GET /api/deliverable/:deliverableId/versions - Get all versions of a deliverable
export const getDeliverableVersions = async (deliverableId) => {
  try {
    console.log('Fetching versions for deliverable:', deliverableId);
    const response = await axiosClient.get(`/api/deliverable/${deliverableId}/versions`);
    console.log('Deliverable versions fetched:', response.data);
    return response.data;
  } catch (error) {
    console.error('Fetch deliverable versions error:', error);
    throw new APIError(
      error.response?.data?.error || 'Failed to fetch deliverable versions',
      error.response?.status,
      error.response?.data
    );
  }
};

// POST /api/deliverable - Create/upload new deliverable
export const createDeliverable = async (deliverableData) => {
  try {
    console.log('Creating deliverable with form data:');
    
    // Debug: Log all form data entries
    for (let [key, value] of deliverableData.entries()) {
      console.log(`${key}:`, value instanceof File ? `File: ${value.name}` : value);
    }
    
    const response = await axiosClient.post('/api/deliverable', deliverableData, {
      // Let the browser set the Content-Type automatically 
    });
    
    console.log('Deliverable created successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Create deliverable error details:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    
    throw new APIError(
      error.response?.data?.error || 'Failed to create deliverable',
      error.response?.status,
      error.response?.data
    );
  }
};

// POST /api/deliverable/:deliverableId/approve - Approve deliverable
export const approveDeliverable = async (deliverableId) => {
  try {
    console.log('Approving deliverable:', deliverableId);
    const response = await axiosClient.post(`/api/deliverable/${deliverableId}/approve`);
    console.log('Deliverable approved:', response.data);
    return response.data;
  } catch (error) {
    console.error('Approve deliverable error:', error);
    throw new APIError(
      error.response?.data?.error || 'Failed to approve deliverable',
      error.response?.status,
      error.response?.data
    );
  }
};

// POST /api/deliverable/:deliverableId/reject - Reject deliverable
export const rejectDeliverable = async (deliverableId, reason) => {
  try {
    console.log('Rejecting deliverable:', deliverableId);
    const response = await axiosClient.post(`/api/deliverable/${deliverableId}/reject`, { reason });
    console.log('Deliverable rejected:', response.data);
    return response.data;
  } catch (error) {
    console.error('Reject deliverable error:', error);
    throw new APIError(
      error.response?.data?.error || 'Failed to reject deliverable',
      error.response?.status,
      error.response?.data
    );
  }
};

// POST /api/deliverable/:deliverableId/request-revision - Request revision
export const requestRevision = async (deliverableId, revisionNotes) => {
  try {
    console.log('Requesting revision for deliverable:', deliverableId);
    const response = await axiosClient.post(`/api/deliverable/${deliverableId}/request-revision`, { 
      revision_notes: revisionNotes 
    });
    console.log('Revision requested:', response.data);
    return response.data;
  } catch (error) {
    console.error('Request revision error:', error);
    throw new APIError(
      error.response?.data?.error || 'Failed to request revision',
      error.response?.status,
      error.response?.data
    );
  }
};

// PATCH /api/deliverable/:deliverableId - Update deliverable
export const updateDeliverable = async (deliverableId, updateData) => {
  try {
    console.log('Updating deliverable:', deliverableId, updateData);
    const response = await axiosClient.patch(`/api/deliverable/${deliverableId}`, updateData);
    console.log('Deliverable updated:', response.data);
    return response.data;
  } catch (error) {
    console.error('Update deliverable error:', error);
    throw new APIError(
      error.response?.data?.error || 'Failed to update deliverable',
      error.response?.status,
      error.response?.data
    );
  }
};

// DELETE /api/deliverable/:deliverableId - Delete deliverable
export const deleteDeliverable = async (deliverableId) => {
  try {
    console.log('Deleting deliverable:', deliverableId);
    const response = await axiosClient.delete(`/api/deliverable/${deliverableId}`);
    console.log('Deliverable deleted:', response.data);
    return response.data;
  } catch (error) {
    console.error('Delete deliverable error:', error);
    throw new APIError(
      error.response?.data?.error || 'Failed to delete deliverable',
      error.response?.status,
      error.response?.data
    );
  }
};

// POST /api/deliverable/compare - Compare two versions
export const compareVersions = async (version1Id, version2Id) => {
  try {
    console.log('Comparing versions:', version1Id, version2Id);
    const response = await axiosClient.post('/api/deliverable/compare', {
      version1_id: version1Id,
      version2_id: version2Id
    });
    console.log('Versions compared:', response.data);
    return response.data;
  } catch (error) {
    console.error('Compare versions error:', error);
    throw new APIError(
      error.response?.data?.error || 'Failed to compare versions',
      error.response?.status,
      error.response?.data
    );
  }
};