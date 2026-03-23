"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
} from "react";
import { useRouter } from "next/navigation";
import { getTranslations } from "@/locales";
import type { Locale, TranslationKeys } from "@/locales";

interface LocaleContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: TranslationKeys;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

interface LocaleProviderProps {
  initialLocale?: Locale;
  children: React.ReactNode;
}

export function LocaleProvider({ initialLocale = "vi", children }: LocaleProviderProps) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);
  const router = useRouter();

  const setLocale = useCallback(
    (newLocale: Locale) => {
      setLocaleState(newLocale);
      document.documentElement.lang = newLocale;
      try {
        document.cookie = `locale=${newLocale};path=/;max-age=${60 * 60 * 24 * 365};SameSite=Lax`;
      } catch {
        console.warn("Failed to persist locale cookie");
      }
      // Soft-refresh server components to pick up new locale
      router.refresh();
    },
    [router]
  );

  const t = useMemo(() => getTranslations(locale), [locale]);

  const value = useMemo(
    () => ({ locale, setLocale, t }),
    [locale, setLocale, t]
  );

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}

export function useLocale(): LocaleContextValue {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error("useLocale must be used within a LocaleProvider");
  }
  return context;
}
