/**
 * src/pages/admin/EscrowManagement.jsx
 * Owner: Caleb
 * Description: Admin interface for managing escrow payments and releases (live DB version).
 */

import React, { useState, useEffect } from "react";
import {
  CheckCircle,
  XCircle,
  DollarSign,
  Clock,
  ShieldCheck,
} from "lucide-react";
import Layout from "../../components/layout/Layout";
import {
  fetchEscrows,
  releaseEscrow,
  cancelEscrow,
} from "@/api/escrowAPI";
import toast from "react-hot-toast";

function EscrowManagement() {
  const [escrows, setEscrows] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch escrows from backend
  const loadEscrows = async () => {
    try {
      setLoading(true);
      const res = await fetchEscrows();
      setEscrows(res.escrows || []);
    } catch (err) {
      console.error("Failed to load escrows:", err);
      toast.error("Failed to load escrow records.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEscrows();
  }, []);

  // ✅ Summary stats
  const summaryStats = {
    total: escrows.length,
    inEscrow: escrows.filter((e) => e.status === "in_escrow" || e.status === "held").length,
    released: escrows.filter((e) => e.status === "released").length,
    refunded: escrows.filter((e) => e.status === "refunded").length,
  };

  // ✅ Action handlers
  const handleRelease = async (id) => {
    if (!window.confirm("Release funds to freelancer?")) return;
    try {
      await releaseEscrow(id);
      toast.success("Funds released successfully!");
      loadEscrows();
    } catch (err) {
      console.error("Release failed:", err);
      toast.error("Failed to release escrow.");
    }
  };

  const handleRefund = async (id) => {
    if (!window.confirm("Refund funds to client?")) return;
    try {
      await cancelEscrow(id);
      toast.success("Funds refunded successfully!");
      loadEscrows();
    } catch (err) {
      console.error("Refund failed:", err);
      toast.error("Failed to refund escrow.");
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-100 p-6 mt-16">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-semibold text-gray-800 mb-6">
            Escrow Management
          </h1>

          {/* ✅ Summary Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-2xl p-4 flex items-center gap-3 border border-gray-300">
              <DollarSign className="text-indigo-600" size={28} />
              <div>
                <p className="text-gray-500 text-sm">Total Transactions</p>
                <h2 className="text-lg font-bold text-gray-800">
                  {summaryStats.total}
                </h2>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 flex items-center gap-3 border border-gray-300">
              <Clock className="text-yellow-500" size={28} />
              <div>
                <p className="text-gray-500 text-sm">In Escrow</p>
                <h2 className="text-lg font-bold text-gray-800">
                  {summaryStats.inEscrow}
                </h2>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 flex items-center gap-3 border border-gray-300">
              <ShieldCheck className="text-green-500" size={28} />
              <div>
                <p className="text-gray-500 text-sm">Released</p>
                <h2 className="text-lg font-bold text-gray-800">
                  {summaryStats.released}
                </h2>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 flex items-center gap-3 border border-gray-300">
              <XCircle className="text-red-500" size={28} />
              <div>
                <p className="text-gray-500 text-sm">Refunded</p>
                <h2 className="text-lg font-bold text-gray-800">
                  {summaryStats.refunded}
                </h2>
              </div>
            </div>
          </div>

          {/* ✅ Escrow Table */}
          <div className="bg-white rounded-lg overflow-hidden shadow">
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
                ) : escrows.length === 0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="py-6 text-center text-gray-500 italic"
                    >
                      No escrows found.
                    </td>
                  </tr>
                ) : (
                  escrows.map((escrow) => (
                    <tr
                      key={escrow.id}
                      className="border-t hover:bg-gray-50 transition"
                    >
                      <td className="py-3 px-4 font-medium">
                        {escrow.project_title || "N/A"}
                      </td>
                      <td className="py-3 px-4">{escrow.client_name}</td>
                      <td className="py-3 px-4">{escrow.freelancer_name}</td>
                      <td className="py-3 px-4 font-semibold text-gray-800">
                        ${escrow.amount}
                      </td>
                      <td className="py-3 px-4 capitalize">{escrow.status}</td>
                      <td className="py-3 px-4 flex gap-2">
                        {escrow.status === "in_escrow" ||
                        escrow.status === "held" ? (
                          <>
                            <button
                              onClick={() => handleRelease(escrow.id)}
                              className="flex items-center gap-1 px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition"
                            >
                              <CheckCircle size={16} />
                              Release
                            </button>
                            <button
                              onClick={() => handleRefund(escrow.id)}
                              className="flex items-center gap-1 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                            >
                              <XCircle size={16} />
                              Refund
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
    </Layout>
  );
}

export default EscrowManagement;
