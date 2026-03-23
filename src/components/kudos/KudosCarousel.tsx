"use client";

import { useState } from "react";
import Icon from "@/components/ui/Icon";
import { useLocale } from "@/hooks/useLocale";
import HighlightCard from "@/components/kudos/HighlightCard";
import type { Kudos } from "@/types/kudos";

interface KudosCarouselProps {
  kudos: Kudos[];
  currentUserId: string;
}

export default function KudosCarousel({
  kudos,
  currentUserId,
}: KudosCarouselProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = kudos.length;
  const { t } = useLocale();

  if (totalPages === 0) return null;

  const goToPrev = () => setCurrentPage((p) => Math.max(0, p - 1));
  const goToNext = () =>
    setCurrentPage((p) => Math.min(totalPages - 1, p + 1));

  return (
    <div
      role="region"
      aria-label={t.kudos.carouselAriaLabel}
      aria-roledescription="carousel"
    >
      {/* Carousel track */}
      <div className="relative overflow-hidden">
        {/* Left fade overlay */}
        <div className="pointer-events-none absolute left-0 top-0 z-10 hidden h-full w-[100px] lg:block"
          style={{ background: "linear-gradient(90deg, #00101A 50%, rgba(255,255,255,0) 100%)" }}
        />
        {/* Right fade overlay */}
        <div className="pointer-events-none absolute right-0 top-0 z-10 hidden h-full w-[100px] lg:block"
          style={{ background: "linear-gradient(270deg, #00101A 50%, rgba(255,255,255,0) 100%)" }}
        />

        <div
          className="flex flex-row gap-6 transition-transform duration-300 ease-in-out"
          style={{
            transform: `translateX(calc(-${currentPage * 100}% - ${currentPage * 24}px + ${totalPages > 1 ? "0px" : "0px"}))`,
          }}
        >
          {kudos.map((k, index) => (
            <div key={k.id} className="w-full shrink-0 lg:w-[528px]">
              <HighlightCard
                kudos={k}
                currentUserId={currentUserId}
                isActive={index === currentPage}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="mt-4 flex flex-row items-center justify-center gap-8">
        <button
          onClick={goToPrev}
          disabled={currentPage === 0}
          aria-label={t.kudos.previousSlide}
          className={`flex h-12 w-12 items-center justify-center rounded p-[10px] transition-opacity ${
            currentPage === 0
              ? "cursor-not-allowed opacity-30"
              : "hover:opacity-70"
          }`}
        >
          <Icon name="chevron-left" size={28} className="text-white" />
        </button>

        <span
          className="font-[family-name:var(--font-montserrat)] text-[28px] font-bold leading-9 text-text-gray"
          aria-live="polite"
        >
          {currentPage + 1}/{totalPages}
        </span>

        <button
          onClick={goToNext}
          disabled={currentPage === totalPages - 1}
          aria-label={t.kudos.nextSlide}
          className={`flex h-12 w-12 items-center justify-center rounded p-[10px] transition-opacity ${
            currentPage === totalPages - 1
              ? "cursor-not-allowed opacity-30"
              : "hover:opacity-70"
          }`}
        >
          <Icon name="chevron-right" size={28} className="text-white" />
        </button>
      </div>
    </div>
  );
}
