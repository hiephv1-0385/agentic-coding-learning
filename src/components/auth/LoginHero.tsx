"use client";

import { useLocale } from "@/hooks/useLocale";

export default function LoginHero({
  children,
}: {
  children: React.ReactNode;
}) {
  const { t } = useLocale();
  return (
    <main className="relative z-10 flex-1 flex flex-col justify-start pt-[60px] lg:pt-[120px] px-6 sm:px-12 lg:px-0 lg:pl-36">
      <h1 className="font-[family-name:var(--font-gotham)] text-[48px] sm:text-[80px] lg:text-[120px] font-normal leading-none tracking-[-0.02em] text-white">
        ROOT
        <br />
        FURTHER
      </h1>
      <p className="mt-10 font-[family-name:var(--font-montserrat)] text-base sm:text-lg lg:text-xl font-medium text-text-cream tracking-[0.5px] leading-normal">
        {t.login.tagline1}
        <br />
        {t.login.tagline2}
      </p>
      <div className="mt-6">{children}</div>
    </main>
  );
}
