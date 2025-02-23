import { useMarkers } from "hooks/use-markers.ts";
// import { useCoordinates } from "hooks/use-coordinates.ts";
import ActionMenuItem from "components/action-menu/ActionMenuItem.tsx";
// import useGeoLocation from "hooks/use-geo-location.ts";
// import { useMap } from "react-leaflet";
import { menuConfig } from "config/menu-config.ts";
import useActionMenu from "hooks/use-action-menu.ts";

export default function ActionMenu() {
  // const { addMarker, clearMarkers, enable, setEnable } = useMarkers();
  // const { getRandomCoordinates } = useCoordinates();
  // const { location } = useGeoLocation();
  // const map = useMap();
  const { setEnable } = useMarkers();
  const actionMenuConfig = menuConfig();
  const topMenuNames = Object.keys(actionMenuConfig);
  const { handleAction } = useActionMenu();

  return (
    <ul
      role="menu-bar"
      className="standard-dialog"
      onMouseEnter={() => setEnable(false)}
      onMouseLeave={() => setEnable(true)}
      onClick={() => setEnable(true)}
    >
      {topMenuNames.map((menuName) => (
        <li
          key={`action-menu-key-${menuName}`}
          role="menu-item"
          tabIndex={0}
          aria-haspopup="true"
        >
          {menuName}
          <ul role="menu">
            {actionMenuConfig[menuName].map((config, index) => (
              <ActionMenuItem
                key={`action-menu-index-${index}`}
                config={config}
                onClick={handleAction}
              />
            ))}
          </ul>
        </li>
      ))}
    </ul>
  );
}
