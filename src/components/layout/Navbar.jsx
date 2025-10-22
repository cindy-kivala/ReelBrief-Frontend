import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar flex justify-between items-center px-6 py-3 border-b bg-white">
      <div className="text-xl font-bold text-blue-700">ReelBrief</div>

      <div className="flex items-center gap-4">
        {user ? (
          <>
            <span className="text-gray-700">Hi, {user.first_name}</span>
            <button onClick={logout} className="btn-secondary">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn-secondary">Login</Link>
            <Link to="/register" className="btn-primary">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
}
