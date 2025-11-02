import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { fetchInvoiceById, payInvoice } from "@/api/invoiceAPI";
import { Sidebar } from "@/components/layout/Sidebar"; // ✅ Added
import { useAuth } from "@/context/AuthContext"; // ✅ Added

const ClientInvoicePay = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState("");
  const { user } = useAuth(); // ✅ Get logged-in user role

  useEffect(() => {
    const loadInvoice = async () => {
      try {
        const data = await fetchInvoiceById(id);
        setInvoice(data.invoice);
      } catch (error) {
        console.error("Error loading invoice:", error);
      } finally {
        setLoading(false);
      }
    };
    loadInvoice();
  }, [id]);

  const handlePayment = async () => {
    setProcessing(true);
    try {
      const res = await payInvoice(id);
      setMessage(res.message);
      setTimeout(() => navigate("/client/invoices"), 1500);
    } catch (error) {
      setMessage(error.response?.data?.error || "Payment failed");
    } finally {
      setProcessing(false);
    }
  };

  if (loading)
    return <p className="text-center mt-6 text-gray-600">Loading...</p>;
  if (!invoice)
    return <p className="text-center mt-6 text-gray-600">Invoice not found.</p>;

  return (
    <div className="flex">
      {/* ✅ Sidebar */}
      <Sidebar role={user?.role} />

      {/* ✅ Main content area */}
      <div className="flex-1 ml-64 p-6">
        <div className="max-w-lg mx-auto bg-white shadow-lg rounded-xl p-6 border border-gray-100">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            Confirm Payment
          </h2>

          <p className="mb-4 text-gray-700 leading-relaxed">
            You are about to pay{" "}
            <strong className="text-green-600">${invoice.amount}</strong> for
            invoice{" "}
            <strong className="text-gray-900">{invoice.invoice_number}</strong>{" "}
            issued by{" "}
            <span className="font-medium text-gray-800">
              {invoice.freelancer?.name || "Freelancer"}
            </span>
            .
          </p>

          <div className="flex justify-between mt-6">
            <Link
              to={`/client/invoices/${invoice.id}`}
              className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 transition-colors"
            >
              Cancel
            </Link>
            <button
              onClick={handlePayment}
              disabled={processing}
              className={`px-4 py-2 rounded-lg text-white transition-colors ${
                processing
                  ? "bg-green-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {processing ? "Processing..." : "Confirm & Pay"}
            </button>
          </div>

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

export default ClientInvoicePay;
