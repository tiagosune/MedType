import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Pacientes from "./pages/Pacientes";
import Laudos from "./pages/Laudos";

function App() {
  return (
    <Router>
      <nav style={{ marginBottom: "20px" }}>
        <Link to="/pacientes" style={{ marginRight: "10px" }}>Pacientes</Link>
        <Link to="/laudos">Laudos</Link>
      </nav>

      <Routes>
        <Route path="/pacientes" element={<Pacientes />} />
        <Route path="/laudos" element={<Laudos />} />
      </Routes>
    </Router>
  );
}

export default App;
