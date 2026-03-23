"use client";

import { useLocale } from "@/hooks/useLocale";

interface DanhHieuInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export default function DanhHieuInput({
  value,
  onChange,
  error,
}: DanhHieuInputProps) {
  const { t } = useLocale();
  const borderClass = error
    ? "border-[var(--color-required)]"
    : "border-[var(--color-border)] focus:border-[var(--color-gold-primary)]";

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex flex-row items-center gap-4">
        <label className="flex items-center gap-[2px] shrink-0 text-[22px] font-bold leading-7 text-[var(--color-text-dark)]">
          {t.modal.danhHieu}
          <span className="font-[family-name:var(--font-noto-sans-jp,_'Noto_Sans_JP')] text-base font-bold leading-5 text-[var(--color-required)]">
            *
          </span>
        </label>

        <input
          type="text"
          value={value}
          onChange={(e) => {
            if (e.target.value.length <= 100) {
              onChange(e.target.value);
            }
          }}
          placeholder={t.modal.danhHieuPlaceholder}
          maxLength={100}
          aria-required="true"
          aria-label={t.modal.danhHieu}
          className={`w-[514px] h-14 px-6 py-4 rounded-lg border bg-white text-base font-bold leading-6 tracking-[0.15px] text-[var(--color-text-dark)] placeholder:text-[var(--color-text-gray)] outline-none transition-colors duration-150 ${borderClass}`}
        />
      </div>

      <p className="text-base font-bold leading-6 text-[var(--color-text-gray)] ml-[calc(139px+16px)]">
        {t.modal.danhHieuExample}
      </p>
    </div>
  );
}
