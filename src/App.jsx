import { Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Agendamentos from "./pages/Agendamentos";
import Estoque from "./pages/Estoque";
import Usuarios from "./pages/Usuarios";
import Perfis from "./pages/Perfis";
import AdminHome from "./pages/AdminHome";
import Dashboard from "./pages/Dashboard";
import Clientes from "./pages/Clientes";
import Animais from "./pages/Animais";
import Empresas from "./pages/Empresas";
import Permissoes from "./pages/Permissoes";
import Financeiro from "./pages/Financeiro";
import Configuracoes from "./pages/Configuracoes";

function HomeRedirect() {
  const { user } = useAuth();
  return <Navigate to={user?.root ? "/admin" : "/dashboard"} replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/admin" element={<AdminHome />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/empresas" element={<Empresas />} />
          <Route path="/permissoes" element={<Permissoes />} />
          <Route path="/agendamentos" element={<Agendamentos />} />
          <Route path="/clientes" element={<Clientes />} />
          <Route path="/animais" element={<Animais />} />
          <Route path="/estoque" element={<Estoque />} />
          <Route path="/financeiro" element={<Financeiro />} />
          <Route path="/configuracoes" element={<Configuracoes />} />
          <Route path="/usuarios" element={<Usuarios />} />
          <Route path="/perfis" element={<Perfis />} />
        </Route>
        <Route
          path="*"
          element={
            <ProtectedRoute>
              <HomeRedirect />
            </ProtectedRoute>
          }
        />
      </Routes>
    </AuthProvider>
  );
}
