import { NavLink } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside className="sidebar w-64 bg-white border-r min-h-screen p-6">
      <h2 className="text-xl font-semibold mb-8 text-blue-700">ReelBrief</h2>
      <ul className="space-y-4">
        <li>
          <NavLink to="/client/dashboard" className="nav-item" end>
            Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink to="/client/projects" className="nav-item">
            My Projects
          </NavLink>
        </li>
        <li>
          <NavLink to="/client/messages" className="nav-item">
            Messages
          </NavLink>
        </li>
        <li>
          <NavLink to="/client/invoices" className="nav-item">
            Invoices
          </NavLink>
        </li>
      </ul>
    </aside>
  );
}
