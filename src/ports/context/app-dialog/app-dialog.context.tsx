import { DialogContextApi } from "ports/context/app-dialog/app-dialog.types.ts";
import { createContext } from "react";

const defaultValues: DialogContextApi = {
  dialog: null,
  payload: null,
  openDialog: () => {
    throw Error("ERROR:: Open Dialog | Uninitialized ");
  },
};

export const AppDialogContext = createContext<DialogContextApi>(defaultValues);