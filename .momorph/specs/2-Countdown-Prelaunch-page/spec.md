# Feature Specification: Countdown - Prelaunch Page

**Frame ID**: `2268:35127`
**Frame Name**: `Countdown - Prelaunch page`
**File Key**: `9ypp4enmFmdK3YAFJLIu6C`
**Created**: 2026-03-09
**Status**: Draft

---

## Overview

A full-page prelaunch countdown screen that displays the remaining time (days, hours, minutes) until an event begins. The page features a dramatic dark background with a colorful abstract image overlay, a gradient cover, and glassmorphism-styled digit cards. The countdown recalculates every second internally and displays minute-level granularity. This is a standalone landing page used before the main event/application launches.

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View countdown to event (Priority: P1)

As a visitor, I want to see a live countdown showing how much time remains until the event starts so that I know when to return.

**Why this priority**: Core functionality - the entire page exists to communicate this information.

**Independent Test**: Load the prelaunch page and verify the countdown displays the correct remaining time based on a configured target date.

**Acceptance Scenarios**:

1. **Given** the target event date is in the future, **When** I visit the prelaunch page, **Then** I see the remaining days, hours, and minutes displayed in glassmorphism digit cards with localized labels (VN: "NGÀY", "GIỜ", "PHÚT" / EN: "DAYS", "HOURS", "MINUTES").
2. **Given** the countdown is running, **When** one minute elapses, **Then** the minutes display decrements by 1 (and hours/days adjust accordingly on rollover).
3. **Given** the target event date is in the future, **When** I visit the page, **Then** the localized title is displayed above the countdown (VN: "Sự kiện sẽ bắt đầu sau").

---

### User Story 2 - Countdown reaches zero (Priority: P1)

As a visitor, I want to be redirected or shown the event content when the countdown expires so that I can access the event immediately.

**Why this priority**: Essential UX - users need a clear transition when the event starts.

**Independent Test**: Set the target date to a past time or simulate countdown reaching zero and verify the behavior.

**Acceptance Scenarios**:

1. **Given** the target event date has passed, **When** I visit the prelaunch page, **Then** the countdown displays "00" for all units (days, hours, minutes) and does NOT show negative values.
2. **Given** I am viewing the countdown, **When** the countdown reaches 00:00:00, **Then** the system invokes the `onComplete` callback (e.g., redirect to event page or show event content).
3. **Given** the target event date has already passed, **When** I visit the prelaunch page, **Then** the `onComplete` callback is invoked once after mount (on the first tick), NOT synchronously during render.
4. **Given** the countdown has expired, **When** the `onComplete` callback is not provided, **Then** the countdown remains at 00:00:00 without errors.

---

### User Story 3 - Responsive display across devices (Priority: P2)

As a visitor on any device, I want the countdown page to display correctly on my screen size so that I can read the countdown information easily.

**Why this priority**: Many users will visit from mobile devices; the page must be usable at all breakpoints.

**Independent Test**: Load the prelaunch page on mobile (< 640px), tablet (640-1023px), and desktop (>= 1024px) viewports and verify layout adapts correctly.

**Acceptance Scenarios**:

1. **Given** I am on a mobile device (< 640px), **When** I view the page, **Then** the countdown units stack or scale down to fit the viewport without horizontal scrolling.
2. **Given** I am on a tablet (640-1023px), **When** I view the page, **Then** the countdown units display in a row with reduced spacing.
3. **Given** I am on a desktop (>= 1024px), **When** I view the page, **Then** the layout matches the Figma design exactly (1512px reference, centered content).

---

### User Story 4 - Accessible countdown information (Priority: P3)

As a visitor using assistive technology, I want the countdown information to be announced by screen readers so that I can understand the time remaining.

**Why this priority**: WCAG AA compliance - ensures inclusivity for all users.

**Independent Test**: Navigate the page with a screen reader and verify the countdown values are announced with their labels.

**Acceptance Scenarios**:

1. **Given** I am using a screen reader, **When** I navigate to the countdown section, **Then** I hear the remaining time announced (e.g., "0 days, 5 hours, 20 minutes").
2. **Given** the countdown updates, **When** the values change, **Then** the updated values are available to assistive technology via `aria-live="polite"`.

---

### Edge Cases

- What happens when the target date is not configured? -> Display "00" for all units; log a warning in development mode.
- What happens when `targetDate` is an invalid date string? -> Treat as expired (display "00" for all units); log a warning in development mode.
- What happens when the user's system clock is incorrect? -> The countdown relies on client-side `Date`; no server-time synchronization is required for this version.
- What happens on extremely narrow screens (< 320px)? -> Digit cards MUST scale down proportionally; text MUST remain readable.
- What happens if JavaScript is disabled? -> The page SHOULD render with static "00" values (SSR initial state); no countdown animation.
- What happens when the background image fails to load? -> The dark background (#00101A) with gradient overlay remains visible; the page is still usable.
- What happens when content overflows the viewport on very small screens? -> The page container uses `overflow-hidden` to prevent background layer scrollbar artifacts. However, the content container uses `min-h-screen` with flex centering, which should accommodate content naturally. On extremely small viewports where padding + content exceeds the screen, the mobile-first responsive padding (24px 16px) keeps content compact enough. If content still overflows, the outer container SHOULD switch to `overflow-y-auto` below 320px to prevent clipping.

---

## UI/UX Requirements *(from Figma)*

### Screen Components

| Component | Node ID | Description | Interactions |
|-----------|---------|-------------|--------------|
| A: Background Image | `2268:35129` | Full-bleed abstract colorful image behind all content | None (decorative) |
| B: Gradient Overlay | `2268:35130` | Dark gradient overlay (18deg, #00101A -> transparent) | None (decorative) |
| C: Content Container | `2268:35131` | Centered flex-column container with padding | None |
| D: Title | `2268:35137` | Localized heading text (VN: "Sự kiện sẽ bắt đầu sau") | None (static) |
| E: Countdown Row | `2268:35138` | Horizontal flex container for 3 time units | None |
| E.1: Days Unit | `2268:35139` | Two digit cards + localized label (VN: "NGÀY" / EN: "DAYS") | Auto-updates |
| E.2: Hours Unit | `2268:35144` | Two digit cards + localized label (VN: "GIỜ" / EN: "HOURS") | Auto-updates |
| E.3: Minutes Unit | `2268:35149` | Two digit cards + localized label (VN: "PHÚT" / EN: "MINUTES") | Auto-updates |
| F: Digit Card | `186:2619` (component) | Glassmorphism card containing a single digit | None (display only) |

### Navigation Flow

- From:
  - Direct URL access (`/prelaunch` — standalone prelaunch page)
  - Redirect after successful Login (per SCREENFLOW: Login → Countdown → Homepage SAA)
- To: Homepage SAA (`/`) or event main page (when countdown reaches zero)
- Triggers:
  - Countdown expiry triggers `onComplete` callback (e.g., `router.push('/')`)
  - No user-initiated navigation from this page (no links, buttons, or header nav)

### Visual Requirements

- Responsive breakpoints: mobile (< 640px), tablet (640px-1023px), desktop (>= 1024px)
- See `design-style.md` for complete visual specifications
- Animations/Transitions: Digit flip/fade animation when countdown values change (subtle, 300ms ease-in-out)
- Accessibility: WCAG AA compliance:
  - Background image MUST have `aria-hidden="true"` (decorative)
  - Countdown section MUST use `aria-live="polite"` for updates
  - Time values MUST have `aria-label` describing the full remaining time
  - `role="timer"` on the countdown container
  - Sufficient color contrast: white text (#FFFFFF) on dark background (#00101A) exceeds 4.5:1 ratio

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display a full-page countdown with three time units: days, hours, and minutes.
- **FR-002**: System MUST calculate remaining time from a configurable `targetDate` prop and display it as two-digit values per unit (zero-padded).
- **FR-003**: System MUST recalculate remaining time every 1 second internally, displaying minute-level granularity. This ensures the minute display transitions promptly when a new minute begins, avoiding up to 59 seconds of visual lag.
- **FR-004**: System MUST display "00" for all units when the target date has passed; values MUST NOT go negative.
- **FR-005**: System MUST invoke the optional `onComplete` callback when the countdown reaches zero.
- **FR-006**: System MUST display a localized title in bold italic Montserrat above the countdown (VN: "Sự kiện sẽ bắt đầu sau"). Title and unit labels MUST be sourced from the app's i18n locale files.
- **FR-007**: System MUST render a full-bleed background image with gradient overlay behind the countdown content.
- **FR-008**: Each time unit MUST display two individual digit cards (tens and ones) with glassmorphism styling.
- **FR-009**: System MUST be responsive across mobile, tablet, and desktop breakpoints.
- **FR-010**: System MUST apply page-load entrance animations: background image fades in (500ms ease-in), content fades up from 20px offset (600ms ease-out). See `design-style.md` Animation & Transitions section for exact values.

### Technical Requirements

- **TR-001**: Component MUST be a client component (`"use client"`) since it requires `setInterval` and state updates.
- **TR-002**: Component MUST clean up the interval timer on unmount to prevent memory leaks (`useEffect` cleanup).
- **TR-003**: Component MUST use `next/image` for the background image (per constitution - automatic optimization).
- **TR-004**: Component MUST NOT cause layout shift during countdown updates (fixed-size digit cards).
- **TR-005**: "Digital Numbers" font MUST be loaded for digit display. Montserrat MUST be loaded for title and labels.
- **TR-006**: Component MUST be compatible with Cloudflare Workers runtime (no Node.js native modules).

### Component Props Interface

```typescript
interface CountdownPrelaunchPageProps {
  targetDate: Date | string;
  backgroundImageSrc: string;
  onComplete?: () => void;
}
```

- `targetDate`: The event start date/time. Accepts `Date` object or ISO 8601 string.
- `backgroundImageSrc`: Path or URL to the background image.
- `onComplete`: Optional callback invoked when countdown reaches zero.

### Key Entities *(if feature involves data)*

- **CountdownTime**: `{ days: number, hours: number, minutes: number }` - Calculated remaining time values (0-99 days, 0-23 hours, 0-59 minutes).

---

## State Management

### Local Component State

| State | Type | Initial Value | Description |
|-------|------|---------------|-------------|
| timeLeft | `{ days: number, hours: number, minutes: number }` | Calculated from `targetDate` | Remaining time, computed on mount via state initializer to avoid flash of "00:00:00" |
| isExpired | boolean | `false` | Whether the countdown has reached zero |

### State Transitions

1. **Mount** -> Calculate initial remaining time from `targetDate` in the state initializer (avoids flash of zeros), start 1-second interval.
2. **Tick (every 1s)** -> Recalculate remaining time, update `timeLeft` only when displayed values (days/hours/minutes) actually change. If all zero, set isExpired=true, clear interval, call `onComplete`.
3. **Unmount** -> Clear interval timer via `useEffect` cleanup.

---

## API Dependencies

| Endpoint | Method | Purpose | Status |
|----------|--------|---------|--------|
| N/A | N/A | This is a client-side UI component. The target date is passed as a prop. No API calls required. | N/A |

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Countdown displays correct remaining time with minute-level granularity (updates within 1 second of a minute boundary change).
- **SC-002**: Component renders correctly at all three breakpoints (mobile, tablet, desktop).
- **SC-003**: Page loads and displays countdown within 100ms (no external data fetching).
- **SC-004**: Component pixel-matches the Figma design within 2px tolerance on desktop.
- **SC-005**: Screen reader users can access the countdown information via `aria-live` region.
- **SC-006**: Background image loads with proper optimization via `next/image`.

---

## Out of Scope

- Seconds-level countdown (design shows only days, hours, minutes)
- Server-side time synchronization (uses client `Date`)
- Notification/reminder when countdown nears zero
- Admin panel to configure the target date (passed as prop)
- Multiple countdown targets or recurring events
- Social sharing features
- Sound effects or haptic feedback on countdown change

---

## Dependencies

- [x] Constitution document exists (`.momorph/constitution.md`)
- [ ] API specifications available (`.momorph/API.yml`) - N/A for this component
- [ ] Database design completed (`.momorph/database.sql`) - N/A for this component
- [x] Screen flow documented (`.momorph/contexts/SCREENFLOW.md`)

---

## Notes

- The UI text is localized:
  - Title: "Sự kiện sẽ bắt đầu sau" (VN) / "The event starts in" (EN) — with proper diacritical marks
  - Unit labels are localized: "NGÀY", "GIỜ", "PHÚT" (VN) / "DAYS", "HOURS", "MINUTES" (EN)
  - Labels MUST use the app's i18n system (locale files in `src/locales/`)
- The background image is a colorful abstract artwork (Node `2268:35129`, media file MM_MEDIA_BG Image). It is available via MoMorph media files.
- Digit cards use a "Digital Numbers" font for the LED-style appearance. This font MUST be loaded locally or via a CDN.
- Montserrat font is used for the title and unit labels. Verify it is configured in Tailwind and `layout.tsx`.
- The digit card component (Figma component `186:2619`) is reusable and should be extracted as a standalone `DigitCard` component.
- Glassmorphism effect requires `backdrop-filter: blur()` which has good browser support but may need `-webkit-` prefix for older Safari versions.
- **Authentication**: This page is **publicly accessible** — no authentication required. The `/prelaunch` route MUST NOT be protected by auth middleware. The Login → Countdown flow in SCREENFLOW applies only when a user happens to log in during the prelaunch period.
