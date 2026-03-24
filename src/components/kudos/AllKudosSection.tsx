import InfiniteScrollFeed from "@/components/kudos/InfiniteScrollFeed";

interface AllKudosSectionProps {
  hashtag?: string;
  department?: string;
  currentUserId: string;
  sidebar?: React.ReactNode;
}

export default function AllKudosSection({
  hashtag,
  department,
  currentUserId,
  sidebar,
}: AllKudosSectionProps) {
  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:gap-[var(--spacing-feed-sidebar-gap)]">
      <div className="w-full lg:min-w-0 lg:flex-1">
        <InfiniteScrollFeed
          hashtag={hashtag}
          department={department}
          currentUserId={currentUserId}
        />
      </div>
      {sidebar && (
        <div className="w-full lg:sticky lg:top-[100px] lg:w-[422px] lg:flex-shrink-0 lg:self-start lg:overflow-y-auto lg:max-h-[calc(100vh-120px)]">
          {sidebar}
        </div>
      )}
    </div>
  );
}
