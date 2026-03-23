# Tasks: Login Screen

**Frame**: `662:14387` — Login
**Prerequisites**: plan.md (required), spec.md (required), design-style.md (required)

---

## Task Format

```
- [ ] T### [P?] [Story?] Description | file/path.ts
```

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this belongs to (US1, US2, US3)
- **|**: File path affected by this task

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Add design tokens and create standalone assets needed across components

- [x] T001 Add 3 new color tokens (`--color-text-cream`, `--color-footer-border`, `--color-error-text`) to `@theme inline` | src/app/globals.css
- [x] T002 [P] Create GoogleIcon standalone component with 4-color Google "G" inline SVG (blue #4285F4, red #EA4335, yellow #FBBC05, green #34A853) | src/components/auth/GoogleIcon.tsx

---

## Phase 2: Foundation (Blocking Prerequisites)

**Purpose**: Core auth infrastructure required before UI — callback route, redirect validation, middleware

**⚠️ CRITICAL**: No user story UI work can begin until this phase is complete

- [x] T003 [P] Create shared Zod redirect validation utility (must start with `/`, no `://`, no `//`) | src/utils/validateRedirect.ts
- [x] T004 [P] Create OAuth callback route handler — code exchange, error/cancel handling (`access_denied` → silent redirect), redirect validation | src/app/auth/callback/route.ts
- [x] T005 Update middleware with protected route matching (`/kudos`, `/kudos/*`), authenticated user redirect from `/login`, cookie propagation on redirect responses, redirect param validation | src/middleware.ts

**Checkpoint**: Auth infrastructure ready — login page UI can now begin

---

## Phase 3: User Story 1 — Google OAuth Login (Priority: P1) 🎯 MVP

**Goal**: User can log in via Google OAuth, see loading/error states, and be redirected correctly

**Independent Test**: Click "LOGIN With Google" → redirected to Google OAuth → callback exchanges code → user lands on Homepage (`/`). Error states display correctly for auth failures and network errors.

### Frontend (US1)

- [x] T006 [P] [US1] Create LoginHeader server component — logo linked to `/` + LanguageSelector slot, responsive padding | src/components/auth/LoginHeader.tsx
- [x] T007 [P] [US1] Create LoginHero server component — ROOT FURTHER heading (SVN-Gotham, responsive sizes), description text, `children` slot for LoginButton | src/components/auth/LoginHero.tsx
- [x] T008 [P] [US1] Create LoginFooter server component — `<footer>` with border-top, centered copyright text | src/components/auth/LoginFooter.tsx
- [x] T009 [US1] Create LoginButton client component — Google OAuth trigger via `signInWithOAuth`, loading spinner, error display (`role="alert"`), conditional auto-dismiss (URL errors: 5s, network errors: persist), `aria-label`, `aria-live` for loading, URL cleanup via `replaceState` | src/components/auth/LoginButton.tsx
- [x] T010 [US1] Create Login page server component — `h-screen flex flex-col`, background image with gradient overlay (60% midpoint), await `searchParams` and pass `error`/`redirect` to LoginButton, compose Header → Hero(Button) → Footer | src/app/(auth)/login/page.tsx

### Tests (US1)

- [x] T011 [P] [US1] Write LoginButton integration tests — OAuth initiation, loading state, error display from URL params, auto-dismiss for URL errors only, network error persistence, URL cleanup | src/components/auth/__tests__/LoginButton.test.tsx
- [x] T012 [P] [US1] Write callback route tests — code exchange success/failure, error/cancel handling, redirect validation (open redirect prevention) | src/app/auth/callback/__tests__/route.test.ts
- [x] T013 [P] [US1] Write middleware tests — protected route redirect, login redirect for authenticated user, cookie propagation, redirect param validation | src/__tests__/middleware.test.ts
- [x] T014 [P] [US1] Write LoginPage render tests — component composition, searchParams passing | src/app/(auth)/login/__tests__/page.test.tsx

**Checkpoint**: User Story 1 complete — full Google OAuth login flow works end-to-end

---

## Phase 4: User Story 2 — Language Selection (Priority: P2)

**Goal**: User can switch between Vietnamese and English via a dropdown in the header

**Independent Test**: Click language selector → dropdown opens with VN/EN options → select language → UI text updates, preference persisted in cookie. Keyboard navigation works (Enter/Space/Arrow/Escape).

### Frontend (US2)

- [x] T015 [US2] Create LanguageSelector client component — dropdown with flag icons, VN/EN toggle, keyboard navigation (Enter/Space/Arrow/Escape), `aria-haspopup="listbox"`, `aria-expanded`, cookie persistence, click-outside close, hover/focus states | src/components/shared/LanguageSelector.tsx

### Tests (US2)

- [x] T016 [US2] Write LanguageSelector tests — dropdown toggle, keyboard nav, cookie persistence, click-outside close, Escape close | src/components/shared/__tests__/LanguageSelector.test.tsx

**Checkpoint**: User Stories 1 & 2 complete — login + language switching functional

---

## Phase 5: User Story 3 — Branding & Visual Experience (Priority: P3)

**Goal**: Login page renders the ROOT FURTHER branding correctly across all breakpoints

**Independent Test**: Page renders full key visual background, heading is prominent, description readable, button visible at all 3 breakpoints (mobile < 640px, tablet sm:, desktop lg:).

> Note: US3 visual structure is already implemented in Phase 3 (LoginHero, LoginPage background). This phase focuses on responsive fine-tuning and visual verification.

### Frontend (US3)

- [x] T017 [US3] Verify and adjust responsive layout for all 3 breakpoints — heading sizes (48px / 80px / 120px), padding values, button max-width (305px), content alignment per design-style.md layout diagrams | src/app/(auth)/login/page.tsx, src/components/auth/LoginHero.tsx

**Checkpoint**: All user stories complete — visual design matches Figma at all breakpoints

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Animations, accessibility audit, and final refinements

- [x] T018 [P] Add error message fade-in/fade-out CSS animation (opacity transition on appear/dismiss) | src/components/auth/LoginButton.tsx
- [x] T019 [P] Accessibility audit — verify focus indicators (gold outline), ARIA labels, screen reader announcements (`role="alert"`, `aria-live`), keyboard navigation across all interactive elements | All interactive components
- [x] T020 [P] Responsive verification — test all 3 breakpoints against design-style.md ASCII layout diagrams, verify touch targets ≥ 44px | All components
- [x] T021 Code cleanup — remove any TODO comments, verify imports use `@/*` aliases, ensure one component per file, final lint pass | All files

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundation (Phase 2)**: T003 (validateRedirect) should complete before T004 (callback) and T005 (middleware) since both import it. T004 and T005 can run in parallel after T003.
- **US1 (Phase 3)**: Depends on Phase 1 + Phase 2 completion. T006/T007/T008 can run in parallel (independent server components). T009 depends on T002 (GoogleIcon). T010 depends on T006-T009.
- **US2 (Phase 4)**: Can run in parallel with Phase 3 (independent component). However, T006 (LoginHeader) includes LanguageSelector slot — full integration requires T015.
- **US3 (Phase 5)**: Depends on Phase 3 completion (verifies existing UI)
- **Polish (Phase 6)**: Depends on all user stories being complete

### Parallel Opportunities

Within each phase, tasks marked `[P]` can run in parallel:

**Phase 1**: T001 ∥ T002
**Phase 2**: T003 first, then T004 ∥ T005
**Phase 3**: T006 ∥ T007 ∥ T008 (server components) → T009 → T010. Tests T011 ∥ T012 ∥ T013 ∥ T014 (after implementation)
**Phase 4**: T015 → T016
**Phase 6**: T018 ∥ T019 ∥ T020

---

## Implementation Strategy

### MVP First (Recommended)

1. Complete Phase 1 + 2 (Setup + Foundation)
2. Complete Phase 3 (US1: Google OAuth Login)
3. **STOP and VALIDATE**: Full login flow works — click button → Google OAuth → callback → redirect to homepage
4. Deploy if ready

### Incremental Delivery

1. Phase 1 + 2 → Auth infra ready
2. Phase 3 (US1) → Login flow works → Test → Deploy
3. Phase 4 (US2) → Language switching → Test → Deploy
4. Phase 5 + 6 (US3 + Polish) → Visual polish → Test → Deploy

---

## Notes

- Total tasks: **21**
- Tasks per user story: US1 = 9, US2 = 2, US3 = 1, Setup = 2, Foundation = 3, Polish = 4
- Parallel opportunities: 8 parallel groups identified across phases
- Independent test criteria defined for each user story phase
- Suggested MVP scope: Phase 1 + 2 + 3 (Setup + Foundation + US1) = 14 tasks
- All tasks follow checklist format: checkbox + ID + labels + file paths ✓
