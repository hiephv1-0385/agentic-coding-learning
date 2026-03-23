"use client";

import { useCountdown } from "@/hooks/useCountdown";
import { useLocale } from "@/hooks/useLocale";

function CountdownDigit({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="bg-black/30 rounded px-3 py-2">
        <span className="font-[family-name:var(--font-digital)] text-[32px] lg:text-[49.15px] text-white">
          {value}
        </span>
      </div>
      <span className="font-[family-name:var(--font-montserrat)] text-base lg:text-2xl font-bold text-white">
        {label}
      </span>
    </div>
  );
}

export default function CountdownTimer() {
  const { days, hours, minutes, isExpired, isValid } = useCountdown();
  const { t } = useLocale();

  if (!isValid) return null;

  const ariaLabel = t.home.countdownAriaLabel
    .replace("{days}", days)
    .replace("{hours}", hours)
    .replace("{minutes}", minutes);

  return (
    <div className="flex flex-col items-start gap-4">
      {!isExpired && (
        <p className="font-[family-name:var(--font-montserrat)] text-2xl font-bold text-white">
          {t.home.comingSoon}
        </p>
      )}
      <div
        className="flex items-center gap-4 lg:gap-6"
        role="timer"
        aria-live="polite"
        aria-label={ariaLabel}
      >
        <CountdownDigit value={days} label={t.prelaunch.days} />
        <CountdownDigit value={hours} label={t.prelaunch.hours} />
        <CountdownDigit value={minutes} label={t.prelaunch.minutes} />
      </div>
    </div>
  );
}
