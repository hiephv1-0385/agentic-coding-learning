# Implementation Plan: Open Secret Box (Chưa Mở)

**Frame**: `1466:7676-open-secret-box-chua-mo`
**Date**: 2026-03-16
**Spec**: `specs/1466_7676-open-secret-box-chua-mo/spec.md`

---

## Summary

Build a centered modal dialog that lets authenticated users open their mystery reward secret boxes to receive collection badges. The modal shows the unopened gift box, a "click to open" instruction, and a zero-padded box counter. Clicking the box triggers a server-side API call that atomically assigns a random badge (weighted probability) and decrements the remaining count. The implementation reuses the existing `RulesPanel.tsx` modal pattern (backdrop, focus trap, body scroll lock, animation transitions) and extends the existing `SecretBoxButton.tsx` to open this modal instead of directly calling the API.

---

## Technical Context

**Language/Framework**: TypeScript / Next.js 15.x (App Router) with React 19.x
**Primary Dependencies**: React, TailwindCSS 4.x, Supabase Client SDK, next/image
**Database**: PostgreSQL via Supabase (RLS enabled)
**Testing**: Vitest + React Testing Library
**State Management**: React useState/useCallback (local component state)
**API Style**: REST (Next.js Route Handlers)

---

## Constitution Compliance Check

*GATE: Must pass before implementation can begin*

| Constitution Rule | Requirement | Plan Status | Notes |
|-------------------|-------------|-------------|-------|
| I. Clean Code | TypeScript strict mode, one component per file, `@/*` imports | ✅ Compliant | `SecretBoxModal.tsx` is a single focused component |
| I. Clean Code | `PascalCase.tsx` components, `camelCase.ts` hooks | ✅ Compliant | `SecretBoxModal.tsx`, no new hooks needed |
| II. Responsive Design | 3 breakpoints (mobile < 640, tablet 640-1024, desktop ≥ 1024) | ✅ Compliant | design-style.md has responsive specs |
| II. Responsive Design | Touch targets ≥ 44x44px on mobile | ✅ Compliant | Close button (19px icon) needs 44px touch target wrapper |
| II. Responsive Design | `next/image` for all images | ✅ Compliant | Gift box + sparkle use `<Image>` |
| III. TDD | Red-Green-Refactor, integration tests for happy path + errors | ✅ Planned | Phase 6 covers tests; TDD order in tasks |
| III. TDD | Test files in `__tests__/` adjacent to code | ✅ Compliant | `src/__tests__/components/kudos/` (existing pattern) |
| III. TDD | Mock external services at boundary only | ✅ Compliant | Mock `fetch`, not internal modules |
| IV. Security | Server-side auth verification | ✅ Compliant | Existing route checks `supabase.auth.getUser()` |
| IV. Security | Server-side input validation | ✅ Compliant | Remaining count validated server-side |
| IV. Security | No secrets in client code | ✅ Compliant | Randomization is server-side only |
| V. Next.js | Server Components by default, `"use client"` only when needed | ✅ Compliant | Modal needs `"use client"` (state/events); `StatsCard` stays Server Component |
| V. Next.js | Data fetching in Server Components, avoid `useEffect` for data | ✅ Compliant | Initial count from Server Component prop; updates via API response |
| V. Supabase | RLS enabled on all tables | ✅ Planned | New `user_badges` table will have RLS |
| V. TailwindCSS | Utility classes exclusively, no custom CSS | ✅ Compliant | All styling via Tailwind classes |
| V. Cloudflare | No Node.js native modules | ✅ Compliant | Uses Web Crypto API (`crypto.getRandomValues`) for randomization |

**Violations**: None identified.

---

## Architecture Decisions

### Frontend Approach

- **Component Structure**: Single `SecretBoxModal.tsx` client component in `src/components/kudos/`, following the `RulesPanel.tsx` pattern (backdrop + panel, animation with `isVisible` state, focus trap, Escape key handling)
- **Styling Strategy**: Tailwind utility classes with design tokens from `design-style.md` (rounded pixel values). Font class pattern: `font-[family-name:var(--font-montserrat)]` (project convention, NOT `font-montserrat`)
- **Data Fetching**: Initial box count passed as prop from `StatsCard.tsx` (Server Component) → `SecretBoxButton.tsx` → `SecretBoxModal.tsx`. After each box open, count is updated from the `POST /api/users/me/secret-box` API response. On modal close (if boxes were opened), trigger `router.refresh()` to revalidate the Server Component data in `StatsCard`.
- **State**: Local `useState` for `isVisible`, `isOpening`, `remainingBoxes` (initialized from prop, updated from API response); no global state needed

### Backend Approach

- **API Design**: Enhance existing `POST /api/users/me/secret-box` route to add badge assignment with weighted random selection
- **Data Access**: Direct Supabase SDK queries (existing pattern)
- **Validation**: Server-side auth check (existing), remaining box count validation (existing), atomic badge assignment (new)
- **Atomicity Strategy**: Sequential Supabase operations (increment `opened_count` → insert `user_badges`) with error rollback. If `user_badges` insert fails after count increment, decrement count back. An RPC function is preferred but optional — sequential operations are acceptable given the low-concurrency nature of this feature and existing pattern in `route.ts`. If race conditions become an issue, migrate to a Supabase RPC (`open_secret_box` PostgreSQL function) that does both in a single transaction.
- **Badge Randomization**: Weighted probability using Web Crypto API (`crypto.getRandomValues` — Cloudflare Workers compatible). Algorithm: generate random float 0-1, iterate cumulative probability thresholds. Probabilities: Stay Gold 30%, Flow to Horizon 25%, Touch of Light 20%, Beyond the Boundary 10%, Revival 10%, Root Further 5%
- **API Response Change**: Current response `{ data: { opened_count, remaining } }` → Enhanced to `{ data: { opened_count, remaining, badge_type } }` where `badge_type` is the assigned badge string (e.g., `"STAY_GOLD"`)

### Database Changes

- **New table**: `user_badges` — stores individual badges each user has collected from opening secret boxes
  - Columns: `id UUID PK DEFAULT gen_random_uuid()`, `user_id UUID NOT NULL FK→profiles ON DELETE CASCADE`, `badge_type TEXT NOT NULL`, `created_at TIMESTAMPTZ NOT NULL DEFAULT now()`
  - Index: `idx_user_badges_user_id ON user_badges(user_id)`
  - RLS enabled: users can read their own badges (`user_id = auth.uid()`)
  - No FK to `secret_boxes` — the `secret_boxes` table tracks aggregate counts (one row per user), not individual boxes
- **New migration**: `00003_create_user_badges.sql`
- **Badge types** (TEXT values, not enum — simpler for Supabase): `REVIVAL`, `TOUCH_OF_LIGHT`, `STAY_GOLD`, `FLOW_TO_HORIZON`, `BEYOND_THE_BOUNDARY`, `ROOT_FURTHER`
- **CHECK constraint**: `badge_type IN ('REVIVAL', 'TOUCH_OF_LIGHT', 'STAY_GOLD', 'FLOW_TO_HORIZON', 'BEYOND_THE_BOUNDARY', 'ROOT_FURTHER')`

### Integration Points

- **Existing Services**: Supabase Auth (user session), Supabase Database (secret_boxes table)
- **Shared Components**: `<Icon>` (close button), `<Toast>` (error messages), `useLocale` (i18n)
- **Trigger**: `SecretBoxButton.tsx` — will be modified to open the modal instead of directly calling the API
- **Modal Pattern**: `RulesPanel.tsx` — backdrop overlay, focus trap, body scroll lock, animation transitions

---

## Project Structure

### Documentation (this feature)

```text
.momorph/specs/1466_7676-open-secret-box-chua-mo/
├── spec.md              # Feature specification ✅
├── design-style.md      # Visual specifications ✅
├── plan.md              # This file
├── tasks.md             # Task breakdown (next step)
└── assets/              # Screenshots
```

### Source Code (affected areas)

```text
# New Files
src/components/kudos/SecretBoxModal.tsx       # Modal component (unopened state)
supabase/migrations/00003_create_user_badges.sql  # Badge assignment table
src/__tests__/components/kudos/SecretBoxModal.test.tsx  # Component tests

# Modified Files
src/components/kudos/SecretBoxButton.tsx      # Remove direct API call, add isModalOpen state, render SecretBoxModal, call router.refresh() on close if boxes were opened
src/app/api/users/me/secret-box/route.ts     # Add weighted random badge selection, insert into user_badges, return badge_type in response
src/locales/en.ts                            # Add secretBox.modalTitle, secretBox.instruction, secretBox.counterLabel keys
src/locales/vi.ts                            # Add Vietnamese translations for modal keys
```

---

## Implementation Strategy

### Phase Breakdown

#### Phase 0: Asset Preparation
- Export gift box media assets from Figma:
  - `public/images/secret-box/gift-box-unopened.png` — "box quà chưa mở" (Node 1466:7686)
  - `public/images/secret-box/sparkle-effect.png` — "hiệu ứng box quà" (Node 1466:7685)
- Verify assets are properly sized and optimized

#### Phase 1: Database & API Foundation
- Create `user_badges` migration with RLS policies (see Database Changes section for schema)
- Enhance `POST /api/users/me/secret-box` route:
  - Add weighted random badge selection using `crypto.getRandomValues()` + cumulative probability thresholds
  - After incrementing `opened_count` (existing logic), insert badge into `user_badges` table
  - If `user_badges` insert fails, decrement `opened_count` back (rollback — see Atomicity Strategy in Architecture Decisions)
  - Return assigned badge type in response: `{ data: { opened_count, remaining, badge_type } }`
  - Store badge probability constants as a `BADGE_PROBABILITIES` array in the route file (not client-side)

#### Phase 2: i18n Setup
- Add translation keys to both locale files:
  - `secretBox.modalTitle`: "KHÁM PHÁ SECRET BOX CỦA BẠN"
  - `secretBox.instruction`: "Click vào box để mở"
  - `secretBox.counterLabel`: "Secretbox chưa mở"
  - (and corresponding Vietnamese translations)

#### Phase 3: Core UI — SecretBoxModal (US1 + US2 + US3)
- Create `SecretBoxModal.tsx` following `RulesPanel.tsx` modal pattern:
  - Backdrop overlay: `fixed inset-0 z-40 bg-[rgba(0,16,26,0.7)]`
  - Modal container: centered viewport, `bg-[#00101A]`, `rounded-xl`, flex-col
  - Title bar with close button (`<Icon name="close" size={19} />`)
  - Separator lines (`h-px bg-[#2E3940]`)
  - Instruction text (hidden when count = 0)
  - Gift box image area with sparkle overlay (`next/image`, aspect-square)
  - Box counter (label + zero-padded number)
  - Focus trap, Escape key, body scroll lock
  - Open/close animations (opacity + scale, 300ms/200ms)
- Gift box clickable area: wrap the `<Image>` in a `<button>` element (not `<div onClick>`) to get native keyboard operability (Enter/Space) and correct semantics. The `<button>` should have `aria-label` describing the action (e.g., "Open secret box").
- Gift box interaction states (from design-style.md):
  - Default: `cursor-pointer, opacity-1`
  - Hover: `scale(1.03)`, transition 200ms ease-out
  - Active (clicking): `scale(0.98)` (press feedback)
  - Disabled (count = 0): `opacity-0.5 cursor-not-allowed pointer-events-none`
  - Loading (API in-flight): `opacity-0.7 cursor-wait`; disable further clicks
- ARIA attributes for modal container: `role="dialog"`, `aria-modal="true"`, `aria-label={t.secretBox.modalTitle}` (follows `RulesPanel.tsx` pattern which uses `aria-label`, not `aria-labelledby`)
- API integration: call `POST /api/users/me/secret-box` on box click
- Optimistic count decrement with server confirmation
- Error handling: show Toast on API failure, allow retry

#### Phase 4: Integration — SecretBoxButton Modification
- Modify `SecretBoxButton.tsx`:
  - Remove the `handleOpen` async function that directly calls `POST /api/users/me/secret-box`
  - Remove `isOpening` and `toastMessage` state (these move to the modal)
  - Add `isModalOpen` state (boolean)
  - Button `onClick` now sets `isModalOpen = true` (instead of calling API)
  - Render `<SecretBoxModal isOpen={isModalOpen} remainingBoxes={remainingBoxes} onClose={handleClose} />`
  - `handleClose` callback: sets `isModalOpen = false`, then calls `router.refresh()` to revalidate the parent `StatsCard` Server Component data (ensures box count and stats are fresh after opening boxes)
  - Import `useRouter` from `next/navigation` for `router.refresh()`
  - Note: `StatsCard.tsx` (Server Component) does NOT need code changes — `router.refresh()` triggers re-render of all Server Components on the page, which re-fetches `secret_boxes` count

#### Phase 5: Sequential Opens (US4)
- After successful box open, if remaining > 0:
  - Reset to unopened state with updated count
  - Re-enable gift box click
- If remaining = 0 after open:
  - Show empty state (instruction hidden, box disabled, count "00")

#### Phase 6: Testing & Polish
- Unit tests for `SecretBoxModal`:
  - Renders with correct count display
  - Hides instruction when count = 0
  - Disables box click when count = 0
  - Calls API on box click
  - Closes on backdrop click, Escape key, close button
  - Decrements count after successful open
- Integration test for API route:
  - Returns badge type in response
  - Correctly decrements count
  - Returns error when no boxes remaining
- Accessibility: verify ARIA attributes, keyboard navigation, focus management
- Responsive: verify mobile/tablet/desktop breakpoints

### Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Gift box assets not exported from Figma | High | High | Use placeholder images initially; spec notes assets must be manually exported. Assets go in `public/images/secret-box/` |
| Badge assignment not atomic (race condition) | Low | High | Use sequential Supabase operations with manual rollback; upgrade to RPC if issues arise. Low concurrency expected for this feature |
| "Opened" state frame not yet specified | Medium | Medium | This spec covers only "unopened" state; after box click, show simple badge name/icon as temporary reveal until companion spec is created |
| Montserrat font not loaded | Low | Low | ✅ Confirmed: font is loaded in `src/app/layout.tsx` via `next/font/google` as `--font-montserrat` CSS variable. Use `font-[family-name:var(--font-montserrat)]` class (NOT `font-montserrat`) |
| `router.refresh()` causes full page re-render | Low | Low | Only called on modal close, not during sequential opens. User won't notice since modal is closing anyway |
| Stale box count on modal open | Low | Low | Count comes from Server Component prop (set at page load). If user stays on page a long time before opening modal, count could be stale. Acceptable because: (1) once any box is opened, count updates from API response; (2) server validates remaining > 0 before allowing open; (3) router.refresh() on close keeps data fresh for next open. Spec says "fetch fresh count on modal open" — this is achieved implicitly through router.refresh() on previous close, and server-side validation prevents any actual error. |

### Estimated Complexity

- **Frontend**: Medium (modal with animations, states, responsive design)
- **Backend**: Low-Medium (weighted random + DB insert in existing route)
- **Testing**: Medium (multiple interaction states, accessibility checks)

---

## Integration Testing Strategy

### Test Scope

- [x] **Component/Module interactions**: SecretBoxButton → SecretBoxModal → API call → count update
- [x] **External dependencies**: Supabase Auth (mocked), API route handler
- [x] **Data layer**: secret_boxes read/update, user_badges insert
- [x] **User workflows**: Open modal → click box → see count decrement → open another or close

### Test Categories

| Category | Applicable? | Key Scenarios |
|----------|-------------|---------------|
| UI ↔ Logic | Yes | Box click triggers API, count updates, state transitions |
| App ↔ External API | Yes | POST /api/users/me/secret-box response handling |
| App ↔ Data Layer | Yes | secret_boxes read, user_badges insert |
| Cross-platform | Yes | Responsive modal at mobile/tablet/desktop |

### Test Environment

- **Environment type**: Local (Vitest + jsdom)
- **Test data strategy**: Mock Supabase responses, fixture data for box counts
- **Isolation approach**: Fresh component mount per test, mocked fetch

### Mocking Strategy

| Dependency Type | Strategy | Rationale |
|-----------------|----------|-----------|
| Supabase Auth | Mock | Tests run without real auth |
| API route (fetch) | Mock | Isolate component behavior from server |
| next/image | Mock | Standard Next.js testing practice |
| useLocale | Mock | Provide stable translation strings |

### Test Scenarios Outline

1. **Happy Path**
   - [x] Modal opens with correct count and instruction text
   - [x] Clicking gift box calls API and decrements count
   - [x] Sequential opens work when remaining > 0

2. **Error Handling**
   - [x] API error shows toast and preserves count
   - [x] Disabled state prevents clicks when count = 0

3. **Edge Cases**
   - [x] Count displays "00" for zero boxes
   - [x] Modal closes via X button, backdrop, Escape key
   - [x] Loading state prevents double-click

### Tooling & Framework

- **Test framework**: Vitest + React Testing Library
- **Supporting tools**: msw or manual fetch mock for API
- **CI integration**: Runs with existing `vitest` config

### Coverage Goals

| Area | Target | Priority |
|------|--------|----------|
| Core modal interactions (open/close/click) | 90%+ | High |
| API integration & error handling | 85%+ | High |
| Accessibility (ARIA, focus trap) | 80%+ | Medium |
| Responsive behavior | 70%+ | Low |

---

## Dependencies & Prerequisites

### Required Before Start

- [x] `constitution.md` reviewed and understood
- [x] `spec.md` approved (Status: Reviewed, 4 passes)
- [x] `design-style.md` complete with all visual specs
- [ ] Gift box media assets exported from Figma ("box quà chưa mở", "hiệu ứng box quà")
- [x] Montserrat font confirmed in `src/app/layout.tsx` (loaded via `next/font/google`, variable `--font-montserrat`)

### External Dependencies

- Supabase database access (for migration)
- Figma asset export (manual — MoMorph API returned 404/rate-limited for media files)

---

## Next Steps

After plan approval:

1. **Run** `/momorph.tasks` to generate task breakdown from this plan
2. **Review** tasks.md for parallelization opportunities
3. **Export** gift box assets from Figma (manual step)
4. **Begin** implementation following task order

---

## Notes

- The "opened" state / badge reveal animation is **out of scope** for this plan (separate frame, not yet specified). After clicking the box, the implementation should show a minimal reveal (badge type name) until the companion spec is created.
- The existing API route at `src/app/api/users/me/secret-box/route.ts` only increments `opened_count` — it does NOT assign badges. This plan includes enhancing it with weighted random badge selection and `user_badges` table insertion.
- The `SecretBoxButton.tsx` currently calls the API directly and shows a toast. This plan changes it to open the modal instead, moving the API call inside the modal's box-click handler.
- **Parent component chain**: `StatsCard.tsx` (Server Component, fetches data) → `SecretBoxButton.tsx` (Client Component, receives `remainingBoxes` prop) → `SecretBoxModal.tsx` (Client Component, receives prop). The modal manages its own local `remainingBoxes` state (initialized from prop, updated from API response). On modal close, `router.refresh()` triggers `StatsCard` to re-fetch server data.
- Badge probability percentages should be stored as constants in the API route (or a config), not hardcoded in the client, per FR-003 and spec notes.
- The Close icon must use `<Icon name="close" size={19} />` — the same component used across the application (Component ID 214:3851).
- Box count is formatted as zero-padded 2 digits: `String(count).padStart(2, '0')`. For counts > 99, allow dynamic width gracefully.
- **Font class pattern**: The project uses `font-[family-name:var(--font-montserrat)]` (CSS variable reference), NOT `font-montserrat`. See `src/app/not-found.tsx`, `src/app/error.tsx`, `src/app/awards/page.tsx` for examples.
- **Existing stats API**: `GET /api/users/me/stats` already returns `secret_boxes_opened` and `secret_boxes_remaining` — could be used for modal refresh, but `router.refresh()` (re-running Server Component) is simpler and more consistent.
- **Network offline state (spec Loading & Error States)**: The spec says "Disable gift box click; show connectivity warning" when offline. **De-scoped for initial implementation** — there is no existing offline detection pattern in the codebase (`navigator.onLine` is not used anywhere). The API error handling (Toast on failure, allow retry) covers the practical case. If offline detection is needed later, it can be added as an enhancement.
- **"Loading box count" state (spec Loading & Error States)**: The spec says "Show skeleton/placeholder for counter area" while loading count. **Not applicable** — count arrives as a prop from the parent `StatsCard` Server Component, so it's always available when the modal renders. No async loading needed for the count itself.
