/**
 * ClientDashboard.jsx
 * Owner: Caleb
 * Description: Dashboard for clients to view projects, deliverables, and payments.
 */

import React from "react";

function ClientDashboard() {
  return (
    <div className="bg-gray-100 min-h-screen p-6 md:ml-64 mt-16">

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
        <div>
          <h1 className="font-bold text-3xl text-gray-800">Welcome back, John </h1>
          <p className="text-gray-600 mt-1">
            Here's what's happening with your projects
          </p>
        </div>
        <button className="mt-4 sm:mt-0 bg-blue-800 px-4 py-2 rounded-lg text-white font-medium hover:bg-blue-600 transition">
          + New Project
        </button>
      </div>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { icon: "fi fi-rr-folder-open", label: "Active Projects", value: "3" },
          { icon: "fi fi-rr-clock-three", label: "In Review", value: "1" },
          { icon: "fi fi-rs-check-circle", label: "Completed", value: "5" },
          { icon: "fi fi-rr-dollar", label: "Total Spent", value: "$24.5K" },
        ].map((card, index) => (
          <div
            key={index}
            className="bg-white rounded-xl border border-gray-300 p-5 text-center"
          >
            <div className="flex flex-col items-center gap-2">
              <i className={`${card.icon} text-2xl text-blue-700`}></i>
              <p className="text-2xl font-bold text-gray-700">{card.value}</p>
              <h3 className="text-sm text-gray-600 font-medium">{card.label}</h3>
            </div>
          </div>
        ))}
      </section>

      <section className="mt-10 bg-white p-6 rounded-xl border border-gray-300">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-bold text-2xl text-gray-800">Recent Projects</h1>
          <a
            href="#"
            className=" text-blue-500 px-4 py-2 rounded-lg hover:bg-red-400 hover:text-white transition"
          >
            View All
          </a>
        </div>

        <div className="flex flex-col gap-5">
          <div className="border border-gray-300 rounded-xl p-4 hover:border-blue-400">
            <div className="flex flex-wrap items-center justify-between mb-2">
              <h2 className="font-semibold text-lg text-gray-800">
                Logo Design for TechCo
              </h2>
              <div className="flex items-center gap-2">
                <span className="bg-blue-700 text-white text-sm px-3 py-1 rounded-xl">
                  In Progress
                </span>
                <a
                  href="#"
                  className="text-sm border border-gray-300 px-3 py-1 rounded-lg hover:bg-red-400 hover:text-white transition"
                >
                  View Details
                </a>
              </div>
            </div>
            <p className="text-gray-600 text-sm">Freelancer: Sarah Johnson</p>
            <p className="text-gray-600 text-sm">$1500 • Due Apr 25</p>

            <div className="mt-3 w-2/3 bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-blue-600 h-2.5 rounded-full"
                style={{ width: "60%" }}
              ></div>
            </div>
            <p className="text-right text-xs text-gray-500 mt-1 w-2/3">
              60% Complete
            </p>
          </div>

          <div className="border border-gray-300 rounded-xl p-4 hover:border-blue-400">
            <div className="flex flex-wrap items-center justify-between mb-2">
              <h2 className="font-semibold text-lg text-gray-800">
                Website Copy
              </h2>
              <div className="flex items-center gap-2">
                <span className="bg-yellow-500 text-white text-sm px-3 py-1 rounded-xl">
                  Needs Review
                </span>
                <a
                  href="#"
                  className="text-sm border border-gray-300 px-3 py-1 rounded-lg hover:bg-red-400 hover:text-white transition"
                >
                  View Details
                </a>
              </div>
            </div>
            <p className="text-gray-600 text-sm">Freelancer: Michael Chen</p>
            <p className="text-gray-600 text-sm">$2200 • Due Apr 25</p>

            <div className="mt-3 w-2/3 bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-yellow-500 h-2.5 rounded-full"
                style={{ width: "40%" }}
              ></div>
            </div>
            <p className="text-right text-xs text-gray-500 mt-1 w-2/3">
              40% Complete
            </p>
          </div>

          <div className="border border-gray-300 rounded-xl p-4 hover:border-blue-400">
            <div className="flex flex-wrap items-center justify-between mb-2">
              <h2 className="font-semibold text-lg text-gray-800">
                Video Editing
              </h2>
              <div className="flex items-center gap-2">
                <span className="bg-green-600 text-white text-sm px-3 py-1 rounded-xl">
                  Completed
                </span>
                <a
                  href="#"
                  className="text-sm border border-gray-300 px-3 py-1 rounded-lg hover:bg-red-400 hover:text-white transition"
                >
                  View Details
                </a>
              </div>
            </div>
            <p className="text-gray-600 text-sm">Freelancer: Emma Davis</p>
            <p className="text-gray-600 text-sm">$3500 • Due Apr 25</p>

            <div className="mt-3 w-2/3 bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-green-600 h-2.5 rounded-full"
                style={{ width: "100%" }}
              ></div>
            </div>
            <p className="text-right text-xs text-gray-500 mt-1 w-2/3">
              100% Complete
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ClientDashboard;
