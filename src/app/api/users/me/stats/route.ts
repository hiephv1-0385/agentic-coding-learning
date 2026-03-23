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

    // Fetch profile stats
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("kudos_received_count, kudos_sent_count, hearts_received")
      .eq("id", user.id)
      .single();

    if (profileError) throw profileError;

    // Fetch secret box stats
    const { data: secretBox, error: boxError } = await supabase
      .from("secret_boxes")
      .select("total_count, opened_count")
      .eq("user_id", user.id)
      .single();

    if (boxError && boxError.code !== "PGRST116") throw boxError;

    const totalBoxes = secretBox?.total_count ?? 0;
    const openedBoxes = secretBox?.opened_count ?? 0;

    return NextResponse.json({
      data: {
        kudos_received: profile.kudos_received_count,
        kudos_sent: profile.kudos_sent_count,
        hearts_received: profile.hearts_received,
        secret_boxes_opened: openedBoxes,
        secret_boxes_remaining: totalBoxes - openedBoxes,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
