import { Suspense } from "react";
import { redirect } from "next/navigation";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import HeroBanner from "@/components/kudos/HeroBanner";
import HighlightKudos from "@/components/kudos/HighlightKudos";
import FilterBar from "@/components/kudos/FilterBar";
import SpotlightBoard from "@/components/kudos/SpotlightBoard";
import SectionHeader from "@/components/kudos/SectionHeader";
import AllKudosSection from "@/components/kudos/AllKudosSection";
import StatsCard from "@/components/kudos/StatsCard";
import LeaderboardCard from "@/components/kudos/LeaderboardCard";
import { createClient } from "@/libs/supabase/server";
import { getServerTranslations } from "@/utils/getServerLocale";

interface KudosPageProps {
  searchParams: Promise<{ hashtag?: string; department?: string }>;
}

export default async function KudosPage({ searchParams }: KudosPageProps) {
  const t = await getServerTranslations();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirect=/kudos");
  }

  const params = await searchParams;
  const hashtag = params.hashtag;
  const department = params.department;

  const sidebar = (
    <div className="flex flex-col gap-6">
      <Suspense fallback={<div className="h-80 animate-pulse rounded-sidebar-card bg-container-dark" />}>
        <StatsCard userId={user.id} />
      </Suspense>
      <Suspense fallback={<div className="h-96 animate-pulse rounded-sidebar-card bg-container-dark" />}>
        <LeaderboardCard />
      </Suspense>
    </div>
  );

  return (
    <div className="min-h-screen bg-page-bg">
      <a
        href="#all-kudos"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-gold-primary focus:px-4 focus:py-2 focus:font-[family-name:var(--font-montserrat)] focus:text-sm focus:font-bold focus:text-text-dark"
      >
        {t.kudos.skipToMain}
      </a>
      <Header activeLink="kudos" />

      <main className="flex flex-col">
        {/* Hero Banner */}
        <HeroBanner />

        {/* Highlight Kudos Carousel */}
        <div className="py-16">
          <Suspense fallback={<div className="px-4 sm:px-12 lg:px-[var(--spacing-page-padding-x)]"><div className="h-80 animate-pulse rounded-carousel-card bg-container-dark" /></div>}>
            <HighlightKudos
              hashtag={hashtag}
              department={department}
              currentUserId={user.id}
              filterSlot={<FilterBar />}
            />
          </Suspense>
        </div>

        {/* Spotlight Board */}
        <div className="pb-16">
          <Suspense fallback={<div className="px-4 sm:px-12 lg:px-[var(--spacing-page-padding-x)]"><div className="h-[548px] animate-pulse rounded-spotlight bg-container-dark" /></div>}>
            <SpotlightBoard />
          </Suspense>
        </div>

        {/* All Kudos Feed + Sidebar */}
        <section id="all-kudos" className="px-4 py-16 sm:px-12 lg:px-[var(--spacing-page-padding-x)]">
          <SectionHeader
            subtitle={t.kudos.allKudosSubtitle}
            title={t.kudos.allKudosTitle}
          />
          <div className="mt-4">
            <AllKudosSection
              hashtag={hashtag}
              department={department}
              currentUserId={user.id}
              sidebar={sidebar}
            />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
