"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import Icon from "@/components/ui/Icon";
import { useLocale } from "@/hooks/useLocale";
import type { SpotlightEntry, LiveKudosEntry } from "@/types/kudos";

interface SpotlightInteractiveProps {
  entries: SpotlightEntry[];
  totalKudos: number;
  liveKudos: LiveKudosEntry[];
}

function getWordStyles(
  count: number,
  maxCount: number
): { fontSize: number; opacity: number } {
  const ratio = maxCount > 0 ? count / maxCount : 0;
  const fontSize = 6.66 + ratio * (11.34 - 6.66);
  const opacity = 0.1 + ratio * 0.9;
  return { fontSize, opacity };
}

function formatTime(dateStr: string): string {
  const date = new Date(dateStr);
  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  return `${hours.toString().padStart(2, "0")}:${minutes}${ampm}`;
}

export default function SpotlightInteractive({
  entries,
  totalKudos,
  liveKudos,
}: SpotlightInteractiveProps) {
  const { t } = useLocale();
  const [searchQuery, setSearchQuery] = useState("");
  const [isPanZoom, setIsPanZoom] = useState(false);
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const isPanZoomRef = useRef(false);

  const maxCount = Math.max(...entries.map((e) => e.kudos_count), 1);

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(e.target.value);
    },
    []
  );

  const togglePanZoom = useCallback(() => {
    setIsPanZoom((prev) => {
      const next = !prev;
      isPanZoomRef.current = next;
      if (!next) setTransform({ x: 0, y: 0, scale: 1 });
      return next;
    });
  }, []);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (!isPanZoom) return;
      isDragging.current = true;
      dragStart.current = { x: e.clientX - transform.x, y: e.clientY - transform.y };
    },
    [isPanZoom, transform]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging.current) return;
      setTransform((prev) => ({
        ...prev,
        x: e.clientX - dragStart.current.x,
        y: e.clientY - dragStart.current.y,
      }));
    },
    []
  );

  const handleMouseUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  // Use native event listener for wheel to support { passive: false }
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      if (!isPanZoomRef.current) return;
      e.preventDefault();
      const delta = e.deltaY > 0 ? 0.9 : 1.1;
      setTransform((prev) => ({
        ...prev,
        scale: Math.max(0.5, Math.min(3, prev.scale * delta)),
      }));
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => container.removeEventListener("wheel", handleWheel);
  }, []);

  // Generate positions for word cloud
  // Round to 2 decimal places to avoid SSR/client hydration mismatch
  // from floating-point differences between Node.js and browser
  const positions = entries.map((_, i) => {
    const angle = (i / entries.length) * Math.PI * 2;
    const radius = 150 + (i % 5) * 40;
    return {
      x: Math.round((400 + Math.cos(angle) * radius + ((i * 37) % 100)) * 100) / 100,
      y: Math.round((220 + Math.sin(angle) * radius + ((i * 53) % 80)) * 100) / 100,
    };
  });

  return (
    <div className="relative flex flex-col p-6 lg:p-10">
      {/* Header: search (left) — title (center) */}
      <div className="flex flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 rounded-pill border border-border bg-gold-10 px-4 py-2">
          <Icon name="search" size={24} className="text-white" />
          <input
            type="text"
            placeholder={t.kudos.search}
            value={searchQuery}
            onChange={handleSearchChange}
            maxLength={100}
            className="w-24 bg-transparent font-[family-name:var(--font-montserrat)] text-base font-bold text-white outline-none placeholder:text-white/60 lg:w-40"
          />
        </div>

        <h3 className="font-[family-name:var(--font-montserrat)] text-2xl font-bold leading-8 text-white lg:text-4xl lg:leading-[44px]">
          {totalKudos} KUDOS
        </h3>

        {/* Spacer to keep title centered */}
        <div className="w-10" />
      </div>

      {/* Word cloud */}
      <div
        ref={containerRef}
        className="mt-4 flex-1 overflow-hidden"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{ cursor: isPanZoom ? (isDragging.current ? "grabbing" : "grab") : "default" }}
      >
        <svg
          ref={svgRef}
          viewBox="0 0 800 400"
          className="h-auto w-full"
          style={{
            transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
            transition: isDragging.current ? "none" : "transform 0.2s ease-out",
          }}
        >
          {entries.map((entry, i) => {
            const { fontSize, opacity } = getWordStyles(
              entry.kudos_count,
              maxCount
            );
            const isHighlighted =
              searchQuery.length > 0 &&
              entry.display_name
                .toLowerCase()
                .includes(searchQuery.toLowerCase());

            return (
              <text
                key={entry.user_id}
                x={positions[i]?.x ?? 400}
                y={positions[i]?.y ?? 200}
                fill={isHighlighted ? "#F17676" : "#FFFFFF"}
                opacity={isHighlighted ? 1 : opacity}
                fontSize={fontSize * 2}
                fontFamily="var(--font-montserrat), Montserrat, sans-serif"
                fontWeight="700"
                textAnchor="middle"
                className="cursor-pointer transition-opacity"
              >
                {entry.display_name}
              </text>
            );
          })}
        </svg>
      </div>

      {/* Live Kudos — vertical stacked lines */}
      {liveKudos.length > 0 && (
        <div className="mt-4 flex flex-col gap-1" aria-live="polite">
          {liveKudos.map((entry, i) => (
            <p
              key={`${entry.receiver_name}-${entry.created_at}-${i}`}
              className="font-[family-name:var(--font-montserrat)] text-sm font-bold leading-5"
            >
              <span className="text-gold">{formatTime(entry.created_at)}</span>{" "}
              <span className="text-white">{entry.receiver_name}</span>{" "}
              <span className="text-white/60">{t.kudos.liveKudosMessage}</span>
            </p>
          ))}
        </div>
      )}

      {/* Pan/Zoom button — bottom-right corner */}
      <button
        type="button"
        onClick={togglePanZoom}
        aria-label={isPanZoom ? t.kudos.disablePanZoom : t.kudos.enablePanZoom}
        title="Pan/Zoom"
        className={`absolute bottom-6 right-6 z-10 flex h-10 w-10 items-center justify-center rounded p-[10px] transition-colors lg:bottom-10 lg:right-10 ${
          isPanZoom
            ? "bg-gold-40 ring-1 ring-gold"
            : "bg-gold-10 hover:bg-gold-40"
        }`}
      >
        <Icon name="pan-zoom" size={24} className="text-white" />
      </button>
    </div>
  );
}
