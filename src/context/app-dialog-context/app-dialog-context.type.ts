export type DialogType = null | "MEMBER_DIALOG" | "ORGANIZATION_DIALOG";

interface DialogContextProps {
  dialog: DialogType | null;
}

export type DialogContextApi = {
  openDialog: (dialog: DialogType) => void;
} & DialogContextProps;
