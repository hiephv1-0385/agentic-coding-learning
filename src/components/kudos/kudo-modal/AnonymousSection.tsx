"use client";

import { useLocale } from "@/hooks/useLocale";

interface AnonymousSectionProps {
  isAnonymous: boolean;
  onAnonymousChange: (checked: boolean) => void;
  anonymousName: string;
  onAnonymousNameChange: (name: string) => void;
}

export default function AnonymousSection({
  isAnonymous,
  onAnonymousChange,
  anonymousName,
  onAnonymousNameChange,
}: AnonymousSectionProps) {
  const { t } = useLocale();
  return (
    <div className="flex flex-col w-full">
      {/* Checkbox row */}
      <label className="flex flex-row items-center gap-4 cursor-pointer">
        <div
          className={`w-6 h-6 rounded border flex items-center justify-center transition-colors duration-100 ${
            isAnonymous
              ? "bg-[var(--color-gold-primary)] border-[var(--color-border)]"
              : "bg-white border-[#999]"
          }`}
        >
          {isAnonymous && (
            <svg
              width="14"
              height="10"
              viewBox="0 0 14 10"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1 5L5 9L13 1"
                stroke="var(--color-text-dark)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </div>
        <input
          type="checkbox"
          checked={isAnonymous}
          onChange={(e) => onAnonymousChange(e.target.checked)}
          className="sr-only"
        />
        <span className="text-[22px] font-bold leading-7 text-[var(--color-text-gray)]">
          {t.modal.anonymousLabel}
        </span>
      </label>

      {/* Anonymous name input (conditional) */}
      <div
        className="overflow-hidden transition-all duration-200 ease-out"
        style={{
          maxHeight: isAnonymous ? "80px" : "0px",
          opacity: isAnonymous ? 1 : 0,
        }}
      >
        <input
          type="text"
          value={anonymousName}
          onChange={(e) => {
            if (e.target.value.length <= 50) {
              onAnonymousNameChange(e.target.value);
            }
          }}
          placeholder={t.modal.anonymousPlaceholder}
          maxLength={50}
          aria-label={t.modal.anonymousNameAriaLabel}
          className="w-full h-14 mt-4 px-6 py-4 rounded-lg border border-[var(--color-border)] bg-white text-base font-bold leading-6 tracking-[0.15px] text-[var(--color-text-dark)] placeholder:text-[var(--color-text-gray)] outline-none transition-colors duration-150 focus:border-[var(--color-gold-primary)]"
          tabIndex={isAnonymous ? 0 : -1}
        />
      </div>
    </div>
  );
}
