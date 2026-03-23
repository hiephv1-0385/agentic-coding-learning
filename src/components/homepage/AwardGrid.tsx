import type { AwardCategory } from "@/types/award";
import AwardCard from "@/components/homepage/AwardCard";

interface AwardGridProps {
  awards: AwardCategory[];
}

export default function AwardGrid({ awards }: AwardGridProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
      {awards.map((award) => (
        <AwardCard key={award.id} award={award} />
      ))}
    </div>
  );
}
