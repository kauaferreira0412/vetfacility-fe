import { useAuth } from "../../context/AuthContext";

export function useEmpresaSelectorContainer() {
  const { user, empresas, empresaAtiva, setEmpresaAtiva } = useAuth();

  function onChange(e) {
    const id = e.target.value;
    if (!id) {
      setEmpresaAtiva(null);
      return;
    }
    const empresa = empresas.find((emp) => String(emp.id) === id);
    if (empresa) setEmpresaAtiva(empresa);
  }

  return { user, empresas, empresaAtiva, onChange };
}
