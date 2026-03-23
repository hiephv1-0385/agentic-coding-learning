import { within, cleanup } from "@testing-library/react";
import { describe, it, expect, afterEach } from "vitest";
import AwardsSunKudosSection from "@/components/awards/AwardsSunKudosSection";
import { renderWithProviders as render } from "@/__tests__/test-utils";

afterEach(cleanup);

function renderSection() {
  const result = render(<AwardsSunKudosSection />);
  return within(result.container);
}

describe("AwardsSunKudosSection", () => {
  it("renders 'Phong trào ghi nhận' label", () => {
    const view = renderSection();
    expect(view.getByText("Phong trào ghi nhận")).toBeInTheDocument();
  });

  it("renders 'Sun* Kudos' h2 title", () => {
    const view = renderSection();
    expect(
      view.getByRole("heading", { level: 2, name: "Sun* Kudos" })
    ).toBeInTheDocument();
  });

  it("renders description block with 'ĐIỂM MỚI CỦA SAA 2025' first line", () => {
    const view = renderSection();
    expect(view.getByText("ĐIỂM MỚI CỦA SAA 2025")).toBeInTheDocument();
  });

  it("renders 'Chi tiết' button with href='/kudos'", () => {
    const view = renderSection();
    const link = view.getByRole("link", { name: /Chi tiết/i });
    expect(link).toHaveAttribute("href", "/kudos");
  });

  it("renders decorative KUDOS text on desktop", () => {
    const view = renderSection();
    const kudosText = view.getByText("KUDOS");
    expect(kudosText).toHaveAttribute("aria-hidden", "true");
  });
});
