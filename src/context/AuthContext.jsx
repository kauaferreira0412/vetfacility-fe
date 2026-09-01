import { createContext, useContext, useEffect, useMemo, useState } from "react";
import api from "../api/client";

const AuthContext = createContext(null);

function lerEmpresaAtivaSalva() {
  const raw = localStorage.getItem("vetfacility_empresa_ativa");
  return raw ? JSON.parse(raw) : null;
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("vetfacility_token"));
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("vetfacility_user");
    return raw ? JSON.parse(raw) : null;
  });
  const [empresaAtiva, setEmpresaAtivaState] = useState(lerEmpresaAtivaSalva);
  const [empresas, setEmpresas] = useState([]);
  const [minhaEmpresa, setMinhaEmpresa] = useState(null);

  function setEmpresaAtiva(empresa) {
    setEmpresaAtivaState(empresa);
    if (empresa) {
      localStorage.setItem("vetfacility_empresa_ativa", JSON.stringify(empresa));
      localStorage.setItem("vetfacility_empresa_ativa_id", String(empresa.id));
    } else {
      localStorage.removeItem("vetfacility_empresa_ativa");
      localStorage.removeItem("vetfacility_empresa_ativa_id");
    }
  }

  async function carregarEmpresas() {
    const { data } = await api.get("/empresas");
    setEmpresas(data);
    return data;
  }

  async function carregarMinhaEmpresa() {
    const { data } = await api.get("/empresas/atual");
    setMinhaEmpresa(data);
    return data;
  }

  useEffect(() => {
    if (user?.root) {
      carregarEmpresas().catch(() => {});
    } else if (user) {
      carregarMinhaEmpresa().catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.root, user?.id]);

  async function login(email, senha) {
    const { data } = await api.post("/auth/login", { email, senha });
    localStorage.setItem("vetfacility_token", data.accessToken);
    localStorage.setItem("vetfacility_user", JSON.stringify(data.usuario));
    setToken(data.accessToken);
    setUser(data.usuario);
    if (!data.usuario.root) {
      setEmpresaAtiva(null);
    }
    return data;
  }

  function logout() {
    localStorage.removeItem("vetfacility_token");
    localStorage.removeItem("vetfacility_user");
    setToken(null);
    setUser(null);
    setEmpresaAtiva(null);
    setEmpresas([]);
    setMinhaEmpresa(null);
  }

  function temPermissao(codigo) {
    return !!user?.permissoes?.includes(codigo);
  }

  const value = useMemo(
    () => ({
      token, user, isAuthenticated: !!token, login, logout, temPermissao,
      empresaAtiva, setEmpresaAtiva, empresas, carregarEmpresas,
      minhaEmpresa, carregarMinhaEmpresa,
      precisaSelecionarEmpresa: !!user?.root && !empresaAtiva,
    }),
    [token, user, empresaAtiva, empresas, minhaEmpresa]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  return ctx;
}
