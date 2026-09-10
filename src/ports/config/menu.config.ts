import { MenuConfigItem } from "ports/components/action-menu/action-menu.types.ts";
import { openWindow } from "infrastructure/redux/windows/windows.slice.ts";
import type { AppDispatch } from "infrastructure/redux/store.ts";
import { Role } from "infrastructure/redux/auth/auth.slice.ts";
import type { Translations } from "ports/i18n/translations/index.ts";
import { languages, languageLabels, type Language } from "ports/i18n/language.ts";

export type MenuConfig = Record<string, MenuConfigItem[]>;

export function createMenuConfig(
  dispatch: AppDispatch,
  role: Role | null,
  t: Translations,
  setLanguage: (language: Language) => void,
  onImport: () => void,
  onExportCsv: () => void,
  onExportGeoJson: () => void,
): MenuConfig {
  return {
    [t.menu.file]: [
      { label: t.menu.import, action: onImport },
      { label: t.menu.exportCsv, action: onExportCsv },
      { label: t.menu.exportGeoJson, action: onExportGeoJson },
      "---",
      {
        label: t.menu.language,
        items: languages.map((language) => ({
          label: languageLabels[language],
          action: () => setLanguage(language),
        })),
      },
    ],
    [t.menu.actions]: [
      ...(role === "leader"
        ? ([
            {
              label: t.menu.addOrganization,
              action: () => dispatch(openWindow({ type: "ORGANIZATION_DIALOG" })),
            },
            {
              label: t.menu.inviteAccount,
              action: () => dispatch(openWindow({ type: "INVITE_DIALOG" })),
            },
            "---",
          ] as MenuConfigItem[])
        : []),
      {
        label: t.menu.organizations,
        action: () => dispatch(openWindow({ type: "ORGANIZATION_TREE_DIALOG" })),
      },
      {
        label: t.menu.map,
        action: () => dispatch(openWindow({ type: "MAP_DIALOG" })),
      },
    ],
    [t.menu.about]: [
      { label: t.menu.systemCss, href: "https://sakofchit.github.io/system.css/" },
      { label: t.menu.sakunsTwitter, href: "https://x.com/sakofchit" },
      "---",
      { label: t.menu.githubRepo, href: "https://github.com/cowglow/visual-directory" },
    ],
  };
}
