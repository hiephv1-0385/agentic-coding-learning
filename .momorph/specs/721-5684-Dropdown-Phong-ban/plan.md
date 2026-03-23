# Implementation Plan: Department Dropdown

**Frame**: `721:5684-Dropdown-Phong-ban`
**Date**: 2026-03-19
**Spec**: `specs/721-5684-Dropdown-Phong-ban/spec.md`

---

## Summary

Restyle and enhance the existing department filter dropdown in `FilterBar.tsx` to match the Figma design (dark theme, gold border, glow effect on selected item). The current implementation is functional (data fetching, URL params, content filtering all work) but visually basic. This plan extracts the department dropdown into a standalone `DepartmentDropdown` component following the same architecture as `LanguageSelector.tsx` — adding ARIA roles, keyboard navigation, click-outside behavior, open/close animation, and the "Tất cả" (All) virtual option.

**Key insight**: This is primarily a **restyling + accessibility enhancement**, not a greenfield build. The data pipeline (API → URL params → content filter) is already fully wired.

---

## Technical Context

**Language/Framework**: TypeScript / Next.js 15 (App Router)
**Primary Dependencies**: React 19, TailwindCSS 4.x, Supabase
**Database**: PostgreSQL (Supabase) — `departments` table already exists
**Testing**: Vitest + @testing-library/react
**State Management**: URL search params (via `useSearchParams` + `useRouter`) + local component state
**API Style**: REST (Next.js Route Handlers)

---

## Constitution Compliance Check

*GATE: Must pass before implementation can begin*

- [x] **TypeScript strict mode** — Component will be `.tsx` with strict types
- [x] **Folder structure** — `src/components/kudos/DepartmentDropdown.tsx` follows feature-scoped pattern
- [x] **Naming** — PascalCase component, camelCase hook
- [x] **Client Component** — `"use client"` required for click handlers and state (TR-004)
- [x] **TailwindCSS only** — All styling via utility classes, design tokens from `globals.css`
- [x] **Responsive** — 3 breakpoints (mobile-first), 56px touch targets
- [x] **Security** — Auth check in existing API route, no secrets exposed
- [x] **Testing** — Integration tests for happy path + error scenarios

**Violations**: None

---

## Architecture Decisions

### Frontend Approach

- **Component Structure**: Extract `DepartmentDropdown` from `FilterBar.tsx` into its own component at `src/components/kudos/DepartmentDropdown.tsx`. FilterBar keeps both dropdowns but delegates to the new component.
- **Styling Strategy**: TailwindCSS utility classes using existing design tokens from `globals.css` (`container-dark`, `border`, `gold-10`, `gold-20`). The selected item glow effect uses `[text-shadow:var(--text-shadow-glow)]` — an existing CSS variable already used by `ProfileDropdown.tsx`. No custom values needed.
- **Data Fetching**: Keep the existing pattern — `FilterBar` fetches departments via `fetch("/api/departments")` in `useEffect` and passes the list as props to `DepartmentDropdown`. No new API calls needed.
- **Pattern Reference**: Follow `LanguageSelector.tsx` architecture for:
  - Always-rendered list with CSS transitions (opacity + translate-y)
  - `useRef` for container, trigger, and option elements
  - `useEffect` for click-outside and Escape key handlers
  - Arrow key navigation with wrap-around
  - ARIA roles (`role="listbox"`, `role="option"`, `aria-selected`, `aria-expanded`)

### Backend Approach

- **API**: `/api/departments` already exists and returns `{ data: Department[] }` sorted by `name ASC`. The `Department` type (`{ id: string, name: string }`) is already defined in `src/types/kudos.ts`.
- **Database**: `departments` table exists with RLS enabled. No schema changes needed.
- **Key mapping**: The DB/API uses `name` (not `code`). Spec references to "department code" map to `Department.name`. The API already sorts by `name ASC` which satisfies the spec's "alphabetical by code" requirement since department names ARE the codes (e.g., "CEVC2", "OPD", "STVC - R&D"). No schema change needed.

### Integration Points

- **Existing Service**: `FilterBar.tsx` — already fetches departments and manages URL params
- **Existing Hook**: `useKudosFeed.ts` — already reads `department` URL param for content filtering
- **Existing Page**: `src/app/kudos/page.tsx` — already passes `department` search param to child components
- **Shared Pattern**: `LanguageSelector.tsx` — UI architecture reference (dropdown behavior, ARIA, keyboard nav)
- **Design Tokens**: All colors (`container-dark`, `border`, `gold-10`, `gold-20`) and text effects (`--text-shadow-glow`, `--text-shadow-glow-hover`) already defined in `globals.css`
- **i18n**: Translation keys `t.kudos.department` and `t.kudos.clearFilter` already exist

---

## Project Structure

### Documentation (this feature)

```text
.momorph/specs/721-5684-Dropdown-Phong-ban/
├── spec.md              # Feature specification ✅
├── design-style.md      # Design specifications ✅
├── plan.md              # This file ✅
├── tasks.md             # Task breakdown (next step)
└── assets/              # Reference screenshots ✅
```

### Source Code (affected areas)

```text
# New Files
src/components/kudos/DepartmentDropdown.tsx           # Main component
src/components/kudos/__tests__/DepartmentDropdown.test.tsx  # Tests

# Modified Files
src/components/kudos/FilterBar.tsx                    # Extract dept dropdown, pass props + isLoading state
src/locales/vi.ts                                     # Add "Tất cả" translation key
src/locales/en.ts                                     # Add "All" translation key
src/app/globals.css                                   # Add ::-webkit-scrollbar styles for dropdown (if needed)
```

### Dependencies

No new dependencies needed. All infrastructure exists:

| Dependency | Version | Status |
|------------|---------|--------|
| React | 19.x | ✅ Exists |
| TailwindCSS | 4.x | ✅ Exists |
| Vitest + @testing-library/react | Latest | ✅ Exists |
| next/navigation (useSearchParams, useRouter) | 15.x | ✅ Exists |

---

## Implementation Strategy

### Phase 0: Asset Preparation

- No media assets needed. The component is text-only (no icons except the existing chevron-down from `Icon` component).
- Verify the `chevron-down` icon exists in the `Icon` component.

### Phase 1: Foundation — Extract Component Shell

**Goal**: Create `DepartmentDropdown.tsx` with the correct props interface and basic render, integrated into `FilterBar`.

1. Define the component interface:
   ```typescript
   interface DepartmentDropdownProps {
     departments: Department[];
     activeDepartment: string;        // from URL param
     onSelect: (department: string) => void;  // calls updateFilter("department", value)
     isLoading?: boolean;             // true while departments are being fetched
     isPending?: boolean;             // true during URL transition (from useTransition)
   }
   ```
   - `onSelect("")` = select "Tất cả" (clears URL param, shows all)
   - `onSelect("CEVC2")` = select a department (sets URL param)
   - `isLoading=true` + empty `departments` = show skeleton trigger (initial fetch)
   - `isPending=true` = dim the component (URL update in progress)
2. Create `DepartmentDropdown.tsx` as a Client Component
3. Move department-specific JSX from `FilterBar.tsx` into the new component
4. Update `FilterBar.tsx` to render `<DepartmentDropdown />` with props
5. Verify existing functionality still works (URL params, content filtering)

### Phase 2: Core Styling + Accessibility (US1 — P1, US3 — P2)

**Goal**: Apply Figma design styling AND build accessibility in from the start. The `LanguageSelector` proves these are inseparable — its ARIA, keyboard nav, and click-outside handlers are structurally part of the component, not bolt-ons. Build them together.

**Styling:**
1. **Trigger button**: Dark bg (`bg-container-dark`), gold border (`border-border`), rounded-lg, Montserrat bold 16px, chevron icon with rotation animation
2. **Dropdown list**: Same dark bg + gold border, `rounded-lg p-1.5`, `max-h-[400px] overflow-y-auto`, always-rendered with CSS transition (opacity + translate-y)
3. **"Tất cả" option**: Virtual first item, same style as department items. Add i18n key for "Tất cả" / "All"
4. **Selected item**: `bg-gold-10` background + glow text-shadow using existing CSS variable: `[text-shadow:var(--text-shadow-glow)]` (already defined in `globals.css` and used by `ProfileDropdown.tsx`)
5. **Default items**: Transparent bg, white text, `hover:bg-gold-10`
6. **Item dimensions**: `w-full h-14 px-4 rounded` (56px tall, touch-friendly)
7. **Custom scrollbar**: No Tailwind scrollbar plugin is installed. Use inline `style={{ scrollbarWidth: "thin", scrollbarColor: "#998C5F #00070C" }}` (matching `LeaderboardCard.tsx` pattern which uses `scrollbarWidth: "thin"`). Add `::-webkit-scrollbar` styles in `globals.css` for Chrome/Safari support.
8. **Width**: `min-w-[102px] w-auto whitespace-nowrap` — adapts to longest department name

**Accessibility (built into the component structure from the start):**
9. **ARIA roles**: Trigger is a `<button>` with `aria-haspopup="listbox"`, `aria-expanded`, `aria-controls="dept-listbox-id"`, and `aria-label={t.kudos.department}` for screen reader context (matching `LanguageSelector` which uses `aria-label={t.header.selectLanguage}`). List gets `role="listbox"`, `id="dept-listbox-id"`, `aria-hidden={!isOpen}`. Options get `role="option"`, `aria-selected`.
   > **Spec deviation**: The spec says `role="combobox"` on the trigger, but `combobox` is semantically for **editable text inputs** that open a popup (like `SearchPill.tsx`). Since the department dropdown is a non-editable select, the button + `aria-haspopup="listbox"` pattern is correct (matching `LanguageSelector.tsx`). This deviation is intentional for ARIA correctness.
10. **Click-outside**: `useRef` + `useEffect` with `mousedown` listener (same as LanguageSelector)
11. **Escape key**: Close dropdown, return focus to trigger
12. **Arrow keys**: Navigate options with wrap-around (ArrowDown/ArrowUp)
13. **Home/End**: Jump to first/last option
14. **Enter/Space**: Open dropdown from trigger; select option from list
15. **Focus management**: On open → focus selected option. On close → focus trigger.
16. **Focus visible**: `focus-visible:outline-2 focus-visible:outline-border focus-visible:outline-offset-[-2px]`
17. **Type-ahead (P3)**: If time permits, add letter-based option focusing

### Phase 3: Edge Cases & Polish

**Goal**: Handle all edge cases from spec.

1. **Loading state**: When `isLoading=true` and `departments` is empty, show skeleton pulse on trigger (disabled)
2. **Error state**: Disabled trigger with "—" text if fetch fails (FilterBar passes empty array + `isLoading=false`)
3. **Empty list**: Disabled trigger, no dropdown opens
4. **Selected department removed**: If `activeDepartment` is set (from URL param) but not found in the `departments` list, auto-call `onSelect("")` to reset to "Tất cả". Implement as a `useEffect` watching `departments` and `activeDepartment` — runs after departments load to validate the active selection.
5. **Viewport overflow**: Use flip behavior (if dropdown overflows bottom, open upward)
6. **Rapid selection**: Already handled by `useTransition` in FilterBar — `isPending` state naturally debounces
7. **Open/close animation**: `transition-all duration-150 ease-out` (opacity + translate-y) — already built into Phase 2

### Phase 4: Testing

**Goal**: Integration tests matching the LanguageSelector test pattern.

1. **Render test**: Component renders with trigger showing "Tất cả" by default
2. **Open/close**: Click trigger opens list, click outside closes
3. **Selection**: Click department → trigger updates → onSelect called with correct value
4. **"Tất cả" selection**: Click "Tất cả" → onSelect called with empty string
5. **Keyboard**: ArrowDown/ArrowUp navigate, Enter selects, Escape closes
6. **Active department**: Pre-selected department highlighted with correct styles
7. **Loading state**: Shows skeleton when departments array is empty and loading
8. **ARIA**: Verify role attributes and aria-selected states

---

## Integration Testing Strategy

### Test Scope

- [x] **Component interactions**: DepartmentDropdown ↔ FilterBar (props passing, callback invocation)
- [x] **User workflows**: Open → browse → select → URL updates → content filters
- [ ] **External dependencies**: API mocked (per constitution: mock external services at boundary)
- [ ] **Data layer**: N/A (no direct DB access from component)

### Test Categories

| Category | Applicable? | Key Scenarios |
|----------|-------------|---------------|
| UI ↔ Logic | Yes | Trigger display, selection state, keyboard navigation |
| App ↔ External API | No | API already tested; mock `fetch` in component tests |
| Cross-platform | Yes | Responsive rendering at mobile/desktop breakpoints |

### Test Environment

- **Environment**: Local (Vitest + jsdom)
- **Test data**: Fixture array of `Department[]` passed as props
- **Isolation**: Fresh render per test, `cleanup()` between tests

### Mocking Strategy

| Dependency Type | Strategy | Rationale |
|-----------------|----------|-----------|
| `next/navigation` | Mock (vitest.setup.ts) | Already mocked globally — useRouter, useSearchParams |
| `fetch("/api/departments")` | Not needed | Data passed as props from FilterBar |
| `useLocale` | Wrapped via `renderWithProviders` | Already supported by test-utils.tsx |

### Test Scenarios Outline

1. **Happy Path**
   - [x] Renders closed trigger with "Tất cả" when no active department
   - [x] Opens dropdown showing all departments sorted alphabetically
   - [x] Selects department and calls onSelect with department name
   - [x] Selects "Tất cả" and calls onSelect with empty string
   - [x] Highlights active department with selected styling

2. **Error Handling**
   - [x] Shows disabled state when departments list is empty
   - [x] Handles rapid clicks without breaking state

3. **Edge Cases**
   - [x] Keyboard navigation (Arrow keys, Enter, Escape, Home/End)
   - [x] Click outside closes dropdown
   - [x] Long department names don't truncate
   - [x] Active department not in list → auto-resets to "Tất cả" (calls onSelect(""))

### Tooling & Framework

- **Test framework**: Vitest + @testing-library/react
- **Supporting tools**: `renderWithProviders` from `src/__tests__/test-utils.tsx`
- **CI integration**: `yarn test` (already in pre-deploy checks per constitution)

### Coverage Goals

| Area | Target | Priority |
|------|--------|----------|
| Core user flows (open, select, close) | 90%+ | High |
| Keyboard accessibility | 85%+ | High |
| Edge cases (empty, loading) | 75%+ | Medium |

---

## Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Scrollbar styling inconsistent across browsers | Medium | Low | Use both `scrollbar-width: thin` (Firefox) and `::-webkit-scrollbar` (Chrome/Safari). Test on both. |
| Viewport flip behavior complexity | Low | Low | Start with simple bottom positioning. Add flip only if dropdown renders near page bottom in Kudos page context. |
| Department names wider than parent container on mobile | Low | Medium | `whitespace-nowrap` + `w-auto` lets dropdown expand. If truly too wide, max-width with horizontal scroll as fallback. |
| Breaking existing FilterBar functionality | Low | High | Extract incrementally — keep FilterBar working at each step. Run existing tests after each change. |

### Estimated Complexity

- **Frontend**: Medium (restyling + accessibility + keyboard nav)
- **Backend**: None (API exists, no changes needed)
- **Testing**: Medium (9-12 test cases following established patterns)

---

## Dependencies & Prerequisites

### Required Before Start

- [x] `constitution.md` reviewed and understood
- [x] `spec.md` reviewed (4 rounds)
- [x] `design-style.md` reviewed (4 rounds)
- [x] Codebase research completed
- [x] API endpoint exists (`/api/departments`)
- [x] Database table exists (`departments`)
- [x] Design tokens exist in `globals.css`
- [x] Font (Montserrat) configured in `layout.tsx`
- [x] i18n infrastructure ready

### External Dependencies

None — all infrastructure is in place.

---

## Next Steps

After plan approval:

1. **Run** `/momorph.tasks` to generate task breakdown
2. **Review** tasks.md for parallelization opportunities
3. **Begin** implementation following task order

---

## Notes

- The existing `FilterBar.tsx` department dropdown is **functional but unstyled**. It uses basic conditional rendering (`{showDeptDropdown && ...}`) without transitions, no ARIA roles, no keyboard navigation, and no glow effect on selected item.
- The `LanguageSelector.tsx` is the **architectural gold standard** — same visual theme, same Figma component set (`186:1426`), fully accessible. The department dropdown should mirror its patterns.
- The API returns departments as `{ id: string, name: string }` — the `name` field IS the department code (e.g., "CEVC2", "STVC - R&D"). No separate `code` field exists. Spec references to "code" map to `name`.
- The `--text-shadow-glow` CSS variable in `globals.css` (`0 4px 4px rgba(0,0,0,0.25), 0 0 6px #FAE287`) is the EXACT text-shadow needed for the selected item glow. Use it via `[text-shadow:var(--text-shadow-glow)]` — the same pattern already used by `ProfileDropdown.tsx:171`. Do NOT use `shadow-nav-active` — that's a `box-shadow` token (different CSS property, same value).
- `FilterBar` currently uses `useTransition` for URL updates which already handles the "rapid selection" edge case — the pending state naturally debounces visual updates.
