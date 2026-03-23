# Design Style: Profile Dropdown

**Frame ID**: `721:5223`
**Frame Name**: `Dropdown-profile`
**Figma Link**: https://www.figma.com/file/9ypp4enmFmdK3YAFJLIu6C?node-id=721:5223
**Extracted At**: 2026-03-10

---

## Design Tokens

### Colors

| Token Name | Hex Value | Opacity | Usage |
|------------|-----------|---------|-------|
| --color-dropdown-bg | #00070C | 100% | Dropdown container background |
| --color-dropdown-border | #998C5F | 100% | Dropdown container border (gold/amber) |
| --color-active-bg | rgba(255, 234, 158, 0.1) | 10% | Active/selected item background |
| --color-text-white | #FFFFFF | 100% | Menu item text and icons |
| --color-text-glow | #FAE287 | - | Active item text glow effect |
| --color-text-shadow | rgba(0, 0, 0, 0.25) | 25% | Text shadow on active item |
| --color-frame-bg | #696969 | 100% | Outer frame background (context only) |

### Typography

| Token Name | Font Family | Size | Weight | Line Height | Letter Spacing |
|------------|-------------|------|--------|-------------|----------------|
| --text-menu-item | Montserrat | 16px | 700 (Bold) | 24px | 0.15px |

### Spacing

| Token Name | Value | Usage |
|------------|-------|-------|
| --spacing-dropdown-padding | 6px | Dropdown container inner padding |
| --spacing-item-padding | 16px | Menu item internal padding |
| --spacing-item-gap | 4px | Gap between text and icon within item |

### Border & Radius

| Token Name | Value | Usage |
|------------|-------|-------|
| --radius-dropdown | 8px | Dropdown container border radius |
| --radius-item | 4px | Individual menu item border radius |
| --border-dropdown | 1px solid #998C5F | Dropdown container border |

### Shadows

| Token Name | Value | Usage |
|------------|-------|-------|
| --shadow-active-text | 0 4px 4px rgba(0, 0, 0, 0.25), 0 0 6px #FAE287 | Active item text glow effect |

---

## Layout Specifications

### Container (Dropdown)

| Property | Value | Notes |
|----------|-------|-------|
| width | auto (content-driven) | Adapts to longest item |
| padding | 6px | All sides |
| background | #00070C | Dark background |
| border | 1px solid #998C5F | Gold/amber border |
| border-radius | 8px | Rounded corners |
| display | flex | Flex container |
| flex-direction | column | Vertical stack |
| align-items | flex-start | Left aligned |

### Menu Item

| Property | Value | Notes |
|----------|-------|-------|
| width | ~119-121px | Content width (hug) |
| height | 56px | Fixed height |
| padding | 16px | All sides |
| border-radius | 4px | Slight rounding |
| display | flex | Flex container |
| flex-direction | row | Horizontal layout |
| align-items | center | Vertically centered |
| justify-content | flex-start | Left aligned |
| gap | 4px | Between text and icon |

### Layout Structure (ASCII)

```
┌──────────────────────────────────────────┐
│  Dropdown Container                      │
│  (bg: #00070C, border: 1px #998C5F)     │
│  (padding: 6px, radius: 8px)            │
│  (flex, flex-col)                        │
│                                          │
│  ┌──────────────────────────────────┐    │
│  │  Profile Item [ACTIVE]           │    │
│  │  (bg: rgba(255,234,158,0.1))    │    │
│  │  (w: 119px, h: 56px, p: 16px)  │    │
│  │  (radius: 4px)                   │    │
│  │  ┌──────────┐  ┌──────┐         │    │
│  │  │ "Profile" │  │  👤  │         │    │
│  │  │ glow text │  │24x24 │         │    │
│  │  └──────────┘  └──────┘         │    │
│  │  gap: 4px                        │    │
│  └──────────────────────────────────┘    │
│                                          │
│  ┌──────────────────────────────────┐    │
│  │  Logout Item [DEFAULT]           │    │
│  │  (bg: transparent)               │    │
│  │  (w: 121px, h: 56px, p: 16px)  │    │
│  │  ┌──────────┐  ┌──────┐         │    │
│  │  │ "Logout"  │  │  ›   │         │    │
│  │  │ white txt │  │24x24 │         │    │
│  │  └──────────┘  └──────┘         │    │
│  │  gap: 4px                        │    │
│  └──────────────────────────────────┘    │
│                                          │
└──────────────────────────────────────────┘
```

---

## Component Style Details

### Dropdown Container - `A_Dropdown-List`

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | 666:9601 | - |
| display | flex | `display: flex` |
| flex-direction | column | `flex-direction: column` |
| padding | 6px | `padding: 6px` |
| background | #00070C | `background-color: #00070C` |
| border | 1px solid #998C5F | `border: 1px solid #998C5F` |
| border-radius | 8px | `border-radius: 8px` |
| align-items | flex-start | `align-items: flex-start` |

**States:**
| State | Changes |
|-------|---------|
| Closed | Hidden (trigger button shows user avatar) |
| Open | Visible with menu items |

---

### Profile Menu Item - `A.1_Profile`

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | I666:9601;563:7844 | - |
| width | 119px | `width: 119px` |
| height | 56px | `height: 56px` |
| padding | 16px | `padding: 16px` |
| background | rgba(255, 234, 158, 0.1) | `background-color: rgba(255, 234, 158, 0.1)` |
| border-radius | 4px | `border-radius: 4px` |
| display | flex | `display: flex` |
| align-items | center | `align-items: center` |
| justify-content | flex-start | `justify-content: flex-start` |
| gap | 4px | `gap: 4px` |
| cursor | pointer | `cursor: pointer` |

**Profile Text Style:**
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

**Profile Icon:**
| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | I666:9601;563:7844;186:1498 | - |
| **Component ID** | 186:1611 | User/person icon |
| width | 24px | `width: 24px` |
| height | 24px | `height: 24px` |
| position | right of text | After text label |

**States:**
| State | Changes |
|-------|---------|
| Default/Active | background: rgba(255, 234, 158, 0.1), text-shadow: glow |
| Hover | background: rgba(255, 234, 158, 0.15) (predicted) |

---

### Logout Menu Item - `A.2_Logout`

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | I666:9601;563:7868 | - |
| width | 121px | `width: 121px` |
| height | 56px | `height: 56px` |
| padding | 16px | `padding: 16px` |
| background | transparent | `background-color: transparent` |
| border-radius | 4px | `border-radius: 4px` |
| display | flex | `display: flex` |
| align-items | center | `align-items: center` |
| justify-content | flex-start | `justify-content: flex-start` |
| gap | 4px | `gap: 4px` |
| cursor | pointer | `cursor: pointer` |

**Logout Text Style:**
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
| text-shadow | none | - |

**Logout Icon (Chevron Right):**
| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | I666:9601;563:7868;186:1441 | - |
| **Component ID** | 335:10890 | Chevron right / arrow icon |
| width | 24px | `width: 24px` |
| height | 24px | `height: 24px` |
| position | right of text | After text label |

**States:**
| State | Changes |
|-------|---------|
| Default | background: transparent, no text glow |
| Hover | background: rgba(255, 234, 158, 0.1) (predicted) |

---

## Component Hierarchy with Styles

```
Dropdown Container (666:9601)
  bg: #00070C, border: 1px solid #998C5F, radius: 8px, p: 6px
  display: flex, flex-col, items-start
  │
  ├── Profile Item (I666:9601;563:7844) [ACTIVE]
  │   bg: rgba(255,234,158,0.1), w: 119px, h: 56px, radius: 4px
  │   display: flex, items-center, gap: 4px, p: 16px
  │   │
  │   ├── Content Frame (I666:9601;563:7844;186:2012)
  │   │   flex, items-center, gap: 4px
  │   │   │
  │   │   └── Text "Profile" (Montserrat 700 16px #FFF, text-shadow: glow)
  │   │
  │   └── User Icon (I666:9601;563:7844;186:1498) [24x24, white]
  │
  └── Logout Item (I666:9601;563:7868) [DEFAULT]
      bg: transparent, w: 121px, h: 56px, radius: 4px
      display: flex, items-center, gap: 4px, p: 16px
      │
      ├── Content Frame (I666:9601;563:7868;186:1937)
      │   flex, items-center, gap: 4px
      │   │
      │   └── Text "Logout" (Montserrat 700 16px #FFF)
      │
      └── Chevron Right Icon (I666:9601;563:7868;186:1441) [24x24, white]
```

---

## Responsive Specifications

### Breakpoints

| Name | Min Width | Max Width |
|------|-----------|-----------|
| Mobile | 0 | 639px |
| Tablet | 640px | 1023px |
| Desktop | 1024px | - |

### Responsive Changes

This is a compact dropdown component. Minimal responsive changes needed:

#### Mobile (< 640px)
| Component | Changes |
|-----------|---------|
| Dropdown | Same dimensions (compact enough for mobile) |
| Touch target | Items are 56px tall (exceeds 44px minimum) - compliant |
| Position | May need to reposition relative to trigger to fit viewport |

#### Tablet & Desktop (>= 640px)
| Component | Changes |
|-----------|---------|
| Dropdown | No changes needed (already compact) |

---

## Icon Specifications

| Icon Name | Node ID / Component ID | Size | Color | Usage |
|-----------|----------------------|------|-------|-------|
| User/Person | 186:1611 | 24x24 | #FFFFFF | Profile menu item icon |
| Chevron Right | 335:10890 | 24x24 | #FFFFFF | Logout menu item icon |

---

## Animation & Transitions

| Element | Property | Duration | Easing | Trigger |
|---------|----------|----------|--------|---------|
| Dropdown | opacity, transform | 150ms | ease-out | Open/Close toggle |
| Menu Item | background-color | 150ms | ease-in-out | Hover |

---

## Implementation Mapping

| Design Element | Figma Node ID | Tailwind / CSS Class | React Component |
|----------------|---------------|---------------------|-----------------|
| Dropdown Container | 666:9601 | `flex flex-col p-1.5 bg-[#00070C] border border-[#998C5F] rounded-lg` | `<ProfileDropdown />` |
| Profile Item (Active) | I666:9601;563:7844 | `flex items-center gap-1 w-full h-14 px-4 rounded bg-[rgba(255,234,158,0.1)]` | `<ProfileMenuItem active />` |
| Logout Item (Default) | I666:9601;563:7868 | `flex items-center gap-1 w-full h-14 px-4 rounded hover:bg-[rgba(255,234,158,0.1)]` | `<ProfileMenuItem />` |
| Active Text | I666:9601;563:7844;186:1497 | `font-montserrat font-bold text-base text-white tracking-[0.15px] [text-shadow:0_4px_4px_rgba(0,0,0,0.25),0_0_6px_#FAE287]` | Text within item |
| Default Text | I666:9601;563:7868;186:1439 | `font-montserrat font-bold text-base text-white tracking-[0.15px]` | Text within item |
| User Icon | I666:9601;563:7844;186:1498 | `w-6 h-6 text-white` | `<Icon name="user" />` |
| Chevron Icon | I666:9601;563:7868;186:1441 | `w-6 h-6 text-white` | `<Icon name="chevron-right" />` |

---

## Notes

- All colors should use CSS variables for theming support
- Prefer Tailwind utility classes as per project constitution (TailwindCSS 4.x)
- Font: Montserrat Bold must be loaded (consistent with other dropdowns)
- Same dark theme as Language Dropdown and Department Dropdown (#00070C bg, #998C5F border)
- Icons are positioned to the RIGHT of the text label (unlike language dropdown where flags are on the left)
- Profile item uses the same glow text-shadow as Department Dropdown selected state
- Both items share the same Figma component set (`186:1426`)
- All icons **MUST BE** in **Icon Component** instead of svg files or img tags
