import {
  ActionMenuDescription,
  Divider,
} from "components/action-menu/types.ts";

export function menuConfig() {
  const actionMenuConfig: Record<string, (ActionMenuDescription | Divider)[]> =
    {
      File: [
        { label: "Open", action: () => console.log("Action") },
        { label: "Save", action: () => console.log("Action") },
        "---",
        {
          label: "Language (Coming Soon)",
          action: () => console.log("Action"),
        },
      ],
      Edit: [
        { label: "Add Marker", action: () => console.log("Edit") },
        "---",
        { label: "Add Member", action: () => console.log("Edit") },
        { label: "Add Organization", action: () => console.log("Edit") },
      ],
      Actions: [
        { label: "Fetch Markers", action: () => console.log("Action") },
        { label: "Overlay Maps", action: () => console.log("Action") },
        "---",
        { label: "Follow Me", action: () => console.log("Action") },
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
