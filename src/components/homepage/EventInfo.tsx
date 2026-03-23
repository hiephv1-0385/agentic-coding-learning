"use client";

import { formatDate } from "@/utils/formatDate";
import { translateDbText } from "@/utils/translateDbText";
import { useLocale } from "@/hooks/useLocale";

interface EventInfoProps {
  date: string;
  venue: string;
  livestreamInfo: string;
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2">
      <span className="font-[family-name:var(--font-montserrat)] text-base font-bold text-white tracking-[0.15px]">
        {label}
      </span>
      <span className="font-[family-name:var(--font-montserrat)] text-xl lg:text-2xl font-bold text-gold-primary">
        {value}
      </span>
    </div>
  );
}

export default function EventInfo({
  date,
  venue,
  livestreamInfo,
}: EventInfoProps) {
  const { t } = useLocale();

  return (
    <div className="flex flex-col gap-3">
      <InfoRow label={t.home.time} value={formatDate(date)} />
      <InfoRow label={t.home.venue} value={venue} />
      <p className="font-[family-name:var(--font-montserrat)] text-base font-bold text-white tracking-[0.5px]">
        {translateDbText(livestreamInfo, t)}
      </p>
    </div>
  );
}
