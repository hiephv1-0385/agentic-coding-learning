import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { useCountdown } from "@/hooks/useCountdown";

describe("useCountdown", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("existing no-args behavior (regression)", () => {
    it("reads from NEXT_PUBLIC_EVENT_DATETIME env var when no args provided", () => {
      const futureDate = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 5 * 60 * 60 * 1000 + 30 * 60 * 1000);
      vi.stubEnv("NEXT_PUBLIC_EVENT_DATETIME", futureDate.toISOString());

      const { result } = renderHook(() => useCountdown());

      expect(result.current.days).toBe("02");
      expect(result.current.hours).toBe("05");
      expect(result.current.minutes).toBe("30");
      expect(result.current.isExpired).toBe(false);
      expect(result.current.isValid).toBe(true);

      vi.unstubAllEnvs();
    });

    it("returns all 00s with isValid false when env var is empty", () => {
      vi.stubEnv("NEXT_PUBLIC_EVENT_DATETIME", "");

      const { result } = renderHook(() => useCountdown());

      expect(result.current.days).toBe("00");
      expect(result.current.hours).toBe("00");
      expect(result.current.minutes).toBe("00");
      expect(result.current.isValid).toBe(false);

      vi.unstubAllEnvs();
    });
  });

  describe("custom targetDate", () => {
    it("returns correct values for a future target date", () => {
      const futureDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000 + 12 * 60 * 60 * 1000 + 45 * 60 * 1000);

      const { result } = renderHook(() =>
        useCountdown({ targetDate: futureDate })
      );

      expect(result.current.days).toBe("03");
      expect(result.current.hours).toBe("12");
      expect(result.current.minutes).toBe("45");
      expect(result.current.isExpired).toBe(false);
      expect(result.current.isValid).toBe(true);
    });

    it("accepts string targetDate (ISO 8601)", () => {
      const futureDate = new Date(Date.now() + 1 * 24 * 60 * 60 * 1000);

      const { result } = renderHook(() =>
        useCountdown({ targetDate: futureDate.toISOString() })
      );

      expect(result.current.days).toBe("01");
      expect(result.current.isValid).toBe(true);
    });
  });

  describe("intervalMs: 1000 ticks every second", () => {
    it("updates countdown when minute boundary crosses", () => {
      // Set target 2 minutes and 30 seconds from now
      const futureDate = new Date(Date.now() + 2 * 60 * 1000 + 30 * 1000);

      const { result } = renderHook(() =>
        useCountdown({ targetDate: futureDate, intervalMs: 1000 })
      );

      expect(result.current.minutes).toBe("02");

      // Advance 31 seconds to cross the minute boundary
      act(() => {
        vi.advanceTimersByTime(31_000);
      });

      expect(result.current.minutes).toBe("01");
    });
  });

  describe("onComplete callback", () => {
    it("fires exactly once when countdown expires", () => {
      const onComplete = vi.fn();
      // 2 seconds from now
      const futureDate = new Date(Date.now() + 2000);

      renderHook(() =>
        useCountdown({ targetDate: futureDate, intervalMs: 1000, onComplete })
      );

      expect(onComplete).not.toHaveBeenCalled();

      // Advance past expiry
      act(() => {
        vi.advanceTimersByTime(3000);
      });

      expect(onComplete).toHaveBeenCalledTimes(1);

      // Advance more — should not fire again
      act(() => {
        vi.advanceTimersByTime(5000);
      });

      expect(onComplete).toHaveBeenCalledTimes(1);
    });

    it("fires on first tick if already expired on mount (not during render)", () => {
      const onComplete = vi.fn();
      const pastDate = new Date(Date.now() - 60_000);

      renderHook(() =>
        useCountdown({ targetDate: pastDate, intervalMs: 1000, onComplete })
      );

      // onComplete fires during the initial useEffect update (first tick), not during render
      expect(onComplete).toHaveBeenCalledTimes(1);
    });
  });

  describe("cleanup", () => {
    it("clears interval on unmount", () => {
      const clearIntervalSpy = vi.spyOn(globalThis, "clearInterval");
      const futureDate = new Date(Date.now() + 60_000);

      const { unmount } = renderHook(() =>
        useCountdown({ targetDate: futureDate, intervalMs: 1000 })
      );

      unmount();

      expect(clearIntervalSpy).toHaveBeenCalled();
      clearIntervalSpy.mockRestore();
    });
  });

  describe("invalid date", () => {
    it("returns all 00s with isValid false for invalid date string", () => {
      const { result } = renderHook(() =>
        useCountdown({ targetDate: "not-a-date" })
      );

      expect(result.current.days).toBe("00");
      expect(result.current.hours).toBe("00");
      expect(result.current.minutes).toBe("00");
      expect(result.current.isValid).toBe(false);
    });

    it("returns all 00s with isValid false for empty string", () => {
      const { result } = renderHook(() =>
        useCountdown({ targetDate: "" })
      );

      expect(result.current.days).toBe("00");
      expect(result.current.hours).toBe("00");
      expect(result.current.minutes).toBe("00");
      expect(result.current.isValid).toBe(false);
    });
  });
});
