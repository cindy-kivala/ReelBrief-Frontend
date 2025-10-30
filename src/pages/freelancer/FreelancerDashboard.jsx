import React, { useEffect, useState } from "react";
import { fetchDashboardStats, fetchRecentProjects } from "@/api/dashboardAPI";
import { Briefcase, Clock, CheckCircle, DollarSign } from "lucide-react";

const FreelancerDashboard = () => {
  const [stats, setStats] = useState({});
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [statsData, projectsData] = await Promise.all([
          fetchDashboardStats(),      // → { active_projects, pending_reviews, completed_projects, total_earned }
          fetchRecentProjects(),      // → projects with title, client_name, budget, progress
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

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const name = user.first_name || "Freelancer";

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  const statCards = [
    { label: "Active Projects", value: stats.active_projects || 0, icon: Briefcase, color: "blue" },
    { label: "In Review", value: stats.pending_reviews || 0, icon: Clock, color: "yellow" },
    { label: "Completed", value: stats.completed_projects || 0, icon: CheckCircle, color: "green" },
    { label: "Total Earned", value: `$${stats.total_earned || 0}`, icon: DollarSign, color: "indigo" },
  ];

  return (
    <div className="bg-gray-100 min-h-screen p-6 md:ml-64 mt-16">
      <div className="flex flex-col sm:flex-row justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, {name}</h1>
          <p className="text-gray-600">Here's an overview of your projects and earnings</p>
        </div>
        <button className="mt-4 sm:mt-0 bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-600">
          + New Project
        </button>
      </div>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {statCards.map((card, i) => (
          <div key={i} className="bg-white p-5 rounded-xl border text-center">
            <card.icon className={`mx-auto text-3xl text-${card.color}-600 mb-2`} />
            <p className="text-2xl font-bold">{card.value}</p>
            <p className="text-sm text-gray-600">{card.label}</p>
          </div>
        ))}
      </section>

      <section className="bg-white p-6 rounded-xl border">
        <div className="flex justify-between mb-6">
          <h2 className="text-2xl font-bold">Recent Projects</h2>
          <a href="/projects" className="text-blue-500 hover:underline">View All</a>
        </div>

        <div className="space-y-4">
          {projects.map(p => (
            <div key={p.id} className="border p-4 rounded-lg hover:border-blue-400">
              <div className="flex justify-between mb-2">
                <h3 className="font-semibold text-lg">{p.title}</h3>
                <span className={`px-3 py-1 rounded text-white text-sm ${
                  p.status === "completed" ? "bg-green-600" :
                  p.status === "pending_review" ? "bg-yellow-500" :
                  "bg-blue-700"
                }`}>
                  {p.status.replace("_", " ")}
                </span>
              </div>
              <p className="text-sm text-gray-600">Client: {p.client_name}</p>
              <p className="text-sm text-gray-600">${p.budget} • Due {new Date(p.deadline).toLocaleDateString()}</p>
              <div className="mt-2 bg-gray-200 h-2 rounded-full">
                <div
                  className={`h-2 rounded-full ${
                    p.status === "completed" ? "bg-green-600" :
                    p.status === "pending_review" ? "bg-yellow-500" : "bg-blue-700"
                  }`}
                  style={{ width: `${p.progress}%` }}
                />
              </div>
              <p className="text-right text-xs text-gray-500">{p.progress}% Complete</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default FreelancerDashboard;
