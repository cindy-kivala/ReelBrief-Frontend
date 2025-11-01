// src/components/layout/Layout.jsx
import React from "react";
import { Sidebar } from "./Sidebar";

const Layout = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const role = user.role || "client"; // default to client

  return (
    <div className="flex">
      <Sidebar role={role} />
      <div className="flex-1 ml-64">
        {children}
      </div>
    </div>
  );
};

export default Layout;
