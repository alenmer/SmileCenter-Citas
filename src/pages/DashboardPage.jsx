// DashboardPage.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../components/AuthProvider";
import { useNavigate } from "react-router-dom";
import { FaRedo, FaTimes } from "react-icons/fa";
import { BiSolidCalendar, BiCalendarX } from "react-icons/bi";
import {
  obtenerCitasPorPaciente,
  cancelarCita,
  obtenerTiempoServidor,
} from "../services/api";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import ModalCancelarCita from "../components/ModalCancelarCita";
import ErrorBanner from "../components/ErrorBanner";

export default function DashboardPage() {
  const { logout, user } = useAuth();
  const [citas, setCitas] = useState([]);
  const [fechaHoraServidor, setFechaHoraServidor] = useState(null);
  const [mostrarMenu, setMostrarMenu] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [citaSeleccionada, setCitaSeleccionada] = useState(null);
  const [mensajeError, setMensajeError] = useState("");
  const [errorCarga, setErrorCarga] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const cargarCitas = async () => {
      try {
        if (!user?.id) return;

        const { fecha: serverFecha, hora: serverHora } =
          await obtenerTiempoServidor();
        const [sy, sm, sd] = serverFecha.split("-").map(Number);
        const [sh, smin] = serverHora.split(":").map(Number);
        const fechaHoraSrv = new Date(sy, sm - 1, sd, sh, smin);
        setFechaHoraServidor(fechaHoraSrv);

        const data = await obtenerCitasPorPaciente(user.id);
        const citasFiltradas = data.filter((cita) => {
          const { fecha, hora, estado } = cita;
          if (!fecha || !hora) return false;
          const estadoValido =
            estado && ["activa", "reprogramada"].includes(estado.toLowerCase());
          if (!estadoValido) return false;

          const [cy, cm, cd] = fecha.split("-").map(Number);
          const [ch, cmin] = hora.split(":").map(Number);
          const fechaHoraCita = new Date(cy, cm - 1, cd, ch, cmin);

          return fechaHoraCita.getTime() > fechaHoraSrv.getTime();
        });

        setCitas(citasFiltradas);
        setErrorCarga("");
      } catch (error) {
        console.error("Error al obtener citas:", error);
        if (error.message.includes("Failed to fetch")) {
          setErrorCarga("Error de red al consultar próximas citas.");
        } else {
          setErrorCarga("No se pudo cargar la información de tus citas.");
        }
      }
    };

    cargarCitas();
  }, [user]);

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
        onLogout={logout}
      />

      <main className="flex-grow-1 main-content">
        <Sidebar
          isMobile={true}
          showMobileMenu={mostrarMenu}
          toggleMobileMenu={() => setMostrarMenu(!mostrarMenu)}
          onNavigateMisCitas={handleMisCitas}
          onNavigateAgendarCita={handleAgendarCita}
          onLogout={logout}
        />

        {mensajeError && (
          <ErrorBanner
            mensaje={mensajeError}
            onClose={() => setMensajeError("")}
          />
        )}
        {errorCarga && (
          <ErrorBanner mensaje={errorCarga} onClose={() => setErrorCarga("")} />
        )}

        <div
          className="px-4 pt-4"
          style={{ maxWidth: "1200px", margin: "0 auto" }}
        >
          <Header titulo="Próximas citas" breadcrumb="Inicio > Mis citas" />
        </div>

        <div className="contenedor-dashboard-citas d-flex flex-column gap-4 mt-4 mx-auto">
          {citas.length === 0 ? (
            <div className="mensaje-sin-citas">
              <BiCalendarX className="icono-informativo" />
              <h4>¡Aún no tienes citas activas agendadas!</h4>
              <p>
                Puedes agendar una nueva cita desde el menú seleccionando la
                opción <strong>“Agendar cita”</strong>.
              </p>
            </div>
          ) : (
            citas.map((cita) => (
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
                    onClick={() =>
                      estaEnRangoPermitido(
                        cita.fecha,
                        cita.hora,
                        fechaHoraServidor
                      )
                        ? navigate(`/reagendar/${cita.id}`)
                        : setMensajeError(
                            "No es posible reagendar citas el mismo día. Llame al consultorio para más información."
                          )
                    }
                  >
                    <FaRedo size={16} />
                    Reagendar cita
                  </button>
                  <button
                    className="btn-rojo d-flex align-items-center justify-content-center gap-2"
                    onClick={() =>
                      estaEnRangoPermitido(
                        cita.fecha,
                        cita.hora,
                        fechaHoraServidor
                      )
                        ? handleCancelarClick(cita)
                        : setMensajeError(
                            "No es posible cancelar citas el mismo día. Llame al consultorio para más información."
                          )
                    }
                  >
                    <FaTimes size={16} />
                    Cancelar cita
                  </button>
                </div>
              </div>
            ))
          )}
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

function formatearFecha(fechaStr) {
  const [y, m, d] = fechaStr.split("-").map(Number);
  const fecha = new Date(y, m - 1, d, 12, 0);
  return fecha.toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function estaEnRangoPermitido(fecha, hora, referencia) {
  if (!referencia) return false;
  const [anio, mes, dia] = fecha.split("-").map(Number);
  const [h, m] = hora.split(":").map(Number);
  const fechaHoraCita = new Date(anio, mes - 1, dia, h, m);
  const diferencia = fechaHoraCita.getTime() - referencia.getTime();
  return diferencia >= 24 * 60 * 60 * 1000;
}
