import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { middleware } from "@/middleware";

const mockGetUser = vi.fn();

vi.mock("@/libs/supabase/middleware", async () => {
  const { NextResponse } = await import("next/server");
  return {
    createClient: () => {
      const supabaseResponse = NextResponse.next();
      return {
        supabase: {
          auth: {
            getUser: mockGetUser,
          },
        },
        supabaseResponse,
      };
    },
  };
});

function makeRequest(path: string) {
  return new NextRequest(new URL(path, "http://localhost:3000"));
}

describe("middleware", () => {
  beforeEach(() => {
    mockGetUser.mockReset();
  });

  it("allows unauthenticated access to public routes", async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } });

    for (const path of ["/", "/awards", "/awards/best-team", "/login"]) {
      const response = await middleware(makeRequest(path));
      expect(response.status).toBe(200);
    }
  });

  it("redirects unauthenticated user from /kudos to /login with redirect param", async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } });
    const response = await middleware(makeRequest("/kudos"));

    expect(response.status).toBe(307);
    const location = new URL(response.headers.get("Location")!);
    expect(location.pathname).toBe("/login");
    expect(location.searchParams.get("redirect")).toBe("/kudos");
  });

  it("redirects unauthenticated user from /kudos/123 to /login", async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } });
    const response = await middleware(makeRequest("/kudos/123"));

    expect(response.status).toBe(307);
    const location = new URL(response.headers.get("Location")!);
    expect(location.pathname).toBe("/login");
    expect(location.searchParams.get("redirect")).toBe("/kudos/123");
  });

  it("redirects authenticated user from /login to /", async () => {
    mockGetUser.mockResolvedValue({
      data: { user: { id: "user-1" } },
    });
    const response = await middleware(makeRequest("/login"));

    expect(response.status).toBe(307);
    expect(new URL(response.headers.get("Location")!).pathname).toBe("/");
  });

  it("redirects authenticated user from /login to redirect param", async () => {
    mockGetUser.mockResolvedValue({
      data: { user: { id: "user-1" } },
    });
    const response = await middleware(
      makeRequest("/login?redirect=/kudos")
    );

    expect(response.status).toBe(307);
    expect(new URL(response.headers.get("Location")!).pathname).toBe(
      "/kudos"
    );
  });

  it("validates redirect param for authenticated user (rejects protocol)", async () => {
    mockGetUser.mockResolvedValue({
      data: { user: { id: "user-1" } },
    });
    const response = await middleware(
      makeRequest("/login?redirect=https://evil.com")
    );

    expect(response.status).toBe(307);
    expect(new URL(response.headers.get("Location")!).pathname).toBe("/");
  });

  it("sets security headers on all responses", async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } });
    const response = await middleware(makeRequest("/"));

    expect(response.headers.get("X-Frame-Options")).toBe("DENY");
    expect(response.headers.get("X-Content-Type-Options")).toBe("nosniff");
    expect(response.headers.get("Referrer-Policy")).toBe(
      "strict-origin-when-cross-origin"
    );
  });

  it("sets security headers on redirect responses", async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } });
    const response = await middleware(makeRequest("/kudos"));

    expect(response.headers.get("X-Frame-Options")).toBe("DENY");
  });
});
