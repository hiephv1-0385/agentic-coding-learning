import Link from "next/link";
import KudosCardHeader from "@/components/kudos/KudosCardHeader";
import QuoteBox from "@/components/kudos/QuoteBox";
import HashtagList from "@/components/kudos/HashtagList";
import HeartButton from "@/components/kudos/HeartButton";
import CopyLinkButton from "@/components/kudos/CopyLinkButton";
import type { Kudos } from "@/types/kudos";

interface HighlightCardProps {
  kudos: Kudos;
  currentUserId: string;
  isActive: boolean;
}

export default function HighlightCard({
  kudos,
  currentUserId,
  isActive,
}: HighlightCardProps) {
  if (!kudos.sender || !kudos.receiver) return null;

  return (
    <div
      className={`flex w-full shrink-0 flex-col gap-4 rounded-carousel-card p-6 pb-4 transition-all duration-300 ease-in-out lg:w-[528px] ${
        isActive
          ? "border-4 border-gold-primary bg-card-bg opacity-100"
          : "border-4 border-transparent bg-card-bg opacity-50 scale-95"
      }`}
      role="tabpanel"
    >
      <KudosCardHeader sender={kudos.sender} receiver={kudos.receiver} />

      <div className="h-px bg-gold-primary" />

      <QuoteBox content={kudos.content} maxLines={3} />

      <HashtagList hashtags={kudos.hashtags} />

      <div className="flex flex-row items-center justify-between gap-4">
        <div className="flex flex-row items-center gap-4">
          <HeartButton
            kudosId={kudos.id}
            senderId={kudos.sender_id}
            currentUserId={currentUserId}
            initialCount={kudos.heart_count}
            initialIsLiked={kudos.is_liked_by_me ?? false}
          />
          <CopyLinkButton kudosId={kudos.id} />
        </div>
        <Link
          href={`/kudos/${kudos.id}`}
          className="font-[family-name:var(--font-montserrat)] text-base font-bold text-text-dark underline transition-opacity hover:opacity-70"
        >
          Xem chi tiết
        </Link>
      </div>
    </div>
  );
}
