"use client";

import { useState } from "react";
import Image from "next/image";
import Icon from "@/components/ui/Icon";
import { useLocale } from "@/hooks/useLocale";

interface MediaRowProps {
  images: string[];
  videoUrl?: string | null;
}

export default function MediaRow({ images, videoUrl }: MediaRowProps) {
  const [playingVideo, setPlayingVideo] = useState(false);
  const { t } = useLocale();

  if (images.length === 0 && !videoUrl) return null;

  return (
    <div className="flex flex-row flex-wrap gap-4">
      {images.slice(0, 5).map((url, i) => (
        <div
          key={i}
          className="relative h-[88px] w-[88px] shrink-0 overflow-hidden rounded-sticker border border-border"
        >
          <Image
            src={url}
            alt={`Kudos attachment ${i + 1}`}
            fill
            className="object-cover"
            sizes="88px"
            loading="lazy"
          />
        </div>
      ))}
      {videoUrl && !playingVideo && (
        <button
          onClick={() => setPlayingVideo(true)}
          className="relative h-[88px] w-[88px] shrink-0 overflow-hidden rounded-sticker border border-border"
          aria-label={t.kudos.playVideo}
        >
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <Icon name="play" size={30} className="text-white" />
          </div>
        </button>
      )}
      {videoUrl && playingVideo && (
        <video
          src={videoUrl}
          controls
          autoPlay
          className="max-h-[200px] w-full rounded-sticker"
        >
          <track kind="captions" />
        </video>
      )}
    </div>
  );
}
