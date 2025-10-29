const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('access_token'); 
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : ''
  };
};

// PRODUCTION FUNCTIONS
// GET /api/deliverables/:id
const prodFetchDeliverableById = async (id) => {
  const response = await fetch(`${API_BASE_URL}/api/deliverables/${id}`, {
    method: 'GET',
    headers: getAuthHeaders()
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Failed to fetch deliverable' }));
    throw new Error(error.error || 'Failed to fetch deliverable');
  }
  return await response.json();
};

// POST /api/deliverables/:id/approve
const prodApproveDeliverable = async (id) => {
  const response = await fetch(`${API_BASE_URL}/api/deliverables/${id}/approve`, {
    method: 'POST',
    headers: getAuthHeaders()
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Failed to approve deliverable' }));
    throw new Error(error.error || 'Failed to approve deliverable');
  }
  
  return await response.json();
};

// GET /api/deliverables/:id/versions
const prodGetDeliverableVersions = async (id) => {
  const response = await fetch(`${API_BASE_URL}/api/deliverables/${id}/versions`, {
    method: 'GET',
    headers: getAuthHeaders()
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Failed to fetch versions' }));
    throw new Error(error.error || 'Failed to fetch versions');
  }

  return await response.json();
};

// POST /api/deliverables (with multipart/form-data)
const prodUploadDeliverable = async (projectId, formData) => {
  // Ensure project_id is in formData
  if (!formData.has('project_id')) {
    formData.append('project_id', projectId);
  }

  const token = localStorage.getItem('access_token');
  if (!token) {
    throw new Error('No authentication token found');
  }

  const response = await fetch(`${API_BASE_URL}/api/deliverables`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
      // Remember== Don't set Content-Type for FormData - browser sets it automatically with boundary
    },
    body: formData
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Failed to upload deliverable' }));
    throw new Error(error.error || 'Failed to upload deliverable');
  }
  
  return await response.json();
};

// EXPORTS (Toggle based on environment) 
export const fetchDeliverableById = prodFetchDeliverableById;
export const approveDeliverable = prodApproveDeliverable;
export const getDeliverableVersions = prodGetDeliverableVersions;
export const uploadDeliverable = prodUploadDeliverable;

