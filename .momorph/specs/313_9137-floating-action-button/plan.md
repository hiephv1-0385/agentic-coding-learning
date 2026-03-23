# Implementation Plan: Floating Action Button (FAB)

**Frame**: `313_9137-floating-action-button`
**Date**: 2026-03-16
**Spec**: `specs/313_9137-floating-action-button/spec.md`

---

## Summary

Implement a persistent Floating Action Button (FAB) component visible on all authenticated pages. The FAB displays as a golden pill-shaped button in the bottom-right corner. Clicking expands it to reveal two labeled action buttons ("Thể lệ" → `/awards/rules`, "Viết KUDOS" → Kudo modal) and a red close button. Collapsing happens via close button, click outside, or Escape key.

The implementation leverages existing design tokens (`--color-gold-primary`, `--shadow-gold-glow`), the existing `Icon` component, and the existing `KudoModalWrapper` for modal integration. No backend API calls are needed — this is a purely client-side UI component.

---

## Technical Context

**Language/Framework**: TypeScript / Next.js 15.x (App Router)
**Primary Dependencies**: React 19.x, TailwindCSS 4.x
**Database**: N/A (no data persistence)
**Testing**: Vitest + React Testing Library
**State Management**: Local React state (`useState`)
**API Style**: N/A (client-side only)

---

## Constitution Compliance Check

*GATE: Must pass before implementation can begin*

- [x] Follows project coding conventions (TypeScript strict, PascalCase components, `@/*` imports)
- [x] Uses approved libraries and patterns (React state, TailwindCSS utilities, Icon component)
- [x] Adheres to folder structure guidelines (`src/components/ui/` or `src/components/shared/`)
- [x] Meets security requirements (no user input, no API calls, auth-gated visibility)
- [x] Follows testing standards (Vitest + RTL, integration tests for happy path + error scenarios)

**Violations**: None

---

## Architecture Decisions

### Frontend Approach

- **Component Structure**: Single `FloatingActionButton.tsx` Client Component with collapsed/expanded states managed via local `useState`. No need for separate atom/molecule decomposition — the component is self-contained and not reused elsewhere.
- **Styling Strategy**: TailwindCSS utility classes using existing design tokens from `globals.css`. Extend Tailwind theme with FAB-specific tokens only where existing tokens don't cover (e.g., close button red, expanded button radius).
- **Data Fetching**: None. The FAB is a purely presentational/navigational component.

### Key Design Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Component placement | Root layout (`src/app/layout.tsx`) | Must persist across all route changes per FR-001 |
| Auth-gating | Server Component wrapper passes `isAuthenticated` prop | Root layout (Server Component) calls `supabase.auth.getUser()` and passes result to FAB Client Component. FAB also checks `usePathname()` to hide on `/login`, `/prelaunch`. |
| Modal integration | Render `KudoModalWrapper` inside FAB component | Reuse existing modal pattern; FAB owns its own modal instance |
| Navigation to /awards/rules | `next/link` (`<Link>`) | Constitution mandates `next/link` for all internal navigation. "Thể lệ" renders as `<Link href="/awards/rules">` |
| Element semantics | Collapsed pill: `<button>`, "Thể lệ": `<Link>`, "Viết KUDOS": `<button>`, Close: `<button>` | Proper HTML semantics: buttons for actions, links for navigation |
| Icon implementation | Extend existing `Icon.tsx` with new icon names | Constitution mandates Icon Components, not SVG files/img tags |
| Click-outside detection | `useRef` + `useEffect` document click listener | Standard React pattern; no additional dependency needed |
| Route change collapse | `usePathname()` + `useEffect` | Auto-collapse expanded FAB when route changes (FR-010) |

### Existing Assets to Reuse

| Asset | Location | Usage |
|-------|----------|-------|
| `--color-gold-primary` (#FFEA9E) | `globals.css` | FAB pill & expanded button background |
| `--shadow-gold-glow` | `globals.css` | FAB elevation + golden glow shadow |
| `--color-page-bg` (#00101A) | `globals.css` | Text color for separator & labels |
| `Icon` component | `src/components/ui/Icon.tsx` | Pen icon (`pencil`), close icon (`close`) |
| `KudoModalWrapper` | `src/components/kudos/KudoModalWrapper.tsx` | Open Viet Kudo modal |
| Montserrat font | `src/app/layout.tsx` | "/" separator & expanded button labels |
| `animate-fade-in` | `globals.css` | Page-load entrance animation |
| `--font-montserrat` | `globals.css` | Font variable reference |

### New Assets Required

| Asset | Source | Destination | Notes |
|-------|--------|-------------|-------|
| Rules/Lightning icon (MM_MEDIA_LOGO) | Figma component `214:3752` | Add to `Icon.tsx` | New SVG path to add to icon map |

### Integration Points

- **Root Layout** (`src/app/layout.tsx`): Render FAB component here for global visibility
- **KudoModalWrapper** (`src/components/kudos/KudoModalWrapper.tsx`): Reuse for "Viết KUDOS" action
- **Middleware** (`src/middleware.ts`): Auth state determines FAB visibility
- **Next.js Router** (`usePathname`): Detect route changes for auto-collapse and route-based hiding

---

## Project Structure

### Documentation (this feature)

```text
.momorph/specs/313_9137-floating-action-button/
├── spec.md              # Feature specification ✅
├── design-style.md      # Design specifications ✅
├── plan.md              # This file ✅
├── tasks.md             # Task breakdown (next step)
└── assets/
    ├── frame.png        # Collapsed state screenshot ✅
    └── expanded.png     # Expanded state screenshot ✅
```

### Source Code (affected areas)

```text
src/
├── app/
│   ├── layout.tsx                          # MODIFY: Add <FloatingActionButton />
│   └── globals.css                         # MODIFY: Add FAB-specific tokens (close-bg, expanded radius)
├── components/
│   ├── shared/
│   │   └── FloatingActionButton.tsx        # CREATE: Main FAB component
│   └── ui/
│       └── Icon.tsx                        # MODIFY: Add 'rules' icon SVG path
└── __tests__/
    └── components/
        └── FloatingActionButton.test.tsx   # CREATE: Component tests
```

### New Files

| File | Purpose |
|------|---------|
| `src/components/shared/FloatingActionButton.tsx` | Main FAB Client Component (collapsed + expanded states) |
| `src/__tests__/components/FloatingActionButton.test.tsx` | Integration tests (render, expand, collapse, navigation) |

### Modified Files

| File | Changes |
|------|---------|
| `src/app/layout.tsx` | Import FAB, fetch user auth state via `supabase.auth.getUser()`, render `<FloatingActionButton isAuthenticated={!!user} />` in body |
| `src/app/globals.css` | Add `--color-fab-close-bg`, `--radius-fab-expanded` tokens |
| `src/components/ui/Icon.tsx` | Add `rules` icon SVG path (MM_MEDIA_LOGO from Figma) |

### Dependencies

No new packages required. All functionality is achievable with existing dependencies.

---

## Implementation Strategy

### Phase 0: Asset Preparation
- Download the rules/lightning icon SVG from Figma (component `214:3752`) using `get_media_files`
- Add the icon SVG path to `Icon.tsx` as a new `rules` icon name
- Add FAB-specific design tokens to `globals.css` (only values not already covered)

### Phase 1: Foundation — Collapsed State (US1 - P1)
- Create `FloatingActionButton.tsx` as a `"use client"` component
- Implement collapsed pill state: golden background, pen icon + "/" + rules icon
- Position with `fixed` at bottom-right corner with responsive breakpoints
- Apply golden glow shadow from existing `--shadow-gold-glow` token
- Add hover state: enhanced glow (`0 4px 8px rgba(0,0,0,0.35), 0 0 12px 2px #FAE287`) + `scale(1.03)`, 200ms ease-out
- Add page-load entrance animation: `animate-fade-in` (existing, 300ms)
- Render in root layout (`layout.tsx`)
- Gate visibility:
  - Root layout (Server Component) fetches user via `supabase.auth.getUser()` and passes `isAuthenticated` boolean prop to FAB
  - FAB Client Component also checks `usePathname()` and returns `null` for `/login`, `/prelaunch` routes
  - This avoids client-side auth calls and follows constitution: "Data fetching MUST happen in Server Components"

### Phase 2: Core Interaction — Expanded State (US2 - P1)
- Add `isExpanded` state toggle on pill click
- Implement expanded state: vertical stack of "Thể lệ" button, "Viết KUDOS" button, red close button
- Wire "Viết KUDOS" button to open `KudoModalWrapper`
- Wire "Thể lệ" as `<Link href="/awards/rules">` (constitution: `next/link` for all internal navigation)
- Implement collapse triggers: close button click, click outside (document listener), Escape key
- Add route change auto-collapse via `usePathname()` + `useEffect`
- Animations (from design-style.md):
  - Collapsed → Expanded: pill opacity 0 + scale(0.8), menu opacity 1 + translateY(0), 250ms ease-out
  - Expanded → Collapsed: menu opacity 0 + translateY(10px), pill opacity 1 + scale(1), 200ms ease-in
  - Expanded button hover: background-color 150ms ease-in-out

### Phase 3: Polish — Accessibility & Edge Cases (US3 - P2)
- Add `aria-label`, `role="button"`, `aria-expanded` attributes
- Implement keyboard navigation: Tab focus, Enter/Space to expand, Tab between options
- Add focus visible indicators (`outline: 2px solid #FAE287`)
- Handle edge case: FAB tracks its own `isModalOpen` state; "Viết KUDOS" click checks this before opening. When modal closes, reset state.
- Verify z-index layering: FAB at z-50, modal overlay (`fixed inset-0 z-50`) naturally covers FAB. Collapse FAB before opening modal to avoid visual conflict.

### Phase 4: Testing
- Write integration tests with React Testing Library:
  - Renders in collapsed state
  - Expands on click
  - "Viết KUDOS" opens modal
  - "Thể lệ" navigates to /awards/rules
  - Close button collapses
  - Escape key collapses
  - Click outside collapses
  - Hidden when `isAuthenticated={false}`
  - Hidden on /login route
  - Hidden on /prelaunch route
  - Keyboard navigation works
  - **Manual QA only** (not testable in jsdom): hover glow effect, scroll persistence, animation timing

---

## Integration Testing Strategy

### Test Scope

- [x] **Component interactions**: FAB ↔ KudoModalWrapper, FAB ↔ Router
- [ ] **External dependencies**: None (client-side only)
- [ ] **Data layer**: None
- [x] **User workflows**: Expand → select action → navigate/modal

### Test Categories

| Category | Applicable? | Key Scenarios |
|----------|-------------|---------------|
| UI ↔ Logic | Yes | Expand/collapse state, route-based hiding, modal trigger |
| Service ↔ Service | No | N/A |
| App ↔ External API | No | N/A |
| App ↔ Data Layer | No | N/A |
| Cross-platform | Yes | Responsive positioning (mobile/tablet/desktop) |

### Test Environment

- **Environment type**: jsdom (Vitest)
- **Test data strategy**: N/A (no data)
- **Isolation approach**: Fresh component render per test

### Mocking Strategy

| Dependency Type | Strategy | Rationale |
|-----------------|----------|-----------|
| `next/navigation` | Mock (usePathname, useRouter) | Already mocked in vitest.setup.ts |
| `KudoModalWrapper` | Mock | Test FAB behavior, not modal internals |
| Document events | Real | Click outside detection needs real event handling |

### Test Scenarios Outline

1. **Happy Path**
   - [x] FAB renders in collapsed state on authenticated page
   - [x] FAB expands on click showing 3 buttons
   - [x] "Viết KUDOS" click triggers modal open callback
   - [x] "Thể lệ" click triggers navigation to /awards/rules
   - [x] Close button collapses FAB

2. **Edge Cases**
   - [x] FAB hidden when `isAuthenticated={false}`
   - [x] FAB hidden when pathname is /login
   - [x] FAB hidden when pathname is /prelaunch
   - [x] Escape key collapses expanded FAB
   - [x] Click outside collapses expanded FAB
   - [x] Route change auto-collapses expanded FAB

3. **Accessibility**
   - [x] FAB has correct aria-label
   - [x] FAB is focusable via Tab
   - [x] Enter/Space expands FAB

### Tooling & Framework

- **Test framework**: Vitest + @testing-library/react
- **Supporting tools**: @testing-library/user-event for click/keyboard simulation
- **CI integration**: `yarn test` in pre-commit/CI pipeline

### Coverage Goals

| Area | Target | Priority |
|------|--------|----------|
| Core interactions (expand/collapse) | 90%+ | High |
| Navigation actions | 90%+ | High |
| Route-based visibility | 85%+ | High |
| Accessibility | 75%+ | Medium |

---

## Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| z-index conflicts with existing modals/toasts | Medium | Medium | FAB uses z-50 (same as header/toast). Modals use `fixed inset-0 z-50` with overlay — the overlay covers the FAB naturally. FAB auto-collapses when modal opens (FR-010 route change or explicit collapse on "Viết KUDOS" click). Test layering manually. |
| FAB overlapping critical content on mobile | Low | Medium | Responsive positioning (bottom: 20px, right: 16px on mobile). Manual QA. |
| KudoModalWrapper coupling | Low | Low | FAB renders its own modal instance; doesn't affect existing modal usage on Kudos page. |
| Montserrat font weight 700 not loading | Low | Low | Already confirmed loaded in layout.tsx with weight ["400", "500", "700"]. |
| Rules icon SVG extraction from Figma | Low | Low | Use `get_media_files` tool; fallback to manual SVG creation. |

### Estimated Complexity

- **Frontend**: Low-Medium (single component, local state, well-defined behavior)
- **Backend**: None
- **Testing**: Low (straightforward interaction tests, no API mocking needed)

---

## Dependencies & Prerequisites

### Required Before Start

- [x] `constitution.md` reviewed and understood
- [x] `spec.md` approved (reviewed 3x, all checklist items pass)
- [x] `design-style.md` approved (all Figma values verified)
- [ ] Rules icon SVG extracted from Figma (Phase 0 task)
- [x] KudoModalWrapper exists and is functional

### External Dependencies

- None. All required assets and patterns exist in the codebase.

---

## Next Steps

After plan approval:

1. **Run** `/momorph.tasks` to generate task breakdown
2. **Review** tasks.md for parallelization opportunities
3. **Begin** implementation following task order

---

## Notes

- The FAB component goes in `src/components/shared/` (not `src/components/ui/`) because it is a feature-specific composite component, not a generic primitive. It integrates with KudoModalWrapper, routing, and auth — unlike pure UI atoms in `ui/`.
- The existing `--shadow-gold-glow` token in `globals.css` is **identical** to the Figma spec shadow value (`0 4px 4px 0 rgba(0,0,0,0.25), 0 0 6px 0 #FAE287`). No new shadow token needed.
- The existing `--color-gold-primary` (#FFEA9E) matches the FAB background color. No new color token needed for the main pill.
- Only 2 new tokens needed in `globals.css`: `--color-fab-close-bg: #D4271D` and optionally `--color-fab-close-hover: #B8211A`.
- The `/awards/rules` page doesn't exist yet — the FAB should still navigate there; users will see a 404 until that page is implemented. Alternatively, the link could be disabled with a tooltip until the page is ready.
- Consider adding the FAB to the `(auth)` layout group instead of root layout if only auth pages should show it — but root layout with route-based hiding gives more control.
