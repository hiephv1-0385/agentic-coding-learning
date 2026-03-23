"use client";

import Image from "next/image";
import { useLocale } from "@/hooks/useLocale";

export default function RootFurtherContent() {
  const { t } = useLocale();
  return (
    <section
      className="w-full max-w-content-narrow bg-content-section-bg rounded-[--radius-content-section] px-6 sm:px-12 lg:px-[104px] py-10 sm:py-20 lg:py-[120px] flex flex-col items-center gap-8"
      aria-labelledby="root-further-title"
    >
      {/* ROOT FURTHER graphic */}
      <div className="flex flex-col items-center gap-0">
        <Image
          src="/images/root-further.png"
          alt=""
          width={400}
          height={80}
          className="w-auto h-auto max-w-full"
        />
        <Image
          src="/images/root-further-bg.png"
          alt=""
          width={400}
          height={80}
          className="w-auto h-auto max-w-full"
          aria-hidden="true"
        />
      </div>

      <h2 id="root-further-title" className="sr-only">
        Root Further
      </h2>

      {/* Description paragraphs */}
      <div className="flex flex-col gap-6 text-center">
        <p className="font-[family-name:var(--font-montserrat)] text-lg lg:text-2xl font-bold text-white leading-8">
          {t.home.rootFurtherParagraph1}
        </p>
        <p className="font-[family-name:var(--font-montserrat)] text-lg lg:text-2xl font-bold text-white leading-8">
          {t.home.rootFurtherParagraph2}
        </p>
      </div>

      {/* English quote */}
      <p className="font-[family-name:var(--font-montserrat)] text-base lg:text-xl font-bold text-white/80 italic text-center">
        {t.home.rootFurtherQuote}
      </p>
    </section>
  );
}
