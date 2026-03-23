"use client";

import { useState, useEffect, useRef } from "react";
import { useLocale } from "@/hooks/useLocale";
import type { Locale } from "@/locales";

interface LanguageOption {
  code: Locale;
  label: string;
  flag: React.ReactNode;
}

const VietnamFlag = () => (
  <span className="w-6 h-6 flex items-center justify-center">
    <svg width="20" height="14" viewBox="0 0 20 14" fill="none" aria-hidden="true">
      <rect width="20" height="14" rx="1" fill="#DA251D" />
      <path
        d="M10 2.5L11.12 5.94H14.74L11.81 8.06L12.93 11.5L10 9.38L7.07 11.5L8.19 8.06L5.26 5.94H8.88L10 2.5Z"
        fill="#FFEA9E"
      />
    </svg>
  </span>
);

const UKFlag = () => (
  <span className="w-6 h-6 flex items-center justify-center">
    <svg width="20" height="14" viewBox="0 0 20 14" fill="none" aria-hidden="true">
      <rect width="20" height="14" rx="1" fill="#012169" />
      <path d="M0 0L8.5 5.5M20 0L11.5 5.5M0 14L8.5 8.5M20 14L11.5 8.5" stroke="white" strokeWidth="1.5" />
      <path d="M0 0L8.5 5.5M20 0L11.5 5.5M0 14L8.5 8.5M20 14L11.5 8.5" stroke="#C8102E" strokeWidth="0.8" />
      <path d="M10 0V14M0 7H20" stroke="white" strokeWidth="3" />
      <path d="M10 0V14M0 7H20" stroke="#C8102E" strokeWidth="1.5" />
    </svg>
  </span>
);

const LANGUAGES: LanguageOption[] = [
  { code: "vi", label: "VN", flag: <VietnamFlag /> },
  { code: "en", label: "EN", flag: <UKFlag /> },
];

export default function LanguageSelector() {
  const { locale, setLocale, t } = useLocale();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const optionsRef = useRef<(HTMLButtonElement | null)[]>([]);

  const currentLang = LANGUAGES.find((l) => l.code === locale)!;
  const focusedIndex = LANGUAGES.findIndex((l) => l.code === locale);

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        triggerRef.current?.focus();
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        triggerRef.current?.focus();
        setIsOpen(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const selectLanguage = (code: Locale) => {
    setLocale(code);
    triggerRef.current?.focus();
    setIsOpen(false);
  };

  const handleTriggerKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      setIsOpen(true);
      // Focus first option after opening
      setTimeout(() => optionsRef.current[focusedIndex]?.focus(), 0);
    }
  };

  const handleOptionKeyDown = (e: React.KeyboardEvent, index: number) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        optionsRef.current[(index + 1) % LANGUAGES.length]?.focus();
        break;
      case "ArrowUp":
        e.preventDefault();
        optionsRef.current[(index - 1 + LANGUAGES.length) % LANGUAGES.length]?.focus();
        break;
      case "Escape":
        e.preventDefault();
        triggerRef.current?.focus();
        setIsOpen(false);
        break;
    }
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleTriggerKeyDown}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={t.header.selectLanguage}
        className="w-[108px] h-14 p-4 flex items-center justify-between rounded font-[family-name:var(--font-montserrat)] text-base font-bold leading-6 tracking-[0.15px] text-white cursor-pointer transition-colors hover:bg-gold-10 focus-visible:outline-2 focus-visible:outline-border focus-visible:outline-offset-[-2px]"
      >
        <span className="flex items-center gap-1">
          {currentLang.flag}
          <span>{currentLang.label}</span>
        </span>
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
          className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        >
          <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <div
        role="listbox"
        aria-label={t.header.selectLanguage}
        aria-hidden={!isOpen}
        className={`absolute right-0 top-full mt-1 z-20 bg-container-dark border border-border rounded-lg p-1.5 flex flex-col items-start transition-all duration-150 ease-out ${isOpen ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-1 pointer-events-none"}`}
      >
        {LANGUAGES.map((lang, index) => (
          <button
            key={lang.code}
            ref={(el) => { optionsRef.current[index] = el; }}
            type="button"
            role="option"
            aria-selected={locale === lang.code}
            onClick={() => selectLanguage(lang.code)}
            onKeyDown={(e) => handleOptionKeyDown(e, index)}
            tabIndex={isOpen ? 0 : -1}
            className={`w-[110px] h-14 p-4 flex items-center gap-1 rounded text-white font-[family-name:var(--font-montserrat)] text-base font-bold leading-6 tracking-[0.15px] cursor-pointer transition-colors hover:bg-gold-10 focus-visible:outline-2 focus-visible:outline-border focus-visible:outline-offset-[-2px] ${locale === lang.code ? "bg-gold-20 rounded-sm" : ""}`}
          >
            {lang.flag}
            <span>{lang.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
