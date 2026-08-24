import Modal from "../../components/Modal";
import { PlusIcon, UsersIcon, TrashIcon, CheckIcon } from "../../components/Icons";
import { useClientesContainer } from "./Container";
import "./style.css";

export default function Clientes() {
  const { clientes, erro, modalAberto, editandoId, form, abrirNovo, abrirEdicao, fecharModal, atualizarCampo, salvar, remover } = useClientesContainer();

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="eyebrow">Cadastro</div>
          <h2>Clientes</h2>
          <div className="subtitle">Dados completos dos donos dos animais atendidos.</div>
        </div>
        <div className="page-actions">
          <button className="btn" onClick={abrirNovo}>
            <PlusIcon width={16} height={16} />
            Novo cliente
          </button>
        </div>
      </div>

      {erro && <div className="alert-error">{erro}</div>}

      <div className="card">
        <div className="card-head">
          <h3>Clientes cadastrados</h3>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Telefone</th>
                <th>E-mail</th>
                <th>Cidade</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {clientes.length === 0 && (
                <tr>
                  <td colSpan={5}>
                    <div className="empty-row">
                      <UsersIcon width={28} height={28} style={{ opacity: 0.35, marginBottom: 8 }} />
                      <div>Nenhum cliente cadastrado ainda.</div>
                    </div>
                  </td>
                </tr>
              )}
              {clientes.map((c) => (
                <tr key={c.id}>
                  <td data-label="Nome">
                    <button type="button" className="link-like" onClick={() => abrirEdicao(c)}>{c.nome}</button>
                  </td>
                  <td data-label="Telefone">{c.telefone || "—"}</td>
                  <td data-label="E-mail">{c.email || "—"}</td>
                  <td data-label="Cidade">{c.cidade || "—"}</td>
                  <td data-label="Ações">
                    <div className="row-actions">
                      <button className="btn secondary sm" onClick={() => abrirEdicao(c)}>Editar</button>
                      <button className="btn danger sm" onClick={() => remover(c.id)}>
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
        title={editandoId ? "Editar cliente" : "Novo cliente"}
        subtitle="Dados completos do cliente, dono do(s) animal(is)."
      >
        <form onSubmit={salvar}>
          <div className="form-section">
            <div className="form-section-title">Dados pessoais</div>
            <div className="form-grid">
              <div className="field span-2">
                <label>Nome completo</label>
                <input value={form.nome} onChange={(e) => atualizarCampo("nome", e.target.value)} required />
              </div>
              <div className="field">
                <label>Telefone</label>
                <input value={form.telefone} onChange={(e) => atualizarCampo("telefone", e.target.value)} placeholder="(85) 99999-0000" />
              </div>
              <div className="field">
                <label>E-mail</label>
                <input type="email" value={form.email} onChange={(e) => atualizarCampo("email", e.target.value)} />
              </div>
              <div className="field">
                <label>CPF</label>
                <input value={form.cpf} onChange={(e) => atualizarCampo("cpf", e.target.value)} placeholder="000.000.000-00" />
              </div>
            </div>
          </div>

          <div className="form-section">
            <div className="form-section-title">Endereço</div>
            <div className="form-grid">
              <div className="field span-2">
                <label>Endereço</label>
                <input value={form.endereco} onChange={(e) => atualizarCampo("endereco", e.target.value)} placeholder="Rua, número, bairro" />
              </div>
              <div className="field">
                <label>Cidade</label>
                <input value={form.cidade} onChange={(e) => atualizarCampo("cidade", e.target.value)} />
              </div>
              <div className="field">
                <label>CEP</label>
                <input value={form.cep} onChange={(e) => atualizarCampo("cep", e.target.value)} placeholder="00000-000" />
              </div>
            </div>
          </div>

          <div className="form-section">
            <div className="form-section-title">Observações</div>
            <div className="field">
              <textarea rows={3} value={form.observacoes} onChange={(e) => atualizarCampo("observacoes", e.target.value)} placeholder="Informações adicionais sobre o cliente" />
            </div>
          </div>

          <div className="form-footer">
            <button type="submit" className="btn">
              <CheckIcon width={16} height={16} />
              Salvar cliente
            </button>
            <button type="button" className="btn secondary" onClick={fecharModal}>Cancelar</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
