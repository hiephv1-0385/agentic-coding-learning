# Design Style: Admin Profile Dropdown

**Frame ID**: `721:5277`
**Frame Name**: `Dropdown-profile Admin`
**Figma Link**: https://www.figma.com/file/9ypp4enmFmdK3YAFJLIu6C?node-id=721:5277
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
| width | auto (content-driven) | Adapts to longest item ("Dashboard") |
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
| width | ~151-153px | Content width (hug), wider than regular profile dropdown |
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
┌──────────────────────────────────────────────┐
│  Dropdown Container                          │
│  (bg: #00070C, border: 1px #998C5F)         │
│  (padding: 6px, radius: 8px)                │
│  (flex, flex-col)                            │
│                                              │
│  ┌──────────────────────────────────────┐    │
│  │  Profile Item [ACTIVE]               │    │
│  │  (bg: rgba(255,234,158,0.1))        │    │
│  │  (w: 151px, h: 56px, p: 16px)      │    │
│  │  (radius: 4px)                       │    │
│  │  ┌──────────┐  ┌──────┐             │    │
│  │  │ "Profile" │  │  👤  │             │    │
│  │  │ glow text │  │24x24 │             │    │
│  │  └──────────┘  └──────┘             │    │
│  │  gap: 4px                            │    │
│  └──────────────────────────────────────┘    │
│                                              │
│  ┌──────────────────────────────────────┐    │
│  │  Dashboard Item [DEFAULT]            │    │
│  │  (bg: transparent)                   │    │
│  │  (w: 153px, h: 56px, p: 16px)      │    │
│  │  ┌────────────┐  ┌──────┐           │    │
│  │  │ "Dashboard" │  │  ⊞   │           │    │
│  │  │ white text  │  │24x24 │           │    │
│  │  └────────────┘  └──────┘           │    │
│  │  gap: 4px                            │    │
│  └──────────────────────────────────────┘    │
│                                              │
│  ┌──────────────────────────────────────┐    │
│  │  Logout Item [DEFAULT]               │    │
│  │  (bg: transparent)                   │    │
│  │  (w: 153px, h: 56px, p: 16px)      │    │
│  │  ┌──────────┐  ┌──────┐             │    │
│  │  │ "Logout"  │  │  ›   │             │    │
│  │  │ white txt │  │24x24 │             │    │
│  │  └──────────┘  └──────┘             │    │
│  │  gap: 4px                            │    │
│  └──────────────────────────────────────┘    │
│                                              │
└──────────────────────────────────────────────┘
```

---

## Component Style Details

### Dropdown Container - `A_Dropdown-List`

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | 666:9728 | - |
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
| Open | Visible with all 3 menu items |

---

### Profile Menu Item - `A.1_Profile`

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | I666:9728;666:9277 | - |
| width | 151px | `width: 151px` |
| height | 56px | `height: 56px` |
| padding | 16px | `padding: 16px` |
| background | rgba(255, 234, 158, 0.1) | `background-color: rgba(255, 234, 158, 0.1)` |
| border-radius | 4px | `border-radius: 4px` |
| display | flex | `display: flex` |
| align-items | center | `align-items: center` |
| justify-content | flex-start | `justify-content: flex-start` |
| gap | 4px | `gap: 4px` |
| cursor | pointer | `cursor: pointer` |

**Profile Text Style (Active):**
| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | I666:9728;666:9277;186:1497 | - |
| font-family | Montserrat | `font-family: 'Montserrat', sans-serif` |
| font-size | 16px | `font-size: 16px` |
| font-weight | 700 | `font-weight: 700` |
| line-height | 24px | `line-height: 24px` |
| letter-spacing | 0.15px | `letter-spacing: 0.15px` |
| color | #FFFFFF | `color: #FFFFFF` |
| text-align | center | `text-align: center` |
| text-shadow | 0 4px 4px rgba(0,0,0,0.25), 0 0 6px #FAE287 | `text-shadow: 0 4px 4px rgba(0,0,0,0.25), 0 0 6px #FAE287` |

**Profile Icon (User):**
| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | I666:9728;666:9277;186:1498 | - |
| **Component ID** | 186:1611 | User/person icon |
| width | 24px | `width: 24px` |
| height | 24px | `height: 24px` |

**States:**
| State | Changes |
|-------|---------|
| Active | background: rgba(255, 234, 158, 0.1), text-shadow: glow |
| Hover | background: rgba(255, 234, 158, 0.15) (predicted) |

---

### Dashboard Menu Item - `A.2_Dashboard`

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | I666:9728;666:9452 | - |
| width | 153px | `width: 153px` |
| height | 56px | `height: 56px` |
| padding | 16px | `padding: 16px` |
| background | transparent | `background-color: transparent` |
| border-radius | 4px | `border-radius: 4px` |
| display | flex | `display: flex` |
| align-items | center | `align-items: center` |
| justify-content | flex-start | `justify-content: flex-start` |
| gap | 4px | `gap: 4px` |
| cursor | pointer | `cursor: pointer` |

**Dashboard Text Style:**
| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | I666:9728;666:9452;186:1439 | - |
| font-family | Montserrat | `font-family: 'Montserrat', sans-serif` |
| font-size | 16px | `font-size: 16px` |
| font-weight | 700 | `font-weight: 700` |
| line-height | 24px | `line-height: 24px` |
| letter-spacing | 0.15px | `letter-spacing: 0.15px` |
| color | #FFFFFF | `color: #FFFFFF` |
| text-align | center | `text-align: center` |

**Dashboard Icon (Grid):**
| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | I666:9728;666:9452;186:1441 | - |
| **Component ID** | 662:10350 | Dashboard/grid icon |
| width | 24px | `width: 24px` |
| height | 24px | `height: 24px` |

**States:**
| State | Changes |
|-------|---------|
| Default | background: transparent, no text glow |
| Hover | background: rgba(255, 234, 158, 0.1) (predicted) |
| Active | background: rgba(255, 234, 158, 0.1), text-shadow: glow |

---

### Logout Menu Item - `A.3_Logout`

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | I666:9728;666:9278 | - |
| width | 153px | `width: 153px` |
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
| **Node ID** | I666:9728;666:9278;186:1439 | - |
| font-family | Montserrat | `font-family: 'Montserrat', sans-serif` |
| font-size | 16px | `font-size: 16px` |
| font-weight | 700 | `font-weight: 700` |
| line-height | 24px | `line-height: 24px` |
| letter-spacing | 0.15px | `letter-spacing: 0.15px` |
| color | #FFFFFF | `color: #FFFFFF` |
| text-align | center | `text-align: center` |

**Logout Icon (Chevron Right):**
| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | I666:9728;666:9278;186:1441 | - |
| **Component ID** | 335:10890 | Chevron right icon |
| width | 24px | `width: 24px` |
| height | 24px | `height: 24px` |

**States:**
| State | Changes |
|-------|---------|
| Default | background: transparent, no text glow |
| Hover | background: rgba(255, 234, 158, 0.1) (predicted) |

---

## Component Hierarchy with Styles

```
Dropdown Container (666:9728)
  bg: #00070C, border: 1px solid #998C5F, radius: 8px, p: 6px
  display: flex, flex-col, items-start
  │
  ├── Profile Item (I666:9728;666:9277) [ACTIVE]
  │   bg: rgba(255,234,158,0.1), w: 151px, h: 56px, radius: 4px
  │   display: flex, items-center, gap: 4px, p: 16px
  │   │
  │   ├── Content Frame (I666:9728;666:9277;186:2012)
  │   │   flex, items-center, gap: 4px
  │   │   └── Text "Profile" (Montserrat 700 16px #FFF, text-shadow: glow)
  │   │
  │   └── User Icon (I666:9728;666:9277;186:1498) [24x24, white]
  │
  ├── Dashboard Item (I666:9728;666:9452) [DEFAULT]
  │   bg: transparent, w: 153px, h: 56px, radius: 4px
  │   display: flex, items-center, gap: 4px, p: 16px
  │   │
  │   ├── Content Frame (I666:9728;666:9452;186:1937)
  │   │   flex, items-center, gap: 4px
  │   │   └── Text "Dashboard" (Montserrat 700 16px #FFF)
  │   │
  │   └── Dashboard Icon (I666:9728;666:9452;186:1441) [24x24, white]
  │
  └── Logout Item (I666:9728;666:9278) [DEFAULT]
      bg: transparent, w: 153px, h: 56px, radius: 4px
      display: flex, items-center, gap: 4px, p: 16px
      │
      ├── Content Frame (I666:9728;666:9278;186:1937)
      │   flex, items-center, gap: 4px
      │   └── Text "Logout" (Montserrat 700 16px #FFF)
      │
      └── Chevron Right Icon (I666:9728;666:9278;186:1441) [24x24, white]
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

Compact dropdown component. Minimal responsive changes needed:

#### Mobile (< 640px)
| Component | Changes |
|-----------|---------|
| Dropdown | Same dimensions (compact enough for mobile) |
| Touch target | Items are 56px tall (exceeds 44px minimum) - compliant |
| Position | May reposition relative to trigger to fit viewport |

#### Tablet & Desktop (>= 640px)
| Component | Changes |
|-----------|---------|
| Dropdown | No changes needed |

---

## Icon Specifications

| Icon Name | Node ID / Component ID | Size | Color | Usage |
|-----------|----------------------|------|-------|-------|
| User/Person | 186:1611 | 24x24 | #FFFFFF | Profile menu item icon |
| Dashboard/Grid | 662:10350 | 24x24 | #FFFFFF | Dashboard menu item icon |
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
| Dropdown Container | 666:9728 | `flex flex-col p-1.5 bg-[#00070C] border border-[#998C5F] rounded-lg` | `<ProfileDropdown isAdmin />` |
| Profile Item (Active) | I666:9728;666:9277 | `flex items-center gap-1 w-full h-14 px-4 rounded bg-[rgba(255,234,158,0.1)]` | `<ProfileMenuItem active />` |
| Dashboard Item | I666:9728;666:9452 | `flex items-center gap-1 w-full h-14 px-4 rounded hover:bg-[rgba(255,234,158,0.1)]` | `<ProfileMenuItem />` |
| Logout Item | I666:9728;666:9278 | `flex items-center gap-1 w-full h-14 px-4 rounded hover:bg-[rgba(255,234,158,0.1)]` | `<ProfileMenuItem />` |
| Active Text | I666:9728;666:9277;186:1497 | `font-montserrat font-bold text-base text-white tracking-[0.15px] [text-shadow:0_4px_4px_rgba(0,0,0,0.25),0_0_6px_#FAE287]` | Text within item |
| Default Text | I666:9728;666:9452;186:1439 | `font-montserrat font-bold text-base text-white tracking-[0.15px]` | Text within item |
| User Icon | 186:1611 | `w-6 h-6 text-white` | `<Icon name="user" />` |
| Dashboard Icon | 662:10350 | `w-6 h-6 text-white` | `<Icon name="dashboard" />` |
| Chevron Icon | 335:10890 | `w-6 h-6 text-white` | `<Icon name="chevron-right" />` |

---

## Notes

- All colors should use CSS variables for theming support
- Prefer Tailwind utility classes as per project constitution (TailwindCSS 4.x)
- Font: Montserrat Bold must be loaded (consistent with all other dropdowns)
- Identical theme to regular Profile Dropdown but with an additional "Dashboard" item
- Items are slightly wider (~151-153px vs ~119-121px) to accommodate "Dashboard" text
- Icons positioned to the RIGHT of text labels (consistent with regular Profile Dropdown)
- All icons **MUST BE** in **Icon Component** instead of svg files or img tags
- Consider implementing as a single `<ProfileDropdown>` component that conditionally renders the "Dashboard" item based on user role (`isAdmin` prop)
