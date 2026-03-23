"use client";

import Link from "next/link";
import Image from "next/image";
import Icon from "@/components/ui/Icon";
import { useLocale } from "@/hooks/useLocale";
import type { AwardCategory } from "@/types/award";

interface AwardCardProps {
  award: AwardCategory;
}

export default function AwardCard({ award }: AwardCardProps) {
  const { t } = useLocale();

  return (
    <Link
      href={`/awards#award-${award.slug}`}
      className="group flex flex-col gap-3 transition-transform duration-150 ease-in-out hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-primary rounded-lg"
    >
      {/* Image with glow ring */}
      <div className="relative aspect-square">
        <Image
          src="/images/awards/glow-ring.png"
          alt=""
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 33vw"
          className="object-contain"
        />
        <div className="absolute inset-[15%]">
          <Image
            src={award.thumbnailUrl}
            alt={award.name}
            fill
            sizes="(max-width: 640px) 40vw, (max-width: 1024px) 40vw, 25vw"
            className="object-contain"
          />
        </div>
      </div>

      {/* Title */}
      <h3 className="font-[family-name:var(--font-montserrat)] text-2xl font-normal text-gold-primary">
        {award.name}
      </h3>

      {/* Description */}
      <p className="font-[family-name:var(--font-montserrat)] text-base font-normal text-white tracking-[0.5px] line-clamp-2">
        {award.shortDescription}
      </p>

      {/* Chi tiết link (visual only — card is already a Link) */}
      <span className="inline-flex items-center gap-1 font-[family-name:var(--font-montserrat)] text-base font-medium text-white tracking-[0.15px] group-hover:text-gold-primary transition-colors">
        {t.home.details}
        <Icon name="arrow-right" size={16} />
      </span>
    </Link>
  );
}
