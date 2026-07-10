import { useDialogContext } from "ports/context/app-dialog/app-dialog.hook.ts";
import { dialogConfig } from "ports/config/dialog.config.tsx";
import "./dialogs.css";

export default function Dialogs() {
  const { dialog, payload, openDialog } = useDialogContext();

  if (!dialog) {
    return null;
  }

  return (
    <div className="dialog-backdrop" onClick={() => openDialog(null)}>
      <div onClick={(event) => event.stopPropagation()}>{dialogConfig[dialog](payload)}</div>
    </div>
  );
}
