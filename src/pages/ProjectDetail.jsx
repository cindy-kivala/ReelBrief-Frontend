/**
 * ProjectDetail.jsx
 * Owner: Monica
 * Description: Displays full project details for clients or freelancers.
 */

import React, { useEffect, useState } from "react";
import { fetchProjectById } from "../api/projectAPI";
import FreelancerMatch from "../components/projects/FreelancerMatch";

import ProjectForm from "../components/projects/ProjectForm";

export default function ProjectDetail({ projectId, onClose, onUpdated }) {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showMatch, setShowMatch] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  // --- Fetch project details ---
  useEffect(() => {
    const loadProject = async () => {
      try {
        const data = await fetchProjectById(projectId);
        setProject(data);
      } catch (err) {
        console.error("Failed to load project:", err);
      } finally {
        setLoading(false);
      }
    };
    if (projectId) loadProject();
  }, [projectId]);

  // --- Refresh after update ---
  const handleUpdated = async () => {
    const data = await fetchProjectById(projectId);
    setProject(data);
    onUpdated && onUpdated();
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-600">Loading project details...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-600">Project not found.</p>
          <button
            onClick={onClose}
            className="mt-4 px-4 py-2 border rounded text-gray-600"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-3xl p-6 rounded-xl shadow-lg overflow-y-auto max-h-[90vh]">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-2xl font-semibold text-gray-800">
            {project.title}
          </h2>
          <span
            className={`text-xs px-2 py-1 rounded-full capitalize ${
              project.status === "completed"
                ? "bg-green-100 text-green-700"
                : project.status === "cancelled"
                ? "bg-red-100 text-red-700"
                : project.status === "matched"
                ? "bg-indigo-100 text-indigo-700"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {project.status}
          </span>
        </div>

        {/* Description */}
        <p className="text-gray-700 leading-relaxed">{project.description}</p>

        {/* Budget / Deadline */}
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <div className="text-xs text-gray-500">Budget</div>
            <div className="font-medium">${project.budget}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Deadline</div>
            <div>{project.deadline}</div>
          </div>
        </div>

        {/* Skills */}
        <div className="mt-4">
          <h4 className="text-sm font-semibold text-gray-700">
            Required Skills
          </h4>
          <div className="flex gap-2 mt-2 flex-wrap">
            {project.required_skills?.map((s) => (
              <span
                key={s.id}
                className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-700"
              >
                {s.skill_name} • {s.required_proficiency}
              </span>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={() => setShowEdit(true)}
            className="px-4 py-2 border rounded hover:bg-gray-100"
          >
            Edit
          </button>
          <button
            onClick={() => setShowMatch(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            Match Freelancers
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-100"
          >
            Close
          </button>
        </div>
      </div>

      {/* Modals */}
      {showMatch && (
        <FreelancerMatch
          project={project}
          onClose={() => setShowMatch(false)}
        />
      )}

      {showEdit && (
        <ProjectForm
          project={project}
          onClose={() => setShowEdit(false)}
          onCreated={handleUpdated}
        />
      )}
    </div>
  );
}
