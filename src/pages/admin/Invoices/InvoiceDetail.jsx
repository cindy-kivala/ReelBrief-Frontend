/**
 * InvoiceDetail.jsx
 * Owner: Caleb
 * Description: Displays details of a specific invoice for admin review.
 */

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchInvoiceById } from "@/api/invoiceAPI";
// import { Button } from "@/components/ui/button";
import axios from "axios";

const AdminInvoiceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);

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

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this invoice?")) return;
    try {
      await axios.delete(`/api/invoices/${id}`);
      alert("Invoice deleted successfully!");
      navigate("/admin/invoices");
    } catch (error) {
      console.error("Failed to delete invoice:", error);
    }
  };

  if (loading) return <p className="text-center py-6">Loading...</p>;
  if (!invoice) return <p className="text-center py-6">Invoice not found.</p>;

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-2xl font-semibold">Invoice Details</h2>

      <div className="border rounded-lg p-4 bg-gray-50">
        <p><strong>Invoice #:</strong> {invoice.invoice_number}</p>
        <p><strong>Project:</strong> {invoice.project?.title}</p>
        <p><strong>Client:</strong> {invoice.client?.name}</p>
        <p><strong>Freelancer:</strong> {invoice.freelancer?.name}</p>
        <p><strong>Amount:</strong> ${invoice.amount}</p>
        <p><strong>Status:</strong> {invoice.status}</p>
        <p><strong>Issued:</strong> {invoice.issue_date}</p>
        <p><strong>Due:</strong> {invoice.due_date}</p>
        {invoice.notes && <p><strong>Notes:</strong> {invoice.notes}</p>}
      </div>

      <div className="flex space-x-2">
        <Button variant="outline" onClick={() => navigate("/admin/invoices")}>
          Back
        </Button>
        <Button variant="destructive" onClick={handleDelete}>
          Delete Invoice
        </Button>
      </div>
    </div>
  );
};

export default AdminInvoiceDetail;
