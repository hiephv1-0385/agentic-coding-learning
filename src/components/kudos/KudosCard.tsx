"use client";

import { useLocale } from "@/hooks/useLocale";
import KudosCardHeader from "@/components/kudos/KudosCardHeader";
import QuoteBox from "@/components/kudos/QuoteBox";
import MediaRow from "@/components/kudos/MediaRow";
import HashtagList from "@/components/kudos/HashtagList";
import CategoryLabel from "@/components/kudos/CategoryLabel";
import { formatKudosDate } from "@/utils/formatKudosDate";
import type { Kudos } from "@/types/kudos";

interface KudosCardProps {
  kudos: Kudos;
  currentUserId: string;
  maxLines?: 3 | 5;
  actions?: React.ReactNode;
}

export default function KudosCard({
  kudos,
  maxLines = 5,
  actions,
}: KudosCardProps) {
  const { t } = useLocale();

  if (!kudos.sender || !kudos.receiver) return null;

  return (
    <article className="flex w-full flex-col gap-4 rounded-kudos-card bg-card-bg p-6 pt-10 lg:p-10 lg:pb-4">
      <KudosCardHeader
        sender={kudos.sender}
        receiver={kudos.receiver}
        isAnonymous={kudos.is_anonymous}
        anonymousName={kudos.anonymous_name}
      />

      <p className="font-[family-name:var(--font-montserrat)] text-sm font-bold leading-5 text-text-gray">
        {formatKudosDate(kudos.created_at)}
      </p>

      <div className="h-px bg-gold-primary" />

      <div className="flex flex-col gap-4">
        {kudos.danh_hieu ? (
          <p className="font-[family-name:var(--font-montserrat)] text-[22px] font-bold leading-7 text-text-dark">
            {kudos.danh_hieu}
          </p>
        ) : (
          <p className="font-[family-name:var(--font-montserrat)] text-base font-bold leading-6 text-text-gray">
            {t.kudos.defaultTitle}
          </p>
        )}
        <QuoteBox content={kudos.content} maxLines={maxLines} />

        <MediaRow images={kudos.images} videoUrl={kudos.video_url} />

        {kudos.category && <CategoryLabel category={kudos.category} />}

        <HashtagList hashtags={kudos.hashtags} />
      </div>

      {actions && (
        <div className="flex flex-row items-center justify-between gap-6">
          {actions}
        </div>
      )}
    </article>
  );
}
