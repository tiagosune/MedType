import { useEffect, useState } from "react";
import {
    Container,
    Typography,
    Grid,
    Card,
    CardContent,
    CardActions,
    Button,
    TextField,
    MenuItem,
    Select,
    InputLabel,
    FormControl,
} from "@mui/material";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import jsPDF from "jspdf";
import api from "../services/api";

function Laudos() {
    const [laudos, setLaudos] = useState([]);
    const [pacientes, setPacientes] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [editando, setEditando] = useState(null);
    const [form, setForm] = useState({
        id: null,
        pacienteId: "",
        autorId: "",
        conteudo: "",
        status: "Rascunho",
    });

    useEffect(() => {
        carregarLaudos();
        carregarPacientes();
        carregarUsuarios();
    }, []);

    const carregarLaudos = () =>
        api.get("/laudos").then((res) => setLaudos(res.data));

    const carregarPacientes = () =>
        api.get("/pacientes").then((res) => setPacientes(res.data));

    const carregarUsuarios = () =>
        api.get("/usuarios").then((res) => setUsuarios(res.data));

    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = (e) => {
        e.preventDefault();
        const request = form.id
            ? api.put(`/laudos/${form.id}`, form)
            : api.post("/laudos", form);

        request.then(() => {
            resetForm();
            carregarLaudos();
        });
    };

    const editarLaudo = (laudo) => {
        setEditando(laudo.id);
        setForm({
            id: laudo.id,
            pacienteId: laudo.paciente.id,
            autorId: laudo.autor.id,
            conteudo: laudo.conteudo,
            status: laudo.status,
        });
    };

    const deletarLaudo = (id) => {
        if (window.confirm("Tem certeza que deseja excluir este laudo?")) {
            api.delete(`/laudos/${id}`).then(carregarLaudos);
        }
    };

    const resetForm = () => {
        setEditando(null);
        setForm({
            id: null,
            pacienteId: "",
            autorId: "",
            conteudo: "",
            status: "Rascunho",
        });
    };

    const salvarPDF = (laudo) => {
        const doc = new jsPDF();
        doc.text(`Laudo de ${laudo.paciente.nome}`, 10, 10);
        doc.text(`Autor: ${laudo.autor.username}`, 10, 20);
        doc.text(
            `Data: ${new Date(laudo.data).toLocaleDateString("pt-BR")}`,
            10,
            30
        );
        doc.text(`Status: ${laudo.status}`, 10, 40);
        doc.text("Conteúdo:", 10, 50);
        doc.text(laudo.conteudo, 10, 60, { maxWidth: 180 });
        doc.save(`laudo_${laudo.id}.pdf`);
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Laudos
            </Typography>

            {/* Formulário de criação/edição */}
            <form
                onSubmit={handleSubmit}
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "16px",
                    marginBottom: "24px",
                }}
            >
                <FormControl fullWidth>
                    <InputLabel>Paciente</InputLabel>
                    <Select
                        name="pacienteId"
                        value={form.pacienteId}
                        onChange={handleChange}
                        required
                    >
                        {pacientes.map((p) => (
                            <MenuItem key={p.id} value={p.id}>
                                {p.nome}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl fullWidth>
                    <InputLabel>Autor</InputLabel>
                    <Select
                        name="autorId"
                        value={form.autorId}
                        onChange={handleChange}
                        required
                    >
                        {usuarios.map((u) => (
                            <MenuItem key={u.id} value={u.id}>
                                {u.username}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <CKEditor
                    editor={ClassicEditor}
                    data={form.conteudo}
                    onChange={(event, editor) =>
                        setForm({ ...form, conteudo: editor.getData() })
                    }
                />

                <TextField
                    label="Status"
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    fullWidth
                />

                <div>
                    <Button type="submit" variant="contained" color="primary">
                        {form.id ? "Atualizar Laudo" : "Cadastrar Laudo"}
                    </Button>
                    {form.id && (
                        <Button
                            variant="outlined"
                            color="secondary"
                            onClick={resetForm}
                            sx={{ ml: 2 }}
                        >
                            Cancelar
                        </Button>
                    )}
                </div>
            </form>

            {/* Lista de laudos */}
            <Grid container spacing={3}>
                {laudos.map((laudo) => (
                    <Grid item xs={12} sm={6} md={4} key={laudo.id}>
                        <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
                            <CardContent sx={{ flexGrow: 1 }}>
                                <Typography variant="h6" noWrap>
                                    {laudo.paciente?.nome || "Paciente não encontrado"}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Autor: {laudo.autor?.username || "Desconhecido"}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Data: {new Date(laudo.data).toLocaleDateString("pt-BR")}
                                </Typography>
                                <Typography variant="body2" sx={{ mt: 1 }}>
                                    {laudo.conteudo.replace(/<[^>]+>/g, "").substring(0, 100)}...
                                </Typography>
                            </CardContent>
                            <CardActions sx={{ mt: "auto", justifyContent: "flex-end" }}>
                                <Button size="small" onClick={() => editarLaudo(laudo)}>
                                    Editar
                                </Button>
                                <Button
                                    size="small"
                                    color="error"
                                    onClick={() => deletarLaudo(laudo.id)}
                                >
                                    Excluir
                                </Button>
                                <Button
                                    size="small"
                                    color="success"
                                    onClick={() => salvarPDF(laudo)}
                                >
                                    PDF
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
}

export default Laudos;
