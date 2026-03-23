# Screen: Thể lệ (Rules Panel)

## Screen Info

| Property | Value |
|----------|-------|
| **Figma Frame ID** | 3204:6051 |
| **Figma Link** | https://www.figma.com/design/9ypp4enmFmdK3YAFJLIu6C?node-id=3204:6051 |
| **Screen Group** | Kudos Feature |
| **Status** | analyzed |
| **Discovered At** | 2026-03-16 |
| **Last Updated** | 2026-03-16 |

---

## Description

Informational rules/regulations panel for the SAA 2025 Kudos system. Displays as a right-side slide-in panel over the current page. Contains three sections: Kudos Receiver Hero badge tier system (4 tiers), Kudos Sender icon collection mechanic (6 collectible badges via Secret Box), and Kudos Quốc Dân recognition (top 5 most-loved Kudos). Includes "Đóng" (Close) and "Viết KUDOS" (Write Kudos) action buttons in a fixed footer.

---

## Navigation Analysis

### Incoming Navigations (From)

| Source Screen | Trigger | Condition |
|---------------|---------|-----------|
| FAB Expanded (313:9139) | Click "Thể lệ" button | User is authenticated |
| Direct URL `/awards/rules` | URL navigation | User is authenticated |

### Outgoing Navigations (To)

| Target Screen | Trigger Element | Node ID | Confidence | Notes |
|---------------|-----------------|---------|------------|-------|
| Previous page (close panel) | Click "Đóng" button | 3204:6093 | High | Closes modal/panel, returns to previous view |
| Viết Kudo - Write Kudos Modal (520:11602) | Click "Viết KUDOS" button | 3204:6094 | High | Opens kudos writing modal |

### Navigation Rules
- **Back behavior**: "Đóng" button closes the panel and returns to the page underneath
- **Deep link support**: Yes - `/awards/rules`
- **Auth required**: Yes - only accessible to authenticated users

---

## Component Schema

### Layout Structure

```
┌────────────────────────────────────────────────────────┐
│  Page Content (underneath overlay)                      │
│                                                        │
│                       ┌──────────────────────────────┐ │
│                       │  Rules Panel (553px, right)  │ │
│                       │  bg: #00070C                 │ │
│                       │                              │ │
│                       │  ┌──────────────────────┐    │ │
│                       │  │ "Thể lệ" (Title)     │    │ │
│                       │  ├──────────────────────┤    │ │
│                       │  │ NGƯỜI NHẬN KUDOS      │    │ │
│                       │  │ [New Hero] 1-4        │    │ │
│                       │  │ [Rising Hero] 5-9     │    │ │
│                       │  │ [Super Hero] 10-20    │    │ │
│                       │  │ [Legend Hero] 20+     │    │ │
│                       │  ├──────────────────────┤    │ │
│                       │  │ NGƯỜI GỬI KUDOS       │    │ │
│                       │  │ [Badge Grid 3x2]     │    │ │
│                       │  ├──────────────────────┤    │ │
│                       │  │ KUDOS QUỐC DÂN        │    │ │
│                       │  │ Top 5 description     │    │ │
│                       │  ├──────────────────────┤    │ │
│                       │  │ [Đóng] [Viết KUDOS]   │    │ │
│                       │  └──────────────────────┘    │ │
│                       └──────────────────────────────┘ │
└────────────────────────────────────────────────────────┘
```

### Component Hierarchy

```
RulesPanel (Organism)
├── ScrollableContent (Organism)
│   ├── Title [3204:6055] (Atom)
│   │   └── "Thể lệ" text (45px Montserrat Bold, gold)
│   │
│   ├── ReceiverSection [3204:6131] (Organism)
│   │   ├── SectionHeading [3204:6132] (Atom) - "NGƯỜI NHẬN KUDOS..."
│   │   ├── DescriptionText [3204:6133] (Atom)
│   │   ├── HeroBadgeRow (Molecule) × 4
│   │   │   ├── HeroBadgePill [3204:6163/6172/6181/6190] (Molecule)
│   │   │   │   └── BadgeText (Atom) - "New/Rising/Super/Legend Hero"
│   │   │   ├── ThresholdText (Atom) - "Có X người gửi..."
│   │   │   └── MotivationText (Atom) - Description
│   │   └── ...repeated for each tier
│   │
│   ├── SenderSection (Organism)
│   │   ├── SectionHeading [3204:6077] (Atom) - "NGƯỜI GỬI KUDOS..."
│   │   ├── DescriptionText [3204:6078] (Atom)
│   │   ├── BadgeGrid [3204:6079] (Organism)
│   │   │   ├── BadgeRow1 [3204:6081] (Molecule)
│   │   │   │   ├── CollectionBadge [3204:6082] REVIVAL (Molecule)
│   │   │   │   ├── CollectionBadge [3204:6087] TOUCH OF LIGHT (Molecule)
│   │   │   │   └── CollectionBadge [3204:6086] STAY GOLD (Molecule)
│   │   │   └── BadgeRow2 [3204:6085] (Molecule)
│   │   │       ├── CollectionBadge [3204:6083] FLOW TO HORIZON (Molecule)
│   │   │       ├── CollectionBadge [3204:6084] BEYOND THE BOUNDARY (Molecule)
│   │   │       └── CollectionBadge [3204:6088] ROOT FURTHER (Molecule)
│   │   └── CompletionText [3204:6089] (Atom)
│   │
│   └── NationalKudosSection (Molecule)
│       ├── SubsectionHeading [3204:6090] (Atom) - "KUDOS QUỐC DÂN"
│       └── DescriptionText [3204:6091] (Atom)
│
└── ButtonFooter [3204:6092] (Molecule)
    ├── CloseButton [3204:6093] (Atom) - "Đóng" (secondary)
    └── WriteKudosButton [3204:6094] (Atom) - "Viết KUDOS" (primary)
```

### Main Components

| Component | Type | Node ID | Description | Reusable |
|-----------|------|---------|-------------|----------|
| RulesPanel | Organism | 3204:6052 | Right-side slide-in panel container | No |
| HeroBadgePill | Molecule | 3007:17505 (set) | Tier badge pill with gradient background | Yes |
| CollectionBadge | Molecule | 737:20452 (set) | Circular badge icon with label | Yes |
| CloseButton | Atom | 3204:6093 | Secondary outlined button with X icon | Yes (Button variant) |
| WriteKudosButton | Atom | 3204:6094 | Primary gold button with Pen icon | Yes (Button variant) |

---

## Form Fields (If Applicable)

N/A - This is an informational/read-only panel with no form fields.

---

## API Mapping

### On Screen Load

No API calls required. Content is static/informational.

### On User Action

| Action | API | Method | Request Body | Response |
|--------|-----|--------|--------------|----------|
| Click "Đóng" | - | - | - | Close panel (local state change) |
| Click "Viết KUDOS" | - | - | - | Navigate to Write Kudos modal (520:11602) |

### Error Handling

N/A - No API calls.

---

## State Management

### Local State

| State | Type | Initial | Purpose |
|-------|------|---------|---------|
| isOpen | boolean | false | Whether panel is visible |
| scrollPosition | number | 0 | Track scroll for content area |

### Global State (If Applicable)

| State | Store | Read/Write | Purpose |
|-------|-------|------------|---------|
| isAuthenticated | authStore | Read | Gate access to rules panel |

---

## UI States

### Loading State
- N/A - Static content, no data loading

### Error State
- N/A - No API interactions

### Success State
- N/A

### Empty State
- N/A - Content is always present (static)

---

## Accessibility

| Requirement | Implementation |
|-------------|----------------|
| Focus management | Focus first element (title or close button) on panel open |
| Keyboard navigation | Tab through content, Escape to close |
| Screen reader | `aria-label="Thể lệ chương trình Kudos"` on panel |
| Role | `role="dialog"` with `aria-modal="true"` |
| Color contrast | White/gold text on dark background - WCAG AA compliant |
| Focus trap | Focus trapped within panel while open |

---

## Responsive Behavior

| Breakpoint | Layout Changes |
|------------|----------------|
| Mobile (<640px) | Full-screen overlay, width: 100% |
| Tablet (640-1023px) | Slide-in panel, width: 80% |
| Desktop (≥1024px) | Slide-in panel, width: 553px (as designed) |

---

## Design Tokens

| Token | Value | Usage |
|-------|-------|-------|
| --color-bg-panel | #00070C | Panel background |
| --color-bg-overlay | #00101A | Page background / overlay |
| --color-accent-gold | #FFEA9E | Titles, headings, accents |
| --color-text-white | #FFFFFF | Body text |
| --color-btn-primary | #FFEA9E | "Viết KUDOS" button bg |
| --color-btn-secondary-bg | rgba(255,234,158,0.10) | "Đóng" button bg |
| --color-border-gold | #998C5F | "Đóng" button border |
| --font-family | Montserrat | All text |

---

## Implementation Notes

### Dependencies
- Montserrat font (all text uses Bold/700 weight)
- Icon Components: Close (X), Pen
- Hero badge images (4 tiers): exported from Figma component set 3007:17505
- Collection badge images (6 icons): exported from Figma component set 737:20452

### Special Considerations
- Panel is a modal overlay - must use `role="dialog"` with focus trap
- Content area must scroll independently with fixed footer buttons
- All text is in Vietnamese - ensure proper Unicode/diacritics rendering
- All body text uses font-weight: 700 (bold) - this is intentional per design
- Hero badge pills have progressively complex visual treatments (simple → glowing)
- Badge images should use `next/image` for optimization
- Icons MUST be Icon Components, not SVG files or img tags (per constitution)
- Place as a Client Component (`"use client"`) for dialog state management
- Consider implementing as a route-based modal at `/awards/rules`

### Media Assets

| Asset | Type | Source Node | Description |
|-------|------|-------------|-------------|
| New Hero badge | Image | 3007:17506 | Hero tier 1 pill background |
| Rising Hero badge | Image | 3007:17509 | Hero tier 2 pill background |
| Super Hero badge | Image | 3007:17512 | Hero tier 3 pill background |
| Legend Hero badge | Image | 3007:17516 | Hero tier 4 pill background (glowing) |
| REVIVAL icon | Image | 737:20446 | Collection badge 1 |
| TOUCH OF LIGHT icon | Image | 737:20450 | Collection badge 2 |
| STAY GOLD icon | Image | 737:20449 | Collection badge 3 |
| FLOW TO HORIZON icon | Image | 737:20447 | Collection badge 4 |
| BEYOND THE BOUNDARY icon | Image | 737:20448 | Collection badge 5 |
| ROOT FURTHER icon | Image | 737:20451 | Collection badge 6 |
| Close icon | Icon | 214:3851 | "Đóng" button icon |
| Pen icon | Icon | 214:3812 | "Viết KUDOS" button icon |

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
- [x] Create feature spec (`.momorph/specs/3204_6051-the-le-update/spec.md`)
- [x] Create design style doc (`.momorph/specs/3204_6051-the-le-update/design-style.md`)
- [ ] Implement RulesPanel component
- [ ] Export badge images from Figma
