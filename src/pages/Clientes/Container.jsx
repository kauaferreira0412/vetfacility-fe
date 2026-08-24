import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../../api/client";

const vazio = { nome: "", telefone: "", email: "", cpf: "", endereco: "", cidade: "", cep: "", observacoes: "" };

export function useClientesContainer() {
  const [clientes, setClientes] = useState([]);
  const [erro, setErro] = useState("");
  const [modalAberto, setModalAberto] = useState(false);
  const [editandoId, setEditandoId] = useState(null);
  const [form, setForm] = useState(vazio);
  const [searchParams, setSearchParams] = useSearchParams();

  async function carregar() {
    try {
      const { data } = await api.get("/clientes");
      setClientes(data);
    } catch {
      setErro("Não foi possível carregar os clientes.");
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

  function abrirNovo() {
    setEditandoId(null);
    setForm(vazio);
    setModalAberto(true);
  }

  function abrirEdicao(c) {
    setEditandoId(c.id);
    setForm({
      nome: c.nome || "", telefone: c.telefone || "", email: c.email || "", cpf: c.cpf || "",
      endereco: c.endereco || "", cidade: c.cidade || "", cep: c.cep || "", observacoes: c.observacoes || "",
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
      if (editandoId) {
        await api.put(`/clientes/${editandoId}`, form);
      } else {
        await api.post("/clientes", form);
      }
      setModalAberto(false);
      carregar();
    } catch (err) {
      setErro(err?.response?.data?.message || "Não foi possível salvar o cliente.");
    }
  }

  async function remover(id) {
    try {
      await api.delete(`/clientes/${id}`);
      carregar();
    } catch (err) {
      setErro(err?.response?.data?.message || "Não foi possível remover o cliente.");
    }
  }

  return { clientes, erro, modalAberto, editandoId, form, abrirNovo, abrirEdicao, fecharModal, atualizarCampo, salvar, remover };
}
