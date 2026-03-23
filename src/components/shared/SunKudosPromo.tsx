"use client";

import Button from "@/components/ui/Button";
import { useLocale } from "@/hooks/useLocale";

interface SunKudosPromoProps {
  className?: string;
}

export default function SunKudosPromo({ className = "" }: SunKudosPromoProps) {
  const { t } = useLocale();

  return (
    <section
      className={`w-full max-w-content flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12 ${className}`}
      aria-labelledby="kudos-title"
    >
      {/* Content */}
      <div className="flex flex-col gap-4 lg:gap-6 flex-1">
        <p className="font-[family-name:var(--font-montserrat)] text-base font-bold text-white">
          {t.home.kudosPromoSubtitle}
        </p>
        <h2
          id="kudos-title"
          className="font-[family-name:var(--font-montserrat)] text-3xl lg:text-[57px] lg:leading-16 font-bold text-gold-primary"
        >
          Sun* Kudos
        </h2>
        <span className="inline-block font-[family-name:var(--font-montserrat)] text-base font-bold text-gold-primary">
          {t.home.kudosPromoHighlight}
        </span>
        <p className="font-[family-name:var(--font-montserrat)] text-base font-bold text-white tracking-[0.5px] leading-6">
          {t.home.kudosPromoDescription}
        </p>
        <div className="mt-2">
          <Button variant="outlined" href="/kudos">
            {t.home.details}
          </Button>
        </div>
      </div>

      {/* KUDOS decorative text */}
      <div className="hidden lg:flex items-center">
        <span className="font-[family-name:var(--font-gotham)] text-[96px] font-normal leading-6 text-kudos-text tracking-[-0.13em] select-none">
          KUDOS
        </span>
      </div>
    </section>
  );
}
