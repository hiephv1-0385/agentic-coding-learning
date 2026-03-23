"use client";

import Image from "next/image";
import { useLocale } from "@/hooks/useLocale";

type HeroTier = "new" | "rising" | "super" | "legend";

interface HeroBadgeProps {
  tier: HeroTier;
}

const BADGE_IMAGES: Record<HeroTier, string> = {
  new: "/images/rules/badge-new-hero.png",
  rising: "/images/rules/badge-rising-hero.png",
  super: "/images/rules/badge-super-hero.png",
  legend: "/images/rules/badge-legend-hero.png",
};

const TIER_ALT_TEXT: Record<HeroTier, string> = {
  new: "New Hero",
  rising: "Rising Hero",
  super: "Super Hero",
  legend: "Legend Hero",
};

export default function HeroBadge({ tier }: HeroBadgeProps) {
  const { t } = useLocale();

  const thresholdMap: Record<HeroTier, string> = {
    new: t.rules.newHeroThreshold,
    rising: t.rules.risingHeroThreshold,
    super: t.rules.superHeroThreshold,
    legend: t.rules.legendHeroThreshold,
  };

  const descriptionMap: Record<HeroTier, string> = {
    new: t.rules.newHeroDescription,
    rising: t.rules.risingHeroDescription,
    super: t.rules.superHeroDescription,
    legend: t.rules.legendHeroDescription,
  };

  return (
    <div className="w-full max-w-[400px]">
      <div className="flex items-center gap-2">
        <Image
          src={BADGE_IMAGES[tier]}
          alt={TIER_ALT_TEXT[tier]}
          width={126}
          height={22}
          className="shrink-0 rounded-full border border-[#FFEA9E]"
        />
        <span className="text-base font-bold leading-6 tracking-[0.5px] text-white">
          {thresholdMap[tier]}
        </span>
      </div>
      <p className="mt-2 text-sm font-bold leading-5 tracking-[0.1px] text-white">
        {descriptionMap[tier]}
      </p>
    </div>
  );
}
