# Design Style: Dropdown Profile Menu

**Frame ID**: `721:5223`
**Frame Name**: `Dropdown-profile`
**File Key**: `9ypp4enmFmdK3YAFJLIu6C`
**Extracted At**: 2026-03-13

---

## Design Tokens

### Colors

| Token Name | Hex Value | Opacity | Usage |
|------------|-----------|---------|-------|
| --color-dropdown-bg | #00070C | 100% | Dropdown container background |
| --color-dropdown-border | #998C5F | 100% | Dropdown border (gold) |
| --color-profile-item-bg | #FFEA9E | 10% | Profile menu item background |
| --color-text-primary | #FFFFFF | 100% | Menu item text (default) |
| --color-text-glow | #FAE287 | 100% | Profile text glow effect |
| --color-item-hover-bg | #FFEA9E | 20% | Menu item hover background |

### Typography

| Token Name | Font Family | Size | Weight | Line Height | Letter Spacing |
|------------|-------------|------|--------|-------------|----------------|
| --text-menu-item | Montserrat | 16px | 700 | 24px (150%) | 0.15px |

### Spacing

| Token Name | Value | Usage |
|------------|-------|-------|
| --spacing-dropdown-padding | 6px | Dropdown container inner padding |
| --spacing-item-padding | 16px | Menu item inner padding |
| --spacing-item-gap | 4px | Gap between icon and label |

### Border & Radius

| Token Name | Value | Usage |
|------------|-------|-------|
| --radius-dropdown | 8px | Dropdown container |
| --radius-item | 4px | Menu item hover/active |
| --border-dropdown | 1px solid #998C5F | Dropdown container border |

### Shadows

| Token Name | Value | Usage |
|------------|-------|-------|
| --shadow-text-glow | 0 4px 4px rgba(0, 0, 0, 0.25), 0 0 6px #FAE287 | Profile text glow effect |
| --shadow-dropdown | 0 10px 15px rgba(0, 0, 0, 0.3) | Dropdown container elevation |

---

## Layout Specifications

### Container (Dropdown)

| Property | Value | Notes |
|----------|-------|-------|
| width | auto (content-based) | Wraps content |
| padding | 6px | All sides |
| background | #00070C | Dark background |
| border | 1px solid #998C5F | Gold border |
| border-radius | 8px | Rounded corners |
| display | flex | Vertical stack |
| flex-direction | column | Items stacked vertically |
| align-items | flex-start | Left-aligned items |

### Layout Structure (ASCII)

```
┌─────────────────────────────────────────┐
│  Dropdown Container (p: 6px, r: 8px)    │
│  bg: #00070C, border: 1px #998C5F       │
│                                          │
│  ┌─────────────────────────────────────┐ │
│  │  A.1 Profile Item (p: 16px, r: 4px)│ │
│  │  bg: rgba(255,234,158,0.1)         │ │
│  │  ┌──────────┐  ┌──────┐            │ │
│  │  │ "Profile" │  │ 👤  │            │ │
│  │  │ 16px 700  │  │ 24px │            │ │
│  │  │ glow text │  │ icon │            │ │
│  │  └──────────┘  └──────┘            │ │
│  │  w: 100%, min-h: 56px              │ │
│  └─────────────────────────────────────┘ │
│                                          │
│  ┌─────────────────────────────────────┐ │
│  │  A.2 Logout Item (p: 16px, r: 4px) │ │
│  │  bg: transparent                    │ │
│  │  ┌──────────┐  ┌──────┐            │ │
│  │  │ "Logout"  │  │  >  │            │ │
│  │  │ 16px 700  │  │ 24px │            │ │
│  │  │ white     │  │ icon │            │ │
│  │  └──────────┘  └──────┘            │ │
│  │  w: 100%, min-h: 56px             │ │
│  └─────────────────────────────────────┘ │
│                                          │
└─────────────────────────────────────────┘
```

---

## Component Style Details

### Dropdown Container - `A_Dropdown-List`

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | 666:9601 | - |
| **Component ID** | 563:7882 | - |
| display | flex | `display: flex` |
| flex-direction | column | `flex-direction: column` |
| align-items | flex-start | `align-items: flex-start` |
| padding | 6px | `padding: 6px` |
| background | #00070C | `background-color: #00070C` |
| border | 1px solid #998C5F | `border: 1px solid #998C5F` |
| border-radius | 8px | `border-radius: 8px` |
| box-shadow | 0 10px 15px rgba(0,0,0,0.3) | `box-shadow: var(--shadow-dropdown)` |
| position | absolute | `position: absolute` |
| z-index | 50 | `z-index: 50` |

---

### Profile Menu Item - `A.1_Profile`

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | I666:9601;563:7844 | - |
| **Component ID** | 186:1496 | - |
| width | 100% (fill container) | `width: 100%` |
| min-height | 56px | `min-height: 56px` |
| display | flex | `display: flex` |
| flex-direction | row | `flex-direction: row` |
| align-items | center | `align-items: center` |
| justify-content | flex-start | `justify-content: flex-start` |
| gap | 4px | `gap: 4px` |
| padding | 16px | `padding: 16px` |
| background | rgba(255, 234, 158, 0.1) | `background-color: rgba(255, 234, 158, 0.1)` |
| border-radius | 4px | `border-radius: 4px` |
| cursor | pointer | `cursor: pointer` |
| transition | background-color 150ms ease-in-out, text-shadow 150ms ease-in-out | `transition: background-color 150ms ease-in-out, text-shadow 150ms ease-in-out` |

**States (applied to the menu item row, not individual children):**

| State | Property | Value |
|-------|----------|-------|
| Default | background | `rgba(255, 234, 158, 0.1)` |
| Default | text-shadow (on label) | `0 4px 4px rgba(0,0,0,0.25), 0 0 6px #FAE287` |
| Hover | background | `rgba(255, 234, 158, 0.2)` |
| Hover | text-shadow (on label) | `0 4px 4px rgba(0,0,0,0.25), 0 0 10px #FAE287` |
| Focus | outline | `2px solid #FFEA9E` |
| Focus | outline-offset | `2px` |
| Active | background | `rgba(255, 234, 158, 0.25)` |
| Disabled | background | `rgba(255, 234, 158, 0.05)` |
| Disabled | opacity | `0.5` |
| Disabled | cursor | `default` |
| Disabled | pointer-events | `none` |

#### Profile Label Text

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | I666:9601;563:7844;186:1497 | - |
| font-family | Montserrat | `font-family: 'Montserrat', sans-serif` |
| font-size | 16px | `font-size: 16px` |
| font-weight | 700 | `font-weight: 700` |
| line-height | 24px | `line-height: 24px` |
| letter-spacing | 0.15px | `letter-spacing: 0.15px` |
| color | #FFFFFF | `color: #FFFFFF` |
| text-align | center | `text-align: center` |
| text-shadow | 0 4px 4px rgba(0,0,0,0.25), 0 0 6px #FAE287 | `text-shadow: 0 4px 4px rgba(0,0,0,0.25), 0 0 6px #FAE287` |

#### Profile Icon (User)

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | I666:9601;563:7844;186:1498 | - |
| **Component ID** | 186:1611 (from set 178:1020) | - |
| width | 24px | `width: 24px` |
| height | 24px | `height: 24px` |
| color | #FAE287 | `color: #FAE287` (gold, matching glow theme) |

---

### Logout Menu Item - `A.2_Logout`

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | I666:9601;563:7868 | - |
| **Component ID** | 186:1433 | - |
| width | 100% (fill container) | `width: 100%` |
| min-height | 56px | `min-height: 56px` |
| display | flex | `display: flex` |
| flex-direction | row | `flex-direction: row` |
| align-items | center | `align-items: center` |
| justify-content | flex-start | `justify-content: flex-start` |
| gap | 4px | `gap: 4px` |
| padding | 16px | `padding: 16px` |
| background | transparent | `background-color: transparent` |
| border-radius | 4px | `border-radius: 4px` |
| cursor | pointer | `cursor: pointer` |
| transition | background-color 150ms ease-in-out | `transition: background-color 150ms ease-in-out` |

**States (applied to the menu item row, not individual children):**

| State | Property | Value |
|-------|----------|-------|
| Default | background | `transparent` |
| Default | color (on label) | `#FFFFFF` |
| Hover | background | `rgba(255, 234, 158, 0.1)` |
| Focus | outline | `2px solid #FFEA9E` |
| Focus | outline-offset | `2px` |
| Active | background | `rgba(255, 234, 158, 0.15)` |
| Disabled | background | `transparent` |
| Disabled | opacity | `0.5` |
| Disabled | cursor | `default` |
| Disabled | pointer-events | `none` |
| Loading | chevron icon | Replaced by a 24x24 spinning indicator |
| Loading | spinner color | `#FAE287` (gold, same as chevron) |
| Loading | spinner animation | `animate-spin` (360° rotation, 1s linear infinite) |

#### Logout Label Text

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | I666:9601;563:7868;186:1439 | - |
| font-family | Montserrat | `font-family: 'Montserrat', sans-serif` |
| font-size | 16px | `font-size: 16px` |
| font-weight | 700 | `font-weight: 700` |
| line-height | 24px | `line-height: 24px` |
| letter-spacing | 0.15px | `letter-spacing: 0.15px` |
| color | #FFFFFF | `color: #FFFFFF` |
| text-align | center | `text-align: center` |

#### Logout Icon (Chevron Right)

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | I666:9601;563:7868;186:1441 | - |
| **Component ID** | 335:10890 (from set 178:1020) | - |
| width | 24px | `width: 24px` |
| height | 24px | `height: 24px` |
| color | #FAE287 | `color: #FAE287` (gold, matching icon set theme from visual reference) |

---

## Component Hierarchy with Styles

```
ProfileDropdown (positioned absolutely from trigger, z-50)
└── A_Dropdown-List (flex-col, p: 6px, bg: #00070C, border: 1px #998C5F, r: 8px, shadow-dropdown)
    ├── A.1_Profile (flex-row, p: 16px, gap: 4px, bg: rgba(255,234,158,0.1), r: 4px)
    │   ├── Frame 486 (flex-row, gap: 4px, items-center)
    │   │   └── "Profile" (Montserrat 700 16px, #FFF, text-shadow glow)
    │   └── IC - User Icon (24x24)
    │
    └── A.2_Logout (flex-row, p: 16px, gap: 4px, bg: transparent, r: 4px)
        ├── Frame 485 (flex-row, gap: 4px, items-center)
        │   └── "Logout" (Montserrat 700 16px, #FFF)
        └── IC - Chevron Right Icon (24x24)
```

---

## Responsive Specifications

### Breakpoints

| Name | Min Width | Max Width |
|------|-----------|-----------|
| Mobile | 0 | 639px |
| Tablet | 640px | 1023px |
| Desktop | 1024px | ∞ |

### Responsive Changes

This is a dropdown overlay component. Its dimensions are fixed and content-based. No responsive changes are needed as the dropdown is a small floating element.

#### All Breakpoints

| Component | Behavior |
|-----------|----------|
| Dropdown Container | Fixed dimensions, positioned relative to trigger |
| Menu Items | Fixed height 56px, consistent padding |

---

## Icon Specifications

| Icon Name | Node ID | Size | Color | Usage |
|-----------|---------|------|-------|-------|
| User (Person) | I666:9601;563:7844;186:1498 | 24x24 | #FAE287 (gold) | Profile menu item icon |
| Chevron Right | I666:9601;563:7868;186:1441 | 24x24 | #FAE287 (gold) | Logout menu item icon |

**Icon Component Set ID**: `178:1020`

---

## Animation & Transitions

| Element | Property | Duration | Easing | Trigger |
|---------|----------|----------|--------|---------|
| Dropdown | opacity, transform | 150ms | ease-out | Open/Close toggle |
| Menu Item | background-color | 150ms | ease-in-out | Hover |
| Profile Text | text-shadow | 150ms | ease-in-out | Hover (glow intensity) |

---

## Implementation Mapping

| Design Element | Figma Node ID | Tailwind / CSS Class | React Component |
|----------------|---------------|---------------------|-----------------|
| Dropdown Container | 666:9601 | `flex flex-col p-1.5 bg-dropdown-bg border border-dropdown-border rounded-lg shadow-dropdown z-50` | `<ProfileDropdown />` |
| Profile Item | I666:9601;563:7844 | `w-full flex items-center gap-1 p-4 bg-profile-item-bg rounded cursor-pointer hover:bg-item-hover-bg transition-colors` | `<DropdownItem variant="profile">` |
| Profile Label | I666:9601;563:7844;186:1497 | `font-montserrat text-base font-bold text-white [text-shadow:var(--shadow-text-glow)]` | Text child |
| Profile Icon | I666:9601;563:7844;186:1498 | `w-6 h-6 text-[#FAE287]` | `<Icon name="user" />` |
| Logout Item | I666:9601;563:7868 | `w-full flex items-center gap-1 p-4 rounded cursor-pointer hover:bg-profile-item-bg transition-colors` | `<DropdownItem variant="logout">` |
| Logout Label | I666:9601;563:7868;186:1439 | `font-montserrat text-base font-bold text-white` | Text child |
| Logout Icon | I666:9601;563:7868;186:1441 | `w-6 h-6 text-[#FAE287]` | `<Icon name="chevron-right" />` |

> **Note**: The arbitrary color values (e.g., `bg-[#00070C]`) shown above as semantic tokens (e.g., `bg-dropdown-bg`) MUST be added to the Tailwind config as custom theme colors per the constitution's requirement to "use design tokens from the Tailwind config rather than arbitrary values."

---

## Notes

- All colors should use CSS variables for theming support
- The dropdown uses a dark theme with gold accent — consistent with a premium/awards aesthetic
- The Profile item has a distinctive glow effect (text-shadow + tinted background) as its **default state** (always visible), differentiating it as the primary action in the dropdown
- Icons **MUST BE** in **Icon Component** instead of svg files or img tags
- Font: Montserrat must be loaded (already available in project at `public/fonts/`)
- The dropdown is positioned absolutely relative to its trigger element (e.g., user avatar/button in the header)
