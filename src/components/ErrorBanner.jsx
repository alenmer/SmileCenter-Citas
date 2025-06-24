import React, { useEffect } from "react";
import { FaTimes } from "react-icons/fa";

export default function ErrorBanner({ mensaje, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [mensaje, onClose]);

  if (!mensaje) return null;

  return (
    <div className="error-banner d-flex justify-content-between align-items-center">
      <div>
        <strong>Error.</strong> {mensaje}
      </div>
      <button className="btn-cerrar-error" onClick={onClose}>
        <FaTimes />
      </button>
    </div>
  );
}
