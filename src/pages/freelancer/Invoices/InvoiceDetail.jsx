// src/pages/freelancer/Invoices/InvoiceDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchInvoiceById } from "@/api/invoiceAPI";

const FreelancerInvoiceDetails = () => {
  const { id } = useParams();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <p className="text-center mt-6">Loading invoice...</p>;
  if (!invoice) return <p className="text-center mt-6">Invoice not found.</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white shadow rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Invoice Details</h2>
        <Link
          to="/freelancer/invoices"
          className="text-blue-600 hover:underline"
        >
          ← Back to Invoices
        </Link>
      </div>

      <div className="space-y-2">
        <p>
          <strong>Invoice Number:</strong> {invoice.invoice_number}
        </p>
        <p>
          <strong>Project:</strong> {invoice.project?.title || "N/A"}
        </p>
        <p>
          <strong>Client:</strong> {invoice.client?.name || "N/A"}
        </p>
        <p>
          <strong>Amount:</strong> ${invoice.amount}
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
    </div>
  );
};

export default FreelancerInvoiceDetails;
