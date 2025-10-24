/**
 * ProjectList.jsx
 * Owner: Monica
 * Description: Displays a list of available projects with filtering or search.
 */

// TODO:
// - Fetch project list from projectAPI
// - Render ProjectCard components
// - Add search and filter functionality
// src/components/ProjectList.jsx
import React, { useEffect, useState } from "react";
import { fetchProjects } from "../api/projects";
import ProjectCard from "./ProjectCard";
import ProjectForm from "./ProjectForm";
import ProjectDetail from "./ProjectDetail";
import FreelancerAssignmentModal from "./FreelancerAssignmentModal";

export default function ProjectList() {
  const [projects, setProjects] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [openCreate, setOpenCreate] = useState(false);
  const [selected, setSelected] = useState(null);
  const [assignProject, setAssignProject] = useState(null);
  const [search, setSearch] = useState("");

  const load = async (p = page) => {
    try {
      const res = await fetchProjects({ page: p, per_page: 8, search });
      setProjects(res.data.projects || []);
      setTotal(res.data.total || 0);
    } catch (err) {
      console.error("Failed to load projects", err);
    }
  };

  useEffect(() => {
    load(1);
    // eslint-disable-next-line
  }, [search]);

  const onOpen = (project) => setSelected(project);
  const onAssign = (project) => setAssignProject(project);
  const onComplete = async (project) => {
    try {
      await fetch(`/api/projects/${project.id}/complete`, { method: "POST", headers: { Authorization: `Bearer ${localStorage.getItem("token")}`, "Content-Type": "application/json" }});
      load();
    } catch (err) {
      console.error(err);
    }
  };

  const onCreated = () => {
    setOpenCreate(false);
    load(1);
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Projects</h1>
        <div className="flex gap-2">
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search projects..." className="border rounded px-3 py-1" />
          <button onClick={() => setOpenCreate(true)} className="px-4 py-2 bg-indigo-600 text-white rounded">Create Project</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {projects.map((p) => (
          <ProjectCard key={p.id} project={p} onOpen={onOpen} onAssign={onAssign} onComplete={onComplete} />
        ))}
      </div>

      <div className="mt-6 flex justify-between items-center">
        <div>Showing {projects.length} of {total}</div>
        <div className="flex gap-2">
          <button disabled={page <= 1} onClick={() => { setPage(page - 1); load(page - 1); }} className="px-3 py-1 border rounded">Prev</button>
          <button onClick={() => { setPage(page + 1); load(page + 1); }} className="px-3 py-1 border rounded">Next</button>
        </div>
      </div>

      {openCreate && <ProjectForm onClose={() => setOpenCreate(false)} onCreated={onCreated} />}
      {selected && <ProjectDetail project={selected} onClose={() => setSelected(null)} onUpdated={load} />}
      {assignProject && <FreelancerAssignmentModal project={assignProject} onClose={() => { setAssignProject(null); load(); }} />}
    </div>
  );
}

