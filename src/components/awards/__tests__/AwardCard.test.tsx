import { screen, within, cleanup } from "@testing-library/react";
import { describe, it, expect, afterEach } from "vitest";
import AwardCard from "@/components/awards/AwardCard";
import type { AwardCategory } from "@/types/award";
import { renderWithProviders as render } from "@/__tests__/test-utils";

afterEach(cleanup);

const baseAward: AwardCategory = {
  id: "1",
  name: "Top Talent",
  slug: "top-talent",
  shortDescription: "Short desc",
  description: "Full description of Top Talent award.",
  thumbnailUrl: "/images/awards/top-talent.png",
  order: 1,
  quantity: 10,
  unitType: "Cá nhân",
  prizeValue: 7000000,
  prizeSubLabel: "cho mỗi giải thưởng",
  prizeValueTeam: null,
  prizeSubLabelTeam: null,
};

const signatureAward: AwardCategory = {
  id: "5",
  name: "Signature 2025 - Creator",
  slug: "signature-2025-creator",
  shortDescription: "Short desc",
  description: "Signature award description.",
  thumbnailUrl: "/images/awards/signature-2025-creator.png",
  order: 5,
  quantity: 1,
  unitType: "Cá nhân hoặc tập thể",
  prizeValue: 5000000,
  prizeSubLabel: "cho giải cá nhân",
  prizeValueTeam: 8000000,
  prizeSubLabelTeam: "cho giải tập thể",
};

const mvpAward: AwardCategory = {
  id: "6",
  name: "MVP (Most Valuable Person)",
  slug: "mvp",
  shortDescription: "Short desc",
  description: "MVP award description.",
  thumbnailUrl: "/images/awards/mvp.png",
  order: 6,
  quantity: 1,
  unitType: "Cá nhân",
  prizeValue: 15000000,
  prizeSubLabel: "",
  prizeValueTeam: null,
  prizeSubLabelTeam: null,
};

describe("AwardCard", () => {
  it("renders award image with alt text", () => {
    render(<AwardCard award={baseAward} index={0} id="award-top-talent" />);
    expect(screen.getByAltText("Top Talent award badge")).toBeInTheDocument();
  });

  it("renders award title as h2", () => {
    const { container } = render(
      <AwardCard award={baseAward} index={0} id="award-top-talent" />
    );
    const card = within(container);
    const heading = card.getByRole("heading", { level: 2 });
    expect(heading).toHaveTextContent("Top Talent");
  });

  it("renders description text", () => {
    render(<AwardCard award={baseAward} index={0} id="award-top-talent" />);
    expect(screen.getByText("Full description of Top Talent award.")).toBeInTheDocument();
  });

  it("renders quantity stat with padStart formatting", () => {
    render(<AwardCard award={baseAward} index={0} id="award-top-talent" />);
    expect(screen.getByText("10")).toBeInTheDocument();
    expect(screen.getByText("Cá nhân")).toBeInTheDocument();
    expect(screen.getByText("Số lượng giải thưởng:")).toBeInTheDocument();
  });

  it("renders prize value in VNĐ format", () => {
    render(<AwardCard award={baseAward} index={0} id="award-top-talent" />);
    expect(screen.getByText("7.000.000 VNĐ")).toBeInTheDocument();
    expect(screen.getByText("cho mỗi giải thưởng")).toBeInTheDocument();
  });

  it("renders quantity with leading zero for single digit", () => {
    render(<AwardCard award={signatureAward} index={4} id="award-signature" />);
    expect(screen.getByText("01")).toBeInTheDocument();
  });

  it("renders Signature 2025 with HoacDivider and second prize tier", () => {
    render(<AwardCard award={signatureAward} index={4} id="award-signature" />);
    expect(screen.getByText("Hoặc")).toBeInTheDocument();
    expect(screen.getByText("5.000.000 VNĐ")).toBeInTheDocument();
    expect(screen.getByText("8.000.000 VNĐ")).toBeInTheDocument();
    expect(screen.getByText("cho giải cá nhân")).toBeInTheDocument();
    expect(screen.getByText("cho giải tập thể")).toBeInTheDocument();
  });

  it("renders MVP without sub-label", () => {
    render(<AwardCard award={mvpAward} index={5} id="award-mvp" />);
    expect(screen.getByText("15.000.000 VNĐ")).toBeInTheDocument();
    expect(screen.queryByText("cho mỗi giải thưởng")).not.toBeInTheDocument();
  });

  it("uses flex-row for even index (image-left)", () => {
    const { container } = render(
      <AwardCard award={baseAward} index={0} id="award-top-talent" />
    );
    const card = container.firstElementChild;
    expect(card?.className).toMatch(/sm:flex-row(?!-reverse)/);
  });

  it("uses flex-row-reverse for odd index (image-right)", () => {
    const { container } = render(
      <AwardCard award={baseAward} index={1} id="award-top-talent" />
    );
    const card = container.firstElementChild;
    expect(card?.className).toContain("sm:flex-row-reverse");
  });

  it("has correct id for anchor navigation", () => {
    const { container } = render(
      <AwardCard award={baseAward} index={0} id="award-top-talent" />
    );
    expect(container.firstElementChild?.id).toBe("award-top-talent");
  });
});
