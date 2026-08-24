import Modal from "../../components/Modal";
import { BuildingIcon, PlusIcon, CheckIcon } from "../../components/Icons";
import { useEmpresasContainer } from "./Container";
import "./style.css";

export default function Empresas() {
  const { empresas, erro, carregando, modalAberto, form, abrirModal, fecharModal, atualizarCampo, salvar } = useEmpresasContainer();

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="eyebrow">Plataforma · ROOT</div>
          <h2>Empresas</h2>
          <div className="subtitle">Cadastre novos negócios (tenants) e o primeiro usuário de cada um.</div>
        </div>
        <div className="page-actions">
          <button className="btn" onClick={abrirModal}>
            <PlusIcon width={16} height={16} />
            Nova empresa
          </button>
        </div>
      </div>

      {erro && !modalAberto && <div className="alert-error">{erro}</div>}

      <div className="card">
        <div className="card-head">
          <h3>Empresas cadastradas</h3>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Nome</th>
                <th>ID</th>
              </tr>
            </thead>
            <tbody>
              {empresas.length === 0 && (
                <tr>
                  <td colSpan={2}>
                    <div className="empty-row">
                      <BuildingIcon width={28} height={28} style={{ opacity: 0.35, marginBottom: 8 }} />
                      <div>Nenhuma empresa cadastrada ainda.</div>
                    </div>
                  </td>
                </tr>
              )}
              {empresas.map((emp) => (
                <tr key={emp.id}>
                  <td data-label="Nome"><span className="cell-main">{emp.nome}</span></td>
                  <td data-label="ID"><span className="cell-sub">#{emp.id}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        open={modalAberto}
        onClose={fecharModal}
        title="Nova empresa"
        subtitle="Cria a empresa e o primeiro usuário (perfil Proprietário)."
      >
        <form onSubmit={salvar}>
          <div className="form-section">
            <div className="form-section-title">Empresa</div>
            <div className="form-grid">
              <div className="field span-2">
                <label>Nome da empresa</label>
                <input value={form.nomeEmpresa} onChange={(e) => atualizarCampo("nomeEmpresa", e.target.value)} placeholder="Ex.: Pet Shop Amigo Fiel" required />
              </div>
            </div>
          </div>

          <div className="form-section">
            <div className="form-section-title">Primeiro usuário (proprietário)</div>
            <div className="form-grid">
              <div className="field span-2">
                <label>Nome</label>
                <input value={form.nomeUsuario} onChange={(e) => atualizarCampo("nomeUsuario", e.target.value)} placeholder="Nome completo" required />
              </div>
              <div className="field">
                <label>E-mail</label>
                <input type="email" value={form.email} onChange={(e) => atualizarCampo("email", e.target.value)} placeholder="voce@empresa.com" required />
              </div>
              <div className="field">
                <label>Senha</label>
                <input type="password" value={form.senha} onChange={(e) => atualizarCampo("senha", e.target.value)} placeholder="Mínimo 6 caracteres" minLength={6} required />
              </div>
            </div>
          </div>

          {erro && <div className="alert-error">{erro}</div>}

          <div className="form-footer">
            <button type="submit" className="btn" disabled={carregando}>
              <CheckIcon width={16} height={16} />
              {carregando ? "Cadastrando..." : "Cadastrar empresa"}
            </button>
            <button type="button" className="btn secondary" onClick={fecharModal}>Cancelar</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
