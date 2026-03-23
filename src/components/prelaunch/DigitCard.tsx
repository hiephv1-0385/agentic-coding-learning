"use client";

import { useRef, useEffect, useState } from "react";

interface DigitCardProps {
  digit: string;
}

export function DigitCard({ digit }: DigitCardProps) {
  const prevDigitRef = useRef(digit);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    if (prevDigitRef.current !== digit) {
      prevDigitRef.current = digit;
      setAnimating(true);
    }
  }, [digit]);

  const handleAnimationEnd = () => {
    setAnimating(false);
  };

  return (
    <div className="relative w-[52px] h-[83px] sm:w-[64px] sm:h-[102px] lg:w-[77px] lg:h-[123px]">
      {/* Card Background — opacity-50 on this div only so digit text stays fully opaque */}
      <div
        className="absolute inset-0 opacity-50 rounded-xl bg-[linear-gradient(180deg,#FFF_0%,rgba(255,255,255,0.10)_100%)] border-[0.75px] border-[#FFEA9E] backdrop-blur-[25px]"
        style={{ WebkitBackdropFilter: "blur(25px)" }}
      />
      {/* Digit Text */}
      <span
        className={`absolute inset-0 flex items-center justify-center font-[family-name:var(--font-digital)] text-[50px] sm:text-[61px] lg:text-[73.73px] font-normal text-white ${animating ? "animate-[digitChange_300ms_ease-in-out]" : ""}`}
        onAnimationEnd={handleAnimationEnd}
      >
        {digit}
      </span>
    </div>
  );
}
