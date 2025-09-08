import { useEffect, useState } from "react";
import api from "../services/api";
import {
  Container, TextField, Button, Table, TableHead, TableRow, TableCell,
  TableBody, Typography, Paper, Grid, FormControl, InputLabel, Select, MenuItem
} from "@mui/material";

function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [form, setForm] = useState({
    id: null, username: "", password: "", role: "ROLE_USER"
  });

  useEffect(() => {
    carregarUsuarios();
  }, []);

  const carregarUsuarios = () => {
    api.get("/usuarios")
      .then(res => setUsuarios(res.data))
      .catch(err => console.error("Erro ao buscar usuários:", err));
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    const request = form.id ? api.put(`/usuarios/${form.id}`, form) : api.post("/usuarios", form);
    request.then(() => { resetForm(); carregarUsuarios(); })
           .catch(err => console.error("Erro ao salvar usuário:", err));
  };

  const editarUsuario = (usuario) => setForm(usuario);

  const deletarUsuario = (id) => {
    if (window.confirm("Tem certeza que deseja excluir este usuário?")) {
      api.delete(`/usuarios/${id}`).then(carregarUsuarios);
    }
  };

  const resetForm = () => setForm({ id: null, username: "", password: "", role: "ROLE_USER" });

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Usuários</Typography>

      {/* Formulário */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={4}>
              <TextField
                label="Usuário"
                name="username"
                value={form.username}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Senha"
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel>Perfil</InputLabel>
                <Select name="role" value={form.role} label="Perfil" onChange={handleChange}>
                  <MenuItem value="ROLE_USER">Usuário</MenuItem>
                  <MenuItem value="ROLE_ADMIN">Administrador</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sx={{ display: "flex", gap: 1, mt: 1 }}>
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

      {/* Tabela de usuários */}
      <Table component={Paper}>
        <TableHead>
          <TableRow>
            <TableCell>Usuário</TableCell>
            <TableCell>Perfil</TableCell>
            <TableCell>Ações</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {usuarios.map(u => (
            <TableRow key={u.id}>
              <TableCell>{u.username}</TableCell>
              <TableCell>{u.role === "ROLE_ADMIN" ? "Administrador" : "Usuário"}</TableCell>
              <TableCell>
                <Button size="small" variant="outlined" onClick={() => editarUsuario(u)}>Editar</Button>
                <Button
                  size="small"
                  variant="outlined"
                  color="error"
                  sx={{ ml: 1 }}
                  onClick={() => deletarUsuario(u.id)}
                >
                  Excluir
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Container>
  );
}

export default Usuarios;
