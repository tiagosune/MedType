import { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api.js";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); // inicialmente null
    const navigate = useNavigate();

    // Inicializa o user a partir do token do localStorage
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            setUser({ token });
        }
    }, []);

    const login = async (username, password) => {
        try {
            const res = await api.post("/auth/login", { username, password });
            const token = res.data.token;

            localStorage.setItem("token", token);
            setUser({ token });

            navigate("/dashboard"); // redireciona após login
        } catch (err) {
            console.error("Erro ao fazer login:", err);
            alert("Login falhou! Verifique usuário e senha.");
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
        navigate("/login");
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
