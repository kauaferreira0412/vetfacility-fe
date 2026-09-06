import Modal from "../../components/Modal";
import ConfirmDialog from "../../components/ConfirmDialog";
import DateField from "../../components/DateField";
import { WalletIcon, PlusIcon, TrashIcon, CheckIcon, ArrowUpIcon, ArrowDownIcon, DownloadIcon } from "../../components/Icons";
import { useFinanceiroContainer } from "./Container";
import "./style.css";

function formatarMoeda(valor) {
  return Number(valor || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function formatarData(data) {
  const [ano, mes, dia] = data.split("-");
  return `${dia}/${mes}/${ano}`;
}

const PRESETS = [
  { valor: "hoje", label: "Hoje" },
  { valor: "semana", label: "Últimos 7 dias" },
  { valor: "mes", label: "Este mês" },
  { valor: "personalizado", label: "Personalizado" },
];

export default function Financeiro() {
  const {
    podeGerenciar,
    preset,
    periodo,
    resultado,
    carregando,
    erro,
    modalAberto,
    tipoLancamento,
    form,
    movimentacaoExcluir,
    excluindo,
    baixandoPdf,
    selecionarPreset,
    atualizarPeriodoPersonalizado,
    abrirNovoGasto,
    abrirNovoGanho,
    fecharModal,
    atualizarCampo,
    salvarLancamento,
    remover,
    setMovimentacaoExcluir,
    baixarRelatorioPdf,
  } = useFinanceiroContainer();

  const resultadoPositivo = Number(resultado.resultado) >= 0;

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="eyebrow">Controle financeiro</div>
          <h2>Financeiro</h2>
          <div className="subtitle">Acompanhe os ganhos e gastos do negócio e o resultado do período.</div>
        </div>
        <div className="page-actions">
          <button className="btn secondary" onClick={baixarRelatorioPdf} disabled={baixandoPdf}>
            <DownloadIcon width={16} height={16} />
            {baixandoPdf ? "Gerando PDF..." : "Baixar PDF"}
          </button>
          {podeGerenciar && (
            <>
              <button className="btn secondary" onClick={abrirNovoGanho}>
                <PlusIcon width={16} height={16} />
                Lançar receita
              </button>
              <button className="btn" onClick={abrirNovoGasto}>
                <PlusIcon width={16} height={16} />
                Lançar gasto
              </button>
            </>
          )}
        </div>
      </div>

      <div className="periodo-filtro">
        {PRESETS.map((p) => (
          <button
            key={p.valor}
            className={`periodo-btn ${preset === p.valor ? "active" : ""}`}
            onClick={() => selecionarPreset(p.valor)}
            type="button"
          >
            {p.label}
          </button>
        ))}
        {preset === "personalizado" && (
          <div className="periodo-personalizado">
            <DateField className="sm" value={periodo.de} onChange={(e) => atualizarPeriodoPersonalizado("de", e.target.value)} />
            <span>até</span>
            <DateField className="sm" value={periodo.ate} onChange={(e) => atualizarPeriodoPersonalizado("ate", e.target.value)} />
          </div>
        )}
      </div>

      <div className="stat-grid">
        <div className="stat-card ganho">
          <span className="stat-label">Ganhos no período</span>
          <span className="stat-value">{formatarMoeda(resultado.totalGanhos)}</span>
        </div>
        <div className="stat-card gasto">
          <span className="stat-label">Gastos no período</span>
          <span className="stat-value">{formatarMoeda(resultado.totalGastos)}</span>
        </div>
        <div className={`stat-card ${resultadoPositivo ? "resultado-positivo" : "resultado-negativo"}`}>
          <span className="stat-label">Resultado (ganhos - gastos)</span>
          <span className="stat-value">{formatarMoeda(resultado.resultado)}</span>
        </div>
      </div>

      {erro && <div className="alert-error">{erro}</div>}

      <div className="card">
        <div className="card-head">
          <h3>Movimentações do período</h3>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Data</th>
                <th>Tipo</th>
                <th>Descrição</th>
                <th>Valor</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {!carregando && resultado.movimentacoes.length === 0 && (
                <tr>
                  <td colSpan={5}>
                    <div className="empty-row">
                      <WalletIcon width={28} height={28} style={{ opacity: 0.35, marginBottom: 8 }} />
                      <div>Nenhuma movimentação financeira nesse período.</div>
                    </div>
                  </td>
                </tr>
              )}
              {resultado.movimentacoes.map((m) => (
                <tr key={m.id}>
                  <td data-label="Data">{formatarData(m.data)}</td>
                  <td data-label="Tipo">
                    {m.tipo === "GANHO" ? (
                      <span className="badge concluido">
                        <ArrowUpIcon width={12} height={12} />
                        Ganho
                      </span>
                    ) : (
                      <span className="badge cancelado">
                        <ArrowDownIcon width={12} height={12} />
                        Gasto
                      </span>
                    )}
                  </td>
                  <td data-label="Descrição">
                    {m.descricao || (m.agendamentoId ? `Atendimento: ${m.servicoNome} - ${m.animalNome}` : "-")}
                  </td>
                  <td data-label="Valor">
                    <span className="cell-main">{formatarMoeda(m.valor)}</span>
                  </td>
                  <td data-label="Ações">
                    {podeGerenciar && (
                      <div className="row-actions">
                        <button className="btn danger sm" onClick={() => setMovimentacaoExcluir(m)}>
                          <TrashIcon width={13} height={13} />
                        </button>
                      </div>
                    )}
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
        title={tipoLancamento === "GANHO" ? "Lançar receita" : "Lançar gasto"}
        subtitle={tipoLancamento === "GANHO"
          ? "Registre um ganho do negócio, mesmo sem estar vinculado a um atendimento."
          : "Registre um gasto do negócio, mesmo sem estar vinculado a um atendimento."}
      >
        <form onSubmit={salvarLancamento}>
          <div className="form-section">
            <div className="form-grid">
              <div className="field span-2">
                <label>Descrição</label>
                <input value={form.descricao} onChange={(e) => atualizarCampo("descricao", e.target.value)}
                       placeholder={tipoLancamento === "GANHO" ? "Ex.: Venda de produto avulso" : "Ex.: Compra de shampoo"} maxLength={200} />
              </div>
              <div className="field">
                <label>Valor</label>
                <input type="number" step="0.01" min="0.01" value={form.valor}
                       onChange={(e) => atualizarCampo("valor", e.target.value)} required />
              </div>
              <div className="field">
                <label>Data</label>
                <DateField value={form.data} onChange={(e) => atualizarCampo("data", e.target.value)} />
              </div>
            </div>
          </div>

          <div className="form-footer">
            <button type="submit" className="btn">
              <CheckIcon width={16} height={16} />
              {tipoLancamento === "GANHO" ? "Lançar receita" : "Lançar gasto"}
            </button>
            <button type="button" className="btn secondary" onClick={fecharModal}>Cancelar</button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!movimentacaoExcluir}
        title="Remover movimentação"
        description={movimentacaoExcluir ? `Tem certeza que deseja remover essa movimentação de ${formatarMoeda(movimentacaoExcluir.valor)}? Essa ação não pode ser desfeita.` : ""}
        confirmLabel="Remover"
        loading={excluindo}
        onConfirm={remover}
        onClose={() => setMovimentacaoExcluir(null)}
      />
    </div>
  );
}
