# Feature Specification: Thể lệ (Rules) Panel

**Frame ID**: `3204:6051`
**Frame Name**: `Thể lệ UPDATE`
**File Key**: `9ypp4enmFmdK3YAFJLIu6C`
**Created**: 2026-03-16
**Status**: Reviewed

---

## Overview

The **Thể lệ (Rules) Panel** is a modal/slide-in panel that displays the complete rules and reward system for the SAA 2025 Kudos feature. It explains three reward mechanisms:

1. **Kudos Receivers** earn Hero badges based on how many unique people send them Kudos
2. **Kudos Senders** collect exclusive SAA icons by earning hearts on their Kudos posts
3. **Kudos Quốc Dân (National Kudos)** recognizes the top 5 most-loved Kudos posts

The panel is a sidebar overlay toggled from the Floating Action Button (FAB) expanded state (313:9139) via the "Thể lệ" button. There is no dedicated route — the panel is controlled by `isOpen`/`onClose`/`onWriteKudos` props. It provides two actions: close the panel (via `onClose()`) or open the KudoModal to write a new Kudos (via `onWriteKudos()`).

---

## Static Content Reference

The following is the **exact Vietnamese copy** from the Figma design. Developers MUST use this text verbatim (or via i18n locale keys).

### Section 1: Người nhận Kudos

**Heading**: NGƯỜI NHẬN KUDOS: HUY HIỆU HERO CHO NHỮNG ẢNH HƯỞNG TÍCH CỰC

**Description**: Dựa trên số lượng đồng đội gửi trao Kudos, bạn sẽ sở hữu Huy hiệu Hero tương ứng, được hiển thị trực tiếp cạnh tên profile

**Hero Badge Tiers**:

| Badge | Threshold Text | Description |
|-------|---------------|-------------|
| New Hero | Có 1-4 người gửi Kudos cho bạn | Hành trình lan tỏa điều tốt đẹp bắt đầu – những lời cảm ơn và ghi nhận đầu tiên đã tìm đến bạn. |
| Rising Hero | Có 5-9 người gửi Kudos cho bạn | Hình ảnh bạn đang lớn dần trong trái tim đồng đội bằng sự tử tế và cống hiến của mình. |
| Super Hero | Có 10–20 người gửi Kudos cho bạn | Bạn đã trở thành biểu tượng được tin tưởng và yêu quý, người luôn sẵn sàng hỗ trợ và được nhiều đồng đội nhớ đến. |
| Legend Hero | Có hơn 20 người gửi Kudos cho bạn | Bạn đã trở thành huyền thoại – người để lại dấu ấn khó quên trong tập thể bằng trái tim và hành động của mình. |

### Section 2: Người gửi Kudos

**Heading**: NGƯỜI GỬI KUDOS: SƯU TẬP TRỌN BỘ 6 ICON, NHẬN NGAY PHẦN QUÀ BÍ ẨN

**Description**: Mỗi lời Kudos bạn gửi sẽ được đăng tải trên hệ thống và nhận về những lượt ❤️ từ cộng đồng Sunner. Cứ mỗi 5 lượt ❤️, bạn sẽ được mở 1 Secret Box, với cơ hội nhận về một trong 6 icon độc quyền của SAA.

**Collection Badges** (3x2 grid): REVIVAL, TOUCH OF LIGHT, STAY GOLD, FLOW TO HORIZON, BEYOND THE BOUNDARY, ROOT FURTHER

**Completion Text**: Những Sunner thu thập trọn bộ 6 icon sẽ nhận về một phần quà bí ẩn từ SAA 2025.

### Section 3: Kudos Quốc Dân

**Heading**: KUDOS QUỐC DÂN

**Description**: 5 Kudos nhận về nhiều ❤️ nhất toàn Sun* sẽ chính thức trở thành Kudos Quốc Dân và được trao phần quà đặc biệt từ SAA 2025: Root Further.

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View Kudos Rules (Priority: P1)

A user wants to understand how the Kudos reward system works before participating, so they can maximize their engagement and earn badges/icons.

**Why this priority**: This is the core purpose of the panel - without readable, complete rules, users cannot understand the Kudos system.

**Independent Test**: Open the Rules panel and verify all three sections (Receiver badges, Sender icons, National Kudos) are displayed with correct content.

**Acceptance Scenarios**:

1. **Given** a user is on any authenticated page, **When** they click the "Thể lệ" button in the FAB, **Then** the panel slides in from the right displaying the title "Thể lệ" and all three reward sections with correct text content.
2. **Given** the Rules panel is open, **When** the content exceeds the panel height, **Then** the user can scroll within the panel to read all content while the footer buttons remain fixed.
3. **Given** the Rules panel is open, **When** the user reads the "Người nhận Kudos" section, **Then** they see all four Hero badge tiers (New Hero, Rising Hero, Super Hero, Legend Hero) with their corresponding thresholds and descriptions.
4. **Given** the Rules panel is open, **When** the user reads the "Người gửi Kudos" section, **Then** they see all six collection badges (REVIVAL, TOUCH OF LIGHT, STAY GOLD, FLOW TO HORIZON, BEYOND THE BOUNDARY, ROOT FURTHER) displayed in a 3x2 grid.

---

### User Story 2 - Close the Rules Panel (Priority: P1)

A user has finished reading the rules and wants to return to the previous screen.

**Why this priority**: Essential navigation - users must be able to dismiss the panel.

**Independent Test**: Open the Rules panel, click "Đóng", verify the panel closes and user returns to the previous view.

**Acceptance Scenarios**:

1. **Given** the Rules panel is open, **When** the user clicks the "Đóng" (Close) button, **Then** the panel closes by calling `onClose()`.
2. **Given** the Rules panel is open, **When** the user clicks outside the panel (on the dark overlay area), **Then** the panel closes by calling `onClose()`.
3. **Given** the Rules panel is open, **When** the user presses the Escape key, **Then** the panel closes by calling `onClose()`.

---

### User Story 3 - Navigate to Write Kudos (Priority: P1)

A user reads the rules and is motivated to write a Kudos, so they click the "Viết KUDOS" button to open the Kudos writing form.

**Why this priority**: This is a key conversion action - turning rule-reading into engagement.

**Independent Test**: Open the Rules panel, click "Viết KUDOS", verify the Kudos writing form/modal opens.

**Acceptance Scenarios**:

1. **Given** the Rules panel is open, **When** the user clicks the "Viết KUDOS" button, **Then** the KudoModal opens (via `onWriteKudos()` callback, linked frame ID: 520:11602).
2. **Given** the Rules panel is open, **When** the user clicks "Viết KUDOS", **Then** the Rules panel closes and the KudoModal is displayed.

---

### User Story 4 - View Hero Badge Tiers (Priority: P2)

A user wants to understand the progression system for Kudos receivers to know what badge tier they can achieve.

**Why this priority**: Provides gamification context that motivates engagement, but is informational only.

**Independent Test**: Verify each Hero badge tier displays the correct badge visual, threshold range, and motivational description.

**Acceptance Scenarios**:

1. **Given** the Rules panel is open, **When** the user views the Hero badge section, **Then** they see:
   - **New Hero**: 1-4 unique senders, with description about starting the journey
   - **Rising Hero**: 5-9 unique senders, with description about growing reputation
   - **Super Hero**: 10-20 unique senders, with description about being a trusted symbol
   - **Legend Hero**: 20+ unique senders, with description about becoming legendary

2. **Given** the Rules panel is open, **When** the user views each Hero badge, **Then** each badge pill has a distinct visual style (increasing visual complexity from New Hero to Legend Hero).

---

### User Story 5 - View Collection Badge System (Priority: P2)

A user wants to understand how to collect the 6 exclusive SAA icons and what the mystery reward is for completing the collection.

**Why this priority**: Gamification mechanic that drives repeated Kudos sending, but secondary to core rules understanding.

**Independent Test**: Verify the collection badge grid shows all 6 badges with names, and the text explains the hearts-to-Secret Box conversion.

**Acceptance Scenarios**:

1. **Given** the Rules panel is open, **When** the user reads the Sender section, **Then** they understand: each Kudos posted earns hearts → every 5 hearts = 1 Secret Box → each box reveals 1 of 6 icons.
2. **Given** the Rules panel is open, **When** the user views the badge grid, **Then** all 6 badges are displayed in a 3x2 grid: REVIVAL, TOUCH OF LIGHT, STAY GOLD (row 1), FLOW TO HORIZON, BEYOND THE BOUNDARY, ROOT FURTHER (row 2).
3. **Given** the Rules panel is open, **When** the user reads the completion reward, **Then** they see that collecting all 6 icons earns a mystery gift from SAA 2025.

---

### Edge Cases

- What happens when the panel content is very long on small screens? → Panel should be scrollable with fixed footer buttons.
- What happens if the user is not authenticated? → The FAB is only visible to authenticated users, so the panel is inherently auth-gated. The "Viết KUDOS" button calls `onWriteKudos()` which is handled by the parent component.
- What happens on slow connections? → Badge images should have loading placeholders. Text content should render immediately.

---

## UI/UX Requirements *(from Figma)*

### Screen Components

| Component | Description | Interactions |
|-----------|-------------|--------------|
| Panel Container | Right-side slide-in panel (553px wide), dark background (#00070C) | Scrollable content area |
| Title "Thể lệ" | Large gold heading (45px Montserrat Bold) | Static display |
| Section: Người nhận Kudos | Heading + description + 4 hero badge rows | Static display |
| Hero Badge Pill | Rounded pill showing badge tier name with visual styling | Static display |
| Hero Badge Description | Threshold text + motivational description per tier | Static display |
| Section: Người gửi Kudos | Heading + description + badge grid + completion text | Static display |
| Collection Badge | Circular icon (64px) with label below, in 3x2 grid | Static display |
| Section: Kudos Quốc Dân | Heading + description about top 5 Kudos | Static display |
| "Đóng" Button | Secondary outlined button with X icon + "Đóng" text | Click to close panel |
| "Viết KUDOS" Button | Primary gold button with Pen icon + "Viết KUDOS" text | Click to navigate to write form |
| Button Footer | Fixed footer with two buttons, gap: 16px | Stays visible during scroll |

### Navigation Flow

- **From (Primary)**: FAB expanded state (313:9139) → click "Thể lệ" button (triggers `isOpen` state)
- **To (Đóng)**: Calls `onClose()` to close the sidebar overlay
- **To (Viết KUDOS)**: Calls `onWriteKudos()` to open KudoModal (Frame ID: 520:11602)
- **To (Overlay click / Escape)**: Calls `onClose()` to close the sidebar overlay

### Visual Requirements

- **Responsive breakpoints**: Mobile (< 640px), Tablet (640-1023px), Desktop (>= 1024px)
- **Animations/Transitions**: Panel slide-in from right (300ms ease-out), fade-out on close
- **Accessibility**: All text must meet WCAG AA contrast on dark background; buttons must have 44x44px minimum touch target
- **See**: [design-style.md](design-style.md) for complete visual specifications

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display the Rules panel as a modal/overlay that slides in from the right side of the screen.
- **FR-002**: System MUST display three distinct sections: Kudos Receiver rewards (Hero badges), Kudos Sender rewards (Collection badges), and Kudos Quốc Dân recognition.
- **FR-003**: System MUST display all four Hero badge tiers (New Hero, Rising Hero, Super Hero, Legend Hero) with their threshold ranges and descriptions.
- **FR-004**: System MUST display all six collection badges (REVIVAL, TOUCH OF LIGHT, STAY GOLD, FLOW TO HORIZON, BEYOND THE BOUNDARY, ROOT FURTHER) in a 3x2 grid layout.
- **FR-005**: System MUST provide a "Đóng" button that closes the panel and returns to the previous view.
- **FR-006**: System MUST provide a "Viết KUDOS" button that navigates to the Kudos writing form.
- **FR-007**: The panel content MUST be scrollable when content exceeds the viewport height, with the footer buttons remaining fixed at the bottom.
- **FR-008**: System MUST display the correct reward mechanics text: hearts → Secret Box (every 5 hearts) → icon collection.

### Technical Requirements

- **TR-001**: Panel MUST render within 500ms of trigger action.
- **TR-002**: Badge images MUST be optimized using `next/image` and loaded lazily.
- **TR-003**: Panel MUST be dismissible via three methods: (1) "Đóng" button click, (2) Escape key press, (3) overlay/backdrop click.
- **TR-004**: All text content should be translatable (i18n-ready) via the existing locales system.
- **TR-005**: Component MUST use Montserrat font family throughout (per design).

### Key Entities *(if feature involves data)*

- **Hero Badge Tier**: Represents a receiver's badge level (New Hero, Rising Hero, Super Hero, Legend Hero) based on unique Kudos sender count.
- **Collection Badge**: One of 6 exclusive SAA 2025 icons (REVIVAL, TOUCH OF LIGHT, STAY GOLD, FLOW TO HORIZON, BEYOND THE BOUNDARY, ROOT FURTHER) that senders can collect.
- **Secret Box**: A reward mechanism triggered every 5 hearts received on posted Kudos, containing a random collection badge.
- **Kudos Quốc Dân**: Top 5 Kudos with the most hearts across all Sun* members.

---

## State Management

### Local State

| State | Type | Initial | Purpose |
|-------|------|---------|---------|
| isOpen | boolean | false | Controls panel visibility — passed as prop from parent (FAB) |
| scrollPosition | number | 0 | Track scroll position within content area |

### Global State

| State | Store | Read/Write | Purpose |
|-------|-------|------------|---------|
| isAuthenticated | auth context | Read | Gate access — panel only accessible to authenticated users |

### UI States

- **Loading**: N/A — content is static, rendered immediately. Badge images use `next/image` placeholder blur.
- **Error**: N/A — no API calls. If images fail to load, show fallback placeholder.
- **Empty**: N/A — content is always present (static).

---

## Accessibility Requirements

| Requirement | Implementation |
|-------------|----------------|
| **Dialog role** | Panel MUST use `role="dialog"` with `aria-modal="true"` |
| **Label** | `aria-label="Thể lệ chương trình Kudos"` on the panel element |
| **Focus trap** | Focus MUST be trapped within the panel while open |
| **Focus on open** | Focus MUST move to the "Đóng" button (or panel title) when panel opens |
| **Focus on close** | Focus MUST return to the trigger element (FAB button) when panel closes |
| **Keyboard: Escape** | Pressing Escape MUST close the panel |
| **Keyboard: Tab** | Tab MUST cycle through focusable elements within the panel |
| **Touch targets** | Both buttons are 56px tall — exceeds 44x44px minimum |
| **Color contrast** | White (#FFFFFF) on #00070C = ratio ~19.5:1 (AAA). Gold (#FFEA9E) on #00070C = ratio ~13.6:1 (AAA). Both pass WCAG AA. |
| **Screen reader** | Headings MUST use proper `<h2>`/`<h3>` hierarchy. Badge images MUST have `alt` text. |

---

## API Dependencies

| Endpoint | Method | Purpose | Status |
|----------|--------|---------|--------|
| None | — | — | — |

> **Decision**: This panel displays **static content only**. All text is hardcoded via i18n locale files. Badge images are static assets exported from Figma. No API endpoints are needed.
>
> If rules content needs to become dynamic in the future (e.g., admin-editable), a `GET /api/kudos/rules` endpoint could be introduced, but this is **out of scope** for the current implementation.

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of rules text content matches the approved copy from the design.
- **SC-002**: All 4 Hero badge tiers and 6 Collection badges render correctly with proper visuals.
- **SC-003**: "Viết KUDOS" button successfully navigates to the Kudos writing form in all breakpoints.
- **SC-004**: Panel is fully scrollable on all supported screen sizes with fixed footer.
- **SC-005**: Panel meets WCAG AA contrast requirements for all text on dark background.

---

## Out of Scope

- Actual Kudos sending/receiving logic (covered by the Kudos writing form spec)
- Hero badge assignment logic and display on user profiles
- Secret Box opening animation and mechanics
- Heart/like system implementation
- Kudos Quốc Dân leaderboard and ranking logic
- Admin management of rules content

---

## Dependencies

- [x] Constitution document exists (`.momorph/constitution.md`)
- [x] Screen flow documented (`.momorph/contexts/SCREENFLOW.md`) — screen #15
- [x] Screen spec documented (`.momorph/contexts/screen_specs/the-le.md`)
- [ ] "Viết Kudo" form specification (Frame ID: 520:11602) — needed for navigation target
- N/A: API specifications — static content, no API needed
- N/A: Database design — static content, no database needed

---

## Notes

- All text content is in **Vietnamese** — ensure proper Unicode handling and font rendering for Vietnamese diacritics.
- The design uses **Montserrat Bold (700)** for ALL text, including body text. This is intentional and should not be changed to regular weight.
- Hero badge visuals increase in complexity from New Hero (simple) to Legend Hero (glowing/animated) — consider implementing progressive visual enhancement.
- The panel design suggests it overlays on top of existing content with a dark backdrop — implement as a modal or drawer component.
- Collection badge images are Figma components (Component Set ID: 737:20452) and should be exported as optimized assets.
- The "Viết KUDOS" button links to Frame ID `520:11602` ("Viết Kudo") — this navigation must be implemented.
- Frame image reference: ![Thể lệ UPDATE](assets/frame.png)
- Figma frame image URL: https://momorph.ai/api/images/9ypp4enmFmdK3YAFJLIu6C/3204:6051/ea9a26f893c9c24235ce4cf2aa16d702.png
