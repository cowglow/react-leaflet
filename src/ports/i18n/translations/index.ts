import type { Language } from "ports/i18n/language.ts";
import en from "ports/i18n/translations/en.ts";
import de from "ports/i18n/translations/de.ts";
import es from "ports/i18n/translations/es.ts";

export type { Translations } from "ports/i18n/translations/en.ts";

export const translations: Record<Language, typeof en> = { en, de, es };
