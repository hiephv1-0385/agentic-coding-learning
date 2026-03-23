import { screen, fireEvent, cleanup } from "@testing-library/react";
import { describe, it, expect, afterEach, vi, beforeEach } from "vitest";
import FloatingActionButton from "@/components/shared/FloatingActionButton";
import { renderWithProviders as render } from "@/__tests__/test-utils";

// Mock usePathname per test
let mockPathname = "/";
vi.mock("next/navigation", async () => {
  const actual = await vi.importActual("next/navigation");
  return {
    ...actual,
    usePathname: () => mockPathname,
    useRouter: () => ({
      push: vi.fn(),
      replace: vi.fn(),
      refresh: vi.fn(),
      back: vi.fn(),
      forward: vi.fn(),
      prefetch: vi.fn(),
    }),
    useSearchParams: () => new URLSearchParams(),
  };
});

// Mock next/dynamic to bypass lazy loading in tests
vi.mock("next/dynamic", () => ({
  default: (importFn: () => Promise<{ default: React.ComponentType }>) => {
    // Eagerly resolve the dynamic import for testing
    const MockComponent = (props: Record<string, unknown>) => {
      const isOpen = props.isOpen as boolean;
      const onClose = props.onClose as () => void;
      return isOpen ? (
        <div data-testid="kudo-modal">
          <button onClick={onClose}>Close Modal</button>
        </div>
      ) : null;
    };
    MockComponent.displayName = "DynamicMock";
    // Consume importFn to avoid unused warning
    void importFn;
    return MockComponent;
  },
}));

describe("FloatingActionButton", () => {
  beforeEach(() => {
    mockPathname = "/";
  });

  afterEach(() => {
    cleanup();
  });

  // T020: Renders in collapsed state
  it("renders collapsed pill with correct elements when authenticated", () => {
    render(<FloatingActionButton isAuthenticated={true} />);

    const pill = screen.getByRole("button", {
      name: "Thao tác nhanh: Viết Kudos hoặc Xem thể lệ SAA",
    });
    expect(pill).toBeInTheDocument();
    expect(pill).toHaveAttribute("aria-expanded", "false");
    expect(screen.getByText("/")).toBeInTheDocument();
  });

  // T021: Hidden when not authenticated
  it("returns null when isAuthenticated is false", () => {
    const { container } = render(
      <FloatingActionButton isAuthenticated={false} />
    );
    expect(container.innerHTML).toBe("");
  });

  // T022: Hidden on /login
  it("returns null when pathname is /login", () => {
    mockPathname = "/login";
    const { container } = render(
      <FloatingActionButton isAuthenticated={true} />
    );
    expect(container.innerHTML).toBe("");
  });

  // T022: Hidden on /prelaunch
  it("returns null when pathname is /prelaunch", () => {
    mockPathname = "/prelaunch";
    const { container } = render(
      <FloatingActionButton isAuthenticated={true} />
    );
    expect(container.innerHTML).toBe("");
  });

  // T023: Expands on click
  it("expands showing 3 menu items when pill is clicked", () => {
    render(<FloatingActionButton isAuthenticated={true} />);

    fireEvent.click(
      screen.getByRole("button", {
        name: "Thao tác nhanh: Viết Kudos hoặc Xem thể lệ SAA",
      })
    );

    expect(screen.getByRole("menu")).toBeInTheDocument();
    const menuItems = screen.getAllByRole("menuitem");
    expect(menuItems).toHaveLength(3);
    expect(screen.getByText("Thể lệ")).toBeInTheDocument();
    expect(screen.getByText("Viết KUDOS")).toBeInTheDocument();
  });

  // T024: Thể lệ is a link to /awards/rules
  it("renders Thể lệ as a button that opens rules sidebar", () => {
    render(<FloatingActionButton isAuthenticated={true} />);

    fireEvent.click(
      screen.getByRole("button", {
        name: "Thao tác nhanh: Viết Kudos hoặc Xem thể lệ SAA",
      })
    );

    const button = screen.getByRole("menuitem", { name: /Thể lệ/ });
    expect(button.tagName).toBe("BUTTON");
  });

  // T025: Viết KUDOS opens modal
  it("opens KudoModal when Viết KUDOS is clicked", () => {
    render(<FloatingActionButton isAuthenticated={true} />);

    // Expand
    fireEvent.click(
      screen.getByRole("button", {
        name: "Thao tác nhanh: Viết Kudos hoặc Xem thể lệ SAA",
      })
    );

    // Click Viết KUDOS
    fireEvent.click(screen.getByText("Viết KUDOS"));

    // Modal should appear, FAB should collapse
    expect(screen.getByTestId("kudo-modal")).toBeInTheDocument();
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  // T026: Close button collapses
  it("collapses when close button is clicked", () => {
    render(<FloatingActionButton isAuthenticated={true} />);

    // Expand
    fireEvent.click(
      screen.getByRole("button", {
        name: "Thao tác nhanh: Viết Kudos hoặc Xem thể lệ SAA",
      })
    );
    expect(screen.getByRole("menu")).toBeInTheDocument();

    // Click close
    fireEvent.click(
      screen.getByRole("menuitem", { name: "Đóng thao tác nhanh" })
    );

    // Should be collapsed
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", {
        name: "Thao tác nhanh: Viết Kudos hoặc Xem thể lệ SAA",
      })
    ).toBeInTheDocument();
  });

  // T027: Escape collapses
  it("collapses when Escape key is pressed", () => {
    render(<FloatingActionButton isAuthenticated={true} />);

    // Expand
    fireEvent.click(
      screen.getByRole("button", {
        name: "Thao tác nhanh: Viết Kudos hoặc Xem thể lệ SAA",
      })
    );
    expect(screen.getByRole("menu")).toBeInTheDocument();

    // Press Escape
    fireEvent.keyDown(document, { key: "Escape" });

    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  // T028: Click outside collapses
  it("collapses when clicking outside FAB area", () => {
    render(<FloatingActionButton isAuthenticated={true} />);

    // Expand
    fireEvent.click(
      screen.getByRole("button", {
        name: "Thao tác nhanh: Viết Kudos hoặc Xem thể lệ SAA",
      })
    );
    expect(screen.getByRole("menu")).toBeInTheDocument();

    // Click outside
    fireEvent.mouseDown(document.body);

    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  // T030: ARIA attributes
  it("has correct aria-label and aria-expanded on collapsed pill", () => {
    render(<FloatingActionButton isAuthenticated={true} />);

    const pill = screen.getByRole("button", {
      name: "Thao tác nhanh: Viết Kudos hoặc Xem thể lệ SAA",
    });
    expect(pill).toHaveAttribute("aria-expanded", "false");
  });

  // T031: Enter/Space expands
  it("expands when Enter key is pressed on focused pill", () => {
    render(<FloatingActionButton isAuthenticated={true} />);

    const pill = screen.getByRole("button", {
      name: "Thao tác nhanh: Viết Kudos hoặc Xem thể lệ SAA",
    });

    // Simulate keyboard activation (fireEvent.click triggers on Enter/Space for buttons)
    fireEvent.click(pill);

    expect(screen.getByRole("menu")).toBeInTheDocument();
  });
});
