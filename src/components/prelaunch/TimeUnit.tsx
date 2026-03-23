"use client";

import { DigitCard } from "./DigitCard";

interface TimeUnitProps {
  value: string;
  label: string;
}

export function TimeUnit({ value, label }: TimeUnitProps) {
  const tens = value.charAt(0) || "0";
  const ones = value.charAt(1) || "0";

  return (
    <div className="flex flex-col w-auto items-center gap-3 sm:gap-4 lg:w-[175px] lg:items-start lg:gap-[21px]">
      {/* Digit Cards Row */}
      <div className="flex flex-row items-center gap-3 lg:gap-[21px]">
        <DigitCard digit={tens} />
        <DigitCard digit={ones} />
      </div>
      {/* Unit Label */}
      <span className="font-[family-name:var(--font-montserrat)] font-bold text-white uppercase text-xl leading-7 sm:text-[28px] sm:leading-9 lg:text-[36px] lg:leading-[48px]">
        {label}
      </span>
    </div>
  );
}
