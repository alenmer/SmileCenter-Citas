import config from "../config/config";

export async function loginApi(username, password) {
  console.log("TEST");

  try {
    const response = await fetch(`${config.API_BASE_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ correo: username, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      // Si la respuesta tiene un campo `error`, lánzalo como mensaje
      const message = data?.error || "Error de autenticación";
      throw new Error(message);
    }

    const { token, usuario } = data;

    if (!token || !usuario) {
      throw new Error("Respuesta inválida del servidor");
    }

    return { token, usuario };
  } catch (error) {
    console.error("Error al hacer login:", error.message);
    throw error;
  }
}

export async function obtenerCitasPorPaciente(pacienteId) {
  try {
    const url = `http://127.0.0.1:3658/m1/919011-901517-default/api/citas?pacienteId=${pacienteId}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Error al obtener citas: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error en obtenerCitasPorPaciente:", error.message);
    throw error;
  }
}

export async function obtenerDisponibilidadDeCitas() {
  try {
    const url =
      "http://127.0.0.1:3658/m1/919011-901517-default/api/disponibilidad-citas"; // Cambia si usas entorno real
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("No se pudo obtener la disponibilidad de citas");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error en obtenerDisponibilidadDeCitas:", error.message);
    throw error;
  }
}

export async function crearCita(cita) {
  try {
    const url = "http://127.0.0.1:3658/m1/919011-901517-default/api/citas";

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(cita),
    });

    if (!response.ok) {
      throw new Error("Error al crear la cita");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error en crearCita:", error.message);
    throw error;
  }
}

export async function actualizarCita(id, citaActualizada) {
  try {
    const url = `http://127.0.0.1:3658/m1/919011-901517-default/api/citas/${id}`;

    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(citaActualizada),
    });

    if (!response.ok) {
      throw new Error("Error al reagendar la cita");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error en actualizarCita:", error.message);
    throw error;
  }
}

export async function cancelarCita(id) {
  try {
    const url = `http://127.0.0.1:3658/m1/919011-901517-default/api/citas/${id}`;

    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("No se pudo cancelar la cita");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al cancelar la cita:", error.message);
    throw error;
  }
}
