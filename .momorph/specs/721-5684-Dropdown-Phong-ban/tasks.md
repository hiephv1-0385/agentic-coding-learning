# Tasks: Department Dropdown

**Frame**: `721:5684-Dropdown-Phong-ban`
**Prerequisites**: plan.md (required), spec.md (required), design-style.md (required)

---

## Task Format

```
- [ ] T### [P?] [Story?] Description | file/path.ts
```

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this belongs to (US1, US2, US3, US4)
- **|**: File path affected by this task

---

## Phase 1: Setup

**Purpose**: Prepare i18n keys, scrollbar CSS, and verify existing assets before component work begins.

- [x] T001 [P] Add "Tất cả" / "All" translation key to Vietnamese locale — add key `kudos.allDepartments` with value `"Tất cả"` | `src/locales/vi.ts`
- [x] T002 [P] Add "All" translation key to English locale — add key `kudos.allDepartments` with value `"All"` | `src/locales/en.ts`
- [x] T003 [P] Add `::-webkit-scrollbar` styles for the department dropdown in globals.css — gold thumb (`#998C5F`, `border-radius: 3px`, `width: 6px`) on transparent track, scoped to a `.dropdown-scrollbar` utility class or component-specific selector | `src/app/globals.css`
- [x] T004 Verify `chevron-down` icon exists in Icon component — confirm `<Icon name="chevron-down" />` renders correctly (already used by FilterBar). No action if exists; create icon if missing | `src/components/ui/Icon.tsx`

**Checkpoint**: Setup complete — i18n keys and CSS infrastructure ready

---

## Phase 2: Foundation (Blocking Prerequisites)

**Purpose**: Extract the DepartmentDropdown component shell from FilterBar and establish the props interface. FilterBar must remain fully functional after this phase.

**⚠️ CRITICAL**: No styling or accessibility work can begin until this phase is complete.

- [x] T005 Create `DepartmentDropdown.tsx` with props interface and basic render — define `DepartmentDropdownProps` (`departments: Department[]`, `activeDepartment: string`, `onSelect: (dept: string) => void`, `isLoading?: boolean`, `isPending?: boolean`). Render a minimal trigger button showing `activeDepartment` or the "Tất cả" label from `t.kudos.allDepartments`, and a basic list of department options. Use `"use client"` directive. Import `Department` type from `@/types/kudos` and `useLocale` from `@/hooks/useLocale` | `src/components/kudos/DepartmentDropdown.tsx`
- [x] T006 Refactor `FilterBar.tsx` to use `DepartmentDropdown` — replace the inline department dropdown JSX (lines 88-127) with `<DepartmentDropdown departments={departments} activeDepartment={activeDepartment} onSelect={(dept) => updateFilter("department", dept)} isPending={isPending} />`. Add `isLoading` state to track fetch status (`true` initially, `false` after fetch completes or fails). Keep hashtag dropdown inline. Verify URL params, content filtering, and `useTransition` pending state still work end-to-end | `src/components/kudos/FilterBar.tsx`

**Checkpoint**: Foundation ready — DepartmentDropdown renders as a basic functional dropdown inside FilterBar. URL filtering works as before.

---

## Phase 3: User Story 1+2 — Filter by Department + Identify Current Filter (Priority: P1+P2) 🎯 MVP

**Goal**: User can open the dropdown, see "Tất cả" and all departments styled per Figma design, select a department to filter content, and clearly see the current selection in the closed trigger.

**Independent Test**: Open the dropdown on `/kudos`, select "CEVC2", verify trigger shows "CEVC2" with gold border, URL updates to `?department=CEVC2`, and page content filters. Select "Tất cả", verify URL param is removed and all content shows.

### Trigger Button Styling (US1+US2)

- [x] T007 [US1] Style the trigger button per design-style.md — dark bg (`bg-container-dark`), gold border (`border-border`), `rounded-lg`, `p-4`, `min-w-[102px]`, Montserrat bold 16px (`font-[family-name:var(--font-montserrat)] text-base font-bold leading-6 tracking-[0.5px] text-white`). Add `<Icon name="chevron-down" size={16} />` after the text with `transition-transform duration-150` and `rotate-180` class when open. Add hover state: `hover:border-gold-primary`. Add disabled state: `opacity-50 cursor-not-allowed` when `isLoading` or `departments` empty. Add pending dim: `opacity-60` when `isPending` | `src/components/kudos/DepartmentDropdown.tsx`

### Dropdown List Styling (US1)

- [x] T008 [US1] Implement always-rendered dropdown list with CSS transition — render the list `<div>` always (not conditionally). Use `role="listbox"`, `id="dept-listbox"`, `aria-hidden={!isOpen}`. Style: `bg-container-dark border border-border rounded-lg p-1.5`, `max-h-[400px] overflow-y-auto`, `absolute left-0 top-full mt-1 z-20`. Add transition: `transition-all duration-150 ease-out` with `opacity-100 translate-y-0 pointer-events-auto` when open, `opacity-0 -translate-y-1 pointer-events-none` when closed. Apply scrollbar inline style: `{{ scrollbarWidth: "thin", scrollbarColor: "#998C5F #00070C" }}`. Set `min-w-[102px] w-auto whitespace-nowrap` for width adaptation | `src/components/kudos/DepartmentDropdown.tsx`

### Department Option Items (US1)

- [x] T009 [US1] Implement "Tất cả" virtual option as first item — render a `<button>` with `role="option"`, `aria-selected={activeDepartment === ""}`, text from `t.kudos.allDepartments`. Style: `w-full h-14 px-4 rounded flex items-center gap-1 cursor-pointer font-[family-name:var(--font-montserrat)] text-base font-bold leading-6 tracking-[0.5px] text-white`. When selected: `bg-gold-10 [text-shadow:var(--text-shadow-glow)]`. When not selected: `bg-transparent hover:bg-gold-10`. On click: call `onSelect("")` and close dropdown | `src/components/kudos/DepartmentDropdown.tsx`
- [x] T010 [US1] Implement department option items with selected/default states — map `departments` array to `<button>` elements with same styling as T009. Each button: `role="option"`, `aria-selected={activeDepartment === dept.name}`, `tabIndex={isOpen ? 0 : -1}`. Selected state: `bg-gold-10 [text-shadow:var(--text-shadow-glow)]`. Default state: `bg-transparent hover:bg-gold-10`, no text-shadow. On click: call `onSelect(dept.name)` and close dropdown | `src/components/kudos/DepartmentDropdown.tsx`

### Click-Outside & Basic Interaction (US1)

- [x] T011 [US1] Add click-outside close behavior — use `useRef<HTMLDivElement>` for container, `useRef<HTMLButtonElement>` for trigger. Add `useEffect` with `mousedown` listener that closes dropdown if click target is outside container (matching `LanguageSelector.tsx` pattern). On close, return focus to trigger via `triggerRef.current?.focus()` | `src/components/kudos/DepartmentDropdown.tsx`
- [x] T012 [US1] Add trigger button ARIA attributes — set `aria-haspopup="listbox"`, `aria-expanded={isOpen}`, `aria-controls="dept-listbox"`, `aria-label={t.kudos.department}`. Toggle `isOpen` on click. Wrap container `<div>` with `ref={containerRef}` and `className="relative"` | `src/components/kudos/DepartmentDropdown.tsx`

**Checkpoint**: US1+US2 complete — dropdown opens with Figma styling, "Tất cả" + departments visible, selection updates trigger and URL, click-outside closes.

---

## Phase 4: User Story 3 — Browse All Departments (Priority: P2)

**Goal**: User can scroll through ~50 departments and navigate via keyboard. Full accessibility compliance.

**Independent Test**: Open dropdown, press ArrowDown to navigate through options, press Enter to select, press Escape to close. Verify scrollbar appears with gold styling. Verify focus management (open → focus selected, close → focus trigger).

### Keyboard Navigation (US3)

- [x] T013 [US3] Add Escape key handler — `useEffect` listening for `keydown` when `isOpen`. On Escape: close dropdown, focus trigger. Cleanup listener on close (matching `LanguageSelector.tsx` pattern) | `src/components/kudos/DepartmentDropdown.tsx`
- [x] T014 [US3] Add Arrow key navigation with wrap-around — create `optionsRef = useRef<(HTMLButtonElement | null)[]>([])` to track all option elements (including "Tất cả"). On `ArrowDown`: focus next option (`(index + 1) % totalOptions`). On `ArrowUp`: focus previous option (`(index - 1 + totalOptions) % totalOptions`). On trigger `ArrowDown`/`ArrowUp`: open dropdown and focus the currently selected option (or first option). Use `ref` callback to populate `optionsRef.current[index]` for each option button | `src/components/kudos/DepartmentDropdown.tsx`
- [x] T015 [US3] Add Home/End key navigation — in the option `onKeyDown` handler: on `Home` → focus `optionsRef.current[0]`, on `End` → focus `optionsRef.current[totalOptions - 1]`. Prevent default on both keys | `src/components/kudos/DepartmentDropdown.tsx`
- [x] T016 [US3] Add Enter/Space handling on options — each option button already handles click for selection. Add `onKeyDown` handler: on `Enter` → select and close (same as click). The trigger button naturally opens on Enter/Space via native button behavior, but add explicit `onKeyDown` handler for `ArrowDown`/`ArrowUp` to open + focus option | `src/components/kudos/DepartmentDropdown.tsx`

### Focus Management (US3)

- [x] T017 [US3] Implement focus management on open/close — when dropdown opens (`isOpen` transitions to `true`): use `setTimeout(() => optionsRef.current[selectedIndex]?.focus(), 0)` to focus the currently selected option (find `selectedIndex` from `departments` matching `activeDepartment`, or index 0 for "Tất cả"). When dropdown closes: focus returns to trigger (already handled by click-outside and Escape handlers). Add `focus-visible:outline-2 focus-visible:outline-border focus-visible:outline-offset-[-2px]` to all option buttons and trigger | `src/components/kudos/DepartmentDropdown.tsx`

**Checkpoint**: US3 complete — full keyboard navigation, scroll support for ~50 items, focus management, WCAG 2.1 AA compliant.

---

## Phase 5: User Story 4 — Type-ahead Search (Priority: P3)

**Goal**: User can type characters while dropdown is open to jump to matching department.

**Independent Test**: Open dropdown, type "Infra", verify "STVC - Infra" option receives focus.

- [x] T018 [US4] Implement type-ahead character matching — add a `typeAhead` string state and a timeout ref. On `keydown` in the listbox (when `isOpen` and key is a printable character): append character to `typeAhead`, find first department whose `name` starts with the accumulated string (case-insensitive), focus that option. Reset `typeAhead` after 500ms of no typing via `setTimeout`. This is a P3 SHOULD requirement — skip if time-constrained | `src/components/kudos/DepartmentDropdown.tsx`

**Checkpoint**: US4 complete — type-ahead navigation works for ~50 departments.

---

## Phase 6: Edge Cases & Polish

**Purpose**: Handle all edge cases from spec, loading/error states, and viewport overflow.

- [x] T019 [P] Implement loading skeleton state — when `isLoading=true` and `departments.length === 0`: replace trigger text with a `<span className="animate-pulse bg-gold-10 rounded h-4 w-16 inline-block" />` skeleton. Disable trigger (`disabled` attribute, no click handler). Hide dropdown list | `src/components/kudos/DepartmentDropdown.tsx`
- [x] T020 [P] Implement error/empty state — when `isLoading=false` and `departments.length === 0`: show "—" as trigger text, disable trigger, do not open dropdown on click | `src/components/kudos/DepartmentDropdown.tsx`
- [x] T021 Implement "selected department removed" validation — add `useEffect` watching `[departments, activeDepartment]`: if `activeDepartment` is non-empty AND `departments.length > 0` AND `activeDepartment` is not found in `departments.map(d => d.name)`, call `onSelect("")` to reset to "Tất cả". Guard against firing during initial load by checking `departments.length > 0` | `src/components/kudos/DepartmentDropdown.tsx`
- [x] T022 [P] Implement viewport flip behavior — before opening the dropdown, check if there's enough space below the trigger using `triggerRef.current?.getBoundingClientRect()` and `window.innerHeight`. If `bottom + 400 > innerHeight` (400 = max-height), add `bottom-full mb-1` classes instead of `top-full mt-1`. Store position state as `"below" | "above"` | `src/components/kudos/DepartmentDropdown.tsx`

**Checkpoint**: All edge cases handled — loading, error, empty, removed department, viewport overflow.

---

## Phase 7: Testing

**Purpose**: Integration tests following LanguageSelector test pattern using Vitest + @testing-library/react.

- [x] T023 Create test file with fixture data and render helper — set up `DepartmentDropdown.test.tsx` with a `mockDepartments` fixture array (e.g., `[{ id: "1", name: "BDV" }, { id: "2", name: "CEVC1" }, { id: "3", name: "CEVC2" }, { id: "4", name: "STVC - R&D - SDX" }]`), a default `mockOnSelect = vi.fn()`, and a helper that renders the component via `renderWithProviders` from `@/__tests__/test-utils` with default props | `src/components/kudos/__tests__/DepartmentDropdown.test.tsx`
- [x] T024 [P] Test: renders trigger with "Tất cả" when no active department — render with `activeDepartment=""`, verify trigger button shows "Tất cả" text, has `aria-expanded="false"`, has `aria-haspopup="listbox"` | `src/components/kudos/__tests__/DepartmentDropdown.test.tsx`
- [x] T025 [P] Test: opens dropdown and shows all departments + "Tất cả" — click trigger, verify `aria-expanded="true"`, verify "Tất cả" option visible with `role="option"`, verify all mock departments visible in alphabetical order | `src/components/kudos/__tests__/DepartmentDropdown.test.tsx`
- [x] T026 [P] Test: selects department and calls onSelect — click trigger to open, click "CEVC2" option, verify `mockOnSelect` called with `"CEVC2"`, verify dropdown closes (`aria-expanded="false"`) | `src/components/kudos/__tests__/DepartmentDropdown.test.tsx`
- [x] T027 [P] Test: selects "Tất cả" and calls onSelect with empty string — open dropdown, click "Tất cả", verify `mockOnSelect` called with `""` | `src/components/kudos/__tests__/DepartmentDropdown.test.tsx`
- [x] T028 [P] Test: highlights active department with selected styling — render with `activeDepartment="CEVC1"`, open dropdown, verify "CEVC1" option has `aria-selected="true"`, verify "Tất cả" has `aria-selected="false"` | `src/components/kudos/__tests__/DepartmentDropdown.test.tsx`
- [x] T029 [P] Test: click outside closes dropdown — open dropdown, click outside the container, verify dropdown closes and trigger has focus | `src/components/kudos/__tests__/DepartmentDropdown.test.tsx`
- [x] T030 [P] Test: keyboard navigation — open dropdown, press ArrowDown to move focus to next option, press ArrowUp to move back, press Enter to select, verify `mockOnSelect` called. Press Escape, verify dropdown closes and trigger has focus | `src/components/kudos/__tests__/DepartmentDropdown.test.tsx`
- [x] T031 [P] Test: disabled when loading — render with `isLoading=true` and empty `departments`, verify trigger is disabled and shows skeleton, verify clicking trigger does not open dropdown | `src/components/kudos/__tests__/DepartmentDropdown.test.tsx`
- [x] T032 [P] Test: disabled when empty (error state) — render with `isLoading=false` and empty `departments`, verify trigger shows "—" and is disabled | `src/components/kudos/__tests__/DepartmentDropdown.test.tsx`
- [x] T033 [P] Test: auto-resets when active department not in list — render with `activeDepartment="REMOVED_DEPT"` and `mockDepartments`, verify `mockOnSelect` is called with `""` (auto-reset to "Tất cả") | `src/components/kudos/__tests__/DepartmentDropdown.test.tsx`
- [x] T034 Run `yarn test` and verify all tests pass with zero failures — fix any failing tests before marking complete | terminal

**Checkpoint**: All 11 tests pass. Component is fully tested and ready for code review.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies — T001-T004 can start immediately, all parallel
- **Phase 2 (Foundation)**: Depends on T001+T002 (i18n keys) — T005 then T006 sequentially
- **Phase 3 (US1+US2)**: Depends on Phase 2 — T007→T008→T009→T010→T011→T012 mostly sequential (same file)
- **Phase 4 (US3)**: Depends on Phase 3 — T013→T014→T015→T016→T017 sequential (same file, building on interaction handlers)
- **Phase 5 (US4)**: Depends on Phase 4 — T018 standalone (optional, P3)
- **Phase 6 (Polish)**: Depends on Phase 3 minimum — T019, T020, T022 are parallel; T021 depends on T010
- **Phase 7 (Testing)**: Depends on Phase 3+4+6 — T023 first, then T024-T033 all parallel, T034 last

### Within Each Phase

```
Phase 1:  T001 ──┐
          T002 ──┤ (all parallel)
          T003 ──┤
          T004 ──┘

Phase 2:  T005 → T006

Phase 3:  T007 → T008 → T009 → T010 → T011 → T012

Phase 4:  T013 → T014 → T015 → T016 → T017

Phase 5:  T018 (optional)

Phase 6:  T019 ──┐
          T020 ──┤ (parallel)
          T022 ──┘
          T021 (after T010)

Phase 7:  T023 → [T024..T033] (all parallel) → T034
```

### Parallel Opportunities

- **Phase 1**: All 4 tasks in parallel (different files)
- **Phase 6**: T019, T020, T022 in parallel (independent edge cases, same file but different code paths)
- **Phase 7**: T024-T033 all in parallel (independent test cases in same file)
- **Cross-phase**: Phase 6 (T019-T020) can start after Phase 3 (don't need Phase 4 keyboard nav for loading/error states)

---

## Implementation Strategy

### MVP First (Recommended)

1. Complete Phase 1 + 2 (Setup + Foundation)
2. Complete Phase 3 (US1+US2 — filtering + trigger display)
3. **STOP and VALIDATE**: Open `/kudos`, test dropdown styling, selection, URL params, content filtering
4. Deploy if ready — core filtering works with Figma styling

### Incremental Delivery

1. Phase 1 + 2 → Foundation ready
2. Phase 3 (US1+US2) → Test → Deploy (**MVP**)
3. Phase 4 (US3) → Test → Deploy (keyboard + accessibility)
4. Phase 5 (US4) → Test → Deploy (type-ahead, optional)
5. Phase 6 → Edge cases hardened
6. Phase 7 → Full test coverage

---

## Notes

- All tasks target a SINGLE file (`DepartmentDropdown.tsx`) for Phases 3-6. Tasks are sequential within these phases because each builds on the previous (same component). Parallel markers are only on truly independent tasks.
- The "Tất cả" i18n key name `kudos.allDepartments` is a suggestion — check if `kudos.clearFilter` already serves this purpose. If so, reuse it. If the UX intent is different ("All" vs "Clear filter"), create the new key.
- `LanguageSelector.tsx` and `ProfileDropdown.tsx` are the primary reference implementations. Read both before starting Phase 3.
- The spec says `role="combobox"` but the plan recommends `aria-haspopup="listbox"` button pattern (matching LanguageSelector). Follow the plan, not the spec, for ARIA correctness.
- Department `name` field IS the code (e.g., "CEVC2"). No mapping needed.
- Commit after each phase completion, not after each task (since most tasks modify the same file).
