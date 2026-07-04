import { AppDispatch } from "infrastructure/redux/store.ts";
import {
  clearAllMarkers,
  openFile,
  saveFile,
  setEnabled,
} from "infrastructure/redux/marker/marker.slice.ts";
import { MenuConfigItem } from "ports/components/action-menu/action-menu.types.ts";

export type MenuConfig = Record<string, MenuConfigItem[]>;

export function createMenuConfig(dispatch: AppDispatch): MenuConfig {
  return {
    File: [
      { label: "Open", action: () => dispatch(openFile()) },
      { label: "Save", action: () => dispatch(saveFile()) },
      "---",
      { label: "Language (Coming Soon)", href: "#" },
    ],
    Edit: [
      { label: "Enable Markers", action: () => dispatch(setEnabled(true)) },
      { label: "Disable Markers", action: () => dispatch(setEnabled(false)) },
      "---",
      { label: "Clear Markers", action: () => dispatch(clearAllMarkers()) },
    ],
    Actions: ["---"],
    View: [
      { label: "system.css", href: "https://sakofchit.github.io/system.css/" },
      { label: "sakun's twitter", href: "https://x.com/sakofchit" },
      "---",
      { label: "GitHub Repo", href: "https://github.com/cowglow/react-leaflet" },
    ],
  };
}