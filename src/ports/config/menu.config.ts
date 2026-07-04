import { MenuConfigItem } from "ports/components/action-menu/action-menu.types.ts";
import { DialogContextApi } from "ports/context/app-dialog/app-dialog.types.ts";

export type MenuConfig = Record<string, MenuConfigItem[]>;

export function createMenuConfig(openDialog: DialogContextApi["openDialog"]): MenuConfig {
  return {
    File: [{ label: "Language (Coming Soon)", href: "#" }],
    Actions: [{ label: "Add Organization", action: () => openDialog("ORGANIZATION_DIALOG") }],
    View: [
      { label: "system.css", href: "https://sakofchit.github.io/system.css/" },
      { label: "sakun's twitter", href: "https://x.com/sakofchit" },
      "---",
      { label: "GitHub Repo", href: "https://github.com/cowglow/react-leaflet" },
    ],
  };
}