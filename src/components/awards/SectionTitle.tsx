"use client";

import { useLocale } from "@/hooks/useLocale";

export default function SectionTitle() {
  const { t } = useLocale();

  return (
    <div className="flex w-full flex-col items-start">
      <p className="w-full text-center font-[family-name:var(--font-montserrat)] text-base font-bold text-white sm:text-2xl sm:leading-8">
        {t.awards.sectionSubtitle}
      </p>
      <hr className="my-4 h-px w-full border-0 bg-divider" />
      <h1 className="w-full text-center font-[family-name:var(--font-montserrat)] text-[28px] font-bold leading-tight tracking-[-0.25px] text-gold-primary sm:text-[40px] lg:text-[57px] lg:leading-[64px]">
        {t.awards.sectionTitle}
      </h1>
    </div>
  );
}
