/**

RegisterForm.jsx

Owner: Ryan

Description: Handles user registration with optional CV upload.

Sends multipart/form-data to match backend expectations.
*/

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import toast from "react-hot-toast";

export default function RegisterForm() {
const { register } = useAuth();
const navigate = useNavigate();

const [form, setForm] = useState({
first_name: "",
last_name: "",
email: "",
password: "",
role: "client",
cv: null,
});

const handleChange = (e) => {
const { name, value, files } = e.target;
setForm({
...form,
[name]: files ? files[0] : value,
});
};

const handleSubmit = async (e) => {
e.preventDefault();

if (!form.email || !form.password) {
  toast.error("Email and password are required");
  return;
}

const formData = new FormData();
Object.keys(form).forEach((key) => {
  if (form[key]) formData.append(key, form[key]);
});

const res = await register(formData);
if (!res) return;

if (res.verification_token) {
  toast("Verifying now (dev)...");
  navigate(`/verify-email/${res.verification_token}`);
  return;
}

toast.success("Account created successfully. Check your email for a verification link.");
navigate("/login");


};

return (
<div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
<div className="bg-white rounded-xl shadow-md p-8 w-full max-w-md">
<div className="text-center mb-6">
<div className="w-12 h-12 mx-auto rounded-md bg-blue-700 flex items-center justify-center">
<span className="text-white font-bold text-lg">RB</span>
</div>
</div>

    <h2 className="text-2xl font-semibold text-center text-gray-800 mb-2">
      Create Your Account
    </h2>
    <p className="text-center text-gray-500 mb-6">
      Join ReelBrief as a client or freelancer
    </p>

    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-gray-700 font-medium">First Name</label>
        <input
          type="text"
          name="first_name"
          value={form.first_name}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          placeholder="Enter your first name"
          required
        />
      </div>

      <div>
        <label className="block text-gray-700 font-medium">Last Name</label>
        <input
          type="text"
          name="last_name"
          value={form.last_name}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          placeholder="Enter your last name"
          required
        />
      </div>

      <div>
        <label className="block text-gray-700 font-medium">Email</label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          placeholder="you@example.com"
          required
        />
      </div>

      <div>
        <label className="block text-gray-700 font-medium">Password</label>
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          placeholder="Enter your password"
          required
        />
      </div>

      <div>
        <label className="block text-gray-700 font-medium">Role</label>
        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        >
          <option value="client">Client</option>
          <option value="freelancer">Freelancer</option>
        </select>
      </div>

      {form.role === "freelancer" && (
        <div>
          <label className="block text-gray-700 font-medium">Upload CV (PDF/DOC/DOCX)</label>
          <input
            type="file"
            name="cv"
            accept=".pdf,.doc,.docx"
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1"
          />
        </div>
      )}

      <button
        type="submit"
        className="w-full bg-blue-700 text-white font-medium py-2 rounded-md hover:bg-blue-800 transition"
      >
        Sign Up
      </button>
    </form>

    <p className="text-center text-sm text-gray-600 mt-6">
      Already have an account?{" "}
      <a href="/login" className="text-blue-600 hover:underline">
        Sign in
      </a>
    </p>
  </div>
</div>


);
}
