import { NextResponse } from "next/server";
import { createClient } from "@/libs/supabase/server";
import { validateRedirect } from "@/utils/validateRedirect";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);

  const code = searchParams.get("code");
  const error = searchParams.get("error");
  const redirect = searchParams.get("redirect");

  // User cancelled OAuth (e.g. clicked "Cancel" on Google consent screen)
  if (error === "access_denied") {
    return NextResponse.redirect(new URL("/login", origin));
  }

  // Other OAuth errors (provider error, denied domain, etc.)
  if (error) {
    return NextResponse.redirect(
      new URL("/login?error=auth_failed", origin)
    );
  }

  // Exchange authorization code for session
  if (code) {
    const supabase = await createClient();
    const { error: exchangeError } =
      await supabase.auth.exchangeCodeForSession(code);

    if (exchangeError) {
      return NextResponse.redirect(
        new URL("/login?error=auth_failed", origin)
      );
    }

    // Ensure user has a profile record (required by FK constraints)
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();

    if (authUser) {
      const metadata = authUser.user_metadata ?? {};
      await supabase.from("profiles").upsert(
        {
          id: authUser.id,
          display_name:
            metadata.full_name ?? metadata.name ?? authUser.email ?? "User",
          email: authUser.email,
          avatar_url: metadata.avatar_url ?? metadata.picture ?? null,
        },
        { onConflict: "id", ignoreDuplicates: false }
      );
    }

    const validatedRedirect = validateRedirect(redirect);
    return NextResponse.redirect(new URL(validatedRedirect, origin));
  }

  // No code and no error — safety fallback
  return NextResponse.redirect(new URL("/login", origin));
}
