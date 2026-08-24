import { useEffect, useMemo, useState } from "react";
import api from "../../api/client";

const formVazio = { codigo: "", descricao: "", modulo: "" };

export function usePermissoesContainer() {
  const [permissoes, setPermissoes] = useState([]);
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [modalAberto, setModalAberto] = useState(false);
  const [excluindo, setExcluindo] = useState(null);
  const [removendo, setRemovendo] = useState(false);
  const [form, setForm] = useState(formVazio);

  async function carregar() {
    try {
      const { data } = await api.get("/permissoes");
      setPermissoes(data);
    } catch {
      setErro("Não foi possível carregar o catálogo de permissões.");
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  const grupos = useMemo(() => {
    const mapa = {};
    permissoes.forEach((p) => (mapa[p.modulo] ||= []).push(p));
    return Object.entries(mapa).sort(([a], [b]) => a.localeCompare(b));
  }, [permissoes]);

  const modulosExistentes = useMemo(
    () => [...new Set(permissoes.map((p) => p.modulo))].sort(),
    [permissoes]
  );

  function abrirModal() {
    setErro("");
    setForm(formVazio);
    setModalAberto(true);
  }

  function fecharModal() {
    setModalAberto(false);
  }

  function atualizarCodigo(valor) {
    setForm((f) => ({ ...f, codigo: valor.toUpperCase() }));
  }

  function atualizarDescricao(valor) {
    setForm((f) => ({ ...f, descricao: valor }));
  }

  function atualizarModulo(valor) {
    setForm((f) => ({ ...f, modulo: valor.toUpperCase() }));
  }

  async function salvar(e) {
    e.preventDefault();
    setErro("");
    setCarregando(true);
    try {
      await api.post("/permissoes", { ...form, codigo: form.codigo.toUpperCase() });
      setModalAberto(false);
      carregar();
    } catch (err) {
      setErro(err?.response?.data?.message || "Não foi possível cadastrar a permissão.");
    } finally {
      setCarregando(false);
    }
  }

  async function confirmarRemocao() {
    if (!excluindo) return;
    setRemovendo(true);
    try {
      await api.delete(`/permissoes/${excluindo.id}`);
      setExcluindo(null);
      carregar();
    } catch (err) {
      setErro(err?.response?.data?.message || "Não foi possível remover a permissão.");
      setExcluindo(null);
    } finally {
      setRemovendo(false);
    }
  }

  return {
    erro,
    carregando,
    modalAberto,
    excluindo,
    removendo,
    form,
    grupos,
    modulosExistentes,
    abrirModal,
    fecharModal,
    atualizarCodigo,
    atualizarDescricao,
    atualizarModulo,
    salvar,
    confirmarRemocao,
    setExcluindo,
  };
}
