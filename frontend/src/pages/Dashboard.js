import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button, Container } from "@mui/material";
import Laudos from "./Laudos";
import Pacientes from "./Pacientes";
import Usuarios from "./Usuarios";
import Modelos from "./Modelos";

function Dashboard() {
    return (
        <>
            <AppBar position="static" sx={{ mb: 4 }}>
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        MedType Dashboard
                    </Typography>
                    <Button color="inherit" component={Link} to="/laudos">
                        Laudos
                    </Button>
                    <Button color="inherit" component={Link} to="/pacientes">
                        Pacientes
                    </Button>
                    <Button color="inherit" component={Link} to="/usuarios">
                        Usuários
                    </Button>
                    <Button color="inherit" component={Link} to="/modelos">
                        Modelos
                    </Button>
                </Toolbar>
            </AppBar>

            <Container>
                <Routes>
                    <Route path="/laudos" element={<Laudos />} />
                    <Route path="/pacientes" element={<Pacientes />} />
                    <Route path="/usuarios" element={<Usuarios />} />
                    <Route path="/modelos" element={<Modelos />} />
                    <Route path="*" element={<Laudos />} />
                </Routes>
            </Container>
        </>
    );
}

export default Dashboard;
