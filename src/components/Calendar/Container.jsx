import { useMemo } from "react";

const DIAS_SEMANA = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];
const MESES = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

function toKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function hora(dataHora) {
  return new Date(dataHora).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

function buildMonthMatrix(anchor) {
  const year = anchor.getFullYear();
  const month = anchor.getMonth();
  const firstOfMonth = new Date(year, month, 1);
  const startOffset = (firstOfMonth.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const diasAnteriores = Array.from({ length: startOffset }, (_, idx) => ({
    date: new Date(year, month - 1, daysInPrevMonth - startOffset + 1 + idx),
    fora: true,
  }));
  const diasDoMes = Array.from({ length: daysInMonth }, (_, idx) => ({
    date: new Date(year, month, idx + 1),
    fora: false,
  }));

  const cells = [...diasAnteriores, ...diasDoMes];
  while (cells.length % 7 !== 0) {
    const last = cells[cells.length - 1].date;
    const next = new Date(last);
    next.setDate(next.getDate() + 1);
    cells.push({ date: next, fora: true });
  }

  return Array.from({ length: Math.ceil(cells.length / 7) }, (_, i) => cells.slice(i * 7, i * 7 + 7));
}

export function useCalendarContainer({ mesAtual, diaSelecionado, agendamentosPorDia, expandido }) {
  const semanas = useMemo(() => buildMonthMatrix(mesAtual), [mesAtual]);
  const hojeKey = toKey(new Date());
  const selecionadoKey = diaSelecionado;
  const maxEventos = expandido ? 3 : 4;

  const semanasVisiveis = expandido
    ? semanas
    : semanas.filter((semana) => semana.some((c) => toKey(c.date) === selecionadoKey));

  function eventosDoDia(cell) {
    const key = toKey(cell.date);
    const eventos = agendamentosPorDia[key] || [];
    const visiveis = eventos.slice(0, maxEventos);
    const restante = eventos.length - visiveis.length;
    return { key, visiveis, restante };
  }

  function classesDoDia(cell) {
    const key = toKey(cell.date);
    return [
      "calendar-day",
      cell.fora ? "fora" : "",
      key === hojeKey ? "hoje" : "",
      key === selecionadoKey ? "selecionado" : "",
    ].filter(Boolean).join(" ");
  }

  return { DIAS_SEMANA, MESES, semanasVisiveis, toKey, hora, eventosDoDia, classesDoDia };
}
