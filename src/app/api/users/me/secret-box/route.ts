import { NextResponse } from "next/server";
import { createClient } from "@/libs/supabase/server";

const BADGE_PROBABILITIES = [
  { type: "STAY_GOLD", weight: 30 },
  { type: "FLOW_TO_HORIZON", weight: 25 },
  { type: "TOUCH_OF_LIGHT", weight: 20 },
  { type: "BEYOND_THE_BOUNDARY", weight: 10 },
  { type: "REVIVAL", weight: 10 },
  { type: "ROOT_FURTHER", weight: 5 },
] as const;

function selectRandomBadge(): string {
  const totalWeight = BADGE_PROBABILITIES.reduce((sum, b) => sum + b.weight, 0);
  const randomArray = new Uint32Array(1);
  crypto.getRandomValues(randomArray);
  const random = randomArray[0] / 0xffffffff;
  let cumulative = 0;

  for (const badge of BADGE_PROBABILITIES) {
    cumulative += badge.weight / totalWeight;
    if (random <= cumulative) {
      return badge.type;
    }
  }

  return BADGE_PROBABILITIES[0].type;
}

export async function POST() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch current secret box
    const { data: secretBox, error: fetchError } = await supabase
      .from("secret_boxes")
      .select("id, total_count, opened_count")
      .eq("user_id", user.id)
      .single();

    if (fetchError) {
      if (fetchError.code === "PGRST116") {
        return NextResponse.json(
          { error: "No secret boxes available" },
          { status: 400 }
        );
      }
      throw fetchError;
    }

    const remaining = secretBox.total_count - secretBox.opened_count;
    if (remaining <= 0) {
      return NextResponse.json(
        { error: "No secret boxes remaining" },
        { status: 400 }
      );
    }

    // Increment opened_count
    const { data: updated, error: updateError } = await supabase
      .from("secret_boxes")
      .update({ opened_count: secretBox.opened_count + 1 })
      .eq("id", secretBox.id)
      .select("total_count, opened_count")
      .single();

    if (updateError) throw updateError;

    // Assign a random badge
    const badgeType = selectRandomBadge();
    const { error: badgeError } = await supabase
      .from("user_badges")
      .insert({ user_id: user.id, badge_type: badgeType });

    if (badgeError) {
      // Rollback: decrement opened_count back
      await supabase
        .from("secret_boxes")
        .update({ opened_count: secretBox.opened_count })
        .eq("id", secretBox.id);
      throw badgeError;
    }

    return NextResponse.json({
      data: {
        opened_count: updated.opened_count,
        remaining: updated.total_count - updated.opened_count,
        badge_type: badgeType,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
