import Modal from "../../components/Modal";
import ConfirmDialog from "../../components/ConfirmDialog";
import { BoxIcon, PlusIcon, AlertIcon, TrashIcon, CheckIcon, SettingsIcon } from "../../components/Icons";
import { useEstoqueContainer } from "./Container";
import "./style.css";

export default function Estoque() {
  const {
    produtos,
    servicos,
    erro,
    modalAberto,
    editandoId,
    form,
    produtoExcluir,
    excluindo,
    resumo,
    servicoConfigurando,
    produtosPadraoSelecionados,
    salvandoProdutosPadrao,
    abrirNovo,
    abrirEdicao,
    fecharModal,
    atualizarCampo,
    salvar,
    remover,
    setProdutoExcluir,
    abrirConfigurarProdutos,
    fecharConfigurarProdutos,
    alternarProdutoPadrao,
    atualizarQuantidadePadrao,
    salvarProdutosPadrao,
  } = useEstoqueContainer();

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="eyebrow">Controle de estoque</div>
          <h2>Produtos</h2>
          <div className="subtitle">Cadastre os produtos usados nos atendimentos e acompanhe o nível de estoque.</div>
        </div>
        <div className="page-actions">
          <button className="btn" onClick={abrirNovo}>
            <PlusIcon width={16} height={16} />
            Novo produto
          </button>
        </div>
      </div>

      <div className="stat-grid">
        <div className="stat-card">
          <span className="stat-label">Produtos cadastrados</span>
          <span className="stat-value">{resumo.total}</span>
        </div>
        <div className={`stat-card ${resumo.baixos > 0 ? "warn" : ""}`}>
          <span className="stat-label">Estoque baixo</span>
          <span className="stat-value">{resumo.baixos}</span>
        </div>
      </div>

      {erro && <div className="alert-error">{erro}</div>}

      <div className="card">
        <div className="card-head">
          <h3>Produtos cadastrados</h3>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Estoque</th>
                <th>Mínimo</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {produtos.length === 0 && (
                <tr>
                  <td colSpan={5}>
                    <div className="empty-row">
                      <BoxIcon width={28} height={28} style={{ opacity: 0.35, marginBottom: 8 }} />
                      <div>Nenhum produto cadastrado ainda.</div>
                      <button className="btn sm" style={{ marginTop: 12 }} onClick={abrirNovo}>
                        <PlusIcon width={14} height={14} />
                        Cadastrar o primeiro produto
                      </button>
                    </div>
                  </td>
                </tr>
              )}
              {produtos.map((p) => (
                <tr key={p.id}>
                  <td data-label="Nome">
                    <button type="button" className="link-like" onClick={() => abrirEdicao(p)}>{p.nome}</button>
                  </td>
                  <td data-label="Estoque">
                    <span className="cell-main">{p.quantidadeEstoque}</span>
                    <span className="cell-sub"> {p.unidade}</span>
                  </td>
                  <td data-label="Mínimo">{p.quantidadeMinima} {p.unidade}</td>
                  <td data-label="Status">
                    {p.estoqueBaixo ? (
                      <span className="badge cancelado">
                        <AlertIcon width={12} height={12} />
                        Estoque baixo
                      </span>
                    ) : (
                      <span className="badge concluido">OK</span>
                    )}
                  </td>
                  <td data-label="Ações">
                    <div className="row-actions">
                      <button className="btn secondary sm" onClick={() => abrirEdicao(p)}>Editar</button>
                      <button className="btn danger sm" onClick={() => setProdutoExcluir(p)}>
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

      <div className="card">
        <div className="card-head">
          <h3>Produtos padrão por serviço</h3>
          <span className="cell-sub">Pré-selecionados automaticamente ao iniciar um atendimento desse tipo</span>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Serviço</th>
                <th>Produtos padrão</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {servicos.length === 0 && (
                <tr>
                  <td colSpan={3}>
                    <div className="empty-row">Nenhum serviço cadastrado ainda.</div>
                  </td>
                </tr>
              )}
              {servicos.map((s) => (
                <tr key={s.id}>
                  <td data-label="Serviço"><span className="cell-main">{s.nome}</span></td>
                  <td data-label="Produtos padrão">
                    {s.produtosPadrao?.length > 0 ? (
                      s.produtosPadrao.map((p) => (
                        <span key={p.produtoId} className="cell-sub" style={{ display: "block" }}>
                          {p.produtoNome} × {p.quantidadePadrao}
                        </span>
                      ))
                    ) : (
                      <span className="cell-sub">Nenhum configurado</span>
                    )}
                  </td>
                  <td data-label="Ações">
                    <div className="row-actions">
                      <button className="btn secondary sm" onClick={() => abrirConfigurarProdutos(s)}>
                        <SettingsIcon width={13} height={13} />
                        Configurar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        open={modalAberto}
        onClose={fecharModal}
        title={editandoId ? "Editar produto" : "Novo produto"}
        subtitle="Produto usado nos atendimentos, com controle de estoque."
      >
        <form onSubmit={salvar}>
          <div className="form-section">
            <div className="form-section-title">Identificação</div>
            <div className="form-grid">
              <div className="field span-2">
                <label>Nome</label>
                <input value={form.nome} onChange={(e) => atualizarCampo("nome", e.target.value)} placeholder="Ex.: Shampoo Neutro" required />
              </div>
              <div className="field">
                <label>Unidade</label>
                <input value={form.unidade} onChange={(e) => atualizarCampo("unidade", e.target.value)} placeholder="un, ml, kg..." />
                <span className="hint">Como o produto é medido</span>
              </div>
            </div>
          </div>

          <div className="form-section">
            <div className="form-section-title">Controle de estoque</div>
            <div className="form-grid">
              <div className="field">
                <label>Quantidade em estoque</label>
                <input type="number" step="0.01" min="0" value={form.quantidadeEstoque}
                       onChange={(e) => atualizarCampo("quantidadeEstoque", e.target.value)} required />
              </div>
              <div className="field">
                <label>Quantidade mínima (alerta)</label>
                <input type="number" step="0.01" min="0" value={form.quantidadeMinima}
                       onChange={(e) => atualizarCampo("quantidadeMinima", e.target.value)} required />
                <span className="hint">Abaixo disso, o produto entra em alerta</span>
              </div>
            </div>
          </div>

          <div className="form-footer">
            <button type="submit" className="btn">
              <CheckIcon width={16} height={16} />
              {editandoId ? "Salvar alterações" : "Cadastrar produto"}
            </button>
            <button type="button" className="btn secondary" onClick={fecharModal}>Cancelar</button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!produtoExcluir}
        title="Excluir produto"
        description={produtoExcluir ? `Tem certeza que deseja excluir "${produtoExcluir.nome}"? Essa ação não pode ser desfeita.` : ""}
        confirmLabel="Excluir produto"
        loading={excluindo}
        onConfirm={remover}
        onClose={() => setProdutoExcluir(null)}
      />

      <Modal
        open={!!servicoConfigurando}
        onClose={fecharConfigurarProdutos}
        title="Produtos padrão do serviço"
        subtitle={servicoConfigurando ? servicoConfigurando.nome : ""}
      >
        {servicoConfigurando && (
          <form onSubmit={salvarProdutosPadrao}>
            <p style={{ color: "var(--text-muted)", marginBottom: 16 }}>
              Marque os produtos e a quantidade que costumam ser usados nesse tipo de serviço. Essa
              seleção é sugerida automaticamente ao iniciar um atendimento desse tipo, mas pode
              sempre ser ajustada na hora.
            </p>

            {produtos.length === 0 ? (
              <p className="hint">Nenhum produto cadastrado ainda.</p>
            ) : (
              <div className="produto-planejado-grid">
                {produtos.map((p) => {
                  const selecionado = produtosPadraoSelecionados[p.id] !== undefined;
                  return (
                    <label key={p.id} className={`produto-planejado-check ${selecionado ? "ativo" : ""}`}>
                      <input
                        type="checkbox"
                        checked={selecionado}
                        onChange={() => alternarProdutoPadrao(p.id)}
                      />
                      <span className="produto-planejado-nome">{p.nome}</span>
                      {selecionado && (
                        <input
                          type="number"
                          className="produto-planejado-qtd"
                          min="0.01"
                          step="0.01"
                          value={produtosPadraoSelecionados[p.id]}
                          onClick={(e) => e.preventDefault()}
                          onChange={(e) => atualizarQuantidadePadrao(p.id, e.target.value)}
                        />
                      )}
                    </label>
                  );
                })}
              </div>
            )}

            <div className="form-footer">
              <button type="submit" className="btn" disabled={salvandoProdutosPadrao}>
                <CheckIcon width={16} height={16} />
                {salvandoProdutosPadrao ? "Salvando..." : "Salvar"}
              </button>
              <button type="button" className="btn secondary" onClick={fecharConfigurarProdutos}>Cancelar</button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
