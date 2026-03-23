import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET } from "@/app/auth/callback/route";

const mockExchangeCodeForSession = vi.fn();
const mockGetUser = vi.fn();
const mockUpsert = vi.fn();

vi.mock("@/libs/supabase/server", () => ({
  createClient: vi.fn().mockResolvedValue({
    auth: {
      exchangeCodeForSession: (...args: unknown[]) =>
        mockExchangeCodeForSession(...args),
      getUser: (...args: unknown[]) => mockGetUser(...args),
    },
    from: () => ({ upsert: (...args: unknown[]) => mockUpsert(...args) }),
  }),
}));

function makeRequest(params: Record<string, string>) {
  const url = new URL("http://localhost:3000/auth/callback");
  Object.entries(params).forEach(([key, value]) =>
    url.searchParams.set(key, value)
  );
  return new Request(url.toString());
}

describe("GET /auth/callback", () => {
  beforeEach(() => {
    mockExchangeCodeForSession.mockReset();
    mockGetUser.mockReset();
    mockUpsert.mockReset();
    mockGetUser.mockResolvedValue({
      data: {
        user: {
          id: "user-123",
          email: "test@example.com",
          user_metadata: { full_name: "Test User", avatar_url: "https://example.com/avatar.png" },
        },
      },
    });
    mockUpsert.mockResolvedValue({ error: null });
  });

  it("exchanges code and redirects to / on success", async () => {
    mockExchangeCodeForSession.mockResolvedValue({ error: null });
    const response = await GET(makeRequest({ code: "test-code" }));

    expect(mockExchangeCodeForSession).toHaveBeenCalledWith("test-code");
    expect(response.status).toBe(307);
    expect(new URL(response.headers.get("Location")!).pathname).toBe("/");
  });

  it("redirects to redirect param when present and valid", async () => {
    mockExchangeCodeForSession.mockResolvedValue({ error: null });
    const response = await GET(
      makeRequest({ code: "test-code", redirect: "/kudos" })
    );

    expect(new URL(response.headers.get("Location")!).pathname).toBe(
      "/kudos"
    );
  });

  it("rejects non-relative redirect param (open redirect prevention)", async () => {
    mockExchangeCodeForSession.mockResolvedValue({ error: null });
    const response = await GET(
      makeRequest({ code: "test-code", redirect: "https://evil.com" })
    );

    expect(new URL(response.headers.get("Location")!).pathname).toBe("/");
  });

  it("rejects redirect with protocol injection", async () => {
    mockExchangeCodeForSession.mockResolvedValue({ error: null });
    const response = await GET(
      makeRequest({ code: "test-code", redirect: "/foo://bar" })
    );

    expect(new URL(response.headers.get("Location")!).pathname).toBe("/");
  });

  it("redirects to /login?error=auth_failed on code exchange failure", async () => {
    mockExchangeCodeForSession.mockResolvedValue({
      error: new Error("Invalid code"),
    });
    const response = await GET(makeRequest({ code: "bad-code" }));

    const location = new URL(response.headers.get("Location")!);
    expect(location.pathname).toBe("/login");
    expect(location.searchParams.get("error")).toBe("auth_failed");
  });

  it("silently redirects to /login on OAuth cancellation (access_denied)", async () => {
    const response = await GET(
      makeRequest({ error: "access_denied" })
    );

    const location = new URL(response.headers.get("Location")!);
    expect(location.pathname).toBe("/login");
    expect(location.searchParams.has("error")).toBe(false);
  });

  it("redirects to /login?error=auth_failed on other OAuth errors", async () => {
    const response = await GET(
      makeRequest({ error: "server_error" })
    );

    const location = new URL(response.headers.get("Location")!);
    expect(location.pathname).toBe("/login");
    expect(location.searchParams.get("error")).toBe("auth_failed");
  });

  it("upserts profile after successful code exchange", async () => {
    mockExchangeCodeForSession.mockResolvedValue({ error: null });
    await GET(makeRequest({ code: "test-code" }));

    expect(mockUpsert).toHaveBeenCalledWith(
      {
        id: "user-123",
        display_name: "Test User",
        email: "test@example.com",
        avatar_url: "https://example.com/avatar.png",
      },
      { onConflict: "id", ignoreDuplicates: false }
    );
  });

  it("redirects to /login when no params are provided", async () => {
    const response = await GET(makeRequest({}));

    const location = new URL(response.headers.get("Location")!);
    expect(location.pathname).toBe("/login");
  });
});
