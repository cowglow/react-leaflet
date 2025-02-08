import { useMarkers } from "hooks/use-markers.ts";
import { useCoordinates } from "hooks/use-coordinates.ts";
import {
  ActionMenuDescription,
  Divider,
} from "components/action-menu/types.ts";
import ActionMenuItem from "components/action-menu/ActionMenuItem.tsx";

function ActionMenu() {
  const { addMarker, clearMarkers, enable, setEnable } = useMarkers();
  const { getRandomCoordinates } = useCoordinates();

  const actionMenuConfig: Record<string, (ActionMenuDescription | Divider)[]> =
    {
      File: [
        { label: "Action", action: () => console.log("Action") },
        {
          label: "Another Action",
          action: () => console.log("Another Action"),
        },
        {
          label: "Something else here",
          action: () => console.log("Something else here"),
        },
        "---",
        { label: "sakun's twitter", href: "https://x.com/sakofchit" },
      ],
      Edit: [
        {
          label: enable ? "...writable" : "Capture Markers",
          action: () => setEnable(!enable),
        },
        "---",
        { label: "Clear Markers", action: clearMarkers },
      ],
      View: [
        {
          label: "system.css",
          href: "https://sakofchit.github.io/system.css/",
        },
        {
          label: "GitHub Repo",
          href: "https://github.com/cowglow/react-leaflet",
        },
      ],
      Special: [
        {
          label: "Fetch Randoms",
          action: async () => {
            try {
              const data = await getRandomCoordinates();
              data.forEach(addMarker);
            } catch (error) {
              console.log("Fetch Error!! ", error);
            }
          },
        },
      ],
    };
  const topMenuNames = Object.keys(actionMenuConfig);

  return (
    <ul
      role="menu-bar"
      className="standard-dialog"
      onMouseEnter={() => setEnable(false)}
    >
      {topMenuNames.map((menuName) => (
        <li role="menu-item" tabIndex={0} aria-haspopup="true">
          {menuName}
          <ul role="menu">
            {actionMenuConfig[menuName].map((config) => (
              <ActionMenuItem config={config} />
            ))}
          </ul>
        </li>
      ))}
    </ul>
  );
}

export default ActionMenu;
