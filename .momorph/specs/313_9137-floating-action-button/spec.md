# Feature Specification: Floating Action Button (FAB)

**Frame ID**: `313:9137` (collapsed), `313:9139` (expanded)
**Frame Name**: `Floating Action Button - phim nổi chức năng`
**File Key**: `9ypp4enmFmdK3YAFJLIu6C`
**Created**: 2026-03-16
**Status**: Reviewed

---

## Overview

A **Floating Action Button (FAB)** that provides quick access to two primary actions: **writing kudos** and **viewing SAA rules/thể lệ**. The FAB is persistently visible in the bottom-right corner of the screen as a golden pill-shaped button containing two icons separated by a "/" character.

**Two states:**
- **Collapsed** (frame `313:9137`): A single golden pill (106x64px) showing pen icon + "/" + lightning icon. This is the default/resting state.
- **Expanded** (frame `313:9139`): The pill is replaced by a vertical stack (gap: 20px) of two labeled action buttons ("Thể lệ" 149x64px and "Viết KUDOS" 214x64px) plus a red circular close button (56x56px) at the bottom. Clicking an action navigates; clicking X collapses back.

This component serves as a persistent navigation shortcut, ensuring users can always access the most important actions (kudos writing and rules viewing) from any page.

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Quick Access to Actions via FAB (Priority: P1)

As an authenticated user, I want to see a floating action button on the screen at all times, so that I can quickly access kudos writing or SAA rules without navigating through menus.

**Why this priority**: The FAB is the core interaction point for the two most important user actions in the application. Without it, users lose the quick-access shortcut to kudos and rules.

**Independent Test**: Render any page with the FAB component and verify it appears in the correct position with the correct visual styling.

**Acceptance Scenarios**:

1. **Given** I am on any page of the application, **When** the page loads, **Then** I see the FAB in the bottom-right corner with a golden pill shape containing a pen icon, "/" separator, and lightning/rules icon.
2. **Given** I am on any page, **When** I scroll the page content, **Then** the FAB remains fixed in its position (does not scroll with content).
3. **Given** I am viewing the FAB, **When** I hover over it, **Then** the button shows an enhanced glow/shadow effect indicating it is interactive.

---

### User Story 2 - Expand FAB to Reveal Options (Priority: P1)

As a user, I want to click the FAB to expand it and see the two available actions, so that I can choose between writing kudos or viewing SAA rules.

**Why this priority**: The expand interaction is essential for the FAB to fulfill its purpose. Without expansion, the icons are not individually actionable.

**Independent Test**: Click the FAB and verify it transitions to the expanded state (frame 313:9139) showing both action options.

**Acceptance Scenarios**:

1. **Given** the FAB is in its collapsed/default state, **When** I click the FAB, **Then** the collapsed pill disappears and is replaced by a vertical stack: "Thể lệ" button (top), "Viết KUDOS" button (middle), and a red close (X) button (bottom).
2. **Given** the FAB is expanded, **When** I click the "Viết KUDOS" button (pen icon + label), **Then** the Viet Kudo modal (frame `520:11602`) opens.
3. **Given** the FAB is expanded, **When** I click the "Thể lệ" button (lightning icon + label), **Then** I am navigated to the "Thể lệ" page (`/awards/rules`, frame `3204:6051`).
4. **Given** the FAB is expanded, **When** I click the red close (X) button, **Then** the FAB collapses back to its default pill state.
5. **Given** the FAB is expanded, **When** I click outside the FAB area, **Then** the FAB collapses back to its default state.
6. **Given** the FAB is expanded, **When** I press the Escape key, **Then** the FAB collapses back to its default state.

---

### User Story 3 - FAB Accessibility (Priority: P2)

As a user with accessibility needs, I want the FAB to be keyboard-navigable and screen-reader friendly, so that I can use it without a mouse.

**Why this priority**: Accessibility is important for inclusivity but is not the primary interaction flow.

**Independent Test**: Navigate to the FAB using keyboard Tab, activate it with Enter/Space, and verify screen reader announces the actions.

**Acceptance Scenarios**:

1. **Given** I am using keyboard navigation, **When** I press Tab, **Then** the FAB is focusable and shows a visible focus indicator.
2. **Given** the FAB is focused, **When** I press Enter or Space, **Then** the FAB expands to show options.
3. **Given** the FAB is visible, **When** a screen reader encounters it, **Then** it announces "Quick actions: Write kudos or View SAA rules".

---

### Edge Cases

- What happens when the user is on a mobile device with limited screen space? → FAB should reposition to avoid overlapping critical content.
- How does the FAB behave during page transitions/navigation? → FAB should persist across route changes (global component). If expanded, collapse on route change.
- What happens if the FAB overlaps with a toast/notification? → FAB should have a high z-index (z-50) but below modals (z-[60]+).
- What happens on pages where FAB actions are not available (e.g., not authenticated)? → FAB should be hidden for unauthenticated users.
- What happens if the user is on the login page (`/login`) or prelaunch page (`/prelaunch`)? → FAB should be hidden on these public routes.
- What happens if the Viet Kudo modal is already open and user clicks FAB → Viết KUDOS? → Do not open a second modal instance; collapse FAB silently.

---

## UI/UX Requirements *(from Figma)*

### Screen Components

| Component | Description | Interactions |
|-----------|-------------|--------------|
| FAB Container | Fixed-position wrapper with golden glow shadow | Hover: enhanced glow; Click: toggle expand/collapse |
| FAB Pill (collapsed) | Golden pill-shaped button (106x64px, border-radius: 100px) | Click → expand to options; hidden when expanded |
| Pen Icon (A.1) | 24x24px pen/write icon | In collapsed pill; also in "Viết KUDOS" expanded button |
| Separator "/" | Montserrat 700, 24px, dark text (#00101A) | Visual divider between icons (collapsed state only) |
| Rules Icon (A.2) | 24x24px lightning/rules icon | In collapsed pill; also in "Thể lệ" expanded button |
| "Thể lệ" Button (expanded) | Golden rect button (149x64px, radius: 4px) with lightning icon + label text | Click → navigate to "Thể lệ" page (`/awards/rules`, frame `3204:6051`) |
| "Viết KUDOS" Button (expanded) | Golden rect button (214x64px, radius: 4px) with pen icon + label text | Click → open Viet Kudo modal (frame `520:11602`) |
| Close Button (expanded) | Red circular button (56x56px, #D4271D) with white MM_MEDIA_Close icon | Click → collapse FAB back to pill |

### Navigation Flow

- **From**: Any authenticated page (FAB is a global component in root layout)
- **Collapsed → Expanded**: Click on FAB pill → transition to expanded state (frame `313:9139`)
- **Expanded → "Thể lệ"**: Click → navigate to "Thể lệ" page (`/awards/rules`, frame `3204:6051`)
- **Expanded → "Viết KUDOS"**: Click → open Viet Kudo modal (frame `520:11602`)
- **Expanded → Collapsed**: Click red X button, click outside, or press Escape
- **Hidden on**: `/login`, `/prelaunch`, and any unauthenticated state

### Visual Requirements

- Responsive breakpoints: Mobile (< 640px), Tablet (640-1023px), Desktop (≥ 1024px)
- Animations/Transitions: Hover glow enhancement (200ms), expand/collapse (250ms)
- Accessibility: WCAG AA compliance - focusable, keyboard-operable, aria-labels
- See [design-style.md](./design-style.md) for complete visual specifications

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST render the FAB on all authenticated pages as a fixed-position element in the bottom-right corner.
- **FR-002**: System MUST display the FAB with a golden pill shape (#FFEA9E) containing a pen icon, "/" separator, and rules icon.
- **FR-003**: Users MUST be able to click the FAB to expand it, replacing the collapsed pill with a vertical stack of labeled action buttons ("Thể lệ", "Viết KUDOS") and a red close (X) button.
- **FR-004**: System MUST open the Viet Kudo modal (frame `520:11602`) when the "Viết KUDOS" button is clicked in expanded state.
- **FR-005**: System MUST navigate to the "Thể lệ" page (`/awards/rules`, frame `3204:6051`) when the "Thể lệ" button is clicked in expanded state.
- **FR-006**: System MUST collapse the expanded FAB when the user clicks the red close (X) button, clicks outside the FAB area, or presses the Escape key.
- **FR-007**: FAB MUST remain visible and fixed during page scroll.
- **FR-008**: FAB MUST show hover state with enhanced glow shadow on mouse hover (collapsed state).
- **FR-009**: FAB MUST be hidden for unauthenticated users and on public routes (`/login`, `/prelaunch`).
- **FR-010**: FAB MUST auto-collapse on route change if currently expanded.

### Technical Requirements

- **TR-001**: FAB component MUST use `position: fixed` with appropriate z-index (z-50) to float above page content.
- **TR-002**: FAB MUST be implemented as a Client Component (`"use client"`) since it requires click handlers and state management.
- **TR-003**: FAB MUST be placed in the root layout to persist across route changes.
- **TR-004**: Icons MUST be implemented as Icon Components (not SVG files or img tags) per constitution.
- **TR-005**: Montserrat font MUST be available for the "/" separator text.

### Key Entities

- **FAB State**: Collapsed (default pill) or Expanded (vertical menu with close button)
- **FAB Actions**: Two actions:
  - "Viết KUDOS" → opens Viet Kudo modal (frame `520:11602`)
  - "Thể lệ" → navigates to "Thể lệ" page (`/awards/rules`, frame `3204:6051`)
- **Close Action**: Red X button, click outside, or Escape key → collapse to default

---

## API Dependencies

| Endpoint | Method | Purpose | Status |
|----------|--------|---------|--------|
| N/A | - | FAB is a purely client-side UI component with no direct API calls | - |

> **Note**: The FAB itself does not call APIs. The pages it navigates to (kudos, rules) have their own API dependencies.

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: FAB is visible on 100% of authenticated page views.
- **SC-002**: FAB click-to-expand interaction completes within 300ms.
- **SC-003**: Users can navigate to kudos writing or SAA rules within 2 clicks (1 click to expand FAB + 1 click to select action).
- **SC-004**: FAB renders correctly across all three breakpoints (mobile, tablet, desktop).
- **SC-005**: FAB passes accessibility audit (keyboard navigation, screen reader support).

---

## Out of Scope

- Kudos writing flow/page implementation (covered by Viet Kudo spec `520:11602`).
- "Thể lệ" page implementation (`/awards/rules`, frame `3204:6051` — to be implemented later).
- FAB animation micro-interactions beyond hover glow and expand/collapse.
- FAB customization or user preferences for positioning.

---

## Dependencies

- [x] Constitution document exists (`.momorph/constitution.md`)
- [x] Screen flow documented (`.momorph/contexts/SCREENFLOW.md`) - entry #14
- [x] Expanded FAB state analyzed (frame `313:9139`) - included in this spec
- [x] Kudos writing page specified (`.momorph/specs/520-11602-Viet-Kudo/`)
- [ ] "Thể lệ" page specified (`/awards/rules`, frame `3204:6051` — to be implemented later)

---

## Notes

- The FAB design uses Vietnamese naming: "phím nổi chức năng" = "floating function key"
- "Thể lệ" = "Rules/Regulations" (for SAA)
- "Viết KUDOS" = "Write KUDOS"
- The expanded state (frame `313:9139`) is now included in this spec — shows vertical stack: "Thể lệ" (top), "Viết KUDOS" (middle), red X close button (bottom)
- Montserrat font is used for the "/" separator AND likely for expanded button labels — verify it is included in the project's font configuration (check `public/fonts/`)
- The golden glow shadow (#FAE287) is a distinctive visual element that ties the FAB to the SAA brand identity
- The expanded state close button is a red circle (#D4271D, 56x56px) with a white MM_MEDIA_Close icon (component 214:3851) — confirmed from `list_frame_styles` on frame 313:9139
- "Thể lệ" button navigates to `/awards/rules` (frame `3204:6051`), a separate page under the awards section. This page will be implemented later.
