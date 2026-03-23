import { NextResponse } from "next/server";
import { createClient } from "@/libs/supabase/server";
import { cursorPaginationParamsSchema, createKudosSchema } from "@/types/kudos";
import { sanitizeKudosContent } from "@/utils/sanitizeHtml";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = createKudosSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
        { status: 422 }
      );
    }

    const { receiver_id, danh_hieu, content, hashtags, images, is_anonymous, anonymous_name } =
      parsed.data;

    if (user.id === receiver_id) {
      return NextResponse.json(
        { error: "Cannot send kudos to yourself" },
        { status: 400 }
      );
    }

    const sanitizedContent = sanitizeKudosContent(content);

    const { data: kudos, error } = await supabase.rpc("create_kudos", {
      p_receiver_id: receiver_id,
      p_danh_hieu: danh_hieu,
      p_content: sanitizedContent,
      p_hashtags: hashtags,
      p_images: images,
      p_is_anonymous: is_anonymous,
      p_anonymous_name: anonymous_name,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(kudos, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

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
    const params = cursorPaginationParamsSchema.parse({
      cursor: searchParams.get("cursor") ?? undefined,
      limit: searchParams.get("limit") ?? 10,
      hashtag: searchParams.get("hashtag") ?? undefined,
      department: searchParams.get("department") ?? undefined,
    });

    let query = supabase
      .from("kudos")
      .select(
        `
        *,
        sender:profiles!kudos_sender_id_fkey(*),
        receiver:profiles!kudos_receiver_id_fkey(*)
      `
      )
      .order("created_at", { ascending: false })
      .limit(params.limit + 1);

    if (params.cursor) {
      query = query.lt("created_at", params.cursor);
    }

    if (params.hashtag) {
      query = query.contains("hashtags", [params.hashtag]);
    }

    if (params.department) {
      const { data: deptProfiles } = await supabase
        .from("profiles")
        .select("id")
        .eq("department", params.department);

      const profileIds = deptProfiles?.map((p) => p.id) ?? [];
      if (profileIds.length === 0) {
        return NextResponse.json({
          data: [],
          next_cursor: null,
          has_more: false,
        });
      }
      query = query.or(
        profileIds.map((id) => `sender_id.eq.${id}`).join(",") +
          "," +
          profileIds.map((id) => `receiver_id.eq.${id}`).join(",")
      );
    }

    const { data: kudos, error } = await query;
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const hasMore = (kudos?.length ?? 0) > params.limit;
    const items = hasMore ? kudos!.slice(0, params.limit) : (kudos ?? []);

    // Check which kudos the current user has liked
    if (items.length > 0) {
      const kudosIds = items.map((k) => k.id);
      const { data: likes } = await supabase
        .from("kudos_likes")
        .select("kudos_id")
        .eq("user_id", user.id)
        .in("kudos_id", kudosIds);

      const likedSet = new Set(likes?.map((l) => l.kudos_id) ?? []);
      for (const kudos of items) {
        kudos.is_liked_by_me = likedSet.has(kudos.id);
      }
    }

    return NextResponse.json({
      data: items,
      next_cursor: hasMore ? items[items.length - 1].created_at : null,
      has_more: hasMore,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
