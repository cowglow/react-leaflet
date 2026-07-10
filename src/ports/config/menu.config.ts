import { MenuConfigItem } from "ports/components/action-menu/action-menu.types.ts";
import { DialogContextApi } from "ports/context/app-dialog/app-dialog.types.ts";
import { Role } from "infrastructure/redux/auth/auth.slice.ts";
import type { Translations } from "ports/i18n/translations/index.ts";
import { languages, languageLabels, type Language } from "ports/i18n/language.ts";

export type MenuConfig = Record<string, MenuConfigItem[]>;

export function createMenuConfig(
  openDialog: DialogContextApi["openDialog"],
  role: Role | null,
  t: Translations,
  setLanguage: (language: Language) => void,
): MenuConfig {
  return {
    [t.menu.file]: [
      {
        label: t.menu.language,
        items: languages.map((language) => ({
          label: languageLabels[language],
          action: () => setLanguage(language),
        })),
      },
    ],
    ...(role === "leader"
      ? {
          [t.menu.actions]: [
            { label: t.menu.addOrganization, action: () => openDialog("ORGANIZATION_DIALOG") },
            { label: t.menu.inviteAccount, action: () => openDialog("INVITE_DIALOG") },
          ] as MenuConfigItem[],
        }
      : {}),
    [t.menu.view]: [
      { label: t.menu.organizations, action: () => openDialog("ORGANIZATION_TREE_DIALOG") },
      "---",
      { label: t.menu.systemCss, href: "https://sakofchit.github.io/system.css/" },
      { label: t.menu.sakunsTwitter, href: "https://x.com/sakofchit" },
      "---",
      { label: t.menu.githubRepo, href: "https://github.com/cowglow/visual-directory" },
    ],
  };
}
