# Tasks: Floating Action Button (FAB)

**Frame**: `313_9137-floating-action-button`
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

## Phase 1: Setup (Asset Preparation)

**Purpose**: Extract Figma assets and add design tokens before component work begins

- [x] T001 Download rules/lightning icon SVG from Figma (component `214:3752`, set `178:1020`) using `get_media_files` tool | Figma → local
- [x] T002 [P] Add `rules` icon SVG path to Icon component icon map | `src/components/ui/Icon.tsx`
- [x] T003 [P] Add FAB-specific design tokens to globals.css: `--color-fab-close-bg: #D4271D`, `--color-fab-close-hover: #B8211A` | `src/app/globals.css`

**Checkpoint**: Icon and tokens ready — component work can begin

---

## Phase 2: Foundation (Blocking Prerequisites)

**Purpose**: Create component scaffold and wire into root layout

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T004 Create `FloatingActionButton.tsx` as `"use client"` component with props interface (`isAuthenticated: boolean`), route-based gating (`usePathname()` returns `null` for `/login`, `/prelaunch`), and auth gating (`!isAuthenticated` returns `null`) | `src/components/shared/FloatingActionButton.tsx`
- [x] T005 Add FAB to root layout: import `createClient` from `@/libs/supabase/server`, call `supabase.auth.getUser()`, render `<FloatingActionButton isAuthenticated={!!user} />` after `{children}` inside body | `src/app/layout.tsx`

**Checkpoint**: FAB scaffold renders (empty) on authenticated pages, hidden on /login and /prelaunch

---

## Phase 3: User Story 1 — Quick Access via FAB (Priority: P1) MVP

**Goal**: FAB visible as golden pill in bottom-right corner on all authenticated pages with hover effect

**Independent Test**: Navigate to any authenticated page → FAB pill visible in bottom-right with pen icon + "/" + rules icon. Scroll page → FAB stays fixed. Hover → glow enhances.

### Frontend (US1)

- [x] T006 [US1] Implement collapsed pill UI inside FAB component: `<button>` with golden background (`bg-gold-primary`), border-radius 100px (`rounded-full`), 106x64px, containing pen `<Icon name="pencil" size={24} />` + `<span className="font-[family-name:var(--font-montserrat)] text-2xl font-bold leading-8 text-page-bg">/</span>` + rules `<Icon name="rules" size={24} />`, flex row, gap 8px, padding 16px | `src/components/shared/FloatingActionButton.tsx`
- [x] T007 [US1] Add fixed positioning with responsive breakpoints: base `fixed bottom-5 right-4 z-50` (mobile), `sm:bottom-6 sm:right-6` (tablet), `lg:bottom-[120px] lg:right-[143px]` (desktop). Apply `shadow-gold-glow` | `src/components/shared/FloatingActionButton.tsx`
- [x] T008 [US1] Add hover state: `transition-all duration-200 ease-out hover:shadow-[0_4px_8px_0_rgba(0,0,0,0.35),0_0_12px_2px_#FAE287] hover:scale-[1.03]` | `src/components/shared/FloatingActionButton.tsx`
- [x] T009 [US1] Add page-load entrance animation: `animate-fade-in` class (existing in globals.css) | `src/components/shared/FloatingActionButton.tsx`

**Checkpoint**: FAB pill visible, positioned correctly, hover works, hidden on public routes — US1 independently testable

---

## Phase 4: User Story 2 — Expand FAB to Reveal Options (Priority: P1)

**Goal**: Click FAB → expands to show "Thể lệ" button, "Viết KUDOS" button, red close button. Each action works. Collapse via X, click outside, Escape, route change.

**Independent Test**: Click FAB pill → 3 buttons appear. Click "Thể lệ" → navigates to /awards/rules. Click "Viết KUDOS" → Kudo modal opens. Click X → collapses. Press Escape → collapses. Click outside → collapses.

**Depends on**: Phase 3 (US1) complete

### Frontend (US2)

- [x] T010 [US2] Add `isExpanded` and `isModalOpen` state variables. Toggle `isExpanded` on pill `<button>` click | `src/components/shared/FloatingActionButton.tsx`
- [x] T011 [US2] Implement expanded state UI: when `isExpanded`, hide pill and show vertical stack (`flex flex-col items-end gap-5 w-[214px]`): (A) "Thể lệ" as `<Link href="/awards/rules">` (149x64px, `rounded bg-gold-primary p-4 gap-2`, rules icon + "Thể lệ" label, Montserrat 700 24px), (B) "Viết KUDOS" as `<button>` (214x64px, same styling, pen icon + "Viết KUDOS" label), (C) Close as `<button>` (56x56px, `rounded-full bg-[var(--color-fab-close-bg)] hover:bg-[var(--color-fab-close-hover)]`, white close `<Icon name="close" size={24} />`) | `src/components/shared/FloatingActionButton.tsx`
- [x] T012 [US2] Wire "Viết KUDOS" button: on click, set `isExpanded=false` then `isModalOpen=true`. Render `<KudoModalWrapper>` (dynamic import from `@/components/kudos/KudoModalWrapper`) controlled by `isModalOpen`, with `onClose` resetting state | `src/components/shared/FloatingActionButton.tsx`
- [x] T013 [US2] Implement collapse triggers: (1) Close button sets `isExpanded=false`, (2) Click outside via `useRef` on FAB container + `useEffect` document `mousedown` listener, (3) Escape key via `useEffect` document `keydown` listener | `src/components/shared/FloatingActionButton.tsx`
- [x] T014 [US2] Add route change auto-collapse: `useEffect` watching `usePathname()` value, set `isExpanded=false` when pathname changes | `src/components/shared/FloatingActionButton.tsx`
- [x] T015 [US2] Add expand/collapse CSS transitions: collapsed→expanded (pill opacity 0 + scale 0.8, menu opacity 1 + translateY 0, 250ms ease-out), expanded→collapsed (menu opacity 0 + translateY 10px, pill opacity 1 + scale 1, 200ms ease-in), expanded button hover (background-color 150ms ease-in-out) | `src/components/shared/FloatingActionButton.tsx`

**Checkpoint**: Full expand/collapse interaction working with all triggers and navigation — US2 independently testable

---

## Phase 5: User Story 3 — FAB Accessibility (Priority: P2)

**Goal**: FAB is keyboard-navigable, screen-reader friendly, with visible focus indicators

**Independent Test**: Tab to FAB → focus ring visible. Enter/Space → expands. Tab between options → each focusable. Screen reader announces "Quick actions".

**Depends on**: Phase 4 (US2) complete

### Frontend (US3)

- [x] T016 [US3] Add ARIA attributes: collapsed pill gets `aria-label="Quick actions: Write kudos or View SAA rules"` and `aria-expanded={isExpanded}`. Expanded container gets `role="menu"`. Each expanded button gets `role="menuitem"` | `src/components/shared/FloatingActionButton.tsx`
- [x] T017 [US3] Add keyboard navigation: pill responds to Enter/Space (expand). When expanded, Tab cycles through "Thể lệ" → "Viết KUDOS" → Close. Escape collapses (already in T013). Add `tabIndex={0}` where needed | `src/components/shared/FloatingActionButton.tsx`
- [x] T018 [US3] Add focus visible indicators: `focus-visible:outline-2 focus-visible:outline-[#FAE287] focus-visible:outline-offset-2` on pill. `focus-visible:outline-2 focus-visible:outline-[#FAE287] focus-visible:outline-offset-2` on expanded buttons. `focus-visible:outline-2 focus-visible:outline-[#D4271D] focus-visible:outline-offset-2` on close button | `src/components/shared/FloatingActionButton.tsx`
- [x] T019 [US3] Handle duplicate modal edge case: "Viết KUDOS" click checks `isModalOpen` — if already true, collapse FAB silently without reopening | `src/components/shared/FloatingActionButton.tsx`

**Checkpoint**: FAB passes accessibility audit — US3 independently testable

---

## Phase 6: Testing

**Purpose**: Integration tests covering all user stories

**Depends on**: Phase 5 (US3) complete (all functionality implemented)

- [x] T020 [P] Write test: FAB renders in collapsed state with correct elements (pill button, pen icon, separator, rules icon) when `isAuthenticated={true}` and pathname is `/kudos` | `src/__tests__/components/FloatingActionButton.test.tsx`
- [x] T021 [P] Write test: FAB returns null when `isAuthenticated={false}` | `src/__tests__/components/FloatingActionButton.test.tsx`
- [x] T022 [P] Write test: FAB returns null when pathname is `/login` or `/prelaunch` | `src/__tests__/components/FloatingActionButton.test.tsx`
- [x] T023 Write test: clicking FAB pill expands showing 3 elements ("Thể lệ" link, "Viết KUDOS" button, close button) | `src/__tests__/components/FloatingActionButton.test.tsx`
- [x] T024 Write test: clicking "Thể lệ" renders a link with `href="/awards/rules"` | `src/__tests__/components/FloatingActionButton.test.tsx`
- [x] T025 Write test: clicking "Viết KUDOS" triggers modal open (KudoModalWrapper rendered) and collapses FAB | `src/__tests__/components/FloatingActionButton.test.tsx`
- [x] T026 Write test: clicking close button collapses FAB back to pill state | `src/__tests__/components/FloatingActionButton.test.tsx`
- [x] T027 Write test: pressing Escape key collapses expanded FAB | `src/__tests__/components/FloatingActionButton.test.tsx`
- [x] T028 Write test: clicking outside FAB area collapses expanded FAB | `src/__tests__/components/FloatingActionButton.test.tsx`
- [x] T029 Write test: FAB auto-collapses when pathname changes (mock usePathname value change) | `src/__tests__/components/FloatingActionButton.test.tsx`
- [x] T030 Write test: FAB has correct `aria-label` and `aria-expanded` attributes | `src/__tests__/components/FloatingActionButton.test.tsx`
- [x] T031 Write test: Enter/Space key expands collapsed FAB | `src/__tests__/components/FloatingActionButton.test.tsx`

**Checkpoint**: All 12 automated tests pass. Run `yarn test src/__tests__/components/FloatingActionButton.test.tsx`

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Manual verification and cleanup

- [x] T032 Manual QA: verify hover glow effect visually matches design-style.md shadow specs | Browser
- [x] T033 Manual QA: verify FAB stays fixed during page scroll on all 3 breakpoints | Browser
- [x] T034 Manual QA: verify expand/collapse animation timing and easing feels smooth | Browser
- [x] T035 Manual QA: verify z-index layering — FAB visible above content, modal overlay covers FAB when open | Browser
- [x] T036 Manual QA: verify FAB on mobile (< 640px) — positioned bottom: 20px, right: 16px, touch target 106x64px adequate | Browser
- [x] T037 Run `yarn lint` and fix any lint errors in modified files | Terminal
- [x] T038 Run `yarn build` and verify no build errors | Terminal

**Checkpoint**: Feature complete, all tests pass, lint clean, build succeeds

---

## Dependencies & Execution Order

### Phase Dependencies

```
Phase 1 (Setup) ──────► Phase 2 (Foundation) ──────► Phase 3 (US1: Collapsed)
                                                              │
                                                              ▼
                                                      Phase 4 (US2: Expanded)
                                                              │
                                                              ▼
                                                      Phase 5 (US3: Accessibility)
                                                              │
                                                              ▼
                                                      Phase 6 (Testing)
                                                              │
                                                              ▼
                                                      Phase 7 (Polish)
```

### Within Each Phase

- Tasks marked [P] can run in parallel within their phase
- Sequential tasks must complete in order (T010 → T011 → T012 → T013 → T014 → T015)
- Phase 6 tests marked [P] for T020-T022 (visibility tests) can run in parallel; T023+ are sequential (depend on expand state)

### Parallel Opportunities

**Phase 1**: T002 and T003 can run in parallel (different files: Icon.tsx vs globals.css) after T001
**Phase 6**: T020, T021, T022 can run in parallel (independent visibility assertions)

---

## Implementation Strategy

### MVP First (Recommended)

1. Complete Phase 1 (Setup) + Phase 2 (Foundation)
2. Complete Phase 3 (US1: Collapsed State)
3. **STOP and VALIDATE**: FAB pill visible, positioned, hover works, hidden on public routes
4. Complete Phase 4 (US2: Expanded State)
5. **STOP and VALIDATE**: Full expand/collapse interaction, navigation, modal
6. Complete Phase 5–7 (Accessibility, Tests, Polish)

### Single-Developer Sequential Path

```
T001 → T002+T003 (parallel) → T004 → T005 → T006 → T007 → T008 → T009
→ T010 → T011 → T012 → T013 → T014 → T015
→ T016 → T017 → T018 → T019
→ T020+T021+T022 (parallel) → T023 → T024 → T025 → T026 → T027 → T028 → T029 → T030 → T031
→ T032–T038
```

---

## Notes

- All component work is in a single file (`FloatingActionButton.tsx`) — phases within US1/US2/US3 are sequential, not parallel
- Test file mocks: `next/navigation` (usePathname, useRouter) already mocked in `vitest.setup.ts`. Mock `KudoModalWrapper` at module level.
- The `/awards/rules` page doesn't exist yet — "Thể lệ" `<Link>` will work but navigate to 404. This is expected per spec (out of scope).
- Commit after each phase checkpoint for clean git history
- Reference `design-style.md` for exact pixel values, colors, and animation specs during implementation
- Reference `spec.md` for acceptance criteria validation during testing
