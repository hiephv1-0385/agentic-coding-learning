"use client";

import { useLocale } from "@/hooks/useLocale";

export default function KudosError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { t } = useLocale();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-page-bg px-4">
      <h2 className="font-[family-name:var(--font-montserrat)] text-2xl font-bold text-white">
        {t.common.somethingWentWrong}
      </h2>
      <p className="mt-2 font-[family-name:var(--font-montserrat)] text-base text-text-gray">
        {t.modal.sendFailed}
      </p>
      <button
        onClick={reset}
        className="mt-6 rounded-lg bg-gold-primary px-6 py-3 font-[family-name:var(--font-montserrat)] text-base font-bold text-text-dark transition-colors hover:bg-card-bg"
      >
        {t.common.tryAgain}
      </button>
    </div>
  );
}
