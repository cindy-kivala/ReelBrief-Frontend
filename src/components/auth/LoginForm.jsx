/**
 * LoginForm.jsx
 * Owner: Ryan
 * Description: Handles user authentication and redirects to role-based dashboards.
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom"; //
import useAuth from "../../hooks/useAuth";
import toast from "react-hot-toast";

export default function LoginForm() {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate(); //  Initialize navigate

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password)
      return toast.error("All fields required");

    //  Wait for login to complete
    const user = await login(form);

    if (user) {
      // Redirect based on role
      switch (user.role) {
        case "admin":
          navigate("/admin/dashboard");
          break;
        case "client":
          navigate("/client/dashboard");
          break;
        case "freelancer":
          navigate("/freelancer/dashboard");
          break;
        default:
          navigate("/");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <h2 className="form-title">Login</h2>

      <div className="form-group">
        <label>Email</label>
        <input
          type="email"
          className="form-input"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
      </div>

      <div className="form-group">
        <label>Password</label>
        <input
          type="password"
          className="form-input"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
      </div>

      <button type="submit" className="btn-primary w-full">
        Login
      </button>
    </form>
  );
}
