import Modal from "../../components/Modal";
import DateField from "../../components/DateField";
import { PlusIcon, PawIcon, TrashIcon, CheckIcon } from "../../components/Icons";
import { useAnimaisContainer } from "./Container";
import "./style.css";

const PORTE_LABEL = { PEQUENO: "Pequeno", MEDIO: "Médio", GRANDE: "Grande" };
const SEXO_LABEL = { MACHO: "Macho", FEMEA: "Fêmea" };

export default function Animais() {
  const { animais, clientes, erro, modalAberto, editandoId, form, abrirNovo, abrirEdicao, fecharModal, atualizarCampo, salvar, remover } = useAnimaisContainer();

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="eyebrow">Cadastro</div>
          <h2>Animais</h2>
          <div className="subtitle">Dados completos dos animais atendidos, vinculados a um cliente.</div>
        </div>
        <div className="page-actions">
          <button className="btn" onClick={abrirNovo} disabled={clientes.length === 0}>
            <PlusIcon width={16} height={16} />
            Novo animal
          </button>
        </div>
      </div>

      {clientes.length === 0 && !erro && (
        <div className="alert-error" style={{ background: "var(--accent-tint)", color: "var(--accent-600)" }}>
          Cadastre um cliente antes de cadastrar um animal.
        </div>
      )}

      {erro && <div className="alert-error">{erro}</div>}

      <div className="card">
        <div className="card-head">
          <h3>Animais cadastrados</h3>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Tutor</th>
                <th>Espécie / Raça</th>
                <th>Porte</th>
                <th>Sexo</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {animais.length === 0 && (
                <tr>
                  <td colSpan={6}>
                    <div className="empty-row">
                      <PawIcon width={28} height={28} style={{ opacity: 0.35, marginBottom: 8 }} />
                      <div>Nenhum animal cadastrado ainda.</div>
                    </div>
                  </td>
                </tr>
              )}
              {animais.map((a) => (
                <tr key={a.id}>
                  <td data-label="Nome">
                    <button type="button" className="link-like" onClick={() => abrirEdicao(a)}>{a.nome}</button>
                  </td>
                  <td data-label="Tutor">{a.clienteNome}</td>
                  <td data-label="Espécie / Raça">
                    <div className="cell-main">{a.especie || "—"}</div>
                    <div className="cell-sub">{a.raca || ""}</div>
                  </td>
                  <td data-label="Porte">{a.porte ? PORTE_LABEL[a.porte] : "—"}</td>
                  <td data-label="Sexo">{a.sexo ? SEXO_LABEL[a.sexo] : "—"}</td>
                  <td data-label="Ações">
                    <div className="row-actions">
                      <button className="btn secondary sm" onClick={() => abrirEdicao(a)}>Editar</button>
                      <button className="btn danger sm" onClick={() => remover(a.id)}>
                        <TrashIcon width={13} height={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        open={modalAberto}
        onClose={fecharModal}
        title={editandoId ? "Editar animal" : "Novo animal"}
        subtitle="Dados completos do animal."
        wide
      >
        <form onSubmit={salvar}>
          <div className="form-section">
            <div className="form-section-title">Identificação</div>
            <div className="form-grid">
              <div className="field">
                <label>Nome</label>
                <input value={form.nome} onChange={(e) => atualizarCampo("nome", e.target.value)} required />
              </div>
              <div className="field">
                <label>Tutor (cliente)</label>
                <select value={form.clienteId} onChange={(e) => atualizarCampo("clienteId", e.target.value)} required>
                  <option value="">Selecione...</option>
                  {clientes.map((c) => (
                    <option key={c.id} value={c.id}>{c.nome}</option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label>Espécie</label>
                <input value={form.especie} onChange={(e) => atualizarCampo("especie", e.target.value)} placeholder="Cachorro, gato..." />
              </div>
              <div className="field">
                <label>Raça</label>
                <input value={form.raca} onChange={(e) => atualizarCampo("raca", e.target.value)} placeholder="SRD, Poodle, Shih Tzu..." />
              </div>
            </div>
          </div>

          <div className="form-section">
            <div className="form-section-title">Características</div>
            <div className="form-grid">
              <div className="field">
                <label>Porte</label>
                <select value={form.porte} onChange={(e) => atualizarCampo("porte", e.target.value)}>
                  <option value="PEQUENO">Pequeno</option>
                  <option value="MEDIO">Médio</option>
                  <option value="GRANDE">Grande</option>
                </select>
              </div>
              <div className="field">
                <label>Sexo</label>
                <select value={form.sexo} onChange={(e) => atualizarCampo("sexo", e.target.value)}>
                  <option value="MACHO">Macho</option>
                  <option value="FEMEA">Fêmea</option>
                </select>
              </div>
              <div className="field">
                <label>Data de nascimento</label>
                <DateField value={form.dataNascimento} onChange={(e) => atualizarCampo("dataNascimento", e.target.value)} />
              </div>
              <div className="field">
                <label>Peso (kg)</label>
                <input type="number" step="0.01" min="0" value={form.peso} onChange={(e) => atualizarCampo("peso", e.target.value)} />
              </div>
              <div className="field span-2">
                <label>Cor / pelagem</label>
                <input value={form.corPelagem} onChange={(e) => atualizarCampo("corPelagem", e.target.value)} />
              </div>
            </div>
          </div>

          <div className="form-section">
            <div className="form-section-title">Observações</div>
            <div className="field">
              <textarea rows={3} value={form.observacoes} onChange={(e) => atualizarCampo("observacoes", e.target.value)} placeholder="Alergias, cuidados especiais, temperamento..." />
            </div>
          </div>

          <div className="form-footer">
            <button type="submit" className="btn">
              <CheckIcon width={16} height={16} />
              Salvar animal
            </button>
            <button type="button" className="btn secondary" onClick={fecharModal}>Cancelar</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
