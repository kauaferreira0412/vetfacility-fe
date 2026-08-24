import { Link } from "react-router-dom";
import { CalendarIcon, UsersIcon, PawIcon, BoxIcon, PlusIcon, AlertIcon } from "../../components/Icons";
import { BarChart, StatusBarList } from "../../components/Charts";
import { useDashboardContainer, STATUS_LABEL } from "./Container";
import "./style.css";

export default function Dashboard() {
  const {
    vePermissaoAgenda,
    vePermissaoClientes,
    vePermissaoAnimais,
    vePermissaoEstoque,
    clientes,
    animais,
    carregado,
    hojeKey,
    agendamentosHoje,
    proximosAgendamentos,
    produtosEstoqueBaixo,
    atendimentosPorDia,
    agendamentosPorStatus,
    agendamentos,
    primeiroNome,
  } = useDashboardContainer();

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="eyebrow">Visão geral</div>
          <h2>Olá, {primeiroNome || "tudo bem"}?</h2>
          <div className="subtitle">Resumo do seu negócio hoje, {new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "long" })}.</div>
        </div>
        <div className="page-actions">
          {vePermissaoAgenda && (
            <Link to="/agendamentos?novo=1" className="btn">
              <PlusIcon width={16} height={16} />
              Novo agendamento
            </Link>
          )}
        </div>
      </div>

      <div className="stat-grid">
        {vePermissaoAgenda && (
          <Link to="/agendamentos" className="stat-card" style={{ textDecoration: "none" }}>
            <span className="stat-label">Agendamentos hoje</span>
            <span className="stat-value">{agendamentosHoje.length}</span>
          </Link>
        )}
        {vePermissaoClientes && (
          <Link to="/clientes" className="stat-card" style={{ textDecoration: "none" }}>
            <span className="stat-label">Clientes cadastrados</span>
            <span className="stat-value">{clientes.length}</span>
          </Link>
        )}
        {vePermissaoAnimais && (
          <Link to="/animais" className="stat-card" style={{ textDecoration: "none" }}>
            <span className="stat-label">Animais cadastrados</span>
            <span className="stat-value">{animais.length}</span>
          </Link>
        )}
        {vePermissaoEstoque && (
          <Link to="/estoque" className={`stat-card ${produtosEstoqueBaixo.length > 0 ? "warn" : ""}`} style={{ textDecoration: "none" }}>
            <span className="stat-label">Estoque baixo</span>
            <span className="stat-value">{produtosEstoqueBaixo.length}</span>
          </Link>
        )}
      </div>

      {vePermissaoAgenda && (
        <div className="chart-row">
          <div className="card">
            <div className="card-head">
              <h3>Atendimentos nos últimos 7 dias</h3>
            </div>
            {agendamentos.length === 0 && carregado ? (
              <div className="empty-row">Sem atendimentos nesse período ainda.</div>
            ) : (
              <BarChart dados={atendimentosPorDia} />
            )}
          </div>

          <div className="card">
            <div className="card-head">
              <h3>Agendamentos por status</h3>
              <span className="cell-sub">últimos e próximos 7 dias</span>
            </div>
            <StatusBarList itens={agendamentosPorStatus} />
          </div>
        </div>
      )}

      <div className="dashboard-grid">
        {vePermissaoAgenda && (
          <div className="card">
            <div className="card-head">
              <h3>Próximos atendimentos</h3>
              <Link to="/agendamentos" className="link-like">Ver agenda</Link>
            </div>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Quando</th>
                    <th>Animal</th>
                    <th>Serviço</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {carregado && proximosAgendamentos.length === 0 && (
                    <tr>
                      <td colSpan={4}>
                        <div className="empty-row">
                          <CalendarIcon width={26} height={26} style={{ opacity: 0.35, marginBottom: 8 }} />
                          <div>Nenhum atendimento agendado para os próximos dias.</div>
                        </div>
                      </td>
                    </tr>
                  )}
                  {proximosAgendamentos.map((a) => {
                    const data = new Date(a.dataHora);
                    const ehHoje = a.dataHora.slice(0, 10) === hojeKey;
                    return (
                      <tr key={a.id}>
                        <td data-label="Quando">
                          <span className="cell-main">{ehHoje ? "Hoje" : data.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })}</span>
                          <span className="cell-sub"> {data.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}</span>
                        </td>
                        <td data-label="Animal">
                          <div className="cell-main">{a.animalNome}</div>
                          <div className="cell-sub">{a.clienteNome}</div>
                        </td>
                        <td data-label="Serviço">{a.servicoNome}</td>
                        <td data-label="Status">
                          <span className={`badge ${a.status.toLowerCase()}`}>{STATUS_LABEL[a.status]}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="dashboard-side">
          {vePermissaoEstoque && produtosEstoqueBaixo.length > 0 && (
            <div className="card">
              <div className="card-head">
                <h3>Alertas de estoque</h3>
                <Link to="/estoque" className="link-like">Ver estoque</Link>
              </div>
              <div className="alert-list">
                {produtosEstoqueBaixo.slice(0, 5).map((p) => (
                  <div className="alert-list-item" key={p.id}>
                    <AlertIcon width={15} height={15} />
                    <div>
                      <div className="cell-main">{p.nome}</div>
                      <div className="cell-sub">{p.quantidadeEstoque} {p.unidade} em estoque (mínimo {p.quantidadeMinima})</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="card">
            <div className="card-head">
              <h3>Atalhos rápidos</h3>
            </div>
            <div className="quick-links">
              {vePermissaoAgenda && (
                <Link to="/agendamentos?novo=1" className="quick-link">
                  <CalendarIcon width={17} height={17} />
                  Novo agendamento
                </Link>
              )}
              {vePermissaoClientes && (
                <Link to="/clientes?novo=1" className="quick-link">
                  <UsersIcon width={17} height={17} />
                  Novo cliente
                </Link>
              )}
              {vePermissaoAnimais && (
                <Link to="/animais?novo=1" className="quick-link">
                  <PawIcon width={17} height={17} />
                  Novo animal
                </Link>
              )}
              {vePermissaoEstoque && (
                <Link to="/estoque?novo=1" className="quick-link">
                  <BoxIcon width={17} height={17} />
                  Novo produto
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
