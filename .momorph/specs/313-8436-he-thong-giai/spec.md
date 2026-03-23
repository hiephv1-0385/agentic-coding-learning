# Feature Specification: Hệ thống giải thưởng SAA 2025

**Frame ID**: `313:8436`
**Frame Name**: `Hệ thống giải`
**File Key**: `9ypp4enmFmdK3YAFJLIu6C`
**Created**: 2026-03-12
**Status**: Draft
**Reviewed**: 2026-03-12 (10th pass — implementation-ready)

---

## Overview

The "Hệ thống giải thưởng SAA 2025" (Award System) page is a public-facing informational page for the Sun* Annual Awards 2025. It showcases the complete award categories with descriptions, quantities, and prize values. The page features a hero banner, a sidebar navigation for quick access to award categories, detailed award cards for each category, and a promotional section for the Sun* Kudos recognition program.

This is primarily a **content display page** with minimal interactivity (sidebar navigation smooth scrolling, CTA button to Kudos page).

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View Award Categories Overview (Priority: P1)

A Sun* employee visits the Award Information page to understand all available award categories for SAA 2025, including their descriptions, number of awards, and prize values.

**Why this priority**: This is the core purpose of the page - displaying award information. Without this, the page has no value.

**Independent Test**: Navigate to the awards page and verify all 6 award categories are displayed with correct information.

**Acceptance Scenarios**:

1. **Given** a user navigates to the Award Information page, **When** the page loads, **Then** the hero banner with "ROOT FURTHER" decorative image (root-further-hero.png) and gradient overlay is displayed
2. **Given** the page has loaded, **When** the user scrolls down, **Then** they see the section title area: "Sun* Annual Awards 2025" subtitle (24px, center-aligned), a horizontal divider line, and "Hệ thống giải thưởng SAA 2025" page title (57px, gold), followed by 6 award category cards
3. **Given** the award cards are visible, **When** the user reads a card (e.g., Top Talent), **Then** they see: the award image, title with prefix icon, description paragraph, a divider, quantity stat in a single inline row (icon + "Số lượng giải thưởng:" + "10" + "Cá nhân"), another divider, and prize section in multi-line format (icon + "Giá trị giải thưởng:" on line 1, "7.000.000 VNĐ" on line 2, "cho mỗi giải thưởng" on line 3)
4. **Given** the page has loaded, **When** the user views award cards, **Then** all 6 categories are displayed in order: Top Talent, Top Project, Top Project Leader, Best Manager, Signature 2025 - Creator, MVP
5. **Given** the award cards are displayed, **When** the user observes the layout, **Then** odd cards (1st, 3rd, 5th) show image-left/content-right, and even cards (2nd, 4th, 6th) show content-left/image-right

---

### User Story 2 - Navigate Between Award Categories via Sidebar (Priority: P2)

A user wants to quickly jump to a specific award category without scrolling through the entire page.

**Why this priority**: Enhances usability for a long page with multiple sections. Important but the page still works without it.

**Independent Test**: Click each sidebar item and verify the page scrolls to the corresponding award card.

**Acceptance Scenarios**:

1. **Given** the user is viewing the awards page, **When** they see the sidebar menu on the left, **Then** it displays 6 items: Top Talent, Top Project, Top Project Leader, Best Manager, Signature 2025 - Creator, MVP
2. **Given** the sidebar is visible, **When** the user clicks "Best Manager" in the sidebar, **Then** the page smooth-scrolls to the Best Manager award card and the sidebar item becomes active (gold color + underline + gold glow text-shadow)
3. **Given** the user has clicked a sidebar item, **When** the page scrolls to that section, **Then** the previously active sidebar item returns to default state (white text, no underline)
4. **Given** the user is scrolling through the page, **When** a new award card enters the viewport, **Then** the corresponding sidebar item automatically becomes active (scroll spy behavior)
5. **Given** the sidebar is displayed, **When** the user scrolls down the page, **Then** the sidebar remains visible (sticky positioning) within the award system section

---

### User Story 3 - Navigate to Sun* Kudos Detail Page (Priority: P2)

A user wants to learn more about the Sun* Kudos recognition program after seeing the promotional section.

**Why this priority**: Provides cross-navigation to the Kudos feature. Important for user engagement but secondary to viewing award info.

**Independent Test**: Click the "Chi tiết" button in the Kudos section and verify navigation.

**Acceptance Scenarios**:

1. **Given** the user scrolls past all award cards, **When** they reach the Sun* Kudos section, **Then** they see a two-column layout: left column contains the label "Phong trào ghi nhận" (24px, gold), title "Sun* Kudos" (57px, gold, bold), a description block starting with "ĐIỂM MỚI CỦA SAA 2025" as the first line followed by the description paragraph (16px, white, single text block), and a "Chi tiết" button with arrow icon; right column contains the Sun* Kudos logo (S-wing mark + "KUDOS" wordmark)
2. **Given** the Sun* Kudos section is visible, **When** the user clicks the "Chi tiết" button, **Then** they are navigated to the Sun* Kudos Live Board page (`/kudos`)

---

### User Story 4 - Responsive Display on Mobile/Tablet (Priority: P3)

A user accesses the Award Information page from a mobile device and can view all content correctly.

**Why this priority**: Ensures accessibility across devices. Constitution mandates responsive design but the primary audience likely uses desktop.

**Independent Test**: Resize browser to mobile/tablet breakpoints and verify layout adjusts correctly.

**Acceptance Scenarios**:

1. **Given** the user opens the page on mobile (< 640px), **When** the page loads, **Then** the layout switches to single column, award cards stack vertically with image above content, and the alternating layout is disabled (all cards use image-top/content-bottom)
2. **Given** mobile view, **When** the user views the sidebar menu, **Then** it becomes a horizontal scrollable tab bar or dropdown instead of a vertical sidebar
3. **Given** tablet view (640px-1023px), **When** the page loads, **Then** the layout adjusts with reduced padding and the award system may use a narrower sidebar or stacked layout
4. **Given** any breakpoint, **When** the user views award images, **Then** they scale appropriately maintaining aspect ratio without overflow

---

### User Story 5 - Keyboard and Screen Reader Accessibility (Priority: P3)

A user with accessibility needs navigates the page using keyboard or screen reader.

**Why this priority**: WCAG compliance and inclusive design. Supports all users.

**Independent Test**: Navigate the entire page using only keyboard; verify with screen reader.

**Acceptance Scenarios**:

1. **Given** a keyboard user is on the page, **When** they Tab through the sidebar, **Then** each tab item receives visible focus and can be activated with Enter/Space
2. **Given** a keyboard user activates a sidebar item, **When** the page scrolls to the award card, **Then** focus moves to the target card heading
3. **Given** a screen reader user, **When** they encounter an award card image, **Then** they hear a descriptive alt text (e.g., "Top Talent award icon")
4. **Given** a screen reader user, **When** they navigate the sidebar, **Then** it is announced as a navigation landmark with role="navigation" and aria-label

---

### Edge Cases

- What happens when award data fails to load from the database? Display a loading skeleton first, then show an error message with retry option.
- How does the sidebar behave when the page is shorter than expected (e.g., some cards hidden)? Ensure scroll spy handles missing sections gracefully.
- What happens on very small screens (< 320px)? Content should still be readable without horizontal scroll.
- What if award images fail to load? Show a fallback placeholder maintaining the 336x336 dimensions with the award name as text.
- What happens when JavaScript is disabled? Content should still be visible (Server Component renders). Sidebar click-to-scroll degrades gracefully (anchor links still work).

---

## UI/UX Requirements *(from Figma)*

### Screen Components

| Component | Node ID | Description | Interactions |
|-----------|---------|-------------|--------------|
| Keyvisual/Hero Banner | 313:8437 | Full-width hero image (1440x547) with "ROOT FURTHER" decorative image (root-further-hero.png, same as homepage), gradient overlay. Section title "Sun* Annual Awards 2025" + "Hệ thống giải thưởng SAA 2025" visually overlaps hero bottom area. | Static display |
| Section Title | 313:8453 | Three elements stacked vertically: "Sun* Annual Awards 2025" subtitle (24px, white, center-aligned), a divider line (1px, #2E3940), and "Hệ thống giải thưởng SAA 2025" page title (57px, gold, same size as hero title) | Static display |
| Award System Container | 313:8458 | Two-column layout: sidebar menu (left) + award cards (right), gap: 80px | Flex row layout |
| Sidebar Menu | 313:8459 | 6 navigation items for award categories, sticky positioning | Click to scroll, scroll spy, hover highlight, keyboard nav |
| Sidebar Tab Item | 313:8460-8465 | Individual navigation item with active/hover/default states | Click, hover, focus, keyboard |
| Award Card (x6) | 313:8467-8510 | Image + title (with prefix icon) + description + divider + quantity stat (single inline row: icon + label + number + unit) + divider + prize section (multi-line: icon + label → amount → sub-label). Alternating layout: odd=image-left, even=image-right | Static display, scroll target anchor |
| Award Card Image | I313:8467;214:2525 | 336x336px image with gold border and gold glow shadow | Static display |
| Award Card Divider | (within cards) | Horizontal line separating content sections within each card | Static display |
| Sun* Kudos Section | 335:12023 | Two-column promotional block: left column (label "Phong trào ghi nhận" 24px gold + title "Sun* Kudos" 57px gold + description block starting with "ĐIỂM MỚI CỦA SAA 2025" as first line, 16px white, single text node + CTA button), right column (Kudos artwork + decorative "KUDOS" text) | CTA button click |
| "Chi tiết" Button | I335:12023;313:8426 | Warm beige button (#DBD1C1) with arrow icon, text "#00101A" | Click navigates to `/kudos` |
| Header | (shared) | Fixed header with logo, nav links (About SAA 2025, Award Information, Sun* Kudos), notification bell, language selector, profile | Nav clicks, dropdowns |
| Footer | (shared) | Footer with nav links, "Tiêu chuẩn chung", copyright | Nav clicks |

### Navigation Flow

**Entry Points:**
- Header "Award Information" nav link (from any page)
- Direct URL navigation
- Homepage SAA CTAs or links pointing to this page

**Exit Points:**
- "Chi tiết" button → Sun* Kudos Live Board (`/kudos`)
- Header nav "About SAA 2025" → Homepage SAA (`/`)
- Header nav "Sun* Kudos" → Sun* Kudos Live Board (`/kudos`)
- Footer nav links → respective pages
- Header profile dropdown → Profile/Settings/Logout
- Header notification bell → Notifications
- Footer "Tiêu chuẩn chung" → Standards page (if exists)

**Internal Navigation:**
- Sidebar tab clicks → smooth scroll to corresponding award card section (anchor links)

### Visual Requirements

- Responsive breakpoints: Mobile (< 640px), Tablet (640-1023px), Desktop (>= 1024px)
- Animations/Transitions: Smooth scroll on sidebar click (300ms ease-out), hover transitions on nav/buttons (150ms ease-in-out)
- Accessibility: WCAG AA contrast on dark background, alt text on all images, keyboard navigable sidebar, ARIA landmarks
- Heading hierarchy:
  - `h1`: "Hệ thống giải thưởng SAA 2025" (page title, 57px gold — same size as hero title but semantically the h1)
  - `h2`: Each award category title ("Top Talent", "Top Project", etc.) and "Sun* Kudos" section title
  - "Sun* Annual Awards 2025" is a subtitle/kicker above the h1 (24px white, center-aligned), separated by a divider line
  - "ROOT FURTHER" is decorative, not a heading (use `aria-hidden="true"` or a `<p>` with visual styling)
- See [design-style.md](./design-style.md) for complete visual specifications

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display all 6 award categories (Top Talent, Top Project, Top Project Leader, Best Manager, Signature 2025 - Creator, MVP) in the specified order with their respective information
- **FR-002**: System MUST render each award card with: image, title (with prefix icon), description, divider, quantity stat as a single inline row (icon + label + number + unit), divider, and prize section as multi-line (icon + label line → amount line → sub-label line) in VNĐ format. Cards use alternating layout: odd cards (1st, 3rd, 5th) have image-left/content-right (`flex-direction: row`), even cards (2nd, 4th, 6th) have content-left/image-right (`flex-direction: row-reverse`)
- **FR-003**: Sidebar navigation MUST smooth-scroll to the corresponding award card when clicked, using anchor-based navigation
- **FR-004**: Sidebar MUST highlight the active award category based on scroll position (scroll spy using IntersectionObserver)
- **FR-005**: Sidebar MUST use sticky positioning to remain visible while scrolling through award cards
- **FR-006**: "Chi tiết" button in Sun* Kudos section MUST navigate to the Kudos Live Board page (`/kudos`) using `next/link`
- **FR-007**: Hero banner MUST display the artwork background image with bottom-to-top gradient overlay and "ROOT FURTHER" decorative image (root-further-hero.png, same asset as homepage)
- **FR-008**: Page MUST be responsive across mobile, tablet, and desktop breakpoints per Constitution requirements
- **FR-009**: Page MUST include `loading.tsx` and `error.tsx` route-level states per Constitution
- **FR-010**: The "Signature 2025 - Creator" card MUST display two complete prize sections separated by "Hoặc" inline-labeled divider. Each prize section has its own icon + "Giá trị giải thưởng:" label + amount + sub-label: first tier "5.000.000 VNĐ" (cho giải cá nhân), second tier "8.000.000 VNĐ" (cho giải tập thể). The quantity stat shows "01" with unit "Cá nhân hoặc tập thể"

### Technical Requirements

- **TR-001**: Page MUST achieve Lighthouse performance score >= 90 (Core Web Vitals compliant)
- **TR-002**: Hero image and award images MUST use `next/image` with appropriate sizing for optimization
- **TR-003**: Award data SHOULD be fetched from Supabase (awards table) via Server Component data fetching (no `useEffect`)
- **TR-004**: Page MUST be Server Component by default (per Constitution). Only the sidebar scroll-spy component uses `"use client"`
- **TR-005**: Internal navigation MUST use `next/link` (per Constitution)
- **TR-006**: MUST use Montserrat font (primary) loaded via Google Fonts or local files
- **TR-007**: MUST be compatible with Cloudflare Workers runtime (per Constitution)
- **TR-008**: Route MUST be at `src/app/awards/page.tsx` following kebab-case convention
- **TR-009**: Page MUST set `scroll-padding-top: 96px` (header 80px + 16px buffer) to prevent fixed header from obscuring anchor-scroll targets when sidebar navigation is used

### Key Entities *(if feature involves data)*

- **Award Category**: Represents an award type with fields:
  - `id`: UUID (primary key)
  - `name`: string (Vietnamese name, e.g., "Top Talent")
  - `name_en`: string (English name)
  - `description`: text (Vietnamese description paragraph)
  - `image_url`: string (URL to award badge/icon image)
  - `quantity`: integer (number of awards given)
  - `unit_type`: string - displayed as-is next to the quantity number. Known values: "Cá nhân", "Tập thể", "Cá nhân hoặc tập thể"
  - `prize_value`: integer (prize amount in VNĐ)
  - `prize_value_team`: integer | null (second prize tier for team, only for Signature 2025)
  - `prize_sub_label`: string (e.g., "cho mỗi giải thưởng", "cho giải cá nhân")
  - `prize_sub_label_team`: string | null (e.g., "cho giải tập thể")
  - `display_order`: integer (1-6, determines card position and alternating layout)
- **Sun* Kudos Promo**: Static promotional content (could be hardcoded or from CMS)

### Award Data Reference

| # | Award | Quantity | Unit | Prize Value | Sub-label | Prize Value (Team) | Sub-label (Team) |
|---|-------|----------|------|-------------|-----------|-------------------|------------------|
| 1 | Top Talent | 10 | Cá nhân | 7.000.000 VNĐ | cho mỗi giải thưởng | - | - |
| 2 | Top Project | 02 | Tập thể | 15.000.000 VNĐ | cho mỗi giải thưởng | - | - |
| 3 | Top Project Leader | 03 | Cá nhân | 7.000.000 VNĐ | cho mỗi giải thưởng | - | - |
| 4 | Best Manager | 01 | Cá nhân | 10.000.000 VNĐ | cho mỗi giải thưởng | - | - |
| 5 | Signature 2025 - Creator | 01 | Cá nhân hoặc tập thể | 5.000.000 VNĐ | cho giải cá nhân | 8.000.000 VNĐ | cho giải tập thể |
| 6 | MVP (Most Valuable Person) | 01 | Cá nhân | 15.000.000 VNĐ | (none) | - | - |

---

## State Management

### Local State (Client Component - Sidebar only)

| State | Type | Initial | Description |
|-------|------|---------|-------------|
| `activeCategory` | `string` | First category ID | Currently active sidebar tab, updated by scroll spy or click |

### Global State

No global state required. This is a read-only informational page.

### Loading States

| State | Behavior |
|-------|----------|
| Page loading | `loading.tsx` — skeleton layout matching the award card structure |
| Image loading | `next/image` blur placeholder or shimmer effect |
| Error | `error.tsx` — error message with retry button, maintains dark theme |

---

## API Dependencies

| Endpoint | Method | Purpose | Status |
|----------|--------|---------|--------|
| Supabase: `awards` table query | SELECT | Fetch all award categories ordered by `display_order` | Predicted/New |

**Note**: Given this is primarily a static content page, data could alternatively be:
1. Seeded in Supabase and fetched at request time via Server Component (recommended)
2. Stored as static data in the codebase (simpler but less maintainable)

No REST API endpoint is needed — use Supabase client SDK directly in the Server Component.

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: All 6 award categories display correctly with accurate data (image, title, description, dividers, quantity with icon/unit, prize value with icon/sub-label)
- **SC-002**: Sidebar navigation works correctly — clicking any item scrolls to the right card, highlights the active item, and scroll spy updates on manual scroll
- **SC-003**: Page passes Lighthouse performance audit with score >= 90
- **SC-004**: Page renders correctly on all 3 breakpoints (mobile, tablet, desktop) with no horizontal overflow
- **SC-005**: "Chi tiết" button successfully navigates to `/kudos`
- **SC-006**: All text meets WCAG AA contrast ratio requirements (4.5:1 for normal text, 3:1 for large text) on dark background
- **SC-007**: Alternating card layout renders correctly (odd: image-left, even: image-right)
- **SC-008**: Sidebar is keyboard-navigable (Tab, Enter/Space to activate)
- **SC-009**: `loading.tsx` and `error.tsx` are implemented for the route

---

## Out of Scope

- Award nomination or voting functionality (this is display-only)
- User authentication requirements for viewing this page (public page)
- Award winner announcements or results display
- Admin interface for managing award content
- Animation effects on award card images (beyond CSS transitions)
- Multi-language support (page is in Vietnamese only for this spec)
- Header and Footer implementation (shared components, specified separately)

---

## Dependencies

- [x] Constitution document exists (`.momorph/constitution.md`)
- [ ] Database design completed with `awards` table
- [x] Screen flow documented (`.momorph/contexts/SCREENFLOW.md`) — updated in 1st review pass with correct entry/exit points
- [ ] Award images/assets available (6 badge images, 336x336px each)
- [ ] Montserrat font configured in project
- [ ] Shared Header component available
- [ ] Shared Footer component available

---

## Notes

- The page design width is 1440px with 144px horizontal padding yielding 1152px content width
- All font weights in the design are 700 (Bold) — this is a design choice for the awards theme
- The gold color (#FFEA9E) is the primary accent throughout the page — define as a Tailwind theme color (e.g., `gold`)
- The sidebar menu should be sticky (`position: sticky`) to remain visible while scrolling through award cards
- Award card images (336x336px) have a distinctive gold glow shadow effect that should be preserved
- The "Signature 2025 - Creator" award uniquely has two prize tiers separated by "Hoặc" (Or)
- Award cards use **alternating layout**: odd-numbered cards have image on the left (`flex-direction: row`), even-numbered cards have image on the right (`flex-direction: row-reverse`)
- SVN-Gotham font is used only for the decorative "KUDOS" text in the Sun* Kudos section — evaluate if this warrants a separate font load or can be replaced with a styled alternative
- Each award card has internal divider lines (thin horizontal rules) between the description, quantity, and prize value sections
- Each stat row (quantity and prize value) has a small icon prefix (pin/location icon for quantity, badge/license icon for prize value)
- Design-style reference: [design-style.md](./design-style.md) contains all visual specifications including colors, typography, spacing, and component styles
- Top Talent unit type confirmed as "Cá nhân" (individual), not "Đơn vị" — verified with stakeholder (4th review pass)
