import { Dialog, Paper } from "@mui/material";
import BaseForm from "components/forms/BaseForm.tsx";
import { useDialogContext } from "context/app-dialog-context/app-dialog-context-hook.ts";

export default function Dialogs() {
  const { dialog, openDialog } = useDialogContext();
  return (
    <Dialog
      open={Boolean(dialog)}
      onClose={() => openDialog(null)}
      hideBackdrop={false}
    >
      <Paper sx={{ p: 2, gap: 2 }}>
        <BaseForm />
      </Paper>
    </Dialog>
  );
}
