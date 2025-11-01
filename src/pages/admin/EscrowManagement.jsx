/**src/pages/admin/EscrowManagement.jsx
 * EscrowManagement.jsx
 * Owner: Caleb
 * Description: Admin interface for managing escrow payments and releases (dummy preview).
 */

import React, { useState, useEffect } from "react";
import { CheckCircle, XCircle, DollarSign, Clock, ShieldCheck } from "lucide-react";

function EscrowManagement() {
  const [escrows, setEscrows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setEscrows([
        {
          id: 1,
          project_name: "Brand Logo Design",
          client_name: "Jane Doe",
          freelancer_name: "Alex Kim",
          amount: 350,
          status: "in_escrow",
        },
        {
          id: 2,
          project_name: "Website Redesign",
          client_name: "Michael Smith",
          freelancer_name: "Sarah Johnson",
          amount: 1200,
          status: "released",
        },
        {
          id: 3,
          project_name: "Social Media Campaign",
          client_name: "Grace Lee",
          freelancer_name: "Daniel Brown",
          amount: 800,
          status: "refunded",
        },
        {
          id: 4,
          project_name: "App UI Prototype",
          client_name: "John Doe",
          freelancer_name: "Emily Davis",
          amount: 950,
          status: "in_escrow",
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const summaryStats = {
    total: escrows.length,
    inEscrow: escrows.filter((e) => e.status === "in_escrow").length,
    released: escrows.filter((e) => e.status === "released").length,
    refunded: escrows.filter((e) => e.status === "refunded").length,
  };

  const handleRelease = (id) => {
    alert(`Released escrow ID ${id}`);
  };

  const handleCancel = (id) => {
    alert(`Cancelled escrow ID ${id}`);
  };

  return (
    <div className=" min-h-screen bg-gray-100 p-6 md:ml-64 mt-16">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6">
          Escrow Management
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white  rounded-2xl p-4 flex items-center gap-3 border border-gray-300">
            <DollarSign className="text-indigo-600" size={30} />
            <div>
              <p className="text-gray-500 text-sm">Total Transactions</p>
              <h2 className="text-lg font-bold text-gray-800">{summaryStats.total}</h2>
            </div>
          </div>

          <div className="bg-white  rounded-2xl p-4 flex items-center gap-3 border border-gray-300">
            <Clock className="text-Byellow-500" size={30} />
            <div>
              <p className="text-gray-500 text-sm">In Escrow</p>
              <h2 className="text-lg font-bold text-gray-800">{summaryStats.inEscrow}</h2>
            </div>
          </div>

          <div className="bg-white  rounded-2xl p-4 flex items-center gap-3 border  border-gray-300">
            <ShieldCheck className="text-green-500" size={30} />
            <div>
              <p className="text-gray-500 text-sm">Released</p>
              <h2 className="text-lg font-bold text-gray-800">{summaryStats.released}</h2>
            </div>
          </div>

          <div className="bg-white  rounded-2xl p-4 flex items-center gap-3 border  border-gray-300">
            <XCircle className="text-red-500" size={30} />
            <div>
              <p className="text-gray-500 text-sm">Refunded</p>
              <h2 className="text-lg font-bold text-gray-800">{summaryStats.refunded}</h2>
            </div>
          </div>
        </div>

        <div className="bg-white  rounded-lg overflow-hidden">
          <table className="min-w-full text-sm text-gray-700">
            <thead className="bg-blue-800 text-white">
              <tr>
                <th className="py-3 px-4 text-left">Project</th>
                <th className="py-3 px-4 text-left">Client</th>
                <th className="py-3 px-4 text-left">Freelancer</th>
                <th className="py-3 px-4 text-left">Amount</th>
                <th className="py-3 px-4 text-left">Status</th>
                <th className="py-3 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan="6"
                    className="py-6 text-center text-gray-500 italic"
                  >
                    Loading escrow data...
                  </td>
                </tr>
              ) : (
                escrows.map((escrow) => (
                  <tr
                    key={escrow.id}
                    className="border-t hover:bg-gray-50 transition"
                  >
                    <td className="py-3 px-4 font-medium">
                      {escrow.project_name}
                    </td>
                    <td className="py-3 px-4">{escrow.client_name}</td>
                    <td className="py-3 px-4">{escrow.freelancer_name}</td>
                    <td className="py-3 px-4 font-semibold text-gray-800">
                      ${escrow.amount}
                    </td>
                    <td className="py-3 px-4 capitalize">{escrow.status}</td>
                    <td className="py-3 px-4 flex gap-2">
                      {escrow.status === "in_escrow" ? (
                        <>
                          <button
                            onClick={() => handleRelease(escrow.id)}
                            className="flex items-center gap-1 px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                          >
                            <CheckCircle size={16} />
                            Release
                          </button>
                          <button
                            onClick={() => handleCancel(escrow.id)}
                            className="flex items-center gap-1 px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                          >
                            <XCircle size={16} />
                            Cancel
                          </button>
                        </>
                      ) : (
                        <span className="text-gray-400 italic">No actions</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default EscrowManagement;
