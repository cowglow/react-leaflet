import {
  ActionMenuDescription,
  Divider,
} from "components/action-menu/types.ts";

interface ActionMenuItemProps {
  config: ActionMenuDescription | Divider;
  onClick: (action: string) => void;
  key?: string;
}

export default function ActionMenuItem({
  config,
  onClick,
}: ActionMenuItemProps) {
  if (config === "---") {
    return <hr />;
  }
  const { label, ...rest } = config;

  return (
    <li role="menu-item">
      {"action" in rest && (
        <button onClick={() => onClick(rest.action)}>{label}</button>
      )}
      {"href" in rest && (
        <a href={rest.href} target="_blank" rel="nofollow noreferrer">
          {label}
        </a>
      )}
    </li>
  );
}
