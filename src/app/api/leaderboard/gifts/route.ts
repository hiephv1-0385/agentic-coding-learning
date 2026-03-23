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

    const { data, error } = await supabase
      .from("gift_recipients")
      .select(
        `
        id,
        gift_description,
        awarded_at,
        user:profiles!gift_recipients_user_id_fkey(id, display_name, avatar_url, department)
      `
      )
      .order("awarded_at", { ascending: false })
      .limit(10);

    if (error) throw error;

    return NextResponse.json({ data: data ?? [] });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
