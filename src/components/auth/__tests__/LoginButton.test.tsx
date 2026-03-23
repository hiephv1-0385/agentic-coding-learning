import { screen, fireEvent, act, cleanup } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import LoginButton from "@/components/auth/LoginButton";
import { renderWithProviders as render } from "@/__tests__/test-utils";

const mockSignInWithOAuth = vi.fn();

vi.mock("@/libs/supabase/client", () => ({
  createClient: () => ({
    auth: {
      signInWithOAuth: mockSignInWithOAuth,
    },
  }),
}));

describe("LoginButton", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    mockSignInWithOAuth.mockResolvedValue({ data: { url: "https://accounts.google.com" }, error: null });
  });

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("renders the login button with correct text", () => {
    render(<LoginButton />);
    expect(screen.getByRole("button", { name: "Đăng nhập bằng Google" })).toBeInTheDocument();
    expect(screen.getByText("LOGIN With Google")).toBeInTheDocument();
  });

  it("initiates OAuth with correct provider and redirectTo URL", async () => {
    render(<LoginButton />);
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Đăng nhập bằng Google" }));
    });

    expect(mockSignInWithOAuth).toHaveBeenCalledWith({
      provider: "google",
      options: {
        redirectTo: expect.stringContaining("/auth/callback"),
      },
    });
  });

  it("passes redirect param through to OAuth redirectTo", async () => {
    render(<LoginButton redirect="/kudos" />);
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Đăng nhập bằng Google" }));
    });

    expect(mockSignInWithOAuth).toHaveBeenCalledWith({
      provider: "google",
      options: {
        redirectTo: expect.stringContaining("redirect=%2Fkudos"),
      },
    });
  });

  it("shows loading spinner when clicked", async () => {
    mockSignInWithOAuth.mockReturnValue(new Promise(() => {})); // never resolves
    render(<LoginButton />);

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Đăng nhập bằng Google" }));
    });

    expect(screen.getByRole("button", { name: "Đăng nhập bằng Google" })).toBeDisabled();
  });

  it("shows auth_failed error from URL param", () => {
    const replaceStateSpy = vi.spyOn(window.history, "replaceState").mockImplementation(() => {});
    render(<LoginButton error="auth_failed" />);

    expect(screen.getByRole("alert")).toHaveTextContent("Đăng nhập thất bại. Vui lòng thử lại.");
    replaceStateSpy.mockRestore();
  });

  it("auto-dismisses URL-based error after 5 seconds", () => {
    const replaceStateSpy = vi.spyOn(window.history, "replaceState").mockImplementation(() => {});
    render(<LoginButton error="auth_failed" />);

    expect(screen.getByRole("alert")).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    replaceStateSpy.mockRestore();
  });

  it("shows network error when signInWithOAuth returns error", async () => {
    mockSignInWithOAuth.mockResolvedValue({ data: null, error: new Error("Network error") });
    render(<LoginButton />);

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Đăng nhập bằng Google" }));
    });

    expect(screen.getByRole("alert")).toHaveTextContent("Đã xảy ra lỗi. Vui lòng thử lại.");
  });

  it("does not auto-dismiss network errors", async () => {
    mockSignInWithOAuth.mockResolvedValue({ data: null, error: new Error("Network error") });
    render(<LoginButton />);

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Đăng nhập bằng Google" }));
    });

    expect(screen.getByRole("alert")).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(10000);
    });

    // Network error should still be visible
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  it("cleans error param from URL on mount", () => {
    const replaceStateSpy = vi.spyOn(window.history, "replaceState").mockImplementation(() => {});
    render(<LoginButton error="auth_failed" />);

    expect(replaceStateSpy).toHaveBeenCalled();
    replaceStateSpy.mockRestore();
  });
});
