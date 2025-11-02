/**
 * invoiceAPI.js
 * Owner: Caleb
 * Description: API calls for managing invoices.
 */

import axiosClient from "./axiosClient";

// Fetch all invoices (Admin sees all, others see their own)
export const fetchInvoices = async (page = 1) => {
  const response = await axiosClient.get(`/api/invoices?page=${page}`);
  return response.data;
};

export const fetchInvoiceById = async (id) => {
  const response = await axiosClient.get(`/api/invoices/${id}`);
  return response.data;
};

export const createInvoice = async (invoiceData) => {
  const response = await axiosClient.post("/api/invoices", invoiceData);
  return response.data;
};

export const payInvoice = async (id) => {
  const response = await axiosClient.patch(`/api/invoices/${id}/pay`);
  return response.data;
};
