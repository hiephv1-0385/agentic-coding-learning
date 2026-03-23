"use client";

import Link from "next/link";
import { useLocale } from "@/hooks/useLocale";

export default function NotFound() {
  const { t } = useLocale();

  return (
    <div className="min-h-screen bg-page-bg flex flex-col items-center justify-center gap-6 px-4">
      <h1 className="font-[family-name:var(--font-montserrat)] text-6xl font-bold text-gold-primary">
        404
      </h1>
      <p className="font-[family-name:var(--font-montserrat)] text-xl font-bold text-white">
        {t.common.pageNotFound}
      </p>
      <Link
        href="/"
        className="px-6 py-3 border border-white text-white font-bold hover:bg-gold-primary hover:text-btn-about-bg hover:border-transparent transition-all duration-150"
      >
        {t.common.backToHome}
      </Link>
    </div>
  );
}
