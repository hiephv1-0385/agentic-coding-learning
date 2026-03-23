import { NextResponse } from "next/server";
import { createClient } from "@/libs/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Aggregate kudos by receiver, joining with profiles for display_name
    const { data, error } = await supabase
      .from("kudos")
      .select("receiver_id, receiver:profiles!kudos_receiver_id_fkey(display_name)");

    if (error) throw error;

    // Aggregate counts by receiver
    const countMap = new Map<string, { display_name: string; kudos_count: number }>();
    let totalKudos = 0;

    for (const row of data ?? []) {
      totalKudos++;
      const existing = countMap.get(row.receiver_id);
      if (existing) {
        existing.kudos_count++;
      } else {
        const displayName =
          (row.receiver as unknown as { display_name: string })?.display_name ?? "Unknown";
        countMap.set(row.receiver_id, {
          display_name: displayName,
          kudos_count: 1,
        });
      }
    }

    const spotlight = Array.from(countMap.values()).sort(
      (a, b) => b.kudos_count - a.kudos_count
    );

    return NextResponse.json({
      data: spotlight,
      total_kudos: totalKudos,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
