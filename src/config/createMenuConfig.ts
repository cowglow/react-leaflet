import { AppDispatch } from "redux-store/store.ts";
import {
  clearAllMarkers,
  openFile,
  saveFile,
  setEnabled,
} from "redux-store/store/marker/marker-slice.ts";
import { MenuConfigItem } from "components/action-menu/types.ts";

export type MenuConfig = Record<string, MenuConfigItem[]>;

export function createMenuConfig(dispatch: AppDispatch) {
  const config: MenuConfig = {
    File: [
      // { label: "New", href: "javascript:alert('NEW_FILE')" },
      { label: "Open", action: () => dispatch(openFile()) },
      { label: "Save", action: () => dispatch(saveFile()) },
      "---",
      {
        label: "Language (Coming Soon)",
        href: "#",
      },
    ],
    Edit: [
      { label: "Enable Markers", action: () => dispatch(setEnabled(true)) },
      { label: "Disable Markers", action: () => dispatch(setEnabled(false)) },
      "---",
      { label: "Clear Markers", action: () => dispatch(clearAllMarkers()) },
      // { label: "Add Member", href: "javascript:alert('CREATE_MEMBER')" },
      // {
      //   label: "Add Organization",
      //   href: "javascript:alert('CREATE_ORGANIZATION')",
      // },
    ],
    Actions: [
      // { label: "Fetch Markers", action: () => dispatch({ type: "Action" }) },
      // { label: "Overlay Maps", action: () => dispatch({ type: "Action" }) },
      "---",
      // { label: "Follow Me", action: () => dispatch({ type: "Action" }) },
    ],
    View: [
      {
        label: "system.css",
        href: "https://sakofchit.github.io/system.css/",
      },
      { label: "sakun's twitter", href: "https://x.com/sakofchit" },
      "---",
      {
        label: "GitHub Repo",
        href: "https://github.com/cowglow/react-leaflet",
      },
    ],
  };
  return config;
}
