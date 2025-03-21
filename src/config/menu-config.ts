import {
  ActionMenuDescription,
  Divider,
} from "components/action-menu/types.ts";
import {
  DELETE_MARKER,
  READ_MARKER,
  UPDATE_MARKER,
} from "context/redux-store/state/marker/marker-action-types.ts";
import { CREATE_MEMBER } from "context/redux-store/state/member/member-action-types.ts";
import { CREATE_ORGANIZATION } from "context/redux-store/state/organization/organization-action-type.ts";

export const menuConfig: Record<string, (ActionMenuDescription | Divider)[]> = {
  File: [
    { label: "New", action: DELETE_MARKER },
    { label: "Open", action: READ_MARKER },
    { label: "Save", action: UPDATE_MARKER },
    "---",
    {
      label: "Language (Coming Soon)",
      action: "Action",
    },
  ],
  Edit: [
    { label: "Add Marker", action: "Edit" },
    { label: "Clear Markers", action: "CLEAR_MARKERS" },
    "---",
    { label: "Add Member", action: CREATE_MEMBER },
    { label: "Add Organization", action: CREATE_ORGANIZATION },
  ],
  Actions: [
    { label: "Fetch Markers", action: "Action" },
    { label: "Overlay Maps", action: "Action" },
    "---",
    { label: "Follow Me", action: "Action" },
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
