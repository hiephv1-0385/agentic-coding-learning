# Tasks: Profile Dropdown Menu

**Frame**: `721:5223-dropdown-profile`
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

## Phase 1: Setup (Design Tokens & Locale Keys)

**Purpose**: Add design tokens and locale strings required by all subsequent phases. No code logic — pure configuration.

- [x] T001 [P] Add 4 new design tokens (`--color-gold-25`, `--color-gold-15`, `--color-gold-05`, `--shadow-dropdown`) to `@theme inline` block | src/app/globals.css
- [x] T002 [P] Add `:root` block with 2 CSS custom properties for text-shadow glow (`--text-shadow-glow`, `--text-shadow-glow-hover`) after the `@keyframes` blocks | src/app/globals.css
- [x] T003 [P] Add `logout: "Logout"` and `logoutError: "Failed to logout. Please try again."` to `header` section | src/locales/en.ts
- [x] T004 [P] Add `logout: "Đăng xuất"` and `logoutError: "Đăng xuất thất bại. Vui lòng thử lại."` to `header` section, and update `TranslationKeys` type to include both new keys | src/locales/vi.ts

**Checkpoint**: All tokens and locale strings ready. `yarn build` passes.

---

## Phase 2: User Story 3 + User Story 1 — Open/Close Dropdown + Profile Navigation (Priority: P1) 🎯 MVP

**Goal**: Render a profile dropdown that opens/closes on click, supports keyboard navigation, and navigates to `/profile` via `next/link`. Includes auth visibility check (FR-007) from the start to avoid retroactive test breakage.

**Independent Test**: Click profile trigger → dropdown opens with "Profile" and "Logout" items → click "Profile" → navigates to `/profile` and dropdown closes. Click outside or press Escape → dropdown closes.

### Tests First (US3+US1)

- [x] T005 [US3] Create test file with mock setup: mock `createClient` (returns `auth.getUser()` resolving to valid user), mock `useRouter`, mock `useLocale`. Write tests: renders trigger with `aria-haspopup="menu"` and `aria-expanded="false"`; opens dropdown on click with correct ARIA; focus moves to first menuitem on open; closes on outside click; closes on Escape (focus returns to trigger) | src/__tests__/shared/ProfileDropdown.test.tsx
- [x] T006 [US1] Add tests to existing file: Profile item has `role="menuitem"` and links to `/profile`; clicking Profile closes dropdown | src/__tests__/shared/ProfileDropdown.test.tsx

### Implementation (US3+US1)

- [x] T007 [US3] Create `ProfileDropdown.tsx` with `"use client"` directive. Implement: auth check via `useEffect` + `getUser()` (returns `null` if unauthenticated); `isOpen` state; trigger button (`aria-haspopup="menu"`, `aria-expanded`, `aria-label={t.header.profile}`, `w-10 h-10` icon-only button with `onKeyDown` for ArrowDown/ArrowUp); dropdown container (`role="menu"`, `aria-label`, `aria-hidden`, absolute positioned with fade/slide animation); Logout item as static `role="menuitem"` button placeholder (no handler yet). Include outside-click `useEffect`, Escape-key `useEffect`, focus-on-open `useEffect` watching `isOpen`, and `onKeyDown` handler on items for ArrowDown/ArrowUp/Escape/Space. Use `useRef<(HTMLElement | null)[]>([])` for items ref (mixed Link + button types). Reference: LanguageSelector.tsx pattern. See plan.md Phase 1 points 1-10 for exact classes and behavior. | src/components/shared/ProfileDropdown.tsx
- [x] T008 [US1] Add Profile item as `<Link href="/profile" role="menuitem">` with `onClick={() => setIsOpen(false)}`, `tabIndex={isOpen ? 0 : -1}`. Layout: `group w-full min-h-14 flex items-center gap-1 p-4 rounded cursor-pointer bg-gold-10 hover:bg-gold-20 active:bg-gold-25 transition-colors duration-150 ease-in-out`. Label span with text-shadow glow: `[text-shadow:var(--text-shadow-glow)] group-hover:[text-shadow:var(--text-shadow-glow-hover)]` and inline `style={{ transition: "text-shadow 150ms ease-in-out" }}`. Font: `font-[family-name:var(--font-montserrat)] text-base font-bold leading-6 tracking-[0.15px] text-white`. Icon: `<Icon name="user" size={24} />` with `text-text-glow`. Focus: `focus-visible:outline-2 focus-visible:outline-gold-primary focus-visible:outline-offset-2`. See plan.md Phase 1 point 5. | src/components/shared/ProfileDropdown.tsx

### Verification (US3+US1)

- [x] T009 [US3] Run `yarn vitest src/__tests__/shared/ProfileDropdown.test.tsx` — all Phase 2 tests pass (green). Fix any failures.

**Checkpoint**: Dropdown opens/closes, Profile navigates to `/profile`. Component renders nothing when unauthenticated (auth check baked in). All tests green.

---

## Phase 3: User Story 2 — Logout from Application (Priority: P1)

**Goal**: Clicking "Logout" calls `supabase.auth.signOut()`, shows a loading spinner, disables both items, and redirects to `/login` on success. On failure, shows error toast and re-enables items.

**Independent Test**: Open dropdown → click "Logout" → spinner appears, items disabled → redirects to `/login`. Force signOut error → error toast appears, items re-enabled.

### Tests First (US2)

- [x] T010 [US2] Add tests to existing file: clicking Logout calls `signOut()`; shows spinner replacing chevron icon during logout; both items disabled (`opacity-50`, `pointer-events-none`) during logout; redirects to `/login` on success; shows error toast on failure; re-enables items after error; double-click doesn't call `signOut` twice | src/__tests__/shared/ProfileDropdown.test.tsx

### Implementation (US2)

- [x] T011 [US2] Add logout functionality to `ProfileDropdown.tsx`: add `isLoggingOut` and `errorMessage` state; add `useRouter()` from `next/navigation`; implement `handleLogout` async handler with `isLoggingOut` guard, `createClient().auth.signOut()`, `router.push("/login")` on success, error toast on catch (see plan.md Phase 2 point 2 for exact code). Replace chevron icon with spinner when `isLoggingOut` (`w-6 h-6 animate-spin rounded-full border-2 border-text-glow border-t-transparent`). Add disabled state conditional classes: Profile item `bg-gold-05 opacity-50 pointer-events-none cursor-default` when logging out, Logout item `opacity-50 pointer-events-none cursor-default`. Render `<Toast message={errorMessage ?? ""} isVisible={!!errorMessage} onClose={() => setErrorMessage(null)} />`. | src/components/shared/ProfileDropdown.tsx

### Verification (US2)

- [x] T012 [US2] Run `yarn vitest src/__tests__/shared/ProfileDropdown.test.tsx` — all tests pass including new logout tests. Fix any failures.

**Checkpoint**: Full logout flow works. Error handling with toast. Loading states correct. All tests green.

---

## Phase 4: Auth Visibility + Header Integration (FR-007)

**Purpose**: Add auth-specific test coverage and integrate `ProfileDropdown` into the Header, replacing the static profile button.

### Tests (Auth)

- [x] T013 Add auth visibility tests: renders nothing when `getUser` returns `{ data: { user: null }, error: null }`; renders trigger when authenticated | src/__tests__/shared/ProfileDropdown.test.tsx

### Header Integration

- [x] T014 Replace static profile button (lines 96-103) in Header with `<ProfileDropdown />`. Add `import ProfileDropdown from "@/components/shared/ProfileDropdown"`. Remove unused `Icon` import if no other usage remains. | src/components/shared/Header.tsx

### Verification

- [x] T015 Run `yarn vitest` (full suite) — all existing tests still pass plus new auth tests. Run `yarn build` — no TypeScript errors. Visually verify dropdown appears in browser (authenticated) and is absent (unauthenticated/public pages).

**Checkpoint**: ProfileDropdown integrated into Header. Auth visibility confirmed. No regressions.

---

## Phase 5: Polish & Accessibility

**Purpose**: Focus trap, outline verification, and accessibility audit.

### Tests (A11Y)

- [x] T016 [P] Add accessibility tests: focus-visible outline renders on keyboard nav; Tab wraps within dropdown (focus trap — last item Tab → first item, first item Shift+Tab → last item); screen reader structure (`role="menu"`, `role="menuitem"`). Optional: add axe-core audit test (`vitest-axe` or `jest-axe`). | src/__tests__/shared/ProfileDropdown.test.tsx

### Implementation (A11Y)

- [x] T017 Implement focus trap in `onKeyDown` handler: on last item Tab → focus first item, on first item Shift+Tab → focus last item (2 items, simple wrap). Verify `focus-visible:outline-2 focus-visible:outline-gold-primary focus-visible:outline-offset-2` matches spec (`2px solid #FFEA9E`, `2px offset`). Verify Toast has `role="status"` and `aria-live="polite"` (already built-in). Note: Focus trap deviates from WAI-ARIA menu button standard (which says Tab should close menu) — this follows spec.md explicit requirement. | src/components/shared/ProfileDropdown.tsx

### Final Verification

- [x] T018 Run full test suite: `yarn vitest`. Run build: `yarn build`. Run lint: `yarn lint`. All must pass with zero errors. Final manual check: open dropdown via click and keyboard, navigate items, logout flow, outside click, Escape.

**Checkpoint**: Feature complete. All 20 test scenarios pass. Accessibility verified. Ready for code review.

---

## Dependencies & Execution Order

### Phase Dependencies

```
Phase 1 (Setup) ─────────────────► Phase 2 (US3+US1 Core) ──► Phase 3 (US2 Logout) ──► Phase 4 (Header Integration) ──► Phase 5 (Polish)
  T001-T004 (parallel)                T005-T009                  T010-T012                T013-T015                       T016-T018
```

- **Phase 1**: No dependencies — start immediately. All 4 tasks are parallel (different files/sections).
- **Phase 2**: Depends on Phase 1 (tokens + locale keys must exist). Tests before implementation (TDD).
- **Phase 3**: Depends on Phase 2 (component must exist to add logout logic).
- **Phase 4**: Depends on Phase 3 (full component must work before Header integration).
- **Phase 5**: Depends on Phase 4 (all features integrated before polishing a11y).

### Within Each Phase (TDD Order)

1. Write tests (RED — tests fail because component doesn't exist or feature isn't implemented)
2. Implement code (GREEN — make tests pass)
3. Verify (run tests, fix if needed)

### Parallel Opportunities

| Phase | Parallel Tasks | Reason |
|-------|---------------|--------|
| Phase 1 | T001, T002, T003, T004 | Different files/sections, no dependencies |
| Phase 2 | T005, T006 | Both write to test file but different sections (can be combined) |
| Phase 5 | T016 can start while T017 is WIP | Test-first: write tests before implementation |

---

## Implementation Strategy

### MVP First (Recommended)

1. Complete Phase 1 (Setup — 4 tasks, all parallel)
2. Complete Phase 2 (US3+US1 — dropdown opens/closes, Profile navigates)
3. **STOP and VALIDATE**: Dropdown works for open/close/navigate
4. Complete Phase 3 (US2 — logout flow)
5. Complete Phase 4 (Header integration)
6. Complete Phase 5 (Accessibility polish)

### Single Developer Flow

All phases are sequential for a single developer. Estimated: ~18 tasks across 5 phases. Each phase builds on the previous one. Commit after each phase checkpoint.

### Commit Strategy

| After Phase | Commit Message |
|-------------|---------------|
| Phase 1 | `feat(auth): add design tokens and locale keys for profile dropdown` |
| Phase 2 | `feat(auth): implement profile dropdown with open/close and profile navigation` |
| Phase 3 | `feat(auth): add logout functionality with loading state and error handling` |
| Phase 4 | `feat(auth): integrate profile dropdown into header` |
| Phase 5 | `feat(auth): add focus trap and accessibility polish to profile dropdown` |

---

## Notes

- **TDD is mandatory** (constitution): every implementation task has preceding test tasks.
- **Reference**: `src/components/shared/LanguageSelector.tsx` is the primary pattern to follow. Key deviation: `useRef<(HTMLElement | null)[]>([])` (not `HTMLButtonElement`) due to mixed `<Link>` + `<button>` items.
- **Auth from start**: The auth check (`getUser()` in `useEffect`) is included in Phase 2 (not deferred) to prevent retroactive test breakage. All tests mock `createClient` with a valid user by default.
- **Text-shadow**: Uses CSS custom properties + Tailwind arbitrary properties with `group`/`group-hover` pattern. See plan.md "Text-Shadow Approach" section.
- **Focus trap vs WAI-ARIA**: Spec requires focus trap; WAI-ARIA says Tab should close menu. Follow the spec. Document the deviation.
- Commit after each phase. Run `yarn vitest` and `yarn build` at every checkpoint.
