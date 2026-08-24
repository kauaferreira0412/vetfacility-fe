import { useState } from "react";
import api from "../../api/client";
import { useAuth } from "../../context/AuthContext";

const formVazio = { nomeEmpresa: "", nomeUsuario: "", email: "", senha: "" };

export function useEmpresasContainer() {
  const { empresas, carregarEmpresas, setEmpresaAtiva } = useAuth();
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [modalAberto, setModalAberto] = useState(false);
  const [form, setForm] = useState(formVazio);

  function abrirModal() {
    setErro("");
    setForm(formVazio);
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
    setCarregando(true);
    try {
      const { data } = await api.post("/auth/register", form);
      await carregarEmpresas();
      setModalAberto(false);
      if (data?.usuario?.empresaId) {
        setEmpresaAtiva({ id: data.usuario.empresaId, nome: data.usuario.empresaNome });
      }
    } catch (err) {
      setErro(err?.response?.data?.message || "Não foi possível cadastrar a empresa.");
    } finally {
      setCarregando(false);
    }
  }

  return { empresas, erro, carregando, modalAberto, form, abrirModal, fecharModal, atualizarCampo, salvar };
}
