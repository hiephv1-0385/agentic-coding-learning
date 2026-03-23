import { NextResponse } from "next/server";
import { createClient } from "@/libs/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("events")
      .select("id, name, theme, date_time, venue, livestream_info, hero_banner_url")
      .limit(1)
      .single();

    if (error) throw error;

    const event = {
      id: data.id,
      name: data.name,
      theme: data.theme,
      dateTime: data.date_time,
      venue: data.venue,
      livestreamInfo: data.livestream_info,
      heroBannerUrl: data.hero_banner_url,
    };

    return NextResponse.json(event);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch event" },
      { status: 500 }
    );
  }
}
