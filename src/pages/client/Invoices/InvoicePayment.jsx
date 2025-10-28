// src/pages/client/Invoices/ClientInvoicePay.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { fetchInvoiceById, payInvoice } from "@/api/invoiceAPI";

const ClientInvoicePay = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState("");

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

  if (loading) return <p className="text-center mt-6">Loading...</p>;
  if (!invoice) return <p className="text-center mt-6">Invoice not found.</p>;

  return (
    <div className="p-6 max-w-lg mx-auto bg-white shadow rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">Confirm Payment</h2>

      <p className="mb-4">
        You are about to pay <strong>${invoice.amount}</strong> for invoice{" "}
        <strong>{invoice.invoice_number}</strong> issued by{" "}
        {invoice.freelancer?.name || "Freelancer"}.
      </p>

      <div className="flex justify-between">
        <Link
          to={`/client/invoices/${invoice.id}`}
          className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
        >
          Cancel
        </Link>
        <button
          onClick={handlePayment}
          disabled={processing}
          className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
        >
          {processing ? "Processing..." : "Confirm & Pay"}
        </button>
      </div>

      {message && <p className="mt-4 text-gray-700">{message}</p>}
    </div>
  );
};

export default ClientInvoicePay;
