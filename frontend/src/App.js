import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Pacientes from "./pages/Pacientes";
import Laudos from "./pages/Laudos";
import "./App.css";

function App() {
  return (
    <Router>
      <nav className = "nav">
        <Link to="/pacientes" className="link">Pacientes</Link>
        <Link to="/laudos" className="link">Laudos</Link>
      </nav>

      <Routes>
        <Route path="/pacientes" element={<Pacientes />} />
        <Route path="/laudos" element={<Laudos />} />
      </Routes>
    </Router>
  );
}

export default App;
