import { useEffect, useState } from "react";
import {
    Container,
    Typography,
    Grid,
    Card,
    CardContent,
    CardActions,
    Button,
    MenuItem,
    Select,
    InputLabel,
    FormControl,
    Paper,
    Chip,
    TextField,
    Autocomplete
} from "@mui/material";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import html2pdf from "html2pdf.js";
import api from "../services/api";
import ConfirmDialog from "../components/ConfirmDialog";
import NotificationSnackbar from "../components/NotificationSnackbar";

function stripHtml(html) {
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
}

// Função para formatar a data corretamente
function formatarData(dataString) {
    if (!dataString) return "";
    const data = new Date(dataString + "T00:00:00"); // evita deslocamento de fuso horário
    const dia = String(data.getDate()).padStart(2, "0");
    const mes = String(data.getMonth() + 1).padStart(2, "0");
    const ano = data.getFullYear();
    return `${dia}/${mes}/${ano}`;
}

function Laudos() {
    const [laudos, setLaudos] = useState([]);
    const [pacientes, setPacientes] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [modelos, setModelos] = useState([]);
    const [form, setForm] = useState({
        id: null,
        pacienteId: "",
        autorId: "",
        conteudo: "",
        status: "Rascunho",
    });
    const [filtroPaciente, setFiltroPaciente] = useState(null);

    const [confirmOpen, setConfirmOpen] = useState(false);
    const [laudoIdParaExcluir, setLaudoIdParaExcluir] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
    const [editando, setEditando] = useState(false);

    // Carrega dados iniciais
    useEffect(() => {
        carregarLaudos();
        carregarPacientes();
        carregarUsuarios();
        carregarModelos();
    }, []);

    const carregarLaudos = () => {
        let url = "/laudos";
        if (filtroPaciente?.id) url += `/paciente/${filtroPaciente.id}`;
        api.get(url).then(res => setLaudos(res.data));
    };

    const carregarPacientes = () => api.get("/pacientes").then(res => setPacientes(res.data));
    const carregarUsuarios = () => api.get("/usuarios").then(res => setUsuarios(res.data));
    const carregarModelos = () => api.get("/modelos").then(res => setModelos(res.data));

    useEffect(() => {
        if (editando && pacientes.length && usuarios.length) {
            setForm(prev => ({
                ...prev,
                pacienteId: prev.pacienteId || pacientes[0].id,
                autorId: prev.autorId || usuarios[0].id,
            }));
        }
    }, [pacientes, usuarios, editando]);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const resetForm = () => {
        setForm(prev => ({
            id: null,
            pacienteId: prev.autorId || (usuarios.length ? usuarios[0].id : ""),
            autorId: prev.autorId || (usuarios.length ? usuarios[0].id : ""),
            conteudo: "",
            status: "Rascunho",
        }));
        setEditando(false);
    };

    const editarLaudo = (laudo) => {
        if (!laudo?.id) {
            setSnackbar({ open: true, message: "Laudo sem ID, não é possível editar!", severity: "error" });
            return;
        }

        setForm({
            id: laudo.id,
            pacienteId: laudo.paciente?.id || "",
            autorId: laudo.autor?.id || "",
            conteudo: laudo.conteudo || "",
            status: laudo.status || "Rascunho",
        });

        setEditando(true);
    };

    const atualizarLaudo = (e) => {
        e.preventDefault();
        if (!form.id) {
            setSnackbar({ open: true, message: "Laudo inválido!", severity: "error" });
            return;
        }
        api.put(`/laudos/${form.id}`, form)
            .then(() => {
                carregarLaudos();
                setSnackbar({ open: true, message: "Laudo atualizado com sucesso!", severity: "success" });
                resetForm();
            })
            .catch(() => setSnackbar({ open: true, message: "Erro ao atualizar laudo", severity: "error" }));
    };

    const cadastrarNovoLaudo = (e) => {
        e.preventDefault();
        api.post("/laudos", form)
            .then(() => {
                carregarLaudos();
                setSnackbar({ open: true, message: "Laudo cadastrado com sucesso!", severity: "success" });
                resetForm();
            })
            .catch(() => setSnackbar({ open: true, message: "Erro ao cadastrar laudo", severity: "error" }));
    };

    const deletarLaudo = (id) => {
        setLaudoIdParaExcluir(id);
        setConfirmOpen(true);
    };

    const confirmarExclusao = () => {
        api.delete(`/laudos/${laudoIdParaExcluir}`)
            .then(() => {
                carregarLaudos();
                setSnackbar({ open: true, message: "Laudo excluído com sucesso!", severity: "success" });
            })
            .catch(() => setSnackbar({ open: true, message: "Erro ao excluir laudo", severity: "error" }));
    };



    const salvarPDF = (laudo) => {
        function calcularIdade(dataNasc) {
            if (!dataNasc) return "?";
            const nascimento = new Date(dataNasc);
            const hoje = new Date();
            let idade = hoje.getFullYear() - nascimento.getFullYear();
            const m = hoje.getMonth() - nascimento.getMonth();
            if (m < 0 || (m === 0 && hoje.getDate() < nascimento.getDate())) idade--;
            return idade;
        }

        const container = document.createElement("div");
        container.style.fontFamily = "Arial, sans-serif";
        container.style.fontSize = "12px";
        container.style.lineHeight = "1.5";
        container.style.color = "#000";
        container.style.padding = "20px";

        container.innerHTML = `
        <!-- Cabeçalho -->
        <div style="display:flex; justify-content:space-between; margin-bottom:10px;">
            <div>
                <div><strong>Nome:</strong> ${laudo.paciente?.nome || "Paciente"}</div>
                <div><strong>Data de Nascimento:</strong> ${formatarData(laudo.paciente?.dataNascimento)} - ${calcularIdade(laudo.paciente?.dataNascimento)} anos</div>
            </div>
            <div>
                <strong>Data do Laudo:</strong> ${formatarData(laudo.data)}
            </div>
        </div>

        <!-- Linha separadora -->
        <hr style="border:1px solid #000; margin-bottom:20px;">

        <!-- Título centralizado -->
        <div style="text-align:center; font-weight:bold; font-size:16px; margin-bottom:20px;">
            ${laudo.modelo?.titulo || ""}
        </div>

        <!-- Conteúdo do laudo alinhado à esquerda -->
        <div style="text-align:left; margin-left:0; margin-right:0;">
            ${laudo.conteudo || ""}
        </div>

        <!-- Linha final opcional -->
        <hr style="border:1px solid #000; margin-top:20px;">
    `;

        const opt = {
            margin:       20,
            filename:     `laudo_${(laudo.paciente?.nome || "Paciente").replace(/[^a-zA-Z0-9]/g, "_")}_${formatarData(laudo.data).replace(/\//g, "-")}.pdf`,
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { scale: 2, letterRendering: true, useCORS: true },
            jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        html2pdf().set(opt).from(container).save();
    };



    return (
        <Container>
            <Typography variant="h4" gutterBottom>Laudos</Typography>

            {/* Filtro de pacientes */}
            <Autocomplete
                sx={{ mb: 3 }}
                options={pacientes}
                getOptionLabel={(option) => option.nome || ""}
                value={filtroPaciente || null}
                onChange={(event, newValue) => setFiltroPaciente(newValue)}
                isOptionEqualToValue={(option, value) => option.id === value?.id}
                renderInput={(params) => <TextField {...params} label="Filtrar por paciente" />}
                clearOnEscape
            />
            <Button variant="outlined" onClick={carregarLaudos} sx={{ mb: 3 }}>Filtrar</Button>

            <Paper sx={{ p: 3, mb: 4 }}>
                <form style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    <FormControl fullWidth>
                        <InputLabel>Paciente</InputLabel>
                        <Select
                            name="pacienteId"
                            value={form.pacienteId || ""}
                            onChange={handleChange}
                            required
                        >
                            {pacientes.map(p => <MenuItem key={p.id} value={p.id}>{p.nome}</MenuItem>)}
                        </Select>
                    </FormControl>

                    <FormControl fullWidth>
                        <InputLabel>Autor</InputLabel>
                        <Select
                            name="autorId"
                            value={form.autorId || ""}
                            onChange={handleChange}
                            required
                        >
                            {usuarios.map(u => <MenuItem key={u.id} value={u.id}>{u.username}</MenuItem>)}
                        </Select>
                    </FormControl>

                    <FormControl fullWidth>
                        <InputLabel>Modelo</InputLabel>
                        <Select
                            onChange={(e) => {
                                const modelo = modelos.find(m => m.id === e.target.value);
                                if (modelo) setForm({ ...form, conteudo: modelo.conteudo });
                            }}
                        >
                            {modelos.map(m => <MenuItem key={m.id} value={m.id}>{m.titulo}</MenuItem>)}
                        </Select>
                    </FormControl>

                    <CKEditor
                        key={form.id} // força recarregar ao editar
                        editor={ClassicEditor}
                        data={form.conteudo}
                        onChange={(event, editor) => setForm({ ...form, conteudo: editor.getData() })}
                    />

                    <FormControl fullWidth>
                        <InputLabel>Status</InputLabel>
                        <Select
                            name="status"
                            value={form.status || "Rascunho"}
                            onChange={handleChange}
                            required
                        >
                            <MenuItem value="Rascunho">Rascunho</MenuItem>
                            <MenuItem value="Finalizado">Finalizado</MenuItem>
                        </Select>
                    </FormControl>

                    <div style={{ display: "flex", gap: "16px", marginTop: "16px" }}>
                        {editando ? (
                            <>
                                <Button variant="contained" color="primary" onClick={atualizarLaudo}>Atualizar Laudo</Button>
                                <Button variant="outlined" color="success" onClick={cadastrarNovoLaudo}>Cadastrar Novo Laudo</Button>
                                <Button variant="outlined" color="error" onClick={resetForm}>Cancelar</Button>
                            </>
                        ) : (
                            <Button variant="contained" color="primary" onClick={cadastrarNovoLaudo}>Cadastrar Laudo</Button>
                        )}
                    </div>
                </form>
            </Paper>

            <Grid container spacing={3}>
                {laudos.map(laudo => (
                    <Grid item xs={12} sm={6} md={4} key={laudo.id}>
                        <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
                            <CardContent sx={{ flexGrow: 1 }}>
                                <Typography variant="h6" noWrap>{laudo.paciente?.nome || "Paciente não encontrado"}</Typography>
                                <Typography variant="body2" color="textSecondary">Autor: {laudo.autor?.username || "Desconhecido"}</Typography>
                                <Typography variant="body2" color="textSecondary">Data: {formatarData(laudo.data)}</Typography>
                                <Chip
                                    label={laudo.status}
                                    color={laudo.status === "Finalizado" ? "success" : "warning"}
                                    size="small"
                                    sx={{ mt: 1 }}
                                />
                                <Typography variant="body2" sx={{ mt: 1 }}>{stripHtml(laudo.conteudo).substring(0, 100)}...</Typography>
                            </CardContent>
                            <CardActions sx={{ mt: "auto", justifyContent: "space-between" }}>
                                <div>
                                    <Button size="small" onClick={() => editarLaudo(laudo)}>Editar</Button>
                                    <Button size="small" color="error" onClick={() => deletarLaudo(laudo.id)}>Excluir</Button>
                                </div>
                                <Button size="small" variant="contained" color="success" onClick={() => salvarPDF(laudo)}>PDF</Button>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <ConfirmDialog
                open={confirmOpen}
                title="Excluir laudo"
                message="Tem certeza que deseja excluir este laudo?"
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

export default Laudos;
