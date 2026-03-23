import Image from "next/image";
import Icon from "@/components/ui/Icon";
import AwardCardStats from "@/components/awards/AwardCardStats";
import type { AwardCategory } from "@/types/award";

interface AwardCardProps {
  award: AwardCategory;
  index: number;
  id: string;
}

export default function AwardCard({ award, index, id }: AwardCardProps) {
  const isEven = index % 2 === 0;

  return (
    <div
      id={id}
      className={`flex gap-award-card-gap ${isEven ? "flex-col sm:flex-row" : "flex-col sm:flex-row-reverse"}`}
    >
      {/* Image with CSS-only fallback */}
      <div className="relative mx-auto w-full max-w-[280px] shrink-0 sm:mx-0 sm:h-[336px] sm:w-[336px] sm:max-w-none">
        <div className="absolute inset-0 flex items-center justify-center rounded-carousel-card bg-divider">
          <span className="px-4 text-center font-[family-name:var(--font-montserrat)] text-sm font-bold text-white">
            {award.name}
          </span>
        </div>
        <Image
          src={award.thumbnailUrl}
          alt={`${award.name} award badge`}
          width={336}
          height={336}
          className="relative z-10 aspect-square w-full rounded-carousel-card border border-gold-primary object-cover shadow-gold-glow sm:h-[336px] sm:w-[336px]"
        />
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col justify-center gap-4">
        <div className="flex items-center gap-2">
          <Icon name="award-prefix" size={32} className="text-gold-primary" />
          <h2
            tabIndex={-1}
            className="font-[family-name:var(--font-montserrat)] text-2xl font-bold leading-8 text-gold-primary"
          >
            {award.name}
          </h2>
        </div>

        <p className="text-justify font-[family-name:var(--font-montserrat)] text-base font-bold leading-6 tracking-[0.5px] text-white">
          {award.description}
        </p>

        <hr className="h-px w-full border-0 bg-divider" />

        <AwardCardStats award={award} />
      </div>
    </div>
  );
}
