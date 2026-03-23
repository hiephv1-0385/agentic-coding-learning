# Feature Specification: Profile Dropdown Menu

**Frame ID**: `721:5223`
**Frame Name**: `Dropdown-profile`
**File Key**: `9ypp4enmFmdK3YAFJLIu6C`
**Created**: 2026-03-13
**Status**: Reviewed

---

## Overview

A dropdown menu component that appears when the user interacts with their profile avatar/button in the application header. The dropdown provides two primary actions: navigating to the user's profile page and logging out of the application. The design follows a dark theme with gold accents, consistent with the awards/premium aesthetic of the application.

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Navigate to Profile Page (Priority: P1)

As an authenticated user, I want to access my profile page from the dropdown menu so that I can view and manage my account information.

**Why this priority**: Profile navigation is the primary action in this dropdown and enables the user to manage their identity within the platform.

**Independent Test**: Click the profile trigger button, verify dropdown appears, click "Profile" item, verify navigation to profile page.

**Acceptance Scenarios**:

1. **Given** the user is authenticated and on any page, **When** the user clicks/taps the profile trigger (avatar/button in header), **Then** the dropdown menu appears with "Profile" and "Logout" options visible.
2. **Given** the dropdown is open, **When** the user clicks the "Profile" menu item, **Then** the user is navigated to the profile page and the dropdown closes.
3. **Given** the dropdown is open, **When** the user hovers over the "Profile" item, **Then** a visual hover effect is displayed (background highlight).

---

### User Story 2 - Logout from Application (Priority: P1)

As an authenticated user, I want to log out of the application from the dropdown menu so that I can securely end my session.

**Why this priority**: Logout is a critical security feature that must always be accessible to authenticated users.

**Independent Test**: Open dropdown, click "Logout", verify session is terminated and user is redirected to login/home page.

**Acceptance Scenarios**:

1. **Given** the dropdown is open, **When** the user clicks the "Logout" menu item, **Then** the Logout item shows a loading indicator (spinner replacing the chevron icon), both menu items become disabled, and upon successful sign-out the dropdown closes and the user is redirected to the login page (or home page).
2. **Given** the user clicks "Logout", **When** the logout process completes, **Then** the user can no longer access protected routes without re-authenticating.
3. **Given** the user clicks "Logout", **When** a network error occurs during logout, **Then** the system displays an appropriate error message and retries or allows the user to try again.

---

### User Story 3 - Open and Close Dropdown (Priority: P1)

As an authenticated user, I want to open and close the profile dropdown so that I can access or dismiss the menu options.

**Why this priority**: The open/close interaction is the fundamental UX for the dropdown to function at all.

**Independent Test**: Click trigger to open, verify dropdown appears. Click outside or press Escape to close, verify dropdown disappears.

**Acceptance Scenarios**:

1. **Given** the dropdown is closed, **When** the user clicks the profile trigger, **Then** the dropdown opens with a subtle animation (fade-in/slide).
2. **Given** the dropdown is open, **When** the user clicks outside the dropdown area, **Then** the dropdown closes.
3. **Given** the dropdown is open, **When** the user presses the Escape key, **Then** the dropdown closes and focus returns to the trigger button.
4. **Given** the dropdown is open, **When** the user selects any menu item, **Then** the dropdown closes after the action is initiated.

---

### Edge Cases

- What happens when the user's session has already expired when they click "Profile"? → Redirect to login.
- What happens when the dropdown is opened near the edge of the viewport? → Dropdown should reposition to stay within viewport bounds.
- How does the dropdown behave with keyboard navigation? → Tab/Arrow keys should navigate between items, Enter/Space to select.
- What happens if the user double-clicks "Logout"? → The `isLoggingOut` state prevents duplicate `signOut()` calls; items are disabled during logout.
- What happens if the user clicks the trigger rapidly? → Toggle behavior applies; no debounce needed since state is synchronous.

---

## UI/UX Requirements *(from Figma)*

### Screen Components

| Component | Description | Interactions |
|-----------|-------------|--------------|
| Profile Trigger | Avatar/button in header that opens dropdown | Click to toggle dropdown |
| Dropdown Container | Dark panel with gold border, 8px radius | Appears on trigger click, dismisses on outside click/Escape |
| Profile Item (A.1) | Menu item with "Profile" label + user icon, glowing background | Click → navigate to profile, hover → highlight |
| Logout Item (A.2) | Menu item with "Logout" label + chevron-right icon | Click → logout and redirect, hover → highlight |

### Navigation Flow

- **From**: Any authenticated page (dropdown is in the global header)
- **To (Profile)**: `/profile` or equivalent profile page
- **To (Logout)**: `/login` or home page after session termination
- **Triggers**: Click on profile avatar/button to open; click on menu item to navigate

### Visual Requirements

- **Responsive breakpoints**: Dropdown is a fixed-size floating element; no responsive changes needed. Ensure it remains within viewport.
- **Animations/Transitions**: 150ms ease-out for open/close (opacity + transform); 150ms ease-in-out for hover states.
- **Accessibility**:
  - WCAG AA compliant
  - `role="menu"` on dropdown, `role="menuitem"` on items
  - `aria-haspopup="menu"` and `aria-expanded` on trigger button
  - Keyboard navigation: Tab, Arrow Up/Down, Enter, Space, Escape
  - Focus trap within dropdown when open
  - Minimum touch target: 56px height (meets 44px minimum)

> **See [design-style.md](./design-style.md) for complete visual specifications including colors, typography, spacing, and component CSS values.**

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display the dropdown menu when the authenticated user clicks the profile trigger.
- **FR-002**: System MUST close the dropdown when the user clicks outside, presses Escape, or selects a menu item.
- **FR-003**: Users MUST be able to navigate to their profile page by clicking the "Profile" menu item.
- **FR-004**: System MUST terminate the user session via Supabase Auth when "Logout" is clicked.
- **FR-005**: System MUST redirect the user to the login/home page after successful logout.
- **FR-006**: System MUST support keyboard navigation (Tab, Arrow keys, Enter, Space, Escape) for accessibility.
- **FR-007**: Dropdown MUST only be visible to authenticated users.

### Technical Requirements

- **TR-001**: Dropdown open/close animation MUST complete within 150ms.
- **TR-002**: Logout MUST use Supabase Auth `signOut()` method via the client-side Supabase instance.
- **TR-003**: Dropdown MUST be positioned using absolute/fixed positioning relative to the trigger, with viewport boundary detection.
- **TR-004**: Component MUST use `"use client"` directive as it requires event handlers and state management.
- **TR-005**: Profile navigation MUST use `next/link` for client-side routing (per constitution).
- **TR-006**: Logout MUST use `@/libs/supabase/client.ts` for the client-side `signOut()` call (per constitution).

### Key Entities *(if feature involves data)*

- **User Session**: Current authenticated user's session from Supabase Auth. Required to determine dropdown visibility and perform logout.

---

## State Management

### Local State

| State | Type | Initial | Purpose |
|-------|------|---------|---------|
| isOpen | boolean | false | Controls dropdown visibility |
| isLoggingOut | boolean | false | Loading state during logout |

### Global State

| State | Source | Read/Write | Purpose |
|-------|--------|------------|---------|
| session | Supabase Auth | Read | Determine if user is authenticated (show/hide dropdown) |
| user | Supabase Auth | Read | User info for profile trigger display (name/avatar) |

---

## API Dependencies

| Endpoint | Method | Purpose | Status |
|----------|--------|---------|--------|
| Supabase Auth `signOut()` | POST | Terminate user session | Exists |
| `/profile` | GET | Profile page (navigation target) | Predicted/New |

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Dropdown opens within 150ms of trigger click with no visible layout shift.
- **SC-002**: Logout successfully terminates the session and redirects within 2 seconds under normal network conditions.
- **SC-003**: All keyboard navigation paths (Tab, Arrow, Enter, Space, Escape) function correctly.
- **SC-004**: Dropdown passes automated accessibility audit (axe-core) with zero violations.

---

## Out of Scope

- User profile page implementation (this spec covers only the dropdown component)
- Profile avatar/image display in the trigger button
- Notification badges or counts on the dropdown
- Additional menu items beyond "Profile" and "Logout"
- Theme switching or dark/light mode toggle

---

## Dependencies

- [x] Constitution document exists (`.momorph/constitution.md`)
- [ ] API specifications available (`.momorph/API.yml`)
- [ ] Database design completed (`.momorph/database.sql`)
- [x] Screen flow documented (`.momorph/SCREENFLOW.md`)

---

## Notes

- The dropdown design uses Montserrat font (Bold 700) which must be loaded in the project — verify it's available at `public/fonts/`.
- The "Profile" item has a distinctive glow effect (text-shadow with #FAE287 + tinted background). Based on the Figma design, this is the **default state** of the Profile item (always visible), not a conditional active-route indicator. The glow differentiates it visually from the Logout item as the primary action.
- Icons use a shared component set (178:1020) — ensure the Icon component supports both "user" and "chevron-right" variants.
- The gold border (#998C5F) and dark background (#00070C) are part of the project's premium/awards theme — use CSS variables for consistency.
