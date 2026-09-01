import { Link } from "react-router-dom";
import Calendar from "../../components/Calendar";
import Modal from "../../components/Modal";
import { PlusIcon, CalendarIcon, CheckIcon, ClockIcon } from "../../components/Icons";
import { useAgendamentosContainer, STATUS_LABEL, formatarDuracao } from "./Container";
import "./style.css";

export default function Agendamentos() {
  const {
    mesAtual,
    diaSelecionado,
    calendarioExpandido,
    animais,
    servicos,
    usuarios,
    produtos,
    erro,
    modalAberto,
    detalhe,
    cancelando,
    motivoCancelamento,
    setMotivoCancelamento,
    erroCancelamento,
    iniciando,
    produtosSelecionados,
    agora,
    form,
    agendamentosPorDia,
    agendamentosDoDia,
    resumo,
    mudarMes,
    irParaHoje,
    selecionarDia,
    alternarExpandirCalendario,
    abrirModal,
    fecharModal,
    atualizarCampoForm,
    criarAgendamento,
    abrirIniciar,
    fecharIniciar,
    alternarProdutoSelecionado,
    atualizarQuantidadeProduto,
    confirmarIniciar,
    concluindo,
    valorCobrado,
    setValorCobrado,
    erroConcluir,
    abrirConcluir,
    fecharConcluir,
    confirmarConcluir,
    abrirCancelamento,
    fecharCancelamento,
    confirmarCancelamento,
    dataFormatada,
    dataFormatadaCurta,
    setDetalhe,
  } = useAgendamentosContainer();

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="eyebrow">Calendário</div>
          <h2>Agendamentos</h2>
          <div className="subtitle" style={{ textTransform: "capitalize" }}>{dataFormatada}</div>
        </div>
        <div className="page-actions">
          <button className="btn" onClick={abrirModal}>
            <PlusIcon width={16} height={16} />
            Novo agendamento
          </button>
        </div>
      </div>

      {erro && <div className="alert-error">{erro}</div>}

      <Calendar
        mesAtual={mesAtual}
        diaSelecionado={diaSelecionado}
        agendamentosPorDia={agendamentosPorDia}
        expandido={calendarioExpandido}
        onSelecionarDia={selecionarDia}
        onMudarMes={mudarMes}
        onToggleExpandir={alternarExpandirCalendario}
        onHoje={irParaHoje}
        onAbrirEvento={setDetalhe}
      />

      <div className="stat-grid">
        <div className="stat-card">
          <span className="stat-label">Atendimentos no dia</span>
          <span className="stat-value">{resumo.total}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Agendados</span>
          <span className="stat-value">{resumo.agendados}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Concluídos</span>
          <span className="stat-value">{resumo.concluidos}</span>
        </div>
      </div>

      <div className="card">
        <div className="card-head">
          <h3>Agenda do dia</h3>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Horário</th>
                <th>Cliente / Animal</th>
                <th>Serviço</th>
                <th>Executor</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {agendamentosDoDia.length === 0 && (
                <tr>
                  <td colSpan={6}>
                    <div className="empty-row">
                      <CalendarIcon width={28} height={28} style={{ opacity: 0.35, marginBottom: 8 }} />
                      <div>Nenhum agendamento para esse dia.</div>
                    </div>
                  </td>
                </tr>
              )}
              {agendamentosDoDia.map((a) => (
                <tr key={a.id} className="row-clicavel" onClick={() => setDetalhe(a)}>
                  <td data-label="Horário">
                    <span className="cell-main">
                      {new Date(a.dataHora).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </td>
                  <td data-label="Cliente / Animal">
                    <div className="cell-main">{a.animalNome}</div>
                    <div className="cell-sub">{a.clienteNome}</div>
                  </td>
                  <td data-label="Serviço">{a.servicoNome}</td>
                  <td data-label="Executor">{a.usuarioNome}</td>
                  <td data-label="Status">
                    <span className={`badge ${a.status.toLowerCase()}`}>{STATUS_LABEL[a.status]}</span>
                    {a.status === "EM_ATENDIMENTO" && (
                      <div className="contador-atendimento">
                        <ClockIcon width={12} height={12} />
                        {formatarDuracao(a.iniciadoEm, agora)}
                      </div>
                    )}
                  </td>
                  <td data-label="Ações">
                    {(a.status === "AGENDADO" || a.status === "EM_ATENDIMENTO") && (
                      <div className="row-actions" onClick={(e) => e.stopPropagation()}>
                        {a.status === "AGENDADO" && (
                          <button className="btn secondary sm" onClick={() => abrirIniciar(a)}>Iniciar</button>
                        )}
                        <button className="btn sm" onClick={() => abrirConcluir(a)}>Concluir</button>
                        <button className="btn secondary sm" onClick={() => abrirCancelamento(a)}>Cancelar</button>
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
        title="Novo agendamento"
        subtitle={`Para o dia ${dataFormatadaCurta}`}
      >
        {animais.length === 0 ? (
          <div>
            <p style={{ color: "var(--text-muted)", marginBottom: 16 }}>
              Nenhum animal cadastrado ainda. Cadastre um cliente e um animal antes de criar um agendamento.
            </p>
            <div className="form-footer" style={{ borderTop: "none", marginTop: 0, paddingTop: 0 }}>
              <Link to="/clientes" className="btn">Cadastrar cliente</Link>
              <Link to="/animais" className="btn secondary">Cadastrar animal</Link>
            </div>
          </div>
        ) : (
          <form onSubmit={criarAgendamento}>
            <div className="form-section">
              <div className="form-section-title">Quem será atendido</div>
              <div className="form-grid">
                <div className="field span-2">
                  <label>Animal</label>
                  <select value={form.animalId} onChange={(e) => atualizarCampoForm("animalId", e.target.value)} required>
                    <option value="">Selecione...</option>
                    {animais.map((a) => (
                      <option key={a.id} value={a.id}>{a.nome} ({a.clienteNome})</option>
                    ))}
                  </select>
                  <span className="hint">Não encontrou? <Link to="/animais">Cadastre um novo animal</Link>.</span>
                </div>
              </div>
            </div>

            <div className="form-section">
              <div className="form-section-title">Serviço e horário</div>
              <div className="form-grid">
                <div className="field">
                  <label>Serviço</label>
                  <select value={form.servicoId} onChange={(e) => atualizarCampoForm("servicoId", e.target.value)} required>
                    <option value="">Selecione...</option>
                    {servicos.map((s) => (
                      <option key={s.id} value={s.id}>{s.nome} ({s.duracaoMin} min)</option>
                    ))}
                  </select>
                </div>
                <div className="field">
                  <label>Horário</label>
                  <input type="time" value={form.hora} onChange={(e) => atualizarCampoForm("hora", e.target.value)} required />
                  <span className="hint">Dia: {dataFormatadaCurta}</span>
                </div>
              </div>
            </div>

            <div className="form-section">
              <div className="form-section-title">Execução</div>
              <div className="form-grid">
                <div className="field">
                  <label>Executor</label>
                  <select value={form.usuarioId} onChange={(e) => atualizarCampoForm("usuarioId", e.target.value)} required>
                    <option value="">Selecione...</option>
                    {usuarios.map((u) => (
                      <option key={u.id} value={u.id}>{u.nome}</option>
                    ))}
                  </select>
                </div>
                <div className="field">
                  <label>Observação</label>
                  <input value={form.observacao} onChange={(e) => atualizarCampoForm("observacao", e.target.value)} placeholder="Opcional" />
                </div>
              </div>
            </div>

            <div className="form-footer">
              <button type="submit" className="btn">
                <CheckIcon width={16} height={16} />
                Confirmar agendamento
              </button>
              <button type="button" className="btn secondary" onClick={fecharModal}>Cancelar</button>
            </div>
          </form>
        )}
      </Modal>

      <Modal
        open={!!detalhe}
        onClose={() => setDetalhe(null)}
        title={detalhe?.animalNome}
        subtitle={detalhe && new Date(detalhe.dataHora).toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "long" })}
      >
        {detalhe && (
          <div>
            <div className="detalhe-header">
              <span className="detalhe-hora">
                {new Date(detalhe.dataHora).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
              </span>
              <span className={`badge ${detalhe.status.toLowerCase()}`}>{STATUS_LABEL[detalhe.status]}</span>
            </div>

            {detalhe.status === "EM_ATENDIMENTO" && (
              <div className="atendimento-em-andamento">
                <div className="atendimento-em-andamento-contador">
                  <ClockIcon width={18} height={18} />
                  <span>{formatarDuracao(detalhe.iniciadoEm, agora)}</span>
                  <span className="atendimento-em-andamento-label">em atendimento</span>
                </div>
                {detalhe.produtosPlanejados?.length > 0 && (
                  <div className="atendimento-em-andamento-produtos">
                    <div className="atendimento-em-andamento-produtos-title">Produtos que serão usados</div>
                    <ul>
                      {detalhe.produtosPlanejados.map((p) => (
                        <li key={p.produtoId}>{p.produtoNome} <span className="cell-sub">× {p.quantidade}</span></li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            <dl className="detalhe-lista">
              <div>
                <dt>Cliente</dt>
                <dd>{detalhe.clienteNome}</dd>
              </div>
              <div>
                <dt>Serviço</dt>
                <dd>{detalhe.servicoNome}</dd>
              </div>
              <div>
                <dt>Executor</dt>
                <dd>{detalhe.usuarioNome}</dd>
              </div>
              {detalhe.observacao && (
                <div>
                  <dt>Observação</dt>
                  <dd>{detalhe.observacao}</dd>
                </div>
              )}
              {detalhe.status === "CANCELADO" && detalhe.motivoCancelamento && (
                <div>
                  <dt>Motivo do cancelamento</dt>
                  <dd>{detalhe.motivoCancelamento}</dd>
                </div>
              )}
            </dl>

            {(detalhe.status === "AGENDADO" || detalhe.status === "EM_ATENDIMENTO") && (
              <div className="form-footer">
                {detalhe.status === "AGENDADO" && (
                  <button className="btn secondary" onClick={() => abrirIniciar(detalhe)}>Iniciar atendimento</button>
                )}
                <button className="btn" onClick={() => abrirConcluir(detalhe)}>
                  <CheckIcon width={16} height={16} />
                  Concluir atendimento
                </button>
                <button className="btn secondary" onClick={() => abrirCancelamento(detalhe)}>Cancelar agendamento</button>
              </div>
            )}
          </div>
        )}
      </Modal>

      <Modal
        open={!!iniciando}
        onClose={fecharIniciar}
        title="Iniciar atendimento"
        subtitle={iniciando ? `${iniciando.animalNome} · ${new Date(iniciando.dataHora).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}` : ""}
      >
        {iniciando && (
          <form onSubmit={confirmarIniciar}>
            <p style={{ color: "var(--text-muted)", marginBottom: 16 }}>
              Marque os produtos que serão usados neste atendimento. O contador de tempo começa assim que
              você confirmar. Isso é só uma sinalização - a baixa no estoque acontece de fato ao concluir.
            </p>

            {produtos.length === 0 ? (
              <p className="hint">Nenhum produto cadastrado ainda. Você pode iniciar sem selecionar nenhum.</p>
            ) : (
              <div className="produto-planejado-grid">
                {produtos.map((p) => {
                  const selecionado = produtosSelecionados[p.id] !== undefined;
                  return (
                    <label key={p.id} className={`produto-planejado-check ${selecionado ? "ativo" : ""}`}>
                      <input
                        type="checkbox"
                        checked={selecionado}
                        onChange={() => alternarProdutoSelecionado(p.id)}
                      />
                      <span className="produto-planejado-nome">{p.nome}</span>
                      {selecionado && (
                        <input
                          type="number"
                          className="produto-planejado-qtd"
                          min="0.01"
                          step="0.01"
                          value={produtosSelecionados[p.id]}
                          onClick={(e) => e.preventDefault()}
                          onChange={(e) => atualizarQuantidadeProduto(p.id, e.target.value)}
                        />
                      )}
                    </label>
                  );
                })}
              </div>
            )}

            <div className="form-footer">
              <button type="submit" className="btn">
                <ClockIcon width={16} height={16} />
                Iniciar atendimento
              </button>
              <button type="button" className="btn secondary" onClick={fecharIniciar}>Cancelar</button>
            </div>
          </form>
        )}
      </Modal>

      <Modal
        open={!!cancelando}
        onClose={fecharCancelamento}
        title="Cancelar agendamento"
        subtitle={cancelando ? `${cancelando.animalNome} · ${new Date(cancelando.dataHora).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}` : ""}
      >
        {cancelando && (
          <form onSubmit={confirmarCancelamento}>
            <p style={{ color: "var(--text-muted)", marginBottom: 16 }}>
              Informe o motivo do cancelamento. Essa justificativa fica registrada no agendamento.
            </p>
            <div className="field">
              <label>Motivo do cancelamento</label>
              <textarea
                rows={3}
                value={motivoCancelamento}
                onChange={(e) => setMotivoCancelamento(e.target.value)}
                placeholder="Ex.: Cliente remarcou por telefone"
                maxLength={300}
                required
                autoFocus
              />
              <span className="hint">{motivoCancelamento.length}/300</span>
            </div>

            {erroCancelamento && <div className="alert-error">{erroCancelamento}</div>}

            <div className="form-footer">
              <button type="submit" className="btn danger">Confirmar cancelamento</button>
              <button type="button" className="btn secondary" onClick={fecharCancelamento}>Voltar</button>
            </div>
          </form>
        )}
      </Modal>

      <Modal
        open={!!concluindo}
        onClose={fecharConcluir}
        title="Concluir atendimento"
        subtitle={concluindo ? `${concluindo.animalNome} · ${concluindo.servicoNome}` : ""}
      >
        {concluindo && (
          <form onSubmit={confirmarConcluir}>
            <p style={{ color: "var(--text-muted)", marginBottom: 16 }}>
              Informe o valor cobrado pelo atendimento para registrar automaticamente o ganho no financeiro.
              Deixe em branco se preferir lançar depois.
            </p>
            <div className="field">
              <label>Valor cobrado (opcional)</label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={valorCobrado}
                onChange={(e) => setValorCobrado(e.target.value)}
                placeholder="Ex.: 80.00"
                autoFocus
              />
            </div>

            {erroConcluir && <div className="alert-error">{erroConcluir}</div>}

            <div className="form-footer">
              <button type="submit" className="btn">
                <CheckIcon width={16} height={16} />
                Concluir atendimento
              </button>
              <button type="button" className="btn secondary" onClick={fecharConcluir}>Cancelar</button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
