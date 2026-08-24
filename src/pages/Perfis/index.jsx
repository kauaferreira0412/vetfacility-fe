import { PlusIcon, ShieldIcon, TrashIcon, CheckIcon } from "../../components/Icons";
import { usePerfisContainer } from "./Container";
import "./style.css";

const MODULO_LABEL = {
  ACESSO: "Acesso e equipe",
  CLIENTES: "Clientes e animais",
  AGENDAMENTO: "Agendamento",
  ESTOQUE: "Estoque",
  PLATAFORMA: "Plataforma",
};

export default function Perfis() {
  const {
    perfis,
    erro,
    mostrarForm,
    editandoId,
    form,
    permissoesPorModulo,
    alternarPermissao,
    atualizarNome,
    iniciarEdicao,
    iniciarCriacao,
    cancelar,
    salvar,
    remover,
  } = usePerfisContainer();

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="eyebrow">Acesso</div>
          <h2>Perfis de acesso</h2>
          <div className="subtitle">Defina exatamente o que cada perfil pode fazer no sistema, por funcionalidade.</div>
        </div>
        <div className="page-actions">
          <button className="btn" onClick={iniciarCriacao}>
            <PlusIcon width={16} height={16} />
            Novo perfil
          </button>
        </div>
      </div>

      {erro && <div className="alert-error">{erro}</div>}

      {mostrarForm && (
        <div className="card">
          <div className="card-head">
            <h3>{editandoId ? "Editar perfil" : "Novo perfil"}</h3>
          </div>
          <form onSubmit={salvar}>
            <div className="field" style={{ maxWidth: 340, marginBottom: 18 }}>
              <label>Nome do perfil</label>
              <input value={form.nome} onChange={(e) => atualizarNome(e.target.value)} placeholder="Ex.: Tosador, Recepção..." required />
            </div>

            {Object.entries(permissoesPorModulo).map(([modulo, lista]) => (
              <div className="form-section" key={modulo}>
                <div className="form-section-title">{MODULO_LABEL[modulo] || modulo}</div>
                <div className="perm-grid">
                  {lista.map((perm) => (
                    <label key={perm.id} className="perm-check">
                      <input
                        type="checkbox"
                        checked={form.permissaoIds.includes(perm.id)}
                        onChange={() => alternarPermissao(perm.id)}
                      />
                      {perm.descricao}
                    </label>
                  ))}
                </div>
              </div>
            ))}

            <div className="form-footer">
              <button type="submit" className="btn">
                <CheckIcon width={16} height={16} />
                Salvar perfil
              </button>
              <button type="button" className="btn secondary" onClick={cancelar}>Cancelar</button>
            </div>
          </form>
        </div>
      )}

      <div className="card">
        <div className="card-head">
          <h3>Perfis da empresa</h3>
        </div>
        {perfis.length === 0 && (
          <div className="empty-row">
            <ShieldIcon width={28} height={28} style={{ opacity: 0.35, marginBottom: 8 }} />
            <div>Nenhum perfil cadastrado ainda.</div>
          </div>
        )}
        <div style={{ display: "grid", gap: 14 }}>
          {perfis.map((p) => (
            <div key={p.id} className="perfil-card">
              <div className="perfil-card-head">
                <div className="perfil-card-name">
                  <ShieldIcon width={18} height={18} />
                  {p.nome}
                  {p.sistema && <span className="badge warn">Padrão do sistema</span>}
                </div>
                {!p.sistema && (
                  <div className="row-actions">
                    <button className="btn secondary sm" onClick={() => iniciarEdicao(p)}>Editar</button>
                    <button className="btn danger sm" onClick={() => remover(p.id)}>
                      <TrashIcon width={13} height={13} />
                      Remover
                    </button>
                  </div>
                )}
              </div>
              <div className="perfil-badges">
                {p.permissoes.map((perm) => (
                  <span key={perm.id} className="badge agendado">{perm.descricao}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
