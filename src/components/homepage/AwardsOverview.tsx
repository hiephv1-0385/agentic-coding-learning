"use client";

import type { AwardCategory } from "@/types/award";
import AwardGrid from "@/components/homepage/AwardGrid";
import { useLocale } from "@/hooks/useLocale";

interface AwardsOverviewProps {
  awards: AwardCategory[] | null;
}

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex flex-col gap-3 animate-pulse">
          <div className="aspect-square bg-white/5 rounded-lg" />
          <div className="h-8 bg-white/5 rounded w-3/4" />
          <div className="h-12 bg-white/5 rounded" />
          <div className="h-6 bg-white/5 rounded w-1/3" />
        </div>
      ))}
    </div>
  );
}

export default function AwardsOverview({ awards }: AwardsOverviewProps) {
  const { t } = useLocale();

  return (
    <section
      className="w-full max-w-content flex flex-col gap-20"
      aria-labelledby="awards-title"
    >
      {/* Section Header */}
      <div className="flex flex-col gap-4">
        <p className="font-[family-name:var(--font-montserrat)] text-xl lg:text-2xl font-bold text-white">
          {t.home.awardsSubtitle}
        </p>
        <h2
          id="awards-title"
          className="font-[family-name:var(--font-montserrat)] text-3xl lg:text-[57px] lg:leading-16 font-bold text-gold-primary"
        >
          {t.home.awardsTitle}
        </h2>
        <p className="font-[family-name:var(--font-montserrat)] text-base font-bold text-white tracking-[0.5px]">
          {t.home.awardsDescription}
        </p>
      </div>

      {/* Award Grid or Skeleton */}
      {awards ? <AwardGrid awards={awards} /> : <SkeletonGrid />}
    </section>
  );
}
