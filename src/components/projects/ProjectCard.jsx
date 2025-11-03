/**
 * ProjectCard.jsx
 * Owner: Monica
 * Description: Project card component with single centered "View Details" button
 * All actions (assign freelancer, etc.) are inside the ProjectDetail modal
 */

import React from "react";
import { Calendar, DollarSign, User } from "lucide-react";

export default function ProjectCard({ project, onView }) {
  const getStatusColor = (status) => {
    const colors = {
      submitted: "bg-yellow-100 text-yellow-800",
      approved: "bg-blue-100 text-blue-800",
      assigned: "bg-purple-100 text-purple-800",
      active: "bg-green-100 text-green-800",
      completed: "bg-gray-100 text-gray-800",
      not_feasible: "bg-red-100 text-red-800",
      cancelled: "bg-gray-100 text-gray-600"
    };
    return colors[status] || "bg-gray-100 text-gray-600";
  };

  const getStatusText = (status) => {
    const labels = {
      submitted: "Pending Review",
      approved: "Approved - Awaiting Assignment",
      assigned: "Assigned",
      active: "In Progress",
      completed: "Completed",
      not_feasible: "Not Feasible",
      cancelled: "Cancelled"
    };
    return labels[status] || status;
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">{project.title}</h3>
          <p className="text-gray-600 text-sm line-clamp-2">{project.description}</p>
        </div>
        
        {/* Status Badge */}
        <span className={`ml-4 px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${getStatusColor(project.status)}`}>
          {getStatusText(project.status)}
        </span>
      </div>

      {/* Project Info Grid */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* Budget */}
        <div className="flex items-center gap-2 text-sm">
          <DollarSign className="w-4 h-4 text-gray-500" />
          <div>
            <p className="text-xs text-gray-500">Budget</p>
            <p className="font-semibold text-gray-900">${project.budget}</p>
          </div>
        </div>

        {/* Deadline */}
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="w-4 h-4 text-gray-500" />
          <div>
            <p className="text-xs text-gray-500">Deadline</p>
            <p className="font-semibold text-gray-900">
              {project.deadline ? new Date(project.deadline).toLocaleDateString() : 'Not set'}
            </p>
          </div>
        </div>

        {/* Client */}
        <div className="flex items-center gap-2 text-sm">
          <User className="w-4 h-4 text-gray-500" />
          <div>
            <p className="text-xs text-gray-500">Client</p>
            <p className="font-semibold text-gray-900">{project.client_name || 'Unknown'}</p>
          </div>
        </div>

        {/* Freelancer */}
        <div className="flex items-center gap-2 text-sm">
          <User className="w-4 h-4 text-gray-500" />
          <div>
            <p className="text-xs text-gray-500">Freelancer</p>
            <p className="font-semibold text-gray-900">
              {project.freelancer_name || 'Unassigned'}
            </p>
          </div>
        </div>
      </div>

      {/* Skills */}
      {project.required_skills && project.required_skills.length > 0 && (
        <div className="mb-4">
          <p className="text-xs text-gray-500 mb-2">Required Skills:</p>
          <div className="flex flex-wrap gap-2">
            {project.required_skills.slice(0, 3).map((skill, idx) => (
              <span key={idx} className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded">
                {skill.skill_name}
              </span>
            ))}
            {project.required_skills.length > 3 && (
              <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                +{project.required_skills.length - 3} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Progress Bar (if applicable) */}
      {project.progress !== undefined && project.progress !== null && (
        <div className="mb-4">
          <div className="flex justify-between text-xs text-gray-600 mb-1">
            <span>Progress</span>
            <span>{project.progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all ${
                project.progress === 100 ? 'bg-green-500' : 'bg-blue-500'
              }`}
              style={{ width: `${project.progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Single Centered Button */}
      <div className="flex justify-center pt-4 border-t border-gray-200">
        <button
          onClick={() => onView && onView(project)}
          className="w-full px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold text-sm"
        >
          View Details
        </button>
      </div>
    </div>
  );
}