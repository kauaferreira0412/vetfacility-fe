import { useEffect, useState } from "react";
import api from "../../api/client";
import { useAuth } from "../../context/AuthContext";

const TIPOS_ACEITOS = ["image/png", "image/jpeg"];
const TAMANHO_MAXIMO_BYTES = 2 * 1024 * 1024;

function arquivoParaBase64(arquivo) {
  return new Promise((resolve, reject) => {
    const leitor = new FileReader();
    leitor.onload = () => resolve(leitor.result);
    leitor.onerror = reject;
    leitor.readAsDataURL(arquivo);
  });
}

export function useConfiguracoesContainer() {
  const { minhaEmpresa, carregarMinhaEmpresa } = useAuth();

  const [nome, setNome] = useState(minhaEmpresa?.nome || "");
  const [salvandoNome, setSalvandoNome] = useState(false);
  const [previaLogotipo, setPreviaLogotipo] = useState(null);
  const [enviandoLogotipo, setEnviandoLogotipo] = useState(false);
  const [removendoLogotipo, setRemovendoLogotipo] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  useEffect(() => {
    setNome(minhaEmpresa?.nome || "");
  }, [minhaEmpresa?.nome]);

  async function salvarNome(e) {
    e.preventDefault();
    setErro("");
    setSucesso("");
    setSalvandoNome(true);
    try {
      await api.put("/empresas/atual/nome", { nome });
      await carregarMinhaEmpresa();
      setSucesso("Nome do negócio atualizado.");
    } catch (err) {
      setErro(err?.response?.data?.message || "Não foi possível atualizar o nome.");
    } finally {
      setSalvandoNome(false);
    }
  }

  async function selecionarLogotipo(arquivo) {
    setErro("");
    setSucesso("");
    if (!arquivo) return;
    if (!TIPOS_ACEITOS.includes(arquivo.type)) {
      setErro("Envie uma imagem PNG ou JPG.");
      return;
    }
    if (arquivo.size > TAMANHO_MAXIMO_BYTES) {
      setErro("A imagem deve ter no máximo 2MB.");
      return;
    }
    const base64 = await arquivoParaBase64(arquivo);
    setPreviaLogotipo(base64);
  }

  function cancelarPreviaLogotipo() {
    setPreviaLogotipo(null);
  }

  async function confirmarLogotipo() {
    if (!previaLogotipo) return;
    setErro("");
    setSucesso("");
    setEnviandoLogotipo(true);
    try {
      await api.put("/empresas/atual/logotipo", { logotipoBase64: previaLogotipo });
      await carregarMinhaEmpresa();
      setPreviaLogotipo(null);
      setSucesso("Logotipo atualizado.");
    } catch (err) {
      setErro(err?.response?.data?.message || "Não foi possível enviar o logotipo.");
    } finally {
      setEnviandoLogotipo(false);
    }
  }

  async function removerLogotipo() {
    setErro("");
    setSucesso("");
    setRemovendoLogotipo(true);
    try {
      await api.delete("/empresas/atual/logotipo");
      await carregarMinhaEmpresa();
      setSucesso("Logotipo removido.");
    } catch (err) {
      setErro(err?.response?.data?.message || "Não foi possível remover o logotipo.");
    } finally {
      setRemovendoLogotipo(false);
    }
  }

  return {
    minhaEmpresa,
    nome,
    setNome,
    salvandoNome,
    previaLogotipo,
    enviandoLogotipo,
    removendoLogotipo,
    erro,
    sucesso,
    salvarNome,
    selecionarLogotipo,
    cancelarPreviaLogotipo,
    confirmarLogotipo,
    removerLogotipo,
  };
}
