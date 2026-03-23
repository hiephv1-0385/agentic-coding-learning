import { NextResponse } from "next/server";
import { createClient } from "@/libs/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("award_categories")
      .select("id, name, slug, short_description, thumbnail_url, order")
      .order("order", { ascending: true });

    if (error) throw error;

    const awards = (data ?? []).map((row) => ({
      id: row.id,
      name: row.name,
      slug: row.slug,
      shortDescription: row.short_description,
      thumbnailUrl: row.thumbnail_url,
      order: row.order,
    }));

    return NextResponse.json(awards);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch award categories" },
      { status: 500 }
    );
  }
}
