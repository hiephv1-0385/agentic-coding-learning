# Feature Specification: Language Dropdown

**Frame ID**: `721:4942`
**Frame Name**: `Dropdown-ngon-ngu`
**File Key**: `9ypp4enmFmdK3YAFJLIu6C`
**Created**: 2026-03-13
**Status**: Draft

---

## Overview

A language selector dropdown that allows users to switch the application interface between Vietnamese (VN) and English (EN). The dropdown displays the currently selected language with its national flag icon and language code, and expands to reveal the available language option. This component is used globally across the application in the header/navigation area.

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Switch Application Language (Priority: P1)

A user visiting the application wants to change the display language from Vietnamese to English (or vice versa) so that they can understand the interface in their preferred language.

**Why this priority**: Language switching is the core and only function of this component. Without it, non-Vietnamese-speaking users cannot use the application effectively.

**Independent Test**: Render the language dropdown, click to open it, select a different language, and verify the interface language changes.

**Acceptance Scenarios**:

1. **Given** the application is displayed in Vietnamese (VN is selected), **When** the user clicks the language dropdown, **Then** the dropdown opens showing "EN" as an available option with the United Kingdom flag icon.
2. **Given** the dropdown is open, **When** the user clicks the "EN" option, **Then** the dropdown closes, the selected language updates to "EN" with the United Kingdom flag, and the application interface switches to English.
3. **Given** the application is displayed in English (EN is selected), **When** the user clicks the language dropdown and selects "VN", **Then** the dropdown closes, the selected language updates to "VN" with the Vietnam flag, and the application interface switches to Vietnamese.
4. **Given** the dropdown is open and VN is the current language, **When** the user clicks the already-selected "VN" option, **Then** the dropdown closes and the language remains Vietnamese (no change).

---

### User Story 2 - View Current Language (Priority: P1)

A user wants to see which language is currently active so they know the current state of the application.

**Why this priority**: Users must be able to identify the currently selected language at a glance without opening the dropdown.

**Independent Test**: Verify the dropdown trigger displays the correct flag icon and language code for the active language.

**Acceptance Scenarios**:

1. **Given** the application language is set to Vietnamese, **When** the user views the language dropdown (closed state), **Then** they see the Vietnam flag and "VN" text.
2. **Given** the application language is set to English, **When** the user views the language dropdown (closed state), **Then** they see the United Kingdom flag and "EN" text.

---

### User Story 3 - Dismiss Dropdown Without Changing Language (Priority: P2)

A user opens the language dropdown but decides not to change the language.

**Why this priority**: Standard UX behavior — users should be able to cancel an action without side effects.

**Independent Test**: Open the dropdown, then click outside or press Escape, and verify the language remains unchanged.

**Acceptance Scenarios**:

1. **Given** the dropdown is open, **When** the user clicks outside the dropdown area, **Then** the dropdown closes and the language remains unchanged.
2. **Given** the dropdown is open, **When** the user presses the Escape key, **Then** the dropdown closes and the language remains unchanged.

---

### User Story 4 - Keyboard Navigation (Priority: P3)

A user navigating with keyboard wants to change the language without using a mouse.

**Why this priority**: Accessibility requirement for keyboard-only users, but secondary to core mouse/touch interaction.

**Independent Test**: Tab to the dropdown, press Enter/Space to open, use arrow keys to navigate options, press Enter to select.

**Acceptance Scenarios**:

1. **Given** the dropdown trigger is focused, **When** the user presses Enter or Space, **Then** the dropdown opens.
2. **Given** the dropdown is open, **When** the user presses ArrowDown/ArrowUp, **Then** focus moves between language options.
3. **Given** a language option is focused, **When** the user presses Enter, **Then** that language is selected and the dropdown closes.

---

### Edge Cases

- What happens when the user's browser/OS language preference differs from the selected language? The dropdown should reflect the explicitly selected language, not auto-detect.
- How does the system handle rapid toggling between languages? Each switch should complete before the next is processed (debounce or queue).
- What happens if the language preference fails to persist (e.g., cookie/localStorage error)? Fallback to default language (VN) and show no error to the user.
- What happens on first visit with no stored preference? Default to Vietnamese (VN).

---

## UI/UX Requirements *(from Figma)*

### Screen Components

| Component | Description | Interactions |
|-----------|-------------|--------------|
| Dropdown Trigger | Shows current language (flag + code + chevron down arrow), acts as toggle button | Click to open/close dropdown |
| Dropdown List | Container with all language options, overlays content | Appears on trigger click, positioned below/near trigger |
| Selected Language Item (A.1) | Highlighted item showing current selection (golden bg) | Click to close dropdown (no change) |
| Option Language Item (A.2) | Non-selected language option | Click to select, hover to highlight |
| Flag Icon | National flag (VN/EN) in 24x24px container | Decorative, no direct interaction |
| Language Code Text | Bold text label ("VN" or "EN") | Decorative, no direct interaction |

### Navigation Flow

- From: Any page (component is globally available, likely in header)
- To: Same page (language change reloads/re-renders content in new language)
- Triggers: Click on dropdown trigger to open; click on option to switch language

### Visual Requirements

- Responsive: Component is small and fixed-size, works identically across all breakpoints
- Animations: Dropdown open/close should animate (opacity + transform, 150ms ease-out)
- Accessibility: WCAG AA compliant (contrast ratio ~19:1 for white text on dark bg), keyboard navigable, proper ARIA attributes (`role="listbox"`, `aria-expanded`, `aria-selected`)

> **See [design-style.md](./design-style.md) for complete visual specifications including colors, typography, spacing, and component states.**

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display the currently selected language with its corresponding national flag icon and language code (VN or EN).
- **FR-002**: System MUST show a dropdown list of available languages when the user clicks the trigger.
- **FR-003**: System MUST switch the application interface language when the user selects a different language option.
- **FR-004**: System MUST visually distinguish the currently selected language from other options (golden highlight background).
- **FR-005**: System MUST close the dropdown after a language selection is made.
- **FR-006**: System MUST close the dropdown when the user clicks outside or presses Escape.
- **FR-007**: System MUST persist the selected language preference across page navigations and sessions (via cookie or localStorage).
- **FR-008**: System MUST support exactly two languages: Vietnamese (VN) and English (EN).
- **FR-009**: System MUST default to Vietnamese (VN) on first visit when no language preference is stored.

### Technical Requirements

- **TR-001**: Language switching MUST NOT require a full page reload — use client-side i18n with Next.js internationalization or a lightweight i18n library.
- **TR-002**: Language preference MUST be stored in a cookie (for SSR access) and optionally in localStorage as fallback.
- **TR-003**: The dropdown component MUST be a Client Component (`"use client"`) since it requires click handlers and state management.
- **TR-004**: The dropdown MUST be positioned using absolute/fixed positioning and handle edge cases (viewport overflow).
- **TR-005**: Component MUST be accessible: `role="listbox"`, `aria-expanded`, `aria-selected`, keyboard navigation support.

### Key Entities *(if feature involves data)*

- **Language**: Represents a supported locale — attributes: `code` (string: "VN" | "EN"), `label` (string: "Tieng Viet" | "English"), `flagComponent` (React component for the flag icon), `locale` (string: "vi" | "en").

---

## State Management

### Local State

| State | Type | Initial | Purpose |
|-------|------|---------|---------|
| isOpen | boolean | false | Whether dropdown list is visible |
| selectedLanguage | "VN" \| "EN" | from cookie or "VN" | Currently active language |

### Global State

| State | Store | Read/Write | Purpose |
|-------|-------|------------|---------|
| locale | i18n context / cookie | Read & Write | Application-wide language setting, consumed by all translatable text |

### UI States

| State | Behavior |
|-------|----------|
| **Closed (default)** | Only the trigger button is visible showing current language flag + code |
| **Open** | Dropdown list appears below trigger with all language options; selected option has golden highlight |
| **Hover (item)** | Hovered language item shows subtle background highlight |
| **Focus (keyboard)** | Focused item has visible focus ring/outline for accessibility |

---

## API Dependencies

| Endpoint | Method | Purpose | Status |
|----------|--------|---------|--------|
| (none) | - | Language switching is client-side only; no API calls needed | N/A |

> **Note**: Language preference is stored client-side (cookie/localStorage). If server-side locale detection is needed in the future, a `/api/locale` endpoint could be added, but this is currently out of scope.

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can switch between VN and EN within 2 clicks (open dropdown + select option).
- **SC-002**: Language preference persists correctly across browser sessions (verified by reopening the app).
- **SC-003**: All UI text updates to the selected language without a full page reload.
- **SC-004**: Component passes accessibility audit (axe-core) with zero violations.

---

## Full-App i18n (Phase 2)

### Overview

Khi chuyển đổi ngôn ngữ qua dropdown, **tất cả** label, nội dung, placeholder, aria-label trên mọi trang phải thay đổi theo ngôn ngữ được chọn. Điều này yêu cầu một hệ thống i18n toàn ứng dụng.

### User Story 5 — Nội dung thay đổi theo ngôn ngữ (Priority: P1)

Khi người dùng chuyển ngôn ngữ từ VN sang EN (hoặc ngược lại), tất cả các label, nội dung tĩnh, placeholder, aria-label trên tất cả các trang phải hiển thị bằng ngôn ngữ đã chọn.

**Acceptance Scenarios**:

1. **Given** ứng dụng đang hiển thị tiếng Việt, **When** người dùng chuyển sang EN, **Then** tất cả text tĩnh (header nav, footer links, hero titles, button labels, placeholders, aria-labels) hiển thị bằng tiếng Anh.
2. **Given** ứng dụng đang hiển thị tiếng Anh, **When** người dùng chuyển sang VN, **Then** tất cả text tĩnh hiển thị bằng tiếng Việt.
3. **Given** người dùng đang ở trang Kudos và chuyển ngôn ngữ, **When** trang được cập nhật, **Then** cả client components (FilterBar, SearchPill, SecretBoxButton) và server components (StatsCard, LeaderboardCard, HighlightKudos, SpotlightBoard) đều hiển thị đúng ngôn ngữ.
4. **Given** người dùng mở KudoModal, **When** ngôn ngữ đã được đặt là EN, **Then** tất cả label trong modal (title, recipient, danh hiệu, hashtag, anonymous, cancel/send) hiển thị bằng tiếng Anh.

### Functional Requirements (Phase 2)

- **FR-010**: Hệ thống PHẢI cung cấp file dictionary dịch cho mỗi ngôn ngữ (vi.ts, en.ts) với type-safe keys.
- **FR-011**: Hệ thống PHẢI cung cấp React Context (LocaleProvider) wrap toàn app, cung cấp `locale`, `setLocale`, `t` (translations object).
- **FR-012**: Client components PHẢI sử dụng hook `useLocale()` để truy cập translations reactive.
- **FR-013**: Server components PHẢI sử dụng `getServerTranslations()` đọc locale từ cookie để lấy translations.
- **FR-014**: Khi chuyển ngôn ngữ, `router.refresh()` PHẢI được gọi để soft-refresh server components (không reload toàn trang).
- **FR-015**: Tất cả hardcoded Vietnamese/English strings trong components PHẢI được thay thế bằng translation keys.

### Technical Requirements (Phase 2)

- **TR-006**: Translation files đặt tại `src/locales/vi.ts` và `src/locales/en.ts`, export type `TranslationKeys` từ vi.ts sử dụng `DeepStringify` utility type.
- **TR-007**: `LocaleProvider` đặt tại `src/hooks/useLocale.tsx`, wrap `{children}` trong `src/app/layout.tsx`.
- **TR-008**: `getServerTranslations()` đặt tại `src/utils/getServerLocale.ts`, sử dụng `cookies()` từ `next/headers`.
- **TR-009**: Tests PHẢI wrap components với `LocaleProvider` thông qua `renderWithProviders` từ `src/__tests__/test-utils.tsx`.
- **TR-010**: Mock `next/navigation` (`useRouter`, `useSearchParams`, `usePathname`) trong `vitest.setup.ts` cho tất cả tests.

### Phạm vi ảnh hưởng

| Trang | Components cần cập nhật |
|-------|------------------------|
| Shared | Header, Footer, LanguageSelector |
| Homepage | RootFurtherContent, AwardsOverview, CTAButtons, EventInfo, AwardCard, SunKudosPromo, WidgetButton |
| Login | LoginHero, LoginButton, LoginFooter |
| Awards | SectionTitle, AwardsSunKudosSection, awards/page.tsx (server) |
| Kudos | HeroBanner, KudosInputPill, FilterBar, SearchPill, StatsCard (server), LeaderboardCard (server), HighlightKudos (server), SpotlightBoard (server), SecretBoxButton, kudos/page.tsx (server) |
| Kudo Modal | KudoModal, RecipientSearch, DanhHieuInput, HashtagSelector, AnonymousSection |

---

## Out of Scope

- Adding additional languages beyond VN and EN
- Auto-detecting browser/OS language preference for initial selection
- Server-side language negotiation via Accept-Language header
- URL-based locale routing (e.g., `/en/awards`, `/vi/awards`)

---

## Dependencies

- [x] Constitution document exists (`.momorph/constitution.md`)
- [ ] API specifications available (`.momorph/API.yml`) — not needed for this feature
- [ ] Database design completed (`.momorph/database.sql`) — not needed for this feature
- [x] Screen flow documented (`.momorph/contexts/SCREENFLOW.md`)

---

## Notes

- The dropdown uses the project's "Details" design token family (gold border `#998C5F`, dark container `#00070C`) which is consistent with the awards/ceremony theme of the application.
- Flag icons share a Figma component set (`178:1020`), suggesting a reusable `FlagIcon` component pattern in implementation.
- The font Montserrat (Bold 700) is used for language codes — ensure this font is loaded in the project.
- This component is small and self-contained, making it a good candidate for implementation as an isolated, reusable component in `src/components/ui/LanguageDropdown.tsx`.
