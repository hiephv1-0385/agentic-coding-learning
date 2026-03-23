import { render, screen, cleanup } from "@testing-library/react";
import { describe, it, expect, vi, afterEach } from "vitest";
import LoginPage from "@/app/(auth)/login/page";

vi.mock("@/components/auth/LoginHeader", () => ({
  default: () => <header data-testid="login-header">Header</header>,
}));

vi.mock("@/components/auth/LoginHero", () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <main data-testid="login-hero">{children}</main>
  ),
}));

vi.mock("@/components/auth/LoginButton", () => ({
  default: ({ error, redirect }: { error?: string; redirect?: string }) => (
    <button data-testid="login-button" data-error={error || ""} data-redirect={redirect || ""}>
      Login
    </button>
  ),
}));

vi.mock("@/components/auth/LoginFooter", () => ({
  default: () => <footer data-testid="login-footer">Footer</footer>,
}));

vi.mock("next/image", () => ({
  // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
  default: (props: Record<string, unknown>) => <img {...props} />,
}));

describe("LoginPage", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders all major sections", async () => {
    const page = await LoginPage({
      searchParams: Promise.resolve({}),
    });
    render(page);

    expect(screen.getByTestId("login-header")).toBeInTheDocument();
    expect(screen.getByTestId("login-hero")).toBeInTheDocument();
    expect(screen.getByTestId("login-button")).toBeInTheDocument();
    expect(screen.getByTestId("login-footer")).toBeInTheDocument();
  });

  it("passes error and redirect params to LoginButton", async () => {
    const page = await LoginPage({
      searchParams: Promise.resolve({ error: "auth_failed", redirect: "/kudos" }),
    });
    render(page);

    const button = screen.getByTestId("login-button");
    expect(button).toHaveAttribute("data-error", "auth_failed");
    expect(button).toHaveAttribute("data-redirect", "/kudos");
  });

  it("renders background image with decorative attributes", async () => {
    const page = await LoginPage({
      searchParams: Promise.resolve({}),
    });
    render(page);

    const bgImage = document.querySelector('img[src="/images/hero-banner.png"]');
    expect(bgImage).toBeInTheDocument();
    expect(bgImage).toHaveAttribute("aria-hidden", "true");
    expect(bgImage).toHaveAttribute("alt", "");
  });
});
