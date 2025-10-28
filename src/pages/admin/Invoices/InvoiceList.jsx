/**
 * Invoices.jsx
 * Owner: Caleb
 * Description: Admin page for managing all invoices.
 */

import React, { useEffect, useState } from "react";
import { fetchInvoices } from "@/api/invoiceAPI";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const AdminInvoiceList = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadInvoices = async () => {
      try {
        const data = await fetchInvoices();
        setInvoices(data.invoices || []);
      } catch (error) {
        console.error("Failed to fetch invoices:", error);
      } finally {
        setLoading(false);
      }
    };
    loadInvoices();
  }, []);

  if (loading) return <p className="text-center py-6">Loading invoices...</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">All Invoices</h2>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-200 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Invoice #</th>
              <th className="p-2 border">Project</th>
              <th className="p-2 border">Client</th>
              <th className="p-2 border">Freelancer</th>
              <th className="p-2 border">Amount</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((invoice) => (
              <tr key={invoice.id} className="text-center border-t">
                <td className="p-2">{invoice.invoice_number}</td>
                <td className="p-2">{invoice.project?.title || "N/A"}</td>
                <td className="p-2">{invoice.client?.name || "N/A"}</td>
                <td className="p-2">{invoice.freelancer?.name || "N/A"}</td>
                <td className="p-2">${invoice.amount}</td>
                <td className="p-2 capitalize">{invoice.status}</td>
                <td className="p-2 space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/admin/invoices/${invoice.id}`)}
                  >
                    View
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => navigate(`/admin/invoices/${invoice.id}/delete`)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminInvoiceList;
