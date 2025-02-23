import { AppDialogContext } from "context/app-dialog-context/app-dialog-context.tsx";
import { PropsWithChildren, useState } from "react";
import { DialogType } from "context/app-dialog-context/app-dialog-context.type.ts";

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
