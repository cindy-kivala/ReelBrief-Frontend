//src/pages/client/ClientDashboard.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchDashboardStats, fetchRecentProjects, approveProject } from "@/api/dashboardAPI";
import { Briefcase, Clock, CheckCircle, DollarSign, ThumbsUp, RefreshCcw } from "lucide-react";
import Navbar from "../../components/layout/Navbar";
import Sidebar from "../../components/layout/Sidebar";

const ClientDashboard = () => {
  const [stats, setStats] = useState({});
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [statsData, projectsData] = await Promise.all([
          fetchDashboardStats(),   // → { active_projects, pending_approval, completed_projects, total_spent }
          fetchRecentProjects(),   // → projects with title, freelancer_name, budget, progress, status
        ]);
        setStats(statsData);
        setProjects(projectsData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleApprove = async (projectId) => {
    try {
      await approveProject(projectId); // Call backend endpoint
      setProjects(prev => prev.map(p => p.id === projectId ? { ...p, status: "completed" } : p));
    } catch (err) {
      console.error("Failed to approve project:", err);
    }
  };

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const name = user.first_name || "Client";

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  const statCards = [
    { label: "Active Projects", value: stats.active_projects || 0, icon: Briefcase, color: "blue" },
    { label: "Pending Approval", value: stats.pending_approval || 0, icon: Clock, color: "yellow" },
    { label: "Completed", value: stats.completed_projects || 0, icon: CheckCircle, color: "green" },
    { label: "Total Spent", value: `$${stats.total_spent || 0}`, icon: DollarSign, color: "indigo" },
  ];

  return (
    <div className="bg-gray-100 min-h-screen p-6 md:ml-64 mt-16">
      <div className="flex flex-col sm:flex-row justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, {name}</h1>
          <p className="text-gray-600">Manage your projects, payments, and approvals here</p>
        </div>
        <button className="mt-4 sm:mt-0 bg-blue-800 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
          + New Project
        </button>
      </div>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {statCards.map((card, i) => (
          <div key={i} className="bg-white p-5 rounded-xl border text-center">
            <card.icon className={`mx-auto text-3xl ${
              card.color === 'blue' ? 'text-blue-600' :
              card.color === 'yellow' ? 'text-yellow-600' :
              card.color === 'green' ? 'text-green-600' :
              'text-indigo-600'
            } mb-2`} />
            <p className="text-2xl font-bold">{card.value}</p>
            <p className="text-sm text-gray-600">{card.label}</p>
          </div>
        ))}
      </section>

      <section className="bg-white p-6 rounded-xl border">
        <div className="flex justify-between mb-6">
          <h2 className="text-2xl font-bold">Recent Projects</h2>
          <Link to="/projects" className="text-blue-500 hover:underline">View All</Link>
        </div>

        <div className="space-y-4">
          {projects.map(p => (
            <div key={p.id} className="border p-4 rounded-lg hover:border-blue-400">
              <div className="flex justify-between mb-2">
                <h3 className="font-semibold text-lg">{p.title}</h3>
                <span className={`px-3 py-1 rounded text-white text-sm ${
                  p.status === "completed" ? "bg-green-600" :
                  p.status === "pending_approval" ? "bg-yellow-500" :
                  "bg-blue-700"
                }`}>
                  {p.status.replace("_", " ")}
                </span>
              </div>
              <p className="text-sm text-gray-600">Freelancer: {p.freelancer_name}</p>
              <p className="text-sm text-gray-600">${p.budget} • Due {new Date(p.deadline).toLocaleDateString()}</p>
              <div className="mt-2 bg-gray-200 h-2 rounded-full">
                <div
                  className={`h-2 rounded-full ${
                    p.status === "completed" ? "bg-green-600" :
                    p.status === "pending_approval" ? "bg-yellow-500" : "bg-blue-700"
                  }`}
                  style={{ width: `${p.progress}%` }}
                />
              </div>
              <p className="text-right text-xs text-gray-500">{p.progress}% Complete</p>

              {p.status === "pending_approval" && (
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => handleApprove(p.id)}
                    className="flex items-center gap-1 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-500 text-sm"
                  >
                    <ThumbsUp className="w-4 h-4" /> Approve
                  </button>
                  <button
                    className="flex items-center gap-1 px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-400 text-sm"
                  >
                    <RefreshCcw className="w-4 h-4" /> Request Revision
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ClientDashboard;
