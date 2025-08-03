import { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const ListadoSolicitudes = () => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [mostrarPendientes, setMostrarPendientes] = useState(false);
  const [animandoIds, setAnimandoIds] = useState([]);
  const [toastVisible, setToastVisible] = useState(false);
  const [paginaActual, setPaginaActual] = useState(1);
  const [itemsPorPagina, setItemsPorPagina] = useState(10);
  const [busqueda, setBusqueda] = useState("");

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
    setPaginaActual(1);
  }, [mostrarPendientes]);

  const mostrarToast = () => {
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 3000);
  };

  const marcarComoCreada = async (id) => {
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/solicitudes/${id}`);

      if (mostrarPendientes) {
        setAnimandoIds((prev) => [...prev, id]);
        setTimeout(() => {
          setSolicitudes((prev) => prev.filter((s) => s.id !== id));
          setAnimandoIds((prev) => prev.filter((x) => x !== id));
        }, 400);
      } else {
        setSolicitudes((prev) =>
          prev.map((s) => (s.id === id ? { ...s, cuentaCreada: true } : s))
        );
      }

      mostrarToast();
    } catch (error) {
      console.error("Error al actualizar la solicitud", error);
      alert("No se pudo marcar como creada.");
    }
  };
//  Justo antes de paginar, se aplica el ordenamiento
const solicitudesFiltradas = solicitudes
  .filter((s) => {
    const textoBusqueda = busqueda.toLowerCase();
    return (
      `${s.nombre} ${s.apellido} ${s.cedula} ${s.correo} ${s.secretaria} ${s.subsecretaria}`
        .toLowerCase()
        .includes(textoBusqueda)
    );
  })
  .sort((a, b) => {
  return (b.cuentaCreada === true) - (a.cuentaCreada === true);
});


  const totalPaginas = Math.ceil(solicitudesFiltradas.length / itemsPorPagina);
  const indexInicio = (paginaActual - 1) * itemsPorPagina;
  const solicitudesPaginadas = solicitudesFiltradas.slice(
    indexInicio,
    indexInicio + itemsPorPagina
  );

  // Función para exportar a Excel
  const exportarAExcel = () => {
    const dataParaExcel = solicitudesFiltradas.map((s) => ({
      Nombre: s.nombre,
      Apellido: s.apellido,
      Cédula: s.cedula,
      Correo: s.correo,
      Secretaría: s.secretaria,
      Subsecretaría: s.subsecretaria,
      "Fecha de Inicio": s.fechaInicioContrato || "-",
      "Fecha de Fin": s.fechaFinContrato || "-",
      Vinculado: s.vinculado ? "Sí" : "No",
      Estado: s.cuentaCreada ? "Creada" : "Pendiente",
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataParaExcel);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Solicitudes");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const file = new Blob([excelBuffer], {
      type:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(file, "Solicitudes.xlsx");
  };

  return (
    <div className="container mt-5">
      {/* Título + switch */}
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

      {/* Input de búsqueda */}
      <div className="mb-3 d-flex flex-column flex-md-row gap-3">
        <input
          type="text"
          className="form-control"
          placeholder="Buscar por nombre, apellido, cédula, etc..."
          value={busqueda}
          onChange={(e) => {
            setBusqueda(e.target.value);
            setPaginaActual(1);
          }}
        />

        {/* Botón de exportar */}
        <button className="btn btn-success" onClick={exportarAExcel}>
          📥 Exportar a Excel
        </button>
      </div>

      {/* Selector cantidad por página */}
      <div className="mb-3 d-flex justify-content-end align-items-center">
        <label className="me-2">Ver:</label>
        <select
          value={itemsPorPagina}
          onChange={(e) => {
            setItemsPorPagina(Number(e.target.value));
            setPaginaActual(1);
          }}
          className="form-select w-auto"
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={100}>100</option>
        </select>
      </div>

      {/* Contador */}
      <div className="d-flex justify-content-end align-items-center mb-3">
        <div className="bg-white px-4 py-2 rounded shadow-sm border text-secondary fs-6">
          Mostrando <strong>{indexInicio + 1}</strong> -{" "}
          <strong>
            {Math.min(
              indexInicio + solicitudesPaginadas.length,
              solicitudesFiltradas.length
            )}
          </strong>{" "}
          de <strong>{solicitudesFiltradas.length}</strong> solicitudes
        </div>
      </div>

      {/* Tabla */}
      <div className="table-responsive">
        <table className="table table-bordered table-striped align-middle">
          <thead className="table-dark text-center">
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
            {solicitudesPaginadas.map((s) => (
              <tr
                key={s.id}
                className={`${
                  animandoIds.includes(s.id) ? "fila-animada" : ""
                } ${!s.cuentaCreada ? "table-warning" : ""}`}
              >
                <td>{s.nombre}</td>
                <td>{s.apellido}</td>
                <td>{s.cedula}</td>
                <td>{s.correo}</td>
                <td>{s.secretaria}</td>
                <td>{s.subsecretaria}</td>
                <td>{s.fechaInicioContrato || "-"}</td>
                <td>{s.fechaFinContrato || "-"}</td>
                <td>{s.vinculado ? "Sí" : "No"}</td>
                <td className="text-center">
                  {s.cuentaCreada ? (
                    <i className="bi bi-check-circle-fill text-success fs-5"></i>
                  ) : (
                    <i className="bi bi-hourglass-split text-warning fs-5"></i>
                  )}
                </td>
                {mostrarPendientes && (
                  <td className="text-center">
                    <button
                      className="btn btn-success btn-sm"
                      onClick={() => marcarComoCreada(s.id)}
                    >
                      <i className="bi bi-check2-circle me-1"></i> Marcar
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      {totalPaginas > 1 && (
        <nav className="d-flex justify-content-center">
          <ul className="pagination">
            <li className={`page-item ${paginaActual === 1 ? "disabled" : ""}`}>
              <button
                className="page-link"
                onClick={() => setPaginaActual(paginaActual - 1)}
              >
                Anterior
              </button>
            </li>
            {Array.from({ length: totalPaginas }, (_, i) => (
              <li
                key={i}
                className={`page-item ${
                  paginaActual === i + 1 ? "active" : ""
                }`}
              >
                <button
                  className="page-link"
                  onClick={() => setPaginaActual(i + 1)}
                >
                  {i + 1}
                </button>
              </li>
            ))}
            <li
              className={`page-item ${
                paginaActual === totalPaginas ? "disabled" : ""
              }`}
            >
              <button
                className="page-link"
                onClick={() => setPaginaActual(paginaActual + 1)}
              >
                Siguiente
              </button>
            </li>
          </ul>
        </nav>
      )}

      {/* Toast */}
      {toastVisible && (
        <div
          className="alert alert-success position-fixed bottom-0 end-0 m-4 shadow"
          style={{ zIndex: 9999 }}
        >
          ✅ Solicitud marcada como creada exitosamente.
        </div>
      )}
    </div>
  );
};

export default ListadoSolicitudes;
