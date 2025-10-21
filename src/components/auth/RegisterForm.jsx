import { useState } from "react";
import useAuth from "../../hooks/useAuth";
import toast from "react-hot-toast";

export default function RegisterForm() {
  const { register } = useAuth();
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    role: "client",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.email || !form.password)
      return toast.error("Email and password required");
    register(form);
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <h2 className="form-title">Register</h2>

      <div className="form-group">
        <label>First Name</label>
        <input
          type="text"
          className="form-input"
          value={form.first_name}
          onChange={(e) => setForm({ ...form, first_name: e.target.value })}
        />
      </div>

      <div className="form-group">
        <label>Last Name</label>
        <input
          type="text"
          className="form-input"
          value={form.last_name}
          onChange={(e) => setForm({ ...form, last_name: e.target.value })}
        />
      </div>

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

      <div className="form-group">
        <label>Role</label>
        <select
          className="form-select"
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
        >
          <option value="client">Client</option>
          <option value="freelancer">Freelancer</option>
        </select>
      </div>

      <button type="submit" className="btn-primary">
        Register
      </button>
    </form>
  );
}
