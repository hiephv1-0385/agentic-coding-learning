"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import Icon from "@/components/ui/Icon";
import { useLocale } from "@/hooks/useLocale";

interface SearchResult {
  id: string;
  display_name: string;
  department: string | null;
  avatar_url: string | null;
  kudos_received_count: number;
}

export default function SearchPill() {
  const { t } = useLocale();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const search = useCallback(async (q: string) => {
    if (q.length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    setIsSearching(true);
    try {
      const res = await fetch(
        `/api/users/search?q=${encodeURIComponent(q)}`
      );
      if (res.ok) {
        const json = (await res.json()) as { data?: SearchResult[] };
        setResults(json.data ?? []);
        setIsOpen(true);
      }
    } catch {
      // Silently fail
    } finally {
      setIsSearching(false);
    }
  }, []);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setQuery(value);

      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => search(value), 300);
    },
    [search]
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full lg:w-auto lg:min-w-[300px]">
      <div className="flex w-full flex-row items-center gap-4 rounded-pill border border-border bg-gold-10 px-4 py-6 transition-colors hover:bg-gold-40 focus-within:outline focus-within:outline-2 focus-within:outline-gold-primary focus-within:outline-offset-2">
        <Icon name="search" size={24} className="shrink-0 text-white" />
        <input
          type="text"
          placeholder={t.kudos.searchPlaceholder}
          maxLength={100}
          value={query}
          onChange={handleChange}
          className="w-full bg-transparent font-[family-name:var(--font-montserrat)] text-base font-bold leading-6 text-white outline-none placeholder:text-white/60"
          aria-label={t.kudos.searchAriaLabel}
          role="combobox"
          aria-expanded={isOpen}
          aria-controls="search-results-listbox"
          aria-autocomplete="list"
        />
        {isSearching && (
          <div className="h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-white border-t-transparent" />
        )}
      </div>

      {isOpen && (
        <div
          className="absolute left-0 top-full z-30 mt-2 max-h-80 w-full overflow-y-auto rounded-lg border border-border bg-container-dark shadow-lg"
          id="search-results-listbox"
          role="listbox"
        >
          {results.length === 0 ? (
            <p className="px-4 py-3 font-[family-name:var(--font-montserrat)] text-sm text-text-gray">
              {t.kudos.noResults}
            </p>
          ) : (
            results.map((user) => (
              <Link
                key={user.id}
                href={`/profile/${user.id}`}
                className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-gold-10"
                role="option"
                onClick={() => setIsOpen(false)}
              >
                <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-white">
                  {user.avatar_url ? (
                    <Image
                      src={user.avatar_url}
                      alt={user.display_name}
                      fill
                      className="object-cover"
                      sizes="40px"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gold-10 text-gold-primary">
                      <span className="font-[family-name:var(--font-montserrat)] text-sm font-bold">
                        {user.display_name.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="font-[family-name:var(--font-montserrat)] text-sm font-bold text-white">
                    {user.display_name}
                  </span>
                  {user.department && (
                    <span className="font-[family-name:var(--font-montserrat)] text-xs text-text-gray">
                      {user.department}
                    </span>
                  )}
                </div>
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  );
}
