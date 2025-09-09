import ConfirmDialog from "../components/ConfirmDialog";
import NotificationSnackbar from "../components/NotificationSnackbar";
import { useEffect, useState } from "react";
import api from "../services/api.js"; // use o axios com interceptor JWT
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
import { useAuth } from "../context/AuthContext"; // para logout

function Pacientes() {
    const { logout } = useAuth();

    const [pacientes, setPacientes] = useState([]);
    const [form, setForm] = useState({
        id: null,
        nome: "",
        dataNascimento: "",
        cpf: "",
        telefone: "",
        email: "",
    });
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [pacienteIdParaExcluir, setPacienteIdParaExcluir] = useState(null);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success",
    });

    useEffect(() => {
        carregarPacientes();
    }, []);

    const carregarPacientes = () => {
        api.get("/pacientes")
            .then(res => setPacientes(res.data))
            .catch(() => {
                setSnackbar({ open: true, message: "Erro ao carregar pacientes", severity: "error" });
                logout(); // se token inválido, força logout
            });
    };

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = (e) => {
        e.preventDefault();
        const request = form.id
            ? api.put(`/pacientes/${form.id}`, form)
            : api.post("/pacientes", form);

        request
            .then(() => {
                resetForm();
                carregarPacientes();
                setSnackbar({
                    open: true,
                    message: form.id ? "Paciente atualizado!" : "Paciente cadastrado!",
                    severity: "success",
                });
            })
            .catch(() => setSnackbar({ open: true, message: "Erro ao salvar paciente", severity: "error" }));
    };

    const editarPaciente = (p) => setForm({
        id: p.id,
        nome: p.nome,
        dataNascimento: p.dataNascimento ? p.dataNascimento.split("T")[0] : "",
        cpf: p.cpf,
        telefone: p.telefone,
        email: p.email
    });

    const deletarPaciente = (id) => {
        setPacienteIdParaExcluir(id);
        setConfirmOpen(true);
    };

    const confirmarExclusao = () => {
        api.delete(`/pacientes/${pacienteIdParaExcluir}`)
            .then(() => {
                carregarPacientes();
                setSnackbar({ open: true, message: "Paciente excluído!", severity: "success" });
            })
            .catch(() => setSnackbar({ open: true, message: "Erro ao excluir paciente", severity: "error" }));
    };

    const resetForm = () => setForm({ id: null, nome: "", dataNascimento: "", cpf: "", telefone: "", email: "" });

    const formatarData = (data) => data ? new Date(data).toLocaleDateString("pt-BR") : "";

    return (
        <Container sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>Pacientes</Typography>

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
                            <Button variant="contained" color="primary" type="submit">{form.id ? "Atualizar" : "Cadastrar"}</Button>
                            {form.id && <Button variant="outlined" color="secondary" onClick={resetForm}>Cancelar</Button>}
                        </Grid>
                    </Grid>
                </form>
            </Paper>

            <Paper>
                <Table>
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
                        {pacientes.length > 0 ? pacientes.map((p) => (
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
                        )) : (
                            <TableRow>
                                <TableCell colSpan={6} align="center">Nenhum paciente encontrado</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </Paper>

            <ConfirmDialog open={confirmOpen} title="Excluir paciente" message="Tem certeza?" onConfirm={confirmarExclusao} onClose={() => setConfirmOpen(false)} />
            <NotificationSnackbar open={snackbar.open} message={snackbar.message} severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })} />
        </Container>
    );
}

export default Pacientes;
