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
    const q = (searchParams.get("q") ?? "").slice(0, 100);

    if (!q.trim()) {
      return NextResponse.json({ data: [] });
    }

    const { data, error } = await supabase
      .from("profiles")
      .select("id, display_name, email, department, avatar_url")
      .ilike("display_name", `%${q}%`)
      .limit(20);

    if (error) throw error;

    return NextResponse.json({ data: data ?? [] });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
