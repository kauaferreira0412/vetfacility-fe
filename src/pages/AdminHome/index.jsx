import { Link } from "react-router-dom";
import { ShieldIcon, BuildingIcon, KeyIcon } from "../../components/Icons";
import { useAdminHomeContainer } from "./Container";
import "./style.css";

export default function AdminHome() {
  const { user, empresas } = useAdminHomeContainer();

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="eyebrow">Plataforma</div>
          <h2>Administração</h2>
          <div className="subtitle">Você está logado como administrador da plataforma (ROOT), sem empresa vinculada.</div>
        </div>
      </div>

      <div className="card" style={{ display: "flex", gap: 18, alignItems: "flex-start", marginBottom: 18 }}>
        <div className="icon-tile" style={{ background: "var(--primary-tint)", color: "var(--primary-700)", width: 48, height: 48 }}>
          <ShieldIcon width={24} height={24} />
        </div>
        <div>
          <h3 style={{ marginBottom: 6 }}>Olá, {user?.nome}</h3>
          <p style={{ color: "var(--text-muted)", lineHeight: 1.6 }}>
            Como ROOT, você tem acesso a todas as telas do sistema (Agendamentos, Clientes, Animais, Estoque,
            Usuários e Perfis de acesso) de qualquer empresa cadastrada na plataforma. Use o seletor{" "}
            <strong>"Empresa"</strong> que aparece no topo de cada tela para escolher em qual empresa deseja
            pesquisar e cadastrar registros. Há {empresas.length} empresa(s) cadastrada(s) no momento.
          </p>
        </div>
      </div>

      <div className="stat-grid">
        <Link to="/empresas" className="card" style={{ display: "flex", gap: 14, alignItems: "center", textDecoration: "none" }}>
          <div className="icon-tile" style={{ background: "var(--accent-tint)", color: "var(--accent-600)", width: 42, height: 42 }}>
            <BuildingIcon width={20} height={20} />
          </div>
          <div>
            <h3 style={{ marginBottom: 2 }}>Empresas</h3>
            <span style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>Cadastrar novos negócios na plataforma.</span>
          </div>
        </Link>

        <Link to="/permissoes" className="card" style={{ display: "flex", gap: 14, alignItems: "center", textDecoration: "none" }}>
          <div className="icon-tile" style={{ background: "var(--success-tint)", color: "var(--success-600)", width: 42, height: 42 }}>
            <KeyIcon width={20} height={20} />
          </div>
          <div>
            <h3 style={{ marginBottom: 2 }}>Permissões e módulos</h3>
            <span style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>Cadastrar novas funcionalidades do catálogo.</span>
          </div>
        </Link>
      </div>
    </div>
  );
}
