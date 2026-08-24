import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export function useLoginContainer() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  async function handleLogin(e) {
    e.preventDefault();
    setErro("");
    setCarregando(true);
    try {
      const data = await login(email, senha);
      navigate(data.usuario.root ? "/admin" : "/dashboard");
    } catch (err) {
      setErro(err?.response?.data?.message || "Não foi possível entrar. Confira e-mail e senha.");
    } finally {
      setCarregando(false);
    }
  }

  return { erro, carregando, email, setEmail, senha, setSenha, handleLogin };
}
