"use client";

import { useLocale } from "@/hooks/useLocale";
import CollectionBadge from "@/components/rules/CollectionBadge";

const BADGES = [
  { key: "badgeRevival" as const, image: "/images/rules/icon-revival.png" },
  {
    key: "badgeTouchOfLight" as const,
    image: "/images/rules/icon-touch-of-light.png",
  },
  { key: "badgeStayGold" as const, image: "/images/rules/icon-stay-gold.png" },
  {
    key: "badgeFlowToHorizon" as const,
    image: "/images/rules/icon-flow-to-horizon.png",
  },
  {
    key: "badgeBeyondTheBoundary" as const,
    image: "/images/rules/icon-beyond-the-boundary.png",
  },
  {
    key: "badgeRootFurther" as const,
    image: "/images/rules/icon-root-further.png",
  },
] as const;

export default function CollectionBadgeGrid() {
  const { t } = useLocale();

  const row1 = BADGES.slice(0, 3);
  const row2 = BADGES.slice(3, 6);

  return (
    <div className="flex flex-col gap-4 px-12">
      <div className="flex justify-between gap-4">
        {row1.map((badge) => (
          <CollectionBadge
            key={badge.key}
            name={t.rules[badge.key]}
            imageSrc={badge.image}
          />
        ))}
      </div>
      <div className="flex justify-between gap-4">
        {row2.map((badge) => (
          <CollectionBadge
            key={badge.key}
            name={t.rules[badge.key]}
            imageSrc={badge.image}
          />
        ))}
      </div>
    </div>
  );
}
