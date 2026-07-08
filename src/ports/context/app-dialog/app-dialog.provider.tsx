import { AppDialogContext } from "ports/context/app-dialog/app-dialog.context.tsx";
import { PropsWithChildren, useState } from "react";
import { DialogPayload, DialogType } from "ports/context/app-dialog/app-dialog.types.ts";

export function AppDialogContextProvider({ children }: PropsWithChildren) {
  const [dialog, setDialog] = useState<DialogType | null>(null);
  const [payload, setPayload] = useState<DialogPayload | null>(null);

  const openDialog = (nextDialog: DialogType | null, nextPayload: DialogPayload | null = null) => {
    setDialog(nextDialog);
    setPayload(nextPayload);
  };

  return (
    <AppDialogContext.Provider value={{ dialog, payload, openDialog }}>
      {children}
    </AppDialogContext.Provider>
  );
}
