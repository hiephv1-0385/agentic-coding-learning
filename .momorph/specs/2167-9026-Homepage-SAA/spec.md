# Feature Specification: Homepage SAA

**Frame ID**: `2167:9026`
**Frame Name**: `Homepage SAA`
**File Key**: `9ypp4enmFmdK3YAFJLIu6C`
**Created**: 2026-03-10
**Status**: Draft

---

## Overview

The Homepage SAA is the main landing page for the Sun* Annual Awards 2025 platform. It serves as the central hub that introduces the "ROOT FURTHER" event theme, displays a countdown timer to the ceremony, provides an overview of all 6 award categories in a card grid, promotes the Sun* Kudos peer recognition program, and connects users to all major sections of the platform.

**Target users**: All Sun* employees — to discover, understand, and navigate the SAA 2025 awards platform.

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View Countdown and Event Information (Priority: P1)

An employee visits the homepage to see when the SAA 2025 ceremony will take place and where.

**Why this priority**: The countdown and event info are the first things users see — core to the homepage's purpose of building anticipation.

**Independent Test**: Navigate to the homepage, verify the countdown timer displays and updates, and event details (date, venue, livestream) are visible.

**Acceptance Scenarios**:

1. **Given** the event date is in the future, **When** the user loads the homepage, **Then** the hero section shows "Coming soon", a countdown timer with Days/Hours/Minutes, event date "26/12/2025", venue "Âu Cơ Art Center", and livestream info.
2. **Given** the countdown is running, **When** a minute passes, **Then** the minutes value decrements by 1 (with zero-padding, e.g., "09" not "9").
3. **Given** the countdown reaches 0, **When** the timer expires, **Then** the "Coming soon" label hides and the timer shows "00" for all values.
4. **Given** the event date is configurable via `NEXT_PUBLIC_EVENT_DATETIME` environment variable (ISO-8601), **When** the admin changes the env var and redeploys, **Then** the countdown targets the new date.

---

### User Story 2 - Browse Award Categories Overview (Priority: P1)

An employee wants to quickly see all available award categories and understand what each one recognizes.

**Why this priority**: The award category grid is the main informational content on the homepage.

**Independent Test**: Scroll to the awards section, verify 6 award cards are displayed in a 3-column grid with images, titles, descriptions, and "Chi tiết" links.

**Acceptance Scenarios**:

1. **Given** the user scrolls to the awards section, **When** the section is in view, **Then** the subtitle "Sun* annual awards 2025", the title "Hệ thống giải thưởng" (57px, gold), the description "Các hạng mục sẽ được trao giải theo TOP những người xuất sắc nhất.", and 6 award cards are displayed in a 3x2 grid.
2. **Given** an award card is displayed, **When** the user views it, **Then** it shows: award image (square with glow ring), title (gold, 24px), short description (max 2 lines with ellipsis), and "Chi tiết" link.
3. **Given** the user clicks an award card (image, title, or "Chi tiết"), **When** the click occurs, **Then** they navigate to the Awards Information page with a URL hash (e.g., `/awards#top-talent`) that auto-scrolls to the specific award section.
4. **Given** the user hovers over an award card, **When** the hover state is active, **Then** the card shows a subtle elevation and border/glow highlight effect.

---

### User Story 3 - Navigate to Major Sections via CTA Buttons (Priority: P1)

An employee wants to quickly navigate to either the Awards Information page or the Sun* Kudos page from the hero banner.

**Why this priority**: The CTA buttons are the primary navigation affordance in the hero section.

**Independent Test**: Click "ABOUT AWARDS" and "ABOUT KUDOS" buttons, verify correct navigation.

**Acceptance Scenarios**:

1. **Given** the hero section is displayed, **When** the user sees the CTA buttons, **Then** "ABOUT AWARDS" and "ABOUT KUDOS" buttons are both visible.
2. **Given** the CTA buttons are visible, **When** the user clicks "ABOUT AWARDS", **Then** they navigate to the Awards Information (Awards System) page.
3. **Given** the CTA buttons are visible, **When** the user clicks "ABOUT KUDOS", **Then** they navigate to the Sun* Kudos page.
4. **Given** a CTA button is in normal state (outlined, white text), **When** the user hovers, **Then** the button fills with gold background (#FFEA9E) and text changes to dark (#00101A).

---

### User Story 4 - Read "Root Further" Event Description (Priority: P2)

An employee wants to understand the meaning and spirit behind the "ROOT FURTHER" theme.

**Why this priority**: Important for context but secondary to the core navigation and countdown features.

**Independent Test**: Scroll past the hero, verify the "Root Further" content section displays the description text with the English quote.

**Acceptance Scenarios**:

1. **Given** the user scrolls past the hero, **When** the content section appears, **Then** it shows the "ROOT FURTHER" graphic, long description paragraphs, and the English quote "A tree with deep roots fears no storm".
2. **Given** the content section is visible, **When** the user reads it, **Then** the text is clearly readable (24px Montserrat on dark background).

---

### User Story 5 - Navigate to Sun* Kudos (Priority: P2)

An employee wants to learn about the Sun* Kudos peer recognition program.

**Why this priority**: Cross-promotion of the Kudos feature, complementary to the awards.

**Independent Test**: Scroll to the Kudos section, verify promotional block and "Chi tiết" CTA.

**Acceptance Scenarios**:

1. **Given** the user scrolls to the Sun* Kudos section, **When** it appears, **Then** "Phong trào ghi nhận" label, "Sun* Kudos" title, "ĐIỂM MỚI CỦA SAA 2025" highlight label, description text, "KUDOS" decorative logo (SVN-Gotham font), and "Chi tiết" bordered button are visible.
2. **Given** the Kudos section is visible, **When** the user clicks "Chi tiết", **Then** they navigate to the Sun* Kudos detail page.

---

### User Story 6 - Use Global Header Navigation (Priority: P2)

An employee uses the header to navigate between the main pages of the SAA platform.

**Why this priority**: Standard navigation pattern, needed on all pages.

**Independent Test**: Verify header shows nav links with "About SAA 2025" active, other items navigable.

**Acceptance Scenarios**:

1. **Given** the user is on the homepage, **When** they view the header, **Then** "About SAA 2025" is highlighted (active, gold text with glow) while "Award Information" and "Sun* Kudos" are white.
2. **Given** the header is visible, **When** the user clicks "Award Information", **Then** they navigate to the Awards System page.
3. **Given** the header is visible, **When** the user clicks the notification bell icon, **Then** a notification panel opens.
4. **Given** the header is visible, **When** the user clicks the language selector "VN", **Then** the language dropdown opens (VN/EN options).
5. **Given** the header is visible, **When** the user clicks the user avatar icon, **Then** the profile dropdown opens (Profile/Logout, or Profile/Dashboard/Logout for admin).

---

### User Story 7 - Use Widget Button (Priority: P3)

> **SUPERSEDED**: The homepage-specific `WidgetButton.tsx` has been replaced by a global `FloatingActionButton` component rendered in the root layout (`src/app/layout.tsx`). The full FAB spec is in `.momorph/specs/313_9137-floating-action-button/`. The acceptance scenarios below are now covered by that spec.

An employee wants to quickly access action shortcuts via the floating widget button.

**Why this priority**: Nice-to-have quick action; not core to the homepage's information purpose.

**Independent Test**: Verify the widget button is visible and fixed at the bottom-right of the viewport.

**Acceptance Scenarios**:

1. **Given** the user is on any scroll position, **When** they look at the bottom-right corner, **Then** a floating pill-shaped yellow button with icons is visible.
2. **Given** the widget button is visible, **When** the user clicks it, **Then** a quick actions menu opens.

---

### Edge Cases

1. **Given** the `NEXT_PUBLIC_EVENT_DATETIME` environment variable is not configured or is invalid, **When** the page loads, **Then** the countdown section is hidden entirely and the hero section displays without countdown or "Coming soon" label.
2. **Given** the award data API call fails or times out, **When** the awards section renders, **Then** show 6 skeleton/placeholder cards (matching grid layout) with a subtle loading animation; do NOT show an error message.
3. **Given** the hero banner image is loading on a slow connection, **When** the page renders, **Then** `next/image` displays a blur-up placeholder until the full image loads.
4. **Given** the user resizes the browser from desktop to mobile, **When** the viewport crosses the 1024px breakpoint, **Then** the award grid transitions from 3 columns to 2 columns smoothly.
5. **Given** the user is not authenticated, **When** they visit the homepage, **Then** the page displays all content normally but the header profile icon shows a login prompt instead of profile dropdown.

---

## UI/UX Requirements *(from Figma)*

### Screen Components

| Component | Description | Interactions |
|-----------|-------------|--------------|
| Header | Global nav with logo, links, bell (with unread badge), language, profile | Sticky, click to navigate, open dropdowns; logo click scrolls to top |
| Hero Banner | "ROOT FURTHER" artwork with gradient overlay | Static background display |
| Countdown Timer | Days/Hours/Minutes with digital font | Real-time update (per minute) |
| Event Info | Date, venue, livestream details (dynamic from API) | Static display |
| CTA Buttons | "ABOUT AWARDS" and "ABOUT KUDOS" with arrow → icons | Click to navigate, hover state swap (outlined↔filled) |
| Root Further Content | Long description with quote | Static reading section |
| Awards Section Title | "Hệ thống giải thưởng" | Static display |
| Award Card Grid | 6 cards in 3x2 grid | Click card/title/link to navigate with hash |
| Award Card | Image (square, glow ring) + title + 2-line desc + "Chi tiết →" link | Hover: elevation + glow; click navigates with hash |
| Sun* Kudos Block | Promotional section with "Chi tiết →" CTA | Click "Chi tiết" to navigate |
| Widget Button | Floating pill (105x64px), pencil icon / SAA icon, yellow | Click to open quick actions |
| Footer | Logo, 4 nav links (About SAA, Awards, Kudos, Tiêu chuẩn chung), copyright | Click links to navigate |

### Navigation Flow

- From: Direct URL, redirect from countdown prelaunch page
- To (Awards): Awards Information page via CTA or card clicks (with hash)
- To (Kudos): Sun* Kudos page via CTA or "Chi tiết" link
- Internal: Header links to About SAA, Awards, Kudos pages
- Dropdowns: Language (VN/EN), Profile (Profile/Logout), Notification panel

### Visual Requirements

- See `design-style.md` for complete visual specifications
- Page: 1512px wide, deep dark blue (#00101A) background
- Hero: 1512x1392px with cover image and angled gradient overlay
- Countdown: "Digital Numbers" font for digits (~49px)
- CTA buttons: outlined → filled gold on hover
- Award grid: 3 cols (desktop), 2 cols (tablet/mobile)
- Card descriptions: max 2 lines with ellipsis
- Widget button: fixed bottom-right, pill shape, yellow/gold
- Accessibility: See detailed requirements below

### Accessibility Requirements

- **Semantic Headings**: Page `<h1>` should be "Sun* Annual Awards 2025" (can be visually hidden or the hero text). Section titles like "Hệ thống giải thưởng" and "Sun* Kudos" use `<h2>`. Award card titles use `<h3>`. Maintain logical heading hierarchy throughout.
- **Alt Text**: All award card images and hero banner must have descriptive `alt` attributes. Decorative images (glow rings, gradients) use `alt=""`.
- **Keyboard Navigation**: All interactive elements (CTA buttons, award cards, "Chi tiết" links, header nav, widget button) must be keyboard-focusable with visible focus indicators.
- **Focus Order**: Header → Hero CTA buttons → Root Further content → Award cards (left-to-right, top-to-bottom) → Kudos "Chi tiết" → Footer links → Widget button.
- **Screen Reader**: Countdown timer must have `aria-live="polite"` and `aria-label` describing the remaining time (e.g., "20 days, 20 hours, 20 minutes until event"). Updates should not interrupt screen reader announcements.
- **ARIA Roles**: Widget button uses `aria-expanded` for menu state. Header dropdowns use appropriate `role="menu"` patterns per dropdown specs.
- **Color Contrast**: Gold text (#FFEA9E) on dark bg (#00101A) meets WCAG AA. White text (#FFFFFF) on dark bg meets AAA.

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display a real-time countdown timer (Days/Hours/Minutes) targeting a configurable event datetime (ISO-8601 env var).
- **FR-002**: System MUST hide "Coming soon" label when countdown reaches 0.
- **FR-003**: System MUST display event details (date, venue, livestream info).
- **FR-004**: System MUST display two CTA buttons ("ABOUT AWARDS", "ABOUT KUDOS") that navigate to their respective pages.
- **FR-005**: System MUST display 6 award category cards in a responsive grid (3 cols desktop, 2 cols mobile/tablet).
- **FR-006**: System MUST navigate to the Awards Information page with a URL hash when an award card is clicked, triggering auto-scroll to the specific award section.
- **FR-007**: System MUST display the Sun* Kudos promotional section with "Chi tiết" navigation.
- **FR-008**: System MUST display the global header with "About SAA 2025" as the active link.
- **FR-009**: System MUST display a floating widget button (105x64px pill, fixed bottom-right, pencil icon / SAA icon) that opens a quick actions menu on click.
- **FR-010**: System MUST display the "Root Further" content section with description and English quote. Content text may be hardcoded for v1 (static Vietnamese content) but should be structured for future i18n extraction.
- **FR-011**: System MUST truncate award card descriptions to 2 lines with ellipsis overflow.
- **FR-012**: Header MUST include notification bell (with red badge for unread notifications), language selector (VN/EN), and user profile icon with their respective dropdown behaviors.
- **FR-013**: Header logo click MUST scroll to page top (if on homepage) or navigate to homepage.
- **FR-014**: CTA buttons and "Chi tiết" links MUST include an arrow → icon alongside the text.
- **FR-015**: Footer MUST display 4 navigation links: "About SAA 2025", "Award Information", "Sun* Kudos", and "Tiêu chuẩn chung" (Standards).

### Technical Requirements

- **TR-001**: Countdown timer target datetime MUST be configurable via `NEXT_PUBLIC_EVENT_DATETIME` environment variable (ISO-8601 format). This must use the `NEXT_PUBLIC_` prefix because the countdown runs client-side. The `/api/event` endpoint provides the same datetime for server-rendered event info display — both sources should be kept in sync.
- **TR-002**: Countdown updates MUST occur per minute (not per second) as per design spec.
- **TR-003**: Use `next/image` for hero banner and award card images per constitution.
- **TR-004**: Hero gradient overlay MUST use CSS gradient (not image).
- **TR-005**: "Digital Numbers", "SVN-Gotham", and "Montserrat Alternates" fonts must be loaded in addition to Montserrat (Digital Numbers for countdown, SVN-Gotham for Kudos branding, Montserrat Alternates for footer copyright).
- **TR-006**: Award card "Chi tiết" links must use `next/link` with hash fragment (e.g., `/awards#top-talent`).
- **TR-007**: Component architecture: Page is primarily Server Component; countdown timer, widget button, and header dropdowns require Client Components.
- **TR-008**: Award card data should come from API/database for i18n support.
- **TR-009**: Widget button must use `position: fixed` with high z-index.

### State Management

- **Countdown Timer** (Client Component): Local state for `days`, `hours`, `minutes`. Uses `setInterval` (60s) to recalculate from `NEXT_PUBLIC_EVENT_DATETIME` env var. State: `isExpired` boolean to conditionally hide "Coming soon" label.
- **Widget Button** (Client Component): Local state for `isOpen` boolean controlling quick actions menu visibility.
- **Header Dropdowns** (Client Components): Local state per dropdown for open/close. Profile dropdown needs auth state (`user`, `isAdmin`) from Supabase Auth context.
- **Award Cards**: No client state — Server Component with static data from API.
- **Loading States**: Skeleton UI for awards grid while data loads; blur-up placeholder for hero image.
- **Error States**: Fallback skeleton cards if awards API fails; countdown section hidden if env var missing/invalid.

### Key Entities *(if feature involves data)*

- **Event**: `id`, `name`, `theme`, `dateTime` (ISO-8601), `venue`, `livestreamInfo`, `heroBannerUrl`.
- **AwardCategory**: `id`, `name`, `slug` (URL-safe, used for both API identification and hash navigation, e.g., "top-talent"), `shortDescription`, `thumbnailUrl`, `order`.

---

## API Dependencies

| Endpoint | Method | Purpose | Status |
|----------|--------|---------|--------|
| /api/event | GET | Fetch event info (date, venue, banner) | Predicted |
| /api/awards | GET | Fetch award categories (for card grid) | Predicted |
| Environment: `NEXT_PUBLIC_EVENT_DATETIME` | - | Countdown target datetime (ISO-8601) | Env var |

**Predicted Response Shapes:**

```typescript
// GET /api/event
interface EventResponse {
  id: string;
  name: string;           // "Sun* Annual Awards 2025"
  theme: string;          // "ROOT FURTHER"
  dateTime: string;       // ISO-8601, e.g., "2025-12-26T18:30:00+07:00"
  venue: string;          // "Âu Cơ Art Center"
  livestreamInfo: string; // "Tường thuật trực tiếp qua sóng Livestream"
  heroBannerUrl: string;  // URL to hero banner image
}

// GET /api/awards
interface AwardCategoryResponse {
  id: string;
  name: string;             // "Top Talent"
  slug: string;             // "top-talent" (used for hash navigation)
  shortDescription: string; // Max ~100 chars, displayed as 2 lines
  thumbnailUrl: string;     // URL to award image
  order: number;            // Display order (1-6)
}
type AwardsResponse = AwardCategoryResponse[];
```

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Countdown timer displays correct remaining time within 1-minute accuracy.
- **SC-002**: All 6 award cards render with complete information on page load.
- **SC-003**: CTA button hover state transitions smoothly within 150ms.
- **SC-004**: Award card click navigates to correct hash URL and auto-scrolls to the right section.
- **SC-005**: Page loads within 2 seconds on standard connection (LCP for hero banner).
- **SC-006**: Page renders correctly at all three breakpoints per constitution.
- **SC-007**: Widget button remains visible and clickable at all scroll positions.

---

## Out of Scope

- Award nomination/submission from homepage
- Live event streaming (only a link/info display)
- User-specific award recommendations
- Admin dashboard access from homepage (handled via profile dropdown)
- Countdown with seconds granularity (updates per minute only)

---

## Dependencies

- [ ] Constitution document exists (`.momorph/constitution.md`) - **YES**
- [ ] Header component (shared) - Shared with Awards System page
- [ ] Footer component (shared) - Shared with Awards System page
- [ ] Sun* Kudos promo component (shared) - Shared with Awards System page
- [ ] Awards System page (navigation target) - `.momorph/specs/313-8436-He-thong-giai/`
- [ ] Sun* Kudos page (navigation target) - **TBD**
- [ ] Countdown prelaunch page (predecessor) - `.momorph/specs/2-Countdown-Prelaunch-page/`
- [ ] Language Dropdown - `.momorph/specs/721-4942-Dropdown-ngon-ngu/`
- [ ] Profile Dropdown - `.momorph/specs/721-5223-Dropdown-profile/`
- [ ] Admin Profile Dropdown - `.momorph/specs/721-5277-Dropdown-profile-Admin/`
- [ ] "Digital Numbers" font file - Required for countdown
- [ ] "SVN-Gotham" font file - Required for Kudos decorative text
- [ ] Hero banner image asset - From design team

---

## Related Specs

- **Awards System Page** (`.momorph/specs/313-8436-He-thong-giai/`): Primary navigation target from award cards and "ABOUT AWARDS" CTA. Shares Header, Footer, Sun* Kudos components.
- **Countdown Prelaunch Page** (`.momorph/specs/2-Countdown-Prelaunch-page/`): Shows before the homepage when event countdown is active. May redirect to homepage when complete.
- **Language Dropdown** (`.momorph/specs/721-4942-Dropdown-ngon-ngu/`): Used in header.
- **Profile Dropdown** (`.momorph/specs/721-5223-Dropdown-profile/`): Used in header.
- **Admin Profile Dropdown** (`.momorph/specs/721-5277-Dropdown-profile-Admin/`): Used in header for admin users.

---

## Notes

### Shared Components with Awards System Page

The following components are shared and should be implemented once:
1. **Header** (`<Header>`) - with `activeLink` prop for highlighting current page
2. **Footer** (`<Footer>`)
3. **Sun* Kudos Promo** (`<SunKudosPromo>`)

### Homepage-Specific Components

1. **Countdown Timer** (`<CountdownTimer>`) - Client Component, "Digital Numbers" font, per-minute updates
2. **CTA Buttons** (`<CTAButtons>`) - outlined-to-filled hover transition
3. **Award Card Grid** (`<AwardGrid>`) - responsive 3/2 column grid
4. **Award Card** (`<AwardCard>`) - image + title + 2-line desc + "Chi tiết" link
5. **Root Further Content** (`<RootFurtherContent>`) - large padded reading section with quote
6. **Widget Button** (`<WidgetButton>`) - floating action button, Client Component

### Key Differences from Awards System Page

| Feature | Homepage | Awards System |
|---------|----------|--------------|
| Page width | 1512px | 1440px |
| Award display | Summary cards (grid) | Full detail cards (list) |
| Has countdown | Yes | No |
| Has CTA buttons | Yes | No |
| Has sidebar nav | No | Yes (sticky) |
| Award card title weight | 400 | 700 |
| Has widget button | Yes | No |
| Has "Root Further" content | Yes | No |
| Content width | 1224px | 1152px |

### Navigation with Hash

Award card clicks should navigate using URL hash fragments:
- Top Talent → `/awards#top-talent`
- Top Project → `/awards#top-project`
- Top Project Leader → `/awards#top-project-leader`
- Best Manager → `/awards#best-manager`
- Signature 2025 → `/awards#signature-2025-creator`
- MVP → `/awards#mvp`

The Awards System page sidebar navigation should use matching IDs for scroll-spy anchors.
