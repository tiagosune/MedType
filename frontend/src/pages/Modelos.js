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
    Paper,
} from "@mui/material";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import jsPDF from "jspdf";
import api from "../services/api";
import ConfirmDialog from "../components/ConfirmDialog";
import NotificationSnackbar from "../components/NotificationSnackbar";

// Função para remover tags HTML e caracteres estranhos
function stripHtml(html) {
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
}

function Modelos() {
    const [modelos, setModelos] = useState([]);
    const [form, setForm] = useState({ id: null, titulo: "", conteudo: "" });
    const [editando, setEditando] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [modeloIdParaExcluir, setModeloIdParaExcluir] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

    useEffect(() => {
        carregarModelos();
    }, []);

    const carregarModelos = () => api.get("/modelos").then(res => setModelos(res.data));

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.titulo.trim() && !editando) {
            setSnackbar({ open: true, message: "O título não pode ficar vazio!", severity: "error" });
            return;
        }

        try {
            if (editando && form.id) {
                // Atualiza modelo existente
                await api.put(`/modelos/${form.id}`, {
                    titulo: form.titulo,
                    conteudo: form.conteudo
                });
                setSnackbar({ open: true, message: "Modelo atualizado com sucesso!", severity: "success" });
            } else {
                // Cria novo modelo
                await api.post("/modelos", {
                    titulo: form.titulo || "Sem título",
                    conteudo: form.conteudo
                });
                setSnackbar({ open: true, message: "Modelo cadastrado com sucesso!", severity: "success" });
            }

            resetForm();
            carregarModelos();
        } catch (error) {
            setSnackbar({ open: true, message: "Erro ao salvar modelo", severity: "error" });
            console.error(error);
        }
    };

    const editarModelo = (modelo) => {
        setForm({
            id: modelo.id,
            titulo: modelo.titulo || "",
            conteudo: modelo.conteudo || ""
        });
        setEditando(true);
    };

    const deletarModelo = (id) => {
        setModeloIdParaExcluir(id);
        setConfirmOpen(true);
    };

    const confirmarExclusao = () => {
        api
            .delete(`/modelos/${modeloIdParaExcluir}`)
            .then(() => {
                carregarModelos();
                setSnackbar({ open: true, message: "Modelo excluído com sucesso!", severity: "success" });
            })
            .catch(() => setSnackbar({ open: true, message: "Erro ao excluir modelo", severity: "error" }));
    };

    const resetForm = () => {
        setForm({ id: null, titulo: "", conteudo: "" });
        setEditando(false);
    };

    const salvarPDF = (modelo) => {
        const doc = new jsPDF();
        doc.text(`Modelo: ${modelo.titulo}`, 10, 10);
        doc.text("Conteúdo:", 10, 20);
        doc.text(stripHtml(modelo.conteudo), 10, 30, { maxWidth: 180 });
        doc.save(`modelo_${modelo.id}.pdf`);
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>Modelos</Typography>

            {/* Formulário */}
            <Paper sx={{ p: 3, mb: 4 }}>
                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    <TextField
                        label="Título"
                        name="titulo"
                        value={form.titulo}
                        onChange={handleChange}
                        fullWidth
                    />
                    <CKEditor
                        editor={ClassicEditor}
                        data={form.conteudo}
                        onChange={(event, editor) => setForm({ ...form, conteudo: editor.getData() })}
                    />
                    <div>
                        <Button type="submit" variant="contained" color="primary">
                            {editando ? "Atualizar Modelo" : "Cadastrar Modelo"}
                        </Button>
                        {editando && (
                            <Button variant="outlined" color="secondary" onClick={resetForm} sx={{ ml: 2 }}>
                                Cancelar
                            </Button>
                        )}
                    </div>
                </form>
            </Paper>

            {/* Lista de Modelos */}
            <Grid container spacing={3}>
                {modelos.map(modelo => (
                    <Grid item xs={12} sm={6} md={4} key={modelo.id}>
                        <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
                            <CardContent sx={{ flexGrow: 1 }}>
                                <Typography variant="h6" noWrap>{modelo.titulo}</Typography>
                                <Typography variant="body2" sx={{ mt: 1 }}>{stripHtml(modelo.conteudo).substring(0, 100)}...</Typography>
                            </CardContent>
                            <CardActions sx={{ mt: "auto", justifyContent: "flex-end" }}>
                                <Button size="small" onClick={() => editarModelo(modelo)}>Editar</Button>
                                <Button size="small" color="error" onClick={() => deletarModelo(modelo.id)}>Excluir</Button>
                                <Button size="small" color="success" onClick={() => salvarPDF(modelo)}>PDF</Button>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* ConfirmDialog e Snackbar */}
            <ConfirmDialog
                open={confirmOpen}
                title="Excluir modelo"
                message="Tem certeza que deseja excluir este modelo?"
                onConfirm={confirmarExclusao}
                onClose={() => setConfirmOpen(false)}
            />
            <NotificationSnackbar
                open={snackbar.open}
                message={snackbar.message}
                severity={snackbar.severity}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
            />
        </Container>
    );
}

export default Modelos;
