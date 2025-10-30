/**
 * ProjectCard.jsx
 * Owner: Monica
 * Description: Card component displaying project summary info.
 */

// TODO:
// - Display project title, description, and status
// - Include “View Details” button linking to ProjectDetail

import React from "react";

export default function ProjectCard({ project, onView }) {
  // Return null if no project is provided
  if (!project) return null;

  const {
    title = "Untitled Project",
    status = "N/A",
    description = "No description available",
    budget = 0,
    required_skills = [],
  } = project;

  return (
    <div className="border rounded-lg p-4 shadow-sm hover:shadow-md transition bg-white">
      {/* --- Project Header --- */}
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-semibold text-gray-800 line-clamp-1">
          {title}
        </h3>
        <span
          className={`text-xs px-2 py-1 rounded-full ${
            status === "completed"
              ? "bg-green-100 text-green-700"
              : status === "cancelled"
              ? "bg-red-100 text-red-700"
              : status === "matched"
              ? "bg-indigo-100 text-indigo-700"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          {status}
        </span>
      </div>

      {/* --- Description --- */}
      <p className="mt-2 text-sm text-gray-600 line-clamp-3">
        {description}
      </p>

      {/* --- Skills --- */}
      {required_skills.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {required_skills.map((s) => (
            <span
              key={s.id}
              className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-700"
            >
              {s.skill_name} • {s.required_proficiency}
            </span>
          ))}
        </div>
      )}

      {/* --- Footer --- */}
      <div className="mt-4 flex justify-between items-center">
        <div className="text-sm text-gray-500">
          Budget: <span className="font-medium">${budget}</span>
        </div>
        <button
          onClick={() => onView?.(project)}
          className="px-3 py-1 bg-indigo-600 text-white rounded text-sm hover:bg-indigo-700"
        >
          View Details
        </button>
      </div>
    </div>
  );
}

