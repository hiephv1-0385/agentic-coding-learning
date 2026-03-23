# Tasks: Countdown - Prelaunch Page

**Frame**: `2268:35127-Countdown-Prelaunch-page`
**Prerequisites**: plan.md (required), spec.md (required), design-style.md (required)

---

## Task Format

```
- [x] T### [P?] [Story?] Description | file/path.ts
```

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this belongs to (US1, US2, US3, US4)
- **|**: File path affected by this task

---

## Phase 1: Setup (Asset Preparation)

**Purpose**: Download assets and verify prerequisites

- [x] T001 Download background image from MoMorph media (node `2268:35129`) | public/images/prelaunch-bg.png
- [x] T002 Verify Digital Numbers font exists at `public/fonts/DigitalNumbers-Regular.woff2` and Montserrat is configured in `src/app/layout.tsx`

**Checkpoint**: Assets ready — foundation work can begin

---

## Phase 2: Foundation (Hook Refactor + i18n)

**Purpose**: Core infrastructure required by ALL user stories — refactored `useCountdown` hook and i18n translations

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T003 Refactor `useCountdown` hook: add optional `options` parameter with `targetDate?: Date | string`, `intervalMs?: number`, `onComplete?: () => void`. When omitted, fall back to `NEXT_PUBLIC_EVENT_DATETIME` env var and 60s interval (backward-compatible). Add `useRef` for once-only `onComplete` invocation. See plan.md Architecture Decisions for full signature. | src/hooks/useCountdown.ts
- [x] T004 Write tests for refactored `useCountdown` hook: (1) existing no-args behavior unchanged (regression), (2) custom `targetDate` returns correct values, (3) `intervalMs: 1000` ticks every second, (4) `onComplete` fires exactly once when expired, (5) `onComplete` fires on first tick if already expired on mount (NOT during render), (6) cleanup clears interval on unmount, (7) invalid date returns all "00" with `isValid: false` | src/__tests__/prelaunch/useCountdown.test.ts
- [x] T005 [P] Add `prelaunch` translation section to Vietnamese locale: `title: "Sự kiện sẽ bắt đầu sau"`, `days: "NGÀY"`, `hours: "GIỜ"`, `minutes: "PHÚT"` | src/locales/vi.ts
- [x] T006 [P] Add `prelaunch` translation section to English locale: `title: "The event starts in"`, `days: "DAYS"`, `hours: "HOURS"`, `minutes: "MINUTES"` | src/locales/en.ts

**Checkpoint**: Foundation ready — `useCountdown` refactored and tested, i18n keys available. User story implementation can begin.

---

## Phase 3: User Story 1 — View Countdown to Event (Priority: P1) 🎯 MVP

**Goal**: Visitor sees a live countdown (days/hours/minutes) in glassmorphism digit cards with localized title and labels, on a full-bleed dark background with gradient overlay and page-load entrance animations.

**Independent Test**: Load `/prelaunch` with `NEXT_PUBLIC_EVENT_DATETIME` set to a future date → verify countdown displays correct remaining time, title shows "Sự kiện sẽ bắt đầu sau" (VN) or "The event starts in" (EN), and page-load animations trigger.

### UI Components (US1)

- [x] T007 [P] [US1] Create `DigitCard` component: glassmorphism card with CardBg div (`opacity-50`, `rounded-xl`, gradient bg `linear-gradient(180deg, #FFF 0%, rgba(255,255,255,0.10) 100%)`, `border-[0.75px] border-gold-primary`, `backdrop-blur-[25px]` + `-webkit-backdrop-filter`) and Digit span (`absolute inset-0 flex items-center justify-center`, `font-[family-name:var(--font-digital)]`, `text-white`). Props: `digit: string`. Fixed dimensions per breakpoint: mobile `w-[52px] h-[83px]`, tablet `sm:w-[64px] sm:h-[102px]`, desktop `lg:w-[77px] lg:h-[123px]`. | src/components/prelaunch/DigitCard.tsx
- [x] T008 [P] [US1] Write `DigitCard` unit tests: (1) renders digit text, (2) glassmorphism styles applied (opacity-50 on CardBg, not parent), (3) fixed dimensions prevent layout shift | src/__tests__/prelaunch/DigitCard.test.tsx
- [x] T009 [US1] Create `TimeUnit` component: flex-col container with DigitCardsRow (two `DigitCard` components for tens/ones) and localized label span. Props: `value: string` (zero-padded 2-digit), `label: string`. Split `value` into individual digits for each DigitCard. Desktop styles: `w-[175px] items-start gap-[21px]`, digit row `gap-[21px]`. Label: `font-[family-name:var(--font-montserrat)] font-bold text-white uppercase`. Mobile-first responsive per design-style.md. | src/components/prelaunch/TimeUnit.tsx
- [x] T010 [US1] Create `CountdownPrelaunchPage` client component (`"use client"`): (A) page container `relative w-full min-h-screen bg-page-bg overflow-hidden`, (B) `next/image` background with `fill`, `priority`, `sizes="100vw"`, `aria-hidden="true"`, `z-0`, (C) gradient overlay div `absolute inset-0 z-[1] bg-[linear-gradient(18deg,#00101A_15.48%,rgba(0,18,29,0.46)_52.13%,rgba(0,19,32,0)_63.41%)]`, (D) content `<main>` with `relative z-[2] flex flex-col items-center justify-center min-h-screen gap-6`, (E) title `<h1>` with `font-bold italic font-[family-name:var(--font-montserrat)] text-white text-center`, (F) countdown row with 3 `TimeUnit` components. Props: `targetDate: Date | string`, `backgroundImageSrc: string`, `onComplete?: () => void`. Use `useLocale().t.prelaunch` for title and labels. | src/components/prelaunch/CountdownPrelaunchPage.tsx

### Countdown Wiring (US1)

- [x] T011 [US1] Wire `useCountdown({ targetDate, intervalMs: 1000 })` into `CountdownPrelaunchPage`. Map hook's `days`/`hours`/`minutes` string values to `TimeUnit` components. Verify countdown updates every second internally and displays minute-level changes promptly. | src/components/prelaunch/CountdownPrelaunchPage.tsx
- [x] T012 [US1] Implement page-load entrance animations (FR-010): background image `animate-[fadeIn_500ms_ease-in_forwards]` (opacity 0→1), content `animate-[fadeUp_600ms_ease-out_forwards]` (opacity 0→1, translateY 20px→0). Define `@keyframes fadeIn` and `@keyframes fadeUp` in component or globals.css. Use `animation-fill-mode: forwards` with initial `opacity-0`. | src/components/prelaunch/CountdownPrelaunchPage.tsx

### Route & Integration (US1)

- [x] T013 [US1] Create `page.tsx` server component: read `process.env.NEXT_PUBLIC_EVENT_DATETIME`, render `<CountdownPrelaunchPage targetDate={targetDate} backgroundImageSrc="/images/prelaunch-bg.png" />`. Add page metadata (`title: "Countdown | Sun* Annual Awards 2025"`). | src/app/prelaunch/page.tsx
- [x] T014 [US1] Write integration tests: (1) renders countdown with correct days/hours/minutes for future target date (use `vi.useFakeTimers`), (2) displays localized title "Sự kiện sẽ bắt đầu sau" in VN locale, (3) displays "The event starts in" in EN locale, (4) localized labels "NGÀY"/"GIỜ"/"PHÚT" (VN) and "DAYS"/"HOURS"/"MINUTES" (EN), (5) background image has `aria-hidden="true"`, (6) updates displayed values when minute boundary crosses (advance timer by 60s). Use `renderWithProviders` from `src/__tests__/test-utils.tsx`. | src/__tests__/prelaunch/CountdownPrelaunchPage.test.tsx

**Checkpoint**: User Story 1 complete — page displays live countdown at `/prelaunch` with correct values, localized text, and entrance animations. Independently testable.

---

## Phase 4: User Story 2 — Countdown Reaches Zero (Priority: P1)

**Goal**: When countdown expires, the system displays "00" for all units and redirects to Homepage SAA. If already expired on page load, redirect fires on the first tick (not during render).

**Independent Test**: Set `NEXT_PUBLIC_EVENT_DATETIME` to a past date → verify page shows 00/00/00 and `router.push('/')` is called. Set to 1 second in the future → verify countdown reaches zero and redirects.

### Expiry Logic (US2)

- [x] T015 [US2] Implement `onComplete` in `CountdownPrelaunchPage`: create internal callback using `useRouter().push('/')`, pass to `useCountdown({ ..., onComplete })`. When `isExpired` is true, display "00" for all units. Ensure `onComplete` fires on first tick if already expired (per `useRef` guard in hook). | src/components/prelaunch/CountdownPrelaunchPage.tsx
- [x] T016 [US2] Implement digit transition animation in `DigitCard`: add `previousDigit` tracking via `useRef`. When `digit !== previousDigit`, apply CSS animation `animate-[digitChange_300ms_ease-in-out]` (opacity 0→1, translateY -10px→0). Reset animation via `onAnimationEnd` or key change. Define `@keyframes digitChange`. | src/components/prelaunch/DigitCard.tsx

### Tests (US2)

- [x] T017 [US2] Write expiry tests: (1) displays 00/00/00 when target date is in the past, (2) calls `router.push('/')` when countdown reaches zero (advance timer), (3) calls `router.push('/')` on mount if already expired (first tick, not render), (4) does not error when external `onComplete` prop is not provided, (5) `onComplete` fires exactly once (not repeatedly). | src/__tests__/prelaunch/CountdownPrelaunchPage.test.tsx

**Checkpoint**: User Stories 1 & 2 complete — full countdown functionality with expiry redirect.

---

## Phase 5: User Story 3 — Responsive Display Across Devices (Priority: P2)

**Goal**: Countdown page renders correctly on mobile (< 640px), tablet (640-1023px), and desktop (>= 1024px) without horizontal scrolling.

**Independent Test**: Load `/prelaunch` at 375px, 768px, and 1512px viewports → verify layout adapts per design-style.md responsive specifications.

### Responsive Implementation (US3)

- [x] T018 [US3] Apply mobile-first responsive styles to `CountdownPrelaunchPage`: content padding base `py-6 px-4` → `sm:py-12 sm:px-12` → `lg:py-24 lg:px-36`. Title base `text-xl leading-7` → `sm:text-[28px] sm:leading-9` → `lg:text-[36px] lg:leading-[48px]`. Countdown row base `flex-wrap gap-6 justify-center` → `sm:gap-10 sm:flex-nowrap` → `lg:gap-[60px]`. | src/components/prelaunch/CountdownPrelaunchPage.tsx
- [x] T019 [US3] Apply mobile-first responsive styles to `TimeUnit` and `DigitCard`: TimeUnit base `w-auto items-center gap-3` → `sm:gap-4` → `lg:w-[175px] lg:items-start lg:gap-[21px]`. DigitCard already has responsive dims from T007. Digit text base `text-[50px]` → `sm:text-[61px]` → `lg:text-[73.73px]`. Unit label base `text-xl leading-7` → `sm:text-[28px] sm:leading-9` → `lg:text-[36px] lg:leading-[48px]`. Digit cards row gap base `gap-3` → `lg:gap-[21px]`. | src/components/prelaunch/TimeUnit.tsx

**Checkpoint**: User Stories 1, 2, & 3 complete — fully responsive countdown page.

---

## Phase 6: User Story 4 — Accessibility & Polish (Priority: P3)

**Purpose**: WCAG AA compliance, edge case handling, and final refinements

### Accessibility (US4)

- [x] T020 [US4] Add accessibility attributes: `role="timer"` and `aria-live="polite"` on countdown row div, dynamically computed `aria-label` (e.g., `"0 days, 5 hours, 20 minutes"` — localized), `aria-hidden="true"` on gradient overlay div. Verify background image already has `aria-hidden` from T010. | src/components/prelaunch/CountdownPrelaunchPage.tsx
- [x] T021 [US4] Write accessibility tests: (1) countdown container has `role="timer"`, (2) countdown container has `aria-live="polite"`, (3) background image has `aria-hidden="true"`, (4) `aria-label` contains time values | src/__tests__/prelaunch/CountdownPrelaunchPage.test.tsx

### Edge Cases & Polish

- [x] T022 [P] Handle edge case: invalid/missing `targetDate` — display "00" for all units, log `console.warn` in development mode. Test: pass empty string and invalid date string to hook. | src/hooks/useCountdown.ts
- [x] T023 [P] Handle edge case: content overflow on screens < 320px — add `min-[0px]:max-[319px]:overflow-y-auto` or equivalent conditional on outer container to prevent clipping | src/components/prelaunch/CountdownPrelaunchPage.tsx
- [x] T024 Final validation: run `yarn lint` and `yarn test` — all must pass with zero errors. Verify page renders at `/prelaunch` in dev server with `make dev`. | (project-wide)

**Checkpoint**: All user stories complete — production-ready countdown prelaunch page.

---

## Dependencies & Execution Order

### Phase Dependencies

```
Phase 1 (Setup) ──► Phase 2 (Foundation) ──► Phase 3 (US1 🎯 MVP)
                                               │
                                               ▼
                                          Phase 4 (US2)
                                               │
                                               ▼
                                          Phase 5 (US3)
                                               │
                                               ▼
                                          Phase 6 (US4 + Polish)
```

- **Phase 1 (Setup)**: No dependencies — start immediately
- **Phase 2 (Foundation)**: Depends on Phase 1 — BLOCKS all user stories
- **Phase 3 (US1)**: Depends on Phase 2 — **this is the MVP**
- **Phase 4 (US2)**: Depends on Phase 3 (extends CountdownPrelaunchPage)
- **Phase 5 (US3)**: Depends on Phase 3 (adds responsive styles to existing components)
- **Phase 6 (US4 + Polish)**: Depends on Phase 3 (can start after US1, but best after US2)

### Within Each Phase — Parallel Opportunities

**Phase 2**: T005 + T006 (locale files) can run in parallel with each other and after T003
**Phase 3**: T007 + T008 (DigitCard + tests) can run in parallel; T009 depends on T007; T010-T014 are sequential
**Phase 4**: T015 + T016 can run in parallel (different files); T017 depends on both
**Phase 5**: T018 + T019 can run in parallel (different files)
**Phase 6**: T020-T023 can run in parallel (different files/concerns)

### Cross-Story Parallelization

If multiple developers are available:
- **Dev A**: Phase 3 (US1) → Phase 4 (US2)
- **Dev B**: After Phase 2, can prepare responsive tokens or test infrastructure
- After Phase 3 checkpoint: US3, US4 can proceed in parallel

---

## Implementation Strategy

### MVP First (Recommended)

1. Complete Phase 1 + 2 (Setup + Foundation)
2. Complete Phase 3 (US1 — live countdown displays correctly)
3. **STOP and VALIDATE**: Visit `/prelaunch` — countdown works with correct values and animations
4. Deploy if ready — users can see the countdown

### Incremental Delivery

1. Phase 1 + 2 → Foundation ready
2. Phase 3 (US1) → Test → **MVP deployed**
3. Phase 4 (US2) → Test → Expiry redirect works
4. Phase 5 (US3) → Test → Responsive on all devices
5. Phase 6 (US4) → Test → Accessible and polished

---

## Notes

- Constitution mandates TDD (Red-Green-Refactor). Write tests before or alongside implementation — tests are included in each phase.
- Commit after each completed task or logical group (e.g., T007+T008 together as "feat(prelaunch): add DigitCard component with tests").
- The existing homepage `CountdownTimer` (`src/components/homepage/CountdownTimer.tsx`) must continue to work after the hook refactor in T003. T004 includes regression tests for this.
- Font usage pattern: `font-[family-name:var(--font-digital)]` for Digital Numbers, `font-[family-name:var(--font-montserrat)]` for Montserrat (established pattern in existing `CountdownTimer`).
- Background image path is hardcoded to `/images/prelaunch-bg.png` in `page.tsx`. The `backgroundImageSrc` prop allows flexibility for testing with different images.
- Responsive styles use mobile-first approach: base classes for mobile, `sm:` for tablet, `lg:` for desktop — per constitution breakpoints.
