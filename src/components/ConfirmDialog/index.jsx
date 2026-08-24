import Modal from "../Modal";
import { AlertIcon } from "../Icons";
import "./style.css";

export default function ConfirmDialog({ open, title, description, confirmLabel = "Excluir", onConfirm, onClose, loading }) {
  return (
    <Modal open={open} onClose={onClose} title={title || "Confirmar exclusão"}>
      <div className="confirm-dialog">
        <div className="confirm-dialog-icon">
          <AlertIcon width={22} height={22} />
        </div>
        <p>{description}</p>
      </div>
      <div className="form-footer">
        <button type="button" className="btn danger" onClick={onConfirm} disabled={loading}>
          {loading ? "Excluindo..." : confirmLabel}
        </button>
        <button type="button" className="btn secondary" onClick={onClose} disabled={loading}>Cancelar</button>
      </div>
    </Modal>
  );
}
