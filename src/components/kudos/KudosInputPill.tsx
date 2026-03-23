"use client";

import Icon from "@/components/ui/Icon";
import { useLocale } from "@/hooks/useLocale";

interface KudosInputPillProps {
  onClick?: () => void;
}

export default function KudosInputPill({ onClick }: KudosInputPillProps) {
  const { t } = useLocale();
  const handleClick = () => {
    onClick?.();
  };

  return (
    <button
      onClick={handleClick}
      className="flex w-full cursor-pointer flex-row items-center gap-4 rounded-pill border border-border bg-gold-10 px-4 py-6 transition-colors hover:bg-gold-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold-primary focus-visible:outline-offset-2 lg:w-auto lg:min-w-[400px]"
    >
      <Icon name="pencil" size={24} className="shrink-0 text-white" />
      <span className="font-[family-name:var(--font-montserrat)] text-base font-bold leading-6 text-white">
        {t.kudos.inputPillPlaceholder}
      </span>
    </button>
  );
}
