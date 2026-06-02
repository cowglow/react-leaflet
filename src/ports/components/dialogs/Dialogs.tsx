import { Dialog, Paper } from "@mui/material";
import BaseForm from "ports/components/forms/BaseForm.tsx";
import { useDialogContext } from "ports/context/app-dialog/app-dialog.hook.ts";
import { dialogConfig } from "config/dialog.config.tsx";

export default function Dialogs() {
  const { dialog, openDialog } = useDialogContext();
  return (
    <Dialog
      open={Boolean(dialog)}
      onClose={() => openDialog(null)}
      hideBackdrop={false}
    >
      <Paper sx={{ p: 2, gap: 2 }}>
        {dialogConfig[dialog]}
        <BaseForm />
      </Paper>
    </Dialog>
  );
}