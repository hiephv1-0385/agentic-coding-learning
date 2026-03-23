# Implementation Plan: Profile Dropdown Menu

**Frame**: `721:5223-dropdown-profile`
**Date**: 2026-03-13
**Spec**: `specs/721_5223-dropdown-profile/spec.md`

---

## Summary

A client-side dropdown menu triggered from the existing profile button in the Header component, providing "Profile" (navigate to `/profile`) and "Logout" (Supabase `signOut()` + redirect) actions. The implementation follows the same pattern as the existing `LanguageSelector` component — custom state management, keyboard navigation, outside-click detection, and Tailwind-based styling using existing design tokens.

**Key difference from LanguageSelector**: This dropdown uses WAI-ARIA **menu button pattern** (`role="menu"` / `role="menuitem"`) instead of the listbox pattern (`role="listbox"` / `role="option"`) used by LanguageSelector. The behavioral patterns (state, keyboard nav, outside click, animation) are reused; the ARIA semantics differ.

---

## Technical Context

**Language/Framework**: TypeScript (strict) / Next.js 15 App Router
**Primary Dependencies**: React 19, TailwindCSS 4.x, @supabase/ssr
**Database**: N/A (reads Supabase Auth session only)
**Testing**: Vitest + React Testing Library
**State Management**: Local `useState` (isOpen, isLoggingOut, isAuthenticated, errorMessage)
**API Style**: Supabase Auth SDK (client-side `signOut()`)

---

## Constitution Compliance Check

*GATE: Must pass before implementation can begin*

| Constitution Rule | Plan Compliance | Notes |
|---|---|---|
| TypeScript strict mode | ✅ | All new files in TypeScript |
| `"use client"` only when needed | ✅ | Component uses state + event handlers → requires directive |
| `@/*` path alias, no deep relative imports | ✅ | All imports use `@/` prefix |
| PascalCase components, camelCase hooks | ✅ | `ProfileDropdown.tsx` |
| Folder structure: `src/components/[feature]/` | ✅ | `src/components/shared/` (co-located with Header) |
| No dead code | ✅ | Removes static profile button from Header |
| Tailwind utilities only, design tokens not arbitrary values | ⚠️ | 4 new tokens added to `globals.css`. Two exceptions require Tailwind arbitrary properties: `font-[family-name:var(--font-montserrat)]` (established pattern from LanguageSelector) and `[text-shadow:...]` for Profile glow (CSS `text-shadow` has no Tailwind utility). Both are unavoidable. |
| Avoid `useEffect` for data fetching | ⚠️ | `getUser()` in `useEffect` for auth visibility check. Pragmatic exception: Header is `"use client"`, no Server Component wrapper available. This is a session state check, not traditional data fetching. |
| `next/link` for all internal navigation | ✅ | Profile item uses `next/link` |
| `@/libs/supabase/client.ts` for client-side auth | ✅ | Logout uses `createClient()` from this path |
| Server Components by default, `"use client"` only when needed | ✅ | This component requires browser APIs → `"use client"` justified |
| Test-First Development (TDD) | ✅ | Tests written alongside each phase (Red-Green-Refactor) |
| Mock external services at boundary | ✅ | Supabase client mocked; internal modules (Icon, Link) not mocked |
| Security: no secrets in client code | ✅ | Only `NEXT_PUBLIC_*` env vars via Supabase client |
| Conventional Commits | ✅ | Feature branch + `feat(auth): add profile dropdown menu` |

**Acknowledged Trade-offs**: Two items marked ⚠️ above are pragmatic exceptions with justifications. No outright violations.

---

## Architecture Decisions

### Frontend Approach

- **Component Structure**: Single `ProfileDropdown` client component in `src/components/shared/`. Self-contained with internal state, refs, keyboard handling, and outside-click detection — same pattern as `LanguageSelector.tsx`.
- **Styling Strategy**: Tailwind utilities using existing design tokens. Four new tokens needed in `globals.css` (see below). Two unavoidable arbitrary properties: `font-[family-name:var(--font-montserrat)]` (established codebase pattern) and `[text-shadow:...]` for Profile glow (no Tailwind utility for CSS `text-shadow`).
- **Data Fetching**: No data fetching. The dropdown receives no props. The Header already renders within authenticated contexts.
- **Routing**: `useRouter` from `next/navigation` for logout redirect; `next/link` for Profile navigation.

### Why a Single Component (Not Atomic Decomposition)

The dropdown has only two fixed menu items with no reuse elsewhere. Extracting `DropdownItem` atoms would add indirection without benefit, matching the constitution's "avoid premature abstraction" principle. The `LanguageSelector` follows the same single-component pattern.

### ARIA Pattern: Menu Button (Not Listbox)

The LanguageSelector uses `role="listbox"` / `role="option"` (selection pattern). This dropdown uses `role="menu"` / `role="menuitem"` (action pattern) per WAI-ARIA menu button spec, because the items trigger actions (navigate, logout), not selections. Key differences:
- Trigger: `aria-haspopup="menu"` (not `"listbox"` or `"true"`)
- Container: `role="menu"` (not `"listbox"`)
- Items: `role="menuitem"` (not `"option"`)
- No `aria-selected` — items are actions, not selectable

### Auth Visibility (FR-007)

The Header component currently renders unconditionally. The `ProfileDropdown` component itself handles FR-007 ("Dropdown MUST only be visible to authenticated users") through its placement — it replaces the profile button in the Header, which is only meaningful in authenticated contexts. The middleware (`src/middleware.ts`) already protects routes like `/kudos`, but since the Header appears on all pages (including public ones like `/`), the `ProfileDropdown` trigger button should be **conditionally rendered** based on auth state. This requires the Header to receive an `isAuthenticated` prop or the dropdown to check session internally.

**Decision**: The `ProfileDropdown` component will check auth session internally using `supabase.auth.getUser()` via a `useEffect`. If no session, it renders nothing (`null`). This keeps the Header API unchanged and isolates auth logic within the dropdown.

### Error Handling: Toast Integration

The existing `Toast.tsx` component (`src/components/ui/Toast.tsx`) accepts `message`, `isVisible`, and `onClose` props. The `ProfileDropdown` will manage toast state internally (`errorMessage: string | null`) and render `<Toast>` within itself for logout errors. This avoids lifting toast state to the Header.

### Session-Expired Edge Case

When a user clicks "Profile" but their session has expired, the middleware will intercept the `/profile` route request and redirect to `/login?redirect=/profile`. No special handling needed in the dropdown — `next/link` navigation triggers a full route transition where middleware runs. For "Logout" with expired session, `signOut()` may throw or no-op; the catch block shows an error toast and re-enables menu items. The user can retry or navigate elsewhere — middleware will redirect to login on any protected route access. This keeps the error handling uniform (no special-casing expired vs network errors).

### Text-Shadow Approach (Profile Glow)

The Profile label requires CSS `text-shadow` (not `box-shadow`). Tailwind has no `text-shadow` utility, so this needs special handling.

**Default state glow**: `text-shadow: 0 4px 4px rgba(0,0,0,0.25), 0 0 6px #FAE287`
**Hover state glow**: `text-shadow: 0 4px 4px rgba(0,0,0,0.25), 0 0 10px #FAE287` (radius increases 6px → 10px)

Since inline `style` cannot respond to `:hover`, use CSS custom properties + Tailwind arbitrary properties:

1. Define two CSS variables in `globals.css` (NOT in `@theme`, just as regular CSS vars since they're for `text-shadow` which Tailwind doesn't support):
   ```css
   :root {
     --text-shadow-glow: 0 4px 4px rgba(0,0,0,0.25), 0 0 6px #FAE287;
     --text-shadow-glow-hover: 0 4px 4px rgba(0,0,0,0.25), 0 0 10px #FAE287;
   }
   ```
2. Apply `group` class on the Profile item row (Link element), then on the **label span**:
   ```
   [text-shadow:var(--text-shadow-glow)] group-hover:[text-shadow:var(--text-shadow-glow-hover)]
   ```
   Using `group-hover` ensures hovering anywhere on the row (icon, padding) triggers the glow change, matching design-style's "states applied to the menu item row, not individual children".
3. For transitions: the row uses Tailwind `transition-colors duration-150 ease-in-out` for `background-color`. The label span needs a separate inline `style={{ transition: "text-shadow 150ms ease-in-out" }}` since `text-shadow` is not covered by Tailwind utilities and is not an inherited CSS property.

**Alternatively**, if Tailwind arbitrary hover feels too hacky, follow the Header's precedent (line 63-69) and use inline `style` for the default glow only, accepting that the hover glow intensification won't animate smoothly. The default glow is the critical visual requirement; the hover intensification is enhancement.

### Design Token Mapping: design-style.md → Existing Tokens

The design-style.md's Implementation Mapping table uses semantic token names (e.g., `bg-dropdown-bg`, `border-dropdown-border`, `bg-profile-item-bg`) that do NOT exist in the project. The plan deliberately reuses existing equivalent tokens to avoid duplication:

| design-style.md Token | Existing Tailwind Token | Hex Value |
|---|---|---|
| `bg-dropdown-bg` | `bg-container-dark` | `#00070C` |
| `border-dropdown-border` | `border-border` | `#998C5F` |
| `bg-profile-item-bg` | `bg-gold-10` | `rgba(255,234,158,0.10)` |
| `hover:bg-item-hover-bg` | `hover:bg-gold-20` | `rgba(255,234,158,0.20)` |
| `font-montserrat` | `font-[family-name:var(--font-montserrat)]` | Montserrat 700 |
| `shadow-dropdown` | `shadow-dropdown` (NEW) | `0 10px 15px rgba(0,0,0,0.3)` |

No new semantic color tokens are created — existing ones cover all values.

### Integration Points

- **Existing Components**:
  - `Header.tsx` (line ~96): Replace the static profile `<button>` with `<ProfileDropdown />`
  - `Icon.tsx`: Already has `"user"` and `"chevron-right"` icons
  - `Toast.tsx`: Used for logout error messages
- **Existing Tokens** (already in `globals.css`):
  - `--color-container-dark: #00070C` → dropdown background (`bg-container-dark`)
  - `--color-border: #998C5F` → dropdown gold border (`border-border`)
  - `--color-gold-10: rgba(255,234,158,0.10)` → profile item bg + logout hover bg (`bg-gold-10`)
  - `--color-gold-20: rgba(255,234,158,0.20)` → profile item hover bg (`bg-gold-20`)
  - `--color-text-white: #FFFFFF` → menu text (`text-white`)
  - `--color-text-glow: #FAE287` → icon color (`text-text-glow`)
  - `--shadow-gold-glow` → exists but is `box-shadow` — **cannot be used** for Profile label's `text-shadow`. See "Text-Shadow Approach" below.
- **New Tokens** (to add to `globals.css`):
  - `--color-gold-25: rgba(255, 234, 158, 0.25)` → Profile item active/pressed state
  - `--color-gold-15: rgba(255, 234, 158, 0.15)` → Logout item active/pressed state
  - `--color-gold-05: rgba(255, 234, 158, 0.05)` → disabled state
  - `--shadow-dropdown: 0 10px 15px rgba(0, 0, 0, 0.3)` → container elevation
- **Supabase Client**: `@/libs/supabase/client.ts` — `createClient()` for `signOut()` and `getUser()`
- **Routing**: `next/link` for Profile item; `useRouter` from `next/navigation` for logout redirect
- **Localization**: `t.header.profile` already exists. Two new keys needed: `t.header.logout` and `t.header.logoutError`.

---

## Project Structure

### Documentation (this feature)

```text
.momorph/specs/721_5223-dropdown-profile/
├── spec.md              # Feature specification
├── design-style.md      # Design specifications
├── plan.md              # This file
├── tasks.md             # Task breakdown (next step)
└── assets/
    └── frame.png        # Figma reference screenshot
```

### Source Code (affected areas)

```text
src/
├── app/
│   └── globals.css                          # MODIFY: add 4 new Tailwind tokens + 2 CSS custom properties for text-shadow
├── components/
│   ├── shared/
│   │   ├── Header.tsx                       # MODIFY: replace static profile <button> (lines 96-103) with <ProfileDropdown />
│   │   └── ProfileDropdown.tsx              # NEW: dropdown component ("use client", ~160 lines)
│   └── ui/
│       └── Toast.tsx                        # EXISTING: used for logout error messages (no changes)
├── locales/
│   ├── en.ts                                # MODIFY: add `logout` + `logoutError` to header section
│   └── vi.ts                                # MODIFY: add `logout` + `logoutError` to header section + update TranslationKeys type
└── __tests__/
    └── shared/
        └── ProfileDropdown.test.tsx         # NEW: integration tests (~200 lines)
```

---

## Implementation Strategy

> **TDD Approach**: Each phase follows Red-Green-Refactor. Write failing tests first, then implement to make them pass, then refactor. Test files are created in Phase 1 and grown incrementally.

### Phase 0: Asset & Token Preparation

1. Add 4 new design tokens to `globals.css` `@theme inline` block:
   ```css
   --color-gold-25: rgba(255, 234, 158, 0.25);
   --color-gold-15: rgba(255, 234, 158, 0.15);
   --color-gold-05: rgba(255, 234, 158, 0.05);
   --shadow-dropdown: 0 10px 15px rgba(0, 0, 0, 0.3);
   ```
2. Add 2 CSS custom properties for text-shadow (in `:root` block, NOT in `@theme` — Tailwind doesn't support text-shadow):
   ```css
   --text-shadow-glow: 0 4px 4px rgba(0,0,0,0.25), 0 0 6px #FAE287;
   --text-shadow-glow-hover: 0 4px 4px rgba(0,0,0,0.25), 0 0 10px #FAE287;
   ```
3. Add locale keys to `header` section:
   - `en.ts`: `logout: "Logout"`, `logoutError: "Failed to logout. Please try again."`
   - `vi.ts`: `logout: "Đăng xuất"`, `logoutError: "Đăng xuất thất bại. Vui lòng thử lại."`
   - Update `TranslationKeys` type in `vi.ts` to include both new keys
4. No media assets needed — `"user"` and `"chevron-right"` icons already exist in `Icon.tsx`

### Phase 1: Core Component — Open/Close + Profile Navigation (US3 + US1)

> **Note on auth mocking**: All tests from Phase 1 onward MUST mock `createClient` to return `auth.getUser()` resolving to a valid user. This is because the auth visibility check (FR-007) is baked into the component from the start — not deferred to Phase 3. Deferring auth to Phase 3 would cause all Phase 1/2 tests to break retroactively when the `useEffect` + `getUser()` call is added. Instead, include the `isAuthenticated` state and `getUser()` check in the initial Phase 1 implementation, and mock it in all tests.

**Tests first** (create `src/__tests__/shared/ProfileDropdown.test.tsx`):
- Mock setup: `createClient` returns mock with `auth.getUser()` resolving to `{ data: { user: { id: "test" } }, error: null }`
- Renders trigger button with `aria-haspopup="menu"` and `aria-expanded="false"`
- Opens dropdown on trigger click (`aria-expanded="true"`, `role="menu"` visible)
- Focus moves to first menuitem when dropdown opens via click
- Closes on outside click
- Closes on Escape key, returns focus to trigger
- Profile item has `role="menuitem"` and links to `/profile`
- Closes dropdown when Profile item is clicked

**Then implement** `ProfileDropdown.tsx`:

1. **Auth check + early return**: `const [isAuthenticated, setIsAuthenticated] = useState(false)`. On mount, `useEffect` calls `createClient().auth.getUser()` — if user exists, `setIsAuthenticated(true)`. Before the JSX return, `if (!isAuthenticated) return null`.
2. **Wrapper**: `<div ref={containerRef} className="relative">` (same as LanguageSelector)
3. **Trigger button**: Icon-only button, `aria-haspopup="menu"`, `aria-expanded={isOpen}`, `aria-label={t.header.profile}` (required — icon-only button needs label for screen readers):
   - Styles: `w-10 h-10 flex items-center justify-center text-white hover:text-gold-primary transition-colors rounded-full` (preserved from current Header button)
   - Keyboard: `onKeyDown` handler — ArrowDown/ArrowUp opens dropdown and focuses first item (same pattern as LanguageSelector `handleTriggerKeyDown`, lines 86-93)
4. **Dropdown container**: `role="menu"`, `aria-label={t.header.profile}`, `aria-hidden={!isOpen}`, positioned `absolute right-0 top-full mt-1 z-50`, styled with `bg-container-dark border border-border rounded-lg p-1.5 shadow-dropdown flex flex-col items-start`, 150ms fade/slide animation:
   ```
   transition-all duration-150 ease-out
   isOpen ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 -translate-y-1 pointer-events-none"
   ```
5. **Profile item**: `<Link href="/profile" role="menuitem">` with `onClick={() => setIsOpen(false)}`, `tabIndex={isOpen ? 0 : -1}` (prevents focus when hidden):
   - Layout: `group w-full min-h-14 flex items-center gap-1 p-4 rounded cursor-pointer` (note: `group` class enables group-hover for child text-shadow)
   - Default bg: `bg-gold-10`, hover: `hover:bg-gold-20`, active: `active:bg-gold-25`
   - Label text glow: Applied on the **label span** (not the row): `[text-shadow:var(--text-shadow-glow)] group-hover:[text-shadow:var(--text-shadow-glow-hover)]`. Uses `group-hover` because design-style specifies states are "applied to the menu item row, not individual children" — hovering anywhere on the row (including the icon area) must trigger the glow intensification.
   - Transition on the **row** (Link element): `transition-colors duration-150 ease-in-out` (Tailwind utility handles `background-color`). Transition on the **label span**: `style={{ transition: "text-shadow 150ms ease-in-out" }}` — must be on the span where `text-shadow` is applied, since `text-shadow` is not inherited and needs its own transition declaration.
   - Font: `font-[family-name:var(--font-montserrat)] text-base font-bold leading-6 tracking-[0.15px] text-white`
   - Icon: `<Icon name="user" size={24} />` with `text-text-glow` (gold #FAE287)
   - Focus: `focus-visible:outline-2 focus-visible:outline-gold-primary focus-visible:outline-offset-2`
6. **Logout item placeholder**: Static `role="menuitem"` button (logout logic in Phase 2), `tabIndex={isOpen ? 0 : -1}`:
   - Layout: `w-full min-h-14 flex items-center gap-1 p-4 rounded cursor-pointer`
   - Default bg: transparent, hover: `hover:bg-gold-10`, active: `active:bg-gold-15`
   - Transition: `transition-colors duration-150 ease-in-out` (same as Profile row — design-style specifies 150ms ease-in-out for Logout hover)
   - Font: same as Profile item, no text-shadow
   - Icon: `<Icon name="chevron-right" size={24} />` with `text-text-glow`
   - Focus: same as Profile item
7. **Outside click**: `useEffect` with `mousedown` listener (same pattern as LanguageSelector lines 53-64)
8. **Escape key**: `useEffect` with `keydown` listener (same pattern as LanguageSelector lines 67-78)
9. **Focus management**: Focus first menuitem on open via a `useEffect` watching `isOpen` — NOT in the click handler or keyboard handler alone:
   ```tsx
   useEffect(() => {
     if (isOpen) setTimeout(() => itemsRef.current[0]?.focus(), 0);
   }, [isOpen]);
   ```
   This ensures focus moves on ALL open methods (click, ArrowDown, ArrowUp). **Deviation from LanguageSelector**: LanguageSelector focuses items only in `handleTriggerKeyDown` (keyboard open, line 91), not on click open. The WAI-ARIA menu button pattern requires focus to move into the menu on any open method.
   Return focus to trigger on close (handled by outside-click and Escape handlers calling `triggerRef.current?.focus()`).
10. **Keyboard navigation**: `onKeyDown` handler on items — ArrowDown/ArrowUp cycle between items, Escape closes, Space key activates the focused item. **Important**: `<Link>` renders `<a>` which only responds to Enter natively — Space must be handled explicitly by calling `e.preventDefault()` then `element.click()` to match WAI-ARIA menuitem behavior.

### Phase 2: Logout Functionality (US2)

**Tests first** (add to existing test file):
- Clicking Logout calls `supabase.auth.signOut()`
- Shows spinner (replacing chevron icon) during logout
- Both menu items disabled during logout (`pointer-events-none`, `opacity-50`)
- Redirects to `/login` on successful signOut
- Shows error toast on signOut failure
- Re-enables items after error
- Double-click doesn't call signOut twice

**Then implement**:

1. **State**: Add `isLoggingOut: boolean` (default `false`), `errorMessage: string | null` (default `null`)
2. **Logout handler**:
   ```typescript
   const handleLogout = async () => {
     if (isLoggingOut) return; // guard against double-click
     setIsLoggingOut(true);
     setErrorMessage(null);
     try {
       const supabase = createClient();
       const { error } = await supabase.auth.signOut();
       if (error) throw error;
       router.push("/login");
     } catch {
       setErrorMessage(t.header.logoutError);
       setIsLoggingOut(false);
     }
   };
   ```
3. **Loading spinner**: When `isLoggingOut`, replace chevron-right icon with a `<span className="w-6 h-6 animate-spin rounded-full border-2 border-text-glow border-t-transparent" />` (24x24, #FAE287 gold, matches design-style loading state)
4. **Disabled state**: When `isLoggingOut`:
   - Both items: `opacity-50 pointer-events-none cursor-default`
   - Profile item bg changes from `bg-gold-10` to `bg-gold-05` (design-style line 154: disabled bg = `rgba(255,234,158,0.05)`)
   - Logout item bg stays `transparent` (no change needed)
   - Implement via conditional className: `isLoggingOut ? "bg-gold-05 opacity-50 pointer-events-none cursor-default" : "bg-gold-10 ..."`
5. **Error toast**: Render `<Toast message={errorMessage ?? ""} isVisible={!!errorMessage} onClose={() => setErrorMessage(null)} />` within the component. Note: `errorMessage` is `string | null` but `Toast.message` expects `string` — the nullish coalescing `?? ""` satisfies TypeScript strict mode (Toast returns `null` when `isVisible` is `false` anyway).
6. **Router**: `const router = useRouter()` from `next/navigation`

### Phase 3: Auth Visibility Tests + Header Integration (FR-007)

> Auth check (`isAuthenticated` state + `getUser()`) was already implemented in Phase 1 (see note above). This phase adds the auth-specific tests and integrates with the Header.

**Tests first** (add to existing test file):
- Renders nothing when user is not authenticated (`getUser` returns `{ data: { user: null }, error: null }`)
- Renders trigger button when user is authenticated (`getUser` returns valid user)

**Then implement**:

1. **Auth visibility tests**: Override the default mock to return `null` user and verify component renders nothing.
2. **Header modification** (`Header.tsx` lines 95-103): Replace:
   ```tsx
   {/* Profile */}
   <button type="button" ... >
     <Icon name="user" size={24} />
   </button>
   ```
   With:
   ```tsx
   {/* Profile Dropdown */}
   <ProfileDropdown />
   ```
3. **Import**: Add `import ProfileDropdown from "@/components/shared/ProfileDropdown"` to Header
4. **Z-index**: Header is `z-50`, dropdown container also `z-50` — since dropdown is positioned within the header's stacking context, it renders above the header content. No z-index conflict.

### Phase 4: Polish & Accessibility

**Tests first**:
- Focus-visible outline renders correctly on keyboard navigation
- Tab wraps within dropdown (focus trap)
- Screen reader announces menu structure (`role="menu"`, `role="menuitem"`)

**Then implement**:

1. **Focus-visible outlines**: Already added in Phase 1 (`focus-visible:outline-2 focus-visible:outline-gold-primary focus-visible:outline-offset-2`). Verify they match spec: `2px solid #FFEA9E`, `2px offset`.
2. **Focus trap**: On last item, Tab moves to first item; on first item, Shift+Tab moves to last item (2 items only, so simple wrap logic). **Note**: The WAI-ARIA menu button pattern standard says Tab should close the menu and move focus to the next element in the tab order. However, spec.md (line 105) explicitly requires "Focus trap within dropdown when open". The plan follows the spec's explicit requirement. If accessibility audit (SC-004) flags this, revisit with the team.
3. **Disabled state styles**: Already implemented in Phase 2 (point 4). Verify Profile bg changes to `bg-gold-05` and both items show `opacity-50`.
4. **ARIA live region**: Toast already has `role="status"` and `aria-live="polite"` — logout errors are automatically announced
5. **Viewport boundary**: `right-0` positioning anchors dropdown to right edge of trigger — prevents right overflow. No left overflow possible given header padding.

### Reference Implementation: LanguageSelector.tsx

Key patterns reused from `src/components/shared/LanguageSelector.tsx`:
- **State**: `useState(false)` for open/close (line 44)
- **Refs**: `useRef` for container, trigger, items array (lines 45-47). **Type difference**: LanguageSelector uses `(HTMLButtonElement | null)[]` for items since all options are `<button>`. ProfileDropdown items mix `<Link>` (renders `<a>` = `HTMLAnchorElement`) and `<button>` = `HTMLButtonElement`, so type the items ref as `useRef<(HTMLElement | null)[]>([])` to cover both.
- **Outside click**: `useEffect` + `mousedown` on document (lines 53-64)
- **Escape key**: `useEffect` + `keydown` on document (lines 67-78)
- **Keyboard nav**: `onKeyDown` with ArrowDown/ArrowUp modular wrap (lines 95-111)
- **Animation**: `transition-all duration-150 ease-out` + opacity/translateY toggle (line 145)
- **Trigger**: `aria-haspopup`, `aria-expanded`, toggle on click (lines 115-139)
- **Item styling**: `p-4 flex items-center gap-1 rounded text-white font-[family-name:var(--font-montserrat)] text-base font-bold leading-6 tracking-[0.15px]` (line 157)

**Key differences**:
- ARIA: `role="menu"` / `role="menuitem"` (not listbox/option)
- Profile item: `<Link>` with `onClick` to close (not `<button>`)
- Logout item: async handler with loading state
- Auth check: renders `null` when unauthenticated
- Toast: renders error toast for logout failures

---

## Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| signOut fails silently | Low | High | Try/catch with error toast + re-enable items; test with mocked failure |
| Dropdown overlaps viewport edge | Low | Low | `right-0` positioning anchors to right; dropdown is ~130px wide |
| Focus trap conflicts with header elements | Low | Medium | Scope keyboard listeners to dropdown only; test Tab behavior |
| LanguageSelector + ProfileDropdown both open | Low | Low | Each has independent outside-click close; clicking one closes the other |
| Auth check causes flicker (renders null then trigger) | Medium | Low | Check runs once on mount; brief flash acceptable for dropdown trigger |

### Estimated Complexity

- **Frontend**: Medium (keyboard nav, focus management, loading states, auth check)
- **Backend**: None
- **Testing**: Medium (mock Supabase signOut + getUser, keyboard event simulation)

---

## Integration Testing Strategy

### Test Scope

- [x] **Component interactions**: Trigger ↔ Dropdown ↔ Menu items ↔ Toast
- [x] **External dependencies**: Supabase Auth signOut + getUser
- [ ] **Data layer**: N/A
- [x] **User workflows**: Open → Navigate/Logout → Close

### Test Categories

| Category | Applicable? | Key Scenarios |
|----------|-------------|---------------|
| UI ↔ Logic | Yes | Toggle open/close, loading state during logout, disabled items, auth visibility |
| Service ↔ Service | Yes | signOut call + redirect |
| App ↔ External API | Yes | Supabase signOut success/failure, getUser for auth check |
| App ↔ Data Layer | No | — |

### Test Environment

- **Environment type**: Local (Vitest + jsdom)
- **Test data strategy**: Mock Supabase client (`createClient` returns mock with `auth.signOut()` and `auth.getUser()`)
- **Isolation approach**: Fresh component render per test; mock reset between tests

### Mocking Strategy

| Dependency Type | Strategy | Rationale |
|-----------------|----------|-----------|
| `@/libs/supabase/client` | Mock (`vi.mock`) | Constitution: "Mock external services at the boundary" |
| `next/link` | Real | Internal module — renders anchor tag |
| `next/navigation` (`useRouter`) | Mock (`vi.mock`) | Need to verify `router.push("/login")` call |
| `@/components/ui/Icon` | Real | Internal module — renders SVG |
| `@/components/ui/Toast` | Real | Internal module — renders DOM |
| `@/hooks/useLocale` | Mock (`vi.mock`) | Return `{ t: { header: { profile: "Profile", logout: "Logout", logoutError: "Failed to logout" } }, locale: "en", setLocale: vi.fn() }` — avoids LocaleProvider context setup |

### Test Scenarios Outline

1. **Happy Path**
   - [ ] Renders nothing when user is unauthenticated (getUser returns null)
   - [ ] Renders trigger button when user is authenticated
   - [ ] Dropdown opens on trigger click with correct ARIA attributes
   - [ ] Focus moves to first menuitem when dropdown opens
   - [ ] Dropdown closes on outside click
   - [ ] Dropdown closes on Escape key (focus returns to trigger)
   - [ ] Profile item navigates to `/profile` and closes dropdown
   - [ ] Logout calls signOut, shows spinner, redirects to `/login` on success

2. **Error Handling**
   - [ ] Logout failure shows error toast, re-enables items
   - [ ] Double-click on Logout doesn't call signOut twice (isLoggingOut guard)

3. **Keyboard Navigation**
   - [ ] Arrow Down moves focus from first to second item
   - [ ] Arrow Up moves focus from second to first item
   - [ ] Enter/Space on Profile item triggers navigation
   - [ ] Enter/Space on Logout item triggers logout
   - [ ] Tab wraps within dropdown (focus trap)

4. **Edge Cases**
   - [ ] Rapid trigger clicks toggle correctly (no debounce needed — state is synchronous)

5. **Accessibility**
   - [ ] Trigger has `aria-haspopup="menu"` and `aria-expanded`
   - [ ] Container has `role="menu"` and `aria-label`
   - [ ] Items have `role="menuitem"`
   - [ ] Automated axe-core audit passes with zero violations (SC-004)

### Coverage Goals

| Area | Target | Priority |
|------|--------|----------|
| Core open/close/navigate flows | 90%+ | High |
| Keyboard navigation | 85%+ | High |
| Auth visibility | 90%+ | High |
| Error scenarios | 80%+ | Medium |
| Loading/disabled states | 80%+ | Medium |

---

## Dependencies & Prerequisites

### Required Before Start

- [x] `constitution.md` reviewed and understood
- [x] `spec.md` approved (status: Reviewed)
- [x] `design-style.md` finalized (6 review passes)
- [x] Icon component has required icons (`user`, `chevron-right`) — verified in `Icon.tsx`
- [x] Supabase client exists (`@/libs/supabase/client.ts`) — verified
- [x] Header component has profile button placeholder (lines 96-103) — verified
- [x] Toast component exists (`src/components/ui/Toast.tsx`) — verified
- [x] LanguageSelector reference pattern exists — verified

### External Dependencies

- Supabase Auth service (for `signOut()` and `getUser()`)

---

## Next Steps

After plan approval:

1. **Run** `/momorph.tasks` to generate task breakdown
2. **Review** tasks.md for parallelization opportunities
3. **Begin** implementation following TDD per phase

---

## Notes

- The `LanguageSelector.tsx` component is the primary reference implementation — it already solves dropdown state, keyboard nav, outside click, and animations in the project's established pattern. The key difference is ARIA roles (menu vs listbox).
- Most design tokens already exist in `globals.css`. Only 4 new Tailwind tokens are needed (`--color-gold-25`, `--color-gold-15`, `--color-gold-05`, `--shadow-dropdown`) plus 2 CSS custom properties for text-shadow glow (`--text-shadow-glow`, `--text-shadow-glow-hover`).
- The profile text glow is a **default state** (always visible), not an active-route indicator.
- No new dependencies are required. Everything is built with existing project tooling.
- The `/profile` page is predicted/new — it may not exist yet. The dropdown should still link to it; middleware handles unauthenticated access.
- `t.header.profile` already exists in locale files. Two new keys needed: `t.header.logout` and `t.header.logoutError`.
