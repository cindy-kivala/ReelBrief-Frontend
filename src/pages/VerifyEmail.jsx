// src/pages/VerifyEmail.jsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import authAPI from "../api/authAPI";

export default function VerifyEmail() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("verifying");

  useEffect(() => {
    async function run() {
      try {
        await authAPI.verifyEmail(token);
        setStatus("success");
        toast.success("Email verified! You can now log in.");
        setTimeout(() => navigate("/login"), 1200);
      } catch (err) {
        const msg = err?.response?.data?.error || "Verification failed";
        setStatus("error");
        toast.error(msg);
      }
    }
    if (token) run();
  }, [token, navigate]);

  if (status === "verifying") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg">Verifying your email…</p>
        </div>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">Email verified!</h2>
          <p>Redirecting to login…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-2">Verification failed</h2>
        <p className="mb-4">Your link may be invalid or expired.</p>
        <button
          className="px-4 py-2 rounded bg-gray-900 text-white"
          onClick={() => navigate("/login")}
        >
          Back to login
        </button>
      </div>
    </div>
  );
}
