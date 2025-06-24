import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthProvider";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import InputConIcon from "../components/InputConIcon";
import SelectorHorario from "../components/SelectorHorario";
import ModalConfirmacion from "../components/ModalConfirmacion";
import { FaTooth, FaUserMd, FaCalendarAlt, FaRedo } from "react-icons/fa";
import { obtenerDisponibilidadDeCitas, actualizarCita } from "../services/api";

export default function ReagendarCita() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();

  const [disponibilidad, setDisponibilidad] = useState({});
  const [especialidad, setEspecialidad] = useState("");
  const [especialista, setEspecialista] = useState("");
  const [fecha, setFecha] = useState("");
  const [horaSeleccionada, setHoraSeleccionada] = useState("");
  const [mostrarModal, setMostrarModal] = useState(false);

  useEffect(() => {
    async function cargarDatos() {
      try {
        const data = await obtenerDisponibilidadDeCitas();
        setDisponibilidad(data);
      } catch (error) {
        console.error("Error al cargar disponibilidad:", error.message);
      }
    }

    cargarDatos();
  }, []);

  const especialidades = Object.keys(disponibilidad);
  const especialistas = especialidad
    ? Object.keys(disponibilidad[especialidad] || {})
    : [];
  const fechas = especialista
    ? Object.keys(disponibilidad[especialidad]?.[especialista] || {})
    : [];
  const horarios = disponibilidad[especialidad]?.[especialista]?.[fecha] || [];

  const handleReagendar = async () => {
    try {
      await actualizarCita(id, {
        especialidad,
        odontologoId: especialista,
        fecha,
        hora: horaSeleccionada,
      });

      navigate("/confirmacion", {
        state: {
          especialidad,
          especialista,
          fecha,
          hora: horaSeleccionada,
          tipo: "reagendada",
        },
      });
    } catch (error) {
      console.error("Error al reagendar:", error.message);
      alert("No se pudo reagendar la cita");
    }
  };

  return (
    <div className="d-flex dashboard-container">
      <Sidebar
        isMobile={false}
        onNavigateMisCitas={() => navigate("/dashboard")}
        onNavigateAgendarCita={() => navigate("/agendar-cita")}
      />

      <main className="flex-grow-1 main-content">
        <Sidebar
          isMobile={true}
          showMobileMenu={false}
          toggleMobileMenu={() => {}}
          onNavigateMisCitas={() => navigate("/dashboard")}
          onNavigateAgendarCita={() => navigate("/agendar-cita")}
        />

        <div
          className="px-4 pt-4"
          style={{ maxWidth: "1200px", margin: "0 auto" }}
        >
          <div
            className="volver-link mb-2"
            onClick={() => navigate("/dashboard")}
          >
            ← Volver
          </div>

          <Header
            titulo="Reagendar cita"
            breadcrumb="Inicio > Reagendar cita"
            onLogout={logout}
          />

          <div
            className="d-flex flex-column gap-4 mt-4"
            style={{ maxWidth: "600px", margin: "0 auto" }}
          >
            <InputConIcon
              icon={<FaTooth size={20} />}
              iconColor="#f59e0b"
              value={especialidad}
              onChange={(e) => {
                setEspecialidad(e.target.value);
                setEspecialista("");
                setFecha("");
                setHoraSeleccionada("");
              }}
              options={especialidades}
              placeholder="Especialidad"
              disabled={false}
            />

            <InputConIcon
              icon={<FaUserMd size={20} />}
              iconColor="#f59e0b"
              value={especialista}
              onChange={(e) => {
                setEspecialista(e.target.value);
                setFecha("");
                setHoraSeleccionada("");
              }}
              options={especialistas}
              placeholder="Especialista"
              disabled={!especialidad}
            />

            <InputConIcon
              icon={<FaCalendarAlt size={20} />}
              iconColor="#f59e0b"
              value={fecha}
              onChange={(e) => {
                setFecha(e.target.value);
                setHoraSeleccionada("");
              }}
              options={fechas}
              placeholder="Fecha"
              disabled={!especialista}
            />

            <SelectorHorario
              horarios={horarios}
              seleccionado={horaSeleccionada}
              onSeleccionar={setHoraSeleccionada}
            />

            {horaSeleccionada && (
              <div className="mt-4 d-flex justify-content-center">
                <button
                  className="btn-verde px-5 py-2 d-flex align-items-center justify-content-center gap-2"
                  style={{ minWidth: "220px", borderRadius: "10px" }}
                  onClick={() => setMostrarModal(true)}
                >
                  <FaRedo /> Reagendar cita
                </button>
              </div>
            )}
          </div>
        </div>

        {mostrarModal && (
          <ModalConfirmacion
            especialidad={especialidad}
            especialista={especialista}
            fecha={fecha}
            hora={horaSeleccionada}
            onCancelar={() => setMostrarModal(false)}
            onConfirmar={handleReagendar}
          />
        )}
      </main>
    </div>
  );
}
