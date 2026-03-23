interface AwardBadgeProps {
  kudosReceivedCount: number;
}

function getStarCount(count: number): number {
  if (count >= 50) return 3;
  if (count >= 20) return 2;
  if (count >= 10) return 1;
  return 0;
}

export default function AwardBadge({ kudosReceivedCount }: AwardBadgeProps) {
  const stars = getStarCount(kudosReceivedCount);
  if (stars === 0) return null;

  return (
    <span className="inline-flex items-center gap-0.5 rounded-badge-pill border-[0.5px] border-gold-primary bg-badge-bg px-2 py-0.5">
      {Array.from({ length: stars }, (_, i) => (
        <span key={i} className="text-xs">
          ⭐
        </span>
      ))}
    </span>
  );
}
