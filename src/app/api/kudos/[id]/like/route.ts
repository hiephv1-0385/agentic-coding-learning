import { NextResponse } from "next/server";
import { createClient } from "@/libs/supabase/server";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  return handleToggleLike(await params);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  return handleToggleLike(await params);
}

async function handleToggleLike({ id }: { id: string }) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabase.rpc("toggle_like", {
      p_kudos_id: id,
      p_user_id: user.id,
    });

    if (error) {
      if (error.message.includes("not found")) {
        return NextResponse.json({ error: "Kudos not found" }, { status: 404 });
      }
      if (error.message.includes("Cannot like own")) {
        return NextResponse.json(
          { error: "Cannot like your own kudos" },
          { status: 403 }
        );
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
