# Design Style: Language Dropdown

**Frame ID**: `721:4942`
**Frame Name**: `Dropdown-ngon-ngu`
**File Key**: `9ypp4enmFmdK3YAFJLIu6C`
**Extracted At**: 2026-03-13

---

## Design Tokens

### Colors

| Token Name | Hex Value | Opacity | Usage |
|------------|-----------|---------|-------|
| --color-dropdown-bg | #00070C | 100% | Dropdown container background (var: Details-Container-2) |
| --color-dropdown-border | #998C5F | 100% | Dropdown border (var: Details-Border) |
| --color-selected-bg | #FFEA9E | 20% | Selected item highlight background |
| --color-text-label | #FFFFFF | 100% | Language code text (VN, EN) |
| --color-frame-bg | #696969 | 100% | Frame/page background (context only) |

### Typography

| Token Name | Font Family | Size | Weight | Line Height | Letter Spacing |
|------------|-------------|------|--------|-------------|----------------|
| --text-lang-code | Montserrat | 16px | 700 (Bold) | 24px | 0.15px |

### Spacing

| Token Name | Value | Usage |
|------------|-------|-------|
| --spacing-dropdown-padding | 6px | Dropdown container inner padding |
| --spacing-item-padding | 16px | Language item internal padding |
| --spacing-icon-text-gap | 4px | Gap between flag icon and language code |
| --spacing-item-inner-gap | 2px | Button inner gap |

### Border & Radius

| Token Name | Value | Usage |
|------------|-------|-------|
| --radius-dropdown | 8px | Dropdown container border radius |
| --radius-item | 4px | Language item border radius |
| --radius-selected-bg | 2px | Selected item outer border radius |
| --border-dropdown | 1px solid #998C5F | Dropdown container border |

### Shadows

| Token Name | Value | Usage |
|------------|-------|-------|
| (none) | - | No shadows in this component |

---

## Layout Specifications

### Container (Dropdown)

| Property | Value | Notes |
|----------|-------|-------|
| width | auto (~122px content) | Fits content with padding |
| padding | 6px | All sides |
| background | #00070C | Dark background |
| border | 1px solid #998C5F | Gold-toned border |
| border-radius | 8px | Rounded corners |
| display | flex | Flex container |
| flex-direction | column | Vertical stack |
| align-items | flex-start | Left-aligned children |

### Layout Structure (ASCII)

```
┌─────────────────────────────────┐
│  Dropdown Container              │
│  (bg: #00070C, border: 1px      │
│   solid #998C5F, radius: 8px,   │
│   padding: 6px)                 │
│                                  │
│  ┌─────────────────────────────┐│
│  │ Selected Item (A.1)         ││
│  │ (110x56px, radius: 2px,    ││
│  │  bg: rgba(255,234,158,0.2)) ││
│  │  ┌──────────────────────┐   ││
│  │  │ Button (padding: 16px│   ││
│  │  │  radius: 4px)        │   ││
│  │  │ ┌────┐  ┌────┐      │   ││
│  │  │ │ 🇻🇳 │  │ VN │      │   ││
│  │  │ │24x24│  │    │      │   ││
│  │  │ └────┘  └────┘      │   ││
│  │  │   gap: 4px           │   ││
│  │  └──────────────────────┘   ││
│  └─────────────────────────────┘│
│                                  │
│  ┌─────────────────────────────┐│
│  │ Option Item (A.2)           ││
│  │ (110x56px, no bg highlight) ││
│  │  ┌──────────────────────┐   ││
│  │  │ Button (padding: 16px│   ││
│  │  │  radius: 4px)        │   ││
│  │  │ ┌────┐  ┌────┐      │   ││
│  │  │ │ 🇬🇧 │  │ EN │      │   ││
│  │  │ │24x24│  │    │      │   ││
│  │  │ └────┘  └────┘      │   ││
│  │  │   gap: 4px           │   ││
│  │  └──────────────────────┘   ││
│  └─────────────────────────────┘│
└─────────────────────────────────┘
```

---

## Component Style Details

### Trigger Button (Closed State)

> Extracted from the Login screen (`662:14387`) where the language trigger appears in the header at Node ID `I662:14391;186:1601`. Uses the same `Language` component instance (`186:1692`, Component Set: `186:1695`).

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | I662:14391;186:1601 | - |
| width | 108px | `width: 108px` |
| height | 56px | `height: 56px` |
| display | flex | `display: flex` |
| align-items | center | `align-items: center` |
| gap | 16px | `gap: 16px` |
| cursor | pointer | `cursor: pointer` |
| background | transparent | No background in closed state |

**Inner Button:**

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | I662:14391;186:1696;186:1821 | - |
| width | 108px | `width: 108px` |
| height | 56px | `height: 56px` |
| padding | 16px | `padding: 16px` |
| display | flex | `display: flex` |
| align-items | center | `align-items: center` |
| justify-content | space-between | `justify-content: space-between` |
| border-radius | 4px | `border-radius: 4px` |
| gap | 2px | `gap: 2px` |

**Content (Flag + Text):**

| Property | Value | CSS |
|----------|-------|-----|
| display | flex | `display: flex` |
| align-items | center | `align-items: center` |
| gap | 4px | `gap: 4px` |
| Content | Flag icon (24x24) + Language code ("VN"/"EN") | Same typography as items below |

**Chevron Down Arrow:**

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | I662:14391;186:1696;186:1821;186:1441 | - |
| width | 24px | `width: 24px` |
| height | 24px | `height: 24px` |
| Component | Down arrow icon | `186:1862` (Set: `178:1020`) |
| color | #FFFFFF | White icon |
| position | Right side of button (justify-content: space-between) | After flag+text content |

**States:**

| State | Changes |
|-------|---------|
| Default | background: transparent, chevron points down |
| Hover | background: rgba(255, 234, 158, 0.1), cursor: pointer |
| Open | Dropdown panel visible, chevron may rotate 180deg (implementation detail) |
| Focus | outline: 2px solid #998C5F, outline-offset: -2px |

---

### Dropdown Container - `A_Dropdown-List`

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | 525:11713 | - |
| display | flex | `display: flex` |
| flex-direction | column | `flex-direction: column` |
| align-items | flex-start | `align-items: flex-start` |
| padding | 6px | `padding: 6px` |
| background | #00070C | `background-color: #00070C` |
| border | 1px solid #998C5F | `border: 1px solid #998C5F` |
| border-radius | 8px | `border-radius: 8px` |
| position | absolute | Overlay positioned |

**Component ID**: `362:6179` (Component Set: `563:8216`)

---

### Selected Language Item - `A.1_tieng-Viet`

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | I525:11713;362:6085 | - |
| width | 110px | `width: 110px` *(normalized from 108px in Figma for consistency with A.2)* |
| height | 56px | `height: 56px` |
| display | flex | `display: flex` |
| align-items | center | `align-items: center` |
| border-radius | 2px | `border-radius: 2px` |
| background | rgba(255, 234, 158, 0.2) | `background-color: rgba(255, 234, 158, 0.2)` |

**Inner Button:**

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | I525:11713;362:6085;186:1821 | - |
| width | 110px | `width: 110px` *(normalized)* |
| height | 56px | `height: 56px` |
| padding | 16px | `padding: 16px` |
| display | flex | `display: flex` |
| align-items | center | `align-items: center` |
| justify-content | space-between | `justify-content: space-between` |
| border-radius | 4px | `border-radius: 4px` |
| gap | 2px | `gap: 2px` |

**Content Frame (Flag + Text):**

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | I525:11713;362:6085;186:1821;186:1937 | - |
| display | flex | `display: flex` |
| align-items | center | `align-items: center` |
| gap | 4px | `gap: 4px` |
| width | 53px | `width: 53px` |
| height | 24px | `height: 24px` |

**Flag Icon:**

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | I525:11713;362:6085;186:1821;186:1709 | - |
| width | 24px | `width: 24px` |
| height | 24px | `height: 24px` |
| Component | VN - Vietnam flag | `178:1019` (Set: `178:1020`) |

**Language Code Text ("VN"):**

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | I525:11713;362:6085;186:1821;186:1439 | - |
| font-family | Montserrat | `font-family: 'Montserrat', sans-serif` |
| font-size | 16px | `font-size: 16px` |
| font-weight | 700 | `font-weight: 700` |
| line-height | 24px | `line-height: 24px` |
| letter-spacing | 0.15px | `letter-spacing: 0.15px` |
| color | #FFFFFF | `color: #FFFFFF` |
| text-align | center | `text-align: center` |
| width | 25px | `width: 25px` |
| character | "VN" | - |

**States:**

| State | Changes |
|-------|---------|
| Selected | background: rgba(255, 234, 158, 0.2) — golden highlight |
| Default | background: transparent |
| Hover | background: rgba(255, 234, 158, 0.1) *(derived from selected state at half opacity)* |
| Focus | outline: 2px solid #998C5F, outline-offset: -2px *(predicted — for keyboard navigation)* |

**Component ID**: `186:1692` (Component Set: `186:1695`)

---

### Option Language Item - `A.2_tieng-Anh`

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | I525:11713;362:6128 | - |
| width | 110px | `width: 110px` |
| height | 56px | `height: 56px` |
| display | flex | `display: flex` |
| align-items | center | `align-items: center` |
| justify-content | center | `justify-content: center` |
| border-radius | 0px | `border-radius: 0` |
| background | transparent | No background (unselected state) |

**Inner Button:**

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | I525:11713;362:6128;186:1903 | - |
| width | 110px | `width: 110px` |
| height | 56px | `height: 56px` |
| padding | 16px | `padding: 16px` |
| display | flex | `display: flex` |
| align-items | center | `align-items: center` |
| justify-content | space-between | `justify-content: space-between` |
| border-radius | 4px | `border-radius: 4px` |

**Content Frame (Flag + Text):**

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | I525:11713;362:6128;186:1903;186:1937 | - |
| display | flex | `display: flex` |
| align-items | center | `align-items: center` |
| gap | 4px | `gap: 4px` |
| width | 52px | `width: 52px` |
| height | 24px | `height: 24px` |

**Flag Icon:**

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | I525:11713;362:6128;186:1903;186:1709 | - |
| width | 24px | `width: 24px` |
| height | 24px | `height: 24px` |
| Component | United Kingdom (GB) flag | `178:967` (Set: `178:1020`) |

**Language Code Text ("EN"):**

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | I525:11713;362:6128;186:1903;186:1439 | - |
| font-family | Montserrat | `font-family: 'Montserrat', sans-serif` |
| font-size | 16px | `font-size: 16px` |
| font-weight | 700 | `font-weight: 700` |
| line-height | 24px | `line-height: 24px` |
| letter-spacing | 0.15px | `letter-spacing: 0.15px` |
| color | #FFFFFF | `color: #FFFFFF` |
| text-align | center | `text-align: center` |
| width | 24px | `width: 24px` |
| character | "EN" | - |

**States:**

| State | Changes |
|-------|---------|
| Default | background: transparent |
| Hover | background: rgba(255, 234, 158, 0.1) *(derived from selected state at half opacity)* |
| Selected | background: rgba(255, 234, 158, 0.2) — becomes the selected item |
| Focus | outline: 2px solid #998C5F, outline-offset: -2px *(predicted — for keyboard navigation)* |

**Component ID**: `186:1694` (Component Set: `186:1695`)

---

## Component Hierarchy with Styles

```
Dropdown-ngon-ngu (721:4942, bg: #696969, 215x304px)
└── A_Dropdown-List (525:11713, bg: #00070C, border: 1px solid #998C5F, radius: 8px, p: 6px)
    ├── A.1_tieng-Viet [SELECTED] (I525:11713;362:6085, 110x56px, bg: rgba(255,234,158,0.2), radius: 2px)
    │   └── Button (p: 16px, flex, items-center, justify-between, radius: 4px)
    │       └── Content (flex, items-center, gap: 4px)
    │           ├── Flag IC: VN - Vietnam (24x24px, Component: 178:1019)
    │           └── Text: "VN" (Montserrat 700 16px/24px, #FFF, ls: 0.15px)
    │
    └── A.2_tieng-Anh [OPTION] (I525:11713;362:6128, 110x56px, bg: transparent)
        └── Button (p: 16px, flex, items-center, justify-between, radius: 4px)
            └── Content (flex, items-center, gap: 4px)
                ├── Flag IC: United Kingdom (GB) (24x24px, Component: 178:967)
                └── Text: "EN" (Montserrat 700 16px/24px, #FFF, ls: 0.15px)
```

---

## Responsive Specifications

### Breakpoints

| Name | Min Width | Max Width |
|------|-----------|-----------|
| Mobile | 0 | < 640px (`sm:`) |
| Tablet | 640px (`sm:`) | < 1024px (`lg:`) |
| Desktop | 1024px (`lg:`) | infinity |

### Responsive Changes

This is a small, overlay-positioned dropdown component. Its dimensions remain consistent across breakpoints. Key considerations:

#### Mobile (< 640px)
| Component | Changes |
|-----------|---------|
| Dropdown | Ensure touch targets >= 44x44px (items are 56px tall - compliant) |
| Position | May need adjustment to avoid overflow off-screen |

#### Tablet & Desktop (>= 640px)
| Component | Changes |
|-----------|---------|
| Dropdown | No changes - same dimensions |

---

## Icon Specifications

| Icon Name | Size | Source | Usage |
|-----------|------|--------|-------|
| VN Flag (Vietnam) | 20x15px (in 24x24 container) | Figma Component `178:1019` (Set: `178:1020`) | Vietnamese language option |
| United Kingdom Flag | 20x15px (in 24x24 container) | Figma Component `178:967` (Set: `178:1020`) | English language option |
| Chevron Down | 24x24px | Figma Component `186:1862` (Set: `178:1020`) | Trigger button dropdown indicator |

---

## Animation & Transitions

| Element | Property | Duration | Easing | Trigger |
|---------|----------|----------|--------|---------|
| Dropdown | opacity, transform | 150ms | ease-out | Open/Close toggle |
| Language Item | background-color | 150ms | ease-in-out | Hover |
| Chevron Icon | transform (rotate) | 150ms | ease-out | Dropdown Open/Close |

---

## Implementation Mapping

| Design Element | Figma Node ID | Tailwind / CSS Class | React Component |
|----------------|---------------|---------------------|-----------------|
| Trigger Button | I662:14391;186:1601 | `flex items-center gap-4 p-4 cursor-pointer rounded` | `<LanguageDropdown />` (closed state) |
| Chevron Icon | 186:1441 | `w-6 h-6 text-white transition-transform` | `<ChevronDown />` |
| Dropdown Container | 525:11713 | `flex flex-col p-1.5 bg-[#00070C] border border-[#998C5F] rounded-lg` | `<LanguageDropdown />` (open state) |
| Selected Item | I525:11713;362:6085 | `flex items-center w-[110px] h-14 rounded-sm bg-[rgba(255,234,158,0.2)]` | `<LanguageOption selected />` |
| Option Item | I525:11713;362:6128 | `flex items-center w-[110px] h-14` | `<LanguageOption />` |
| Item Button | 186:1821 / 186:1903 | `flex items-center justify-between p-4 rounded` | (inner element) |
| Flag Icon | 178:1019 / 178:967 | `w-6 h-6` | `<FlagIcon code="VN" />` |
| Language Code | 186:1439 | `font-montserrat text-base font-bold leading-6 tracking-[0.15px] text-white text-center` | `<span>` |

---

## Notes

- All colors should use CSS variables for theming support where applicable
- The gold-toned border (#998C5F) and selected highlight (rgba(255,234,158,0.2)) are part of the project's "Details" design token family
- Flag icons use a shared component set (`178:1020`) — implementation should use a single `FlagIcon` component with a country code prop
- Font: Montserrat must be loaded (already in project via `public/fonts/` or Google Fonts)
- Ensure WCAG AA contrast: white text (#FFF) on dark background (#00070C) passes (contrast ratio ~19:1)
- **Width normalized**: A.1 was 108px and A.2 was 110px in Figma. Both normalized to 110px for consistent alignment.
- **Hover color**: `rgba(255, 234, 158, 0.1)` — derived from the selected state color at half opacity, consistent with the golden design language.
- **Trigger button** includes a chevron down arrow icon (Component `186:1862`) not present in the dropdown-only frame (`721:4942`). Extracted from Login screen (`662:14387`).
