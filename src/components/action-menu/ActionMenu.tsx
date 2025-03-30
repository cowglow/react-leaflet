import ActionMenuItem from "components/action-menu/ActionMenuItem.tsx";
import { createMenuConfig } from "config/createMenuConfig.ts";
import { useDispatch } from "react-redux";
import { MenuConfigItem } from "/components/action-menu/types.ts";

export default function ActionMenu() {
  const dispatch = useDispatch();
  const menuConfig = createMenuConfig(dispatch);
  const topMenuNames = Object.keys(menuConfig);

  return (
    <ul
      role="menu-bar"
      className="standard-dialog"
      // onMouseEnter={() => setEnable(false)}
      // onMouseLeave={() => setEnable(true)}
      // onClick={() => setEnable(true)}
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
            {(menuConfig[menuName] as MenuConfigItem[]).map((config, index) => (
              <ActionMenuItem
                key={`action-menu-index-${index}`}
                config={config}
              />
            ))}
          </ul>
        </li>
      ))}
    </ul>
  );
}
