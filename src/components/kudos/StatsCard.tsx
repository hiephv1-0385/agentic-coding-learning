import { createClient } from "@/libs/supabase/server";
import SecretBoxButton from "@/components/kudos/SecretBoxButton";
import { getServerTranslations } from "@/utils/getServerLocale";

interface StatsCardProps {
  userId: string;
}

interface StatRowProps {
  label: string;
  value: number;
}

function StatRow({ label, value }: StatRowProps) {
  return (
    <div className="flex flex-row items-center justify-between">
      <span className="font-[family-name:var(--font-montserrat)] text-base font-bold leading-6 text-text-white">
        {label}
      </span>
      <span className="font-[family-name:var(--font-montserrat)] text-[32px] font-bold leading-10 text-gold-primary">
        {value}
      </span>
    </div>
  );
}

export default async function StatsCard({ userId }: StatsCardProps) {
  const t = await getServerTranslations();
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("kudos_received_count, kudos_sent_count, hearts_received")
    .eq("id", userId)
    .single();

  const { data: secretBox } = await supabase
    .from("secret_boxes")
    .select("total_count, opened_count")
    .eq("user_id", userId)
    .single();

  const stats = {
    kudosReceived: profile?.kudos_received_count ?? 0,
    kudosSent: profile?.kudos_sent_count ?? 0,
    heartsReceived: profile?.hearts_received ?? 0,
    secretBoxesOpened: secretBox?.opened_count ?? 0,
    secretBoxesRemaining: (secretBox?.total_count ?? 0) - (secretBox?.opened_count ?? 0),
  };

  return (
    <div className="flex flex-col gap-4 rounded-sidebar-card border border-border bg-container-dark p-6">
      <StatRow label={t.kudos.statsKudosReceived} value={stats.kudosReceived} />
      <div className="h-px bg-divider" />
      <StatRow label={t.kudos.statsKudosSent} value={stats.kudosSent} />
      <div className="h-px bg-divider" />
      <StatRow label={t.kudos.statsHeartsReceived} value={stats.heartsReceived} />
      <div className="h-px bg-divider" />
      <StatRow label={t.kudos.statsSecretBoxOpened} value={stats.secretBoxesOpened} />
      <div className="h-px bg-divider" />
      <StatRow label={t.kudos.statsSecretBoxRemaining} value={stats.secretBoxesRemaining} />
      <div className="h-px bg-divider" />
      <SecretBoxButton remainingBoxes={stats.secretBoxesRemaining} />
    </div>
  );
}
