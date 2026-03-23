import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, fireEvent, within, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import RulesPanel from "@/components/rules/RulesPanel";

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
        title: "Thể lệ",
        closeButton: "Đóng",
        writeKudosButton: "Viết KUDOS",
        ariaLabel: "Thể lệ chương trình Kudos",
        receiverHeading: "NGƯỜI NHẬN KUDOS",
        receiverDescription: "Dựa trên số lượng đồng đội",
        newHeroThreshold: "Có 1-4 người gửi Kudos cho bạn",
        newHeroDescription: "Hành trình lan tỏa",
        risingHeroThreshold: "Có 5-9 người gửi Kudos cho bạn",
        risingHeroDescription: "Hình ảnh bạn đang lớn dần",
        superHeroThreshold: "Có 10–20 người gửi Kudos cho bạn",
        superHeroDescription: "Bạn đã trở thành biểu tượng",
        legendHeroThreshold: "Có hơn 20 người gửi Kudos cho bạn",
        legendHeroDescription: "Bạn đã trở thành huyền thoại",
        senderHeading: "NGƯỜI GỬI KUDOS",
        senderDescription: "Mỗi lời Kudos bạn gửi",
        badgeRevival: "REVIVAL",
        badgeTouchOfLight: "TOUCH OF LIGHT",
        badgeStayGold: "STAY GOLD",
        badgeFlowToHorizon: "FLOW TO HORIZON",
        badgeBeyondTheBoundary: "BEYOND THE BOUNDARY",
        badgeRootFurther: "ROOT FURTHER",
        completionText: "Những Sunner thu thập trọn bộ 6 icon",
        nationalHeading: "KUDOS QUỐC DÂN",
        nationalDescription: "5 Kudos nhận về nhiều ❤️ nhất",
      },
    },
  }),
}));

const defaultProps = {
  isOpen: true,
  onClose: vi.fn(),
  onWriteKudos: vi.fn(),
};

describe("RulesPanel", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  afterEach(() => {
    vi.useRealTimers();
    cleanup();
  });

  it("renders nothing when isOpen is false", () => {
    const { container } = render(
      <RulesPanel {...defaultProps} isOpen={false} />
    );
    expect(container.querySelector('[role="dialog"]')).toBeNull();
  });

  it("renders with title and all three section headings when open", () => {
    const { container } = render(<RulesPanel {...defaultProps} />);

    expect(container.querySelector("h2")).toHaveTextContent("Thể lệ");

    const h3s = container.querySelectorAll("h3");
    expect(h3s).toHaveLength(3);
    expect(h3s[0]).toHaveTextContent("NGƯỜI NHẬN KUDOS");
    expect(h3s[1]).toHaveTextContent("NGƯỜI GỬI KUDOS");
    expect(h3s[2]).toHaveTextContent("KUDOS QUỐC DÂN");
  });

  it("displays all 4 hero badge tiers", () => {
    const { container } = render(<RulesPanel {...defaultProps} />);

    expect(container.textContent).toContain("Có 1-4 người gửi Kudos cho bạn");
    expect(container.textContent).toContain("Có 5-9 người gửi Kudos cho bạn");
    expect(container.textContent).toContain(
      "Có 10–20 người gửi Kudos cho bạn"
    );
    expect(container.textContent).toContain(
      "Có hơn 20 người gửi Kudos cho bạn"
    );
  });

  it("displays all 6 collection badges", () => {
    const { container } = render(<RulesPanel {...defaultProps} />);

    expect(container.textContent).toContain("REVIVAL");
    expect(container.textContent).toContain("TOUCH OF LIGHT");
    expect(container.textContent).toContain("STAY GOLD");
    expect(container.textContent).toContain("FLOW TO HORIZON");
    expect(container.textContent).toContain("BEYOND THE BOUNDARY");
    expect(container.textContent).toContain("ROOT FURTHER");
  });

  it("has correct dialog ARIA attributes", () => {
    const { container } = render(<RulesPanel {...defaultProps} />);

    const dialog = container.querySelector('[role="dialog"]');
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(dialog).toHaveAttribute(
      "aria-label",
      "Thể lệ chương trình Kudos"
    );
  });

  it("calls onClose when close button is clicked", async () => {
    const onClose = vi.fn();
    const { container } = render(
      <RulesPanel {...defaultProps} onClose={onClose} />
    );

    const dialog = container.querySelector('[role="dialog"]')!;
    const buttons = within(dialog as HTMLElement).getAllByRole("button");
    const closeButton = buttons[0];

    await userEvent
      .setup({ advanceTimers: vi.advanceTimersByTime })
      .click(closeButton);
    vi.advanceTimersByTime(300);

    expect(onClose).toHaveBeenCalled();
  });

  it("calls onWriteKudos when write button is clicked", async () => {
    const onWriteKudos = vi.fn();
    const onClose = vi.fn();
    const { container } = render(
      <RulesPanel
        {...defaultProps}
        onClose={onClose}
        onWriteKudos={onWriteKudos}
      />
    );

    const dialog = container.querySelector('[role="dialog"]')!;
    const buttons = within(dialog as HTMLElement).getAllByRole("button");
    const writeButton = buttons[buttons.length - 1];

    await userEvent
      .setup({ advanceTimers: vi.advanceTimersByTime })
      .click(writeButton);
    vi.advanceTimersByTime(300);

    expect(onClose).toHaveBeenCalled();
    expect(onWriteKudos).toHaveBeenCalled();
  });

  it("calls onClose when overlay is clicked", () => {
    const onClose = vi.fn();
    const { container } = render(
      <RulesPanel {...defaultProps} onClose={onClose} />
    );

    const overlay = container.querySelector('[aria-hidden="true"]');
    fireEvent.click(overlay!);
    vi.advanceTimersByTime(300);

    expect(onClose).toHaveBeenCalled();
  });

  it("calls onClose when Escape key is pressed", () => {
    const onClose = vi.fn();
    render(<RulesPanel {...defaultProps} onClose={onClose} />);

    fireEvent.keyDown(document, { key: "Escape" });
    vi.advanceTimersByTime(300);

    expect(onClose).toHaveBeenCalled();
  });

  it("locks body scroll when open and unlocks when closed", () => {
    const { unmount } = render(<RulesPanel {...defaultProps} />);
    expect(document.body.style.overflow).toBe("hidden");

    unmount();
    expect(document.body.style.overflow).toBe("");
  });
});
