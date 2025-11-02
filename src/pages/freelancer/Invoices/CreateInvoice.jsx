// src/pages/freelancer/Invoices/CreateInvoice.jsx
import React, { useState } from "react";
import { createInvoice } from "@/api/invoiceAPI";
import { useNavigate, Link } from "react-router-dom";
import Layout from "../../../components/layout/Layout"; // ✅ Added Layout import

const FreelancerCreateInvoice = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    project_id: "",
    amount: "",
    due_date: "",
    notes: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await createInvoice(formData);
      setMessage(res.message);
      setTimeout(() => navigate("/freelancer/invoices"), 1500);
    } catch (error) {
      setMessage(error.response?.data?.error || "Error creating invoice");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout> {/* ✅ Wrapped inside Layout */}
      <div className="p-6 max-w-2xl mx-auto bg-white shadow rounded-lg mt-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Create Invoice</h2>
          <Link
            to="/freelancer/invoices"
            className="text-blue-600 hover:underline"
          >
            ← Back to Invoices
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium mb-1">Project ID</label>
            <input
              type="text"
              name="project_id"
              value={formData.project_id}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2"
              required
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Amount</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2"
              required
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Due Date</label>
            <input
              type="date"
              name="due_date"
              value={formData.due_date}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="4"
              className="w-full border border-gray-300 rounded-lg p-2"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-blue-600 text-white px-6 py-2 rounded-lg transition ${
              loading ? "opacity-70 cursor-not-allowed" : "hover:bg-blue-700"
            }`}
          >
            {loading ? "Creating..." : "Create Invoice"}
          </button>

          {message && (
            <p
              className={`mt-3 text-sm ${
                message.toLowerCase().includes("error")
                  ? "text-red-600"
                  : "text-green-600"
              }`}
            >
              {message}
            </p>
          )}
        </form>
      </div>
    </Layout>
  );
};

export default FreelancerCreateInvoice;
