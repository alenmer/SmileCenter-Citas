import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaCheckCircle, FaListUl } from "react-icons/fa";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { useAuth } from "../components/AuthProvider";

export default function ConfirmacionCita() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const datos = location.state;

  useEffect(() => {
    if (!datos) {
      navigate("/dashboard");
    }
  }, [datos, navigate]);

  if (!datos) return null;

  const handleVolver = () => {
    navigate("/dashboard");
  };

  const formatearFecha = (fechaISO) => {
    const fecha = new Date(fechaISO);
    return fecha.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  let titulo = "¡Tu cita ha sido agendada!";
  if (datos.tipo === "reagendada") titulo = "¡Tu cita ha sido reagendada!";
  if (datos.tipo === "cancelada") titulo = "¡Tu cita ha sido cancelada!";

  let migas = "Inicio > Agendar cita > Confirmación";
  if (datos.tipo === "reagendada")
    migas = "Inicio > Reagendar cita > Confirmación";
  if (datos.tipo === "cancelada")
    migas = "Inicio > Cancelar cita > Confirmación";

  const especialista = datos.odontologo || datos.especialista;

  return (
    <div className="d-flex dashboard-container">
      <Sidebar
        isMobile={false}
        onNavigateMisCitas={handleVolver}
        onNavigateAgendarCita={() => navigate("/agendar-cita")}
      />

      <main className="flex-grow-1 main-content text-center">
        <Sidebar
          isMobile={true}
          showMobileMenu={false}
          toggleMobileMenu={() => {}}
          onNavigateMisCitas={handleVolver}
          onNavigateAgendarCita={() => navigate("/agendar-cita")}
        />

        {/* Encabezado alineado con el contenido */}
        <div
          className="px-4 pt-4"
          style={{ maxWidth: "1200px", margin: "0 auto" }}
        >
          <Header titulo="Confirmación" breadcrumb={migas} onLogout={logout} />
        </div>

        <div className="contenedor-confirmacion mx-auto mt-5 text-center">
          <FaCheckCircle size={72} color="#28C76F" className="mb-4" />
          <h2
            className="fw-bold mb-3 text-center"
            style={{ color: "#214461", fontSize: "32px" }}
          >
            {titulo}
          </h2>

          <div className="card-datos-cita mx-auto mb-4">
            <p className="mb-1 fw-bold">{datos.especialidad}</p>
            <p className="mb-1">{especialista}</p>
            <p>
              {formatearFecha(datos.fecha)}, {datos.hora}
            </p>
          </div>

          <button
            className="btn-verde d-flex align-items-center justify-content-center gap-2 mx-auto"
            onClick={handleVolver}
          >
            <FaListUl /> Ir a Mis Citas
          </button>
        </div>
      </main>
    </div>
  );
}
