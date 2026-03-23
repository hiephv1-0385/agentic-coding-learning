"use client";

import { useLocale } from "@/hooks/useLocale";

export default function LoginFooter() {
  const { t } = useLocale();

  return (
    <footer className="relative z-10 h-16 border-t border-footer-border flex items-center justify-center px-4 lg:px-[72px]">
      <p className="font-[family-name:var(--font-montserrat)] text-sm text-white">
        {t.login.copyright}
      </p>
    </footer>
  );
}
