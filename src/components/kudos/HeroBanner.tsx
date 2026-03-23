"use client";

import Image from "next/image";
import Icon from "@/components/ui/Icon";
import KudoModalWrapper from "@/components/kudos/KudoModalWrapper";
import SearchPill from "@/components/kudos/SearchPill";
import { useLocale } from "@/hooks/useLocale";

export default function HeroBanner() {
  const { t } = useLocale();
  return (
    <section className="relative h-auto min-h-[300px] w-full lg:h-[512px]">
      {/* Background image */}
      <Image
        src="/images/kudos/hero-banner.png"
        alt=""
        fill
        className="object-cover"
        priority
        sizes="100vw"
      />

      {/* Gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(25deg, #00101A 14.74%, rgba(0, 19, 32, 0.00) 47.8%)",
        }}
      />

      {/* Content */}
      <div className="relative flex h-full flex-col justify-end gap-8 px-4 py-8 sm:px-12 lg:gap-10 lg:px-[var(--spacing-page-padding-x)] lg:py-16">
        <div className="flex flex-col gap-1">
          <h1 className="font-[family-name:var(--font-montserrat)] text-2xl font-bold leading-8 text-gold-primary lg:text-4xl lg:leading-[44px]">
            {t.kudos.heroTitle}
          </h1>
          <div className="flex items-end gap-1">
            <Icon name="rules" size={48} className="h-[51px] w-auto shrink-0 lg:h-[119px]" />
            <p className="font-[family-name:var(--font-gotham)] text-6xl leading-[0.85] tracking-[-13%] text-kudos-text lg:text-[139.78px]">
              KUDOS
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2 lg:flex-row lg:gap-2">
          <KudoModalWrapper />
          <SearchPill />
        </div>
      </div>
    </section>
  );
}
