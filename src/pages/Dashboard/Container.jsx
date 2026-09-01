import { useEffect, useMemo, useState } from "react";
import api from "../../api/client";
import { useAuth } from "../../context/AuthContext";

export const STATUS_LABEL = { AGENDADO: "Agendado", EM_ATENDIMENTO: "Em atendimento", CONCLUIDO: "Concluído", CANCELADO: "Cancelado" };

const STATUS_COR = {
  AGENDADO: "var(--warning-600)",
  EM_ATENDIMENTO: "var(--accent-600)",
  CONCLUIDO: "var(--success-600)",
  CANCELADO: "var(--danger-600)",
};

function toKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function useDashboardContainer() {
  const { user, temPermissao } = useAuth();
  const [agendamentos, setAgendamentos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [animais, setAnimais] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [resumoFinanceiro, setResumoFinanceiro] = useState(null);
  const [carregado, setCarregado] = useState(false);

  const vePermissaoAgenda = temPermissao("AGENDAMENTO_VISUALIZAR");
  const vePermissaoClientes = temPermissao("CLIENTE_VISUALIZAR");
  const vePermissaoAnimais = temPermissao("ANIMAL_VISUALIZAR");
  const vePermissaoEstoque = temPermissao("PRODUTO_VISUALIZAR");
  const vePermissaoFinanceiro = temPermissao("FINANCEIRO_VISUALIZAR");

  useEffect(() => {
    async function carregar() {
      const hoje = new Date();
      const deDate = new Date(hoje);
      deDate.setDate(deDate.getDate() - 6);
      const de = toKey(deDate);
      const ateDate = new Date(hoje);
      ateDate.setDate(ateDate.getDate() + 6);
      const ate = toKey(ateDate);

      const [ag, cli, ani, prod, fin] = await Promise.allSettled([
        vePermissaoAgenda ? api.get("/agendamentos", { params: { de, ate } }) : Promise.resolve({ data: [] }),
        vePermissaoClientes ? api.get("/clientes") : Promise.resolve({ data: [] }),
        vePermissaoAnimais ? api.get("/animais") : Promise.resolve({ data: [] }),
        vePermissaoEstoque ? api.get("/produtos") : Promise.resolve({ data: [] }),
        vePermissaoFinanceiro ? api.get("/financeiro/resumo") : Promise.resolve({ data: null }),
      ]);

      if (ag.status === "fulfilled") setAgendamentos(ag.value.data);
      if (cli.status === "fulfilled") setClientes(cli.value.data);
      if (ani.status === "fulfilled") setAnimais(ani.value.data);
      if (prod.status === "fulfilled") setProdutos(prod.value.data);
      if (fin.status === "fulfilled") setResumoFinanceiro(fin.value.data);
      setCarregado(true);
    }
    carregar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const hojeKey = useMemo(() => toKey(new Date()), []);

  const agendamentosHoje = useMemo(
    () => agendamentos.filter((a) => a.dataHora.slice(0, 10) === hojeKey),
    [agendamentos, hojeKey]
  );

  const proximosAgendamentos = useMemo(
    () => agendamentos
      .filter((a) => (a.status === "AGENDADO" || a.status === "EM_ATENDIMENTO") && new Date(a.dataHora) >= new Date())
      .sort((a, b) => a.dataHora.localeCompare(b.dataHora))
      .slice(0, 6),
    [agendamentos]
  );

  const produtosEstoqueBaixo = useMemo(() => produtos.filter((p) => p.estoqueBaixo), [produtos]);

  const atendimentosPorDia = useMemo(() => {
    const dias = Array.from({ length: 7 }, (_, idx) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - idx));
      return d;
    });
    return dias.map((d) => {
      const key = toKey(d);
      const valor = agendamentos.filter((a) => a.dataHora.slice(0, 10) === key).length;
      return {
        rotulo: d.toLocaleDateString("pt-BR", { weekday: "short" }).replace(".", ""),
        rotuloCompleto: d.toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "2-digit" }),
        valor,
      };
    });
  }, [agendamentos]);

  const agendamentosPorStatus = useMemo(
    () => Object.keys(STATUS_LABEL).map((status) => ({
      rotulo: STATUS_LABEL[status],
      valor: agendamentos.filter((a) => a.status === status).length,
      cor: STATUS_COR[status],
    })),
    [agendamentos]
  );

  const primeiroNome = (user?.nome || "").split(" ")[0];

  return {
    vePermissaoAgenda,
    vePermissaoClientes,
    vePermissaoAnimais,
    vePermissaoEstoque,
    vePermissaoFinanceiro,
    clientes,
    animais,
    resumoFinanceiro,
    carregado,
    hojeKey,
    agendamentosHoje,
    proximosAgendamentos,
    produtosEstoqueBaixo,
    atendimentosPorDia,
    agendamentosPorStatus,
    agendamentos,
    primeiroNome,
  };
}
