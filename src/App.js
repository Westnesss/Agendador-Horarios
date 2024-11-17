import React, { useState } from 'react';

const App = () => {
  const [dias, setDias] = useState(["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"]);
  const [horarios, setHorarios] = useState([
    "08:00 - 09:00",
    "09:00 - 10:00",
    "10:00 - 11:00",
    "11:00 - 12:00",
    "12:00 - 13:00",
    "13:00 - 14:00",
    "14:00 - 15:00",
    "15:00 - 16:00",
  ]);

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
    if (reservas[idHorario]) {
      alert(`El horario ya fue reservado por el grupo ${reservas[idHorario]}.`);
      return;
    }

    const nuevasReservas = { ...reservas, [idHorario]: grupoSeleccionado };
    setReservas(nuevasReservas);
    localStorage.setItem("reservas", JSON.stringify(nuevasReservas));
    setGrupoSeleccionado(""); // Reiniciar el grupo seleccionado después de reservar
  };

  return (
    <div className="app-container">
      <h1>Asignación de Horarios</h1>
      <p>Selecciona un grupo y luego elige un horario disponible.</p>

      {/* Selección del grupo */}
      <div className="grupo-selector">
        <label>
          Selecciona tu grupo:
          <select
            value={grupoSeleccionado}
            onChange={(e) => setGrupoSeleccionado(e.target.value)}
          >
            <option value="">-- Selecciona un Grupo --</option>
            {Array.from({ length: 8 }, (_, i) => (
              <option key={i + 1} value={`Grupo ${i + 1}`}>
                Grupo {i + 1}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* Mostrar horarios por días */}
      <div className="horarios-container">
        {dias.map((dia) => (
          <div key={dia} className="dia-container">
            <h2>{dia}</h2>
            <div className="horarios">
              {horarios.map((horario) => {
                const idHorario = `${dia}-${horario}`;
                const reservado = reservas[idHorario];
                return (
                  <div key={idHorario} className="horario">
                    <span>{horario}</span>
                    <button
                      onClick={() => handleSeleccionarHorario(dia, horario)}
                      style={{
                        backgroundColor: reservado ? "red" : "green",
                        color: "white",
                        border: "none",
                        padding: "5px 10px",
                        cursor: reservado ? "not-allowed" : "pointer",
                      }}
                      disabled={reservado}
                    >
                      {reservado ? `Reservado por ${reservado}` : "Seleccionar"}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;