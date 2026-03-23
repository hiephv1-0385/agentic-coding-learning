"use client";

import Button from "@/components/ui/Button";
import { useLocale } from "@/hooks/useLocale";

export default function CTAButtons() {
  const { t } = useLocale();

  return (
    <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
      <Button variant="cta" href="/awards">
        {t.home.aboutAwards}
      </Button>
      <Button variant="cta" href="/kudos">
        {t.home.aboutKudos}
      </Button>
    </div>
  );
}
