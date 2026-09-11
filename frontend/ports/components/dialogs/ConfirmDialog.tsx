import { useTranslation } from "ports/context/i18n/i18n.hook.ts";
import "../forms/forms.css";

interface ConfirmDialogProps {
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  message,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const { t } = useTranslation();

  return (
    <div className="modal-contents">
      <span className="modal-text">{message}</span>
      <div className="field-row field-stack" style={{ justifyContent: "flex-end" }}>
        <button type="button" className="btn" onClick={onConfirm}>
          {confirmLabel ?? t.common.delete}
        </button>
        <button type="button" className="btn" onClick={onCancel}>
          {cancelLabel ?? t.common.cancel}
        </button>
      </div>
    </div>
  );
}
