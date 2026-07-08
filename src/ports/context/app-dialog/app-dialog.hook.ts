import { useContext } from "react";
import { AppDialogContext } from "ports/context/app-dialog/app-dialog.context.tsx";

export const useDialogContext = () => useContext(AppDialogContext);