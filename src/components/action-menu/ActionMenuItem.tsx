import { MenuConfigItem, Divider } from "components/action-menu/types.ts";

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
