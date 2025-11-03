import { useEffect, useState } from "react";
import Layout from "../../components/layout/Layout";
import {
  fetchWallet,
  fetchWalletTransactions,
  depositFunds,
} from "../../api/walletAPI";

const ClientWallet = () => {
  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [amount, setAmount] = useState("");

  // Fetch wallet + transactions
  useEffect(() => {
    const loadData = async () => {
      try {
        const walletRes = await fetchWallet();
        const txRes = await fetchWalletTransactions();
        setWallet(walletRes.wallet || walletRes);
        setTransactions(txRes.transactions || txRes);
      } catch (err) {
        console.error("❌ Wallet fetch error:", err);
        setError("Failed to load wallet data.");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const balance = wallet?.balance?.toFixed(2) ?? "0.00";

  // Handle deposit (for future use)
  const handleAddFunds = async () => {
    if (!amount || isNaN(amount) || amount <= 0) {
      alert("Please enter a valid amount.");
      return;
    }

    try {
      await depositFunds(parseFloat(amount));
      alert(`You successfully added $${amount}.`);
      setAmount("");
      setShowModal(false);

      // Refresh data
      const walletRes = await fetchWallet();
      const txRes = await fetchWalletTransactions();
      setWallet(walletRes.wallet || walletRes);
      setTransactions(txRes.transactions || txRes);
    } catch (err) {
      console.error("❌ Deposit error:", err);
      alert("Failed to add funds. Please try again.");
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-6 py-10 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-800">My Wallet</h1>
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            + Add Funds
          </button>
        </div>

        {/* Wallet Summary */}
        <div className="bg-white shadow-md rounded-2xl p-6 border border-gray-200">
          <p className="text-gray-600 text-sm mb-2">Current Balance</p>
          {loading ? (
            <div className="animate-pulse h-10 bg-gray-100 rounded w-40"></div>
          ) : (
            <h1 className="text-4xl font-bold text-green-600">${balance}</h1>
          )}
          {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
        </div>

        {/* Transaction History */}
        <div className="bg-white shadow-sm rounded-2xl p-6 border border-gray-200">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">
            Recent Transactions
          </h3>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="animate-pulse h-6 bg-gray-100 rounded w-full"
                ></div>
              ))}
            </div>
          ) : transactions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-gray-500">
              <img
                src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png"
                alt="empty wallet"
                className="w-24 h-24 mb-4 opacity-60"
              />
              <p className="text-lg">No transactions yet.</p>
              <p className="text-sm text-gray-400 mt-1">
                Your wallet activity will appear here.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left border-collapse">
                <thead>
                  <tr className="border-b bg-gray-50 text-gray-700">
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Description</th>
                    <th className="py-3 px-4">Type</th>
                    <th className="py-3 px-4 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        {new Date(tx.created_at || tx.date).toLocaleString()}
                      </td>
                      <td className="py-3 px-4">{tx.description}</td>
                      <td className="py-3 px-4 capitalize">
                        {tx.transaction_type || tx.type}
                      </td>
                      <td
                        className={`py-3 px-4 text-right font-medium ${
                          tx.amount > 0 ? "text-green-600" : "text-red-500"
                        }`}
                      >
                        {tx.amount > 0 ? `+${tx.amount}` : tx.amount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Add Funds Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-2xl shadow-lg w-96">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                Add Funds
              </h2>
              <input
                type="number"
                min="1"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="border border-gray-300 rounded-lg w-full px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddFunds}
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ClientWallet;
