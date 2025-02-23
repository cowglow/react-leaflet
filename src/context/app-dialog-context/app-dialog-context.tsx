import { DialogContextApi } from "context/app-dialog-context/app-dialog-context.type.ts";
import { createContext } from "react";

const defaultValues: DialogContextApi = {
  dialog: null,
  openDialog: () => {
    throw Error("ERROR:: Open Dialog | Uninitialized ");
  },
};

export const AppDialogContext = createContext<DialogContextApi>(defaultValues);
