import { ShieldIcon } from "../Icons";
import { useEmpresaSelectorContainer } from "./Container";
import "./style.css";

export default function EmpresaSelector() {
  const { user, empresas, empresaAtiva, onChange } = useEmpresaSelectorContainer();

  if (!user?.root) return null;

  return (
    <div className="empresa-selector">
      <ShieldIcon width={15} height={15} />
      <span className="empresa-selector-label">Empresa:</span>
      <select value={empresaAtiva?.id ?? ""} onChange={onChange}>
        <option value="">Selecione uma empresa...</option>
        {empresas.map((emp) => (
          <option key={emp.id} value={emp.id}>{emp.nome}</option>
        ))}
      </select>
      {empresas.length === 0 && <span className="empresa-selector-hint">Nenhuma empresa cadastrada ainda.</span>}
    </div>
  );
}
