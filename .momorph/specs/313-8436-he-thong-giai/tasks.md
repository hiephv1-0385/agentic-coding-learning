# Tasks: Hệ thống giải thưởng SAA 2025

**Frame**: `313:8436-he-thong-giai`
**Plan**: `plan.md` (8th review pass — fully verified)
**Spec**: `spec.md` (10th review pass — implementation-ready)
**Generated**: 2026-03-12


---

## Task Format

```
- [ ] T### [P?] [Story?] Description | file/path
```

- **[P]**: Can run in parallel (different files, no dependencies on incomplete tasks)
- **[Story]**: Which user story (US1-US5)
- TDD: Constitution mandates Red-Green-Refactor. Tests written BEFORE implementation within each phase.
- Responsive (US4) and Accessibility (US5) are applied inline during component creation, not as separate tasks.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Database schema, type system, and theme tokens — all user stories depend on these.

- [x] T001 Create database migration adding 7 columns (description, quantity, unit_type, prize_value, prize_sub_label, prize_value_team, prize_sub_label_team) to award_categories table per plan Phase 0.1 | supabase/migrations/00004_add_award_details.sql
- [x] T002 [P] Add Tailwind theme tokens (--color-section-bg, --shadow-gold-glow, --spacing-award-card-gap) and html scroll-padding-top rule per plan Phase 0.5 | src/app/globals.css
- [x] T003 [P] Expand AwardCategory Zod schema with 7 new fields (description, quantity, unitType, prizeValue, prizeSubLabel, prizeValueTeam nullable, prizeSubLabelTeam nullable) per plan Phase 0.3. Preserve existing `import { z } from "zod/v4"` | src/types/award.ts

---

## Phase 2: Foundation (Blocking Prerequisites)

**Purpose**: Shared utilities, UI primitives, and seed data required by all story phases.

**CRITICAL**: No user story work can begin until this phase is complete.

- [x] T004 [P] TDD: Write formatPrizeValue tests first (7000000 → "7.000.000 VNĐ", 15000000 → "15.000.000 VNĐ", 0 → "0 VNĐ"), then implement using Intl.NumberFormat('vi-VN') per plan Phase 0.4 | src/utils/__tests__/formatPrizeValue.test.ts, src/utils/formatPrizeValue.ts
- [x] T005 [P] Add 3 icons to Icon component: "award-prefix" (circular target), "quantity" (pin/diamond), "prize" (badge/license). Add to IconName type + icons record. All 24x24 viewBox, currentColor fill. Extract from Figma via mcp__momorph__get_design_item_image or use Lucide approximations (target, map-pin, award) per plan Phase 0.6 | src/components/ui/Icon.tsx
- [x] T006 [P] Add "warm" variant to Button component: bg-kudos-text text-text-dark, hover:opacity-90, active:scale-[0.98], rounded, py-4 px-4 per plan Phase 0.7. Update ButtonVariant type | src/components/ui/Button.tsx
- [x] T007 Extract award description texts from Figma using mcp__momorph__list_design_items (fileKey: 9ypp4enmFmdK3YAFJLIu6C, frameId: 313:8436) and update seed SQL with all new columns (description, quantity, unit_type, prize_value, prize_sub_label, prize_value_team, prize_sub_label_team) for all 6 awards per plan Phase 0.2 data reference table | supabase/seeds/common/001_seed_saa2025.sql
- [x] T008 Run `supabase db reset` to apply migration and updated seeds. Verify with `yarn dev` that existing /api/awards route still works | (terminal command)

**Checkpoint**: Foundation ready — all shared infrastructure, utilities, icons, button variant, and seed data in place. User story implementation can begin.

---

## Phase 3: User Story 1 — View Award Categories Overview (Priority: P1) MVP

**Goal**: Display all 6 award categories with hero banner, section title, alternating-layout award cards with images, descriptions, quantity stats, and prize values.

**Independent Test**: Navigate to /awards and verify all 6 award categories display with correct information, alternating layout, and formatted prize values.

### Tests (US1)

- [x] T009 [P] [US1] TDD: Write AwardCard + AwardCardStats component tests — card renders image (alt text), h2 title with award-prefix icon, description, quantity stat inline row (padStart "01"/"10"), prize section multi-line with VNĐ format, alternating flex direction via index prop, Signature 2025 renders HoacDivider + second prize tier, MVP renders without sub-label | src/components/awards/__tests__/AwardCard.test.tsx
- [x] T010 [P] [US1] TDD: Write page integration tests — mock Supabase createClient, verify renders 6 award cards with correct data in order, alternating layout (even=row, odd=row-reverse), hero section present, section title with h1, empty state shows "Chưa có thông tin giải thưởng." message | src/app/awards/__tests__/page.test.tsx

### Components (US1)

- [x] T011 [P] [US1] Create AwardsHeroSection — full-width hero with next/image fill + priority, gradient overlay (from-page-bg to-transparent), "ROOT FURTHER" two-line decorative title (aria-hidden), responsive: mobile h-auto min-h-[300px] text-[32px], desktop h-[547px] text-[57px] per plan Phase 1.1 | src/components/awards/AwardsHeroSection.tsx
- [x] T012 [P] [US1] Create SectionTitle — subtitle "Sun* Annual Awards 2025" (24px white center), hr divider (1px bg-divider), h1 "Hệ thống giải thưởng SAA 2025" (57px gold left), responsive: mobile text-[28px], tablet sm:text-[40px] per plan Phase 1.2 | src/components/awards/SectionTitle.tsx
- [x] T013 [P] [US1] Create HoacDivider — flex items-center gap-2: left line (flex-1 h-px bg-divider) + "Hoặc" text (14px bold text-divider) + right line per plan Phase 1.5 | src/components/awards/HoacDivider.tsx
- [x] T014 [P] [US1] Create AwardCardStats — quantity single inline row (items-baseline gap-1: icon + label 14px gold + number 36px gold padStart(2,'0') + unit 14px white), divider, prize multi-line (icon + label → value formatPrizeValue → sub-label if non-empty), Signature special case (prizeValueTeam !== null → HoacDivider → second prize section) per plan Phase 1.4 | src/components/awards/AwardCardStats.tsx
- [x] T015 [US1] Create AwardCard — props: award, index, id. Alternating flex (even=row, odd=row-reverse) gap-award-card-gap. Image: 336x336 next/image rounded-carousel-card border-gold-primary shadow-gold-glow flex-shrink-0 with CSS-only fallback (absolute bg-divider behind z-10 image). Content: h2 tabindex="-1" with award-prefix icon, description (text-justify tracking-[0.5px]), divider, AwardCardStats. Responsive: mobile flex-col, image max-w-[280px] mx-auto per plan Phase 1.3 | src/components/awards/AwardCard.tsx
- [x] T016 [US1] Create minimal AwardSidebar stub — Server Component that renders `<nav aria-label="Danh mục giải thưởng">` with 6 anchor links `<a href="#award-{slug}">` showing category names. Will be enhanced to client component with scroll spy in US2 | src/components/awards/AwardSidebar.tsx
- [x] T017 [US1] Create minimal AwardsSunKudosSection stub — static component rendering "Phong trào ghi nhận" label, "Sun* Kudos" h2 title, and "Chi tiết" Button linking to /kudos. Will be fully implemented in US3 | src/components/awards/AwardsSunKudosSection.tsx
- [x] T018 [US1] Rewrite awards page.tsx — Server Component: Supabase fetch award_categories (all 14 columns) ordered by "order" ASC, snake_case→camelCase mapping, empty state handling ("Chưa có thông tin giải thưởng."). Full composition: Header(activeLink="awards"), AwardsHeroSection, main(negative-mt overlap, flex-col, px-4 sm:px-10 lg:px-36 — no max-w/mx-auto so content aligns with header padding on all screen sizes) with SectionTitle, award system section (flex-col lg:flex-row gap-awards-gap: AwardSidebar + cards column gap-section-gap), AwardsSunKudosSection, Footer per plan Phase 1.6 | src/app/awards/page.tsx

**Checkpoint**: User Story 1 complete — /awards displays 6 award cards with all data, alternating layout, hero, section title. Independently testable via `yarn test` + browser navigation.

---

## Phase 4: User Story 2 — Sidebar Navigation with Scroll Spy (Priority: P2)

**Goal**: Sidebar with smooth-scroll click navigation, IntersectionObserver scroll spy, sticky positioning, and keyboard accessibility.

**Independent Test**: Click each sidebar item and verify smooth scroll to corresponding award card with active state highlighting.

### Tests (US2)

- [x] T019 [US2] TDD: Write AwardSidebar tests — renders 6 items matching award names, click handler calls scrollIntoView with smooth behavior, active state applies gold color + border-bottom + text-shadow, scroll spy updates active tab on intersection (mock IntersectionObserver), Space key triggers click, aria-current="true" on active tab, nav has aria-label | src/components/awards/__tests__/AwardSidebar.test.tsx

### Implementation (US2)

- [x] T020 [US2] Enhance AwardSidebar to "use client" component — replace stub with full implementation: useState(activeCategory), useRef(isScrollingRef), sticky top-24 self-start min-w-[180px] shrink-0. Tab styles: flex items-center gap-2 py-4 px-4 text-sm font-bold tracking-[0.25px], default text-white, hover bg-gold-10, active text-gold-primary border-b border-gold-primary [text-shadow:var(--shadow-nav-active)]. Click: preventDefault → isScrollingRef=true → scrollIntoView smooth → setActiveCategory → setTimeout 500ms → focus h2. Scroll spy: useEffect IntersectionObserver rootMargin "-96px 0px 0px 0px" threshold 0.3, cleanup disconnect. Keyboard: onKeyDown Space. ARIA: nav role="navigation" aria-label="Danh mục giải thưởng", aria-current="true". Responsive: mobile flex-row overflow-x-auto, desktop lg:flex-col per plan Phase 2.1 | src/components/awards/AwardSidebar.tsx

**Checkpoint**: User Story 2 complete — sidebar navigation works with click-to-scroll, scroll spy, sticky positioning, and keyboard navigation.

---

## Phase 5: User Story 3 — Sun* Kudos Promotional Section (Priority: P2)

**Goal**: Two-column promotional section for Sun* Kudos with CTA button navigating to /kudos.

**Independent Test**: Scroll to Kudos section and verify content renders correctly; click "Chi tiết" navigates to /kudos.

### Tests (US3)

- [x] T021 [US3] TDD: Write AwardsSunKudosSection tests — renders "Phong trào ghi nhận" label (24px gold), "Sun* Kudos" h2 title (57px gold), description block with "ĐIỂM MỚI CỦA SAA 2025" first line, "Chi tiết" button has href="/kudos", right column shows Kudos logo on desktop | src/components/awards/__tests__/AwardsSunKudosSection.test.tsx

### Implementation (US3)

- [x] T022 [US3] Implement full AwardsSunKudosSection — replace stub. Container: w-full lg:h-[500px] flex-col lg:flex-row items-center justify-between relative overflow-hidden bg-section-bg rounded-kudos-card. Left column (flex-col gap-4 lg:w-[457px]): "Phong trào ghi nhận" p 24px bold gold, "Sun* Kudos" h2 57px bold gold, description p 16px bold white justified with span "ĐIỂM MỚI CỦA SAA 2025" block, Button variant="warm" href="/kudos" showArrow. Right column (hidden lg:flex items-center): next/image kudos-logo.png, decorative "KUDOS" span SVN-Gotham 96px text-kudos-text tracking-[-0.13em] select-none. Responsive: mobile flex-col h-auto py-6 per plan Phase 3.1 | src/components/awards/AwardsSunKudosSection.tsx

**Checkpoint**: User Story 3 complete — Sun* Kudos section renders with full two-column layout and CTA navigation.

---

## Phase 6: Route States (FR-009)

**Purpose**: Loading skeleton and error boundary for /awards route per App Router conventions.

- [x] T023 [P] Create loading skeleton — hero placeholder (h-[300px] lg:h-[547px] bg-divider animate-pulse), section title bars, 3 award card skeletons with alternating image+content bars. Dark theme: bg-divider on bg-page-bg per plan Phase 4.1 | src/app/awards/loading.tsx
- [x] T024 [P] Create error boundary — "use client", props {error, reset}. Layout: min-h-screen bg-page-bg centered. "Something went wrong" h2, "Không thể tải thông tin giải thưởng." message, retry button (gold-primary bg). Follow pattern from src/app/kudos/error.tsx per plan Phase 4.2 | src/app/awards/error.tsx

**Checkpoint**: Route states complete — loading skeleton and error boundary implemented per constitution requirement.

---

## Phase 7: Polish & Verification

**Purpose**: Performance audit, test coverage verification, and final code quality check.

- [x] T025 [P] Run full test suite (`yarn test`) and verify coverage targets: AwardCard 90%+, Sidebar 85%+, formatPrizeValue 100%, Kudos section 85%+, error/loading 80%+
- [x] T026 [P] Run `yarn build` to verify zero build errors and check bundle size (only AwardSidebar should be client component)
- [x] T027 Run Lighthouse audit on /awards (`yarn build && npx next start`, then Lighthouse). Target: performance >= 90. Monitor LCP (hero image), CLS (image dimensions), TBT (minimal client JS) per plan Phase 7
- [x] T028 Final code review — verify: no dead code, all imports use @/* aliases, one component per file, no arbitrary Tailwind values (use theme tokens), WCAG AA contrast on all text, heading hierarchy (h1→h2), responsive at 320px/640px/1024px per constitution

---

## Dependencies & Execution Order

### Phase Dependencies

```
Phase 1: Setup ─────────────────────┐
  (T001-T003, no dependencies)      │
                                     ▼
Phase 2: Foundation ────────────────┐
  (T004-T008, depends on Phase 1)   │
                                     ▼
Phase 3: US1 ───────────────────────┤ ← MVP milestone
  (T009-T018, depends on Phase 2)   │
                                     │
Phase 4: US2 ───────────────────────┤ (depends on Phase 3)
  (T019-T020)                        │
                                     │
Phase 5: US3 ───────────────────────┤ (depends on Phase 3, parallel with Phase 4)
  (T021-T022)                        │
                                     │
Phase 6: Route States ──────────────┤ (parallel with Phase 4+5, depends on Phase 3)
  (T023-T024)                        │
                                     ▼
Phase 7: Polish ────────────────────
  (T025-T028, depends on all above)
```

### Parallel Opportunities

**Within Phase 1**: T002 + T003 can run in parallel (different files). T001 runs first or in parallel.

**Within Phase 2**: T004 + T005 + T006 can all run in parallel (different files). T007 depends on Figma access. T008 depends on T001 + T007.

**Within Phase 3**: T009 + T010 (tests) in parallel. T011 + T012 + T013 + T014 (components) in parallel. T015 depends on T013 + T014. T016 + T017 are stubs (parallel). T018 depends on T011-T017 all complete.

**Across Phases 4-6**: US2 (T019-T020), US3 (T021-T022), and Route States (T023-T024) can all run in parallel after Phase 3 completes.

### Within Each User Story

1. Tests MUST be written and FAIL before implementation (TDD)
2. Sub-components before parent components
3. Stubs before page composition
4. Page integration last (depends on all child components)

---

## Implementation Strategy

### MVP First (Recommended)

1. Complete Phase 1 + 2 (Setup + Foundation)
2. Complete Phase 3 (User Story 1 — view award categories)
3. **STOP and VALIDATE**: Run `yarn test`, navigate to /awards in browser, verify 6 cards render correctly
4. Continue with Phase 4-6 in parallel if MVP passes

### Incremental Delivery

1. Setup + Foundation → verify with `supabase db reset` + `yarn dev`
2. US1 (View Awards) → Test → verify /awards page renders 6 cards
3. US2 (Sidebar Nav) → Test → verify click-to-scroll and scroll spy
4. US3 (Kudos Section) → Test → verify CTA links to /kudos
5. Route States → verify loading.tsx skeleton and error.tsx boundary
6. Polish → Lighthouse audit + final review

---

## Summary

| Metric | Value |
|--------|-------|
| **Total tasks** | 28 |
| **Phase 1 (Setup)** | 3 tasks |
| **Phase 2 (Foundation)** | 5 tasks |
| **Phase 3 (US1 — MVP)** | 10 tasks |
| **Phase 4 (US2)** | 2 tasks |
| **Phase 5 (US3)** | 2 tasks |
| **Phase 6 (Route States)** | 2 tasks |
| **Phase 7 (Polish)** | 4 tasks |
| **Parallel opportunities** | 16 tasks marked [P] |
| **Test files** | 5 (formatPrizeValue, AwardCard, page, AwardSidebar, AwardsSunKudosSection) |
| **MVP scope** | Phases 1-3 (18 tasks) |

---

## Notes

- Responsive (US4) and Accessibility (US5) are NOT separate task phases — they are applied inline during component creation in US1-US3. Each component task description includes responsive breakpoints and ARIA attributes from plan Phases 5-6.
- Stubs (T016, T017) are created in US1 for AwardSidebar and AwardsSunKudosSection so that page.tsx can import and render them. They are enhanced to full implementations in US2 and US3 respectively.
- All description texts must be extracted from Figma during T007 — they only exist in the design, not in the spec.
- The existing `/api/awards` route is NOT modified. The awards page fetches data directly via Server Component Supabase query.
- Mark tasks complete as you go: `- [x] T###`
