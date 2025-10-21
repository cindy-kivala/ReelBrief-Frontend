import { useState } from "react";
import useAuth from "../../hooks/useAuth";
import toast from "react-hot-toast";

export default function LoginForm() {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.email || !form.password) return toast.error("All fields required");
    login(form);
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

      <button type="submit" className="btn-primary">
        Login
      </button>
    </form>
  );
}
