import { useState } from "react";
import axios from "axios";
import Select from "react-select";

// 🔗 Mapa de secretarías y subsecretarías
const secretariasData = {
  "Secretaria de Innovacion Digital": [
      "Subsecretaria de Servicios de Tecnologias de la Informacion",
      "Subsecretaria de Ciudad Inteligente",
    ],
    "Secretaria de Evaluacion y Control": [
      "Subsecretaria de Evaluacion y Seguimiento",
      "Subsecretaria de Asesoria y Acompañamiento",
    ],
    "Secretaria de Cultura Ciudadana": [
      "Subsecretaria de Ciudadania Cultural",
      "Subsecretaria de Bibliotecas Lectura y Patrimonio",
      "Subsecretaria de Arte y Cultura",
    ],
    "Secretaria de Gestion Humana y Servicio a la Ciudadania": [
      "Subsecretaria de Servicio a la Ciudadania",
      "Direccion de Control Disciplinario Interno",
      "Subsecretaria de Gestion Humana",
      "Subsecretaria de Desarrollo Institucional",
    ],
    "Secretaria de Seguridad y Convivencia": [
      "Subsecretaria de Gobierno Local y Convivencia",
      "Subsecretaria Operativa de la Seguridad",
      "Subsecretaria Planeacion de la Seguridad",
      "Subsecretaria de Espacio Publico",
      "Subsecretaría de Gobierno Local y Convivencia",
      "Subsecretaria Gobierno Local y Convivencia",
      "Subsecretaría Operativa de la Seguridad",
    ],
    "Departamento Administrativo de Planeacion": [
      "Subdireccion de Planeacion Social y Economica",
      "Subdireccion de Prospectiva Informacion y Evaluacion Estrategica",
      "Subdireccion de Planeacion Territorial y Estrategica de Ciudad",
    ],
    "Secretaria General": ["Secretaria General"],
    "Secretaria de Educacion": [
      "Unidad Administrativa Especial Buen Comienzo",
      "Subsecretaria de Prestacion del Servicio Educactivo",
      "Subsecretaria Administrativa y Financiera de Educacion",
      "Subdireccion de Prestacion del Servicio",
      "Subsecretaria de Planeacion Educativa",
    ],
    "Secretaria de las Mujeres": [
      "Subsecretaria de Transversalizacion",
      "Subsecretaria de Derechos",
    ],
    "Secretaria de Desarrollo Economico": [
      "Subsecretaria de Desarrollo Rural",
      "Despacho",
      "Subsecretaria de Turismo",
      "Subsecretaria de Creacion y Fortalecimiento Empresarial",
    ],
    "Secretaria de Salud": [
      "Subsecretaria de Salud Publica",
      "Subsecretaria Administrativa y Financiera de Salud",
      "Subsecretaria de Gestion de Servicios de Salud",
    ],
    "Secretaria de Infraestructura Fisica": [
      "Subsecretaria Construccion y Mto de la Infraestructura Fisica",
      "Subsecretaria de Planeacion de Infraestructura Fisica",
      "Subsecretaria Planeacion de la infraestructura Fisica",
    ],
    "Secretaria de Gestion y Control Territorial": [
      "Subsecretaria de Control Urbanistico",
      "Subsecretaria de Catastro",
      "Subsecretaría de Control Urbanístico",
      "Subsecretaria de Control Urbanístico",
      "Subsecretaria de Servicios Publicos",
    ],
    "Secretaria de Movilidad": [
      "Subsecretaria de Seguridad Vial y Control",
      "Subsecretaria Tecnica",
      "Subsecretaria Legal",
      "Gerencia de Movilidad Humana",
    ],
    "Secretaria de Hacienda": [
      "Subsecretaria de Ingresos",
      "Subsecretaria de Tesoreria",
      "Subsecretaria de Presupuesto y Gestion Financiera",
    ],
    "Secretaria de Gobierno y Gestion del Gabinete": ["Secretaria de Gobierno y Gestion del Gabinete"],
    "Secretaria de la Juventud": ["Secretaria de la Juventud"],
    "Secretaria de Inclusion Social y Familia": [
      "Subsecretaria Tecnica de Inclusion Social",
      "Subsecretaria de Grupos Poblacionales",
    ],
    "Alcaldia": [
      "Gerencia de Diversidades Sexuales e Identidades de Genero",
      "Gerencia de Proyectos Estrategicos",
    ],
    "Secretaria de Turismo y Entretenimiento": [
      "Subsecretaria de Planificacion Control y Competitividad Turistic",
      "Subsecretaria de Promocion Turistica y Entretenimiento",
    ],
    "Secretaria de Participacion Ciudadana": [
      "Subsecretaria de Formacion y Participacion Ciudadana",
      "Subsecretaria de Organizacion Social",
      "Subsecretaria de Planeacion Local y Presupuesto Participativo",
    ],
    "Secretaria de Paz y Derechos Humanos": [
      "Subsecretaria de Justicia Transicional y Restaurativa",
      "Subsecretaria de Construccion de Paz Territorial",
      "Subsecretaria de Derechos Humanos",
      "Subsecretaria de Justicia Restaurativa",
    ],
    "Secretaria de Comunicaciones": ["Subsecretaria de Comunicacion Estrategica"],
    "Secretaria del Medio Ambiente": [
      "Subsecretaria de Recursos Naturales Renovables",
      "Subsecretaria de Gestion Ambiental",
      "Subsecretaria de Proteccion y Bienestar Animal",
    ],
    "Departamento Administrativo de Gestion del Riesgo de Desastres": [
      "Subdireccion de Conocimiento y Gestion del Riesgo",
      "Subdireccion de Manejo de Desastres",
    ],
    "Gerencia de Corregimientos": ["Gerencia de Corregimientos"],
    "Gerencia Etnica": ["Gerencia Etnica"],
    "Gerencia del Centro y Territorios Estrategicos": ["Gerencia del Centro y Territorios Estrategicos"],
    "Secretaria Privada": ["Secretaria Privada"],
    "Secretaria de Suministros y Servicios": [
      "Subsecretaria de Gestion de Bienes",
      "Subsecretaria Ejecucion de la Contratacion",
      "Subsecretaria de Planeacion y Evaluacion",
      "Subsecretaria de Seleccion y Gestion de Proveedores",
    ],
  };

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

  const opcionesSecretaria = Object.keys(secretariasData).map((s) => ({
    value: s,
    label: s,
  }));

  const subsecretariasOptions = formData.secretaria
    ? secretariasData[formData.secretaria]?.map((ss) => ({
        value: ss,
        label: ss,
      })) || []
    : [];

  // 🔥 CAMBIO: protegemos que el value de subsecretaría esté en opciones
  const selectedSubsecretaria = subsecretariasOptions.find(
    (op) => op.value === formData.subsecretaria
  );

  const capitalizar = (texto) =>
    texto.toLowerCase().replace(/\b\w/g, (letra) => letra.toUpperCase());

  const soloNumeros = (texto) => texto.replace(/\D/g, "");

  const validarCorreo = (correo) => correo.includes("@");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let newValue = value;

    if (["nombre", "apellido"].includes(name)) {
      newValue = capitalizar(value);
    }

    if (name === "correo") newValue = value.toLowerCase();
    if (name === "cedula") newValue = soloNumeros(value).slice(0, 10);

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : newValue,
    });
  };

  const handleSecretariaChange = (selectedOption) => {
    setFormData({
      ...formData,
      secretaria: selectedOption?.value || "",
      subsecretaria: "", // 🔥 Reset subsecretaría
    });
  };

  const handleSubsecretariaChange = (selectedOption) => {
    setFormData({
      ...formData,
      subsecretaria: selectedOption?.value || "",
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
      alert(error.response?.data || "Error al enviar solicitud");
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
            <Select
              options={opcionesSecretaria}
              value={opcionesSecretaria.find(
                (op) => op.value === formData.secretaria
              )}
              onChange={handleSecretariaChange}
              isSearchable
              placeholder="Selecciona o escribe la Secretaría..."
            />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">Subsecretaría</label>
            <Select
              options={subsecretariasOptions}
              value={selectedSubsecretaria || null} // 🔥 CAMBIO
              onChange={handleSubsecretariaChange}
              isSearchable
              placeholder={
                formData.secretaria
                  ? "Selecciona la Subsecretaría..."
                  : "Selecciona primero una Secretaría"
              }
              isDisabled={!formData.secretaria}
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