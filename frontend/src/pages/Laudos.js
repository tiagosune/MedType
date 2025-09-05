import { useEffect, useState } from "react";
import api from "../services/api";

function Laudos() {
  const [laudos, setLaudos] = useState([]);

  useEffect(() => {
    api.get("/laudos")
      .then(response => {
        console.log("Laudos recebidos:", response.data);
        setLaudos(response.data);
      })
      .catch(error => console.error("Erro ao buscar laudos:", error));
  }, []);


  return (
    <div style={{ padding: "20px" }}>
      <h1>Laudos</h1>
      <ul>
        {laudos.map(l => (
          <li key={l.id}>
            <strong>{l.paciente?.nome}</strong> - {l.status} - {l.data}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Laudos;
