import { useEffect, useState } from "react";
import api from "../services/api";

function Pacientes() {
  const [pacientes, setPacientes] = useState([]);
  const [form, setForm] = useState({
    nome: "",
    dataNascimento: "",
    cpf: "",
    telefone: "",
    email: ""
  });

  // Carregar pacientes ao abrir a tela
  useEffect(() => {
    carregarPacientes();
  }, []);

  const carregarPacientes = () => {
    api.get("/pacientes")
      .then(response => setPacientes(response.data))
      .catch(error => console.error("Erro ao buscar pacientes:", error));
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    api.post("/pacientes", form)
      .then(() => {
        setForm({ nome: "", dataNascimento: "", cpf: "", telefone: "", email: "" });
        carregarPacientes();
      })
      .catch(error => console.error("Erro ao cadastrar paciente:", error));
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Pacientes</h1>

      {/* Formulário de cadastro */}
      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <input
          type="text"
          name="nome"
          placeholder="Nome"
          value={form.nome}
          onChange={handleChange}
          required
        />
        <input
          type="date"
          name="dataNascimento"
          value={form.dataNascimento}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="cpf"
          placeholder="CPF"
          value={form.cpf}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="telefone"
          placeholder="Telefone"
          value={form.telefone}
          onChange={handleChange}
        />
        <input
          type="email"
          name="email"
          placeholder="E-mail"
          value={form.email}
          onChange={handleChange}
        />
        <button type="submit">Cadastrar</button>
      </form>

      {/* Lista de pacientes */}
      <ul>
        {pacientes.map(p => (
          <li key={p.id}>
            <strong>{p.nome}</strong> ({p.cpf}) - {p.email}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Pacientes;
