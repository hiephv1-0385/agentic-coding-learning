# Implementation Plan: Language Dropdown

**Frame**: `721:4942-dropdown-ngon-ngu`
**Date**: 2026-03-13
**Spec**: `specs/721_4942-dropdown-ngon-ngu/spec.md`

---

## Summary

A language selector dropdown (VN/EN) for the global header. **Most of the component already exists** in `src/components/shared/LanguageSelector.tsx` with full functionality (cookie persistence, keyboard navigation, ARIA attributes, click-outside/Escape handling) and 9 passing tests. The primary work is **restyling** the component to match the design-style.md specifications (dark container, gold border, 110px items, selected highlight) and **integrating** it into the Header component to replace the current static placeholder.

---

## Technical Context

**Language/Framework**: TypeScript / Next.js (App Router)
**Primary Dependencies**: React, TailwindCSS 4.x
**Database**: N/A (client-side only)
**Testing**: Vitest + React Testing Library
**State Management**: Local component state (useState)
**API Style**: N/A (no API calls)

---

## Constitution Compliance Check

*GATE: Must pass before implementation can begin*

- [x] Follows project coding conventions (TypeScript strict, Client Component)
- [x] Uses approved libraries and patterns (no new dependencies needed)
- [x] Adheres to folder structure guidelines (`src/components/shared/`)
- [x] Meets security requirements (cookie-based, client-side only)
- [x] Follows testing standards (Vitest, existing test file)

**Violations (if any)**:

| Violation | Justification | Alternative Rejected |
|-----------|---------------|---------------------|
| `w-[108px]`/`w-[110px]` fixed widths on trigger and items | Design spec requires exact pixel widths (108px trigger, 110px items) for visual consistency. These are small UI elements, not layout containers — constitution's "no fixed pixel widths" targets containers/layouts. | `w-auto` would cause width shifts on language switch (VN vs EN text widths differ) |
| Tests in Phase 4 (not Phase 1) | Existing component has 9 passing tests covering all behavior. This is a restyling task — TDD applies to new behavior, not CSS class changes. Phase 4 adds style-specific tests only. | Writing all tests first would duplicate the 9 existing tests |

---

## Architecture Decisions

### Frontend Approach

- **Component Structure**: Update existing `LanguageSelector.tsx` — no new component files needed
- **Styling Strategy**: TailwindCSS utility classes using existing CSS variables from `globals.css` (`--color-container-dark`, `--color-border`, `--color-gold-10`)
- **Data Fetching**: N/A — purely client-side state with cookie persistence

### Integration Points

- **Header Component**: Replace static placeholder (lines 89-98 in `Header.tsx`) with `<LanguageSelector />` import
- **Root Layout**: Update `lang` attribute in `src/app/layout.tsx` to be dynamic based on cookie (currently hardcoded to `"vi"`)
- **Existing CSS Variables**: Leverage tokens already defined in `globals.css`:
  - `--color-container-dark: #00070C` → dropdown background
  - `--color-border: #998C5F` → dropdown border
  - `--color-gold-10: rgba(255, 234, 158, 0.10)` → hover state

### What Already Exists (No Changes Needed)

The following functionality is **already implemented** in `LanguageSelector.tsx`:
- VN/EN toggle with SVG flag icons
- Cookie persistence (`locale=vi|en`)
- Click-outside close
- Escape key close
- Keyboard navigation (ArrowUp/ArrowDown)
- ARIA attributes (`role="listbox"`, `aria-expanded`, `aria-selected`, `aria-haspopup="listbox"`)
- Chevron rotation animation
- Montserrat font usage via CSS variable

### What Needs to Change

| Area | Current | Target (design-style.md) |
|------|---------|--------------------------|
| Dropdown bg | `bg-page-bg` | `bg-container-dark` (#00070C) |
| Dropdown border | `border-footer-border` | `border-border` (#998C5F) |
| Dropdown padding | `py-1` | `p-1.5` (6px) |
| Dropdown radius | `rounded` | `rounded-lg` (8px) |
| Item width | `w-full min-w-[80px]` | `w-[110px]` |
| Item height | auto | `h-14` (56px) |
| Item padding | `px-3 py-2` | `p-4` (16px) |
| Selected bg | text color only | `bg-gold-20` (new token, rgba(255,234,158,0.2)) with `rounded-sm` |
| Hover bg | `hover:text-gold-primary` | `hover:bg-gold-10` (existing token) |
| Flag icon size | 20x14px | 24x24px container |
| Icon-text gap | `gap-2` | `gap-1` (4px) |
| Selected text color | `text-gold-primary` | `text-white` (all items white) |
| Focus style | `outline-gold-primary` | `outline-2 outline-border outline-offset-[-2px]` (uses existing `--color-border` token) |
| Trigger style | simple flex with gap-1.5 | 108px trigger with p-4, justify-between, chevron 24px |
| Dropdown animation | instant show/hide | opacity + transform 150ms ease-out |

---

## Project Structure

### Documentation (this feature)

```text
.momorph/specs/721_4942-dropdown-ngon-ngu/
├── spec.md              # Feature specification ✅
├── design-style.md      # Design specifications ✅
├── plan.md              # This file ✅
├── tasks.md             # Task breakdown (next step)
└── assets/              # Screenshots
    └── frame.png        # Figma frame image ✅
```

### Source Code (affected areas)

```text
src/
├── components/shared/
│   ├── LanguageSelector.tsx          # MODIFY - Restyle to match design
│   ├── Header.tsx                    # MODIFY - Replace placeholder with LanguageSelector
│   └── __tests__/
│       └── LanguageSelector.test.tsx # MODIFY - Update/add tests for styling
├── app/
│   ├── globals.css                   # MODIFY - Add --color-gold-20 token
│   └── layout.tsx                    # MODIFY - Dynamic lang attribute
```

### New Files

None required.

### Modified Files

| File | Changes |
|------|---------|
| `src/app/globals.css` | Add `--color-gold-20: rgba(255, 234, 158, 0.20)` token in `@theme inline` block |
| `src/components/shared/LanguageSelector.tsx` | (1) Restyle trigger: w-[108px] h-14, p-4, justify-between, text-base, 24x24 chevron. (2) Restyle dropdown: bg-container-dark, border-border, rounded-lg, p-1.5. (3) Restyle items: w-[110px] h-14, p-4, gap-1, bg-gold-20 selected, hover:bg-gold-10, text-white. (4) Switch from conditional render to always-render + CSS transitions + aria-hidden + tabIndex management. (5) Add `document.documentElement.lang` update in selectLanguage. (6) Wrap flag SVGs in 24x24 flex container. (7) Try-catch around cookie write. |
| `src/components/shared/Header.tsx` | Replace static language button placeholder (lines 89-98) with `<LanguageSelector />` import |
| `src/app/layout.tsx` | Make `RootLayout` async; read `locale` cookie via `await cookies()` from `next/headers`; set `<html lang={locale \|\| "vi"}>` |
| `src/components/shared/__tests__/LanguageSelector.test.tsx` | Existing 9 tests unchanged (aria-hidden preserves queryByRole behavior). Add 4 new tests: selected bg class, re-click selected, document.documentElement.lang update, tabIndex management |

### Dependencies

No new dependencies required.

---

## Implementation Strategy

### Phase Breakdown

#### Phase 0: Asset & Token Preparation
- Add `--color-gold-20: rgba(255, 234, 158, 0.20)` to `globals.css` `@theme inline` block (between existing `--color-gold-10` and `--color-gold-40`)
- Wrap existing SVG flag components in a 24x24 flex container (centered) to match design spec icon size. Do NOT redraw SVGs — keep existing 20x14 viewBox.

#### Phase 1: Restyle LanguageSelector Component (US1 + US2 — P1)

**Trigger button:**
- Dimensions: `w-[108px] h-14` (108x56px), padding: 16px (`p-4`), `flex items-center justify-between rounded`
- Typography: change from `text-sm` (14px) to `text-base font-bold leading-6 tracking-[0.15px]` (Montserrat 16px/24px) via `font-[family-name:var(--font-montserrat)]`
- Chevron icon: increase to 24x24px (currently 12x12), keep rotation animation
- Content group: wrap flag+text in `<span className="flex items-center gap-1">` to separate from chevron
- Hover: `hover:bg-gold-10` (transparent → rgba(255,234,158,0.1))
- Focus: `focus-visible:outline-2 focus-visible:outline-border focus-visible:outline-offset-[-2px]`
- Enter/Space: already handled by native `<button>` click behavior (US4 scenario 1)

**Dropdown container:**
- Use design tokens: `bg-container-dark` (existing), `border-border` (existing), `rounded-lg`, `p-1.5` (6px), `flex flex-col items-start`
- Position: `absolute right-0 top-full mt-1 z-20`
- Viewport overflow (TR-004): dropdown is small (~122px wide) and positioned `right-0` from the header. On mobile, ensure the dropdown doesn't clip the right edge. Current `right-0` alignment handles this since the trigger is in the header's right-side controls.
- **Animation approach**: Always render the dropdown (remove `{isOpen && ...}` conditional). Use CSS transitions on `opacity` and `translate-y` with `pointer-events-none` when closed, `pointer-events-auto` when open. This avoids needing a transition library:
  ```
  Closed: opacity-0 -translate-y-1 pointer-events-none
  Open:   opacity-100 translate-y-0 pointer-events-auto
  Transition: transition-all duration-150 ease-out
  ```

**Dropdown items (both A.1 and A.2):**
- Keep single `<button>` per item (no outer wrapper div needed — design-style's 2-layer hierarchy is a Figma component artifact)
- Button dimensions: `w-[110px] h-14 p-4 flex items-center gap-1 rounded cursor-pointer transition-colors`
- Content: flag icon (24x24 container) + text `<span>` (Montserrat Bold 16px), gap: 4px (`gap-1`)
- Text: all white (`text-white`) for both selected and unselected — remove `text-gold-primary`
- Selected state: apply `bg-gold-20 rounded-sm` directly on the `<button>` (new token)
- Hover state: `hover:bg-gold-10` (existing token)
- Focus state: `focus-visible:outline-2 focus-visible:outline-border focus-visible:outline-offset-[-2px]`

**Accessibility for always-rendered dropdown:**
- When closed: add `aria-hidden="true"` on the listbox div (prevents screen readers from reading hidden options)
- When open: `aria-hidden="false"` (or remove attribute)
- **Tab focus prevention**: Add `tabIndex={isOpen ? 0 : -1}` on each option `<button>`. Without this, users can Tab into invisible option buttons when dropdown is closed. Native `<button>` elements are focusable by default; `pointer-events-none` only blocks mouse/touch, not keyboard Tab.

> **Testing Library note**: `aria-hidden="true"` causes `queryByRole("listbox")` to return `null` by default (Testing Library excludes aria-hidden elements). This means existing test assertions like `expect(queryByRole("listbox")).not.toBeInTheDocument()` will **still pass without changes**. The `[~]` risk is lower than initially assessed.

**Edge case handling (from spec):**
- Cookie write failure: wrap `document.cookie` assignment in try-catch; on failure, still update local state (UI responds) but log warning. No user-facing error.
- Rapid toggling: not a concern for 2-option dropdown (each click is synchronous state update, no async operations). No debounce needed.

#### Phase 2: Header Integration
- Import `LanguageSelector` in `Header.tsx`
- Replace static placeholder button (lines 89-98) with `<LanguageSelector />`
- Remove the `chevron-down` usage (lines 96-97); keep `Icon` import — still used for `bell` (line 83) and `user` (line 107)
- Verify visual alignment with notification bell and profile button in the `flex items-center gap-4` container

#### Phase 3: Dynamic HTML Lang Attribute

**Server-side (initial render):**
- Make `RootLayout` an async function (Next.js 15 supports async Server Components)
- Read locale cookie via `const cookieStore = await cookies()` from `next/headers` (async API in Next.js 15, already used in `src/libs/supabase/server.ts`)
- Set `<html lang={locale || "vi"}>` — fallback to "vi" if no cookie

**Client-side (instant update):**
- In `LanguageSelector.tsx` `selectLanguage` callback, add: `document.documentElement.lang = code === "vi" ? "vi" : "en"`
- This ensures `<html lang>` updates immediately on language switch without waiting for next server render (required by TR-001: no full page reload)

#### Phase 4: Test Updates
- Run existing 9 tests first — all should pass unchanged (`aria-hidden="true"` on closed dropdown makes `queryByRole("listbox")` return null, preserving existing close-state assertions)
- Add test: selected item has `bg-gold-20` styling (check class on `aria-selected="true"` button)
- Add test: re-clicking selected language closes dropdown without changing language (spec US1 scenario 4)
- Add test: `document.documentElement.lang` updates on language switch
- Add test: hidden dropdown options are not Tab-focusable (`tabIndex={-1}` when closed)

### Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Flag SVG size change breaks proportions | Low | Low | Wrap in 24x24 flex container (centered); keep original SVG viewBox unchanged |
| Always-rendered dropdown affects click-outside logic | Med | Med | `pointer-events-none` when closed prevents mouse interaction. Click-outside handler checks `isOpen` state (not DOM visibility) — already works. Add `tabIndex={isOpen ? 0 : -1}` to prevent keyboard Tab into hidden options. |
| Async `cookies()` in layout.tsx | Low | Low | Already used in project (`src/libs/supabase/server.ts`). Make `RootLayout` async. |
| Existing tests break from animation refactor | Low | Low | `aria-hidden="true"` on closed dropdown causes `queryByRole("listbox")` to return `null` — existing assertions (`not.toBeInTheDocument()`) still pass without changes. Only new tests need to be added. |

### Estimated Complexity

- **Frontend**: Low-Medium (restyling + animation refactor from conditional render to always-render)
- **Backend**: None
- **Testing**: Low (mostly verifying existing tests still pass)

---

## Integration Testing Strategy

### Test Scope

- [x] **Component/Module interactions**: LanguageSelector in Header context
- [ ] **External dependencies**: None
- [ ] **Data layer**: Cookie read/write only
- [x] **User workflows**: Language switch flow

### Test Categories

| Category | Applicable? | Key Scenarios |
|----------|-------------|---------------|
| UI ↔ Logic | Yes | Trigger click → dropdown open, option click → language switch + cookie write |
| Service ↔ Service | No | N/A |
| App ↔ External API | No | N/A |
| App ↔ Data Layer | Yes | Cookie persistence across sessions |
| Cross-platform | No | Fixed-size component, no responsive differences |

### Test Environment

- **Environment type**: Local (Vitest + jsdom)
- **Test data strategy**: Cookie manipulation in beforeEach
- **Isolation approach**: Fresh state per test (cookie cleared)

### Mocking Strategy

| Dependency Type | Strategy | Rationale |
|-----------------|----------|-----------|
| document.cookie | Real | jsdom supports cookies natively |
| DOM events | Real | Testing Library provides real event simulation |

### Test Scenarios Outline

1. **Happy Path**
   - [x] Renders trigger with current language flag + code (existing — no change)
   - [x] Opens dropdown on click (existing — no change; `getByRole("listbox")` finds element when `aria-hidden="false"`)
   - [x] Switches language and closes (existing — no change)
   - [x] Persists to cookie (existing — no change)
   - [ ] Selected item has `bg-gold-20` class (NEW)
   - [ ] `document.documentElement.lang` updates on switch (NEW)

2. **Error Handling**
   - [x] Handles missing cookie gracefully — defaults to VN (existing — no change)

3. **Edge Cases**
   - [x] Closes on Escape (existing — no change; `aria-hidden="true"` makes `queryByRole` return null)
   - [x] Closes on outside click (existing — no change; same `aria-hidden` behavior)
   - [x] Keyboard navigation (existing — no change)
   - [ ] Re-clicking selected language closes without change (NEW — spec US1 scenario 4)
   - [x] Reads initial locale from cookie (existing — no change)
   - [ ] Hidden options are not Tab-focusable when dropdown closed (NEW — `tabIndex` management)

### Coverage Goals

| Area | Target | Priority |
|------|--------|----------|
| Core interaction flow | 90%+ | High |
| ARIA accessibility | 90%+ | High |
| Visual states | 70%+ | Medium |

---

## Dependencies & Prerequisites

### Required Before Start

- [x] `constitution.md` reviewed and understood
- [x] `spec.md` approved
- [x] Codebase research completed (existing component found)
- [x] Design-style.md complete with all visual specs

### External Dependencies

None.

---

## Next Steps

After plan approval:

1. **Run** `/momorph.tasks` to generate task breakdown
2. **Review** tasks.md for parallelization opportunities
3. **Begin** implementation following task order

---

## Notes

- The existing `LanguageSelector.tsx` is **well-implemented** — this is primarily a restyling task, not a rewrite. Preserve all existing logic (state management, event handlers, keyboard nav).
- The flag SVGs are currently 20x14px; the design calls for 24x24px containers. Wrap in a `w-6 h-6 flex items-center justify-center` container rather than redrawing the SVGs.
- ~~No i18n library is installed. The language dropdown only switches a cookie value. Actual text translation is out of scope per spec.~~ **[Updated]**: i18n hệ thống đã được triển khai (Phase 5-8) — xem bên dưới.
- There is a duplicate directory `.momorph/specs/721-4942-Dropdown-ngon-ngu/` that should be deleted (older naming convention).
- **Animation refactor** — switching from conditional render (`{isOpen && ...}`) to always-render with CSS transitions. Key mitigations: (1) `aria-hidden="true"` when closed preserves existing test assertions (Testing Library's `queryByRole` excludes aria-hidden elements), (2) `pointer-events-none` prevents mouse interaction, (3) `tabIndex={isOpen ? 0 : -1}` prevents keyboard Tab into hidden options. Click-outside handler already checks `isOpen` state, not DOM visibility.
- The `cookies()` API from `next/headers` is async in Next.js 15 — `layout.tsx` must use `await`. This pattern is already established in `src/libs/supabase/server.ts`.

---

## Phase 5-8: Full-App i18n (Bổ sung)

Các phase sau được bổ sung để triển khai hệ thống i18n toàn ứng dụng — khi chuyển ngôn ngữ, tất cả nội dung trên mọi trang thay đổi theo.

### Phase 5: i18n Infrastructure

**New files created:**
- `src/locales/vi.ts` — Dictionary tiếng Việt (~100 keys), export `TranslationKeys` type sử dụng `DeepStringify` utility
- `src/locales/en.ts` — Dictionary tiếng Anh, implement `TranslationKeys` interface
- `src/locales/index.ts` — Export `Locale` type, `getTranslations()` function
- `src/hooks/useLocale.tsx` — `LocaleProvider` context + `useLocale()` hook (đọc cookie, cung cấp `locale`, `setLocale`, `t`, gọi `router.refresh()` khi switch)
- `src/utils/getServerLocale.ts` — `getServerTranslations()` cho async server components (đọc cookie via `next/headers`)

**Modified files:**
- `src/app/layout.tsx` — Wrap `{children}` trong `<LocaleProvider>`
- `src/components/shared/LanguageSelector.tsx` — Refactor: dùng `useLocale()` thay vì local state, `setLocale()` thay vì local cookie logic

### Phase 6: Client Components i18n

Chuyển các presentational components sang client (`"use client"`) và sử dụng `useLocale()`:
- Shared: Header (nav items), Footer (links, copyright)
- Homepage: RootFurtherContent, AwardsOverview, CTAButtons, EventInfo, AwardCard, SunKudosPromo, WidgetButton
- Login: LoginHero, LoginButton, LoginFooter
- Awards: SectionTitle, AwardsSunKudosSection
- Kudos: HeroBanner, KudosInputPill, FilterBar, SearchPill, SecretBoxButton
- Modal: KudoModal, RecipientSearch, DanhHieuInput, HashtagSelector, AnonymousSection

### Phase 7: Server Components i18n

Thêm `getServerTranslations()` cho server components:
- `src/app/awards/page.tsx`
- `src/app/kudos/page.tsx`
- `src/components/kudos/StatsCard.tsx`
- `src/components/kudos/LeaderboardCard.tsx`
- `src/components/kudos/HighlightKudos.tsx`
- `src/components/kudos/SpotlightBoard.tsx`

### Phase 8: Test Updates

- `vitest.setup.ts` — Mock `next/navigation` globally
- `src/__tests__/test-utils.tsx` — `renderWithProviders` wrapper với `LocaleProvider`
- Cập nhật 4 test files dùng `renderWithProviders`
- Cập nhật LanguageSelector tests cho aria-label thay đổi theo ngôn ngữ
- Mock `getServerTranslations` trong awards page test

### Architecture Decisions (Phase 5-8)

| Decision | Rationale |
|----------|-----------|
| Custom React Context thay vì thư viện i18n | Ứng dụng chỉ có 2 ngôn ngữ, ~100 keys — thư viện i18n (next-intl, react-i18next) quá nặng |
| Cookie-based locale cho cả client và server | Client đọc cookie trực tiếp, server dùng `cookies()` API — thống nhất source of truth |
| `router.refresh()` khi switch ngôn ngữ | Soft-refresh server components mà không reload toàn trang (FR-014) |
| `DeepStringify<typeof vi>` cho TranslationKeys | `as const` tạo literal types, cần utility type để en.ts có thể dùng string values khác |
| Presentational components chuyển sang client | Components chỉ hiển thị text tĩnh cần reactive i18n → dùng `useLocale()` hook |
