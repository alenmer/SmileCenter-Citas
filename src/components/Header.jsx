import React from "react";

export default function Header({ titulo = "", breadcrumb = "" }) {
  return (
    <div className="dashboard-header mb-4">
      <h1 className="fw-bold dashboard-title">{titulo}</h1>
      <p className="text-muted small mb-0">{breadcrumb}</p>
    </div>
  );
}
