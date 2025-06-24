import React from "react";

export default function SelectorHorario({
  horarios = [],
  seleccionado,
  onSeleccionar,
}) {
  if (!horarios.length) return null;

  return (
    <div>
      <h5 className="card-titulo mb-3">Horarios disponibles</h5>
      <div className="d-flex flex-wrap gap-3">
        {horarios.map((hora, idx) => (
          <button
            key={idx}
            onClick={() => onSeleccionar(hora)}
            className={`btn-horario ${seleccionado === hora ? "active" : ""}`}
          >
            {hora}
          </button>
        ))}
      </div>
    </div>
  );
}
