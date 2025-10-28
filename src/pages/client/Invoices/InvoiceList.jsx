// src/pages/client/Invoices/ClientInvoiceList.jsx
import React, { useEffect, useState } from "react";
import { fetchInvoices } from "@/api/invoiceAPI";
import { Link } from "react-router-dom";

const InvoiceList = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, pages: 1 });

  useEffect(() => {
    const loadInvoices = async () => {
      try {
        const data = await fetchInvoices(page);
        setInvoices(data.invoices);
        setPagination({ total: data.total, pages: data.pages });
      } catch (error) {
        console.error("Failed to load invoices:", error);
      } finally {
        setLoading(false);
      }
    };
    loadInvoices();
  }, [page]);

  if (loading) return <p className="text-center mt-8">Loading invoices...</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6">My Invoices</h2>

      {invoices.length === 0 ? (
        <p>No invoices yet.</p>
      ) : (
        <div className="overflow-x-auto shadow rounded-lg">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="py-3 px-4 text-left">Invoice #</th>
                <th className="py-3 px-4 text-left">Freelancer</th>
                <th className="py-3 px-4 text-left">Amount</th>
                <th className="py-3 px-4 text-left">Status</th>
                <th className="py-3 px-4 text-left">Due Date</th>
                <th className="py-3 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <tr key={inv.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">{inv.invoice_number}</td>
                  <td className="py-3 px-4">{inv.freelancer?.name || "—"}</td>
                  <td className="py-3 px-4">${inv.amount}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-1 rounded-full text-sm ${
                        inv.status === "paid"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {inv.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">{inv.due_date || "—"}</td>
                  <td className="py-3 px-4 space-x-2">
                    <Link
                      to={`/client/invoices/${inv.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      View
                    </Link>
                    {inv.status !== "paid" && (
                      <Link
                        to={`/client/invoices/${inv.id}/pay`}
                        className="text-green-600 hover:underline"
                      >
                        Pay
                      </Link>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {pagination.pages > 1 && (
        <div className="flex justify-center mt-6 space-x-3">
          {[...Array(pagination.pages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`px-3 py-1 rounded-md ${
                page === i + 1
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default InvoiceList;
