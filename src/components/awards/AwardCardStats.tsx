"use client";

import Icon from "@/components/ui/Icon";
import HoacDivider from "@/components/awards/HoacDivider";
import { formatPrizeValue } from "@/utils/formatPrizeValue";
import { translateDbText } from "@/utils/translateDbText";
import { useLocale } from "@/hooks/useLocale";
import type { AwardCategory } from "@/types/award";

function PrizeSection({
  value,
  subLabel,
  label,
}: {
  value: number;
  subLabel: string;
  label: string;
}) {
  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-1">
        <Icon name="prize" size={16} className="text-gold-primary shrink-0" />
        <span className="font-[family-name:var(--font-montserrat)] text-sm font-bold leading-5 tracking-[0.1px] text-gold-primary">
          {label}
        </span>
      </div>
      <span className="font-[family-name:var(--font-montserrat)] text-[36px] font-bold leading-[44px] text-gold-primary">
        {formatPrizeValue(value)}
      </span>
      {subLabel && (
        <span className="font-[family-name:var(--font-montserrat)] text-sm font-bold leading-5 text-white">
          {subLabel}
        </span>
      )}
    </div>
  );
}

export default function AwardCardStats({ award }: { award: AwardCategory }) {
  const { t } = useLocale();

  return (
    <>
      <div className="flex items-baseline gap-1">
        <Icon name="quantity" size={16} className="text-gold-primary shrink-0 relative top-[3px]" />
        <span className="font-[family-name:var(--font-montserrat)] text-sm font-bold leading-5 tracking-[0.1px] text-gold-primary">
          {t.awards.quantityLabel}
        </span>
        <span className="font-[family-name:var(--font-montserrat)] text-[36px] font-bold leading-[44px] text-gold-primary">
          {String(award.quantity).padStart(2, "0")}
        </span>
        <span className="font-[family-name:var(--font-montserrat)] text-sm font-bold leading-5 text-white">
          {translateDbText(award.unitType, t)}
        </span>
      </div>
      <hr className="h-px w-full border-0 bg-divider" />
      <PrizeSection value={award.prizeValue} subLabel={translateDbText(award.prizeSubLabel, t)} label={t.awards.prizeValueLabel} />
      {award.prizeValueTeam !== null && (
        <>
          <HoacDivider />
          <PrizeSection
            value={award.prizeValueTeam}
            subLabel={translateDbText(award.prizeSubLabelTeam ?? "", t)}
            label={t.awards.prizeValueLabel}
          />
        </>
      )}
    </>
  );
}
