import { useEffect, useState } from "react";
import api from "../services/api";

function Pacientes() {
  const [pacientes, setPacientes] = useState([]);

  useEffect(() => {
    api.get("/pacientes")
      .then(response => setPacientes(response.data))
      .catch(error => console.error("Erro ao buscar pacientes:", error));
  }, []);

  return (
    <div>
      <h1>Pacientes</h1>
      <ul>
        {pacientes.map(p => (
          <li key={p.id}>{p.nome} - {p.email}</li>
        ))}
      </ul>
    </div>
  );
}

export default Pacientes;
