"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { useCountdown } from "@/hooks/useCountdown";
import { useLocale } from "@/hooks/useLocale";
import { TimeUnit } from "./TimeUnit";

interface CountdownPrelaunchPageProps {
  targetDate: Date | string;
  backgroundImageSrc: string;
  onComplete?: () => void;
}

export function CountdownPrelaunchPage({
  targetDate,
  backgroundImageSrc,
  onComplete,
}: CountdownPrelaunchPageProps) {
  const router = useRouter();
  const { t } = useLocale();

  const handleComplete = useCallback(() => {
    onComplete?.();
    router.push("/");
  }, [onComplete, router]);

  const { days, hours, minutes, isExpired } = useCountdown({
    targetDate,
    intervalMs: 1000,
    onComplete: handleComplete,
  });

  const displayDays = isExpired ? "00" : days;
  const displayHours = isExpired ? "00" : hours;
  const displayMinutes = isExpired ? "00" : minutes;

  return (
    <div className="relative w-full min-h-screen bg-page-bg overflow-hidden max-[319px]:overflow-y-auto">
      {/* A: Background Image */}
      <Image
        src={backgroundImageSrc}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover z-0 opacity-0 animate-[fadeIn_500ms_ease-in_forwards]"
        aria-hidden="true"
      />

      {/* B: Gradient Overlay */}
      <div
        className="absolute inset-0 z-[1] bg-[linear-gradient(18deg,#00101A_15.48%,rgba(0,18,29,0.46)_52.13%,rgba(0,19,32,0)_63.41%)]"
        aria-hidden="true"
      />

      {/* C: Content */}
      <main className="relative z-[2] flex flex-col items-center justify-center min-h-screen py-6 px-4 sm:py-12 sm:px-12 lg:py-24 lg:px-36 gap-6 opacity-0 animate-[fadeUp_600ms_ease-out_forwards]">
        {/* D: Title */}
        <h1 className="font-bold italic font-[family-name:var(--font-montserrat)] text-white text-center text-xl leading-7 sm:text-[28px] sm:leading-9 lg:text-[36px] lg:leading-[48px]">
          {t.prelaunch.title}
        </h1>

        {/* E: Countdown Row */}
        <div
          className="flex flex-wrap gap-6 justify-center sm:gap-10 sm:flex-nowrap lg:gap-[60px] items-center"
          role="timer"
          aria-live="polite"
          aria-label={`${displayDays} ${t.prelaunch.days}, ${displayHours} ${t.prelaunch.hours}, ${displayMinutes} ${t.prelaunch.minutes}`}
        >
          <TimeUnit value={displayDays} label={t.prelaunch.days} />
          <TimeUnit value={displayHours} label={t.prelaunch.hours} />
          <TimeUnit value={displayMinutes} label={t.prelaunch.minutes} />
        </div>
      </main>
    </div>
  );
}
