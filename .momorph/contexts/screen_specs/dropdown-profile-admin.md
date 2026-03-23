# Screen Spec: Dropdown Profile Admin

**Screen #**: 8
**Frame ID**: `721:5277`
**Frame Name**: `Dropdown Profile Admin`
**File Key**: `9ypp4enmFmdK3YAFJLIu6C`
**Spec Path**: `.momorph/specs/721-5277-Dropdown-profile-Admin/`

---

## Purpose

Admin profile dropdown menu extending the regular profile dropdown with additional admin-specific options (e.g., Admin Dashboard, Settings). Shown for users with admin roles.

## Component Type

Reusable global UI component (header/navigation bar, admin variant).

## Visual Summary

Dark-themed dropdown with gold border styling on dark background, consistent with other dropdowns and the regular profile dropdown. Displays user avatar, name, and email at the top, followed by vertically stacked menu options including admin-specific entries (Profile, Admin Dashboard, Settings, Logout). Selected/hovered items are highlighted with a warm semi-transparent background.

## Key Interactions

| Action | Result |
|--------|--------|
| Click admin avatar/profile area (closed) | Opens dropdown showing user info and admin menu options |
| Click Profile option | Closes dropdown, navigates to Profile page |
| Click Admin Dashboard option | Closes dropdown, navigates to Admin Dashboard page |
| Click Settings option | Closes dropdown, navigates to Settings page |
| Click Logout option | Closes dropdown, performs logout action |
| Click outside | Closes dropdown, no change |
| Escape key | Closes dropdown, no change |

## Data

- **User Info**: Avatar image, display name, email address
- **Menu Options**: Profile, Admin Dashboard, Settings, Logout
- **Persistence**: Session-based (user authentication state, admin role)
- **API**: User profile data fetched from backend; Logout triggers authentication endpoint; admin role determines visibility of admin-specific options

## Navigation Context

- **Entry**: Click on admin user avatar/profile area in header/navigation
- **Exit**: Selection closes dropdown; navigates to Profile/Admin Dashboard/Settings page or performs Logout
- **Scope**: Available on every page (global component, requires authenticated user with admin role)
