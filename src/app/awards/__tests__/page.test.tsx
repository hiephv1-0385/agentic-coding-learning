import { within, cleanup } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderWithProviders as render } from "@/__tests__/test-utils";
import vi_translations from "@/locales/vi";

vi.mock("@/utils/getServerLocale", () => ({
  getServerTranslations: vi.fn().mockResolvedValue(vi_translations),
}));

afterEach(cleanup);

const mockAwards = [
  {
    id: "1",
    name: "Top Talent",
    slug: "top-talent",
    short_description: "Short",
    description: "Top Talent description.",
    thumbnail_url: "/images/awards/top-talent.png",
    order: 1,
    quantity: 10,
    unit_type: "Cá nhân",
    prize_value: 7000000,
    prize_sub_label: "cho mỗi giải thưởng",
    prize_value_team: null,
    prize_sub_label_team: null,
  },
  {
    id: "2",
    name: "Top Project",
    slug: "top-project",
    short_description: "Short",
    description: "Top Project description.",
    thumbnail_url: "/images/awards/top-project.png",
    order: 2,
    quantity: 2,
    unit_type: "Tập thể",
    prize_value: 15000000,
    prize_sub_label: "cho mỗi giải thưởng",
    prize_value_team: null,
    prize_sub_label_team: null,
  },
  {
    id: "3",
    name: "Top Project Leader",
    slug: "top-project-leader",
    short_description: "Short",
    description: "Top Project Leader description.",
    thumbnail_url: "/images/awards/top-project-leader.png",
    order: 3,
    quantity: 3,
    unit_type: "Cá nhân",
    prize_value: 7000000,
    prize_sub_label: "cho mỗi giải thưởng",
    prize_value_team: null,
    prize_sub_label_team: null,
  },
  {
    id: "4",
    name: "Best Manager",
    slug: "best-manager",
    short_description: "Short",
    description: "Best Manager description.",
    thumbnail_url: "/images/awards/best-manager.png",
    order: 4,
    quantity: 1,
    unit_type: "Cá nhân",
    prize_value: 10000000,
    prize_sub_label: "cho mỗi giải thưởng",
    prize_value_team: null,
    prize_sub_label_team: null,
  },
  {
    id: "5",
    name: "Signature 2025 - Creator",
    slug: "signature-2025-creator",
    short_description: "Short",
    description: "Signature description.",
    thumbnail_url: "/images/awards/signature-2025-creator.png",
    order: 5,
    quantity: 1,
    unit_type: "Cá nhân hoặc tập thể",
    prize_value: 5000000,
    prize_sub_label: "cho giải cá nhân",
    prize_value_team: 8000000,
    prize_sub_label_team: "cho giải tập thể",
  },
  {
    id: "6",
    name: "MVP (Most Valuable Person)",
    slug: "mvp",
    short_description: "Short",
    description: "MVP description.",
    thumbnail_url: "/images/awards/mvp.png",
    order: 6,
    quantity: 1,
    unit_type: "Cá nhân",
    prize_value: 15000000,
    prize_sub_label: "",
    prize_value_team: null,
    prize_sub_label_team: null,
  },
];

const mockSelect = vi.fn();
const mockOrder = vi.fn();
const mockFrom = vi.fn();

vi.mock("@/libs/supabase/server", () => ({
  createClient: vi.fn().mockResolvedValue({
    from: (...args: unknown[]) => mockFrom(...args),
  }),
}));

vi.mock("@/components/shared/Header", () => ({
  default: ({ activeLink }: { activeLink: string }) => (
    <header data-testid="header" data-active-link={activeLink} />
  ),
}));

vi.mock("@/components/shared/Footer", () => ({
  default: () => <footer data-testid="footer" />,
}));

async function renderPage() {
  const { default: AwardsPage } = await import("@/app/awards/page");
  const page = await AwardsPage();
  const result = render(page);
  return within(result.container);
}

describe("AwardsPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockOrder.mockReturnValue({ data: mockAwards, error: null });
    mockSelect.mockReturnValue({ order: mockOrder });
    mockFrom.mockReturnValue({ select: mockSelect });
  });

  it("renders 6 award cards with correct data", async () => {
    const view = await renderPage();

    expect(view.getByText("Top Talent description.")).toBeInTheDocument();
    expect(view.getByText("Top Project description.")).toBeInTheDocument();
    expect(view.getByText("Top Project Leader description.")).toBeInTheDocument();
    expect(view.getByText("Best Manager description.")).toBeInTheDocument();
    expect(view.getByText("Signature description.")).toBeInTheDocument();
    expect(view.getByText("MVP description.")).toBeInTheDocument();
  });

  it("renders hero section", async () => {
    const view = await renderPage();
    const heroImg = view.getByAltText("ROOT FURTHER");
    expect(heroImg).toBeInTheDocument();
  });

  it("renders section title with h1", async () => {
    const view = await renderPage();

    expect(
      view.getByRole("heading", {
        level: 1,
        name: "Hệ thống giải thưởng SAA 2025",
      })
    ).toBeInTheDocument();
    expect(view.getByText("Sun* Annual Awards 2025")).toBeInTheDocument();
  });

  it("renders header with activeLink='awards'", async () => {
    const view = await renderPage();
    const header = view.getByTestId("header");
    expect(header).toHaveAttribute("data-active-link", "awards");
  });

  it("shows empty state when no awards data", async () => {
    mockOrder.mockReturnValue({ data: [], error: null });
    const view = await renderPage();
    expect(
      view.getByText("Chưa có thông tin giải thưởng.")
    ).toBeInTheDocument();
  });
});
