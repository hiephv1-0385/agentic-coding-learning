import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import CollectionBadge from "@/components/rules/CollectionBadge";
import CollectionBadgeGrid from "@/components/rules/CollectionBadgeGrid";

vi.mock("next/image", () => ({
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img {...props} />
  ),
}));

vi.mock("@/hooks/useLocale", () => ({
  useLocale: () => ({
    locale: "vi",
    setLocale: vi.fn(),
    t: {
      rules: {
        badgeRevival: "REVIVAL",
        badgeTouchOfLight: "TOUCH OF LIGHT",
        badgeStayGold: "STAY GOLD",
        badgeFlowToHorizon: "FLOW TO HORIZON",
        badgeBeyondTheBoundary: "BEYOND THE BOUNDARY",
        badgeRootFurther: "ROOT FURTHER",
      },
    },
  }),
}));

describe("CollectionBadge", () => {
  it("renders circular image with white border", () => {
    const { container } = render(
      <CollectionBadge
        name="REVIVAL"
        imageSrc="/images/rules/icon-revival.png"
      />
    );

    const img = container.querySelector("img")!;
    expect(img).toHaveAttribute("src", "/images/rules/icon-revival.png");
    expect(img).toHaveAttribute("alt", "REVIVAL collection badge");

    const imageContainer = img.closest("div");
    expect(imageContainer).toHaveClass("rounded-full", "border-2", "border-white");
  });

  it("displays badge name label", () => {
    const { container } = render(
      <CollectionBadge
        name="TOUCH OF LIGHT"
        imageSrc="/images/rules/icon-touch-of-light.png"
      />
    );

    expect(container.textContent).toContain("TOUCH OF LIGHT");
  });

  it("uses text-xs for short names like REVIVAL", () => {
    const { container } = render(
      <CollectionBadge
        name="REVIVAL"
        imageSrc="/images/rules/icon-revival.png"
      />
    );

    const label = container.querySelector("span")!;
    expect(label).toHaveClass("text-xs");
  });

  it("uses text-[11px] for longer names", () => {
    const { container } = render(
      <CollectionBadge
        name="TOUCH OF LIGHT"
        imageSrc="/images/rules/icon-touch-of-light.png"
      />
    );

    const label = container.querySelector("span")!;
    expect(label).toHaveClass("text-[11px]");
  });
});

describe("CollectionBadgeGrid", () => {
  it("renders all 6 badges", () => {
    const { container } = render(<CollectionBadgeGrid />);

    const images = container.querySelectorAll("img");
    expect(images).toHaveLength(6);

    expect(container.textContent).toContain("REVIVAL");
    expect(container.textContent).toContain("TOUCH OF LIGHT");
    expect(container.textContent).toContain("STAY GOLD");
    expect(container.textContent).toContain("FLOW TO HORIZON");
    expect(container.textContent).toContain("BEYOND THE BOUNDARY");
    expect(container.textContent).toContain("ROOT FURTHER");
  });

  it("renders badges with correct image sources", () => {
    const { container } = render(<CollectionBadgeGrid />);

    const images = container.querySelectorAll("img");
    const srcs = Array.from(images).map((img) => img.getAttribute("src"));

    expect(srcs).toContain("/images/rules/icon-revival.png");
    expect(srcs).toContain("/images/rules/icon-root-further.png");
  });
});
