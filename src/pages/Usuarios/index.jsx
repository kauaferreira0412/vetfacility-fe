import ConfirmDialog from "../../components/ConfirmDialog";
import { PlusIcon, UsersIcon, TrashIcon } from "../../components/Icons";
import { useUsuariosContainer } from "./Container";
import "./style.css";

export default function Usuarios() {
  const {
    usuarioLogadoId,
    podeGerenciar,
    usuarios,
    perfis,
    erro,
    mostrarForm,
    form,
    usuarioDesativar,
    desativando,
    atualizarCampo,
    alternarForm,
    convidar,
    setUsuarioDesativar,
    desativar,
  } = useUsuariosContainer();

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="eyebrow">Acesso</div>
          <h2>Usuários</h2>
          <div className="subtitle">Quem tem acesso ao sistema da sua empresa e com qual perfil.</div>
        </div>
        {podeGerenciar && (
          <div className="page-actions">
            <button className="btn" onClick={alternarForm}>
              <PlusIcon width={16} height={16} />
              Novo usuário
            </button>
          </div>
        )}
      </div>

      {erro && <div className="alert-error">{erro}</div>}

      {mostrarForm && podeGerenciar && (
        <div className="card">
          <div className="card-head">
            <h3>Convidar usuário</h3>
          </div>
          <form onSubmit={convidar}>
            <div className="form-section">
              <div className="form-section-title">Dados do usuário</div>
              <div className="form-grid">
                <div className="field">
                  <label>Nome</label>
                  <input value={form.nome} onChange={(e) => atualizarCampo("nome", e.target.value)} required />
                </div>
                <div className="field">
                  <label>E-mail</label>
                  <input type="email" value={form.email} onChange={(e) => atualizarCampo("email", e.target.value)} required />
                </div>
              </div>
            </div>

            <div className="form-section">
              <div className="form-section-title">Acesso</div>
              <div className="form-grid">
                <div className="field">
                  <label>Senha provisória</label>
                  <input type="password" minLength={6} value={form.senha} onChange={(e) => atualizarCampo("senha", e.target.value)} required />
                  <span className="hint">O usuário pode trocar depois do primeiro acesso</span>
                </div>
                <div className="field">
                  <label>Perfil de acesso</label>
                  <select value={form.perfilId} onChange={(e) => atualizarCampo("perfilId", e.target.value)} required>
                    <option value="">Selecione...</option>
                    {perfis.map((p) => (
                      <option key={p.id} value={p.id}>{p.nome}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="form-footer">
              <button type="submit" className="btn">Cadastrar usuário</button>
            </div>
          </form>
        </div>
      )}

      <div className="card">
        <div className="card-head">
          <h3>Usuários cadastrados</h3>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Nome</th>
                <th>E-mail</th>
                <th>Perfil</th>
                <th>Status</th>
                {podeGerenciar && <th></th>}
              </tr>
            </thead>
            <tbody>
              {usuarios.length === 0 && (
                <tr>
                  <td colSpan={podeGerenciar ? 5 : 4}>
                    <div className="empty-row">
                      <UsersIcon width={28} height={28} style={{ opacity: 0.35, marginBottom: 8 }} />
                      <div>Nenhum usuário encontrado.</div>
                    </div>
                  </td>
                </tr>
              )}
              {usuarios.map((u) => (
                <tr key={u.id}>
                  <td data-label="Nome"><span className="cell-main">{u.nome}</span></td>
                  <td data-label="E-mail">{u.email}</td>
                  <td data-label="Perfil"><span className="badge agendado">{u.perfilNome}</span></td>
                  <td data-label="Status">
                    {u.ativo ? (
                      <span className="badge concluido">Ativo</span>
                    ) : (
                      <span className="badge cancelado">Inativo</span>
                    )}
                  </td>
                  {podeGerenciar && (
                    <td data-label="Ações">
                      {u.ativo && u.id !== usuarioLogadoId && (
                        <div className="row-actions">
                          <button className="btn danger sm" onClick={() => setUsuarioDesativar(u)}>
                            <TrashIcon width={13} height={13} />
                            Desativar
                          </button>
                        </div>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmDialog
        open={!!usuarioDesativar}
        title="Desativar usuário"
        description={usuarioDesativar ? `Tem certeza que deseja desativar "${usuarioDesativar.nome}"? O acesso dessa pessoa ao sistema é revogado imediatamente.` : ""}
        confirmLabel="Desativar"
        loading={desativando}
        onConfirm={desativar}
        onClose={() => setUsuarioDesativar(null)}
      />
    </div>
  );
}
