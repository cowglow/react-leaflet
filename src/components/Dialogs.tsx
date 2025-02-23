import { Dialog, Paper } from "@mui/material";
import BaseForm from "components/forms/BaseForm.tsx";

export default function Dialogs() {
  return (
    <Dialog open={false} hideBackdrop>
      <Paper sx={{ p: 2 }}>
        <BaseForm />
      </Paper>
    </Dialog>
  );
}
