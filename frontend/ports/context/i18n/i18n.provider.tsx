import { PropsWithChildren } from "react";
import { I18nContext } from "ports/context/i18n/i18n.context.ts";
import { useLocalStorage } from "ports/hooks/use-local-storage.ts";
import { translations } from "ports/i18n/translations/index.ts";
import type { Language } from "ports/i18n/language.ts";

export function I18nContextProvider({ children }: PropsWithChildren) {
  const [language, setLanguage] = useLocalStorage<Language>({ key: "LANGUAGE", defaultValue: "en" });

  return (
    <I18nContext.Provider value={{ language, setLanguage, t: translations[language] }}>
      {children}
    </I18nContext.Provider>
  );
}
