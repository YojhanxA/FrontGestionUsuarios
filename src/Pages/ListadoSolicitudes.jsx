import { useEffect, useState } from "react";
import axios from "axios";

const ListadoSolicitudes = () => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [mostrarPendientes, setMostrarPendientes] = useState(false);

  const fetchSolicitudes = async () => {
    try {
      const url = mostrarPendientes
        ? `${import.meta.env.VITE_API_URL}/api/solicitudes?estado=false`
        : `${import.meta.env.VITE_API_URL}/api/solicitudes`;

      const response = await axios.get(url);
      setSolicitudes(response.data);
    } catch (error) {
      console.error("Error al obtener las solicitudes", error);
    }
  };

  useEffect(() => {
    fetchSolicitudes();
  }, [mostrarPendientes]);

  const marcarComoCreada = async (id) => {
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/solicitudes/${id}`);
      fetchSolicitudes(); // Refrescar lista
    } catch (error) {
      console.error("Error al actualizar la solicitud", error);
    }
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Listado de Solicitudes</h2>
        <div className="form-check form-switch">
          <input
            className="form-check-input"
            type="checkbox"
            id="filtroPendientes"
            checked={mostrarPendientes}
            onChange={() => setMostrarPendientes(!mostrarPendientes)}
          />
          <label className="form-check-label" htmlFor="filtroPendientes">
            Mostrar solo pendientes
          </label>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-bordered table-striped">
          <thead className="table-dark">
            <tr>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Cédula</th>
              <th>Correo</th>
              <th>Secretaría</th>
              <th>Subsecretaría</th>
              <th>Inicio</th>
              <th>Fin</th>
              <th>Vinculado</th>
              <th>Estado</th>
              {mostrarPendientes && <th>Acción</th>}
            </tr>
          </thead>
          <tbody>
            {solicitudes.map((s) => (
              <tr key={s.id}>
                <td>{s.nombre}</td>
                <td>{s.apellido}</td>
                <td>{s.cedula}</td>
                <td>{s.correo}</td>
                <td>{s.secretaria}</td>
                <td>{s.subsecretaria}</td>
                <td>{s.fechaInicioContrato || "-"}</td>
                <td>{s.fechaFinContrato || "-"}</td>
                <td>{s.vinculado ? "Sí" : "No"}</td>
                <td>{s.cuentaCreada ? "✅" : "⏳"}</td>
                {mostrarPendientes && (
                  <td>
                    <button
                      className="btn btn-success btn-sm"
                      onClick={() => marcarComoCreada(s.id)}
                    >
                      Marcar como creada
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListadoSolicitudes;
