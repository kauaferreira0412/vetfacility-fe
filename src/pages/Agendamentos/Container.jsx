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

export function formatarDuracao(iniciadoEm, agora) {
  if (!iniciadoEm) return "";
  const inicio = new Date(iniciadoEm);
  const totalSegundos = Math.max(0, Math.floor((agora.getTime() - inicio.getTime()) / 1000));
  const horas = Math.floor(totalSegundos / 3600);
  const minutos = Math.floor((totalSegundos % 3600) / 60);
  const segundos = totalSegundos % 60;
  if (horas > 0) {
    return `${horas}h ${String(minutos).padStart(2, "0")}min`;
  }
  return `${String(minutos).padStart(2, "0")}:${String(segundos).padStart(2, "0")}`;
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
  const [produtos, setProdutos] = useState([]);
  const [erro, setErro] = useState("");
  const [modalAberto, setModalAberto] = useState(false);
  const [detalhe, setDetalhe] = useState(null);
  const [cancelando, setCancelando] = useState(null);
  const [motivoCancelamento, setMotivoCancelamento] = useState("");
  const [erroCancelamento, setErroCancelamento] = useState("");
  const [iniciando, setIniciando] = useState(null);
  const [produtosSelecionados, setProdutosSelecionados] = useState({});
  const [agora, setAgora] = useState(() => new Date());
  const [concluindo, setConcluindo] = useState(null);
  const [valorCobrado, setValorCobrado] = useState("");
  const [erroConcluir, setErroConcluir] = useState("");

  const [form, setForm] = useState(formVazio);
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const intervalo = setInterval(() => setAgora(new Date()), 1000);
    return () => clearInterval(intervalo);
  }, []);

  async function carregarTudo() {
    setErro("");
    const { inicio, fim } = inicioFimMesVisivel(mesAtual);
    const [ag, ani, srv, usr, prod] = await Promise.allSettled([
      api.get(`/agendamentos`, { params: { de: inicio, ate: fim } }),
      api.get(`/animais`),
      api.get(`/servicos`),
      api.get(`/usuarios`),
      api.get(`/produtos`),
    ]);

    if (ag.status === "fulfilled") setTodosAgendamentosDoMes(ag.value.data);
    else setErro("Não foi possível carregar a agenda.");
    if (ani.status === "fulfilled") setAnimais(ani.value.data);
    if (srv.status === "fulfilled") setServicos(srv.value.data);
    setUsuarios(usr.status === "fulfilled" ? usr.value.data : []);
    setProdutos(prod.status === "fulfilled" ? prod.value.data : []);
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

  function abrirIniciar(agendamento) {
    // EST-02/EST-03: pré-preenche com os produtos padrão configurados para o tipo de serviço,
    // que o usuário ainda pode ajustar antes de confirmar.
    const servico = servicos.find((s) => s.id === agendamento.servicoId);
    const selecionados = {};
    servico?.produtosPadrao?.forEach((p) => {
      selecionados[p.produtoId] = String(p.quantidadePadrao);
    });
    setProdutosSelecionados(selecionados);
    setIniciando(agendamento);
  }

  function fecharIniciar() {
    setIniciando(null);
  }

  function alternarProdutoSelecionado(produtoId) {
    setProdutosSelecionados((atual) => {
      const proximo = { ...atual };
      if (proximo[produtoId] !== undefined) {
        delete proximo[produtoId];
      } else {
        proximo[produtoId] = 1;
      }
      return proximo;
    });
  }

  function atualizarQuantidadeProduto(produtoId, quantidade) {
    setProdutosSelecionados((atual) => ({ ...atual, [produtoId]: quantidade }));
  }

  async function confirmarIniciar(e) {
    e.preventDefault();
    if (!iniciando) return;
    const produtosPlanejados = Object.entries(produtosSelecionados)
      .filter(([, quantidade]) => Number(quantidade) > 0)
      .map(([produtoId, quantidade]) => ({ produtoId: Number(produtoId), quantidade: Number(quantidade) }));

    await api.post(`/agendamentos/${iniciando.id}/iniciar`, { produtosPlanejados });
    setIniciando(null);
    setDetalhe(null);
    carregarTudo();
  }

  function abrirConcluir(agendamento) {
    setErroConcluir("");
    setValorCobrado("");
    setConcluindo(agendamento);
  }

  function fecharConcluir() {
    setConcluindo(null);
  }

  async function confirmarConcluir(e) {
    e.preventDefault();
    if (!concluindo) return;
    setErroConcluir("");
    try {
      await api.post(`/agendamentos/${concluindo.id}/concluir`, {
        valorCobrado: valorCobrado ? Number(valorCobrado) : null,
      });
      setConcluindo(null);
      setDetalhe(null);
      carregarTudo();
    } catch (err) {
      setErroConcluir(err?.response?.data?.message || "Não foi possível concluir o atendimento.");
    }
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
  };
}
