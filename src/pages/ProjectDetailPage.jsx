// src/pages/ProjectDetailPage.jsx
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import ProjectDetail from "./ProjectDetail";

const ProjectDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <ProjectDetail
      projectId={id}
      onClose={() => navigate(-1)}
      onUpdated={() => {}}
    />
  );
};

export default ProjectDetailPage;