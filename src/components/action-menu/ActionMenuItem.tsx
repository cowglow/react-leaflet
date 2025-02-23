import {
  ActionMenuDescription,
  Divider,
} from "components/action-menu/types.ts";

interface ActionMenuItemProps {
  config: ActionMenuDescription | Divider;
  key?: string;
}

export default function ActionMenuItem({ config }: ActionMenuItemProps) {
  if (config === "---") {
    return <hr />;
  }
  const { label, ...rest } = config;

  return (
    <li role="menu-item">
      {"action" in rest && (
        <a href="#" onClick={() => rest.action()}>
          {label}
        </a>
      )}
      {"href" in rest && (
        <a href={rest.href} target="_blank" rel="nofollow noreferrer">
          {label}
        </a>
      )}
    </li>
  );
}
