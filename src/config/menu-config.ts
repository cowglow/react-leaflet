import {
  ActionMenuDescription,
  Divider,
} from "components/action-menu/types.ts";
import {
  DELETE_MARKER,
  READ_MARKER,
  UPDATE_MARKER,
} from "context/redux-store/actions/marker/marker-action-types.ts";
import { CREATE_MEMBER } from "context/redux-store/actions/member/member-action-types.ts";

export function menuConfig() {
  const actionMenuConfig: Record<string, (ActionMenuDescription | Divider)[]> =
    {
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
        "---",
        { label: "Add Member", action: CREATE_MEMBER },
        { label: "Add Organization", action: "Edit" },
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
  return actionMenuConfig;
}
