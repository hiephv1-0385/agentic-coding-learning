"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import type { Kudos, KudosFeedResponse } from "@/types/kudos";

interface UseKudosFeedOptions {
  hashtag?: string;
  department?: string;
  limit?: number;
}

interface UseKudosFeedReturn {
  kudos: Kudos[];
  isLoading: boolean;
  error: string | null;
  hasMore: boolean;
  loadMore: () => void;
  observerRef: (node: HTMLElement | null) => void;
  retry: () => void;
}

export function useKudosFeed({
  hashtag,
  department,
  limit = 10,
}: UseKudosFeedOptions = {}): UseKudosFeedReturn {
  const [kudos, setKudos] = useState<Kudos[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const observerTarget = useRef<HTMLElement | null>(null);
  const observerInstance = useRef<IntersectionObserver | null>(null);

  const fetchPage = useCallback(
    async (pageCursor: string | null) => {
      if (isLoading) return;
      setIsLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams();
        params.set("limit", String(limit));
        if (pageCursor) params.set("cursor", pageCursor);
        if (hashtag) params.set("hashtag", hashtag);
        if (department) params.set("department", department);

        const res = await fetch(`/api/kudos?${params.toString()}`);
        if (res.status === 401) {
          window.location.href = "/login?redirect=/kudos";
          return;
        }
        if (!res.ok) throw new Error("Failed to load kudos");

        const json: KudosFeedResponse = await res.json();
        setKudos((prev) =>
          pageCursor ? [...prev, ...json.data] : json.data
        );
        setCursor(json.next_cursor);
        setHasMore(json.has_more);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load");
      } finally {
        setIsLoading(false);
      }
    },
    [hashtag, department, limit, isLoading]
  );

  // Reset when filters change
  useEffect(() => {
    setKudos([]);
    setCursor(null);
    setHasMore(true);
    fetchPage(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hashtag, department]);

  const loadMore = useCallback(() => {
    if (hasMore && !isLoading && cursor) {
      fetchPage(cursor);
    }
  }, [hasMore, isLoading, cursor, fetchPage]);

  const retry = useCallback(() => {
    fetchPage(cursor);
  }, [cursor, fetchPage]);

  const observerRef = useCallback(
    (node: HTMLElement | null) => {
      if (observerInstance.current) {
        observerInstance.current.disconnect();
      }
      if (!node) return;

      observerTarget.current = node;
      observerInstance.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore && !isLoading) {
            loadMore();
          }
        },
        { threshold: 0.1 }
      );
      observerInstance.current.observe(node);
    },
    [hasMore, isLoading, loadMore]
  );

  // Listen for 'kudos-created' event to refresh feed
  useEffect(() => {
    const handleKudosCreated = () => {
      setKudos([]);
      setCursor(null);
      setHasMore(true);
      fetchPage(null);
    };
    window.addEventListener("kudos-created", handleKudosCreated);
    return () => {
      window.removeEventListener("kudos-created", handleKudosCreated);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Cleanup observer on unmount
  useEffect(() => {
    return () => {
      observerInstance.current?.disconnect();
    };
  }, []);

  return { kudos, isLoading, error, hasMore, loadMore, observerRef, retry };
}
