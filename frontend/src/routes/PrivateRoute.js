import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function PrivateRoute({ children }) {
    const { user } = useAuth(); // verifique se você tem um "user" ou "token" no contexto

    // Se não estiver logado, redireciona para login
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Se estiver logado, permite acessar a rota
    return children;
}
