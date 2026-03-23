import React from "react";
import { render, type RenderOptions } from "@testing-library/react";
import { LocaleProvider } from "@/hooks/useLocale";
import type { Locale } from "@/locales";

interface ProviderOptions {
  locale?: Locale;
}

function renderWithProviders(
  ui: React.ReactElement,
  options?: Omit<RenderOptions, "wrapper"> & ProviderOptions
) {
  const { locale, ...renderOptions } = options ?? {};
  function Wrapper({ children }: { children: React.ReactNode }) {
    return <LocaleProvider initialLocale={locale}>{children}</LocaleProvider>;
  }
  return render(ui, { wrapper: Wrapper, ...renderOptions });
}

export { renderWithProviders };
