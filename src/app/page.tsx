import { createClient } from "@/libs/supabase/server";
import type { Event } from "@/types/event";
import type { AwardCategory } from "@/types/award";
import Header from "@/components/shared/Header";
import HeroBanner from "@/components/homepage/HeroBanner";
import RootFurtherContent from "@/components/homepage/RootFurtherContent";
import AwardsOverview from "@/components/homepage/AwardsOverview";
import SunKudosPromo from "@/components/shared/SunKudosPromo";
import Footer from "@/components/shared/Footer";

async function fetchEvent(): Promise<Event | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("events")
      .select(
        "id, name, theme, date_time, venue, livestream_info, hero_banner_url"
      )
      .limit(1)
      .single();

    if (error || !data) return null;

    return {
      id: data.id,
      name: data.name,
      theme: data.theme,
      dateTime: data.date_time,
      venue: data.venue,
      livestreamInfo: data.livestream_info,
      heroBannerUrl: data.hero_banner_url,
    };
  } catch {
    return null;
  }
}

async function fetchAwards(): Promise<AwardCategory[] | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("award_categories")
      .select("id, name, slug, short_description, thumbnail_url, order")
      .order("order", { ascending: true });

    if (error || !data) return null;

    return data.map((row) => ({
      id: row.id,
      name: row.name,
      slug: row.slug,
      shortDescription: row.short_description,
      description: "",
      thumbnailUrl: row.thumbnail_url,
      order: row.order,
      quantity: 0,
      unitType: "",
      prizeValue: 0,
      prizeSubLabel: "",
      prizeValueTeam: null,
      prizeSubLabelTeam: null,
    }));
  } catch {
    return null;
  }
}

export default async function HomePage() {
  const [event, awards] = await Promise.all([fetchEvent(), fetchAwards()]);

  return (
    <div className="min-h-screen bg-page-bg max-w-page mx-auto">
      <h1 className="sr-only">Sun* Annual Awards 2025</h1>

      <Header activeLink="about" />

      {/* Hero Banner — full-bleed, OUTSIDE main */}
      <HeroBanner event={event} />

      {/* Main content — padded sections */}
      <main className="flex flex-col items-center gap-16 lg:gap-[--spacing-section-gap] px-4 sm:px-12 lg:px-36 py-12 lg:py-[--spacing-page-padding-y]">
        <RootFurtherContent />
        <AwardsOverview awards={awards} />
        <SunKudosPromo />
      </main>

      <Footer />
    </div>
  );
}
