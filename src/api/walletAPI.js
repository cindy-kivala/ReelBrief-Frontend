// src/api/walletAPI.js
import axiosClient from "./axiosClient";

// -------------------- Get Wallet Info --------------------
export const fetchWallet = async () => {
  const response = await axiosClient.get("/api/wallet/");
  return response.data;
};

// -------------------- Get Wallet Transactions --------------------
export const fetchWalletTransactions = async (userId = null) => {
  const url = userId
    ? `/api/wallet/transactions?user_id=${userId}`
    : "/api/wallet/transactions";
  const response = await axiosClient.get(url);
  return response.data;
};

// -------------------- Deposit Funds --------------------
export const depositFunds = async (amount, description = "Wallet deposit") => {
  const response = await axiosClient.post("/api/wallet/deposit", {
    amount,
    description,
  });
  return response.data;
};

// -------------------- Debit Wallet --------------------
export const debitWallet = async (amount, description = "Wallet debit") => {
  const response = await axiosClient.post("/api/wallet/debit", {
    amount,
    description,
  });
  return response.data;
};

// -------------------- Admin Credit Any User --------------------
export const adminCreditUser = async (
  userId,
  amount,
  description = "Admin credit"
) => {
  const response = await axiosClient.post(`/api/wallet/credit-user/${userId}`, {
    amount,
    description,
  });
  return response.data;
};
