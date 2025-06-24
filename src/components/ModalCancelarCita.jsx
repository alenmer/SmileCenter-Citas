import React, { useState } from "react";
import { FaTimes, FaCheck } from "react-icons/fa";

export default function ModalCancelarCita({
  visible,
  onClose,
  onConfirmar,
  cita,
}) {
  const [inputTexto, setInputTexto] = useState("");

  if (!visible || !cita) return null;

  const esValido = inputTexto.trim().toUpperCase() === "CANCELAR";

  return (
    <div className="modal-overlay">
      <div className="modal-box-custom">
        <h5 className="modal-titulo fw-bold mb-4 text-center">
          ¿Realmente desea cancelar esta cita?
        </h5>

        <ul className="modal-listado list-unstyled text-start mb-4">
          <li>
            <span className="modal-label">Especialidad:</span>{" "}
            {cita.especialidad}
          </li>
          <li>
            <span className="modal-label">Especialista:</span> {cita.odontologo}
          </li>
          <li>
            <span className="modal-label">Fecha:</span>{" "}
            {formatearFecha(cita.fecha)}
          </li>
          <li>
            <span className="modal-label">Hora:</span> {cita.hora}
          </li>
        </ul>

        <p className="text-center mb-3" style={{ fontSize: "14px" }}>
          Para cancelar esta cita, por favor escriba la palabra{" "}
          <strong>“CANCELAR”</strong>, y luego de clic en el botón “confirmar”.
        </p>

        <input
          type="text"
          className="form-control mb-4"
          placeholder="Escriba CANCELAR"
          value={inputTexto}
          maxLength={8}
          onChange={(e) => setInputTexto(e.target.value)}
        />

        <div className="botones-modal">
          <button className="btn-rojo w-100" onClick={onClose}>
            <FaTimes />
            Cancelar
          </button>
          <button
            className="btn-verde w-100"
            onClick={onConfirmar}
            disabled={!esValido}
            style={{ opacity: esValido ? 1 : 0.5 }}
          >
            <FaCheck />
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}

function formatearFecha(fechaISO) {
  const fecha = new Date(fechaISO);
  return fecha.toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
