import { CloseIcon } from "../Icons";
import { useModalContainer } from "./Container";
import "./style.css";

export default function Modal({ open, title, subtitle, onClose, children, wide }) {
  useModalContainer({ open, onClose });

  if (!open) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className={`modal-panel ${wide ? "wide" : ""}`} onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <div>
            <h3>{title}</h3>
            {subtitle && <div className="modal-subtitle">{subtitle}</div>}
          </div>
          <button type="button" className="icon-btn modal-close" onClick={onClose} aria-label="Fechar">
            <CloseIcon width={16} height={16} />
          </button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}
