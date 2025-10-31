// In ProjectList.jsx - Use the modal approach
import React, { useEffect, useState } from "react";
import { fetchAllProjects } from "../api/projectAPI";
import ProjectDetail from "./ProjectDetail";
import ProjectCard from "../components/projects/ProjectCard";
import ProjectForm from "../components/projects/ProjectForm"; 
import FreelancerMatch from "../components/projects/FreelancerMatch";
import { useAuth } from "../context/AuthContext"; // Add this import
// REMOVE: import { useNavigate } from "react-router-dom";

export default function ProjectList() {
  const [projects, setProjects] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [openCreate, setOpenCreate] = useState(false); // Keep this state
  const [selected, setSelected] = useState(null);
  const [assignProject, setAssignProject] = useState(null);
  const [search, setSearch] = useState("");

  // Add auth context to get user role
  const { user } = useAuth();
  const isClient = user?.role === 'client';
  const isAdmin = user?.role === 'admin';
  const isFreelancer = user?.role === 'freelancer';


  // Load projects 
  const load = async (p = page) => {
    try {
      const res = await fetchAllProjects({ page: p, per_page: 8, search });
      setProjects(res.projects || []);
      setTotal(res.total || 0);
    } catch (err) {
      console.error("Failed to load projects", err);
    }
  };

  useEffect(() => {
    load(1);
  }, [search]);

  const onCreated = () => {
    setOpenCreate(false);
    load(1); // Refresh the list after creation
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Projects</h1>
        <div className="flex gap-2">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects..."
            className="border rounded px-3 py-1"
          />
           {/* ONLY SHOW CREATE BUTTON FOR CLIENTS AND ADMINS */}
          {(isClient || isAdmin) && (
            <button
              onClick={() => setOpenCreate(true)}
              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
            >
              + Create Project
            </button>
          )}
        </div>
      </div>

      {/* Project Grid */}
      {projects.length === 0 ? (
        <div className="text-center text-gray-500 mt-10">No projects found.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map((p) => (
            <ProjectCard
              key={p.id}
              project={p}
              onView={setSelected}
              // Only show assign button for clients/admins
              onAssign={(isClient || isAdmin) ? setAssignProject : null}

            />
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="mt-6 flex justify-between items-center">
        <div className="text-sm text-gray-600">
          Showing {projects.length} of {total}
        </div>
        <div className="flex gap-2">
          <button
            disabled={page <= 1}
            onClick={() => {
              setPage(page - 1);
              load(page - 1);
            }}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>
          <button
            onClick={() => {
              setPage(page + 1);
              load(page + 1);
            }}
            className="px-3 py-1 border rounded"
          >
            Next
          </button>
        </div>
      </div>

      {/* MODALS - Only show for authorized roles */}
      
      {/* Create Project Modal - Only for clients/admins */}
      {(isClient || isAdmin) && openCreate && (
        <ProjectForm
          onClose={() => setOpenCreate(false)}
          onCreated={onCreated}
        />
      )}
      
      {/* Project Detail Modal - Available to all roles */}
      {selected && (
        <ProjectDetail
          projectId={selected.id}
          onClose={() => setSelected(null)}
          onUpdated={load}
        />
      )}
      
      {/* Freelancer Match Modal - Only for clients/admins */}
      {(isClient || isAdmin) && assignProject && (
        <FreelancerMatch
          project={assignProject}
          onClose={() => setAssignProject(null)}
        />
      )}
    </div>
  );
}