import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import HeroBadge from "@/components/rules/HeroBadge";

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
        newHeroThreshold: "Có 1-4 người gửi Kudos cho bạn",
        newHeroDescription: "Hành trình lan tỏa điều tốt đẹp bắt đầu",
        risingHeroThreshold: "Có 5-9 người gửi Kudos cho bạn",
        risingHeroDescription: "Hình ảnh bạn đang lớn dần",
        superHeroThreshold: "Có 10–20 người gửi Kudos cho bạn",
        superHeroDescription: "Bạn đã trở thành biểu tượng",
        legendHeroThreshold: "Có hơn 20 người gửi Kudos cho bạn",
        legendHeroDescription: "Bạn đã trở thành huyền thoại",
      },
    },
  }),
}));

describe("HeroBadge", () => {
  it("renders New Hero tier with correct image and text", () => {
    render(<HeroBadge tier="new" />);

    const img = screen.getByAltText("New Hero");
    expect(img).toHaveAttribute("src", "/images/rules/badge-new-hero.png");
    expect(
      screen.getByText("Có 1-4 người gửi Kudos cho bạn")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Hành trình lan tỏa điều tốt đẹp bắt đầu")
    ).toBeInTheDocument();
  });

  it("renders Rising Hero tier with correct image", () => {
    render(<HeroBadge tier="rising" />);

    const img = screen.getByAltText("Rising Hero");
    expect(img).toHaveAttribute("src", "/images/rules/badge-rising-hero.png");
    expect(
      screen.getByText("Có 5-9 người gửi Kudos cho bạn")
    ).toBeInTheDocument();
  });

  it("renders Super Hero tier with correct image", () => {
    render(<HeroBadge tier="super" />);

    const img = screen.getByAltText("Super Hero");
    expect(img).toHaveAttribute("src", "/images/rules/badge-super-hero.png");
    expect(
      screen.getByText("Có 10–20 người gửi Kudos cho bạn")
    ).toBeInTheDocument();
  });

  it("renders Legend Hero tier with correct image", () => {
    render(<HeroBadge tier="legend" />);

    const img = screen.getByAltText("Legend Hero");
    expect(img).toHaveAttribute("src", "/images/rules/badge-legend-hero.png");
    expect(
      screen.getByText("Có hơn 20 người gửi Kudos cho bạn")
    ).toBeInTheDocument();
  });

  it("renders badge image with border styling", () => {
    const { container } = render(<HeroBadge tier="new" />);

    const img = container.querySelector("img")!;
    expect(img).toHaveClass("rounded-full", "border", "border-[#FFEA9E]");
  });
});
