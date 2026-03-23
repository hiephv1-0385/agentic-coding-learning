"use client";

import { useState, useEffect, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Icon from "@/components/ui/Icon";
import { useLocale } from "@/hooks/useLocale";
import DepartmentDropdown from "@/components/kudos/DepartmentDropdown";
import type { Hashtag, Department } from "@/types/kudos";

export default function FilterBar() {
  const { t } = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [hashtags, setHashtags] = useState<Hashtag[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoadingDepts, setIsLoadingDepts] = useState(true);
  const [showHashtagDropdown, setShowHashtagDropdown] = useState(false);

  const activeHashtag = searchParams.get("hashtag") ?? "";
  const activeDepartment = searchParams.get("department") ?? "";

  useEffect(() => {
    Promise.all([
      fetch("/api/hashtags").then((r) => r.json() as Promise<{ data?: Hashtag[] }>),
      fetch("/api/departments").then((r) => r.json() as Promise<{ data?: Department[] }>),
    ]).then(([h, d]) => {
      setHashtags(h.data ?? []);
      setDepartments(d.data ?? []);
      setIsLoadingDepts(false);
    }).catch(() => {
      setIsLoadingDepts(false);
    });
  }, []);

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    startTransition(() => {
      router.push(`/kudos?${params.toString()}`);
    });
    setShowHashtagDropdown(false);
  };

  return (
    <div className="flex flex-row gap-2">
      {/* Hashtag filter */}
      <div className="relative">
        <button
          onClick={() => {
            setShowHashtagDropdown(!showHashtagDropdown);
          }}
          className={`flex items-center gap-2 rounded border p-4 font-[family-name:var(--font-montserrat)] text-base font-bold text-white transition-colors ${
            activeHashtag
              ? "border-gold-primary bg-gold-40"
              : "border-border bg-gold-10 hover:bg-gold-40"
          }`}
        >
          {activeHashtag || t.kudos.hashtag}
          <Icon name="chevron-down" size={24} className="text-white" />
        </button>
        {showHashtagDropdown && (
          <div className="absolute left-0 top-full z-20 mt-1 max-h-60 w-56 overflow-y-auto rounded border border-border bg-container-dark shadow-lg">
            <button
              onClick={() => updateFilter("hashtag", "")}
              className="w-full px-4 py-3 text-left font-[family-name:var(--font-montserrat)] text-sm font-bold text-text-gray hover:bg-gold-10"
            >
              {t.kudos.clearFilter}
            </button>
            {hashtags.map((h) => (
              <button
                key={h.id}
                onClick={() => updateFilter("hashtag", h.name)}
                className={`w-full px-4 py-3 text-left font-[family-name:var(--font-montserrat)] text-sm font-bold hover:bg-gold-10 ${
                  activeHashtag === h.name ? "text-gold-primary" : "text-white"
                }`}
              >
                {h.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Department filter */}
      <DepartmentDropdown
        departments={departments}
        activeDepartment={activeDepartment}
        onSelect={(dept) => updateFilter("department", dept)}
        isLoading={isLoadingDepts}
        isPending={isPending}
      />
    </div>
  );
}
