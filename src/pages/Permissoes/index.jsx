import Modal from "../../components/Modal";
import ConfirmDialog from "../../components/ConfirmDialog";
import { KeyIcon, PlusIcon, CheckIcon, TrashIcon } from "../../components/Icons";
import { usePermissoesContainer } from "./Container";
import "./style.css";

export default function Permissoes() {
  const {
    erro,
    carregando,
    modalAberto,
    excluindo,
    removendo,
    form,
    grupos,
    modulosExistentes,
    abrirModal,
    fecharModal,
    atualizarCodigo,
    atualizarDescricao,
    atualizarModulo,
    salvar,
    confirmarRemocao,
    setExcluindo,
  } = usePermissoesContainer();

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="eyebrow">Plataforma · ROOT</div>
          <h2>Permissões e módulos</h2>
          <div className="subtitle">Catálogo de funcionalidades disponível para montar os perfis de acesso de cada empresa.</div>
        </div>
        <div className="page-actions">
          <button className="btn" onClick={abrirModal}>
            <PlusIcon width={16} height={16} />
            Nova permissão
          </button>
        </div>
      </div>

      {erro && <div className="alert-error">{erro}</div>}

      {grupos.length === 0 && (
        <div className="empty-state">
          <KeyIcon width={30} height={30} style={{ opacity: 0.35, marginBottom: 10 }} />
          <div>Nenhuma permissão cadastrada ainda.</div>
        </div>
      )}

      {grupos.map(([modulo, itens]) => (
        <div className="card" key={modulo} style={{ marginBottom: 18 }}>
          <div className="card-head">
            <h3>{modulo}</h3>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Descrição</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {itens.map((p) => (
                  <tr key={p.id}>
                    <td data-label="Código"><span className="cell-main">{p.codigo}</span></td>
                    <td data-label="Descrição">{p.descricao}</td>
                    <td data-label="Ações">
                      <div className="row-actions">
                        <button className="btn danger sm" onClick={() => setExcluindo(p)}>
                          <TrashIcon width={13} height={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}

      <Modal
        open={modalAberto}
        onClose={fecharModal}
        title="Nova permissão"
        subtitle="Adiciona uma funcionalidade ao catálogo do sistema."
      >
        <form onSubmit={salvar}>
          <div className="form-section">
            <div className="form-section-title">Identificação</div>
            <div className="form-grid">
              <div className="field span-2">
                <label>Código</label>
                <input
                  value={form.codigo}
                  onChange={(e) => atualizarCodigo(e.target.value)}
                  placeholder="Ex.: RELATORIO_VISUALIZAR"
                  pattern="[A-Z0-9_]{3,60}"
                  title="Apenas letras maiúsculas, números e underscore"
                  required
                />
                <span className="hint">Usado internamente para checar a permissão (maiúsculas e underscore).</span>
              </div>
              <div className="field span-2">
                <label>Descrição</label>
                <input value={form.descricao} onChange={(e) => atualizarDescricao(e.target.value)} placeholder="Ex.: Visualizar relatórios financeiros" required />
              </div>
              <div className="field span-2">
                <label>Modulo</label>
                <input
                  value={form.modulo}
                  onChange={(e) => atualizarModulo(e.target.value)}
                  placeholder="Ex.: RELATORIO"
                  list="modulos-existentes"
                  required
                />
                <datalist id="modulos-existentes">
                  {modulosExistentes.map((m) => <option key={m} value={m} />)}
                </datalist>
                <span className="hint">Agrupa a permissão na tela de Perfis. Um módulo novo aparece automaticamente ao ser usado aqui.</span>
              </div>
            </div>
          </div>

          {erro && <div className="alert-error">{erro}</div>}

          <div className="form-footer">
            <button type="submit" className="btn" disabled={carregando}>
              <CheckIcon width={16} height={16} />
              {carregando ? "Cadastrando..." : "Cadastrar permissão"}
            </button>
            <button type="button" className="btn secondary" onClick={fecharModal}>Cancelar</button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!excluindo}
        title="Remover permissão"
        description={excluindo ? `Tem certeza que deseja remover "${excluindo.codigo}"? Só é possível remover permissões que não estão atribuídas a nenhum perfil.` : ""}
        confirmLabel="Remover permissão"
        loading={removendo}
        onConfirm={confirmarRemocao}
        onClose={() => setExcluindo(null)}
      />
    </div>
  );
}
