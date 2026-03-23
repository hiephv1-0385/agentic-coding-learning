# Feature Specification: Admin Profile Dropdown

**Frame ID**: `721:5277`
**Frame Name**: `Dropdown-profile Admin`
**File Key**: `9ypp4enmFmdK3YAFJLIu6C`
**Created**: 2026-03-10
**Status**: Draft

---

## Overview

An extended profile/account dropdown menu for admin users. It builds upon the regular Profile Dropdown by adding a "Dashboard" menu item that provides admin users quick access to the admin dashboard. The dropdown displays three menu items: "Profile" (user icon), "Dashboard" (grid icon), and "Logout" (chevron right icon), using the consistent dark theme with gold accents.

This is NOT a separate component but rather a **variant** of the Profile Dropdown that conditionally renders additional admin-only items based on the user's role.

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Access Admin Dashboard (Priority: P1)

An admin user wants to quickly navigate to the admin dashboard to manage application settings, users, or content.

**Why this priority**: Admin dashboard access is the primary differentiator of this dropdown variant — it's the reason the admin version exists.

**Independent Test**: Log in as an admin user, open the profile dropdown, verify "Dashboard" item is visible, click it, verify navigation to the admin dashboard.

**Acceptance Scenarios**:

1. **Given** the user is authenticated with an admin role, **When** they click the profile trigger in the header, **Then** the dropdown opens showing "Profile", "Dashboard", and "Logout" options.
2. **Given** the admin dropdown is open, **When** the user clicks "Dashboard", **Then** the dropdown closes and the user is navigated to the admin dashboard page.
3. **Given** the user is on the admin dashboard page, **When** they open the dropdown, **Then** the "Dashboard" item is visually highlighted (active state with glow effect).

---

### User Story 2 - Navigate to Profile Page (Priority: P1)

An admin user wants to access their profile page to view or edit their personal information.

**Why this priority**: Profile access is a core feature shared with all authenticated users.

**Independent Test**: Open the dropdown, click "Profile", verify navigation to the profile page.

**Acceptance Scenarios**:

1. **Given** the admin dropdown is open, **When** the user clicks "Profile", **Then** the dropdown closes and the user is navigated to the profile page.
2. **Given** the user is on the profile page, **When** they open the dropdown, **Then** the "Profile" item is visually highlighted (active state).

---

### User Story 3 - Logout from Application (Priority: P1)

An admin user wants to securely sign out of the application.

**Why this priority**: Logout is a critical security feature, especially for admin accounts.

**Independent Test**: Open the dropdown, click "Logout", verify session termination and redirect.

**Acceptance Scenarios**:

1. **Given** the admin dropdown is open, **When** the user clicks "Logout", **Then** the user's session is terminated, the dropdown closes, and the user is redirected to the login/landing page.
2. **Given** an admin clicks "Logout", **When** the logout completes, **Then** all client-side auth state and tokens are cleared, including any admin-specific cached data.
3. **Given** an admin clicks "Logout", **When** they navigate back (browser back button), **Then** they are NOT returned to any authenticated or admin page.

---

### User Story 4 - Role-Based Menu Visibility (Priority: P1)

The system should only show the "Dashboard" item to users with admin privileges, while regular users see the standard 2-item dropdown.

**Why this priority**: Security and UX — non-admin users must not see or access admin features.

**Independent Test**: Log in as a regular user, open profile dropdown, verify only "Profile" and "Logout" are shown. Log in as admin, verify all 3 items are shown.

**Acceptance Scenarios**:

1. **Given** the user has an admin role, **When** they open the profile dropdown, **Then** they see "Profile", "Dashboard", and "Logout" (3 items).
2. **Given** the user does NOT have an admin role, **When** they open the profile dropdown, **Then** they see only "Profile" and "Logout" (2 items) — the regular Profile Dropdown.
3. **Given** the user's role changes from admin to regular (e.g., role revoked), **When** they next open the dropdown, **Then** "Dashboard" is no longer visible.

---

### User Story 5 - Dismiss Dropdown Without Action (Priority: P2)

An admin user opens the dropdown accidentally and wants to close it.

**Why this priority**: Standard UX pattern for dropdown dismissal.

**Independent Test**: Open the dropdown, click outside or press Escape, verify it closes.

**Acceptance Scenarios**:

1. **Given** the dropdown is open, **When** the user clicks outside, **Then** it closes without navigating or logging out.
2. **Given** the dropdown is open, **When** the user presses Escape, **Then** it closes and focus returns to the trigger.

---

### Edge Cases

- What if the admin role check fails or times out? Default to showing the regular profile dropdown (2 items) — never expose admin features without confirmed authorization.
- What if the admin dashboard page doesn't exist yet? "Dashboard" item should still render but navigate to a "Coming soon" or 404 page gracefully.
- How does keyboard navigation work with 3 items? Arrow Down/Up cycles through Profile → Dashboard → Logout → Profile.

---

## UI/UX Requirements *(from Figma)*

### Screen Components

| Component | Description | Interactions |
|-----------|-------------|--------------|
| Profile Trigger | User avatar or icon in the global header | Click to open/close dropdown |
| Dropdown Container | Dark-themed menu with gold border (wider than regular) | Appears below/beside trigger on click |
| Profile Item | "Profile" text + user icon (right) | Click navigates to profile page |
| Dashboard Item | "Dashboard" text + grid icon (right) — **admin only** | Click navigates to admin dashboard |
| Logout Item | "Logout" text + chevron right icon | Click performs logout |

### Navigation Flow

- From: Any authenticated page (dropdown is a global header component)
- To (Profile): User profile page
- To (Dashboard): Admin dashboard page
- To (Logout): Login page / landing page (after session termination)
- Triggers: Click on profile trigger to open; click menu item to act

### Visual Requirements

- See `design-style.md` for complete visual specifications
- Identical to regular Profile Dropdown but with additional "Dashboard" item
- Dropdown is wider (~153px items vs ~121px) to accommodate "Dashboard" text
- Dark themed (#00070C background, #998C5F gold border)
- Active/current page item has warm highlight with glowing text-shadow
- Montserrat Bold 16px, 0.15px letter-spacing
- 3 distinct icons: user (Profile), grid (Dashboard), chevron-right (Logout)
- All icons 24x24px, positioned right of text
- Items 56px tall (touch-friendly, exceeds 44px minimum)
- Accessibility: Keyboard navigation (Tab, Arrow keys, Enter, Escape)

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display the admin profile dropdown (3 items) when an authenticated admin user clicks the profile trigger.
- **FR-002**: System MUST display the regular profile dropdown (2 items, no Dashboard) for non-admin authenticated users.
- **FR-003**: System MUST navigate to the profile page when "Profile" is clicked.
- **FR-004**: System MUST navigate to the admin dashboard when "Dashboard" is clicked.
- **FR-005**: System MUST terminate the session and redirect to login when "Logout" is clicked.
- **FR-006**: System MUST close the dropdown without action when the user clicks outside or presses Escape.
- **FR-007**: System MUST visually highlight the currently active page's menu item (glow effect).
- **FR-008**: System MUST clear all client-side auth state on logout (tokens, cookies, admin cached data).
- **FR-009**: System MUST support keyboard navigation (Tab, Enter/Space, Arrow keys, Escape).
- **FR-010**: System MUST NOT expose the "Dashboard" item to non-admin users under any circumstance (client-side role check + server-side route protection).

### Technical Requirements

- **TR-001**: Dropdown open/close animation must complete within 150ms.
- **TR-002**: Logout must use Supabase Auth `signOut()` method per constitution.
- **TR-003**: Admin role check should use Supabase Auth user metadata or a custom claim (e.g., `user.user_metadata.role === 'admin'`).
- **TR-004**: Component must be a Client Component (`"use client"`) — requires click handlers, state, and auth hooks.
- **TR-005**: Admin dashboard route must also be protected server-side (middleware) — client-side menu hiding alone is NOT sufficient.
- **TR-006**: Implement as a single `<ProfileDropdown>` component with conditional `isAdmin` rendering, NOT as a separate component.

### Key Entities *(if feature involves data)*

- **User**: Authenticated user with attributes: `id`, `email`, `name`, `avatarUrl`, `role` (from Supabase Auth session/metadata).
- **Role**: User role enum — at minimum `user` and `admin`.

---

## API Dependencies

| Endpoint | Method | Purpose | Status |
|----------|--------|---------|--------|
| Supabase Auth `signOut()` | POST | Terminate user session | Exists (Supabase SDK) |
| Supabase Auth `getUser()` | GET | Get current user + role for menu rendering | Exists (Supabase SDK) |

*Note: No custom API endpoints needed. Admin role should be stored in Supabase Auth user metadata or a separate `user_roles` table with RLS.*

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Admin dropdown renders "Dashboard" item only for admin users — 100% role accuracy.
- **SC-002**: Profile/Dashboard navigation completes within 200ms.
- **SC-003**: Logout completes within 500ms, including session termination and redirect.
- **SC-004**: Non-admin users cannot access admin dashboard even by direct URL (server-side protection).
- **SC-005**: Dropdown is keyboard-accessible and passes WCAG 2.1 AA compliance.
- **SC-006**: Component renders correctly at all three breakpoints per constitution.

---

## Out of Scope

- Admin dashboard page content (only the dropdown menu item is in scope)
- Role management UI (adding/removing admin roles)
- Multiple role levels beyond admin/user (e.g., moderator, super-admin)
- Notifications or badges on the profile trigger
- Theme toggle or settings in the dropdown

---

## Dependencies

- [ ] Constitution document exists (`.momorph/constitution.md`) - **YES**
- [ ] Supabase Auth configured with role support - **TBD** (role metadata needed)
- [ ] Profile page exists - **TBD** (needed for "Profile" navigation target)
- [ ] Admin dashboard page exists - **TBD** (needed for "Dashboard" navigation target)
- [ ] Screen flow documented (`.momorph/SCREENFLOW.md`) - **In progress**

---

## Related Specs

- **Profile Dropdown** (`.momorph/specs/721-5223-Dropdown-profile/`): This is the base variant. The Admin dropdown MUST be implemented as a conditional extension, not a separate component. Shares the same component set (`186:1426`).
- **Language Dropdown** (`.momorph/specs/721-4942-Dropdown-ngon-ngu/`): Shares the same visual theme and global header placement.
- **Department Dropdown** (`.momorph/specs/721-5684-Dropdown-Phong-ban/`): Shares the same glow text-shadow effect.

---

## Notes

- **Implementation strategy**: Use a single `<ProfileDropdown>` component that accepts the user's role. Conditionally render the "Dashboard" item when `role === 'admin'`. Do NOT create a separate `<AdminProfileDropdown>` component.
- The admin dropdown is slightly wider (~153px vs ~121px items) because "Dashboard" is longer than "Profile" or "Logout". The component should use `w-auto` / hug content to adapt.
- The "Dashboard" icon (component ID `662:10350`) appears to be a 2x2 grid/squares icon — commonly representing a dashboard or app grid.
- All three dropdowns in the system (Profile, Admin Profile, Language, Department) share the same base button component set (`186:1426`) and visual theme — a shared `<DropdownMenu>` / `<DropdownMenuItem>` base component is strongly recommended.
- Admin route protection must happen at BOTH the client (hide menu item) AND server (middleware/RLS) levels per constitution security principles.
