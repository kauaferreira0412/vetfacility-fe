import { useCallback, useEffect, useState } from "react";
import api from "../../api/client";
import { useAuth } from "../../context/AuthContext";

const vazio = { valor: "", data: new Date().toISOString().slice(0, 10), descricao: "" };

function toKey(date) {
  return date.toISOString().slice(0, 10);
}

function calcularPeriodo(preset) {
  const hoje = new Date();
  if (preset === "hoje") {
    return { de: toKey(hoje), ate: toKey(hoje) };
  }
  if (preset === "semana") {
    const inicio = new Date(hoje);
    inicio.setDate(inicio.getDate() - 6);
    return { de: toKey(inicio), ate: toKey(hoje) };
  }
  const inicioDoMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
  return { de: toKey(inicioDoMes), ate: toKey(hoje) };
}

export function useFinanceiroContainer() {
  const { temPermissao } = useAuth();
  const podeGerenciar = temPermissao("FINANCEIRO_GERENCIAR");

  const [preset, setPreset] = useState("mes");
  const [periodo, setPeriodo] = useState(() => calcularPeriodo("mes"));
  const [resultado, setResultado] = useState({ totalGanhos: 0, totalGastos: 0, resultado: 0, movimentacoes: [] });
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [modalAberto, setModalAberto] = useState(false);
  const [tipoLancamento, setTipoLancamento] = useState("GASTO");
  const [form, setForm] = useState(vazio);
  const [movimentacaoExcluir, setMovimentacaoExcluir] = useState(null);
  const [excluindo, setExcluindo] = useState(false);
  const [baixandoPdf, setBaixandoPdf] = useState(false);

  const carregar = useCallback(async () => {
    setCarregando(true);
    try {
      const { data } = await api.get("/financeiro/resultado", { params: { de: periodo.de, ate: periodo.ate } });
      setResultado(data);
    } catch {
      setErro("Não foi possível carregar o financeiro.");
    } finally {
      setCarregando(false);
    }
  }, [periodo]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  function selecionarPreset(novoPreset) {
    setPreset(novoPreset);
    if (novoPreset !== "personalizado") {
      setPeriodo(calcularPeriodo(novoPreset));
    }
  }

  function atualizarPeriodoPersonalizado(campo, valor) {
    setPreset("personalizado");
    setPeriodo((p) => ({ ...p, [campo]: valor }));
  }

  function abrirNovoGasto() {
    setTipoLancamento("GASTO");
    setForm(vazio);
    setModalAberto(true);
  }

  function abrirNovoGanho() {
    setTipoLancamento("GANHO");
    setForm(vazio);
    setModalAberto(true);
  }

  function fecharModal() {
    setModalAberto(false);
  }

  function atualizarCampo(campo, valor) {
    setForm((f) => ({ ...f, [campo]: valor }));
  }

  async function salvarLancamento(e) {
    e.preventDefault();
    setErro("");
    try {
      const rota = tipoLancamento === "GANHO" ? "/financeiro/ganhos" : "/financeiro/gastos";
      await api.post(rota, { ...form, valor: Number(form.valor) });
      setModalAberto(false);
      carregar();
    } catch (err) {
      const acao = tipoLancamento === "GANHO" ? "lançar o ganho" : "lançar o gasto";
      setErro(err?.response?.data?.message || `Não foi possível ${acao}.`);
    }
  }

  async function remover() {
    if (!movimentacaoExcluir) return;
    setExcluindo(true);
    try {
      await api.delete(`/financeiro/${movimentacaoExcluir.id}`);
      setMovimentacaoExcluir(null);
      carregar();
    } catch (err) {
      setErro(err?.response?.data?.message || "Não foi possível remover a movimentação.");
    } finally {
      setExcluindo(false);
    }
  }

  async function baixarRelatorioPdf() {
    setErro("");
    setBaixandoPdf(true);
    try {
      const { data } = await api.get("/financeiro/relatorio-pdf", {
        params: { de: periodo.de, ate: periodo.ate },
        responseType: "blob",
      });
      const url = URL.createObjectURL(data);
      const link = document.createElement("a");
      link.href = url;
      link.download = `relatorio-financeiro-${periodo.de}-a-${periodo.ate}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch {
      setErro("Não foi possível gerar o PDF do relatório.");
    } finally {
      setBaixandoPdf(false);
    }
  }

  return {
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
  };
}
