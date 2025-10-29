import React from "react";
import { AdminSidebar } from "./AdminSidebar";
import { ClientSidebar } from "./ClientSidebar";
import { FreelancerSidebar } from "./FreelancerSidebar";

export const Sidebar = ({ role }) => {
  switch (role) {
    case "admin":
      return <AdminSidebar />;
    case "client":
      return <ClientSidebar />;
    case "freelancer":
      return <FreelancerSidebar />;
    default:
      return null;
  }
};
 