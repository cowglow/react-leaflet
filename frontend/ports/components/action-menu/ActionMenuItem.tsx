import { MenuConfigItem, Divider } from "ports/components/action-menu/action-menu.types.ts";

interface ActionMenuItemProps {
  config: MenuConfigItem | Divider;
  key?: string;
}

export default function ActionMenuItem({ config }: ActionMenuItemProps) {
  if (config === "---") {
    return <hr />;
  }
  const { label, ...rest } = config;

  const clickHandler = (event) => {
    event.currentTarget.blur();
    if ("action" in rest) {
      rest.action();
    }
  };

  if ("items" in rest) {
    return (
      <li role="menu-item" tabIndex={0} aria-haspopup="true">
        {label}
        <ul role="menu">
          {rest.items.map((item, index) => (
            <ActionMenuItem key={`action-menu-submenu-item-${index}`} config={item} />
          ))}
        </ul>
      </li>
    );
  }

  return (
    <li role="menu-item">
      {"action" in rest && <button onClick={clickHandler}>{label}</button>}
      {"href" in rest && (
        <a href={rest.href} target="_blank" rel="nofollow noreferrer">
          {label}
        </a>
      )}
    </li>
  );
}