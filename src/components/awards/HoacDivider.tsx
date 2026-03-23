"use client";

import { useLocale } from "@/hooks/useLocale";

export default function HoacDivider() {
  const { t } = useLocale();

  return (
    <div className="flex items-center gap-2">
      <div className="h-px flex-1 bg-divider" />
      <span className="font-[family-name:var(--font-montserrat)] text-sm font-bold text-divider">
        {t.awards.or}
      </span>
      <div className="h-px flex-1 bg-divider" />
    </div>
  );
}
