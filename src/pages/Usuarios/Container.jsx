import { useEffect, useState } from "react";
import api from "../../api/client";
import { useAuth } from "../../context/AuthContext";

export function useUsuariosContainer() {
  const { temPermissao } = useAuth();
  const podeGerenciar = temPermissao("USUARIO_GERENCIAR");

  const [usuarios, setUsuarios] = useState([]);
  const [perfis, setPerfis] = useState([]);
  const [erro, setErro] = useState("");
  const [mostrarForm, setMostrarForm] = useState(false);
  const [form, setForm] = useState({ nome: "", email: "", senha: "", perfilId: "" });

  async function carregar() {
    try {
      const [usr, prf] = await Promise.all([
        api.get("/usuarios"),
        podeGerenciar ? api.get("/perfis") : Promise.resolve({ data: [] }),
      ]);
      setUsuarios(usr.data);
      setPerfis(prf.data);
    } catch {
      setErro("Não foi possível carregar os usuários.");
    }
  }

  useEffect(() => {
    carregar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function atualizarCampo(campo, valor) {
    setForm((f) => ({ ...f, [campo]: valor }));
  }

  function alternarForm() {
    setMostrarForm((v) => !v);
  }

  async function convidar(e) {
    e.preventDefault();
    setErro("");
    try {
      await api.post("/auth/usuarios", { ...form, perfilId: Number(form.perfilId) });
      setForm({ nome: "", email: "", senha: "", perfilId: "" });
      setMostrarForm(false);
      carregar();
    } catch (err) {
      setErro(err?.response?.data?.message || "Não foi possível cadastrar o usuário.");
    }
  }

  return { podeGerenciar, usuarios, perfis, erro, mostrarForm, form, atualizarCampo, alternarForm, convidar };
}
