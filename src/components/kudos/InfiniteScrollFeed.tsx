"use client";

import { useKudosFeed } from "@/hooks/useKudosFeed";
import { useLocale } from "@/hooks/useLocale";
import KudosCard from "@/components/kudos/KudosCard";
import HeartButton from "@/components/kudos/HeartButton";
import CopyLinkButton from "@/components/kudos/CopyLinkButton";

interface InfiniteScrollFeedProps {
  hashtag?: string;
  department?: string;
  currentUserId: string;
}

export default function InfiniteScrollFeed({
  hashtag,
  department,
  currentUserId,
}: InfiniteScrollFeedProps) {
  const { kudos, isLoading, error, hasMore, observerRef, retry } =
    useKudosFeed({ hashtag, department });
  const { t } = useLocale();

  if (!isLoading && kudos.length === 0 && !error) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <p className="font-[family-name:var(--font-montserrat)] text-base font-bold text-text-gray">
          {t.kudos.noKudos}
        </p>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-6">
      {kudos.map((k) => (
        <KudosCard
          key={k.id}
          kudos={k}
          currentUserId={currentUserId}
          maxLines={5}
          actions={
            <>
              <HeartButton
                kudosId={k.id}
                senderId={k.sender_id}
                currentUserId={currentUserId}
                initialCount={k.heart_count}
                initialIsLiked={k.is_liked_by_me ?? false}
              />
              <CopyLinkButton kudosId={k.id} />
            </>
          }
        />
      ))}

      {error && (
        <div className="flex flex-col items-center gap-2 py-4">
          <p className="font-[family-name:var(--font-montserrat)] text-sm text-red">
            {t.kudos.loadFailed}
          </p>
          <button
            onClick={retry}
            className="rounded bg-gold-10 px-4 py-2 font-[family-name:var(--font-montserrat)] text-sm font-bold text-text-white transition-colors hover:bg-gold-40"
          >
            {t.kudos.retry}
          </button>
        </div>
      )}

      {isLoading && (
        <div className="flex flex-col gap-6" aria-live="polite">
          <span className="sr-only">{t.kudos.loadingMore}</span>
          {[1, 2].map((i) => (
            <div
              key={i}
              className="h-64 animate-pulse rounded-kudos-card bg-gold-10"
            />
          ))}
        </div>
      )}

      {hasMore && !isLoading && !error && (
        <div ref={observerRef} className="h-4" />
      )}

      {!hasMore && kudos.length > 0 && (
        <p
          className="py-4 text-center font-[family-name:var(--font-montserrat)] text-sm text-text-gray"
          aria-live="polite"
        >
          {t.kudos.noMoreKudos}
        </p>
      )}
    </div>
  );
}
