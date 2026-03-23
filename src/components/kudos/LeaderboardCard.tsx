import Image from "next/image";
import { createClient } from "@/libs/supabase/server";
import { getServerTranslations } from "@/utils/getServerLocale";

export default async function LeaderboardCard() {
  const t = await getServerTranslations();
  const supabase = await createClient();

  const { data: recipients } = await supabase
    .from("gift_recipients")
    .select(
      `
      *,
      user:profiles!gift_recipients_user_id_fkey(display_name, avatar_url, department)
    `
    )
    .order("awarded_at", { ascending: false })
    .limit(10);

  const items = recipients ?? [];

  return (
    <div className="flex flex-col gap-4 rounded-sidebar-card border border-border bg-container-dark p-6 pr-4">
      <h3 className="font-[family-name:var(--font-montserrat)] text-[22px] font-bold leading-7 text-gold-primary">
        {t.kudos.leaderboardTitle}
      </h3>

      {items.length === 0 ? (
        <p className="py-4 font-[family-name:var(--font-montserrat)] text-base text-text-gray">
          {t.kudos.leaderboardNoData}
        </p>
      ) : (
        <div className="flex max-h-96 flex-col gap-4 overflow-y-auto pr-2" style={{ scrollbarWidth: "thin" }}>
          {items.map((item) => (
            <div key={item.id} className="flex flex-row items-center gap-2">
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border-[1.87px] border-white">
                {item.user?.avatar_url ? (
                  <Image
                    src={item.user.avatar_url}
                    alt={`${item.user.display_name} profile photo`}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gold-10 text-gold-primary">
                    <span className="font-[family-name:var(--font-montserrat)] text-lg font-bold">
                      {item.user?.display_name?.charAt(0) ?? "?"}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex flex-col">
                <span className="font-[family-name:var(--font-montserrat)] text-[22px] font-bold leading-7 text-gold-primary">
                  {item.user?.display_name ?? "Unknown"}
                </span>
                <span className="font-[family-name:var(--font-montserrat)] text-base font-bold leading-6 text-text-white">
                  {item.gift_description}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
