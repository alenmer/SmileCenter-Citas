import React, { useEffect, useState } from "react";
import { useAuth } from "../components/AuthProvider";
import { useNavigate } from "react-router-dom";
import { FaRedo, FaTimes } from "react-icons/fa";
import { BiSolidCalendar } from "react-icons/bi";
import { obtenerCitasPorPaciente, cancelarCita } from "../services/api";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import ModalCancelarCita from "../components/ModalCancelarCita";

export default function DashboardPage() {
  const { logout } = useAuth();
  const [citas, setCitas] = useState([]);
  const [mostrarMenu, setMostrarMenu] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [citaSeleccionada, setCitaSeleccionada] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function cargarCitas() {
      try {
        const data = await obtenerCitasPorPaciente(1);
        setCitas(data);
      } catch (error) {
        console.error("No se pudieron cargar las citas:", error.message);
      }
    }

    cargarCitas();
  }, []);

  const handleAgendarCita = () => {
    setMostrarMenu(false);
    navigate("/agendar-cita");
  };

  const handleMisCitas = () => {
    setMostrarMenu(false);
    navigate("/dashboard");
  };

  const handleCancelarClick = (cita) => {
    setCitaSeleccionada(cita);
    setModalVisible(true);
  };

  const confirmarCancelacion = async () => {
    try {
      await cancelarCita(citaSeleccionada.id);
      setModalVisible(false);

      navigate("/confirmacion", {
        state: {
          especialidad: citaSeleccionada.especialidad,
          especialista: citaSeleccionada.odontologo,
          fecha: citaSeleccionada.fecha,
          hora: citaSeleccionada.hora,
          tipo: "cancelada",
        },
      });
    } catch (error) {
      console.error("Error al cancelar la cita:", error.message);
      alert("No se pudo cancelar la cita.");
    }
  };

  return (
    <div className="d-flex dashboard-container">
      <Sidebar
        isMobile={false}
        onNavigateMisCitas={handleMisCitas}
        onNavigateAgendarCita={handleAgendarCita}
      />

      <main className="flex-grow-1 main-content">
        <Sidebar
          isMobile={true}
          showMobileMenu={mostrarMenu}
          toggleMobileMenu={() => setMostrarMenu(!mostrarMenu)}
          onNavigateMisCitas={handleMisCitas}
          onNavigateAgendarCita={handleAgendarCita}
        />

        <div
          className="px-4 pt-4"
          style={{ maxWidth: "1200px", margin: "0 auto" }}
        >
          <Header
            titulo="Próximas citas"
            breadcrumb="Inicio > Mis citas"
            onLogout={logout}
          />
        </div>

        <div className="contenedor-dashboard-citas d-flex flex-column gap-4 mt-4 mx-auto">
          {citas.map((cita) => (
            <div
              key={cita.id}
              className="card-cita rounded d-flex justify-content-between align-items-center flex-wrap"
            >
              <div className="contenido-cita">
                <div className="icono-cita">
                  <BiSolidCalendar size={36} color="#F59E0B" />
                </div>
                <div className="texto-cita">
                  <h5 className="mb-1 fw-bold card-titulo">
                    {cita.especialidad}
                  </h5>
                  <p className="mb-1 card-detalle">{cita.odontologo}</p>
                  <p className="mb-0 card-detalle">
                    {formatearFecha(cita.fecha)}, {cita.hora}
                  </p>
                </div>
              </div>

              <div className="d-flex flex-column gap-2">
                <button
                  className="btn-verde d-flex align-items-center justify-content-center gap-2"
                  onClick={() => navigate(`/reagendar/${cita.id}`)}
                >
                  <FaRedo size={16} />
                  Reagendar cita
                </button>
                <button
                  className="btn-rojo d-flex align-items-center justify-content-center gap-2"
                  onClick={() => handleCancelarClick(cita)}
                >
                  <FaTimes size={16} />
                  Cancelar cita
                </button>
              </div>
            </div>
          ))}
        </div>

        <ModalCancelarCita
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onConfirmar={confirmarCancelacion}
          cita={citaSeleccionada}
        />
      </main>
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
