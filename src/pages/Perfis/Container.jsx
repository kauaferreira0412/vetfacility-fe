import { useEffect, useMemo, useState } from "react";
import api from "../../api/client";

const vazio = { nome: "", permissaoIds: [] };

export function usePerfisContainer() {
  const [perfis, setPerfis] = useState([]);
  const [permissoes, setPermissoes] = useState([]);
  const [erro, setErro] = useState("");
  const [mostrarForm, setMostrarForm] = useState(false);
  const [editandoId, setEditandoId] = useState(null);
  const [form, setForm] = useState(vazio);

  async function carregar() {
    try {
      const [prf, perm] = await Promise.all([api.get("/perfis"), api.get("/permissoes")]);
      setPerfis(prf.data);
      setPermissoes(perm.data.filter((p) => p.modulo !== "PLATAFORMA"));
    } catch {
      setErro("Não foi possível carregar os perfis de acesso.");
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  const permissoesPorModulo = useMemo(() => {
    const grupos = {};
    permissoes.forEach((p) => (grupos[p.modulo] ||= []).push(p));
    return grupos;
  }, [permissoes]);

  function alternarPermissao(id) {
    setForm((f) => ({
      ...f,
      permissaoIds: f.permissaoIds.includes(id)
        ? f.permissaoIds.filter((p) => p !== id)
        : [...f.permissaoIds, id],
    }));
  }

  function atualizarNome(nome) {
    setForm((f) => ({ ...f, nome }));
  }

  function iniciarEdicao(perfil) {
    setEditandoId(perfil.id);
    setForm({ nome: perfil.nome, permissaoIds: perfil.permissoes.map((p) => p.id) });
    setMostrarForm(true);
  }

  function iniciarCriacao() {
    setEditandoId(null);
    setForm(vazio);
    setMostrarForm(true);
  }

  function cancelar() {
    setMostrarForm(false);
  }

  async function salvar(e) {
    e.preventDefault();
    setErro("");
    try {
      if (editandoId) {
        await api.put(`/perfis/${editandoId}`, form);
      } else {
        await api.post("/perfis", form);
      }
      setMostrarForm(false);
      setForm(vazio);
      setEditandoId(null);
      carregar();
    } catch (err) {
      setErro(err?.response?.data?.message || "Não foi possível salvar o perfil.");
    }
  }

  async function remover(id) {
    setErro("");
    try {
      await api.delete(`/perfis/${id}`);
      carregar();
    } catch (err) {
      setErro(err?.response?.data?.message || "Não foi possível remover o perfil.");
    }
  }

  return {
    perfis,
    erro,
    mostrarForm,
    editandoId,
    form,
    permissoesPorModulo,
    alternarPermissao,
    atualizarNome,
    iniciarEdicao,
    iniciarCriacao,
    cancelar,
    salvar,
    remover,
  };
}
