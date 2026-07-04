import ActionMenuItem from "ports/components/action-menu/ActionMenuItem.tsx";
import { createMenuConfig } from "ports/config/menu.config.ts";
import { MenuConfigItem } from "ports/components/action-menu/action-menu.types.ts";
import { useDialogContext } from "ports/context/app-dialog/app-dialog.hook.ts";

export default function ActionMenu() {
  const { openDialog } = useDialogContext();
  const menuConfig = createMenuConfig(openDialog);
  const topMenuNames = Object.keys(menuConfig);

  return (
    <ul role="menu-bar" className="standard-dialog">
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