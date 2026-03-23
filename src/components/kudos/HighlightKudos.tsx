import { createClient } from "@/libs/supabase/server";
import SectionHeader from "@/components/kudos/SectionHeader";
import KudosCarousel from "@/components/kudos/KudosCarousel";
import { getServerTranslations } from "@/utils/getServerLocale";

interface HighlightKudosProps {
  hashtag?: string;
  department?: string;
  currentUserId: string;
  filterSlot?: React.ReactNode;
}

export default async function HighlightKudos({
  hashtag,
  department,
  currentUserId,
  filterSlot,
}: HighlightKudosProps) {
  const t = await getServerTranslations();
  const supabase = await createClient();

  let query = supabase
    .from("kudos")
    .select(
      `
      *,
      sender:profiles!kudos_sender_id_fkey(*),
      receiver:profiles!kudos_receiver_id_fkey(*)
    `
    )
    .order("heart_count", { ascending: false })
    .limit(5);

  if (hashtag) {
    query = query.contains("hashtags", [hashtag]);
  }

  if (department) {
    const { data: deptProfiles } = await supabase
      .from("profiles")
      .select("id")
      .eq("department", department);

    const profileIds = deptProfiles?.map((p) => p.id) ?? [];
    if (profileIds.length === 0) {
      return (
        <section className="px-4 sm:px-12 lg:px-[var(--spacing-page-padding-x)]">
          <SectionHeader subtitle={t.kudos.highlightSubtitle} title={t.kudos.highlightTitle}>
            {filterSlot}
          </SectionHeader>
          <div className="mt-4">
            <p className="py-8 text-center font-[family-name:var(--font-montserrat)] text-base text-text-gray">
              {t.kudos.highlightEmpty}
            </p>
          </div>
        </section>
      );
    }
    query = query.or(
      profileIds.map((id) => `sender_id.eq.${id}`).join(",") +
        "," +
        profileIds.map((id) => `receiver_id.eq.${id}`).join(",")
    );
  }

  const { data: kudos } = await query;

  // Check likes for current user
  const items = kudos ?? [];
  if (items.length > 0) {
    const kudosIds = items.map((k) => k.id);
    const { data: likes } = await supabase
      .from("kudos_likes")
      .select("kudos_id")
      .eq("user_id", currentUserId)
      .in("kudos_id", kudosIds);

    const likedSet = new Set(likes?.map((l) => l.kudos_id) ?? []);
    for (const k of items) {
      k.is_liked_by_me = likedSet.has(k.id);
    }
  }

  return (
    <section className="px-4 sm:px-12 lg:px-[var(--spacing-page-padding-x)]">
      <SectionHeader
        subtitle={t.kudos.highlightSubtitle}
        title={t.kudos.highlightTitle}
      >
        {filterSlot}
      </SectionHeader>

      <div className="mt-4">
        {items.length > 0 ? (
          <KudosCarousel kudos={items} currentUserId={currentUserId} />
        ) : (
          <p className="py-8 text-center font-[family-name:var(--font-montserrat)] text-base text-text-gray">
            {t.kudos.highlightEmpty}
          </p>
        )}
      </div>
    </section>
  );
}
