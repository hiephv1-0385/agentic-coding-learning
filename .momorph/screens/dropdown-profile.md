# Screen: Dropdown-profile

## Screen Info

| Property | Value |
|----------|-------|
| **Figma Frame ID** | 721:5223 |
| **Figma Link** | [Figma](https://www.figma.com/design/9ypp4enmFmdK3YAFJLIu6C?node-id=721:5223) |
| **Screen Group** | Navigation Components |
| **Status** | discovered |
| **Discovered At** | 2026-03-13 |
| **Last Updated** | 2026-03-13 |

---

## Description

A dropdown overlay menu triggered by the user's profile avatar/button in the application header. Provides two account-related actions: navigating to the Profile page and logging out. The dropdown uses a dark theme (#00070C background) with a gold border (#998C5F), consistent with the project's premium/awards aesthetic.

---

## Navigation Analysis

### Incoming Navigations (From)

| Source Screen | Trigger | Condition |
|---------------|---------|-----------|
| Any authenticated page (Header) | Click profile avatar/button | User is authenticated |

### Outgoing Navigations (To)

| Target Screen | Trigger Element | Node ID | Confidence | Notes |
|---------------|-----------------|---------|------------|-------|
| Profile Page | Button: "Profile" | I666:9601;563:7844 | high | Navigates to /profile |
| Login Page | Button: "Logout" | I666:9601;563:7868 | high | Calls signOut() then redirects |

### Navigation Rules
- **Back behavior**: Dropdown closes, returns to current page state
- **Deep link support**: No — dropdown is an overlay, not a routable screen
- **Auth required**: Yes — only visible to authenticated users

---

## Component Schema

### Layout Structure

```
┌───────────────────────────────────┐
│  Dropdown Container (p: 6px)      │
│  bg: #00070C, border: #998C5F     │
│  border-radius: 8px               │
│                                    │
│  ┌─────────────────────────────┐  │
│  │  Profile Item (p: 16px)     │  │
│  │  bg: rgba(255,234,158,0.1)  │  │
│  │  [Label: "Profile"] [👤]    │  │
│  │  w: 119px, h: 56px          │  │
│  └─────────────────────────────┘  │
│                                    │
│  ┌─────────────────────────────┐  │
│  │  Logout Item (p: 16px)      │  │
│  │  bg: transparent             │  │
│  │  [Label: "Logout"] [>]      │  │
│  │  w: 121px, h: 56px          │  │
│  └─────────────────────────────┘  │
│                                    │
└───────────────────────────────────┘
```

### Component Hierarchy

```
ProfileDropdown (Molecule)
├── DropdownContainer (Atom) - Node: 666:9601
│   ├── ProfileItem (Molecule) - Node: I666:9601;563:7844
│   │   ├── Label: "Profile" (Atom) - Node: I666:9601;563:7844;186:1497
│   │   └── Icon: User (Atom) - Node: I666:9601;563:7844;186:1498
│   └── LogoutItem (Molecule) - Node: I666:9601;563:7868
│       ├── Label: "Logout" (Atom) - Node: I666:9601;563:7868;186:1439
│       └── Icon: ChevronRight (Atom) - Node: I666:9601;563:7868;186:1441
```

### Main Components

| Component | Type | Node ID | Description | Reusable |
|-----------|------|---------|-------------|----------|
| DropdownContainer | Molecule | 666:9601 | Dark dropdown panel with gold border | Yes |
| ProfileItem | Molecule | I666:9601;563:7844 | Profile navigation menu item with glow | No |
| LogoutItem | Molecule | I666:9601;563:7868 | Logout action menu item | No |
| Icon (User) | Atom | I666:9601;563:7844;186:1498 | User/person icon (component set: 178:1020) | Yes |
| Icon (ChevronRight) | Atom | I666:9601;563:7868;186:1441 | Chevron right icon (component set: 178:1020) | Yes |

---

## Form Fields (If Applicable)

N/A — This is a navigation dropdown, not a form screen.

---

## API Mapping

### On Screen Load

No API calls on dropdown open.

### On User Action

| Action | API | Method | Request Body | Response |
|--------|-----|--------|--------------|----------|
| Click "Profile" | - | - | Navigation only | Redirect to /profile |
| Click "Logout" | Supabase `auth.signOut()` | POST | N/A | Session terminated, redirect to login |

### Error Handling

| Error Code | Message | UI Action |
|------------|---------|-----------|
| Network error | Failed to logout | Show error toast, allow retry |
| Session expired | Session already expired | Redirect to login page |

---

## State Management

### Local State

| State | Type | Initial | Purpose |
|-------|------|---------|---------|
| isOpen | boolean | false | Controls dropdown visibility |

### Global State (If Applicable)

| State | Store | Read/Write | Purpose |
|-------|-------|------------|---------|
| session | Supabase Auth | Read | Check if user is authenticated |
| user | Supabase Auth | Read | Get user info for profile trigger display |

---

## UI States

### Loading State
- Show spinner on "Logout" item during sign-out process
- Disable both menu items during logout

### Error State
- Toast notification for logout failure
- Retry option

### Success State
- Dropdown closes
- Navigation completes (profile) or redirect to login (logout)

### Empty State
- N/A — dropdown always shows fixed menu items

---

## Accessibility

| Requirement | Implementation |
|-------------|----------------|
| Focus management | Focus first item on open, return focus to trigger on close |
| Keyboard navigation | Arrow Up/Down between items, Enter/Space to select, Escape to close |
| Screen reader | `role="menu"` on container, `role="menuitem"` on items, `aria-expanded` on trigger |
| Error announcement | Live region for logout errors |
| Color contrast | White text on dark background — meets WCAG AA |

---

## Responsive Behavior

| Breakpoint | Layout Changes |
|------------|----------------|
| All breakpoints | No changes — fixed-size floating overlay |

The dropdown is a small floating component. It maintains consistent dimensions across all breakpoints. It should be positioned relative to the trigger element and stay within viewport bounds.

---

## Design Tokens

| Token | Value | Usage |
|-------|-------|-------|
| --color-dropdown-bg | #00070C | Dropdown background |
| --color-dropdown-border | #998C5F | Gold border |
| --color-profile-item-bg | rgba(255,234,158,0.1) | Profile item background |
| --text-menu-item | Montserrat 700 16px/24px | Menu item text |
| --shadow-text-glow | 0 4px 4px rgba(0,0,0,0.25), 0 0 6px #FAE287 | Profile text glow |
| --radius-dropdown | 8px | Container corners |
| --radius-item | 4px | Item corners |

---

## Implementation Notes

### Dependencies
- Supabase Auth client for logout functionality
- Icon component supporting "user" and "chevron-right" variants (component set: 178:1020)
- Montserrat font (Bold 700)

### Special Considerations
- Component requires `"use client"` directive (uses event handlers and state)
- Profile item glow effect may be conditional on current route (active state)
- Dropdown positioning should account for viewport edges
- Click-outside detection needed for closing the dropdown

---

## Analysis Metadata

| Property | Value |
|----------|-------|
| Analyzed By | Screen Flow Discovery |
| Analysis Date | 2026-03-13 |
| Needs Deep Analysis | No |
| Confidence Score | High |

### Next Steps
- [ ] Implement ProfileDropdown component
- [ ] Connect to Supabase Auth for logout
- [ ] Add to global header/layout
- [ ] Write integration tests
