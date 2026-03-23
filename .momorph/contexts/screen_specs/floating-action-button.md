# Screen: Floating Action Button (FAB)

## Screen Info

| Property | Value |
|----------|-------|
| **Figma Frame ID** | 313:9137 |
| **Figma Link** | https://www.figma.com/design/9ypp4enmFmdK3YAFJLIu6C?node-id=313:9137 |
| **Screen Group** | Global UI Components |
| **Status** | analyzed |
| **Discovered At** | 2026-03-16 |
| **Last Updated** | 2026-03-16 |

---

## Description

A persistent floating action button (FAB) widget positioned at the bottom-right corner of the viewport. It displays a golden pill-shaped button with two icon actions (write kudos and view SAA rules) separated by a "/" divider. Clicking the FAB expands it to reveal the two individual action options. This is a global UI component visible on all authenticated pages.

---

## Navigation Analysis

### Incoming Navigations (From)

| Source Screen | Trigger | Condition |
|---------------|---------|-----------|
| Any authenticated page | Always visible | User must be authenticated |

### Outgoing Navigations (To)

| Target Screen | Trigger Element | Node ID | Confidence | Notes |
|---------------|-----------------|---------|------------|-------|
| Floating Action Button - Expanded (313:9139) | Click FAB pill | 313:9138 | High | Expands to show labeled action buttons |
| Viet Kudo - Write Kudos Modal (520:11602) | Click "Viết KUDOS" button | I313:9140;214:3732 | High | Opens kudos writing modal |
| Thể lệ (3204:6051) | Click "Thể lệ" button | I313:9140;214:3799 | High | Navigates to `/awards/rules` |

### Navigation Rules
- **Back behavior**: Collapse FAB returns to default state (no page navigation)
- **Deep link support**: No - component, not a page
- **Auth required**: Yes - only visible for authenticated users

---

## Component Schema

### Layout Structure

```
┌────────────────────────────────────────────────────────┐
│  Page Content (any page)                                │
│                                                        │
│                                                        │
│                                                        │
│                                ┌──────────────────────┐│
│                                │  FAB Widget (fixed)  ││
│                                │  ┌────────────────┐  ││
│                                │  │ ✏️ / ⚡        │  ││
│                                │  │ (106x64, pill) │  ││
│                                │  └────────────────┘  ││
│                                └──────────────────────┘│
└────────────────────────────────────────────────────────┘
```

### Component Hierarchy

```
FloatingActionButton (Organism)
├── FABWrapper [313:9138] (Molecule)
│   └── FABPill [I313:9138;214:3839] (Molecule)
│       ├── KudosIconGroup [I313:9138;214:3839;186:1935] (Molecule)
│       │   ├── PenIcon [I313:9138;214:3839;186:1763] (Atom)
│       │   └── SeparatorText "/" [I313:9138;214:3839;186:1568] (Atom)
│       └── RulesIcon [I313:9138;214:3839;186:1766] (Atom)
```

### Main Components

| Component | Type | Node ID | Description | Reusable |
|-----------|------|---------|-------------|----------|
| FAB Wrapper | Molecule | 313:9138 | Fixed-position container with glow shadow | No |
| FAB Pill | Molecule | I313:9138;214:3839 | Golden pill button (106x64px, radius: 100px) | No |
| Pen Icon | Atom | I313:9138;214:3839;186:1763 | 24x24 write/kudos icon | Yes (Icon Component) |
| Separator | Atom | I313:9138;214:3839;186:1568 | "/" text in Montserrat 700 24px | No |
| Rules Icon | Atom | I313:9138;214:3839;186:1766 | 24x24 lightning/rules icon | Yes (Icon Component) |

---

## Form Fields (If Applicable)

N/A - No form fields. This is a purely navigational component.

---

## API Mapping

### On Screen Load

No API calls. The FAB is a purely client-side UI component.

### On User Action

| Action | API | Method | Request Body | Response |
|--------|-----|--------|--------------|----------|
| Click FAB | - | - | - | Expand FAB (local state change) |
| Click Kudos | - | - | Navigation to kudos modal | - |
| Click Rules | - | - | Navigation to /awards | - |

### Error Handling

N/A - No API calls.

---

## State Management

### Local State

| State | Type | Initial | Purpose |
|-------|------|---------|---------|
| isExpanded | boolean | false | Whether FAB shows expanded options |

### Global State (If Applicable)

| State | Store | Read/Write | Purpose |
|-------|-------|------------|---------|
| isAuthenticated | authStore | Read | Show/hide FAB based on auth status |

---

## UI States

### Loading State
- N/A - No data loading

### Error State
- N/A - No API interactions

### Success State
- N/A

### Empty State
- N/A

---

## Accessibility

| Requirement | Implementation |
|-------------|----------------|
| Focus management | FAB focusable via Tab key |
| Keyboard navigation | Enter/Space to expand, Tab between options |
| Screen reader | `aria-label="Quick actions: Write kudos or View SAA rules"` |
| Role | `role="button"` with `aria-expanded` for toggle state |
| Color contrast | Dark icons on #FFEA9E background - WCAG AA compliant |

---

## Responsive Behavior

| Breakpoint | Layout Changes |
|------------|----------------|
| Mobile (<640px) | Fixed bottom: 20px, right: 16px |
| Tablet (640-1023px) | Fixed bottom: 24px, right: 24px |
| Desktop (≥1024px) | Fixed bottom: ~120px, right: ~143px |

---

## Design Tokens

| Token | Value | Usage |
|-------|-------|-------|
| --color-fab-bg | #FFEA9E | FAB pill background |
| --color-fab-text | #00101A | Separator text color |
| --color-fab-glow | #FAE287 | Golden glow shadow |
| --radius-fab | 100px | Pill border radius |
| --shadow-fab | 0 4px 4px 0 rgba(0,0,0,0.25), 0 0 6px 0 #FAE287 | FAB elevation + glow |

---

## Implementation Notes

### Dependencies
- Montserrat font (for "/" separator)
- Icon Components (Pen, Rules/Lightning)

### Special Considerations
- Must use `position: fixed` (not absolute) to persist during scroll
- Place in root layout (`src/app/layout.tsx`) for global visibility
- Must be a Client Component (`"use client"`) for click handlers and state
- z-index should be high (z-50) but below modals
- Touch target (106x64px) exceeds 44x44px minimum requirement
- Icons MUST be Icon Components, not SVG files or img tags (per constitution)

---

## Analysis Metadata

| Property | Value |
|----------|-------|
| Analyzed By | Screen Flow Discovery |
| Analysis Date | 2026-03-16 |
| Needs Deep Analysis | No |
| Confidence Score | High |

### Next Steps
- [x] Get detailed design items via list_design_items
- [x] Extract styles via list_frame_styles
- [ ] Implement FloatingActionButton component
- [ ] Specify expanded FAB state (frame 313:9139)
