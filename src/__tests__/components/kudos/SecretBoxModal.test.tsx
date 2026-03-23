import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, fireEvent, cleanup, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SecretBoxModal from "@/components/kudos/SecretBoxModal";

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
      kudos: {
        secretBoxModalTitle: "KHÁM PHÁ SECRET BOX CỦA BẠN",
        secretBoxInstruction: "Click vào box để mở",
        secretBoxCounterLabel: "Secretbox chưa mở",
        secretBoxAriaLabel: "Hộp bí mật",
        secretBoxFailed: "Không thể mở Secret Box",
        openSecretBoxAriaLabel: "Mở hộp bí mật",
        closeAriaLabel: "Đóng",
        secretBoxAlt: "Secret Box",
      },
    },
  }),
}));

const defaultProps = {
  isOpen: true,
  remainingBoxes: 5,
  onClose: vi.fn(),
};

describe("SecretBoxModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers({ shouldAdvanceTime: true });
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.useRealTimers();
    cleanup();
  });

  // T006 — US1: Core rendering and interaction
  describe("US1 - Open a Secret Box", () => {
    it("renders modal with title, instruction, gift box image, and counter when isOpen=true and remainingBoxes=5", () => {
      const { container } = render(<SecretBoxModal {...defaultProps} />);

      const dialog = container.querySelector('[role="dialog"]');
      expect(dialog).not.toBeNull();
      expect(container.textContent).toContain("KHÁM PHÁ SECRET BOX CỦA BẠN");
      expect(container.textContent).toContain("Click vào box để mở");
      expect(container.textContent).toContain("Secretbox chưa mở");
      expect(container.querySelector('img[alt="Secret Box"]')).not.toBeNull();
    });

    it("displays zero-padded count '05' for remainingBoxes=5", () => {
      const { container } = render(<SecretBoxModal {...defaultProps} />);
      expect(container.textContent).toContain("05");
    });

    it("calls POST /api/users/me/secret-box when gift box is clicked", async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({ data: { opened_count: 1, remaining: 4, badge_type: "STAY_GOLD" } }),
      });

      const { container } = render(<SecretBoxModal {...defaultProps} />);
      const giftButton = container.querySelector(
        'button[aria-label="Mở hộp bí mật"]'
      ) as HTMLElement;
      expect(giftButton).not.toBeNull();

      await userEvent
        .setup({ advanceTimers: vi.advanceTimersByTime })
        .click(giftButton);

      expect(global.fetch).toHaveBeenCalledWith("/api/users/me/secret-box", {
        method: "POST",
      });
    });

    it("decrements count after successful API response", async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({ data: { opened_count: 1, remaining: 4, badge_type: "STAY_GOLD" } }),
      });

      const { container } = render(<SecretBoxModal {...defaultProps} />);
      const giftButton = container.querySelector(
        'button[aria-label="Mở hộp bí mật"]'
      ) as HTMLElement;

      await userEvent
        .setup({ advanceTimers: vi.advanceTimersByTime })
        .click(giftButton);

      await waitFor(() => {
        expect(container.textContent).toContain("04");
      });
    });

    it("shows error toast when API returns error and preserves count", async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: false,
        json: () => Promise.resolve({ error: "No secret boxes remaining" }),
      });

      const { container } = render(<SecretBoxModal {...defaultProps} />);
      const giftButton = container.querySelector(
        'button[aria-label="Mở hộp bí mật"]'
      ) as HTMLElement;

      await userEvent
        .setup({ advanceTimers: vi.advanceTimersByTime })
        .click(giftButton);

      await waitFor(() => {
        expect(container.textContent).toContain("05");
      });
    });
  });

  // T007 — US2: Empty state
  describe("US2 - Empty State", () => {
    it("hides instruction text when remainingBoxes=0", () => {
      const { container } = render(
        <SecretBoxModal {...defaultProps} remainingBoxes={0} />
      );
      expect(container.textContent).not.toContain("Click vào box để mở");
    });

    it("disables gift box button when remainingBoxes=0", () => {
      const { container } = render(
        <SecretBoxModal {...defaultProps} remainingBoxes={0} />
      );
      const giftButton = container.querySelector(
        'button[aria-label="Mở hộp bí mật"]'
      ) as HTMLButtonElement;
      expect(giftButton).toHaveAttribute("disabled");
    });

    it("displays '00' in counter when remainingBoxes=0", () => {
      const { container } = render(
        <SecretBoxModal {...defaultProps} remainingBoxes={0} />
      );
      expect(container.textContent).toContain("00");
    });
  });

  // T008 — US3: Close behaviors
  describe("US3 - Close Modal", () => {
    it("calls onClose when X button clicked", async () => {
      const onClose = vi.fn();
      const { container } = render(
        <SecretBoxModal {...defaultProps} onClose={onClose} />
      );

      const dialog = container.querySelector('[role="dialog"]') as HTMLElement;
      const closeButton = dialog.querySelector(
        'button[aria-label="Đóng"]'
      ) as HTMLElement;

      await userEvent
        .setup({ advanceTimers: vi.advanceTimersByTime })
        .click(closeButton);
      vi.advanceTimersByTime(300);

      expect(onClose).toHaveBeenCalled();
    });

    it("calls onClose when backdrop overlay clicked", () => {
      const onClose = vi.fn();
      const { container } = render(
        <SecretBoxModal {...defaultProps} onClose={onClose} />
      );

      const overlay = container.querySelector('[aria-hidden="true"]');
      fireEvent.click(overlay!);
      vi.advanceTimersByTime(300);

      expect(onClose).toHaveBeenCalled();
    });

    it("calls onClose when Escape key pressed", () => {
      const onClose = vi.fn();
      render(<SecretBoxModal {...defaultProps} onClose={onClose} />);

      fireEvent.keyDown(document, { key: "Escape" });
      vi.advanceTimersByTime(300);

      expect(onClose).toHaveBeenCalled();
    });

    it("does not render when isOpen=false", () => {
      const { container } = render(
        <SecretBoxModal {...defaultProps} isOpen={false} />
      );
      expect(container.querySelector('[role="dialog"]')).toBeNull();
    });
  });

  // T014 — US4: Sequential opens
  describe("US4 - Multiple Sequential Opens", () => {
    it("resets to clickable state after successful open when remaining > 0", async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({ data: { opened_count: 1, remaining: 4, badge_type: "STAY_GOLD" } }),
      });

      const { container } = render(<SecretBoxModal {...defaultProps} />);
      const giftButton = container.querySelector(
        'button[aria-label="Mở hộp bí mật"]'
      ) as HTMLButtonElement;

      await userEvent
        .setup({ advanceTimers: vi.advanceTimersByTime })
        .click(giftButton);

      await waitFor(() => {
        expect(container.textContent).toContain("04");
        expect(giftButton).not.toHaveAttribute("disabled");
      });
    });

    it("shows empty state after opening last box (remaining becomes 0)", async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({ data: { opened_count: 1, remaining: 0, badge_type: "REVIVAL" } }),
      });

      const { container } = render(
        <SecretBoxModal {...defaultProps} remainingBoxes={1} />
      );
      const giftButton = container.querySelector(
        'button[aria-label="Mở hộp bí mật"]'
      ) as HTMLButtonElement;

      await userEvent
        .setup({ advanceTimers: vi.advanceTimersByTime })
        .click(giftButton);

      await waitFor(() => {
        expect(container.textContent).toContain("00");
        expect(giftButton).toHaveAttribute("disabled");
        expect(container.textContent).not.toContain("Click vào box để mở");
      });
    });

    it("prevents double-click during API call (loading state)", async () => {
      let resolvePromise: (value: unknown) => void;
      (global.fetch as ReturnType<typeof vi.fn>).mockReturnValueOnce(
        new Promise((resolve) => {
          resolvePromise = resolve;
        })
      );

      const { container } = render(<SecretBoxModal {...defaultProps} />);
      const giftButton = container.querySelector(
        'button[aria-label="Mở hộp bí mật"]'
      ) as HTMLButtonElement;

      await userEvent
        .setup({ advanceTimers: vi.advanceTimersByTime })
        .click(giftButton);

      // During loading, button should be disabled
      expect(giftButton).toHaveAttribute("disabled");

      resolvePromise!({
        ok: true,
        json: () =>
          Promise.resolve({ data: { opened_count: 1, remaining: 4, badge_type: "STAY_GOLD" } }),
      });
    });
  });

  // T018 — Accessibility
  describe("Accessibility", () => {
    it("modal has role=dialog and aria-modal=true", () => {
      const { container } = render(<SecretBoxModal {...defaultProps} />);
      const dialog = container.querySelector('[role="dialog"]');
      expect(dialog).toHaveAttribute("aria-modal", "true");
      expect(dialog).toHaveAttribute("aria-label", "Hộp bí mật");
    });

    it("gift box button has aria-label", () => {
      const { container } = render(<SecretBoxModal {...defaultProps} />);
      const giftButton = container.querySelector(
        'button[aria-label="Mở hộp bí mật"]'
      );
      expect(giftButton).not.toBeNull();
    });

    it("locks body scroll when open and unlocks when closed", () => {
      const { unmount } = render(<SecretBoxModal {...defaultProps} />);
      expect(document.body.style.overflow).toBe("hidden");

      unmount();
      expect(document.body.style.overflow).toBe("");
    });
  });
});
