import { useEffect, useState } from "react";
import api from "../services/api";

function Pacientes() {
  const [pacientes, setPacientes] = useState([]);
  const [form, setForm] = useState({
    id: null,
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

    if (form.id) {
      // Atualizar paciente existente
      api.put(`/pacientes/${form.id}`, form)
        .then(() => {
          resetForm();
          carregarPacientes();
        })
        .catch(error => console.error("Erro ao atualizar paciente:", error));
    } else {
      // Criar novo paciente
      api.post("/pacientes", form)
        .then(() => {
          resetForm();
          carregarPacientes();
        })
        .catch(error => console.error("Erro ao cadastrar paciente:", error));
    }
  };

  const editarPaciente = (paciente) => {
    setForm(paciente);
  };

  const deletarPaciente = (id) => {
    if (window.confirm("Tem certeza que deseja excluir este paciente?")) {
      api.delete(`/pacientes/${id}`)
        .then(() => carregarPacientes())
        .catch(error => console.error("Erro ao excluir paciente:", error));
    }
  };

  const resetForm = () => {
    setForm({
      id: null,
      nome: "",
      dataNascimento: "",
      cpf: "",
      telefone: "",
      email: ""
    });
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Pacientes</h1>

      {/* Formulário de cadastro/edição */}
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
        <button type="submit">
          {form.id ? "Atualizar" : "Cadastrar"}
        </button>
        {form.id && (
          <button type="button" onClick={resetForm} style={{ marginLeft: "10px" }}>
            Cancelar
          </button>
        )}
      </form>

      {/* Lista de pacientes */}
      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Nome</th>
            <th>CPF</th>
            <th>E-mail</th>
            <th>Telefone</th>
            <th>Data Nasc.</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {pacientes.map(p => (
            <tr key={p.id}>
              <td>{p.nome}</td>
              <td>{p.cpf}</td>
              <td>{p.email}</td>
              <td>{p.telefone}</td>
              <td>{p.dataNascimento}</td>
              <td>
                <button onClick={() => editarPaciente(p)}>Editar</button>
                <button onClick={() => deletarPaciente(p.id)} style={{ marginLeft: "5px" }}>Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Pacientes;
