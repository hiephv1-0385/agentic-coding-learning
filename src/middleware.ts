import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/libs/supabase/middleware";
import { validateRedirect } from "@/utils/validateRedirect";

const PROTECTED_ROUTES = ["/kudos"];

function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
}

function copySessionCookies(
  from: NextResponse,
  to: NextResponse
): NextResponse {
  from.cookies.getAll().forEach((cookie) => {
    to.cookies.set(cookie.name, cookie.value, cookie);
  });
  return to;
}

function setSecurityHeaders(response: NextResponse): void {
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set(
    "Referrer-Policy",
    "strict-origin-when-cross-origin"
  );
}

export async function middleware(request: NextRequest) {
  const { supabase, supabaseResponse } = createClient(request);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname, searchParams } = request.nextUrl;

  // Authenticated user visiting /login → redirect to homepage or redirect param
  if (pathname === "/login" && user) {
    const redirect = validateRedirect(searchParams.get("redirect"));
    const redirectResponse = NextResponse.redirect(
      new URL(redirect, request.url)
    );
    copySessionCookies(supabaseResponse, redirectResponse);
    setSecurityHeaders(redirectResponse);
    return redirectResponse;
  }

  // Unauthenticated user visiting protected route → redirect to login
  if (isProtectedRoute(pathname) && !user) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    const redirectResponse = NextResponse.redirect(loginUrl);
    copySessionCookies(supabaseResponse, redirectResponse);
    setSecurityHeaders(redirectResponse);
    return redirectResponse;
  }

  // Default: set security headers and pass through
  setSecurityHeaders(supabaseResponse);
  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
