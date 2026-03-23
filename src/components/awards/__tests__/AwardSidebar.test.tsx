import { within, cleanup, fireEvent, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import AwardSidebar from "@/components/awards/AwardSidebar";
import { renderWithProviders } from "@/__tests__/test-utils";

afterEach(cleanup);

const mockCategories = [
  { id: "1", name: "Top Talent", slug: "top-talent" },
  { id: "2", name: "Top Project", slug: "top-project" },
  { id: "3", name: "Top Project Leader", slug: "top-project-leader" },
  { id: "4", name: "Best Manager", slug: "best-manager" },
  { id: "5", name: "Signature 2025 - Creator", slug: "signature-2025-creator" },
  { id: "6", name: "MVP (Most Valuable Person)", slug: "mvp" },
];

let observerCallback: IntersectionObserverCallback;
const mockObserve = vi.fn();
const mockDisconnect = vi.fn();

function renderSidebar(categories = mockCategories) {
  const result = renderWithProviders(<AwardSidebar categories={categories} />);
  return within(result.container);
}

describe("AwardSidebar", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Mock IntersectionObserver for jsdom
    vi.stubGlobal(
      "IntersectionObserver",
      class MockIntersectionObserver {
        constructor(callback: IntersectionObserverCallback) {
          observerCallback = callback;
        }
        observe = mockObserve;
        disconnect = mockDisconnect;
        unobserve = vi.fn();
      }
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("renders nav with aria-label", () => {
    const view = renderSidebar();
    const nav = view.getByRole("navigation");
    expect(nav).toHaveAttribute("aria-label", "Danh mục giải thưởng");
  });

  it("renders 6 items matching award names", () => {
    const view = renderSidebar();
    mockCategories.forEach((cat) => {
      expect(view.getByText(cat.name)).toBeInTheDocument();
    });
  });

  it("renders anchor links with correct href", () => {
    const view = renderSidebar();
    const links = view.getAllByRole("link");
    expect(links).toHaveLength(6);
    expect(links[0]).toHaveAttribute("href", "#award-top-talent");
    expect(links[5]).toHaveAttribute("href", "#award-mvp");
  });

  it("click calls scrollIntoView with smooth behavior", () => {
    const mockScrollIntoView = vi.fn();
    const mockElement = document.createElement("div");
    mockElement.scrollIntoView = mockScrollIntoView;
    vi.spyOn(document, "getElementById").mockReturnValue(mockElement);

    const view = renderSidebar();
    const link = view.getByText("Top Talent");
    fireEvent.click(link);

    expect(mockScrollIntoView).toHaveBeenCalledWith({ behavior: "smooth" });
    vi.restoreAllMocks();
  });

  it("first item is active by default", () => {
    const view = renderSidebar();
    const firstLink = view.getByText("Top Talent").closest("a");
    expect(firstLink).toHaveAttribute("aria-current", "true");
  });

  it("active tab applies gold styling", () => {
    const view = renderSidebar();
    const firstLink = view.getByText("Top Talent").closest("a");
    expect(firstLink?.className).toContain("text-gold-primary");
    expect(firstLink?.className).toContain("border-b");
  });

  it("inactive tabs do not have aria-current", () => {
    const view = renderSidebar();
    const secondLink = view.getByText("Top Project").closest("a");
    expect(secondLink).not.toHaveAttribute("aria-current", "true");
  });

  it("click updates active state", () => {
    const mockElement = document.createElement("div");
    mockElement.scrollIntoView = vi.fn();
    vi.spyOn(document, "getElementById").mockReturnValue(mockElement);

    const view = renderSidebar();
    fireEvent.click(view.getByText("Best Manager"));

    const bestManagerLink = view.getByText("Best Manager").closest("a");
    expect(bestManagerLink).toHaveAttribute("aria-current", "true");

    const topTalentLink = view.getByText("Top Talent").closest("a");
    expect(topTalentLink).not.toHaveAttribute("aria-current", "true");

    vi.restoreAllMocks();
  });

  it("Space key triggers click", () => {
    const mockScrollIntoView = vi.fn();
    const mockElement = document.createElement("div");
    mockElement.scrollIntoView = mockScrollIntoView;
    vi.spyOn(document, "getElementById").mockReturnValue(mockElement);

    const view = renderSidebar();
    const link = view.getByText("Top Project");
    fireEvent.keyDown(link, { key: " " });

    expect(mockScrollIntoView).toHaveBeenCalledWith({ behavior: "smooth" });
    vi.restoreAllMocks();
  });

  it("scroll spy updates active tab on intersection", () => {
    // Create target elements in DOM so the observer gets set up
    mockCategories.forEach((cat) => {
      const el = document.createElement("div");
      el.id = `award-${cat.slug}`;
      document.body.appendChild(el);
    });

    const view = renderSidebar();

    expect(mockObserve).toHaveBeenCalledTimes(6);

    // Simulate "Best Manager" section intersecting — wrap in act to flush state
    act(() => {
      observerCallback(
        [
          {
            isIntersecting: true,
            target: { id: "award-best-manager" },
          } as unknown as IntersectionObserverEntry,
        ],
        {} as IntersectionObserver
      );
    });

    const bestManagerLink = view.getByText("Best Manager").closest("a");
    expect(bestManagerLink).toHaveAttribute("aria-current", "true");

    // Clean up DOM elements
    mockCategories.forEach((cat) => {
      document.getElementById(`award-${cat.slug}`)?.remove();
    });
  });
});
