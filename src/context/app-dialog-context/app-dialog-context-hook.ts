import { useContext } from "react";
import { AppDialogContext } from "context/app-dialog-context/app-dialog-context.tsx";

export const useDialogContext = () => useContext(AppDialogContext);
