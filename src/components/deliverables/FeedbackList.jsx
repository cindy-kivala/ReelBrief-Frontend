// src/components/deliverables/FeedbackList.jsx
import React, { useState, useEffect } from 'react';
import { fetchFeedback } from '../../api/feedbackAPI';
import { RefreshCw } from 'lucide-react';

const FeedbackList = ({ deliverableId }) => {
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  console.log('🔍 FeedbackList - Using deliverableId:', deliverableId);

  useEffect(() => {
    if (deliverableId) {
      loadFeedback();
    }
  }, [deliverableId]);

  const loadFeedback = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Loading feedback for deliverable:', deliverableId);
      const response = await fetchFeedback(deliverableId);
      
      setFeedback(response.feedback || []);
      console.log('Loaded feedback:', response.feedback?.length || 0, 'items');
    } catch (err) {
      console.error('Error loading feedback:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!deliverableId) {
    return (
      <div className="text-center py-8 text-gray-500">
        No deliverable selected
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
        <p className="text-gray-600 text-sm">Loading feedback...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800 font-semibold mb-2">Error loading feedback</p>
        <p className="text-red-600 text-sm mb-3">{error}</p>
        <button
          onClick={loadFeedback}
          className="text-red-700 hover:text-red-800 text-sm font-medium flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-gray-900">
          Feedback ({feedback.length})
        </h4>
        <button
          onClick={loadFeedback}
          className="text-gray-500 hover:text-gray-700 p-2"
          title="Refresh feedback"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>
      
      {feedback.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-500 text-sm">No feedback yet.</p>
          <p className="text-gray-400 text-xs mt-1">
            Be the first to add feedback!
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {feedback.map((item) => (
            <div key={item.id} className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-medium text-gray-900">
                    {item.author?.first_name} {item.author?.last_name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(item.created_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                <div className="flex gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    item.priority === 'high' ? 'bg-red-100 text-red-800' :
                    item.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {item.priority}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    item.feedback_type === 'approval' ? 'bg-green-100 text-green-800' :
                    item.feedback_type === 'revision' ? 'bg-orange-100 text-orange-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {item.feedback_type}
                  </span>
                </div>
              </div>
              <p className="text-gray-700 text-sm leading-relaxed">{item.content}</p>
              {item.is_resolved && (
                <div className="mt-2 flex items-center gap-1 text-green-600 text-xs">
                  <span className="w-4 h-4">✓</span>
                  Resolved
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FeedbackList;