"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";

interface ProfilePreviewData {
  display_name: string;
  department: string | null;
  avatar_url: string | null;
  kudos_received_count: number;
}

interface ProfilePreviewTooltipProps {
  userId: string;
  children: React.ReactNode;
}

export default function ProfilePreviewTooltip({
  userId,
  children,
}: ProfilePreviewTooltipProps) {
  const [preview, setPreview] = useState<ProfilePreviewData | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fetchedRef = useRef(false);

  const showTooltip = useCallback(async () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsVisible(true);

    if (!fetchedRef.current) {
      try {
        const res = await fetch(`/api/users/${userId}/profile-preview`);
        if (res.ok) {
          const json = (await res.json()) as { data: ProfilePreviewData };
          setPreview(json.data);
        }
      } catch {
        // Silently fail - tooltip just won't show data
      }
      fetchedRef.current = true;
    }
  }, [userId]);

  const hideTooltip = useCallback(() => {
    timeoutRef.current = setTimeout(() => {
      setIsVisible(false);
    }, 200);
  }, []);

  return (
    <div
      className="relative inline-block"
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
    >
      <Link href={`/profile/${userId}`}>{children}</Link>

      {isVisible && preview && (
        <div
          className="absolute bottom-full left-0 z-30 mb-2 rounded-lg border border-border bg-container-dark p-3 shadow-lg"
          style={{ animation: "fadeIn 200ms ease-out" }}
          onMouseEnter={() => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
          }}
          onMouseLeave={hideTooltip}
        >
          <div className="flex items-center gap-3 whitespace-nowrap">
            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-white">
              {preview.avatar_url ? (
                <Image
                  src={preview.avatar_url}
                  alt={preview.display_name}
                  fill
                  className="object-cover"
                  sizes="40px"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gold-10 text-gold-primary">
                  <span className="font-[family-name:var(--font-montserrat)] text-sm font-bold">
                    {preview.display_name.charAt(0)}
                  </span>
                </div>
              )}
            </div>
            <div className="flex flex-col">
              <span className="font-[family-name:var(--font-montserrat)] text-sm font-bold text-gold-primary">
                {preview.display_name}
              </span>
              {preview.department && (
                <span className="font-[family-name:var(--font-montserrat)] text-xs text-text-gray">
                  {preview.department}
                </span>
              )}
              <span className="font-[family-name:var(--font-montserrat)] text-xs text-white">
                {preview.kudos_received_count} kudos received
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
