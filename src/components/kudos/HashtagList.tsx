"use client";

import { useRouter } from "next/navigation";

interface HashtagListProps {
  hashtags: string[];
}

export default function HashtagList({ hashtags }: HashtagListProps) {
  const router = useRouter();

  if (hashtags.length === 0) return null;

  return (
    <div className="flex flex-row flex-wrap gap-2">
      {hashtags.slice(0, 5).map((tag) => (
        <button
          key={tag}
          onClick={() => router.push(`/kudos?hashtag=${encodeURIComponent(tag)}`)}
          className="font-[family-name:var(--font-montserrat)] text-base font-bold leading-6 tracking-[0.5px] text-red transition-opacity hover:opacity-70"
        >
          {tag}
        </button>
      ))}
    </div>
  );
}
