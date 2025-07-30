import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "bootstrap/dist/css/bootstrap.min.css";
import Formulario from "./Pages/Formulario.jsx";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ListadoSolicitudes from "./Pages/ListadoSolicitudes.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/Formulario" element={<Formulario />} />
        <Route path="/Listar" element={<ListadoSolicitudes />} />
      </Routes>
    </Router>
  </StrictMode>
);
