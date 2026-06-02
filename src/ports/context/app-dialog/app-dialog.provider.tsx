import { AppDialogContext } from "ports/context/app-dialog/app-dialog.context.tsx";
import { PropsWithChildren, useState } from "react";
import { DialogType } from "ports/context/app-dialog/app-dialog.types.ts";

type StateType = DialogType | null;

export function AppDialogContextProvider({ children }: PropsWithChildren) {
  const [dialog, setDialog] = useState<StateType>(null);
  const openDialog = (dialog: StateType) => setDialog(dialog);

  return (
    <AppDialogContext.Provider value={{ dialog, openDialog }}>
      {children}
    </AppDialogContext.Provider>
  );
}