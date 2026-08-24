import { PawIcon, CalendarIcon, BoxIcon, CheckIcon } from "../../components/Icons";
import { useLoginContainer } from "./Container";
import "./style.css";

export default function Login() {
  const { erro, carregando, email, setEmail, senha, setSenha, handleLogin } = useLoginContainer();

  return (
    <div className="auth-page">
      <div className="auth-hero">
        <div className="hero-mark">
          <PawIcon width={26} height={26} />
        </div>
        <h1>Organize a rotina do seu petshop em um só lugar.</h1>
        <p>
          Agendamentos sem conflito de horário, controle de estoque com alerta automático e acesso
          individual e por permissão para cada pessoa da equipe.
        </p>

        <div className="hero-points">
          <div className="point">
            <span className="dot">
              <CalendarIcon width={15} height={15} />
            </span>
            Calendário compartilhado entre toda a equipe
          </div>
          <div className="point">
            <span className="dot">
              <BoxIcon width={15} height={15} />
            </span>
            Baixa automática de produtos a cada atendimento
          </div>
          <div className="point">
            <span className="dot">
              <CheckIcon width={15} height={15} />
            </span>
            Perfis de acesso customizáveis por funcionalidade
          </div>
        </div>
      </div>

      <div className="auth-form-side">
        <div className="auth-card">
          <h1>Bem-vindo de volta</h1>
          <p className="subtitle">Entre para acessar os agendamentos e o estoque do seu negócio.</p>

          {erro && <div className="alert-error">{erro}</div>}

          <form onSubmit={handleLogin}>
            <div className="field">
              <label>E-mail</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="voce@empresa.com" required />
            </div>
            <div className="field">
              <label>Senha</label>
              <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} placeholder="••••••••" required />
            </div>
            <button className="btn" type="submit" disabled={carregando}>
              {carregando ? "Entrando..." : "Entrar"}
            </button>
          </form>

          <p className="subtitle" style={{ marginTop: 20, fontSize: "0.8rem" }}>
            Novas empresas são cadastradas pelo administrador da plataforma. Fale com quem administra o
            seu VetFacility para receber um acesso.
          </p>
        </div>
      </div>
    </div>
  );
}
