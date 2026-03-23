import { createClient } from "@/libs/supabase/server";
import SectionHeader from "@/components/kudos/SectionHeader";
import SpotlightInteractive from "@/components/kudos/SpotlightInteractive";
import { getServerTranslations } from "@/utils/getServerLocale";
import type { LiveKudosEntry } from "@/types/kudos";

export default async function SpotlightBoard() {
  const t = await getServerTranslations();
  const supabase = await createClient();

  const { data: spotlight } = await supabase
    .from("kudos")
    .select(
      `
      receiver_id,
      receiver:profiles!kudos_receiver_id_fkey(display_name)
    `
    )
    .not("receiver_id", "is", null);

  // Aggregate by receiver
  const countMap = new Map<
    string,
    { user_id: string; display_name: string; kudos_count: number }
  >();

  for (const row of spotlight ?? []) {
    const id = row.receiver_id as string;
    const receiver = row.receiver as unknown as { display_name: string } | null;
    const name = receiver?.display_name ?? "Unknown";
    const existing = countMap.get(id);
    if (existing) {
      existing.kudos_count += 1;
    } else {
      countMap.set(id, { user_id: id, display_name: name, kudos_count: 1 });
    }
  }

  const entries = Array.from(countMap.values()).sort(
    (a, b) => b.kudos_count - a.kudos_count
  );
  const totalKudos = entries.reduce((sum, e) => sum + e.kudos_count, 0);

  // Fetch recent kudos for the live ticker
  const { data: recentKudos } = await supabase
    .from("kudos")
    .select(
      `
      created_at,
      receiver:profiles!kudos_receiver_id_fkey(display_name)
    `
    )
    .not("receiver_id", "is", null)
    .order("created_at", { ascending: false })
    .limit(10);

  const liveKudos: LiveKudosEntry[] = (recentKudos ?? []).map((row) => {
    const receiver = row.receiver as unknown as { display_name: string } | null;
    return {
      receiver_name: receiver?.display_name ?? "Unknown",
      created_at: row.created_at as string,
    };
  });

  return (
    <section className="px-4 sm:px-12 lg:px-[var(--spacing-page-padding-x)]">
      <SectionHeader
        subtitle={t.kudos.spotlightSubtitle}
        title={t.kudos.spotlightTitle}
      />

      <div className="mt-4 flex justify-center">
        <div className="relative w-full max-w-[1157px] overflow-hidden rounded-spotlight border border-border">
          {/* Dark overlay background */}
          <div className="absolute inset-0 bg-container-dark/70" />

          <div className="relative">
            <SpotlightInteractive
              entries={entries}
              totalKudos={totalKudos}
              liveKudos={liveKudos}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
