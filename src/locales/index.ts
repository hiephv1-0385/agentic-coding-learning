import vi from "./vi";
import en from "./en";
import type { TranslationKeys } from "./vi";

export type Locale = "vi" | "en";

const translations: Record<Locale, TranslationKeys> = { vi, en };

export function getTranslations(locale: Locale): TranslationKeys {
  return translations[locale] ?? translations.vi;
}

export type { TranslationKeys };
