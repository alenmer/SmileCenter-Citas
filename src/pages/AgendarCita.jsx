import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthProvider";
import { FaTooth, FaUserMd, FaCalendarAlt } from "react-icons/fa";
import { obtenerDisponibilidadDeCitas, crearCita } from "../services/api";
import InputConIcon from "../components/InputConIcon";
import SelectorHorario from "../components/SelectorHorario";
import ModalConfirmacion from "../components/ModalConfirmacion";

export default function AgendarCita() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [mostrarMenu, setMostrarMenu] = useState(false);
  const [mostrarModal, setMostrarModal] = useState(false);

  const [disponibilidad, setDisponibilidad] = useState({});
  const [especialidad, setEspecialidad] = useState("");
  const [especialista, setEspecialista] = useState("");
  const [fecha, setFecha] = useState("");
  const [horaSeleccionada, setHoraSeleccionada] = useState("");

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

  const especialidadesDisponibles = Object.keys(disponibilidad);
  const especialistasDisponibles = especialidad
    ? Object.keys(disponibilidad[especialidad] || {})
    : [];
  const fechasDisponibles = especialista
    ? Object.keys(disponibilidad[especialidad]?.[especialista] || {})
    : [];
  const horariosDisponibles = fecha
    ? disponibilidad[especialidad]?.[especialista]?.[fecha] || []
    : [];

  const handleAgendarCita = () => {
    setMostrarMenu(false);
    navigate("/agendar-cita");
  };

  const handleMisCitas = () => {
    setMostrarMenu(false);
    navigate("/dashboard");
  };

  const handleConfirmar = async () => {
    try {
      const cita = {
        pacienteId: 1,
        especialidad,
        odontologo: especialista,
        fecha,
        hora: horaSeleccionada,
      };

      const citaCreada = await crearCita(cita);

      navigate("/confirmacion", {
        state: citaCreada,
      });
    } catch (error) {
      console.error("Error al confirmar cita:", error);
      alert("No se pudo confirmar la cita");
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

        <Header
          titulo="Agendar cita"
          breadcrumb="Inicio > Agendar cita"
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
            options={especialidadesDisponibles}
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
            options={especialistasDisponibles}
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
            options={fechasDisponibles}
            placeholder="Fecha"
            disabled={!especialista}
          />

          <SelectorHorario
            horarios={horariosDisponibles}
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
                <FaCalendarAlt />
                Confirmar cita
              </button>
            </div>
          )}
        </div>

        {mostrarModal && (
          <ModalConfirmacion
            especialidad={especialidad}
            especialista={especialista}
            fecha={fecha}
            hora={horaSeleccionada}
            onCancelar={() => setMostrarModal(false)}
            onConfirmar={handleConfirmar}
          />
        )}
      </main>
    </div>
  );
}
