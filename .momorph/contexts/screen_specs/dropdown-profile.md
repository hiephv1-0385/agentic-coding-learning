# Screen Spec: Dropdown Profile

**Screen #**: 7
**Frame ID**: `721:5223`
**Frame Name**: `Dropdown Profile`
**File Key**: `9ypp4enmFmdK3YAFJLIu6C`
**Spec Path**: `.momorph/specs/721-5223-Dropdown-profile/`

---

## Purpose

Profile dropdown menu showing user information (avatar, name, email) with navigation options for Profile, Settings, and Logout.

## Component Type

Reusable global UI component (header/navigation bar).

## Visual Summary

Dark-themed dropdown with gold border styling on dark background, consistent with other dropdowns. Displays user avatar, name, and email at the top, followed by vertically stacked menu options (Profile, Settings, Logout). Selected/hovered items are highlighted with a warm semi-transparent background.

## Key Interactions

| Action | Result |
|--------|--------|
| Click avatar/profile area (closed) | Opens dropdown showing user info and menu options |
| Click Profile option | Closes dropdown, navigates to Profile page |
| Click Settings option | Closes dropdown, navigates to Settings page |
| Click Logout option | Closes dropdown, performs logout action |
| Click outside | Closes dropdown, no change |
| Escape key | Closes dropdown, no change |

## Data

- **User Info**: Avatar image, display name, email address
- **Menu Options**: Profile, Settings, Logout
- **Persistence**: Session-based (user authentication state)
- **API**: User profile data fetched from backend; Logout triggers authentication endpoint

## Navigation Context

- **Entry**: Click on user avatar/profile area in header/navigation
- **Exit**: Selection closes dropdown; navigates to Profile/Settings page or performs Logout
- **Scope**: Available on every page (global component, requires authenticated user)
