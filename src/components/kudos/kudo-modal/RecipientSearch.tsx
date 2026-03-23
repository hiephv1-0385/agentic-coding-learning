"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import Icon from "@/components/ui/Icon";
import { useLocale } from "@/hooks/useLocale";
import type { ProfilePreview } from "@/types/kudos";

interface RecipientSearchProps {
  value: ProfilePreview | null;
  onChange: (profile: ProfilePreview | null) => void;
  error?: string;
}

export default function RecipientSearch({
  value,
  onChange,
  error,
}: RecipientSearchProps) {
  const { t } = useLocale();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ProfilePreview[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const search = useCallback(async (q: string) => {
    if (q.length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch(`/api/users/search?q=${encodeURIComponent(q)}`);
      if (res.ok) {
        const json = await res.json();
        const data = json as { data?: ProfilePreview[] };
        setResults(data.data ?? []);
        setIsOpen(true);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    if (value) onChange(null);

    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => search(val), 300);
  };

  const handleSelect = (profile: ProfilePreview) => {
    onChange(profile);
    setQuery(profile.display_name);
    setIsOpen(false);
  };

  // Click outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    return () => clearTimeout(debounceRef.current);
  }, []);

  const borderClass = error
    ? "border-[var(--color-required)]"
    : "border-[var(--color-border)] focus-within:border-[var(--color-gold-primary)]";

  return (
    <div className="flex flex-row items-center gap-4 w-full">
      <label className="flex items-center gap-[2px] shrink-0 text-[22px] font-bold leading-7 text-[var(--color-text-dark)]">
        {t.modal.recipient}
        <span className="font-[family-name:var(--font-noto-sans-jp,_'Noto_Sans_JP')] text-base font-bold leading-5 text-[var(--color-required)]">
          *
        </span>
      </label>

      <div ref={containerRef} className="relative flex-1">
        <div
          className={`flex items-center justify-between h-14 px-6 py-4 rounded-lg border bg-white transition-colors duration-150 ${borderClass}`}
        >
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleInputChange}
            placeholder={t.modal.searchPlaceholder}
            aria-required="true"
            aria-label={t.modal.searchAriaLabel}
            className="flex-1 text-base font-bold leading-6 tracking-[0.15px] text-[var(--color-text-dark)] placeholder:text-[var(--color-text-gray)] bg-transparent outline-none"
          />
          <Icon
            name="chevron-down"
            size={24}
            className="text-[var(--color-text-dark)] shrink-0"
          />
        </div>

        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 z-10 max-h-60 overflow-y-auto rounded-lg border border-[var(--color-border)] bg-white shadow-lg">
            {isLoading ? (
              <div className="px-6 py-4 text-base font-bold text-[var(--color-text-gray)]">
                {t.modal.searching}
              </div>
            ) : results.length === 0 ? (
              <div className="px-6 py-4 text-base font-bold text-[var(--color-text-gray)]">
                {t.modal.noResults}
              </div>
            ) : (
              results.map((profile) => (
                <button
                  key={profile.id}
                  type="button"
                  onClick={() => handleSelect(profile)}
                  className="flex items-center gap-3 w-full px-6 py-3 text-left hover:bg-[rgba(255,234,158,0.1)] transition-colors"
                >
                  {profile.avatar_url ? (
                    <Image
                      src={profile.avatar_url}
                      alt=""
                      width={32}
                      height={32}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-[var(--color-border)] flex items-center justify-center">
                      <Icon
                        name="user"
                        size={16}
                        className="text-white"
                      />
                    </div>
                  )}
                  <div className="flex flex-col">
                    <span className="text-base font-bold text-[var(--color-text-dark)]">
                      {profile.display_name}
                    </span>
                    {profile.department && (
                      <span className="text-sm text-[var(--color-text-gray)]">
                        {profile.department}
                      </span>
                    )}
                  </div>
                </button>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
