// src/components/deliverables/FeedbackList.jsx
import React from 'react';
import { MessageSquare, AlertCircle, CheckCircle, Clock } from 'lucide-react';

const FeedbackList = ({ feedbacks, deliverableId }) => {
  if (!feedbacks || feedbacks.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-300" />
        <p>No feedback yet</p>
      </div>
    );
  }

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high': return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'medium': return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'low': return <CheckCircle className="w-4 h-4 text-green-500" />;
      default: return <MessageSquare className="w-4 h-4 text-gray-500" />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'revision': return 'border-yellow-200 bg-yellow-50';
      case 'approval': return 'border-green-200 bg-green-50';
      default: return 'border-blue-200 bg-blue-50';
    }
  };

  return (
    <div className="space-y-4">
      <h4 className="font-semibold text-gray-900 mb-3">Feedback & Comments</h4>
      {feedbacks.map((feedback) => (
        <div
          key={feedback.id}
          className={`border-l-4 p-4 rounded-r-lg ${getTypeColor(feedback.feedback_type)}`}
        >
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center gap-2">
              {getPriorityIcon(feedback.priority)}
              <span className="text-sm font-medium capitalize">
                {feedback.feedback_type.replace('_', ' ')}
              </span>
            </div>
            <span className="text-xs text-gray-500">
              {new Date(feedback.created_at).toLocaleDateString()}
            </span>
          </div>
          <p className="text-gray-700 text-sm">{feedback.content}</p>
          {feedback.author && (
            <p className="text-xs text-gray-500 mt-2">
              By {feedback.author.first_name} {feedback.author.last_name}
            </p>
          )}
        </div>
      ))}
    </div>
  );
};

export default FeedbackList;