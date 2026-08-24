import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../../api/client";

export const STATUS_LABEL = { AGENDADO: "Agendado", EM_ATENDIMENTO: "Em atendimento", CONCLUIDO: "Concluído", CANCELADO: "Cancelado" };

function toKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function inicioFimMesVisivel(mesAtual) {
  const primeiro = new Date(mesAtual.getFullYear(), mesAtual.getMonth(), 1);
  const offset = (primeiro.getDay() + 6) % 7;
  const inicio = new Date(primeiro);
  inicio.setDate(inicio.getDate() - offset);

  const ultimo = new Date(mesAtual.getFullYear(), mesAtual.getMonth() + 1, 0);
  const fimOffset = 6 - ((ultimo.getDay() + 6) % 7);
  const fim = new Date(ultimo);
  fim.setDate(fim.getDate() + fimOffset);

  return { inicio: toKey(inicio), fim: toKey(fim) };
}

const formVazio = { animalId: "", servicoId: "", usuarioId: "", hora: "09:00", observacao: "" };

export function useAgendamentosContainer() {
  const hoje = useMemo(() => new Date(), []);
  const [mesAtual, setMesAtual] = useState(() => new Date(hoje.getFullYear(), hoje.getMonth(), 1));
  const [diaSelecionado, setDiaSelecionado] = useState(() => toKey(hoje));
  const [calendarioExpandido, setCalendarioExpandido] = useState(false);

  const [todosAgendamentosDoMes, setTodosAgendamentosDoMes] = useState([]);
  const [animais, setAnimais] = useState([]);
  const [servicos, setServicos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [erro, setErro] = useState("");
  const [modalAberto, setModalAberto] = useState(false);
  const [detalhe, setDetalhe] = useState(null);
  const [cancelando, setCancelando] = useState(null);
  const [motivoCancelamento, setMotivoCancelamento] = useState("");
  const [erroCancelamento, setErroCancelamento] = useState("");

  const [form, setForm] = useState(formVazio);
  const [searchParams, setSearchParams] = useSearchParams();

  async function carregarTudo() {
    setErro("");
    const { inicio, fim } = inicioFimMesVisivel(mesAtual);
    const [ag, ani, srv, usr] = await Promise.allSettled([
      api.get(`/agendamentos`, { params: { de: inicio, ate: fim } }),
      api.get(`/animais`),
      api.get(`/servicos`),
      api.get(`/usuarios`),
    ]);

    if (ag.status === "fulfilled") setTodosAgendamentosDoMes(ag.value.data);
    else setErro("Não foi possível carregar a agenda.");
    if (ani.status === "fulfilled") setAnimais(ani.value.data);
    if (srv.status === "fulfilled") setServicos(srv.value.data);
    setUsuarios(usr.status === "fulfilled" ? usr.value.data : []);
  }

  useEffect(() => {
    carregarTudo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mesAtual]);

  const agendamentosPorDia = useMemo(() => {
    const mapa = {};
    todosAgendamentosDoMes.forEach((a) => {
      const key = a.dataHora.slice(0, 10);
      (mapa[key] ||= []).push(a);
    });
    Object.keys(mapa).forEach((key) => mapa[key].sort((a, b) => a.dataHora.localeCompare(b.dataHora)));
    return mapa;
  }, [todosAgendamentosDoMes]);

  const agendamentosDoDia = useMemo(
    () => todosAgendamentosDoMes
      .filter((a) => a.dataHora.slice(0, 10) === diaSelecionado)
      .sort((a, b) => a.dataHora.localeCompare(b.dataHora)),
    [todosAgendamentosDoMes, diaSelecionado]
  );

  const resumo = useMemo(() => {
    const total = agendamentosDoDia.length;
    const concluidos = agendamentosDoDia.filter((a) => a.status === "CONCLUIDO").length;
    const agendados = agendamentosDoDia.filter((a) => a.status === "AGENDADO").length;
    return { total, concluidos, agendados };
  }, [agendamentosDoDia]);

  function mudarMes(delta) {
    setMesAtual((m) => new Date(m.getFullYear(), m.getMonth() + delta, 1));
  }

  function irParaHoje() {
    const t = new Date();
    setMesAtual(new Date(t.getFullYear(), t.getMonth(), 1));
    setDiaSelecionado(toKey(t));
  }

  function selecionarDia(key) {
    setDiaSelecionado(key);
    const [y, m] = key.split("-").map(Number);
    if (y !== mesAtual.getFullYear() || m - 1 !== mesAtual.getMonth()) {
      setMesAtual(new Date(y, m - 1, 1));
    }
  }

  function alternarExpandirCalendario() {
    setCalendarioExpandido((v) => !v);
  }

  function abrirModal() {
    setForm(formVazio);
    setModalAberto(true);
  }

  function fecharModal() {
    setModalAberto(false);
  }

  useEffect(() => {
    if (searchParams.get("novo") === "1") {
      abrirModal();
      setSearchParams({}, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function atualizarCampoForm(campo, valor) {
    setForm((f) => ({ ...f, [campo]: valor }));
  }

  async function criarAgendamento(e) {
    e.preventDefault();
    setErro("");
    try {
      const dataHora = `${diaSelecionado}T${form.hora}:00`;
      await api.post("/agendamentos", {
        animalId: Number(form.animalId),
        servicoId: Number(form.servicoId),
        usuarioId: Number(form.usuarioId),
        dataHora,
        observacao: form.observacao,
      });
      setModalAberto(false);
      carregarTudo();
    } catch (err) {
      setErro(err?.response?.data?.message || "Não foi possível criar o agendamento.");
    }
  }

  async function iniciar(id) {
    await api.post(`/agendamentos/${id}/iniciar`);
    setDetalhe(null);
    carregarTudo();
  }

  async function concluir(id) {
    await api.post(`/agendamentos/${id}/concluir`, { produtosConsumidos: [] });
    setDetalhe(null);
    carregarTudo();
  }

  function abrirCancelamento(a) {
    setErroCancelamento("");
    setMotivoCancelamento("");
    setCancelando(a);
  }

  function fecharCancelamento() {
    setCancelando(null);
  }

  async function confirmarCancelamento(e) {
    e.preventDefault();
    if (!cancelando) return;
    setErroCancelamento("");
    try {
      await api.post(`/agendamentos/${cancelando.id}/cancelar`, { motivo: motivoCancelamento });
      setCancelando(null);
      setDetalhe(null);
      carregarTudo();
    } catch (err) {
      setErroCancelamento(err?.response?.data?.message || "Não foi possível cancelar o agendamento.");
    }
  }

  const dataFormatada = new Date(diaSelecionado + "T00:00:00").toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
  });

  const dataFormatadaCurta = new Date(diaSelecionado + "T00:00:00").toLocaleDateString("pt-BR");

  return {
    mesAtual,
    diaSelecionado,
    calendarioExpandido,
    animais,
    servicos,
    usuarios,
    erro,
    modalAberto,
    detalhe,
    cancelando,
    motivoCancelamento,
    setMotivoCancelamento,
    erroCancelamento,
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
    iniciar,
    concluir,
    abrirCancelamento,
    fecharCancelamento,
    confirmarCancelamento,
    dataFormatada,
    dataFormatadaCurta,
    setDetalhe,
  };
}
