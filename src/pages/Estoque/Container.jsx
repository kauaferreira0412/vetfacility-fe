import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../../api/client";

const vazio = { nome: "", quantidadeEstoque: "", quantidadeMinima: "", unidade: "un" };

export function useEstoqueContainer() {
  const [produtos, setProdutos] = useState([]);
  const [erro, setErro] = useState("");
  const [modalAberto, setModalAberto] = useState(false);
  const [editandoId, setEditandoId] = useState(null);
  const [form, setForm] = useState(vazio);
  const [produtoExcluir, setProdutoExcluir] = useState(null);
  const [excluindo, setExcluindo] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  async function carregar() {
    try {
      const { data } = await api.get("/produtos");
      setProdutos(data);
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

  return {
    produtos,
    erro,
    modalAberto,
    editandoId,
    form,
    produtoExcluir,
    excluindo,
    resumo,
    abrirNovo,
    abrirEdicao,
    fecharModal,
    atualizarCampo,
    salvar,
    remover,
    setProdutoExcluir,
  };
}
