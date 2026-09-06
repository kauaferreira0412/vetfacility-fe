import { ChevronLeftIcon, ChevronRightIcon } from "../Icons";
import { useCalendarContainer } from "./Container";
import "./style.css";

export default function Calendar({
  mesAtual, diaSelecionado, agendamentosPorDia, expandido,
  onSelecionarDia, onMudarMes, onToggleExpandir, onHoje, onAbrirEvento,
}) {
  const { DIAS_SEMANA, MESES, semanasVisiveis, toKey, hora, eventosDoDia, classesDoDia } = useCalendarContainer({
    mesAtual, diaSelecionado, agendamentosPorDia, expandido,
  });

  return (
    <div className="calendar-card">
      <div className="calendar-toolbar">
        <div className="calendar-nav">
          <button className="cal-nav-btn" onClick={() => onMudarMes(-1)} aria-label="Mês anterior">
            <ChevronLeftIcon width={17} height={17} />
          </button>
          <div className="calendar-title">
            {MESES[mesAtual.getMonth()]} <span>{mesAtual.getFullYear()}</span>
          </div>
          <button className="cal-nav-btn" onClick={() => onMudarMes(1)} aria-label="Próximo mês">
            <ChevronRightIcon width={17} height={17} />
          </button>
        </div>
        <div className="calendar-actions">
          <button className="btn ghost sm" onClick={onHoje}>Hoje</button>
          <div className="calendar-view-toggle" role="group" aria-label="Visão do calendário">
            <button
              type="button"
              className={`calendar-view-btn ${!expandido ? "active" : ""}`}
              onClick={() => expandido && onToggleExpandir()}
            >
              Semana
            </button>
            <button
              type="button"
              className={`calendar-view-btn ${expandido ? "active" : ""}`}
              onClick={() => !expandido && onToggleExpandir()}
            >
              Mês
            </button>
          </div>
        </div>
      </div>

      <div className="calendar-weekdays">
        {DIAS_SEMANA.map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>

      <div className={`calendar-grid ${expandido ? "expandido" : "retraido"}`}>
        {semanasVisiveis.map((semana, i) => (
          <div className="calendar-week" key={i}>
            {semana.map((cell) => {
              const { key, visiveis, restante } = eventosDoDia(cell);
              return (
                <div key={key} className={classesDoDia(cell)} onClick={() => onSelecionarDia(key)}>
                  <div className="calendar-day-top">
                    <span className="calendar-day-number">{cell.date.getDate()}</span>
                  </div>
                  <div className="calendar-day-events">
                    {visiveis.map((a) => (
                      <button
                        type="button"
                        key={a.id}
                        className={`calendar-event status-${a.status.toLowerCase()}`}
                        title={`${a.animalNome} · ${hora(a.dataHora)} · ${a.servicoNome}`}
                        onClick={(e) => { e.stopPropagation(); onAbrirEvento(a); }}
                      >
                        <span className="calendar-event-dot" />
                        <span className="calendar-event-label">{a.animalNome} · {hora(a.dataHora)}</span>
                      </button>
                    ))}
                    {restante > 0 && (
                      <button
                        type="button"
                        className="calendar-event-more"
                        onClick={(e) => { e.stopPropagation(); onSelecionarDia(key); }}
                      >
                        +{restante} mais
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
