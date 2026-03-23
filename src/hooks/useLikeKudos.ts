"use client";

import { useState, useCallback, useRef } from "react";
import type { ToggleLikeResponse } from "@/types/kudos";

interface UseLikeKudosReturn {
  heartCount: number;
  isLiked: boolean;
  isLiking: boolean;
  toggleLike: () => void;
}

export function useLikeKudos(
  kudosId: string,
  initialCount: number,
  initialIsLiked: boolean,
  onError?: (message: string) => void
): UseLikeKudosReturn {
  const [heartCount, setHeartCount] = useState(initialCount);
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const isLikingRef = useRef(false);
  const [isLiking, setIsLiking] = useState(false);

  const toggleLike = useCallback(async () => {
    if (isLikingRef.current) return;
    isLikingRef.current = true;
    setIsLiking(true);

    // Optimistic update
    const prevCount = heartCount;
    const prevLiked = isLiked;
    setIsLiked(!isLiked);
    setHeartCount(isLiked ? heartCount - 1 : heartCount + 1);

    try {
      const method = isLiked ? "DELETE" : "POST";
      const res = await fetch(`/api/kudos/${kudosId}/like`, { method });

      if (res.status === 401) {
        window.location.href = "/login?redirect=/kudos";
        return;
      }

      if (res.status === 404) {
        onError?.("Kudos not found");
        return;
      }

      if (!res.ok) throw new Error("Failed to update like");

      const json: ToggleLikeResponse = await res.json();
      setHeartCount(json.heart_count);
      setIsLiked(json.action === "liked");
    } catch {
      // Rollback optimistic update
      setHeartCount(prevCount);
      setIsLiked(prevLiked);
      onError?.("Failed to update like. Please try again.");
    } finally {
      isLikingRef.current = false;
      setIsLiking(false);
    }
  }, [kudosId, heartCount, isLiked, onError]);

  return { heartCount, isLiked, isLiking, toggleLike };
}
