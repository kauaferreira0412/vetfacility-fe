import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../../api/client";

const vazio = {
  nome: "", especie: "", porte: "PEQUENO", raca: "", sexo: "MACHO",
  dataNascimento: "", peso: "", corPelagem: "", observacoes: "", clienteId: "",
};

export function useAnimaisContainer() {
  const [animais, setAnimais] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [erro, setErro] = useState("");
  const [modalAberto, setModalAberto] = useState(false);
  const [editandoId, setEditandoId] = useState(null);
  const [form, setForm] = useState(vazio);
  const [searchParams, setSearchParams] = useSearchParams();

  async function carregar() {
    try {
      const [ani, cli] = await Promise.all([api.get("/animais"), api.get("/clientes")]);
      setAnimais(ani.data);
      setClientes(cli.data);
    } catch {
      setErro("Não foi possível carregar os animais.");
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  useEffect(() => {
    if (searchParams.get("novo") === "1" && clientes.length > 0) {
      abrirNovo();
      setSearchParams({}, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientes]);

  function abrirNovo() {
    setEditandoId(null);
    setForm(vazio);
    setModalAberto(true);
  }

  function abrirEdicao(a) {
    setEditandoId(a.id);
    setForm({
      nome: a.nome || "", especie: a.especie || "", porte: a.porte || "PEQUENO",
      raca: a.raca || "", sexo: a.sexo || "MACHO", dataNascimento: a.dataNascimento || "",
      peso: a.peso ?? "", corPelagem: a.corPelagem || "", observacoes: a.observacoes || "",
      clienteId: String(a.clienteId),
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
        clienteId: Number(form.clienteId),
        peso: form.peso === "" ? null : Number(form.peso),
        dataNascimento: form.dataNascimento || null,
      };
      if (editandoId) {
        await api.put(`/animais/${editandoId}`, payload);
      } else {
        await api.post("/animais", payload);
      }
      setModalAberto(false);
      carregar();
    } catch (err) {
      setErro(err?.response?.data?.message || "Não foi possível salvar o animal.");
    }
  }

  async function remover(id) {
    try {
      await api.delete(`/animais/${id}`);
      carregar();
    } catch (err) {
      setErro(err?.response?.data?.message || "Não foi possível remover o animal.");
    }
  }

  return { animais, clientes, erro, modalAberto, editandoId, form, abrirNovo, abrirEdicao, fecharModal, atualizarCampo, salvar, remover };
}
