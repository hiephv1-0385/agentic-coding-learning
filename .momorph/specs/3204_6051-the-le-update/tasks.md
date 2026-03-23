# Tasks: Thể lệ (Rules) Panel

**Frame**: `3204_6051-the-le-update`
**Prerequisites**: plan.md (required), spec.md (required), design-style.md (required)

---

## Task Format

```
- [ ] T### [P?] [Story?] Description | file/path.ts
```

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this belongs to (US1, US2, US3, US4, US5)
- **|**: File path affected by this task

---

## Phase 1: Setup (Assets & Infrastructure)

**Purpose**: Download assets from Figma and prepare project structure

- [x] T001 Download hero badge pill images from Figma media export (4 files: badge-new-hero.png, badge-rising-hero.png, badge-super-hero.png, badge-legend-hero.png) to | public/images/rules/
- [x] T002 [P] Export collection badge icons from Figma manually (6 files: icon-revival.png, icon-touch-of-light.png, icon-stay-gold.png, icon-flow-to-horizon.png, icon-beyond-the-boundary.png, icon-root-further.png) at 128x128px to | public/images/rules/
- [x] T003 [P] Create `src/components/rules/` directory structure per plan.md

---

## Phase 2: Foundation (Blocking Prerequisites)

**Purpose**: Route, i18n, and panel shell — MUST complete before user story work

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T004 [P] Add `rules` section to Vietnamese locale with all static content from spec.md "Static Content Reference" section. Include keys for: title, section headings (3), descriptions (4), hero badge tiers (4 threshold texts + 4 descriptions), collection badge names (6), completion text, button labels (Đóng, Viết KUDOS), and Kudos Quốc Dân text | src/locales/vi.ts
- [x] T005 [P] Add `rules` section to English locale with translated equivalents of all Vietnamese keys from T004 | src/locales/en.ts
- [x] T006 Create RulesPanel shell as Client Component (`"use client"`). Props: `isOpen: boolean`, `onClose: () => void`, `onWriteKudos: () => void`. Implement: (1) fixed overlay at z-40 with `bg-[rgba(0,16,26,0.7)]`, clickable to call `onClose()`; (2) fixed panel at z-50, right-0, top-0, bottom-0, `w-[553px]` desktop, `bg-[#00070C]`, padding `24px 40px 40px 40px`, flex-col, justify-between, overflow-hidden; (3) scrollable content area as `flex-1 overflow-y-auto min-h-0 flex flex-col gap-6`; (4) fixed button footer as `flex gap-4 shrink-0`; (5) `role="dialog"` + `aria-modal="true"` + `aria-label`; (6) Escape key listener via useEffect that calls `onClose()`; (7) focus trap (Tab cycling between focusable elements); (8) body scroll lock (`document.body.style.overflow = "hidden"`) when `isOpen` is true with cleanup; (9) conditionally render based on `isOpen` prop. Reference existing `KudoModal.tsx` for overlay/focus patterns | src/components/rules/RulesPanel.tsx
- [x] T007 Update FAB component: change "Thể lệ" from `Link` (with `href="/awards/rules"`) to a `<button>` that toggles the RulesPanel sidebar overlay state. Add `isRulesPanelOpen` state and render `<RulesPanel isOpen={isRulesPanelOpen} onClose={...} onWriteKudos={...} />` | src/components/FloatingActionButton.tsx

**Checkpoint**: RulesPanel renders as sidebar overlay when `isOpen` is true, Escape key and overlay click call `onClose()`

---

## Phase 3: User Story 1 - View Kudos Rules (Priority: P1) + US4 + US5 🎯 MVP

**Goal**: Display all three rules sections with correct content, hero badge tiers, and collection badge grid

**Independent Test**: Toggle RulesPanel open via FAB → panel shows title "Thể lệ", all three sections with correct Vietnamese text, 4 hero badge tiers with visuals, 6 collection badges in 3x2 grid

### Components (US1 + US4 + US5)

- [x] T010 [P] [US4] Create HeroBadge component. Props: `tier: 'new' | 'rising' | 'super' | 'legend'`. Renders: (1) Line 1: flex row with `gap-2 items-center` — image-based pill (`next/image`, 126x22px, `rounded-full border border-[#FFEA9E]`) + threshold text (16px/700/white); (2) Line 2: sub-description text (14px/700/white, `mt-2`). Each tier uses its own badge image from `public/images/rules/badge-{tier}-hero.png`. Legend Hero gets `text-shadow: 0 0 1.5px #FFF` glow, Rising/Super get `text-shadow: 0 0.45px 1.8px #000`. Use `next/image` with width={126} height={22}. All text from `useLocale()` t() function | src/components/rules/HeroBadge.tsx
- [x] T011 [P] [US5] Create CollectionBadge component. Props: `name: string`, `imageSrc: string`. Renders: flex-col, items-center, `gap-2`, `w-20`. Image circle: `next/image` 64x64px with `rounded-full border-2 border-white overflow-hidden`. Label below: 11px/700/white/center (use 12px for short names REVIVAL, STAY GOLD). All text from useLocale() | src/components/rules/CollectionBadge.tsx
- [x] T012 [P] [US5] Create CollectionBadgeGrid component. Renders two rows of 3 badges each with `flex justify-between gap-4`. Row 1: REVIVAL, TOUCH OF LIGHT, STAY GOLD. Row 2: FLOW TO HORIZON, BEYOND THE BOUNDARY, ROOT FURTHER. Container has `px-12` (24px outer + 24px inner padding). Import badge images from `public/images/rules/icon-*.png` | src/components/rules/CollectionBadgeGrid.tsx

### Content Wiring (US1)

- [x] T013 [US1] Wire all content sections into RulesPanel scrollable content area using i18n text from useLocale(). Structure: (1) Title `<h2>` "Thể lệ" — 45px/700/gold `text-[#FFEA9E]`; (2) Section 1 "Người nhận": `<h3>` heading 22px/700/gold + description 16px/700/white/justify + 4x `<HeroBadge>` rows with `gap-4`; (3) Section 2 "Người gửi": `<h3>` heading 22px/700/gold + description 16px/700/white/justify + `<CollectionBadgeGrid>` + completion text; (4) Section 3 "Kudos Quốc Dân": `<h3>` heading 24px/700/gold + description 16px/700/white/justify. Use proper heading hierarchy (`<h2>` for title, `<h3>` for sections). Add `alt` text to all badge images | src/components/rules/RulesPanel.tsx

**Checkpoint**: Panel displays all content correctly. All 4 hero tiers render with visuals. All 6 collection badges render in 3x2 grid. Content scrolls with fixed footer.

---

## Phase 4: User Story 2 - Close the Rules Panel (Priority: P1)

**Goal**: Panel is dismissible via three methods: "Đóng" button, overlay click, Escape key

**Independent Test**: Open panel → click "Đóng" → panel closes. Open panel → click overlay → panel closes. Open panel → press Escape → panel closes.

### Frontend (US2)

- [x] T014 [US2] Implement "Đóng" (Close) secondary button in the button footer. Styled `<button>` with: `bg-[rgba(255,234,158,0.1)] border border-[#998C5F] rounded px-4 py-4 h-14 text-base font-bold text-white flex items-center justify-center gap-2`. Include `<Icon name="close" size={24} />` before text. Hover: `bg-[rgba(255,234,158,0.2)] border-[#FFEA9E]`. Active: `bg-[rgba(255,234,158,0.3)]`. Focus: `outline-2 outline-[#FFEA9E] outline-offset-2`. On click → call `onClose()`. Wire i18n text for button label | src/components/rules/RulesPanel.tsx
- [x] T015 [US2] Verify all three dismiss methods work correctly: (1) "Đóng" button calls `onClose()`; (2) overlay `onClick` calls `onClose()` (already in T006); (3) Escape key listener calls `onClose()` (already in T006). Ensure focus returns to the previously focused element after panel closes | src/components/rules/RulesPanel.tsx

**Checkpoint**: All three dismiss methods work. Focus management correct.

---

## Phase 5: User Story 3 - Navigate to Write Kudos (Priority: P1)

**Goal**: "Viết KUDOS" button opens KudoModal via `onWriteKudos()` callback

**Independent Test**: Open panel → click "Viết KUDOS" → panel closes and KudoModal opens

### Frontend (US3)

- [x] T016 [US3] Implement "Viết KUDOS" primary button in the button footer (after "Đóng" button). Styled `<button>` with: `flex-1 bg-[#FFEA9E] rounded px-4 py-4 h-14 text-base font-bold text-[#00101A] flex items-center justify-center gap-2`. Include `<Icon name="pencil" size={24} />` before text. Hover: `bg-[#FFE077] shadow-[0_2px_8px_rgba(255,234,158,0.4)]`. Active: `bg-[#FFD54F]`. Focus: `outline-2 outline-[#FFEA9E] outline-offset-2`. On click → call `onWriteKudos()` prop callback. Wire i18n text for button label | src/components/rules/RulesPanel.tsx

**Checkpoint**: Clicking "Viết KUDOS" calls `onWriteKudos()`. Button has correct gold styling.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Responsive design, animations, accessibility, and image optimization

- [x] T017 [P] Add responsive breakpoints to RulesPanel. Mobile (<640px): `w-full` panel, `p-4` padding, title `text-[32px]`, section headings `text-[18px]`, button footer `flex-col` stacked. Tablet (640-1023px): `w-[80%]` panel, `p-6`. Desktop (≥1024px): `w-[553px]` as designed. Use Tailwind responsive prefixes `sm:` and `lg:` with mobile-first approach | src/components/rules/RulesPanel.tsx
- [x] T018 [P] Add slide-in animation for panel: `translate-x-full` → `translate-x-0` on mount with `transition-transform duration-300 ease-out`. Add overlay fade: `opacity-0` → `opacity-100` with `transition-opacity duration-200`. Consider using React state to control mount animation or Tailwind `animate-` classes | src/components/rules/RulesPanel.tsx
- [x] T019 [P] Verify all `next/image` usages have correct `width`, `height`, `alt` attributes. Hero badge pills: width={126} height={22}. Collection badge icons: width={64} height={64}. Add `placeholder="blur"` with `blurDataURL` for collection badges if possible. Add `onError` fallback handler to show placeholder if image fails to load | src/components/rules/HeroBadge.tsx, src/components/rules/CollectionBadge.tsx
- [x] T020 [P] Accessibility audit: (1) Verify `role="dialog"` + `aria-modal="true"` + `aria-label` on panel; (2) Verify heading hierarchy: `<h2>` for title, `<h3>` for sections; (3) Verify all images have descriptive `alt` text; (4) Verify focus trap works with Tab/Shift+Tab; (5) Verify Escape key closes panel; (6) Verify button touch targets ≥ 44x44px (buttons are 56px tall ✓); (7) Run contrast check: white on #00070C = 19.5:1 ✓, gold #FFEA9E on #00070C = 13.6:1 ✓ | src/components/rules/RulesPanel.tsx

---

## Phase 7: Testing

**Purpose**: Integration and unit tests per constitution TDD standards

- [x] T021 [P] Create integration tests for RulesPanel: (1) renders with title "Thể lệ" and all 3 section headings; (2) displays all 4 hero badge tiers with correct threshold text; (3) displays all 6 collection badges in grid; (4) "Đóng" button calls `onClose` prop; (5) overlay click calls `onClose` prop; (6) Escape key calls `onClose` prop; (7) "Viết KUDOS" button calls `onWriteKudos` prop; (8) content area is scrollable while footer stays fixed. Mock: `next/image`, `useLocale` hook. Pass mock `onClose`/`onWriteKudos` functions as props | src/__tests__/components/rules/RulesPanel.test.tsx
- [x] T022 [P] Create unit tests for HeroBadge: (1) renders correct badge image for each tier; (2) displays threshold text; (3) displays sub-description text; (4) applies text-shadow for Rising/Super/Legend tiers | src/__tests__/components/rules/HeroBadge.test.tsx
- [x] T023 [P] Create unit tests for CollectionBadge: (1) renders circular image with white border; (2) displays badge name label. And CollectionBadgeGrid: (1) renders 6 badges; (2) badges in correct 3x2 order | src/__tests__/components/rules/CollectionBadge.test.tsx

**Checkpoint**: All tests pass. `yarn test` succeeds.

---

## Dependencies & Execution Order

### Phase Dependencies

```
Phase 1: Setup ──────────────┐
                              ▼
Phase 2: Foundation ─────────────────────────────────────┐
                              │                           │
                              ▼                           │
Phase 3: US1+US4+US5 ────── MVP ──► Test independently   │
                              │                           │
              ┌───────────────┼───────────────┐           │
              ▼               ▼               │           │
Phase 4: US2 (Close)   Phase 5: US3 (Write)  │  [P]      │
              │               │               │           │
              └───────┬───────┘               │           │
                      ▼                       │           │
Phase 6: Polish ──────────────────────────────┘           │
                      │                                   │
                      ▼                                   │
Phase 7: Testing ─────────────────────────────────────────┘
```

### Within Each Phase

- Tasks marked [P] can run in parallel
- T006 (panel shell) blocks all Phase 3+ work
- T010, T011, T012 (components) can run in parallel, but T013 (wiring) depends on all three
- T014 (close button) and T016 (write button) can run in parallel
- All Phase 6 tasks can run in parallel
- All Phase 7 tests can run in parallel

### Parallel Opportunities

| Parallel Group | Tasks | Condition |
|----------------|-------|-----------|
| Assets | T001, T002, T003 | Independent files |
| i18n | T004, T005 | Independent files |
| Badge components | T010, T011, T012 | Independent files |
| Action buttons | T014, T016 | Independent sections of same file (can be sequential if preferred) |
| Polish | T017, T018, T019, T020 | Independent concerns |
| Tests | T021, T022, T023 | Independent test files |

---

## Implementation Strategy

### MVP First (Recommended)

1. Complete Phase 1 + 2 (Setup + Foundation)
2. Complete Phase 3 (US1 + US4 + US5 — all content visible)
3. **STOP and VALIDATE**: Toggle RulesPanel open from FAB, verify all content renders correctly
4. Complete Phase 4 + 5 (US2 + US3 — panel actions)
5. Complete Phase 6 (Polish — responsive, animations, accessibility)
6. Complete Phase 7 (Testing)

### Incremental Delivery

1. Setup + Foundation → Panel shell renders as sidebar overlay when toggled from FAB
2. Add US1 content → All rules text visible → **Deployable MVP**
3. Add US2 close + US3 write → Panel fully functional
4. Add polish → Responsive, animated, accessible
5. Add tests → CI-ready

---

## Summary

| Metric | Value |
|--------|-------|
| **Total tasks** | 20 |
| **Phase 1 (Setup)** | 3 tasks |
| **Phase 2 (Foundation)** | 4 tasks |
| **Phase 3 (US1+US4+US5)** | 4 tasks |
| **Phase 4 (US2)** | 2 tasks |
| **Phase 5 (US3)** | 1 task |
| **Phase 6 (Polish)** | 4 tasks |
| **Phase 7 (Testing)** | 3 tasks |
| **Parallel opportunities** | 6 groups (up to 3 tasks simultaneously) |
| **MVP scope** | Phase 1-3 (13 tasks) |
| **New files** | 6 source + 10 assets + 3 test = 19 files |
| **Modified files** | 3 (FloatingActionButton.tsx, vi.ts, en.ts) |

---

## Notes

- Commit after each phase or logical task group
- Run `yarn lint` after each phase to catch issues early
- Run `yarn test` after Phase 7 and before any deployment
- Mark tasks complete as you go: `[x]`
- **Blocker**: T002 (collection badge export) requires manual Figma access — start this first
- **Font**: Body inherits Montserrat from layout.tsx. Use `font-[family-name:var(--font-montserrat)]` only if overriding in a non-body context
- **Buttons**: Panel-specific styled `<button>` elements (not shared Button component) per plan decision
