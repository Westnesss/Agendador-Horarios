import React, { useState } from "react";

const App = () => {
  const [dias, setDias] = useState([
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
  ]);

   const horariosPorDia = {
    Lunes: [
      "07:00 - 08:00",
      "08:00 - 09:00",
      "13:00 - 14:00",
      "14:00 - 15:00",
      "15:00 - 16:00",
      "16:00 - 17:00",
      "17:00 - 18:00",
      "18:00 - 19:00",
      "19:00 - 20:00",
    ],
    Martes: [
      "07:00 - 08:00",
      "08:00 - 09:00",
      "11:00 - 12:00",
      "12:00 - 13:00",
      "13:00 - 14:00",
      "14:00 - 15:00",
      "15:00 - 16:00",
      "16:00 - 17:00",
      "17:00 - 18:00",
      "18:00 - 19:00",
      "19:00 - 20:00",
    ],
    Miércoles: ["07:00 - 08:00", "08:00 - 09:00"],
    Jueves: [
      "07:00 - 08:00",
      "08:00 - 09:00",
      "13:00 - 14:00",
      "14:00 - 15:00",
      "15:00 - 16:00",
      "16:00 - 17:00",
      "17:00 - 18:00",
      "18:00 - 19:00",
      "19:00 - 20:00",
    ],
    Viernes: [
      "07:00 - 08:00",
      "08:00 - 09:00",
      "09:00 - 10:00",
      "10:00 - 11:00",
      "11:00 - 12:00",
      "12:00 - 13:00",
      "13:00 - 14:00",
      "14:00 - 15:00",
      "15:00 - 16:00",
      "16:00 - 17:00",
      "17:00 - 18:00",
      "18:00 - 19:00",
      "19:00 - 20:00",
    ],
  };

  const [reservas, setReservas] = useState(
    JSON.parse(localStorage.getItem("reservas")) || {}
  );
  const [grupoSeleccionado, setGrupoSeleccionado] = useState("");
  const [passwords, setPasswords] = useState(
    JSON.parse(localStorage.getItem("passwords")) || {}
  );
  const [grupoAutenticado, setGrupoAutenticado] = useState(false);

  const ADMIN_PASSWORD = "admin123";

  const handleSeleccionarGrupo = (grupo) => {
    if (grupo === "") {
      setGrupoSeleccionado("");
      setGrupoAutenticado(false);
      return;
    }

    if (!passwords[grupo]) {
      const nuevaContraseña = prompt(
        `Establece una contraseña para el grupo ${grupo}:`
      );
      if (nuevaContraseña) {
        const nuevasPasswords = { ...passwords, [grupo]: nuevaContraseña };
        setPasswords(nuevasPasswords);
        localStorage.setItem("passwords", JSON.stringify(nuevasPasswords));
        setGrupoSeleccionado(grupo);
        alert("Contraseña establecida con éxito.");
      } else {
        alert("No se estableció ninguna contraseña.");
      }
    } else {
      const contraseñaIngresada = prompt(
        `Ingresa la contraseña para el grupo ${grupo}:`
      );
      if (contraseñaIngresada === passwords[grupo]) {
        setGrupoSeleccionado(grupo);
        setGrupoAutenticado(true);
        alert(`Grupo ${grupo} autenticado correctamente.`);
      } else {
        alert("Contraseña incorrecta. No puedes seleccionar este grupo.");
      }
    }
  };

  const handleSeleccionarHorario = (dia, horario) => {
    if (!grupoSeleccionado) {
      alert("Por favor, selecciona un grupo antes de reservar un horario.");
      return;
    }

    if (!grupoAutenticado) {
      const contraseñaIngresada = prompt(
        `Ingresa la contraseña para el grupo ${grupoSeleccionado}:`
      );
      if (contraseñaIngresada !== passwords[grupoSeleccionado]) {
        alert("Contraseña incorrecta. No puedes realizar la reserva.");
        return;
      }
      setGrupoAutenticado(true);
      alert("Autenticación exitosa. Puedes continuar reservando horarios.");
    }

    const idHorario = `${dia}-${horario}`;
    const gruposReservados = reservas[idHorario] || [];

    if (gruposReservados.includes(grupoSeleccionado)) {
      alert(`El grupo ${grupoSeleccionado} ya ha reservado este horario.`);
      return;
    }

    if (gruposReservados.length >= 4) {
      alert(
        `El horario ya fue reservado por 4 grupos: ${gruposReservados.join(", ")}.`
      );
      return;
    }

    const nuevasReservas = {
      ...reservas,
      [idHorario]: [...gruposReservados, grupoSeleccionado],
    };

    setReservas(nuevasReservas);
    localStorage.setItem("reservas", JSON.stringify(nuevasReservas));
  };

  const handleFinalizarSeleccion = () => {
    alert(`Selección finalizada para el grupo: ${grupoSeleccionado}`);
    setGrupoSeleccionado("");
    setGrupoAutenticado(false);
  };

  const handleBorrarReservas = () => {
    const contraseñaAdmin = prompt("Ingresa la contraseña de administrador:");
    if (contraseñaAdmin !== ADMIN_PASSWORD) {
      alert("Contraseña incorrecta. No se pueden borrar las reservas.");
      return;
    }

    if (window.confirm("¿Estás seguro de que deseas borrar todas las reservas?")) {
      setReservas({});
      setPasswords({});
      localStorage.removeItem("reservas");
      localStorage.removeItem("passwords");
      alert("Todas las reservas y contraseñas han sido borradas.");
    }
  };

  return (
    <div className="app-container">
      <h1>Asignación de Horarios</h1>
      <p>
        Selecciona un grupo, establece su contraseña y elige los horarios
        disponibles. Haz clic en "Finalizar selección" cuando termines.
      </p>

      {/* Selección del grupo */}
      <div className="grupo-selector">
        <label>
          Selecciona tu grupo:
          <select
            value={grupoSeleccionado}
            onChange={(e) => handleSeleccionarGrupo(e.target.value)}
            disabled={grupoSeleccionado !== ""}
          >
            <option value="">-- Selecciona un Grupo --</option>
            {Array.from({ length: 8 }, (_, i) => (
              <option key={i + 1} value={`Grupo ${i + 1}`}>
                Grupo {i + 1}
              </option>
            ))}
          </select>
        </label>
        {grupoSeleccionado && (
          <button
            onClick={handleFinalizarSeleccion}
            style={{ marginLeft: "10px" }}
          >
            Finalizar selección
          </button>
        )}
      </div>

      {/* Mostrar horarios por días */}
      <div className="horarios-container">
        {dias.map((dia) => (
          <div key={dia} className="dia-container">
            <h2>{dia}</h2>
            <div className="horarios">
              {horariosPorDia[dia].map((horario) => {
                const idHorario = `${dia}-${horario}`;
                const gruposReservados = reservas[idHorario] || [];
                return (
                  <div key={idHorario} className="horario">
                    <span>{horario}</span>
                    <button
                      onClick={() => handleSeleccionarHorario(dia, horario)}
                      style={{
                        backgroundColor:
                          gruposReservados.length >= 4 ? "red" : "green",
                        color: "white",
                        border: "none",
                        padding: "5px 10px",
                        cursor:
                          gruposReservados.length >= 4
                            ? "not-allowed"
                            : "pointer",
                      }}
                      disabled={gruposReservados.length >= 4}
                    >
                      {gruposReservados.length >= 4
                        ? `Lleno (${gruposReservados.length}/4)`
                        : `Seleccionar (${gruposReservados.length}/4)`}
                    </button>
                    {gruposReservados.length > 0 && (
                      <div style={{ marginTop: "5px", fontSize: "12px" }}>
                        <strong>Grupos:</strong> {gruposReservados.join(", ")}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Botón para borrar reservas */}
      <div className="borrar-reservas">
        <button
          onClick={handleBorrarReservas}
          style={{
            marginTop: "20px",
            backgroundColor: "red",
            color: "white",
            padding: "10px 20px",
            border: "none",
            cursor: "pointer",
          }}
        >
          Borrar todas las reservas
        </button>
      </div>
    </div>
  );
};

export default App;