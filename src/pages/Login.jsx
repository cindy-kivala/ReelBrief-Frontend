// src/pages/Login.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import toast from "react-hot-toast";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);
    const user = await login(form);
    setLoading(false);

    if (user) {
      toast.success(`Welcome back, ${user.first_name || "User"}!`);
      navigate("/"); // ✅ redirect after successful login
    } else {
      toast.error("Invalid email or password");
    }
  };

  return (
    <div className="login-page min-h-screen flex items-center justify-center bg-gray-50">
      <div className="login-card bg-white rounded-xl shadow-md p-8 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-6">
          <div className="logo w-12 h-12 mx-auto rounded-md bg-blue-700 flex items-center justify-center">
            <span className="text-white font-bold text-lg">RB</span>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-semibold text-center">Welcome Back</h1>
        <p className="text-center text-gray-500 mb-6">
          Sign in to your ReelBrief account
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div className="form-group">
            <label className="block text-sm font-medium mb-1">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                className="form-input w-full border rounded-md p-2 pl-8"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              <span className="input-icon absolute left-2 top-2.5 text-gray-400">
                @
              </span>
            </div>
          </div>

          {/* Password */}
          <div className="form-group">
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium">Password</label>
              <Link
                to="/forgot-password"
                className="text-sm text-blue-600 hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <input
                type="password"
                className="form-input w-full border rounded-md p-2 pl-8"
                placeholder="Enter your password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
              <span className="input-icon absolute left-2 top-2.5 text-gray-400">
                🔒
              </span>
            </div>
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            className="btn-primary w-full"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {/* Sign Up & Back Links */}
        <div className="text-center mt-6">
          <p className="text-gray-600 text-sm">
            Don’t have an account?{" "}
            <Link to="/register" className="text-blue-600 hover:underline">
              Sign up
            </Link>
          </p>
          <Link
            to="/"
            className="block mt-2 text-sm text-gray-500 hover:underline"
          >
            ← Back to home
          </Link>
        </div>

        {/* Demo Accounts */}
        <div className="demo-box mt-8 border rounded-md p-4 text-sm bg-gray-50">
          <p className="font-semibold mb-2">Demo Test Accounts:</p>
          <ul className="space-y-1 text-gray-700">
            <li>
              • Client: <code>client@test.com</code>
            </li>
            <li>
              • Freelancer: <code>freelancer@test.com</code>
            </li>
            <li>
              • Admin: <code>admin@test.com</code>
            </li>
            <li>
              Password: <code>any password</code>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
