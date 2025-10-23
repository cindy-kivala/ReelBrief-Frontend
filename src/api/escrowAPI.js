/**
 * escrowAPI.js
 * Owner: Caleb
 * Description: Handles all API requests for escrow payments and transactions.
 */

// TODO:
// - fetchEscrowData()
// - releaseEscrow(id)
// - createEscrowTransaction(data)


import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/api/escrow`;

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return { headers: { Authorization: `Bearer ${token}` } };
};

// ===============================
// Fetch all escrow transactions (Admin)
// ===============================
export async function fetchEscrowData(status = null, page = 1) {
  try {
    const params = {};
    if (status) params.status = status;
    params.page = page;

    const res = await axios.get(API_URL, { ...getAuthHeader(), params });
    return res.data;
  } catch (err) {
    console.error("Error fetching escrow data:", err);
    throw err.response?.data || err;
  }
}

// ===============================
// Fetch single escrow transaction
// ===============================
export async function fetchEscrowById(id) {
  try {
    const res = await axios.get(`${API_URL}/${id}`, getAuthHeader());
    return res.data;
  } catch (err) {
    console.error("Error fetching transaction:", err);
    throw err.response?.data || err;
  }
}

// ===============================
// Create escrow transaction (Admin)
// ===============================
export async function createEscrowTransaction(data) {
  try {
    const res = await axios.post(API_URL, data, getAuthHeader());
    return res.data;
  } catch (err) {
    console.error("Error creating escrow:", err);
    throw err.response?.data || err;
  }
}

// ===============================
// Release escrow payment (Admin)
// ===============================
export async function releaseEscrow(id) {
  try {
    const res = await axios.post(`${API_URL}/${id}/release`, {}, getAuthHeader());
    return res.data;
  } catch (err) {
    console.error("Error releasing escrow:", err);
    throw err.response?.data || err;
  }
}

// ===============================
// Refund escrow payment (Admin)
// ===============================
export async function refundEscrow(id, reason) {
  try {
    const res = await axios.post(
      `${API_URL}/${id}/refund`,
      { reason },
      getAuthHeader()
    );
    return res.data;
  } catch (err) {
    console.error("Error refunding escrow:", err);
    throw err.response?.data || err;
  }
}

// ===============================
// Fetch freelancer earnings
// ===============================
export async function getFreelancerEarnings(freelancerId) {
  try {
    const res = await axios.get(
      `${API_URL}/freelancers/${freelancerId}/earnings`,
      getAuthHeader()
    );
    return res.data;
  } catch (err) {
    console.error("Error fetching freelancer earnings:", err);
    throw err.response?.data || err;
  }
}
