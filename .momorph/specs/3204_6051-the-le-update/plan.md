# Implementation Plan: Thể lệ (Rules) Panel

**Frame**: `3204_6051-the-le-update`
**Date**: 2026-03-16
**Spec**: `specs/3204_6051-the-le-update/spec.md`

---

## Summary

Implement a right-side slide-in sidebar overlay displaying the SAA 2025 Kudos rules. The panel is **static content only** (no API calls, no database). It renders three informational sections (Receiver Hero badges, Sender Collection badges, Kudos Quốc Dân) with two action buttons (Close, Write Kudos). Toggled from the FAB "Thể lệ" button as a sidebar overlay — there is no dedicated route. The component accepts `isOpen`/`onClose`/`onWriteKudos` props.

---

## Technical Context

**Language/Framework**: TypeScript / Next.js 15 (App Router)
**Primary Dependencies**: React 19, TailwindCSS 4, next/image
**Database**: N/A — static content
**Testing**: Vitest (unit/integration)
**State Management**: React useState (local only)
**API Style**: N/A — no backend calls

---

## Constitution Compliance Check

*GATE: Must pass before implementation can begin*

- [x] Follows project coding conventions — TypeScript strict, PascalCase components, `@/*` imports
- [x] Uses approved libraries and patterns — TailwindCSS utilities, `next/image`
- [x] Adheres to folder structure guidelines — `src/components/rules/` (no route needed)
- [x] Meets security requirements — Auth-gated via FAB visibility (no middleware change needed), no user input, no `dangerouslySetInnerHTML`
- [x] Follows testing standards — Integration tests for panel open/close/navigation

**Violations**: None

---

## Architecture Decisions

### Frontend Approach

- **Component Structure**: Feature-scoped under `src/components/rules/`
  - `RulesPanel.tsx` — Main Client Component (dialog with overlay, focus trap, scroll, buttons)
  - `HeroBadge.tsx` — Reusable hero badge pill with image background
  - `CollectionBadge.tsx` — Circular icon badge with label
  - Content sections rendered directly inside `RulesPanel.tsx` (no separate `RulesContent` file needed — panel is a single Client Component with static i18n text)
- **Styling Strategy**: TailwindCSS utility classes exclusively. Design tokens from `design-style.md` mapped to Tailwind arbitrary values. Montserrat font via existing `--font-montserrat` CSS variable.
- **Data Fetching**: None — all content is static, rendered at build time via i18n locale keys.
- **Panel Pattern**: Client Component with `"use client"` for event handlers (Escape key, overlay click, focus trap). Follow existing `KudoModal.tsx` pattern for overlay/focus management.

### Sidebar Overlay Strategy

The panel is a **sidebar overlay** — not a standalone route. There is no `/awards/rules` route, no `page.tsx`, and no `error.tsx` for this feature.

**Decision**: Implement as a controlled component with props `isOpen: boolean`, `onClose: () => void`, and `onWriteKudos: () => void`. The FAB "Thể lệ" button (previously a `Link` to `/awards/rules`) is now a `<button>` that toggles the `isOpen` state. Close calls `onClose()`. "Viết KUDOS" calls `onWriteKudos()` which opens the KudoModal. No router navigation is needed.

### Backend Approach

N/A — No API endpoints, no database changes, no server actions needed.

### Integration Points

- **Existing Components**:
  - `Icon` component (`src/components/ui/Icon.tsx`) — reuse `close` and `pencil` icons
  - `Button` component (`src/components/ui/Button.tsx`) — existing variants (cta, outlined, warm, link) are themed for light backgrounds and don't match the dark panel context. **Decision**: Create panel-specific styled `<button>` elements directly in `RulesPanel.tsx` using Tailwind utilities, rather than adding dark-panel variants to the shared Button component. This follows constitution principle "avoid premature abstraction" — only abstract into shared Button if a third usage emerges
  - FAB component — "Thể lệ" changes from `Link` to `<button>` that toggles sidebar overlay state
- **Existing Hooks**:
  - `useLocale()` — for i18n text retrieval
- **Existing Patterns**:
  - `KudoModal.tsx` — reference for overlay, focus trap, Escape key, body scroll lock
  - `useEffect` cleanup for event listeners (keyboard, scroll)

---

## Project Structure

### Documentation (this feature)

```text
.momorph/specs/3204_6051-the-le-update/
├── spec.md              # Feature specification ✅
├── design-style.md      # Design specifications ✅
├── plan.md              # This file ✅
├── tasks.md             # Task breakdown (next step)
└── assets/              # Screenshots
```

### Source Code (affected areas)

```text
# New Files
src/
├── components/rules/
│   ├── RulesPanel.tsx              # Main panel: overlay + dialog + scroll + footer ("use client")
│   ├── HeroBadge.tsx               # Hero badge pill component (4 tiers)
│   ├── CollectionBadge.tsx         # Collection badge icon + label
│   └── CollectionBadgeGrid.tsx     # 3x2 grid of collection badges

# New Assets
public/images/rules/
├── badge-new-hero.png              # Hero badge pill background
├── badge-rising-hero.png           # Hero badge pill background
├── badge-super-hero.png            # Hero badge pill background
├── badge-legend-hero.png           # Hero badge pill background
├── icon-revival.png                # Collection badge icon
├── icon-touch-of-light.png         # Collection badge icon
├── icon-stay-gold.png              # Collection badge icon
├── icon-flow-to-horizon.png        # Collection badge icon
├── icon-beyond-the-boundary.png    # Collection badge icon
└── icon-root-further.png           # Collection badge icon

# Modified Files
src/
├── components/FloatingActionButton.tsx  # Change "Thể lệ" from Link to button, add state to toggle RulesPanel
├── locales/vi.ts                   # Add `rules: { ... }` key with all Vietnamese content from spec
└── locales/en.ts                   # Add `rules: { ... }` key with English translations

# Test Files
src/__tests__/
└── components/rules/
    ├── RulesPanel.test.tsx          # Panel open/close/navigation tests
    └── HeroBadge.test.tsx           # Badge rendering tests
```

### Dependencies

No new dependencies needed. All required packages are already installed:
- `next/image` — badge image optimization
- TailwindCSS — all styling
- Existing `Icon` component — close, pencil icons

---

## Implementation Strategy

### Phase 0: Asset Preparation

Download and organize all image assets from Figma:

**Hero Badge Pills** (available via Figma media export):
| Asset | Figma Node | Download |
|-------|-----------|----------|
| badge-new-hero.png | 3204:6163 | ✅ Available |
| badge-rising-hero.png | 3204:6172 | ✅ Available |
| badge-super-hero.png | 3204:6181 | ✅ Available |
| badge-legend-hero.png | 3204:6190 | ✅ Available |

**Collection Badge Icons** (need manual Figma export — not available via API):
| Asset | Figma Node | Component ID | Download |
|-------|-----------|-------------|----------|
| icon-revival.png | 3204:6082 | 737:20446 | ⚠️ Manual export |
| icon-touch-of-light.png | 3204:6087 | 737:20450 | ⚠️ Manual export |
| icon-stay-gold.png | 3204:6086 | 737:20449 | ⚠️ Manual export |
| icon-flow-to-horizon.png | 3204:6083 | 737:20447 | ⚠️ Manual export |
| icon-beyond-the-boundary.png | 3204:6084 | 737:20448 | ⚠️ Manual export |
| icon-root-further.png | 3204:6088 | 737:20451 | ⚠️ Manual export |

All images should be placed in `public/images/rules/` and optimized (WebP preferred, PNG fallback). Badge icons should be exported at 128x128px (2x for 64px display).

### Phase 1: Foundation (US1 Setup)

1. **Add i18n keys**: Add `rules` section to `src/locales/vi.ts` and `src/locales/en.ts` with all static content from spec
2. **Create RulesPanel shell**: `src/components/rules/RulesPanel.tsx` — Client Component with props `isOpen: boolean`, `onClose: () => void`, `onWriteKudos: () => void`. Implements:
   - Fixed overlay (z-40, clickable to call `onClose()`)
   - Fixed panel (z-50, right-aligned, 553px desktop)
   - Content area (scrollable) + fixed footer
   - `role="dialog"`, `aria-modal="true"`, `aria-label`
   - Escape key listener (calls `onClose()`)
   - Focus trap (Tab cycling)
   - Body scroll lock when `isOpen` is true
   - No router navigation — all actions via prop callbacks
3. **Update FAB**: Change "Thể lệ" from `Link` to `<button>` that toggles RulesPanel sidebar overlay

### Phase 2: Core Content (US1 Complete + US4 + US5)

5. **HeroBadge component**: `src/components/rules/HeroBadge.tsx`
   - Props: `tier: 'new' | 'rising' | 'super' | 'legend'`
   - Renders image-based pill + threshold text (inline) + sub-description (below)
   - Uses `next/image` for badge pill background
6. **CollectionBadge component**: `src/components/rules/CollectionBadge.tsx`
   - Props: `name: string`, `imageSrc: string`
   - Renders circular icon (64px, 2px white border) + label text below
   - Uses `next/image` for icon
7. **CollectionBadgeGrid component**: `src/components/rules/CollectionBadgeGrid.tsx`
   - Renders 3x2 grid with proper spacing
8. **RulesContent**: Wire all sections into RulesPanel with i18n text
   - Section 1: Receiver heading + description + 4x HeroBadge rows
   - Section 2: Sender heading + description + CollectionBadgeGrid + completion text
   - Section 3: Kudos Quốc Dân heading + description

### Phase 3: Actions & Navigation (US2 + US3)

9. **Close button**: Secondary button with `close` Icon + "Đóng" text → calls close handler
10. **Write Kudos button**: Primary gold button with `pencil` Icon + "Viết KUDOS" text → calls `onWriteKudos()` prop callback, which closes the Rules panel and opens the KudoModal. No router navigation needed.
11. **Three dismiss methods**: Verify all work:
    - "Đóng" button click
    - Overlay click
    - Escape key press
12. **Focus management**: Focus moves to panel on open, returns to trigger on close

### Phase 4: Responsive & Polish

13. **Responsive breakpoints**:
    - Mobile (<640px): Full-screen panel, 16px padding, 32px title, stacked buttons
    - Tablet (640-1023px): 80% width panel, 24px padding
    - Desktop (≥1024px): 553px panel, as designed
14. **Animations**: Slide-in from right (300ms ease-out), overlay fade (200ms)
15. **Image optimization**: Verify all badge images use `next/image` with proper sizes, blur placeholder
16. **Accessibility audit**: Verify contrast ratios, heading hierarchy, alt texts, keyboard navigation

### Phase 5: Testing

17. **Integration tests** for RulesPanel:
    - Panel renders with all three sections and correct text
    - Close button dismisses panel
    - Overlay click dismisses panel
    - Escape key dismisses panel
    - "Viết KUDOS" button navigates correctly
    - Content is scrollable with fixed footer
18. **Unit tests** for HeroBadge:
    - Renders correct tier badge image
    - Displays threshold text and description
19. **Responsive tests**: Verify mobile/tablet/desktop layouts

---

## Integration Testing Strategy

### Test Scope

- [x] **Component interactions**: RulesPanel overlay + content scroll + button footer
- [ ] **External dependencies**: None (static content)
- [ ] **Data layer**: None
- [x] **User workflows**: Open panel → read content → close OR navigate to write kudos

### Test Categories

| Category | Applicable? | Key Scenarios |
|----------|-------------|---------------|
| UI ↔ Logic | Yes | Panel open/close state, focus trap, Escape key |
| Service ↔ Service | No | N/A |
| App ↔ External API | No | N/A |
| App ↔ Data Layer | No | N/A |
| Cross-platform | Yes | Responsive layout at 3 breakpoints |

### Test Environment

- **Environment type**: Local (Vitest + jsdom/happy-dom)
- **Test data strategy**: Static fixtures matching i18n locale keys
- **Isolation approach**: Component-level rendering via `@testing-library/react`

### Mocking Strategy

| Dependency Type | Strategy | Rationale |
|-----------------|----------|-----------|
| `onClose` / `onWriteKudos` props | Mock functions | Test close/write actions without real side effects |
| `next/image` | Stub | Avoid image optimization in tests |
| `useLocale` hook | Mock | Control locale output for assertions |

### Test Scenarios Outline

1. **Happy Path**
   - [x] Panel renders with title "Thể lệ" and all 3 sections
   - [x] All 4 Hero badge tiers display with correct threshold text
   - [x] All 6 Collection badges display in 3x2 grid
   - [x] "Đóng" button closes panel (calls onClose)
   - [x] "Viết KUDOS" button calls onWriteKudos

2. **Error Handling**
   - [x] Badge images fail to load → fallback placeholder shown
   - [x] Panel handles rapid open/close without errors

3. **Edge Cases**
   - [x] Escape key closes panel
   - [x] Overlay click closes panel
   - [x] Tab key cycles within panel (focus trap)
   - [x] Content scrolls while footer stays fixed

### Tooling & Framework

- **Test framework**: Vitest + React Testing Library
- **Supporting tools**: `@testing-library/user-event` for keyboard simulation
- **CI integration**: Runs via `yarn test` in pre-deployment checks

### Coverage Goals

| Area | Target | Priority |
|------|--------|----------|
| Core user flows (open/close/navigate) | 90%+ | High |
| Component rendering (badges, content) | 80%+ | Medium |
| Responsive behavior | Manual QA | Medium |

---

## Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Collection badge images unavailable via API export | High (confirmed) | Medium | Manual Figma export or use `get_design_item_image` tool per node |
| "Viết KUDOS" target (Kudo modal) not yet implemented | Medium | Low | Navigate to `/kudos` page as fallback; actual modal can be wired later |
| Montserrat Bold (700) for ALL text looks heavy on small screens | Low | Low | Follow design as-is; flag to designer if readability issues arise |
| Focus trap conflicts with FAB or other global components | Low | Medium | Test focus restore on close; ensure FAB doesn't capture focus while panel is open |

---

## Dependencies & Prerequisites

### Required Before Start

- [x] `constitution.md` reviewed and understood
- [x] `spec.md` approved (status: Reviewed, 4 review rounds)
- [x] `design-style.md` approved (status: Reviewed, 4 review rounds)
- [x] Codebase research completed
- [ ] Collection badge images exported from Figma (6 icons — manual export needed)
- N/A: API contracts — static content
- N/A: Database migrations — no database

### External Dependencies

- Figma access for manual export of 6 collection badge icons (REVIVAL, TOUCH OF LIGHT, STAY GOLD, FLOW TO HORIZON, BEYOND THE BOUNDARY, ROOT FURTHER)

---

## Estimated Complexity

- **Frontend**: Medium (panel with scroll/focus mechanics, 4 components, responsive, animations)
- **Backend**: None
- **Testing**: Low-Medium (no API mocking, mostly UI behavior tests)

---

## Next Steps

After plan approval:

1. **Run** `/momorph.tasks` to generate task breakdown
2. **Export** collection badge images from Figma (manual step)
3. **Download** hero badge pill images (automated via URLs above)
4. **Begin** implementation following task order

---

## Notes

- The FAB component (`FloatingActionButton.tsx`) needs to change the "Thể lệ" item from a `Link` (with `href="/awards/rules"`) to a `<button>` that toggles the RulesPanel sidebar overlay.
- The existing `KudoModal.tsx` is the best reference for overlay + focus trap + Escape key patterns. Reuse the approach but adapt for the dark panel theme.
- All text is bold (700) throughout the panel — this is intentional per design, not a mistake.
- The panel's "Viết KUDOS" action calls `onWriteKudos()` which the parent component uses to open the KudoModal (frame 520:11602).
- Hero badge pill images are available for automated download. Collection badge icons require manual Figma export — this is the only blocker before implementation can begin.
- **Tailwind font class**: The codebase uses `font-[family-name:var(--font-montserrat)]` (not `font-montserrat`). The `design-style.md` implementation mapping references `font-montserrat` for brevity, but actual implementation must use the full Tailwind arbitrary value syntax, or rely on the body font inheritance (Montserrat is set on `<body>` in `layout.tsx`).
- **Spec `scrollPosition` state**: The spec lists `scrollPosition` as local state, but it's not needed in implementation. CSS `overflow-y: auto` handles scrolling natively. No JavaScript scroll tracking required for this feature.
- **Performance (TR-001)**: The 500ms render target is inherently met by static content with no API calls. No special optimization needed beyond standard `next/image` lazy loading for badge images.
