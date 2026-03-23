"use client";

import { useLocale } from "@/hooks/useLocale";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { t } = useLocale();

  return (
    <div className="min-h-screen bg-page-bg flex flex-col items-center justify-center gap-6 px-4">
      <h1 className="font-[family-name:var(--font-montserrat)] text-3xl font-bold text-gold-primary">
        {t.common.somethingWentWrong}
      </h1>
      <p className="font-[family-name:var(--font-montserrat)] text-base text-white text-center max-w-md">
        {t.common.unexpectedError}
      </p>
      <button
        type="button"
        onClick={reset}
        className="px-6 py-3 border border-white text-white font-bold hover:bg-gold-primary hover:text-btn-about-bg hover:border-transparent transition-all duration-150"
      >
        {t.common.tryAgain}
      </button>
    </div>
  );
}
