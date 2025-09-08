import { useEffect, useState } from "react";
import api from "../services/api";
import {
  Container,
  TextField,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
  Paper,
  Grid,
} from "@mui/material";

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

  useEffect(() => {
    carregarPacientes();
  }, []);

  const carregarPacientes = () => {
    api.get("/pacientes")
      .then((res) => setPacientes(res.data))
      .catch((err) => console.error("Erro ao buscar pacientes:", err));
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const request = form.id
      ? api.put(`/pacientes/${form.id}`, form)
      : api.post("/pacientes", form);

    request.then(() => {
      resetForm();
      carregarPacientes();
    }).catch((err) => console.error("Erro ao salvar paciente:", err));
  };

  const editarPaciente = (p) => setForm(p);

  const deletarPaciente = (id) => {
    if (window.confirm("Deseja excluir este paciente?")) {
      api.delete(`/pacientes/${id}`).then(carregarPacientes);
    }
  };

  const resetForm = () => {
    setForm({ id: null, nome: "", dataNascimento: "", cpf: "", telefone: "", email: "" });
  };

  const formatarData = (data) => {
    if (!data) return "";
    return new Date(data).toLocaleDateString("pt-BR");
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Pacientes</Typography>

      {/* Formulário */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={3}>
              <TextField label="Nome" name="nome" fullWidth value={form.nome} onChange={handleChange} required />
            </Grid>
            <Grid item xs={12} sm={2}>
              <TextField
                type="date"
                label="Data Nasc."
                name="dataNascimento"
                InputLabelProps={{ shrink: true }}
                fullWidth
                value={form.dataNascimento}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <TextField label="CPF" name="cpf" fullWidth value={form.cpf} onChange={handleChange} required />
            </Grid>
            <Grid item xs={12} sm={2}>
              <TextField label="Telefone" name="telefone" fullWidth value={form.telefone} onChange={handleChange} />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField label="Email" name="email" fullWidth value={form.email} onChange={handleChange} />
            </Grid>
            <Grid item xs={12} sm={12} sx={{ display: "flex", gap: 1, mt: 1 }}>
              <Button variant="contained" color="primary" type="submit">
                {form.id ? "Atualizar" : "Cadastrar"}
              </Button>
              {form.id && (
                <Button variant="outlined" color="secondary" onClick={resetForm}>
                  Cancelar
                </Button>
              )}
            </Grid>
          </Grid>
        </form>
      </Paper>

      {/* Tabela */}
      <Table component={Paper}>
        <TableHead>
          <TableRow>
            <TableCell>Nome</TableCell>
            <TableCell>CPF</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Telefone</TableCell>
            <TableCell>Data Nasc.</TableCell>
            <TableCell>Ações</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {pacientes.map(p => (
            <TableRow key={p.id}>
              <TableCell>{p.nome}</TableCell>
              <TableCell>{p.cpf}</TableCell>
              <TableCell>{p.email}</TableCell>
              <TableCell>{p.telefone}</TableCell>
              <TableCell>{formatarData(p.dataNascimento)}</TableCell>
              <TableCell>
                <Button size="small" onClick={() => editarPaciente(p)}>Editar</Button>
                <Button size="small" color="error" sx={{ ml: 1 }} onClick={() => deletarPaciente(p.id)}>Excluir</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Container>
  );
}

export default Pacientes;
