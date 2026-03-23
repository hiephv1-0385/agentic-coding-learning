import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

// Mock next/navigation for all tests
const mockRouter = {
  push: vi.fn(),
  replace: vi.fn(),
  refresh: vi.fn(),
  back: vi.fn(),
  forward: vi.fn(),
  prefetch: vi.fn(),
};

vi.mock("next/navigation", () => ({
  useRouter: () => mockRouter,
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => "/",
}));

// Polyfill IntersectionObserver for jsdom
if (typeof globalThis.IntersectionObserver === "undefined") {
  globalThis.IntersectionObserver = class IntersectionObserver {
    constructor() {}
    observe() {}
    disconnect() {}
    unobserve() {}
  } as unknown as typeof globalThis.IntersectionObserver;
}
