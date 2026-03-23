# Tasks: Language Dropdown

**Frame**: `721:4942-dropdown-ngon-ngu`
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

## Phase 1: Setup (Design Token Preparation)

**Purpose**: Add missing CSS tokens needed by the component restyle

- [x] T001 Add `--color-gold-20: rgba(255, 234, 158, 0.20)` token in `@theme inline` block, between existing `--color-gold-10` and `--color-gold-40` | src/app/globals.css

**Checkpoint**: Design token available for use in component styles

---

## Phase 2: Foundation (Flag Icon Sizing)

**Purpose**: Prepare shared flag icon containers that both trigger and dropdown items depend on

**CRITICAL**: This changes the flag SVG wrapper structure — all subsequent styling depends on this.

- [x] T002 Wrap `VietnamFlag` and `UKFlag` SVG components in a `w-6 h-6 flex items-center justify-center` container. Keep existing SVG dimensions (20x14 viewBox) unchanged — only add the outer wrapper div/span for consistent 24x24 sizing | src/components/shared/LanguageSelector.tsx

**Checkpoint**: Flag icons render at 24x24 container size; existing 9 tests still pass (`yarn vitest run src/components/shared/__tests__/LanguageSelector.test.tsx`)

---

## Phase 3: User Story 1 + 2 — Switch Language & View Current Language (Priority: P1) MVP

**Goal**: Restyle the existing LanguageSelector to match design-style.md (dark container, gold border, 110px items, selected highlight, animation), integrate into Header, and add dynamic `<html lang>` attribute.

**Independent Test**: Open dropdown in Header, switch VN→EN, verify: trigger updates (flag + code), dropdown styling matches design (dark bg, gold border, selected highlight), cookie persists, `<html lang>` updates.

### Restyle: Trigger Button (US1+US2)

- [x] T003 [US1] Restyle trigger button: change className to `w-[108px] h-14 p-4 flex items-center justify-between rounded font-[family-name:var(--font-montserrat)] text-base font-bold leading-6 tracking-[0.15px] text-white cursor-pointer transition-colors hover:bg-gold-10 focus-visible:outline-2 focus-visible:outline-border focus-visible:outline-offset-[-2px]`. Remove old classes (`gap-1.5`, `text-sm`, `hover:text-gold-primary`, `focus-visible:outline-gold-primary`, `focus-visible:outline-offset-2`) | src/components/shared/LanguageSelector.tsx
- [x] T004 [US1] Wrap flag+text inside trigger in `<span className="flex items-center gap-1">` to group them, so `justify-between` separates content from chevron | src/components/shared/LanguageSelector.tsx
- [x] T005 [US1] Increase chevron SVG from 12x12 to 24x24 (update `width`, `height`, and `viewBox` attributes on the inline SVG). Keep rotation animation class unchanged | src/components/shared/LanguageSelector.tsx

### Restyle: Dropdown Container (US1+US2)

- [x] T006 [US1] Switch dropdown from conditional rendering (`{isOpen && ...}`) to always-rendered. Remove `{isOpen && (` and closing `)}`. Add `aria-hidden={!isOpen}` on the listbox div. Apply classes conditionally: when closed `opacity-0 -translate-y-1 pointer-events-none`, when open `opacity-100 translate-y-0 pointer-events-auto`. Add base transition class `transition-all duration-150 ease-out` | src/components/shared/LanguageSelector.tsx
- [x] T007 [US1] Restyle dropdown container: change className to `absolute right-0 top-full mt-1 z-20 bg-container-dark border border-border rounded-lg p-1.5 flex flex-col items-start transition-all duration-150 ease-out ${isOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-1 pointer-events-none'}`. Remove old classes (`bg-page-bg`, `border-footer-border`, `rounded`, `py-1`, `min-w-[80px]`) | src/components/shared/LanguageSelector.tsx

### Restyle: Dropdown Items (US1+US2)

- [x] T008 [US1] Restyle each option button: change className to `w-[110px] h-14 p-4 flex items-center gap-1 rounded text-white font-[family-name:var(--font-montserrat)] text-base font-bold leading-6 tracking-[0.15px] cursor-pointer transition-colors hover:bg-gold-10 focus-visible:outline-2 focus-visible:outline-border focus-visible:outline-offset-[-2px] ${locale === lang.code ? 'bg-gold-20 rounded-sm' : ''}`. Remove old classes (`w-full`, `gap-2`, `px-3 py-2`, `text-sm`, `hover:text-gold-primary`, `text-gold-primary`) | src/components/shared/LanguageSelector.tsx
- [x] T009 [US1] Add `tabIndex={isOpen ? 0 : -1}` on each option `<button>` to prevent keyboard Tab into hidden options when dropdown is closed | src/components/shared/LanguageSelector.tsx

### Edge Case Handling (US1)

- [x] T010 [US1] Wrap `document.cookie = ...` assignment in `selectLanguage` callback with try-catch. On failure: log `console.warn('Failed to persist locale cookie')`, still update local state (UI responds). No user-facing error | src/components/shared/LanguageSelector.tsx
- [x] T011 [US1] Add `document.documentElement.lang = code` in `selectLanguage` callback (after `setLocale(code)`) to update `<html lang>` immediately on language switch without waiting for server re-render | src/components/shared/LanguageSelector.tsx

### Header Integration (US1+US2)

- [x] T012 [US1] Import `LanguageSelector` from `@/components/shared/LanguageSelector` in Header.tsx. Replace the static language button placeholder (lines 89-98: the `<button>` with "VN" text and `<Icon name="chevron-down">`) with `<LanguageSelector />`. Keep `Icon` import — still used for `bell` (line 83) and `user` (line 107) | src/components/shared/Header.tsx

### Dynamic HTML Lang Attribute (US1)

- [x] T013 [US1] Make `RootLayout` async. Import `cookies` from `next/headers`. Read locale: `const cookieStore = await cookies(); const locale = cookieStore.get('locale')?.value || 'vi';`. Change `<html lang="vi">` to `<html lang={locale}>` | src/app/layout.tsx

**Checkpoint**: US1+US2 complete — Language dropdown renders in Header with design-style.md appearance, switches language with cookie persistence, `<html lang>` updates both server-side and client-side. Existing 9 tests still pass.

---

## Phase 4: Polish & Verification

**Purpose**: Add new tests for restyled behavior, verify US3/US4 still work, cleanup

### Test Updates

- [x] T014 Run existing 9 tests to confirm they pass unchanged: `yarn vitest run src/components/shared/__tests__/LanguageSelector.test.tsx` (aria-hidden="true" on closed dropdown makes queryByRole("listbox") return null — existing assertions preserved) | src/components/shared/__tests__/LanguageSelector.test.tsx
- [x] T015 [P] Add test: "selected item has highlight background class" — open dropdown, check `aria-selected="true"` button has class containing `bg-gold-20` | src/components/shared/__tests__/LanguageSelector.test.tsx
- [x] T016 [P] Add test: "re-clicking selected language closes dropdown without change" — set locale VN, open dropdown, click VN option, verify dropdown closes and trigger still shows VN (spec US1 scenario 4) | src/components/shared/__tests__/LanguageSelector.test.tsx
- [x] T017 [P] Add test: "document.documentElement.lang updates on language switch" — switch to EN, assert `document.documentElement.lang === 'en'`; switch to VN, assert `document.documentElement.lang === 'vi'` | src/components/shared/__tests__/LanguageSelector.test.tsx
- [x] T018 [P] Add test: "hidden options are not Tab-focusable when closed" — render component (dropdown closed), query option buttons with `{ hidden: true }`, verify each has `tabIndex === -1` | src/components/shared/__tests__/LanguageSelector.test.tsx

### Verification (US3 + US4 — already implemented)

- [x] T019 Verify US3 (Dismiss without changing): manually confirm click-outside and Escape still close dropdown without language change. Existing tests "closes dropdown on Escape key" and "closes dropdown on outside click" cover this | src/components/shared/__tests__/LanguageSelector.test.tsx
- [x] T020 Verify US4 (Keyboard navigation): manually confirm ArrowUp/ArrowDown navigate options, Enter/Space on trigger opens dropdown. Existing test "supports keyboard navigation with Arrow keys" covers this | src/components/shared/__tests__/LanguageSelector.test.tsx

### Cleanup

- [x] T021 Delete duplicate spec directory `.momorph/specs/721-4942-Dropdown-ngon-ngu/` (older naming convention, superseded by `721_4942-dropdown-ngon-ngu/`)
- [x] T022 Run full lint and type check: `yarn lint && yarn build` to verify no regressions

**Checkpoint**: All 4 user stories verified, 13 tests passing (9 existing + 4 new), build passes

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundation (Phase 2)**: Depends on Phase 1 (needs gold-20 token to exist, though flag sizing doesn't use it directly)
- **US1+US2 (Phase 3)**: Depends on Phase 2 (flag icon sizing must be done before restyle)
  - Within Phase 3: T003-T005 (trigger) can run in parallel with T006-T007 (container) — BUT both modify the same file, so execute sequentially
  - T008-T009 (items) depend on T006-T007 (container animation refactor)
  - T010-T011 (edge cases) depend on T008 (item restyle)
  - T012 (Header) depends on T003-T011 (component restyle complete)
  - T013 (layout.tsx) can run in parallel with T003-T012 (different file)
- **Polish (Phase 4)**: Depends on Phase 3 completion
  - T015-T018 can run in parallel (all add independent test cases to same file, but no inter-dependencies)

### Within Phase 3 (US1+US2) Execution Order

```
T003 → T004 → T005 (trigger restyle, sequential — same element)
          ↓
T006 → T007 (container animation refactor)
          ↓
T008 → T009 (item restyle + tabIndex)
          ↓
T010 → T011 (edge cases + lang update)
          ↓
T012 (Header integration)

T013 can run in parallel ←→ T003-T012 (different file: layout.tsx)
```

### Parallel Opportunities

| Parallel Group | Tasks | Reason |
|----------------|-------|--------|
| Layout + Component | T013 ∥ T003-T012 | Different files (`layout.tsx` vs `LanguageSelector.tsx` + `Header.tsx`) |
| New Tests | T015 ∥ T016 ∥ T017 ∥ T018 | Independent test cases, no dependencies between them |

---

## Implementation Strategy

### MVP First (Recommended)

1. Complete Phase 1 (T001) — 1 task
2. Complete Phase 2 (T002) — 1 task
3. Complete Phase 3 (T003-T013) — 11 tasks
4. **STOP and VALIDATE**: Run existing 9 tests, verify visually in browser
5. Complete Phase 4 (T014-T022) — 9 tasks

### Single-Session Execution

This is a small feature (22 tasks, 5 files modified). Recommended to complete all phases in a single session:

1. T001 → T002 → T003-T011 (sequential, same file) → T012 → T013
2. T014 (run tests) → T015-T018 (add new tests) → T019-T020 (verify) → T021-T022 (cleanup)

Estimated: ~20 minutes for an LLM agent, all within a single commit scope.

---

## Notes

- All Phase 1-4 tasks modify **existing files only** — no new files created
- The component file `LanguageSelector.tsx` is modified by tasks T002-T011 (10 tasks) — these must be sequential
- Existing 9 tests are expected to pass unchanged after all restyling (aria-hidden preserves Testing Library queryByRole behavior)
- US3 (Dismiss) and US4 (Keyboard) require no implementation — functionality already exists and is tested
- Commit after Phase 3 checkpoint and again after Phase 4 completion

---

## Phase 5: i18n Infrastructure (US5 — Full-App Translation)

**Purpose**: Tạo hệ thống i18n toàn ứng dụng — khi chuyển ngôn ngữ, tất cả nội dung thay đổi theo.

- [x] T023 [US5] Tạo file `src/locales/vi.ts` — dictionary tiếng Việt (~100 keys organized by section: header, footer, home, login, awards, kudos, modal, common), export `TranslationKeys` type sử dụng `DeepStringify` utility
- [x] T024 [US5] Tạo file `src/locales/en.ts` — dictionary tiếng Anh implement `TranslationKeys` interface
- [x] T025 [US5] Tạo file `src/locales/index.ts` — export `Locale` type (`"vi" | "en"`), `getTranslations(locale)` function, re-export `TranslationKeys`
- [x] T026 [US5] Tạo file `src/hooks/useLocale.tsx` — `LocaleProvider` context + `useLocale()` hook. Provider đọc initial locale từ cookie, cung cấp `locale`, `setLocale` (cập nhật cookie + document.lang + gọi router.refresh()), và `t` (memoized translations)
- [x] T027 [US5] Tạo file `src/utils/getServerLocale.ts` — `getServerTranslations()` async function cho server components, đọc cookie via `cookies()` từ `next/headers`
- [x] T028 [US5] Cập nhật `src/app/layout.tsx` — wrap `{children}` trong `<LocaleProvider>`
- [x] T029 [US5] Refactor `src/components/shared/LanguageSelector.tsx` — dùng `useLocale()` thay vì local state, `setLocale()` thay vì local cookie/document.lang logic

**Checkpoint**: i18n infrastructure hoạt động — LocaleProvider wrap app, LanguageSelector dùng context

---

## Phase 6: Client Components i18n

**Purpose**: Thay thế tất cả hardcoded strings trong client components bằng translation keys

### Shared Components
- [x] T030 [P] [US5] Cập nhật `Header.tsx` — navItems dùng `t.header.*`, aria-labels dùng `t.header.notifications/profile`
- [x] T031 [P] [US5] Chuyển `Footer.tsx` sang client component, dùng `t.footer.*`

### Homepage Components
- [x] T032 [P] [US5] Chuyển `RootFurtherContent.tsx` sang client, dùng `t.home.rootFurther*`
- [x] T033 [P] [US5] Chuyển `AwardsOverview.tsx` sang client, dùng `t.home.awards*`
- [x] T034 [P] [US5] Chuyển `CTAButtons.tsx` sang client, dùng `t.home.aboutAwards/aboutKudos`
- [x] T035 [P] [US5] Chuyển `EventInfo.tsx` sang client, dùng `t.home.time/venue`
- [x] T036 [P] [US5] Chuyển homepage `AwardCard.tsx` sang client, dùng `t.home.details`
- [x] T037 [P] [US5] Chuyển `SunKudosPromo.tsx` sang client, dùng `t.home.kudosPromo*`
- [x] T038 [P] [US5] ~~Cập nhật `WidgetButton.tsx`~~ → File deleted, replaced by global `FloatingActionButton` (see `313_9137-floating-action-button`)

### Login Components
- [x] T039 [P] [US5] Chuyển `LoginHero.tsx` sang client, dùng `t.login.tagline1/tagline2`
- [x] T040 [P] [US5] Cập nhật `LoginButton.tsx` — dùng `t.login.*`, xóa hardcoded error constants
- [x] T041 [P] [US5] Chuyển `LoginFooter.tsx` sang client, dùng `t.login.copyright`

### Awards Components
- [x] T042 [P] [US5] Chuyển `SectionTitle.tsx` sang client, dùng `t.awards.sectionSubtitle/sectionTitle`
- [x] T043 [P] [US5] Chuyển `AwardsSunKudosSection.tsx` sang client, dùng `t.awards.*`

### Kudos Components (Client)
- [x] T044 [P] [US5] Chuyển `HeroBanner.tsx` sang client, dùng `t.kudos.heroTitle`
- [x] T045 [P] [US5] Cập nhật `KudosInputPill.tsx` — dùng `t.kudos.inputPillPlaceholder`
- [x] T046 [P] [US5] Cập nhật `FilterBar.tsx` — dùng `t.kudos.hashtag/department/clearFilter`
- [x] T047 [P] [US5] Cập nhật `SearchPill.tsx` — dùng `t.kudos.searchPlaceholder/searchAriaLabel/noResults`
- [x] T048 [P] [US5] Cập nhật `SecretBoxButton.tsx` — dùng `t.kudos.openSecretBox/secretBoxFailed/secretBoxSuccess`

### Kudo Modal Components (Client)
- [x] T049 [P] [US5] Cập nhật `KudoModal.tsx` — dùng `t.modal.title/confirmCancel/cancel/send/sending/sendSuccess/sendFailed`
- [x] T050 [P] [US5] Cập nhật `RecipientSearch.tsx` — dùng `t.modal.recipient/searchPlaceholder/searchAriaLabel/searching/noResults`
- [x] T051 [P] [US5] Cập nhật `DanhHieuInput.tsx` — dùng `t.modal.danhHieu/danhHieuPlaceholder/danhHieuExample`
- [x] T052 [P] [US5] Cập nhật `HashtagSelector.tsx` — dùng `t.modal.hashtagMaxLabel/hashtagLoading/hashtagError/hashtagRetry/hashtagEmpty/removeHashtag`
- [x] T053 [P] [US5] Cập nhật `AnonymousSection.tsx` — dùng `t.modal.anonymousLabel/anonymousPlaceholder/anonymousNameAriaLabel`

**Checkpoint**: Tất cả client components dùng translation keys

---

## Phase 7: Server Components i18n

**Purpose**: Thêm `getServerTranslations()` cho server components

- [x] T054 [P] [US5] Cập nhật `src/app/awards/page.tsx` — dùng `t.awards.noAwards`
- [x] T055 [P] [US5] Cập nhật `src/app/kudos/page.tsx` — dùng `t.kudos.skipToMain/allKudosSubtitle/allKudosTitle`
- [x] T056 [P] [US5] Cập nhật `StatsCard.tsx` — dùng `t.kudos.statsKudosReceived/statsKudosSent/statsHeartsReceived/statsSecretBoxOpened/statsSecretBoxRemaining`
- [x] T057 [P] [US5] Cập nhật `LeaderboardCard.tsx` — dùng `t.kudos.leaderboardTitle/leaderboardNoData`
- [x] T058 [P] [US5] Cập nhật `HighlightKudos.tsx` — dùng `t.kudos.highlightSubtitle/highlightTitle/highlightEmpty`
- [x] T059 [P] [US5] Cập nhật `SpotlightBoard.tsx` — dùng `t.kudos.spotlightSubtitle/spotlightTitle`

**Checkpoint**: Tất cả server components dùng translation keys

---

## Phase 8: Test Updates for i18n

**Purpose**: Cập nhật tests để tương thích với LocaleProvider

- [x] T060 [US5] Cập nhật `vitest.setup.ts` — mock `next/navigation` globally (`useRouter`, `useSearchParams`, `usePathname`)
- [x] T061 [US5] Tạo `src/__tests__/test-utils.tsx` — `renderWithProviders` wrapper với `LocaleProvider`
- [x] T062 [P] [US5] Cập nhật `LoginButton.test.tsx` — dùng `renderWithProviders`
- [x] T063 [P] [US5] Cập nhật `AwardsSunKudosSection.test.tsx` — dùng `renderWithProviders`
- [x] T064 [P] [US5] Cập nhật `LanguageSelector.test.tsx` — dùng `renderWithProviders`, sửa aria-label assertions cho locale-aware labels
- [x] T065 [P] [US5] Cập nhật `page.test.tsx` (awards) — dùng `renderWithProviders`, mock `getServerTranslations`
- [x] T066 [US5] Chạy build (`next build`) — verify compilation thành công
- [x] T067 [US5] Chạy tests (`vitest run`) — verify 79/79 tests pass

**Checkpoint**: Build pass, 79/79 tests pass, i18n hoàn chỉnh trên tất cả các trang
