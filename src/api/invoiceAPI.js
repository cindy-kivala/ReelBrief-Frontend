/**
 * invoiceAPI.js
 * Owner: Caleb
 * Description: API calls for managing invoices.
 */

import axios from "axios";

const BASE_URL = "/api/invoices";

export const fetchInvoices = async (page = 1) => {
  const response = await axios.get(`${BASE_URL}?page=${page}`);
  return response.data;
};

export const fetchInvoiceById = async (id) => {
  const response = await axios.get(`${BASE_URL}/${id}`);
  return response.data;
};

export const createInvoice = async (invoiceData) => {
  const response = await axios.post(BASE_URL, invoiceData);
  return response.data;
};

export const payInvoice = async (id) => {
  const response = await axios.patch(`${BASE_URL}/${id}/pay`);
  return response.data;
};
