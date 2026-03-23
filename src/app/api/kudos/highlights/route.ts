import { NextResponse } from "next/server";
import { createClient } from "@/libs/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const hashtag = searchParams.get("hashtag");
    const department = searchParams.get("department");

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
      query = query.or(
        `sender.department.eq.${department},receiver.department.eq.${department}`
      );
    }

    const { data: kudos, error } = await query;
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Check likes for current user
    if (kudos && kudos.length > 0) {
      const kudosIds = kudos.map((k) => k.id);
      const { data: likes } = await supabase
        .from("kudos_likes")
        .select("kudos_id")
        .eq("user_id", user.id)
        .in("kudos_id", kudosIds);

      const likedSet = new Set(likes?.map((l) => l.kudos_id) ?? []);
      for (const k of kudos) {
        k.is_liked_by_me = likedSet.has(k.id);
      }
    }

    return NextResponse.json({ data: kudos ?? [] });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
