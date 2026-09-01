import { PawIcon, CheckIcon, TrashIcon, UploadIcon } from "../../components/Icons";
import { useConfiguracoesContainer } from "./Container";
import "./style.css";

export default function Configuracoes() {
  const {
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
  } = useConfiguracoesContainer();

  const imagemExibida = previaLogotipo || minhaEmpresa?.logotipoUrl;

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="eyebrow">Personalização</div>
          <h2>Configurações do negócio</h2>
          <div className="subtitle">Defina o nome e o logotipo que aparecem em todo o sistema.</div>
        </div>
      </div>

      {erro && <div className="alert-error">{erro}</div>}
      {sucesso && <div className="alert-success">{sucesso}</div>}

      <div className="card">
        <div className="card-head">
          <h3>Nome do negócio</h3>
        </div>
        <form onSubmit={salvarNome}>
          <div className="form-grid">
            <div className="field span-2">
              <label>Nome exibido no sistema</label>
              <input value={nome} onChange={(e) => setNome(e.target.value)} maxLength={150} required />
              <span className="hint">Aparece no menu lateral e em toda a interface.</span>
            </div>
          </div>
          <div className="form-footer">
            <button type="submit" className="btn" disabled={salvandoNome}>
              <CheckIcon width={16} height={16} />
              {salvandoNome ? "Salvando..." : "Salvar nome"}
            </button>
          </div>
        </form>
      </div>

      <div className="card">
        <div className="card-head">
          <h3>Logotipo</h3>
        </div>
        <div className="logotipo-config">
          <div className="logotipo-preview">
            {imagemExibida ? (
              <img src={imagemExibida} alt="Logotipo do negócio" />
            ) : (
              <PawIcon width={36} height={36} style={{ opacity: 0.35 }} />
            )}
          </div>
          <div className="logotipo-acoes">
            <p className="hint" style={{ marginBottom: 10 }}>
              PNG ou JPG, até 2MB. Aparece no menu lateral em todas as telas.
            </p>
            {!previaLogotipo ? (
              <div className="row-actions" style={{ justifyContent: "flex-start" }}>
                <label className="btn secondary sm" style={{ cursor: "pointer" }}>
                  <UploadIcon width={14} height={14} />
                  Escolher imagem
                  <input
                    type="file"
                    accept="image/png,image/jpeg"
                    style={{ display: "none" }}
                    onChange={(e) => selecionarLogotipo(e.target.files?.[0])}
                  />
                </label>
                {minhaEmpresa?.logotipoUrl && (
                  <button type="button" className="btn danger sm" onClick={removerLogotipo} disabled={removendoLogotipo}>
                    <TrashIcon width={13} height={13} />
                    {removendoLogotipo ? "Removendo..." : "Remover logotipo"}
                  </button>
                )}
              </div>
            ) : (
              <div className="row-actions" style={{ justifyContent: "flex-start" }}>
                <button type="button" className="btn sm" onClick={confirmarLogotipo} disabled={enviandoLogotipo}>
                  <CheckIcon width={14} height={14} />
                  {enviandoLogotipo ? "Enviando..." : "Confirmar envio"}
                </button>
                <button type="button" className="btn secondary sm" onClick={cancelarPreviaLogotipo}>Cancelar</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
