// src/pages/ClientFreelancers.jsx
import React, { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";

export default function ClientFreelancers() {
  const [freelancers, setFreelancers] = useState([]);

  useEffect(() => {
    (async () => {
      const res = await axiosClient.get("/freelancers/");
      setFreelancers(res.data.freelancers || []);
    })();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Freelancers</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {freelancers.map(f => (
          <div key={f.id} className="border rounded-lg p-4 shadow hover:shadow-md">
            <h3 className="text-lg font-semibold">{f.name}</h3>
            <p className="text-gray-600">{f.email}</p>
            <p className="text-gray-700">{f.bio}</p>
            <div className="mt-2">
              <span className={`text-xs px-2 py-1 rounded-full ${
                f.application_status === "pending"
                  ? "bg-yellow-100 text-yellow-800"
                  : f.application_status === "approved"
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}>
                {f.application_status}
              </span>
              {f.application_status === "rejected" && f.rejection_reason && (
                <p className="text-sm text-red-600 mt-1">Reason: {f.rejection_reason}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
