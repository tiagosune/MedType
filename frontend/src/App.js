import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Pacientes from "./pages/Pacientes";
import Laudos from "./pages/Laudos";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/pacientes" element={<Pacientes />} />
        <Route path="/laudos" element={<Laudos />} />
      </Routes>
    </Router>
  );
}

export default App;
