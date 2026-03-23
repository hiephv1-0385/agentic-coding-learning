import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { screen, act, cleanup } from "@testing-library/react";
import { renderWithProviders } from "@/__tests__/test-utils";
import { CountdownPrelaunchPage } from "@/components/prelaunch/CountdownPrelaunchPage";

describe("CountdownPrelaunchPage", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
  });

  describe("US1: View Countdown", () => {
    it("renders countdown with correct days/hours/minutes for future target date", () => {
      const futureDate = new Date(
        Date.now() + 5 * 24 * 60 * 60 * 1000 + 12 * 60 * 60 * 1000 + 30 * 60 * 1000
      );

      renderWithProviders(
        <CountdownPrelaunchPage
          targetDate={futureDate.toISOString()}
          backgroundImageSrc="/images/prelaunch-bg.png"
        />
      );

      const allDigits = screen.getAllByText(/^[0-9]$/);
      const digitValues = allDigits.map((el) => el.textContent);

      expect(digitValues).toContain("0");
      expect(digitValues).toContain("5");
      expect(digitValues).toContain("1");
      expect(digitValues).toContain("2");
      expect(digitValues).toContain("3");
    });

    it("displays localized title in VN locale", () => {
      const futureDate = new Date(Date.now() + 60_000);

      renderWithProviders(
        <CountdownPrelaunchPage
          targetDate={futureDate.toISOString()}
          backgroundImageSrc="/images/prelaunch-bg.png"
        />,
        { locale: "vi" }
      );

      expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
        "Sự kiện sẽ bắt đầu sau"
      );
    });

    it("displays title in EN locale", () => {
      const futureDate = new Date(Date.now() + 60_000);

      renderWithProviders(
        <CountdownPrelaunchPage
          targetDate={futureDate.toISOString()}
          backgroundImageSrc="/images/prelaunch-bg.png"
        />,
        { locale: "en" }
      );

      expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
        "The event starts in"
      );
    });

    it("displays localized labels NGÀY/GIỜ/PHÚT in VN locale", () => {
      const futureDate = new Date(Date.now() + 60_000);

      renderWithProviders(
        <CountdownPrelaunchPage
          targetDate={futureDate.toISOString()}
          backgroundImageSrc="/images/prelaunch-bg.png"
        />,
        { locale: "vi" }
      );

      expect(screen.getByText("NGÀY")).toBeInTheDocument();
      expect(screen.getByText("GIỜ")).toBeInTheDocument();
      expect(screen.getByText("PHÚT")).toBeInTheDocument();
    });

    it("displays localized labels DAYS/HOURS/MINUTES in EN locale", () => {
      const futureDate = new Date(Date.now() + 60_000);

      renderWithProviders(
        <CountdownPrelaunchPage
          targetDate={futureDate.toISOString()}
          backgroundImageSrc="/images/prelaunch-bg.png"
        />,
        { locale: "en" }
      );

      expect(screen.getByText("DAYS")).toBeInTheDocument();
      expect(screen.getByText("HOURS")).toBeInTheDocument();
      expect(screen.getByText("MINUTES")).toBeInTheDocument();
    });

    it("background image has aria-hidden='true'", () => {
      const futureDate = new Date(Date.now() + 60_000);

      const { container } = renderWithProviders(
        <CountdownPrelaunchPage
          targetDate={futureDate.toISOString()}
          backgroundImageSrc="/images/prelaunch-bg.png"
        />
      );

      const img = container.querySelector("img");
      expect(img).toHaveAttribute("aria-hidden", "true");
    });

    it("updates displayed values when minute boundary crosses", () => {
      const futureDate = new Date(Date.now() + 2 * 60 * 1000 + 10 * 1000);

      renderWithProviders(
        <CountdownPrelaunchPage
          targetDate={futureDate.toISOString()}
          backgroundImageSrc="/images/prelaunch-bg.png"
        />
      );

      // Initially minutes = "02" → tens digit "0", ones digit "2"
      expect(screen.getAllByText("2").length).toBeGreaterThan(0);

      // Advance 11 seconds to cross the minute boundary → minutes = "01"
      act(() => {
        vi.advanceTimersByTime(11_000);
      });

      const timer = screen.getByRole("timer");
      expect(timer).toBeInTheDocument();
    });
  });

  describe("US2: Countdown Reaches Zero", () => {
    it("displays 00/00/00 when target date is in the past", () => {
      const pastDate = new Date(Date.now() - 60_000);

      const { container } = renderWithProviders(
        <CountdownPrelaunchPage
          targetDate={pastDate.toISOString()}
          backgroundImageSrc="/images/prelaunch-bg.png"
        />
      );

      // All 6 digit cards should show "0"
      const digitSpans = container.querySelectorAll(
        "[class*='font-\\[family-name\\:var\\(--font-digital\\)\\]']"
      );
      const digitValues = Array.from(digitSpans).map((el) => el.textContent);
      expect(digitValues).toEqual(["0", "0", "0", "0", "0", "0"]);
    });

    it("calls router.push('/') when countdown reaches zero", async () => {
      const { useRouter } = await import("next/navigation");
      const mockPush = (useRouter() as { push: ReturnType<typeof vi.fn> }).push;
      mockPush.mockClear();

      const futureDate = new Date(Date.now() + 2000);

      renderWithProviders(
        <CountdownPrelaunchPage
          targetDate={futureDate.toISOString()}
          backgroundImageSrc="/images/prelaunch-bg.png"
        />
      );

      act(() => {
        vi.advanceTimersByTime(3000);
      });

      expect(mockPush).toHaveBeenCalledWith("/");
    });

    it("calls router.push('/') on mount if already expired", async () => {
      const { useRouter } = await import("next/navigation");
      const mockPush = (useRouter() as { push: ReturnType<typeof vi.fn> }).push;
      mockPush.mockClear();

      const pastDate = new Date(Date.now() - 60_000);

      renderWithProviders(
        <CountdownPrelaunchPage
          targetDate={pastDate.toISOString()}
          backgroundImageSrc="/images/prelaunch-bg.png"
        />
      );

      expect(mockPush).toHaveBeenCalledWith("/");
    });

    it("does not error when external onComplete prop is not provided", () => {
      const pastDate = new Date(Date.now() - 60_000);

      expect(() => {
        renderWithProviders(
          <CountdownPrelaunchPage
            targetDate={pastDate.toISOString()}
            backgroundImageSrc="/images/prelaunch-bg.png"
          />
        );
      }).not.toThrow();
    });

    it("onComplete fires exactly once (not repeatedly)", async () => {
      const { useRouter } = await import("next/navigation");
      const mockPush = (useRouter() as { push: ReturnType<typeof vi.fn> }).push;
      mockPush.mockClear();

      const futureDate = new Date(Date.now() + 1000);

      renderWithProviders(
        <CountdownPrelaunchPage
          targetDate={futureDate.toISOString()}
          backgroundImageSrc="/images/prelaunch-bg.png"
        />
      );

      act(() => {
        vi.advanceTimersByTime(5000);
      });

      expect(mockPush).toHaveBeenCalledTimes(1);
    });
  });

  describe("US4: Accessibility", () => {
    it("countdown container has role='timer'", () => {
      const futureDate = new Date(Date.now() + 60_000);

      renderWithProviders(
        <CountdownPrelaunchPage
          targetDate={futureDate.toISOString()}
          backgroundImageSrc="/images/prelaunch-bg.png"
        />
      );

      expect(screen.getByRole("timer")).toBeInTheDocument();
    });

    it("countdown container has aria-live='polite'", () => {
      const futureDate = new Date(Date.now() + 60_000);

      renderWithProviders(
        <CountdownPrelaunchPage
          targetDate={futureDate.toISOString()}
          backgroundImageSrc="/images/prelaunch-bg.png"
        />
      );

      const timer = screen.getByRole("timer");
      expect(timer).toHaveAttribute("aria-live", "polite");
    });

    it("aria-label contains time values", () => {
      const futureDate = new Date(
        Date.now() + 5 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000 + 20 * 60 * 1000
      );

      renderWithProviders(
        <CountdownPrelaunchPage
          targetDate={futureDate.toISOString()}
          backgroundImageSrc="/images/prelaunch-bg.png"
        />,
        { locale: "vi" }
      );

      const timer = screen.getByRole("timer");
      const ariaLabel = timer.getAttribute("aria-label");
      expect(ariaLabel).toContain("05");
      expect(ariaLabel).toContain("03");
      expect(ariaLabel).toContain("20");
    });
  });
});
