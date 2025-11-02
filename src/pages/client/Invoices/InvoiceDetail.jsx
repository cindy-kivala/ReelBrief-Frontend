import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { fetchInvoiceById, payInvoice } from "@/api/invoiceAPI";
import { Sidebar } from "@/components/layout/Sidebar"; // ✅ Added
import { useAuth } from "@/context/AuthContext"; // ✅ Added

const ClientInvoiceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const { user } = useAuth(); // ✅ Get user for sidebar

  useEffect(() => {
    const loadInvoice = async () => {
      try {
        const data = await fetchInvoiceById(id);
        setInvoice(data.invoice);
      } catch (error) {
        console.error("Failed to fetch invoice:", error);
      } finally {
        setLoading(false);
      }
    };
    loadInvoice();
  }, [id]);

  const handlePay = async () => {
    try {
      const res = await payInvoice(id);
      setMessage(res.message);
      setInvoice({ ...invoice, status: "paid" });
      setTimeout(() => navigate("/client/invoices"), 1500);
    } catch (error) {
      setMessage(error.response?.data?.error || "Payment failed");
    }
  };

  if (loading)
    return <p className="text-center mt-6 text-gray-600">Loading invoice...</p>;
  if (!invoice)
    return <p className="text-center mt-6 text-gray-600">Invoice not found.</p>;

  return (
    <div className="flex">
      {/* ✅ Sidebar */}
      <Sidebar role={user?.role} />

      {/* ✅ Main content */}
      <div className="flex-1 ml-64 p-6">
        <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-xl p-6 border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">
              Invoice Details
            </h2>
            <Link
              to="/client/invoices"
              className="text-blue-600 hover:underline"
            >
              ← Back to Invoices
            </Link>
          </div>

          <div className="space-y-3 text-gray-700">
            <p>
              <strong>Invoice Number:</strong> {invoice.invoice_number}
            </p>
            <p>
              <strong>Freelancer:</strong> {invoice.freelancer?.name || "N/A"}
            </p>
            <p>
              <strong>Amount:</strong>{" "}
              <span className="text-green-600 font-medium">
                ${invoice.amount}
              </span>
            </p>
            <p>
              <strong>Status:</strong>{" "}
              <span
                className={`px-2 py-1 rounded-full text-sm ${
                  invoice.status === "paid"
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {invoice.status}
              </span>
            </p>
            <p>
              <strong>Due Date:</strong> {invoice.due_date || "—"}
            </p>
            <p>
              <strong>Issued On:</strong> {invoice.issue_date}
            </p>
            <p>
              <strong>Notes:</strong> {invoice.notes || "—"}
            </p>
          </div>

          {invoice.status !== "paid" && (
            <button
              onClick={handlePay}
              className="mt-6 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
            >
              Pay Invoice
            </button>
          )}

          {message && (
            <p className="mt-4 text-center text-gray-700 font-medium">
              {message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientInvoiceDetails;
