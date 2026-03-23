# Feature Specification: Profile Dropdown

**Frame ID**: `721:5223`
**Frame Name**: `Dropdown-profile`
**File Key**: `9ypp4enmFmdK3YAFJLIu6C`
**Created**: 2026-03-10
**Status**: Draft

---

## Overview

A profile/account dropdown menu component that provides authenticated users with quick access to their profile page and logout functionality. The dropdown is triggered from the user's avatar or profile area in the global header/navigation. It displays two menu items: "Profile" (with a user icon) and "Logout" (with a chevron right icon), using the application's consistent dark theme with gold accents.

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Navigate to Profile Page (Priority: P1)

An authenticated user wants to access their profile page to view or edit their personal information.

**Why this priority**: Profile access is a core user account feature that users expect in any authenticated application.

**Independent Test**: Click the profile trigger in the header, verify the dropdown opens, click "Profile", verify navigation to the profile page.

**Acceptance Scenarios**:

1. **Given** the user is authenticated and on any page, **When** they click the profile trigger (avatar/icon) in the header, **Then** the dropdown opens showing "Profile" and "Logout" options.
2. **Given** the dropdown is open, **When** the user clicks "Profile", **Then** the dropdown closes and the user is navigated to the profile page.
3. **Given** the dropdown is open and the user is currently on the profile page, **When** they view the dropdown, **Then** the "Profile" item is visually highlighted (active state with glow effect).

---

### User Story 2 - Logout from Application (Priority: P1)

An authenticated user wants to securely sign out of the application.

**Why this priority**: Logout is a critical security feature — users must be able to end their session.

**Independent Test**: Open the dropdown, click "Logout", verify the user is logged out and redirected to the appropriate page.

**Acceptance Scenarios**:

1. **Given** the dropdown is open, **When** the user clicks "Logout", **Then** the user's session is terminated, the dropdown closes, and the user is redirected to the login/landing page.
2. **Given** the user clicks "Logout", **When** the logout completes, **Then** all client-side auth state and tokens are cleared.
3. **Given** the user clicks "Logout", **When** they navigate back (browser back button), **Then** they are NOT returned to an authenticated page.

---

### User Story 3 - Dismiss Dropdown Without Action (Priority: P2)

A user opens the dropdown accidentally or decides not to take action and wants to close it.

**Why this priority**: Standard UX pattern for dropdown dismissal.

**Independent Test**: Open the dropdown, click outside or press Escape, verify it closes without side effects.

**Acceptance Scenarios**:

1. **Given** the dropdown is open, **When** the user clicks outside the dropdown, **Then** the dropdown closes without navigating or logging out.
2. **Given** the dropdown is open, **When** the user presses the Escape key, **Then** the dropdown closes and focus returns to the trigger element.

---

### Edge Cases

- What happens if the user's session expires while the dropdown is open? The dropdown should still allow "Profile" click (which will redirect to login) and "Logout" click (which will clear local state).
- How does the dropdown behave on keyboard navigation? Tab to focus trigger, Enter/Space to open, Arrow keys between items, Enter to select, Escape to close.
- What happens if the logout API call fails? Show an error notification and keep the user logged in; do not leave them in an inconsistent state.

---

## UI/UX Requirements *(from Figma)*

### Screen Components

| Component | Description | Interactions |
|-----------|-------------|--------------|
| Profile Trigger | User avatar or icon in the global header | Click to open/close dropdown |
| Dropdown Container | Dark-themed menu with gold border | Appears below/beside trigger on click |
| Profile Item | Menu item with "Profile" text + user icon (right) | Click navigates to profile page |
| Logout Item | Menu item with "Logout" text + chevron right icon | Click performs logout |

### Navigation Flow

- From: Any authenticated page (dropdown is a global header component)
- To (Profile): User profile page
- To (Logout): Login page / landing page (after session termination)
- Triggers: Click on profile trigger to open; click menu item to act

### Visual Requirements

- See `design-style.md` for complete visual specifications
- Dark themed component (#00070C background with #998C5F gold border)
- Active/current page item has warm highlight (rgba(255, 234, 158, 0.1)) with glowing text-shadow
- Montserrat Bold 16px with 0.15px letter-spacing
- Icons at 24x24px positioned to the right of text labels
- User icon for "Profile", chevron right icon for "Logout"
- Responsive: Component works at all breakpoints; items are 56px tall (touch-friendly)
- Accessibility: Must support keyboard navigation (Tab, Arrow keys, Enter, Escape)

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display the profile dropdown when the authenticated user clicks the profile trigger in the header.
- **FR-002**: System MUST show "Profile" and "Logout" as menu items in the dropdown.
- **FR-003**: System MUST navigate the user to the profile page when "Profile" is clicked.
- **FR-004**: System MUST terminate the user's session and redirect to the login/landing page when "Logout" is clicked.
- **FR-005**: System MUST close the dropdown without action when the user clicks outside or presses Escape.
- **FR-006**: System MUST visually highlight the "Profile" item when the user is currently on the profile page (active state).
- **FR-007**: System MUST clear all client-side auth state (tokens, cookies, cached user data) on logout.
- **FR-008**: System MUST support keyboard navigation (Tab to focus, Enter/Space to open, Arrow keys to navigate items, Enter to select, Escape to close).
- **FR-009**: System MUST only show the profile dropdown to authenticated users. Unauthenticated users should see a login/sign-in button instead.

### Technical Requirements

- **TR-001**: Dropdown open/close animation must complete within 150ms.
- **TR-002**: Logout must use Supabase Auth `signOut()` method as per constitution (no custom auth logic).
- **TR-003**: After logout, redirect using `router.push()` or `router.replace()` to prevent back-button access to authenticated pages.
- **TR-004**: Component must be a Client Component (`"use client"`) as it requires click handlers, state, and auth hooks.
- **TR-005**: Profile trigger should display the user's avatar image (from Supabase Auth user metadata) or a fallback icon.

### Key Entities *(if feature involves data)*

- **User**: Authenticated user with attributes: `id`, `email`, `name`, `avatarUrl` (from Supabase Auth session).

---

## API Dependencies

| Endpoint | Method | Purpose | Status |
|----------|--------|---------|--------|
| Supabase Auth `signOut()` | POST | Terminate user session | Exists (Supabase SDK) |
| Supabase Auth `getUser()` | GET | Get current user for avatar/name display | Exists (Supabase SDK) |

*Note: No custom API endpoints needed. Leverages Supabase Auth SDK as per constitution.*

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Profile navigation completes within 200ms (perceived by user).
- **SC-002**: Logout completes within 500ms, including session termination and redirect.
- **SC-003**: Dropdown is keyboard-accessible and passes WCAG 2.1 AA compliance for interactive controls.
- **SC-004**: After logout, no authenticated routes are accessible without re-login.
- **SC-005**: Component renders correctly at all three breakpoints (mobile, tablet, desktop) per constitution.

---

## Out of Scope

- User profile editing (handled on the profile page itself, not in this dropdown)
- Settings menu item (not shown in the Figma design)
- Notifications or badges on the profile trigger
- Multiple account switching
- Theme/appearance toggle in the dropdown

---

## Dependencies

- [ ] Constitution document exists (`.momorph/constitution.md`) - **YES**
- [ ] Supabase Auth configured (auth flows) - **YES** (Google OAuth enabled per git history)
- [ ] Profile page exists - **TBD** (needed for "Profile" navigation target)
- [ ] Screen flow documented (`.momorph/SCREENFLOW.md`) - **In progress**

---

## Related Specs

- **Language Dropdown** (`.momorph/specs/721-4942-Dropdown-ngon-ngu/`): Shares the same visual theme and Figma component set (`186:1426`). Both are global header components.
- **Department Dropdown** (`.momorph/specs/721-5684-Dropdown-Phong-ban/`): Shares the same glow text-shadow effect for active items.

---

## Notes

- The Figma design shows only 2 menu items (Profile, Logout). The description initially mentioned "Settings" but this is NOT in the design — only Profile and Logout are in scope.
- The "Profile" item has a user/person icon to the RIGHT of the text. The "Logout" item has a chevron-right icon, suggesting it may lead to a confirmation step or simply indicates navigation.
- The active/current-page highlighting (glow effect on "Profile") suggests contextual awareness of the current route.
- This dropdown shares the base button component set (`186:1426`) with all other dropdowns in the system — consider a shared `DropdownMenu` / `DropdownMenuItem` component.
- Logout must use Supabase Auth as per constitution — no custom auth logic.
- The profile trigger (avatar area) is not part of this frame — it should be specified separately or as part of the header/navigation component.
