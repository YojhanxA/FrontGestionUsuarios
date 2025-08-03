import { useState } from "react";
import axios from "axios";

const Formulario = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    cedula: "",
    correo: "",
    secretaria: "",
    subsecretaria: "",
    fechaInicioContrato: "",
    fechaFinContrato: "",
    vinculado: false,
  });

  const capitalizar = (texto) =>
    texto.toLowerCase().replace(/\b\w/g, (letra) => letra.toUpperCase());

  const soloNumeros = (texto) => texto.replace(/\D/g, "");

  const validarCorreo = (correo) => correo.includes("@");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let newValue = value;

    if (
      name === "nombre" ||
      name === "apellido" ||
      name === "secretaria" ||
      name === "subsecretaria"
    ) {
      newValue = capitalizar(value);
    }

    if (name === "correo") {
      newValue = value.toLowerCase();
    }

    if (name === "cedula") {
      newValue = soloNumeros(value).slice(0, 10);
    }

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : newValue,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validarCorreo(formData.correo)) {
      alert("El correo debe contener @");
      return;
    }

    if (formData.cedula.length === 0 || formData.cedula.length > 10) {
      alert("La cédula debe tener entre 1 y 10 dígitos");
      return;
    }

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/solicitudes`,
        formData
      );
      alert("Solicitud enviada correctamente");
      setFormData({
        nombre: "",
        apellido: "",
        cedula: "",
        correo: "",
        secretaria: "",
        subsecretaria: "",
        fechaInicioContrato: "",
        fechaFinContrato: "",
        vinculado: false,
      });
    } catch (error) {
      if (error.response && error.response.status === 400) {
        // Mensaje como texto plano
        alert(error.response.data);
      } else {
        alert("Error al enviar solicitud");
      }
      console.error(error);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center">Formulario de Solicitud de Cuenta</h2>
      <form onSubmit={handleSubmit} className="shadow p-4 rounded bg-light">
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Nombre</label>
            <input
              type="text"
              name="nombre"
              className="form-control"
              value={formData.nombre}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Apellido</label>
            <input
              type="text"
              name="apellido"
              className="form-control"
              value={formData.apellido}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Cédula</label>
            <input
              type="text"
              name="cedula"
              className="form-control"
              value={formData.cedula}
              onChange={handleChange}
              required
              inputMode="numeric"
              pattern="\d{1,10}"
            />
            <div className="form-text">Máximo 10 dígitos.</div>
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Correo</label>
            <input
              type="email"
              name="correo"
              className="form-control"
              value={formData.correo}
              onChange={handleChange}
              required
            />
            <div className="form-text">Debe contener un "@".</div>
          </div>
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Secretaría</label>
            <input
              type="text"
              name="secretaria"
              className="form-control"
              value={formData.secretaria}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Subsecretaría</label>
            <input
              type="text"
              name="subsecretaria"
              className="form-control"
              value={formData.subsecretaria}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-check form-switch mb-3">
          <input
            className="form-check-input"
            type="checkbox"
            name="vinculado"
            checked={formData.vinculado}
            onChange={handleChange}
            id="vinculadoCheck"
          />
          <label className="form-check-label" htmlFor="vinculadoCheck">
            Es vinculado (no aplica fechas de contrato)
          </label>
        </div>

        {!formData.vinculado && (
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Fecha de inicio de contrato</label>
              <input
                type="date"
                name="fechaInicioContrato"
                className="form-control"
                value={formData.fechaInicioContrato}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">
                Fecha de finalización de contrato
              </label>
              <input
                type="date"
                name="fechaFinContrato"
                className="form-control"
                value={formData.fechaFinContrato}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        )}

        <div className="text-center">
          <button type="submit" className="btn btn-primary px-4">
            Enviar Solicitud
          </button>
        </div>
      </form>
    </div>
  );
};

export default Formulario;
