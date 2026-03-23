import type { TranslationKeys } from "@/locales/vi";

/**
 * Translates a Vietnamese text value stored in the database to the current locale.
 * If no translation is found, returns the original text as-is.
 */
export function translateDbText(
  text: string,
  t: TranslationKeys
): string {
  const mapping = t.dbTexts as Record<string, string>;
  return mapping[text] ?? text;
}
