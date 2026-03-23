"use client";

import Button from "@/components/ui/Button";
import { useLocale } from "@/hooks/useLocale";

export default function AwardsSunKudosSection() {
  const { t } = useLocale();
  return (
    <section className="flex w-full flex-col items-center gap-4 rounded-kudos-card bg-section-bg p-6 lg:h-[500px] lg:flex-row lg:items-center lg:justify-between lg:overflow-hidden lg:p-16">
      <div className="flex flex-col gap-4 lg:w-[457px]">
        <p className="font-[family-name:var(--font-montserrat)] text-2xl font-bold text-gold-primary">
          {t.awards.kudosPromoSubtitle}
        </p>
        <h2 className="font-[family-name:var(--font-montserrat)] text-[57px] font-bold leading-[64px] tracking-[-0.25px] text-gold-primary">
          Sun* Kudos
        </h2>
        <p className="text-justify font-[family-name:var(--font-montserrat)] text-base font-bold leading-6 tracking-[0.5px] text-white">
          <span className="block">{t.awards.kudosPromoHighlight}</span>
          {t.awards.kudosPromoDescription}
        </p>
        <div>
          <Button variant="warm" href="/kudos" showArrow>
            {t.awards.details}
          </Button>
        </div>
      </div>
      <div className="hidden items-center lg:flex">
        <span
          className="select-none font-[family-name:var(--font-gotham)] text-[96px] font-normal tracking-[-0.13em] text-kudos-text"
          aria-hidden="true"
        >
          KUDOS
        </span>
      </div>
    </section>
  );
}
