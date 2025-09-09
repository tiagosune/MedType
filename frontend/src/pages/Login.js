import { useState } from "react";
import { Container, TextField, Button, Typography, Paper } from "@mui/material";
import { useAuth } from "../context/AuthContext";

export default function Login() {
    const { login } = useAuth();
    const [form, setForm] = useState({ username: "", password: "" });
    const [error, setError] = useState("");

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setError("");
            await login(form.username, form.password);
        } catch {
            setError("Usuário ou senha inválidos");
        }
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 10 }}>
            <Paper sx={{ p: 4 }}>
                <Typography variant="h5" gutterBottom>Login</Typography>
                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    <TextField
                        label="Usuário"
                        name="username"
                        value={form.username}
                        onChange={handleChange}
                        required
                    />
                    <TextField
                        label="Senha"
                        type="password"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        required
                    />
                    {error && <Typography color="error">{error}</Typography>}
                    <Button type="submit" variant="contained" color="primary">Entrar</Button>
                </form>
            </Paper>
        </Container>
    );
}
