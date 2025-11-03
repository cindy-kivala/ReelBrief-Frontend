/**
 * ProjectForm.jsx
 * Owner: Monica
 * Description: Form for creating or editing projects.
 */

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Plus } from "lucide-react"; 
import { createProject, updateProject } from "../../api/projectAPI";
import axios from "axios";

export default function ProjectForm({ onClose, onCreated, project }) {
  const { register, handleSubmit, reset } = useForm();
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Load skill list from API
    const loadSkills = async () => {
      try {
        const res = await axios.get("/api/skills");
        setSkills(res.data.skills || []);
      } catch (e) {
        console.error("Failed to load skills", e);
        setSkills([]); // Fallback to empty array
      }
    };
    
    loadSkills();
    
    // Pre-fill form if editing existing project
    if (project) {
      reset({
        title: project.title || "",
        description: project.description || "",
        budget: project.budget || "",
        deadline: project.deadline ? project.deadline.split('T')[0] : "", // Format date for input
        project_type: project.project_type || "",
        is_sensitive: project.is_sensitive ? "true" : "false",
        skill_ids: project.required_skills?.map(skill => skill.id.toString()) || []
      });
    } else {
      // Reset form for new project
      reset({
        title: "",
        description: "",
        budget: "",
        deadline: "",
        project_type: "",
        is_sensitive: "false",
        skill_ids: []
      });
    }
  }, [project, reset]);

  const onSubmit = async (data) => {
    setLoading(true);
    setError("");

    try {
      console.log("Form data:", data);
      
      const payload = {
        title: data.title,
        description: data.description,
        budget: parseFloat(data.budget),
        deadline: data.deadline,
        project_type: data.project_type,
        is_sensitive: data.is_sensitive === "true",
        required_skills: (data.skill_ids || []).map((sid) => ({ 
          skill_id: parseInt(sid), 
          required_proficiency: "intermediate" 
        })),
      };

      console.log("Sending payload:", payload);

      let response;
      if (project) {
        // Update existing project
        response = await updateProject(project.id, payload);
      } else {
        // Create new project
        response = await createProject(payload);
      }

      console.log("API Response:", response);

      // Call success callback
      if (onCreated) {
        onCreated(response);
      }

      // Close the modal
      if (onClose) {
        onClose();
      }

    } catch (err) {
      console.error("Failed to save project", err);
      setError(err.response?.data?.error || err.message || "Failed to save project");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-2xl p-6 rounded-lg shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            {project ? "Edit Project" : "Create New Project"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-1 rounded"
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Project Title *
            </label>
            <input 
              {...register("title", { required: "Title is required" })} 
              placeholder="Enter project title"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description *
            </label>
            <textarea 
              {...register("description", { required: "Description is required" })} 
              rows={4}
              placeholder="Describe the project in detail..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Budget & Deadline */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Budget ($) *
              </label>
              <input 
                type="number"
                step="0.01"
                {...register("budget", { 
                  required: "Budget is required",
                  min: { value: 1, message: "Budget must be at least $1" }
                })} 
                placeholder="0.00"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Deadline *
              </label>
              <input 
                type="date"
                {...register("deadline", { required: "Deadline is required" })} 
                min={new Date().toISOString().split('T')[0]}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Project Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Project Type
            </label>
            <select 
              {...register("project_type")} 
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select project type</option>
              <option value="web">Web Development</option>
              <option value="design">Design</option>
              <option value="video">Video Production</option>
              <option value="animation">Animation</option>
              <option value="writing">Writing</option>
              <option value="marketing">Marketing</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Sensitive Project */}
          <div>
            <label className="flex items-center">
              <input 
                type="checkbox"
                {...register("is_sensitive")} 
                className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">This project contains sensitive information</span>
            </label>
          </div>

          {/* Required Skills */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Required Skills (Select multiple with Ctrl/Cmd)
            </label>
            <select 
              multiple 
              {...register("skill_ids")} 
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-32"
            >
              {skills.map(skill => (
                <option key={skill.id} value={skill.id}>
                  {skill.name}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Hold Ctrl/Cmd to select multiple skills
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button 
              type="button" 
              onClick={onClose}
              disabled={loading}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  {project ? "Updating..." : "Creating..."}
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  {project ? "Update Project" : "Create Project"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}