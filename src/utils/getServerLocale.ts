import { cookies } from "next/headers";
import { getTranslations } from "@/locales";
import type { Locale, TranslationKeys } from "@/locales";

export async function getServerTranslations(): Promise<TranslationKeys> {
  const cookieStore = await cookies();
  const locale = (cookieStore.get("locale")?.value as Locale) || "vi";
  return getTranslations(locale);
}
