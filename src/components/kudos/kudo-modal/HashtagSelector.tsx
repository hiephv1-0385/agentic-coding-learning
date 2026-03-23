"use client";

import { useState, useEffect, useRef } from "react";
import Icon from "@/components/ui/Icon";
import { useLocale } from "@/hooks/useLocale";
import type { Hashtag } from "@/types/kudos";

interface HashtagSelectorProps {
  value: string[];
  onChange: (hashtags: string[]) => void;
  error?: string;
}

const MAX_HASHTAGS = 5;

export default function HashtagSelector({
  value,
  onChange,
  error,
}: HashtagSelectorProps) {
  const { t } = useLocale();
  const [hashtags, setHashtags] = useState<Hashtag[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const fetchHashtags = async () => {
    setIsLoading(true);
    setFetchError(false);
    try {
      const res = await fetch("/api/hashtags");
      if (res.ok) {
        const json = (await res.json()) as { data?: Hashtag[] };
        setHashtags(json.data ?? []);
      } else {
        setFetchError(true);
      }
    } catch {
      setFetchError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHashtags();
  }, []);

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

  const handleToggle = (name: string) => {
    if (value.includes(name)) {
      onChange(value.filter((h) => h !== name));
    } else if (value.length < MAX_HASHTAGS) {
      onChange([...value, name]);
    }
  };

  const handleRemove = (name: string) => {
    onChange(value.filter((h) => h !== name));
  };

  const availableHashtags = hashtags.filter((h) => !value.includes(h.name));

  return (
    <div className="flex flex-row items-center gap-4 w-full">
      <label className="flex items-center gap-[2px] shrink-0 text-[22px] font-bold leading-7 text-[var(--color-text-dark)]">
        {t.kudos.hashtag}
        <span className="font-[family-name:var(--font-noto-sans-jp,_'Noto_Sans_JP')] text-base font-bold leading-5 text-[var(--color-required)]">
          *
        </span>
      </label>

      <div ref={containerRef} className="relative flex flex-row flex-wrap items-center gap-2">
        {/* Selected chips */}
        {value.map((name) => (
          <span
            key={name}
            className="flex items-center gap-1 h-12 px-3 py-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-gold-primary)] text-[11px] font-bold leading-4 tracking-[0.5px] text-[var(--color-text-dark)]"
          >
            #{name}
            <button
              type="button"
              onClick={() => handleRemove(name)}
              className="ml-1 hover:opacity-70"
              aria-label={`${t.modal.removeHashtag} ${name}`}
            >
              <Icon name="close" size={14} className="text-[var(--color-text-dark)]" />
            </button>
          </span>
        ))}

        {/* Add button */}
        {value.length < MAX_HASHTAGS && (
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 h-12 px-2 py-1 rounded-lg border border-[var(--color-border)] bg-white hover:bg-[var(--color-card-bg)] transition-colors"
          >
            <Icon name="plus" size={24} className="text-[var(--color-text-gray)]" />
            <div className="flex flex-col items-start">
              <span className="text-[11px] font-bold leading-4 tracking-[0.5px] text-[var(--color-text-gray)]">
                {t.kudos.hashtag}
              </span>
              <span className="text-[11px] font-bold leading-4 tracking-[0.5px] text-[var(--color-text-gray)]">
                {t.modal.hashtagMaxLabel} {MAX_HASHTAGS}
              </span>
            </div>
          </button>
        )}

        {/* Dropdown */}
        {isOpen && (
          <div className="absolute top-full left-0 mt-1 z-10 min-w-[200px] max-h-60 overflow-y-auto rounded-lg border border-[var(--color-border)] bg-white shadow-lg">
            {isLoading ? (
              <div className="px-4 py-3 text-sm text-[var(--color-text-gray)]">
                {t.modal.hashtagLoading}
              </div>
            ) : fetchError ? (
              <div className="px-4 py-3 flex flex-col gap-2">
                <span className="text-sm text-[var(--color-required)]">
                  {t.modal.hashtagError}
                </span>
                <button
                  type="button"
                  onClick={fetchHashtags}
                  className="text-sm font-bold text-[var(--color-link-red)] hover:underline"
                >
                  {t.modal.hashtagRetry}
                </button>
              </div>
            ) : availableHashtags.length === 0 ? (
              <div className="px-4 py-3 text-sm text-[var(--color-text-gray)]">
                {t.modal.hashtagEmpty}
              </div>
            ) : (
              availableHashtags.map((hashtag) => (
                <button
                  key={hashtag.id}
                  type="button"
                  onClick={() => {
                    handleToggle(hashtag.name);
                    if (value.length + 1 >= MAX_HASHTAGS) setIsOpen(false);
                  }}
                  className="flex items-center w-full px-4 py-2 text-left text-sm font-bold text-[var(--color-text-dark)] hover:bg-[rgba(255,234,158,0.1)] transition-colors"
                >
                  #{hashtag.name}
                </button>
              ))
            )}
          </div>
        )}
      </div>

      {error && (
        <span className="text-sm text-[var(--color-required)]">{error}</span>
      )}
    </div>
  );
}
