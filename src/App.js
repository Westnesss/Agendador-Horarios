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

  const handleSeleccionarHorario = (dia, horario) => {
    if (!grupoSeleccionado) {
      alert("Por favor, selecciona un grupo antes de reservar un horario.");
      return;
    }

    const idHorario = `${dia}-${horario}`;
    const gruposReservados = reservas[idHorario] || [];

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
    const horariosReservados = Object.values(reservas).filter((grupos) =>
      grupos.includes(grupoSeleccionado)
    );

    if (horariosReservados.length === 0) {
      alert("No se ha seleccionado ningún horario.");
    } else {
      alert(`Selección finalizada para el grupo: ${grupoSeleccionado}`);
    }

    setGrupoSeleccionado("");
  };

  const handleBorrarReservas = () => {
    if (
      window.confirm(
        "¿Estás seguro de que deseas borrar todas las reservas? Esta acción no se puede deshacer."
      )
    ) {
      setReservas({});
      localStorage.removeItem("reservas");
      alert("Todas las reservas han sido borradas.");
    }
  };

  return (
    <div className="app-container">
      <h1>Asignación de Horarios</h1>
      <p>
        Selecciona un grupo y luego elige los horarios disponibles. Haz clic en
        "Finalizar selección" cuando termines.
      </p>

      {/* Selección del grupo */}
      <div className="grupo-selector">
        <label>
          Selecciona tu grupo:
          <select
            value={grupoSeleccionado}
            onChange={(e) => setGrupoSeleccionado(e.target.value)}
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