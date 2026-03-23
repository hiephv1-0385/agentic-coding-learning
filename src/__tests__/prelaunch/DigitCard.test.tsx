import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { DigitCard } from "@/components/prelaunch/DigitCard";

describe("DigitCard", () => {
  it("renders the digit text", () => {
    render(<DigitCard digit="5" />);
    expect(screen.getByText("5")).toBeInTheDocument();
  });

  it("applies opacity-50 on CardBg div, not on the parent container", () => {
    const { container } = render(<DigitCard digit="3" />);

    const parent = container.firstElementChild as HTMLElement;
    expect(parent.className).not.toContain("opacity-50");

    const cardBg = parent.querySelector("div");
    expect(cardBg?.className).toContain("opacity-50");
  });

  it("has fixed dimensions to prevent layout shift", () => {
    const { container } = render(<DigitCard digit="0" />);
    const parent = container.firstElementChild as HTMLElement;

    // Check responsive dimension classes exist
    expect(parent.className).toContain("w-[52px]");
    expect(parent.className).toContain("h-[83px]");
    expect(parent.className).toContain("sm:w-[64px]");
    expect(parent.className).toContain("sm:h-[102px]");
    expect(parent.className).toContain("lg:w-[77px]");
    expect(parent.className).toContain("lg:h-[123px]");
  });
});
