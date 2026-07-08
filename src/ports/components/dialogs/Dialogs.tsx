import { Dialog, Paper } from "@mui/material";
import { useDialogContext } from "ports/context/app-dialog/app-dialog.hook.ts";
import { dialogConfig } from "ports/config/dialog.config.tsx";

export default function Dialogs() {
  const { dialog, payload, openDialog } = useDialogContext();
  return (
    <Dialog open={Boolean(dialog)} onClose={() => openDialog(null)} hideBackdrop={false}>
      <Paper sx={{ p: 2, gap: 2 }}>{dialog && dialogConfig[dialog](payload)}</Paper>
    </Dialog>
  );
}
