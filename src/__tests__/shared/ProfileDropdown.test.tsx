import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { screen, act, cleanup, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@/__tests__/test-utils";
import ProfileDropdown from "@/components/shared/ProfileDropdown";

// Mock Supabase client
const mockSignOut = vi.fn();
const mockGetUser = vi.fn();

vi.mock("@/libs/supabase/client", () => ({
  createClient: () => ({
    auth: {
      getUser: mockGetUser,
      signOut: mockSignOut,
    },
  }),
}));

// Access the mocked router from vitest.setup.ts
const mockRouter = vi.mocked(
  await import("next/navigation").then((m) => m.useRouter())
);

describe("ProfileDropdown", () => {
  beforeEach(() => {
    mockGetUser.mockResolvedValue({
      data: { user: { id: "test-user-id" } },
      error: null,
    });
    mockSignOut.mockResolvedValue({ error: null });
  });

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  // --- Phase 2: US3 — Open/Close Dropdown ---

  describe("US3: Open and Close Dropdown", () => {
    it("renders trigger with aria-haspopup='menu' and aria-expanded='false'", async () => {
      renderWithProviders(<ProfileDropdown />, { locale: "en" });

      const trigger = await screen.findByRole("button", { name: "Profile" });
      expect(trigger).toHaveAttribute("aria-haspopup", "menu");
      expect(trigger).toHaveAttribute("aria-expanded", "false");
    });

    it("opens dropdown on trigger click with correct ARIA", async () => {
      const user = userEvent.setup();
      renderWithProviders(<ProfileDropdown />, { locale: "en" });

      const trigger = await screen.findByRole("button", { name: "Profile" });
      await user.click(trigger);

      expect(trigger).toHaveAttribute("aria-expanded", "true");
      const menu = screen.getByRole("menu");
      expect(menu).toHaveAttribute("aria-hidden", "false");
    });

    it("focuses first menuitem when dropdown opens via click", async () => {
      const user = userEvent.setup();
      renderWithProviders(<ProfileDropdown />, { locale: "en" });

      const trigger = await screen.findByRole("button", { name: "Profile" });
      await user.click(trigger);

      await waitFor(() => {
        const items = screen.getAllByRole("menuitem");
        expect(items[0]).toHaveFocus();
      });
    });

    it("closes on outside click", async () => {
      const user = userEvent.setup();
      renderWithProviders(<ProfileDropdown />, { locale: "en" });

      const trigger = await screen.findByRole("button", { name: "Profile" });
      await user.click(trigger);
      expect(trigger).toHaveAttribute("aria-expanded", "true");

      await user.click(document.body);

      expect(trigger).toHaveAttribute("aria-expanded", "false");
    });

    it("closes on Escape key and returns focus to trigger", async () => {
      const user = userEvent.setup();
      renderWithProviders(<ProfileDropdown />, { locale: "en" });

      const trigger = await screen.findByRole("button", { name: "Profile" });
      await user.click(trigger);
      expect(trigger).toHaveAttribute("aria-expanded", "true");

      await user.keyboard("{Escape}");

      expect(trigger).toHaveAttribute("aria-expanded", "false");
      expect(trigger).toHaveFocus();
    });
  });

  // --- Phase 2: US1 — Profile Navigation ---

  describe("US1: Navigate to Profile Page", () => {
    it("Profile item has role='menuitem' and links to /profile", async () => {
      const user = userEvent.setup();
      renderWithProviders(<ProfileDropdown />, { locale: "en" });

      const trigger = await screen.findByRole("button", { name: "Profile" });
      await user.click(trigger);

      const items = screen.getAllByRole("menuitem");
      const profileItem = items[0];
      expect(profileItem).toHaveAttribute("role", "menuitem");
      expect(profileItem).toHaveAttribute("href", "/profile");
    });

    it("closes dropdown when Profile item is clicked", async () => {
      const user = userEvent.setup();
      renderWithProviders(<ProfileDropdown />, { locale: "en" });

      const trigger = await screen.findByRole("button", { name: "Profile" });
      await user.click(trigger);

      const items = screen.getAllByRole("menuitem");
      await user.click(items[0]);

      expect(trigger).toHaveAttribute("aria-expanded", "false");
    });
  });

  // --- Phase 3: US2 — Logout from Application ---

  describe("US2: Logout from Application", () => {
    it("clicking Logout calls signOut", async () => {
      const user = userEvent.setup();
      renderWithProviders(<ProfileDropdown />, { locale: "en" });

      const trigger = await screen.findByRole("button", { name: "Profile" });
      await user.click(trigger);

      const items = screen.getAllByRole("menuitem");
      await user.click(items[1]); // Logout item

      expect(mockSignOut).toHaveBeenCalledOnce();
    });

    it("shows spinner during logout", async () => {
      mockSignOut.mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve({ error: null }), 100))
      );
      const user = userEvent.setup();
      renderWithProviders(<ProfileDropdown />, { locale: "en" });

      const trigger = await screen.findByRole("button", { name: "Profile" });
      await user.click(trigger);

      const items = screen.getAllByRole("menuitem");
      await user.click(items[1]);

      const spinner = document.querySelector(".animate-spin");
      expect(spinner).toBeInTheDocument();
    });

    it("both items disabled during logout", async () => {
      mockSignOut.mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve({ error: null }), 100))
      );
      const user = userEvent.setup();
      renderWithProviders(<ProfileDropdown />, { locale: "en" });

      const trigger = await screen.findByRole("button", { name: "Profile" });
      await user.click(trigger);

      const items = screen.getAllByRole("menuitem");
      await user.click(items[1]);

      items.forEach((item) => {
        expect(item.className).toContain("pointer-events-none");
        expect(item.className).toContain("opacity-50");
      });
    });

    it("redirects to /login on successful signOut", async () => {
      const user = userEvent.setup();
      renderWithProviders(<ProfileDropdown />, { locale: "en" });

      const trigger = await screen.findByRole("button", { name: "Profile" });
      await user.click(trigger);

      const items = screen.getAllByRole("menuitem");
      await user.click(items[1]);

      await waitFor(() => {
        expect(mockRouter.push).toHaveBeenCalledWith("/login");
      });
    });

    it("shows error toast on signOut failure", async () => {
      mockSignOut.mockResolvedValue({ error: new Error("Network error") });
      const user = userEvent.setup();
      renderWithProviders(<ProfileDropdown />, { locale: "en" });

      const trigger = await screen.findByRole("button", { name: "Profile" });
      await user.click(trigger);

      const items = screen.getAllByRole("menuitem");
      await user.click(items[1]);

      await waitFor(() => {
        expect(
          screen.getByText("Failed to logout. Please try again.")
        ).toBeInTheDocument();
      });
    });

    it("re-enables items after error", async () => {
      mockSignOut.mockResolvedValue({ error: new Error("Network error") });
      const user = userEvent.setup();
      renderWithProviders(<ProfileDropdown />, { locale: "en" });

      const trigger = await screen.findByRole("button", { name: "Profile" });
      await user.click(trigger);

      const items = screen.getAllByRole("menuitem");
      await user.click(items[1]);

      await waitFor(() => {
        const updatedItems = screen.getAllByRole("menuitem");
        expect(updatedItems[0].className).not.toContain("pointer-events-none");
        expect(updatedItems[1].className).not.toContain("pointer-events-none");
      });
    });

    it("double-click does not call signOut twice", async () => {
      mockSignOut.mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve({ error: null }), 100))
      );
      const user = userEvent.setup();
      renderWithProviders(<ProfileDropdown />, { locale: "en" });

      const trigger = await screen.findByRole("button", { name: "Profile" });
      await user.click(trigger);

      const items = screen.getAllByRole("menuitem");
      await user.click(items[1]);

      expect(mockSignOut).toHaveBeenCalledTimes(1);
    });
  });

  // --- Phase 4: Auth Visibility (FR-007) ---

  describe("FR-007: Auth Visibility", () => {
    it("renders nothing when user is not authenticated", async () => {
      mockGetUser.mockResolvedValue({
        data: { user: null },
        error: null,
      });
      const { container } = renderWithProviders(<ProfileDropdown />, {
        locale: "en",
      });

      // Wait for auth check to complete
      await waitFor(() => {
        expect(mockGetUser).toHaveBeenCalled();
      });

      expect(container.innerHTML).toBe("");
    });

    it("renders trigger when user is authenticated", async () => {
      renderWithProviders(<ProfileDropdown />, { locale: "en" });

      const trigger = await screen.findByRole("button", { name: "Profile" });
      expect(trigger).toBeInTheDocument();
    });
  });

  // --- Phase 5: Accessibility ---

  describe("Accessibility", () => {
    it("has correct ARIA structure: role=menu and role=menuitem", async () => {
      const user = userEvent.setup();
      renderWithProviders(<ProfileDropdown />, { locale: "en" });

      const trigger = await screen.findByRole("button", { name: "Profile" });
      await user.click(trigger);

      const menu = screen.getByRole("menu");
      expect(menu).toHaveAttribute("aria-label", "Profile");

      const items = screen.getAllByRole("menuitem");
      expect(items).toHaveLength(2);
    });

    it("ArrowDown moves focus from first to second item", async () => {
      const user = userEvent.setup();
      renderWithProviders(<ProfileDropdown />, { locale: "en" });

      const trigger = await screen.findByRole("button", { name: "Profile" });
      await user.click(trigger);

      await waitFor(() => {
        const items = screen.getAllByRole("menuitem");
        expect(items[0]).toHaveFocus();
      });

      await user.keyboard("{ArrowDown}");

      const items = screen.getAllByRole("menuitem");
      expect(items[1]).toHaveFocus();
    });

    it("ArrowUp moves focus from second to first item", async () => {
      const user = userEvent.setup();
      renderWithProviders(<ProfileDropdown />, { locale: "en" });

      const trigger = await screen.findByRole("button", { name: "Profile" });
      await user.click(trigger);

      await waitFor(() => {
        const items = screen.getAllByRole("menuitem");
        expect(items[0]).toHaveFocus();
      });

      await user.keyboard("{ArrowDown}");
      await user.keyboard("{ArrowUp}");

      const items = screen.getAllByRole("menuitem");
      expect(items[0]).toHaveFocus();
    });

    it("Tab wraps within dropdown (focus trap: last → first)", async () => {
      const user = userEvent.setup();
      renderWithProviders(<ProfileDropdown />, { locale: "en" });

      const trigger = await screen.findByRole("button", { name: "Profile" });
      await user.click(trigger);

      await waitFor(() => {
        const items = screen.getAllByRole("menuitem");
        expect(items[0]).toHaveFocus();
      });

      // Move to last item
      await user.keyboard("{ArrowDown}");
      const items = screen.getAllByRole("menuitem");
      expect(items[1]).toHaveFocus();

      // Tab from last item should wrap to first
      await user.tab();
      expect(items[0]).toHaveFocus();
    });

    it("Shift+Tab wraps within dropdown (focus trap: first → last)", async () => {
      const user = userEvent.setup();
      renderWithProviders(<ProfileDropdown />, { locale: "en" });

      const trigger = await screen.findByRole("button", { name: "Profile" });
      await user.click(trigger);

      await waitFor(() => {
        const items = screen.getAllByRole("menuitem");
        expect(items[0]).toHaveFocus();
      });

      // Shift+Tab from first item should wrap to last
      await user.tab({ shift: true });
      const items = screen.getAllByRole("menuitem");
      expect(items[1]).toHaveFocus();
    });
  });
});
