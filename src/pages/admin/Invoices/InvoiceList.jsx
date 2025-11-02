/**
 * src/pages/admin/Invoices/InvoiceList.jsx
 * Shows all invoices with view, edit, delete and create.
 * UI fixes: tidy buttons, compact modals with internal scroll (no cutoff),
 * readable ID/amount fields and locked body scroll while modal open.
 */

import React, { useEffect, useState } from "react";
import Layout from "@/components/layout/Layout";
import axiosClient from "@/api/axiosClient";
import { useNavigate } from "react-router-dom";

const InvoiceList = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newInvoice, setNewInvoice] = useState({
    invoice_number: "",
    project_id: "",
    client_id: "",
    freelancer_id: "",
    amount: "",
    currency: "USD",
    due_date: "",
    notes: "",
    status: "unpaid",
  });

  const navigate = useNavigate();

  // Fetch invoices
  const fetchInvoices = async () => {
    try {
      const res = await axiosClient.get("/api/invoices?page=1");
      setInvoices(res.data.invoices || []);
    } catch (err) {
      console.error("Failed to load invoices:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  // Lock body scroll while modals open
  useEffect(() => {
    if (isEditOpen || isCreateOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isEditOpen, isCreateOpen]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this invoice?")) return;
    try {
      await axiosClient.delete(`/api/invoices/${id}`);
      setInvoices((prev) => prev.filter((inv) => inv.id !== id));
      alert("Invoice deleted successfully!");
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete invoice.");
    }
  };

  // --- Edit ---
  const openEditModal = (invoice) => {
    setSelectedInvoice({
      ...invoice,
      due_date: invoice.due_date ? invoice.due_date.split("T")[0] : "",
    });
    setIsEditOpen(true);
  };

  const handleEditChange = (field, value) => {
    setSelectedInvoice((prev) => ({ ...prev, [field]: value }));
  };

  const handleEditSave = async (e) => {
    e?.preventDefault?.();
    try {
      const res = await axiosClient.patch(`/api/invoices/${selectedInvoice.id}`, {
        amount: selectedInvoice.amount,
        due_date: selectedInvoice.due_date,
        notes: selectedInvoice.notes,
        status: selectedInvoice.status,
      });
      setInvoices((prev) =>
        prev.map((i) => (i.id === selectedInvoice.id ? res.data.invoice : i))
      );
      setIsEditOpen(false);
      setSelectedInvoice(null);
      alert("✅ Invoice updated successfully!");
    } catch (err) {
      console.error("Failed to update invoice:", err);
      alert("Failed to update invoice.");
    }
  };

  // --- Create ---
  const handleCreateChange = (field, value) => {
    setNewInvoice((prev) => ({ ...prev, [field]: value }));
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      // Backend expects numbers for ids and amount — convert if necessary
      const payload = {
        ...newInvoice,
        project_id: Number(newInvoice.project_id),
        client_id: Number(newInvoice.client_id),
        freelancer_id: Number(newInvoice.freelancer_id),
        amount: Number(newInvoice.amount),
      };
      const res = await axiosClient.post("/api/invoices", payload);
      setInvoices((prev) => [res.data.invoice, ...prev]);
      setIsCreateOpen(false);
      setNewInvoice({
        invoice_number: "",
        project_id: "",
        client_id: "",
        freelancer_id: "",
        amount: "",
        currency: "USD",
        due_date: "",
        notes: "",
        status: "unpaid",
      });
      alert("✅ Invoice created successfully!");
    } catch (err) {
      console.error("Failed to create invoice:", err);
      // if backend returns message, show it
      const msg = err?.response?.data?.error || "Failed to create invoice.";
      alert(msg);
    }
  };

  if (loading)
    return (
      <Layout>
        <div className="p-6">
          <p className="text-gray-600">Loading invoices...</p>
        </div>
      </Layout>
    );

  return (
    <Layout>
      <div className="p-6">
        {/* header with Create button */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold">Invoices</h2>
          <button
            onClick={() => setIsCreateOpen(true)}
            className="px-3 py-1.5 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
          >
            + Create
          </button>
        </div>

        {/* table */}
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-100">
                <th className="px-4 py-2 text-left">#</th>
                <th className="px-4 py-2 text-left">Project</th>
                <th className="px-4 py-2 text-left">Client</th>
                <th className="px-4 py-2 text-left">Freelancer</th>
                <th className="px-4 py-2 text-left">Amount</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Issued</th>
                <th className="px-4 py-2 text-left">Due</th>
                <th className="px-4 py-2 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {invoices.length === 0 ? (
                <tr>
                  <td colSpan="9" className="py-6 text-center text-gray-500">
                    No invoices found.
                  </td>
                </tr>
              ) : (
                invoices.map((invoice, idx) => (
                  <tr key={invoice.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 font-medium">{invoice.invoice_number}</td>
                    <td className="px-4 py-2">{invoice.project?.title ?? invoice.project_id}</td>
                    <td className="px-4 py-2">{invoice.client?.name ?? invoice.client_id}</td>
                    <td className="px-4 py-2">{invoice.freelancer?.name ?? invoice.freelancer_id}</td>
                    <td className="px-4 py-2">${invoice.amount}</td>
                    <td className="px-4 py-2">{invoice.status}</td>
                    <td className="px-4 py-2">
                      {invoice.issue_date ? new Date(invoice.issue_date).toLocaleDateString() : "—"}
                    </td>
                    <td className="px-4 py-2">
                      {invoice.due_date ? new Date(invoice.due_date).toLocaleDateString() : "—"}
                    </td>

                    <td className="px-4 py-2 text-center">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => navigate(`/admin/invoices/${invoice.id}`)}
                          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 transition text-sm"
                        >
                          View
                        </button>

                        <button
                          onClick={() => openEditModal(invoice)}
                          className="px-3 py-1 bg-yellow-400 text-black rounded hover:bg-yellow-500 transition text-sm"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => handleDelete(invoice.id)}
                          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* ========== Create Modal (compact, scrollable) ========== */}
        {isCreateOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4 max-h-[80vh] overflow-y-auto p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Create Invoice</h3>
                <button
                  onClick={() => setIsCreateOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateSubmit} className="space-y-3">
                {/* compact grid for ids and amount */}
                <div className="grid grid-cols-1 gap-3">
                  <input
                    type="text"
                    placeholder="Invoice Number"
                    value={newInvoice.invoice_number}
                    onChange={(e) => handleCreateChange("invoice_number", e.target.value)}
                    className="w-full border rounded px-3 py-2"
                    required
                  />

                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="number"
                      placeholder="Project ID"
                      value={newInvoice.project_id}
                      onChange={(e) => handleCreateChange("project_id", e.target.value)}
                      className="w-full border rounded px-3 py-2"
                      required
                    />
                    <input
                      type="number"
                      placeholder="Client ID"
                      value={newInvoice.client_id}
                      onChange={(e) => handleCreateChange("client_id", e.target.value)}
                      className="w-full border rounded px-3 py-2"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="number"
                      placeholder="Freelancer ID"
                      value={newInvoice.freelancer_id}
                      onChange={(e) => handleCreateChange("freelancer_id", e.target.value)}
                      className="w-full border rounded px-3 py-2"
                      required
                    />
                    <input
                      type="number"
                      placeholder="Amount"
                      value={newInvoice.amount}
                      onChange={(e) => handleCreateChange("amount", e.target.value)}
                      className="w-full border rounded px-3 py-2"
                      required
                    />
                  </div>

                  <input
                    type="text"
                    placeholder="Currency (e.g. USD)"
                    value={newInvoice.currency}
                    onChange={(e) => handleCreateChange("currency", e.target.value)}
                    className="w-full border rounded px-3 py-2"
                  />

                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="date"
                      value={newInvoice.due_date}
                      onChange={(e) => handleCreateChange("due_date", e.target.value)}
                      className="w-full border rounded px-3 py-2"
                    />
                    <select
                      value={newInvoice.status}
                      onChange={(e) => handleCreateChange("status", e.target.value)}
                      className="w-full border rounded px-3 py-2"
                    >
                      <option value="unpaid">Unpaid</option>
                      <option value="paid">Paid</option>
                      <option value="overdue">Overdue</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>

                  <textarea
                    placeholder="Notes"
                    value={newInvoice.notes}
                    onChange={(e) => handleCreateChange("notes", e.target.value)}
                    className="w-full border rounded px-3 py-2"
                    rows={4}
                  />
                </div>

                <div className="flex justify-end gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() => setIsCreateOpen(false)}
                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Create
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ========== Edit Modal (compact, scrollable) ========== */}
        {isEditOpen && selectedInvoice && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4 max-h-[80vh] overflow-y-auto p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Edit Invoice #{selectedInvoice.invoice_number}</h3>
                <button
                  onClick={() => { setIsEditOpen(false); setSelectedInvoice(null); }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); handleEditSave(); }} className="space-y-3">
                <div className="grid grid-cols-1 gap-3">
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="number"
                      value={selectedInvoice.amount}
                      onChange={(e) => handleEditChange("amount", e.target.value)}
                      className="w-full border rounded px-3 py-2"
                      required
                    />
                    <input
                      type="date"
                      value={selectedInvoice.due_date || ""}
                      onChange={(e) => handleEditChange("due_date", e.target.value)}
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>

                  <select
                    value={selectedInvoice.status || "unpaid"}
                    onChange={(e) => handleEditChange("status", e.target.value)}
                    className="w-full border rounded px-3 py-2"
                  >
                    <option value="unpaid">Unpaid</option>
                    <option value="paid">Paid</option>
                    <option value="overdue">Overdue</option>
                    <option value="cancelled">Cancelled</option>
                  </select>

                  <textarea
                    value={selectedInvoice.notes || ""}
                    onChange={(e) => handleEditChange("notes", e.target.value)}
                    className="w-full border rounded px-3 py-2"
                    rows={4}
                  />
                </div>

                <div className="flex justify-end gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() => { setIsEditOpen(false); setSelectedInvoice(null); }}
                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleEditSave}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default InvoiceList;
