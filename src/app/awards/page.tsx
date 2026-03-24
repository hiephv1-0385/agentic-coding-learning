import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import AwardsHeroSection from "@/components/awards/AwardsHeroSection";
import SectionTitle from "@/components/awards/SectionTitle";
import AwardSidebar from "@/components/awards/AwardSidebar";
import AwardCard from "@/components/awards/AwardCard";
import AwardsSunKudosSection from "@/components/awards/AwardsSunKudosSection";
import { createClient } from "@/libs/supabase/server";
import { getServerTranslations } from "@/utils/getServerLocale";

export default async function AwardsPage() {
  const t = await getServerTranslations();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("award_categories")
    .select(
      "id, name, slug, short_description, description, thumbnail_url, order, quantity, unit_type, prize_value, prize_sub_label, prize_value_team, prize_sub_label_team"
    )
    .order("order", { ascending: true });

  if (error) throw error;

  const categories = (data ?? []).map((row) => ({
    id: row.id,
    name: row.name,
    slug: row.slug,
    shortDescription: row.short_description,
    description: row.description,
    thumbnailUrl: row.thumbnail_url,
    order: row.order,
    quantity: row.quantity,
    unitType: row.unit_type,
    prizeValue: row.prize_value,
    prizeSubLabel: row.prize_sub_label,
    prizeValueTeam: row.prize_value_team ?? null,
    prizeSubLabelTeam: row.prize_sub_label_team ?? null,
  }));

  return (
    <div className="min-h-screen bg-page-bg">
      <Header activeLink="awards" />
      <AwardsHeroSection />
      <main className="relative z-10 -mt-32 flex flex-col px-4 pt-8 pb-16 sm:px-10 lg:-mt-[180px] lg:px-36 lg:pt-0 lg:pb-page-padding-y">
        <SectionTitle />

        {categories.length === 0 ? (
          <p className="py-20 text-center font-[family-name:var(--font-montserrat)] text-base text-white">
            {t.awards.noAwards}
          </p>
        ) : (
          <>
            <section className="mt-6 flex flex-col gap-awards-gap lg:mt-10 lg:flex-row">
              <AwardSidebar
                categories={categories.map((c) => ({
                  id: c.id,
                  name: c.name,
                  slug: c.slug,
                }))}
              />
              <div className="flex flex-col gap-section-gap">
                {categories.map((award, i) => (
                  <AwardCard
                    key={award.id}
                    award={award}
                    index={i}
                    id={`award-${award.slug}`}
                  />
                ))}
              </div>
            </section>
            <div className="mt-section-gap">
              <AwardsSunKudosSection />
            </div>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
