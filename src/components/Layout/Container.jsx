import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { PawIcon, CalendarIcon, BoxIcon, ShieldIcon, UsersIcon, IdCardIcon, BuildingIcon, KeyIcon, HomeIcon, WalletIcon, SettingsIcon } from "../Icons";

function lerColapsoSalvo() {
  return localStorage.getItem("vetfacility_sidebar_collapsed") === "1";
}

const TELAS_PLATAFORMA = ["/admin", "/empresas", "/permissoes"];

export function useLayoutContainer() {
  const { user, logout, temPermissao, empresaAtiva, minhaEmpresa, precisaSelecionarEmpresa } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const telaDePlataforma = TELAS_PLATAFORMA.includes(location.pathname);
  const bloquearPorFaltaDeEmpresa = precisaSelecionarEmpresa && !telaDePlataforma;
  const [menuOpen, setMenuOpen] = useState(false);
  const [colapsada, setColapsada] = useState(lerColapsoSalvo);

  function handleLogout() {
    logout();
    navigate("/login");
  }

  function alternarColapso() {
    setColapsada((v) => {
      const novo = !v;
      localStorage.setItem("vetfacility_sidebar_collapsed", novo ? "1" : "0");
      return novo;
    });
  }

  function fecharMenu() {
    setMenuOpen(false);
  }

  function abrirMenu() {
    setMenuOpen(true);
  }

  const initials = (user?.nome || "?")
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const links = [
    user?.root && { to: "/admin", icon: ShieldIcon, label: "Administração" },
    user?.root && { to: "/empresas", icon: BuildingIcon, label: "Empresas" },
    user?.root && { to: "/permissoes", icon: KeyIcon, label: "Permissões e módulos" },
    !user?.root && { to: "/dashboard", icon: HomeIcon, label: "Dashboard" },
    temPermissao("AGENDAMENTO_VISUALIZAR") && { to: "/agendamentos", icon: CalendarIcon, label: "Agendamentos" },
    temPermissao("CLIENTE_VISUALIZAR") && { to: "/clientes", icon: UsersIcon, label: "Clientes" },
    temPermissao("ANIMAL_VISUALIZAR") && { to: "/animais", icon: PawIcon, label: "Animais" },
    temPermissao("PRODUTO_VISUALIZAR") && { to: "/estoque", icon: BoxIcon, label: "Estoque" },
    temPermissao("FINANCEIRO_VISUALIZAR") && { to: "/financeiro", icon: WalletIcon, label: "Financeiro" },
    (temPermissao("USUARIO_VISUALIZAR") || temPermissao("USUARIO_GERENCIAR")) && { to: "/usuarios", icon: IdCardIcon, label: "Usuários" },
    temPermissao("PERFIL_GERENCIAR") && { to: "/perfis", icon: ShieldIcon, label: "Perfis de acesso" },
    temPermissao("EMPRESA_PERSONALIZAR") && { to: "/configuracoes", icon: SettingsIcon, label: "Configurações" },
  ].filter(Boolean);

  return {
    user,
    empresaAtiva,
    minhaEmpresa,
    telaDePlataforma,
    bloquearPorFaltaDeEmpresa,
    menuOpen,
    colapsada,
    handleLogout,
    alternarColapso,
    fecharMenu,
    abrirMenu,
    initials,
    links,
  };
}
