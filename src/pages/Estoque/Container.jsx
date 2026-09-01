import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../../api/client";

const vazio = { nome: "", quantidadeEstoque: "", quantidadeMinima: "", unidade: "un" };

export function useEstoqueContainer() {
  const [produtos, setProdutos] = useState([]);
  const [servicos, setServicos] = useState([]);
  const [erro, setErro] = useState("");
  const [modalAberto, setModalAberto] = useState(false);
  const [editandoId, setEditandoId] = useState(null);
  const [form, setForm] = useState(vazio);
  const [produtoExcluir, setProdutoExcluir] = useState(null);
  const [excluindo, setExcluindo] = useState(false);
  const [servicoConfigurando, setServicoConfigurando] = useState(null);
  const [produtosPadraoSelecionados, setProdutosPadraoSelecionados] = useState({});
  const [salvandoProdutosPadrao, setSalvandoProdutosPadrao] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  async function carregar() {
    try {
      const [prod, srv] = await Promise.all([api.get("/produtos"), api.get("/servicos")]);
      setProdutos(prod.data);
      setServicos(srv.data);
    } catch {
      setErro("Não foi possível carregar o estoque.");
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  useEffect(() => {
    if (searchParams.get("novo") === "1") {
      abrirNovo();
      setSearchParams({}, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const resumo = useMemo(() => {
    const baixos = produtos.filter((p) => p.estoqueBaixo).length;
    return { total: produtos.length, baixos };
  }, [produtos]);

  function abrirNovo() {
    setEditandoId(null);
    setForm(vazio);
    setModalAberto(true);
  }

  function abrirEdicao(p) {
    setEditandoId(p.id);
    setForm({
      nome: p.nome, quantidadeEstoque: String(p.quantidadeEstoque),
      quantidadeMinima: String(p.quantidadeMinima), unidade: p.unidade || "un",
    });
    setModalAberto(true);
  }

  function fecharModal() {
    setModalAberto(false);
  }

  function atualizarCampo(campo, valor) {
    setForm((f) => ({ ...f, [campo]: valor }));
  }

  async function salvar(e) {
    e.preventDefault();
    setErro("");
    try {
      const payload = {
        ...form,
        quantidadeEstoque: Number(form.quantidadeEstoque),
        quantidadeMinima: Number(form.quantidadeMinima),
      };
      if (editandoId) {
        await api.put(`/produtos/${editandoId}`, payload);
      } else {
        await api.post("/produtos", payload);
      }
      setModalAberto(false);
      carregar();
    } catch (err) {
      setErro(err?.response?.data?.message || "Não foi possível salvar o produto.");
    }
  }

  async function remover() {
    if (!produtoExcluir) return;
    setExcluindo(true);
    try {
      await api.delete(`/produtos/${produtoExcluir.id}`);
      setProdutoExcluir(null);
      carregar();
    } catch (err) {
      setErro(err?.response?.data?.message || "Não foi possível remover o produto.");
    } finally {
      setExcluindo(false);
    }
  }

  function abrirConfigurarProdutos(servico) {
    const selecionados = {};
    servico.produtosPadrao?.forEach((p) => {
      selecionados[p.produtoId] = String(p.quantidadePadrao);
    });
    setProdutosPadraoSelecionados(selecionados);
    setServicoConfigurando(servico);
  }

  function fecharConfigurarProdutos() {
    setServicoConfigurando(null);
  }

  function alternarProdutoPadrao(produtoId) {
    setProdutosPadraoSelecionados((atual) => {
      const proximo = { ...atual };
      if (proximo[produtoId] !== undefined) {
        delete proximo[produtoId];
      } else {
        proximo[produtoId] = "1";
      }
      return proximo;
    });
  }

  function atualizarQuantidadePadrao(produtoId, quantidade) {
    setProdutosPadraoSelecionados((atual) => ({ ...atual, [produtoId]: quantidade }));
  }

  async function salvarProdutosPadrao(e) {
    e.preventDefault();
    if (!servicoConfigurando) return;
    setSalvandoProdutosPadrao(true);
    setErro("");
    try {
      const produtosPayload = Object.entries(produtosPadraoSelecionados)
        .filter(([, quantidade]) => Number(quantidade) > 0)
        .map(([produtoId, quantidade]) => ({ produtoId: Number(produtoId), quantidadePadrao: Number(quantidade) }));

      await api.put(`/servicos/${servicoConfigurando.id}/produtos-padrao`, { produtos: produtosPayload });
      setServicoConfigurando(null);
      carregar();
    } catch (err) {
      setErro(err?.response?.data?.message || "Não foi possível salvar os produtos padrão do serviço.");
    } finally {
      setSalvandoProdutosPadrao(false);
    }
  }

  return {
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
  };
}
