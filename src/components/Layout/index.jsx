import { NavLink, Outlet } from "react-router-dom";
import EmpresaSelector from "../EmpresaSelector";
import { PawIcon, LogoutIcon, MenuIcon, ShieldIcon, ChevronLeftIcon } from "../Icons";
import { useLayoutContainer } from "./Container";
import "./style.css";

export default function Layout() {
  const {
    user,
    empresaAtiva,
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
  } = useLayoutContainer();

  return (
    <div className="app-shell">
      <div className={`sidebar-overlay ${menuOpen ? "open" : ""}`} onClick={fecharMenu} />

      <aside className={`sidebar ${menuOpen ? "open" : ""} ${colapsada ? "collapsed" : ""}`}>
        <button className="sidebar-collapse-btn" onClick={alternarColapso} title={colapsada ? "Expandir menu" : "Retrair menu"}>
          <ChevronLeftIcon width={14} height={14} className={colapsada ? "rotated" : ""} />
        </button>

        <div className="sidebar-brand">
          <div className="brand-mark">
            <PawIcon width={20} height={20} />
          </div>
          <div className="brand-text">
            <span className="brand-name">VetFacility</span>
            <span className="brand-sub">{user?.empresaNome || (user?.root ? "Administrador da plataforma" : "Gestão para banho e tosa")}</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          {links.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
              onClick={fecharMenu}
              title={colapsada ? label : undefined}
            >
              <Icon />
              <span className="nav-label">{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="avatar" title={colapsada ? user?.nome : undefined}>{initials}</div>
          <div className="who">
            <div className="name">{user?.nome}</div>
            <div className="role">{user?.perfilNome}</div>
          </div>
          <button className="icon-btn" onClick={handleLogout} title="Sair">
            <LogoutIcon width={17} height={17} />
          </button>
        </div>
      </aside>

      <div className={`main ${colapsada ? "sidebar-collapsed" : ""}`}>
        <div className="topbar-mobile">
          <button className="icon-btn" style={{ background: "var(--surface-alt)", color: "var(--primary-800)" }} onClick={abrirMenu}>
            <MenuIcon />
          </button>
          <div className="brand-inline">
            <PawIcon width={18} height={18} />
            VetFacility
          </div>
          <button className="icon-btn" style={{ background: "var(--surface-alt)", color: "var(--primary-800)" }} onClick={handleLogout}>
            <LogoutIcon width={16} height={16} />
          </button>
        </div>

        <div className="content">
          {!telaDePlataforma && <EmpresaSelector />}
          {bloquearPorFaltaDeEmpresa ? (
            <div className="empty-state empty-state-lg">
              <div className="empty-state-icon">
                <ShieldIcon width={34} height={34} />
              </div>
              <h3>Nenhuma empresa selecionada</h3>
              <p>Selecione uma empresa no seletor acima para visualizar e cadastrar registros nessa tela.</p>
            </div>
          ) : (
            <Outlet key={empresaAtiva?.id ?? "sem-empresa"} />
          )}
        </div>
      </div>
    </div>
  );
}
