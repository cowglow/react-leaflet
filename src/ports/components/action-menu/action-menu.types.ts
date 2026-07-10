export type Divider = "---";
export type MenuConfigItem =
  | { label: string; action: () => void }
  | { label: string; href: string }
  | { label: string; items: MenuConfigItem[] }
  | Divider;