// src/components/Header.jsx
import React from "react";
import { FaPowerOff } from "react-icons/fa";

export default function Header({
  titulo = "",
  breadcrumb = "",
  onLogout = () => {},
}) {
  return (
    <div className="dashboard-header d-flex justify-content-between align-items-center mb-4">
      <div>
        <h1 className="fw-bold dashboard-title">{titulo}</h1>
        <p className="text-muted small mb-0">{breadcrumb}</p>
      </div>
      <div
        className="d-flex flex-column align-items-center logout-button"
        onClick={onLogout}
      >
        <FaPowerOff size={20} />
        <span>Cerrar sesión</span>
      </div>
    </div>
  );
}
