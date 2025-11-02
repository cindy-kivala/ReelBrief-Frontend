/**
 * src/pages/admin/Invoices/InvoiceDetail.jsx
 * Owner: Caleb
 * Description: Displays details of a specific invoice for admin review with sidebar layout.
 */

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosClient from "../../../api/axiosClient";
import Layout from "../../../components/layout/Layout";

const AdminInvoiceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadInvoice = async () => {
      try {
        const res = await axiosClient.get(`/api/invoices/${id}`);
        // Handle both response shapes: { invoice: {...} } or {...}
        const invoiceData = res.data.invoice || res.data;
        setInvoice(invoiceData);
      } catch (err) {
        console.error("❌ Error loading invoice:", err);
        setError("Failed to load invoice details.");
      } finally {
        setLoading(false);
      }
    };
    loadInvoice();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this invoice?")) return;
    try {
      await axiosClient.delete(`/api/invoices/${id}`);
      alert("✅ Invoice deleted successfully!");
      navigate("/admin/invoices");
    } catch (err) {
      console.error("❌ Failed to delete invoice:", err);
      alert("Failed to delete invoice.");
    }
  };

  if (loading)
    return (
      <Layout>
        <div className="p-8 text-center text-gray-600">Loading invoice...</div>
      </Layout>
    );

  if (error)
    return (
      <Layout>
        <div className="p-8 text-center text-red-600">{error}</div>
      </Layout>
    );

  if (!invoice)
    return (
      <Layout>
        <div className="p-8 text-center text-gray-600">Invoice not found.</div>
      </Layout>
    );

  return (
    <Layout>
      <div className="p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Invoice #{invoice.invoice_number}</h2>
          <div className="space-x-2">
            <button
              onClick={() => navigate("/admin/invoices")}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Back
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow space-y-4">
          <p>
            <strong>Project:</strong> {invoice.project?.title || invoice.project_id || "—"}
          </p>
          <p>
            <strong>Client:</strong> {invoice.client?.name || "—"}
          </p>
          <p>
            <strong>Freelancer:</strong> {invoice.freelancer?.name || "—"}
          </p>
          <p>
            <strong>Amount:</strong> {invoice.amount} {invoice.currency || ""}
          </p>
          <p>
            <strong>Status:</strong>{" "}
            <span
              className={`px-2 py-1 rounded text-sm ${
                invoice.status === "paid"
                  ? "bg-green-100 text-green-800"
                  : invoice.status === "overdue"
                  ? "bg-red-100 text-red-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {invoice.status}
            </span>
          </p>
          <p>
            <strong>Issue Date:</strong>{" "}
            {invoice.issue_date
              ? new Date(invoice.issue_date).toLocaleDateString()
              : "—"}
          </p>
          <p>
            <strong>Due Date:</strong>{" "}
            {invoice.due_date
              ? new Date(invoice.due_date).toLocaleDateString()
              : "—"}
          </p>
          {invoice.notes && (
            <p>
              <strong>Notes:</strong> {invoice.notes}
            </p>
          )}
          {invoice.created_at && (
            <p className="text-sm text-gray-500">
              Created: {new Date(invoice.created_at).toLocaleString()}
            </p>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default AdminInvoiceDetail;
