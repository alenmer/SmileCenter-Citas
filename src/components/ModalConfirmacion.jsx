import React from "react";
import { FaTimesCircle, FaCalendarCheck } from "react-icons/fa";

export default function ModalConfirmacion({
  especialidad,
  especialista,
  fecha,
  hora,
  onCancelar,
  onConfirmar,
}) {
  return (
    <div className="modal-overlay">
      <div className="modal-box-custom">
        <h5 className="fw-bold mb-4 modal-titulo">
          Verifique que la información esté correcta:
        </h5>
        <ul className="list-unstyled mb-4 modal-listado">
          <li>
            <span className="modal-label">Especialidad:</span> {especialidad}
          </li>
          <li>
            <span className="modal-label">Especialista:</span> {especialista}
          </li>
          <li>
            <span className="modal-label">Fecha:</span>{" "}
            {new Date(fecha).toLocaleDateString("es-ES")}
          </li>
          <li>
            <span className="modal-label">Hora:</span> {hora}
          </li>
        </ul>
        <div className="d-flex justify-content-center gap-4">
          <button className="btn-rojo" onClick={onCancelar}>
            <FaTimesCircle /> Cancelar
          </button>
          <button className="btn-verde" onClick={onConfirmar}>
            <FaCalendarCheck /> Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}
