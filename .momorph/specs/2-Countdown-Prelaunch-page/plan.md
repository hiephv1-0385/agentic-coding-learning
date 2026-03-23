# Implementation Plan: Countdown - Prelaunch Page

**Frame**: `2268:35127-Countdown-Prelaunch-page`
**Date**: 2026-03-13
**Spec**: `specs/2-Countdown-Prelaunch-page/spec.md`

---

## Summary

Build a full-page prelaunch countdown at `/prelaunch` showing days/hours/minutes until the event, with glassmorphism digit cards, a dramatic dark background with abstract image overlay, and page-load animations. The page is publicly accessible, fully responsive, localized (VN/EN), and redirects to Homepage SAA when the countdown expires. Leverages the existing `useCountdown` hook (refactored to accept a `targetDate` param and 1-second interval), existing font infrastructure (Montserrat + Digital Numbers), and the project's custom i18n system.

---

## Technical Context

**Language/Framework**: TypeScript (strict) / Next.js 15.x (App Router)
**Primary Dependencies**: React 19.x, TailwindCSS 4.x, next/image, next/font
**Database**: N/A (client-side only)
**Testing**: Vitest + @testing-library/react
**State Management**: Local component state (useState/useEffect)
**API Style**: N/A (no API calls)

---

## Constitution Compliance Check

*GATE: Must pass before implementation can begin*

- [x] Follows project coding conventions (TypeScript strict, PascalCase components, camelCase hooks)
- [x] Uses approved libraries and patterns (Next.js App Router, TailwindCSS, next/image)
- [x] Adheres to folder structure guidelines (`src/app/prelaunch/`, `src/components/prelaunch/`)
- [x] Meets security requirements (no user input, no API calls, public page)
- [x] Follows testing standards (Vitest, integration tests, `renderWithProviders`)

**Violations**: None

**Token Reuse Note**: Several design tokens from `design-style.md` already exist in the Tailwind theme (`globals.css`). Prefer theme classes over arbitrary values where possible:

| Design Token | Existing Tailwind Theme Token | Use |
|---|---|---|
| `#00101A` (page bg) | `--color-page-bg` → `bg-page-bg` | ✅ Reuse |
| `#FFFFFF` (text) | `text-white` (built-in) | ✅ Reuse |
| `#FFEA9E` (card border) | `--color-gold-primary` → `border-gold-primary` | ✅ Reuse |
| Montserrat font | `--font-family-montserrat` → `font-[family-name:var(--font-montserrat)]` | ✅ Reuse |
| Digital Numbers font | `--font-family-digital` → `font-[family-name:var(--font-digital)]` | ✅ Reuse |
| Gradient overlay | N/A (unique 18deg gradient) | Arbitrary value required |
| Card bg gradient | N/A (unique glassmorphism) | Arbitrary value required |
| Backdrop blur 25px | N/A (unique value) | Arbitrary value required |

---

## Architecture Decisions

### Frontend Approach

- **Component Structure**: Feature-based — all prelaunch components in `src/components/prelaunch/`
- **Styling Strategy**: Tailwind utility classes with arbitrary values (design uses unique dark/glassmorphism theme)
- **Data Fetching**: None — `targetDate` read from `NEXT_PUBLIC_EVENT_DATETIME` env var in server component, passed as prop to client component
- **Rendering**: Server component page wrapper (`page.tsx`) with `"use client"` countdown component
- **Server → Client prop flow**: `page.tsx` reads `NEXT_PUBLIC_EVENT_DATETIME` env var, hardcodes `backgroundImageSrc` to `/images/prelaunch-bg.png`, and wires `onComplete` via a client wrapper that calls `router.push('/')`:

  ```tsx
  // src/app/prelaunch/page.tsx (server component)
  import { CountdownPrelaunchPage } from "@/components/prelaunch/CountdownPrelaunchPage";

  export default function PrelaunchPage() {
    const targetDate = process.env.NEXT_PUBLIC_EVENT_DATETIME ?? "";
    return (
      <CountdownPrelaunchPage
        targetDate={targetDate}
        backgroundImageSrc="/images/prelaunch-bg.png"
      />
    );
  }
  ```

  Note: `onComplete` (router.push) is handled inside the client component since `useRouter` requires a client context. The server component does NOT pass `onComplete`.

### Key Decision: Refactor `useCountdown` hook

The existing `useCountdown` hook (`src/hooks/useCountdown.ts`) has nearly identical logic but with two limitations:
1. Hardcoded to read from `NEXT_PUBLIC_EVENT_DATETIME` env var (no `targetDate` param)
2. Updates every 60 seconds (spec requires 1-second interval for prompt minute transitions)

**Decision**: Refactor `useCountdown` to accept an optional `targetDate` parameter and configurable `intervalMs`. This avoids code duplication while maintaining backward compatibility with the homepage `CountdownTimer`.

```typescript
// New signature (backward-compatible)
export function useCountdown(options?: {
  targetDate?: Date | string;
  intervalMs?: number;
  onComplete?: () => void;
}): CountdownResult;
```

- When `targetDate` is omitted, falls back to `NEXT_PUBLIC_EVENT_DATETIME` (existing behavior)
- When `intervalMs` is omitted, defaults to 60_000 (existing behavior)
- Homepage `CountdownTimer` continues to call `useCountdown()` with no args — zero breaking changes
- **`onComplete` timing constraint** (spec US2-AS3): If already expired on mount, `onComplete` MUST fire on the first interval tick (not synchronously during render or in the state initializer). Implementation: check `isExpired` inside the interval callback, not in `useState` init or render body. Use a `useRef` to ensure `onComplete` fires exactly once.

### Key Decision: DigitCard as reusable component

The Figma design uses a reusable component (`186:2619`). Extract `DigitCard` as a standalone component in `src/components/prelaunch/DigitCard.tsx` with the glassmorphism effect. This component is specific to the prelaunch page design and should NOT be placed in `src/components/ui/` (it uses a unique visual style not shared across the app).

### Key Decision: No Header/Footer on prelaunch page

Per spec: "No user-initiated navigation from this page (no links, buttons, or header nav)." The prelaunch page is a standalone full-screen experience without the shared `Header` and `Footer` components.

### Integration Points

- **Existing Services**: None (standalone page)
- **Shared Components**: None (unique visual design, no Header/Footer)
- **Shared Infrastructure**:
  - `useCountdown` hook (refactored)
  - `useLocale` hook + locale files (add `prelaunch` section)
  - Font CSS variables (`--font-montserrat`, `--font-digital`) — already configured in `layout.tsx`
  - `next/image` for background image
  - `NEXT_PUBLIC_EVENT_DATETIME` env var — already used by homepage countdown

---

## Project Structure

### Documentation (this feature)

```text
.momorph/specs/2-Countdown-Prelaunch-page/
├── spec.md              # Feature specification ✅
├── design-style.md      # Design specifications ✅
├── plan.md              # This file ✅
└── tasks.md             # Task breakdown (next step)
```

### Source Code (affected areas)

```text
src/
├── app/
│   └── prelaunch/
│       └── page.tsx                    # NEW — Server component, reads env var, renders CountdownPrelaunchPage
├── components/
│   └── prelaunch/
│       ├── CountdownPrelaunchPage.tsx   # NEW — "use client" main page component
│       ├── DigitCard.tsx                # NEW — Glassmorphism digit card
│       └── TimeUnit.tsx                 # NEW — Digit pair + label (DAYS/HOURS/MINUTES)
├── hooks/
│   └── useCountdown.ts                 # MODIFY — Add targetDate param, intervalMs, onComplete
├── locales/
│   ├── en.ts                           # MODIFY — Add prelaunch section
│   └── vi.ts                           # MODIFY — Add prelaunch section
└── __tests__/
    └── prelaunch/
        ├── CountdownPrelaunchPage.test.tsx  # NEW — Integration tests
        ├── DigitCard.test.tsx               # NEW — Unit tests
        └── useCountdown.test.ts             # NEW — Hook tests (refactored behavior)

public/
└── images/
    └── prelaunch-bg.png                # NEW — Background image (from MoMorph media)
```

### Modified Files

| File | Changes |
|------|---------|
| `src/hooks/useCountdown.ts` | Add optional `targetDate`, `intervalMs`, `onComplete` params (backward-compatible) |
| `src/locales/vi.ts` | Add `prelaunch` translation section |
| `src/locales/en.ts` | Add `prelaunch` translation section |

### New Files

| File | Purpose |
|------|---------|
| `src/app/prelaunch/page.tsx` | Route entry — server component wrapper |
| `src/components/prelaunch/CountdownPrelaunchPage.tsx` | Main client component with background, gradient, countdown |
| `src/components/prelaunch/DigitCard.tsx` | Glassmorphism digit card (reusable Figma component `186:2619`) |
| `src/components/prelaunch/TimeUnit.tsx` | Time unit group: two DigitCards + localized label |
| `src/__tests__/prelaunch/CountdownPrelaunchPage.test.tsx` | Integration tests |
| `src/__tests__/prelaunch/DigitCard.test.tsx` | Unit tests |
| `src/__tests__/prelaunch/useCountdown.test.ts` | Hook refactor tests |
| `public/images/prelaunch-bg.png` | Background image asset |

### Dependencies

No new packages required. All dependencies are already in the project.

---

## Implementation Strategy

### Phase 0: Asset Preparation
- Download background image from MoMorph media (node `2268:35129`) to `public/images/prelaunch-bg.png`
- Verify Digital Numbers font is correctly loaded (already at `public/fonts/DigitalNumbers-Regular.woff2`)

### Phase 1: Foundation (Hook + i18n + Types)
- Refactor `useCountdown` hook to accept `targetDate`, `intervalMs`, `onComplete` params
- Write tests for refactored hook (existing behavior preserved + new behavior)
- Add `prelaunch` section to both locale files:

  **`src/locales/vi.ts`**:
  ```typescript
  prelaunch: {
    title: "Sự kiện sẽ bắt đầu sau",
    days: "NGÀY",
    hours: "GIỜ",
    minutes: "PHÚT",
  }
  ```

  **`src/locales/en.ts`**:
  ```typescript
  prelaunch: {
    title: "The event starts in",
    days: "DAYS",
    hours: "HOURS",
    minutes: "MINUTES",
  }
  ```

### Phase 2: Core UI Components (US1 — P1)
- Build `DigitCard` component with glassmorphism effect + unit tests:
  - CardBg div with `opacity-50` (NOT on parent, so digit text stays fully opaque)
  - Fixed dimensions at each breakpoint to prevent layout shift (TR-004)
  - Accept `digit: string` and `previousDigit?: string` props for transition animation
- Build `TimeUnit` component (two DigitCards + label)
- Build `CountdownPrelaunchPage` client component with:
  - Background image (`next/image` with `fill`, `priority`, `sizes="100vw"`, `aria-hidden="true"`)
  - Gradient overlay (`linear-gradient(18deg, ...)`)
  - Title (localized via `useLocale().t.prelaunch.title`)
  - Countdown row with 3 TimeUnits
  - **Page-load entrance animations (FR-010)**: Use CSS `@keyframes` defined in component or Tailwind `animate-*` utilities. Background image: `opacity-0` → `opacity-100` over 500ms ease-in. Content: `opacity-0 translate-y-[20px]` → `opacity-100 translate-y-0` over 600ms ease-out. Trigger by mounting with initial hidden state and toggling via `useEffect` on mount, or use CSS `animation-fill-mode: forwards` with a start delay.
- Create `src/app/prelaunch/page.tsx` server component wrapper (see code sketch in Architecture Decisions)

### Phase 3: Countdown Logic (US2 — P1)
- Wire `useCountdown({ targetDate, intervalMs: 1000, onComplete })` into `CountdownPrelaunchPage`
- `onComplete`: call `router.push('/')` via `useRouter` inside the client component
- Handle expired state: display 00:00:00, invoke redirect on first tick (NOT during render — see `onComplete` timing constraint above)
- **Digit transition animation**: Track previous digit value via `useRef` or prop comparison. When a digit changes, apply CSS transition: `opacity: 0, translateY: -10px` → `opacity: 1, translateY: 0` over 300ms ease-in-out. Approach: toggle a CSS class (e.g., `animate-digit-change`) that auto-resets via `onAnimationEnd` or a short timeout. The `DigitCard` component handles this internally based on `digit !== previousDigit`.

### Phase 4: Responsive Design (US3 — P2)
- Implement mobile-first responsive styles per design-style.md:
  - Mobile (< 640px): Smaller cards, wrapped layout, reduced padding
  - Tablet (640-1023px): Mid-size cards, single row, moderate padding
  - Desktop (>= 1024px): Full-size per Figma design
- Test across breakpoints

### Phase 5: Accessibility & Polish (US4 — P3)
- Add `role="timer"`, `aria-live="polite"`, `aria-label` for screen readers
- `aria-label` on countdown container: dynamically computed (e.g., `"0 days, 5 hours, 20 minutes"`) — localized
- Add `aria-hidden="true"` on decorative elements (background image, gradient overlay)
- Edge case handling:
  - Invalid/missing `targetDate`: display "00" for all units, `console.warn` in development
  - Overflow on < 320px: outer container switches to `overflow-y-auto`
  - Background image load failure: dark bg (`#00101A`) + gradient remain visible (inherent fallback)
- **JS-disabled behavior** (spec edge case): Since `CountdownPrelaunchPage` is `"use client"`, React SSR renders the initial state from the `useState` initializer. This means SSR output shows the **correct calculated values** (not "00"), which is better than the spec's minimum. With JS disabled, the countdown won't tick but the initial snapshot is accurate. No additional work needed — this is handled by the state initializer pattern.
- Integration tests covering all user stories

### Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| `useCountdown` refactor breaks homepage | Low | High | Backward-compatible API — no-args call unchanged. Add regression tests for existing behavior. |
| Digital Numbers font rendering inconsistency | Low | Medium | Font is already loaded and used by homepage CountdownTimer. Verify at all breakpoints. |
| `backdrop-filter` Safari compatibility | Medium | Low | Add `-webkit-backdrop-filter` prefix. Already noted in design-style.md. |
| 1-second interval performance on low-end devices | Low | Low | Only updates React state when displayed values (minutes) actually change — no unnecessary re-renders. |
| Background image LCP impact | Medium | Medium | Use `next/image` with `priority` prop for LCP optimization. Image is above the fold. |

### Estimated Complexity

- **Frontend**: Medium (glassmorphism, responsive, animations, hook refactor)
- **Backend**: None
- **Testing**: Low-Medium (client-side only, no API mocking needed)

---

## Integration Testing Strategy

### Test Scope

- [x] **Component/Module interactions**: CountdownPrelaunchPage ↔ useCountdown ↔ TimeUnit ↔ DigitCard
- [ ] **External dependencies**: None
- [ ] **Data layer**: N/A
- [x] **User workflows**: Page load → countdown display → countdown expiry → redirect

### Test Categories

| Category | Applicable? | Key Scenarios |
|----------|-------------|---------------|
| UI ↔ Logic | Yes | Countdown renders correct values, updates on tick, redirects on expiry |
| Service ↔ Service | No | N/A |
| App ↔ External API | No | N/A |
| App ↔ Data Layer | No | N/A |
| Cross-platform | Yes | Responsive layout at 3 breakpoints |

### Test Environment

- **Environment type**: Local (jsdom via Vitest)
- **Test data strategy**: Mock `Date.now()` via `vi.useFakeTimers()` for deterministic countdown values
- **Isolation approach**: Fresh state per test, cleanup timers

### Mocking Strategy

| Dependency Type | Strategy | Rationale |
|-----------------|----------|-----------|
| `Date.now` / timers | Mock (`vi.useFakeTimers`) | Deterministic countdown testing |
| `next/navigation` | Mock (already in `vitest.setup.ts`) | Test `router.push` on expiry |
| `next/image` | Passthrough | No need to mock, renders as img in jsdom |

### Test Scenarios Outline

1. **Happy Path**
   - [x] Renders countdown with correct days/hours/minutes for a future target date
   - [x] Displays localized title and labels (VN and EN)
   - [x] Background image renders with correct alt/aria attributes
   - [x] Updates displayed values when minute boundary crosses

2. **Countdown Expiry**
   - [x] Displays 00/00/00 when target date is in the past
   - [x] Calls `onComplete` (router.push) when countdown reaches zero
   - [x] Calls `onComplete` on mount if already expired
   - [x] Does not error when `onComplete` is not provided

3. **Edge Cases**
   - [x] Handles invalid targetDate gracefully (displays 00s, warns in dev)
   - [x] Cleans up interval on unmount (no memory leaks)

4. **Accessibility**
   - [x] Countdown container has `role="timer"` and `aria-live="polite"`
   - [x] Background image has `aria-hidden="true"`

### Tooling & Framework

- **Test framework**: Vitest + @testing-library/react
- **Supporting tools**: `renderWithProviders()` from `src/__tests__/test-utils.tsx`
- **CI integration**: `yarn test` (existing pipeline)

### Coverage Goals

| Area | Target | Priority |
|------|--------|----------|
| Core countdown logic (hook) | 90%+ | High |
| Component rendering | 85%+ | High |
| Edge cases / error handling | 75%+ | Medium |

---

## Dependencies & Prerequisites

### Required Before Start

- [x] `constitution.md` reviewed and understood
- [x] `spec.md` approved by stakeholders
- [x] Codebase research completed (existing patterns identified)
- [x] API contracts defined — N/A
- [x] Database migrations planned — N/A

### External Dependencies

- Background image asset from MoMorph media (node `2268:35129`)

---

## Next Steps

After plan approval:

1. **Run** `/momorph.tasks` to generate task breakdown
2. **Review** tasks.md for parallelization opportunities
3. **Begin** implementation following task order

---

## Notes

- The existing `CountdownTimer` on the homepage (`src/components/homepage/CountdownTimer.tsx`) uses a simpler visual design (plain `bg-black/30` cards). The prelaunch page has a completely different visual style (glassmorphism, gradient background, entrance animations). No visual components are shared between them — only the refactored hook logic.
- The `NEXT_PUBLIC_EVENT_DATETIME` env var is already used by the homepage countdown. The prelaunch `page.tsx` server component will read the same env var and pass it as `targetDate` prop to the client component. This ensures a single source of truth for the event date.
- Font CSS variables `var(--font-digital)` and `var(--font-montserrat)` are applied to `<body>` in `layout.tsx`. Use `font-[family-name:var(--font-digital)]` for digit text (pattern already established by homepage `CountdownTimer`).
- The prelaunch page does NOT include Header or Footer — it's a standalone full-bleed experience. The root `layout.tsx` wraps all routes, but Header/Footer are conditionally rendered per route (they are not in the root layout, they're in page-specific layouts or directly in pages).
