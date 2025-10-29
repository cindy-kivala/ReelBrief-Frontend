/**
 * ProjectForm.jsx
 * Owner: Monica
 * Description: Form for creating or editing projects.
  */

// TODO:
// - Build controlled form fields for project details
// - Connect submit to create/update API calls
// src/components/ProjectForm.jsx
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { createProject } from "../../api/projectAPI";

import axios from "axios";

export default function ProjectForm({ onClose, onCreated, project }) {
  const { register, handleSubmit, reset } = useForm();
  const [skills, setSkills] = useState([]);

  useEffect(() => {
    // load skill list from API
    (async () => {
      try {
        const res = await axios.get("/api/skills"); // assume skill list endpoint
        setSkills(res.data.skills || []);
      } catch (e) {
        console.error("Failed to load skills", e);
      }
    })();
    if (project) {
      reset({
        title: project.title,
        description: project.description,
        budget: project.budget,
        deadline: project.deadline,
      });
    }
  }, [project, reset]);

  const onSubmit = async (data) => {
    try {
      const payload = {
        title: data.title,
        description: data.description,
        budget: parseFloat(data.budget),
        deadline: data.deadline,
        project_type: data.project_type,
        is_sensitive: data.is_sensitive === "true",
        required_skills: (data.skill_ids || []).map((sid) => ({ skill_id: Number(sid), required_proficiency: "intermediate" })),
      };
      await createProject(payload);
      onCreated && onCreated();
    } catch (err) {
      console.error("Failed to create project", err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-2xl p-6 rounded shadow-lg">
        <h2 className="text-xl font-semibold mb-4">{project ? "Edit Project" : "Create Project"}</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <input {...register("title", { required: true })} placeholder="Title" className="w-full p-2 border rounded" />
          <textarea {...register("description", { required: true })} rows={4} placeholder="Description" className="w-full p-2 border rounded" />
          <div className="grid grid-cols-2 gap-3">
            <input {...register("budget", { required: true })} placeholder="Budget" className="p-2 border rounded" />
            <input {...register("deadline", { required: true })} type="date" className="p-2 border rounded" />
          </div>

          <select {...register("project_type")} className="p-2 border rounded w-full">
            <option value="">Project type</option>
            <option value="web">Web</option>
            <option value="design">Design</option>
            <option value="video">Video</option>
          </select>

          <div>
            <label className="text-sm">Required skills</label>
            <select multiple {...register("skill_ids")} className="w-full border p-2 rounded h-28">
              {skills.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>

          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
}
