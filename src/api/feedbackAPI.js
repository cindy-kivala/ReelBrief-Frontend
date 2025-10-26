
const API_BASE_URL_FEEDBACK = import.meta.env.VITE_API_BASE_URL;

// PRODUCTION FUNCTIONS 
// GET /api/feedback/deliverables/:deliverable_id
const prodFetchFeedback = async (deliverableId) => {
  const response = await fetch(`${API_BASE_URL_FEEDBACK}/api/feedback/deliverables/${deliverableId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });
  if (!response.ok) throw new Error('Failed to fetch feedback');
  return await response.json();
};

// POST /api/feedback
const prodSubmitFeedback = async (feedbackData) => {
  const response = await fetch(`${API_BASE_URL_FEEDBACK}/api/feedback`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify(feedbackData)
  });
  if (!response.ok) throw new Error('Failed to submit feedback');
  return await response.json();
};

// PATCH /api/feedback/:id/resolve
const prodResolveFeedback = async (feedbackId) => {
  const response = await fetch(`${API_BASE_URL_FEEDBACK}/api/feedback/${feedbackId}/resolve`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });
  if (!response.ok) throw new Error('Failed to resolve feedback');
  return await response.json();
};

//  EXPORTS (Toggle based on the environment we are in)
export const fetchFeedback = prodFetchFeedback;
export const submitFeedback = prodSubmitFeedback;
export const resolveFeedback = prodResolveFeedback;