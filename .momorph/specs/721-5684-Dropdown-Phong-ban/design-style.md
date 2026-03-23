# Design Style: Department Dropdown

**Frame ID**: `721:5684`
**Frame Name**: `Dropdown Phòng ban`
**Figma Link**: https://www.figma.com/file/9ypp4enmFmdK3YAFJLIu6C?node-id=721:5684
**Extracted At**: 2026-03-10

---

## Design Tokens

### Colors

| Token Name | Hex Value | Opacity | Usage |
|------------|-----------|---------|-------|
| --color-dropdown-bg | #00070C | 100% | Dropdown container background |
| --color-dropdown-border | #998C5F | 100% | Dropdown container border (gold/amber) |
| --color-selected-bg | rgba(255, 234, 158, 0.1) | 10% | Selected item background highlight |
| --color-text-white | #FFFFFF | 100% | Department code text |
| --color-text-glow | rgba(250, 226, 135, 1) | - | Selected text glow (#FAE287) |
| --color-text-shadow | rgba(0, 0, 0, 0.25) | 25% | Text shadow on selected item |
| --color-frame-bg | #696969 | 100% | Outer frame background (context only) |

### Typography

| Token Name | Font Family | Size | Weight | Line Height | Letter Spacing |
|------------|-------------|------|--------|-------------|----------------|
| --text-dept-code | Montserrat | 16px | 700 (Bold) | 24px | 0.5px |

### Spacing

| Token Name | Value | Usage |
|------------|-------|-------|
| --spacing-dropdown-padding | 6px | Dropdown container inner padding |
| --spacing-item-padding | 16px | Department item internal padding |
| --spacing-item-gap | 4px | Gap within content frame |

### Border & Radius

| Token Name | Value | Usage |
|------------|-------|-------|
| --radius-dropdown | 8px | Dropdown container border radius |
| --radius-item | 4px | Individual department item border radius |
| --border-dropdown | 1px solid #998C5F | Dropdown container border |

### Shadows

| Token Name | Value | Usage |
|------------|-------|-------|
| --shadow-selected-text | 0 4px 4px rgba(0, 0, 0, 0.25), 0 0 6px #FAE287 | Selected item text glow effect |

---

## Layout Specifications

### Container (Dropdown)

| Property | Value | Notes |
|----------|-------|-------|
| width | auto (min: 102px, adapts to longest item) | `width: auto; min-width: 102px; white-space: nowrap` — widens for long names like "CEVC1 - DSV - UI/UX 1" |
| padding | 6px | All sides |
| background | #00070C | Dark background |
| border | 1px solid #998C5F | Gold/amber border |
| border-radius | 8px | Rounded corners |
| display | flex | Flex container |
| flex-direction | column | Vertical stack |
| align-items | flex-start | Left aligned |
| max-height | 400px | ~7 items visible (56px × 7 + padding), scroll for rest |
| overflow-y | auto | Scrollbar when content exceeds max-height |

### Department Item

| Property | Value | Notes |
|----------|-------|-------|
| width | 100% | Fill container width (`w-full`). Figma shows ~90-91px (hug) but in implementation items MUST stretch to fill the dropdown container for consistent click targets. |
| height | 56px | Fixed height |
| padding | 16px | All sides |
| border-radius | 4px | Slight rounding |
| display | flex | Flex container |
| flex-direction | row | Horizontal layout |
| align-items | center | Vertically centered |
| justify-content | flex-start | Left aligned |
| gap | 4px | Internal content gap |

### Layout Structure (ASCII)

```
┌─────────────────────────────────────────────┐
│  Dropdown Container                         │
│  (bg: #00070C, border: 1px #998C5F)        │
│  (padding: 6px, radius: 8px)               │
│  (flex, flex-col, max-h: 400px, scroll)    │
│                                             │
│  ┌─────────────────────────────────────┐    │
│  │  Item 0 - "Tất cả" [SELECTED]      │    │  ← default selection
│  │  (bg: rgba(255,234,158,0.1))       │    │
│  │  (w: 100%, h: 56px, p: 16px)      │    │
│  │  (radius: 4px)                      │    │
│  │  ┌─────────────┐                    │    │
│  │  │ "Tất cả"    │ glow text         │    │
│  │  │ 16px bold   │                    │    │
│  │  └─────────────┘                    │    │
│  └─────────────────────────────────────┘    │
│                                             │
│  ┌─────────────────────────────────────┐    │
│  │  Item 1 - BDV                       │    │  ← alphabetical start
│  │  (bg: transparent)                  │    │
│  │  (w: 100%, h: 56px, p: 16px)      │    │
│  │  ┌─────────────┐                    │    │
│  │  │ "BDV"       │ white text        │    │
│  │  └─────────────┘                    │    │
│  └─────────────────────────────────────┘    │
│                                             │
│  ┌─────────────────────────────────────┐    │
│  │  Item 2 - CEVC1                     │    │
│  │  (same as BDV)                      │    │
│  └─────────────────────────────────────┘    │
│                                             │
│  │  ... (~47 more, alphabetically)     │    │
│                                             │
│  ┌─────────────────────────────────────┐    │
│  │  Item N - STVC - R&D - SDX         │    │  ← alphabetical end
│  │  (same as BDV)                      │    │
│  └─────────────────────────────────────┘    │
│                                             │
└─────────────────────────────────────────────┘
```

---

## Component Style Details

### Dropdown Trigger Button (Closed State)

The Figma frame shows only the open dropdown state. The trigger button styling follows the **confirmed** language dropdown pattern (shared component set `186:1426`):

| Property | Value | CSS |
|----------|-------|-----|
| display | inline-flex | `display: inline-flex` |
| align-items | center | `align-items: center` |
| padding | 16px | `padding: 16px` |
| background | #00070C | `background-color: #00070C` |
| border | 1px solid #998C5F | `border: 1px solid #998C5F` |
| border-radius | 8px | `border-radius: 8px` |
| cursor | pointer | `cursor: pointer` |
| min-width | 102px | `min-width: 102px` |

**Trigger Text Style:** Same as department code text (Montserrat 700 16px #FFF, letter-spacing 0.5px). Displays the currently selected department code.

**Trigger Icon:** A chevron-down icon (▼) to indicate expandable dropdown, positioned after the text. Rotates 180° when open.

**States:**
| State | Changes |
|-------|---------|
| Default | As specified above |
| Hover | `border-color: #FFEA9E` (brighter gold) |
| Focus | `outline: none`, `ring: 2px solid #998C5F` with 2px offset (visible keyboard focus) |
| Open | Chevron rotated 180°, border remains #998C5F |
| Disabled | `opacity: 0.5`, `cursor: not-allowed`, no hover/focus effects |
| Loading | Skeleton pulse animation replacing text content, disabled interactions |

---

### Dropdown Container - `A_Dropdown-List`

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | 563:8027 | - |
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
| Closed | Only trigger button visible (shows selected department code) |
| Open | Full dropdown with all department options visible, scrollable if needed |

---

### "Tất cả" (All) Option — First Item

A virtual option at the top of the department list, not from Figma. Follows the same styling as department items but displays "Tất cả" text. When selected, it uses the selected state styling (glow effect). When deselected, it uses the default state. Visually identical to other department options — no separator or special treatment.

---

### Selected Department Item - `A.1_Phòng ban 1` (CEVC2)

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | I563:8027;563:7956 | - |
| width | 100% | `width: 100%` (Figma: 90px hug, but stretch to fill container) |
| height | 56px | `height: 56px` |
| padding | 16px | `padding: 16px` |
| background | rgba(255, 234, 158, 0.1) | `background-color: rgba(255, 234, 158, 0.1)` |
| border-radius | 4px | `border-radius: 4px` |
| display | flex | `display: flex` |
| align-items | center | `align-items: center` |
| justify-content | flex-start | `justify-content: flex-start` |
| gap | 4px | `gap: 4px` |
| cursor | pointer | `cursor: pointer` |

**Selected Text Style:**
| Property | Value | CSS |
|----------|-------|-----|
| font-family | Montserrat | `font-family: 'Montserrat', sans-serif` |
| font-size | 16px | `font-size: 16px` |
| font-weight | 700 | `font-weight: 700` |
| line-height | 24px | `line-height: 24px` |
| letter-spacing | 0.5px | `letter-spacing: 0.5px` |
| color | #FFFFFF | `color: #FFFFFF` |
| text-align | center | `text-align: center` |
| text-shadow | 0 4px 4px rgba(0,0,0,0.25), 0 0 6px #FAE287 | `text-shadow: 0 4px 4px rgba(0,0,0,0.25), 0 0 6px #FAE287` |

**States:**
| State | Changes |
|-------|---------|
| Selected | background: `rgba(255, 234, 158, 0.1)`, text-shadow: glow effect |
| Selected + Hover | background: `rgba(255, 234, 158, 0.15)` *(confirmed — same as language dropdown pattern)* |
| Focus (keyboard) | `outline: 2px solid #998C5F`, `outline-offset: -2px` (inset focus ring) |

---

### Default Department Item - `A.2_Phòng ban 2` (CEVC3)

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | I563:8027;563:7957 | - |
| width | 100% | `width: 100%` (Figma: 90px hug, but stretch to fill container) |
| height | 56px | `height: 56px` |
| padding | 16px | `padding: 16px` |
| background | transparent | `background-color: transparent` |
| border-radius | 4px | `border-radius: 4px` |
| display | flex | `display: flex` |
| align-items | center | `align-items: center` |
| justify-content | flex-start | `justify-content: flex-start` |
| gap | 4px | `gap: 4px` |
| cursor | pointer | `cursor: pointer` |

**Default Text Style:**
| Property | Value | CSS |
|----------|-------|-----|
| font-family | Montserrat | `font-family: 'Montserrat', sans-serif` |
| font-size | 16px | `font-size: 16px` |
| font-weight | 700 | `font-weight: 700` |
| line-height | 24px | `line-height: 24px` |
| letter-spacing | 0.5px | `letter-spacing: 0.5px` |
| color | #FFFFFF | `color: #FFFFFF` |
| text-align | center | `text-align: center` |
| text-shadow | none | - |

**States:**
| State | Changes |
|-------|---------|
| Default | background: transparent, no text glow |
| Hover | background: `rgba(255, 234, 158, 0.1)` *(confirmed — same as language dropdown pattern)* |
| Focus (keyboard) | `outline: 2px solid #998C5F`, `outline-offset: -2px` (inset focus ring) |
| Selected | background: `rgba(255, 234, 158, 0.1)`, text-shadow: glow (transitions to selected item style) |

---

### Additional Department Items

Items A.3 through A.6 follow the same style as A.2 (default state). All use `width: 100%` in implementation (Figma shows ~91px hug width):

| Item | Node ID | Text | Figma Width |
|------|---------|------|-------------|
| A.3 | I563:8027;563:7958 | CEVC4 | 91px (hug) |
| A.4 | I563:8027;563:7959 | CEVC1 | 91px (hug) |
| A.5 | I563:8027;563:7960 | OPD | 91px (hug) |
| A.6 | I563:8027;563:7961 | Infra | 91px (hug) |

---

## Component Hierarchy with Styles

```
Dropdown Container (563:8027)
  bg: #00070C, border: 1px solid #998C5F, radius: 8px, p: 6px
  display: flex, flex-col, items-start
  max-h: 400px, overflow-y: auto
  │
  ├── "Tất cả" Item (virtual, not from Figma) [SELECTED by default]
  │   Same styling as department items (selected or default state)
  │   │
  │   └── Text "Tất cả" (Montserrat 700 16px #FFF, text-shadow: glow if selected)
  │
  ├── Dept Item - BDV [DEFAULT] (sorted alphabetically)
  │   bg: transparent, w: 100%, h: 56px, radius: 4px
  │   │
  │   └── Text "BDV" (Montserrat 700 16px #FFF)
  │
  ├── Dept Item - CEVC1 [DEFAULT]
  │   (same structure)
  │
  ├── Dept Item - CEVC2 [DEFAULT]
  │   (same structure)
  │
  ├── ... (~47 more items, alphabetically sorted by code)
  │
  └── Dept Item - STVC - R&D - SDX [DEFAULT]
      (same structure)
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

This is a compact dropdown component. Responsive considerations:

#### Mobile (< 640px)
| Component | Changes |
|-----------|---------|
| Dropdown | max-height constraint with scroll for long department list |
| Touch target | Items are 56px tall (exceeds 44px minimum) - compliant |
| Width | `min-width: 102px`, `width: auto` — adapts to longest item, no truncation (see TR-005) |

#### Tablet & Desktop (>= 640px)
| Component | Changes |
|-----------|---------|
| Dropdown | No significant changes, already compact |
| Scroll | max-height with overflow-y: auto for ~50 departments |

---

## Scrollbar Styling

The dropdown list contains ~50 departments, requiring a custom scrollbar that fits the dark theme:

| Property | Value | CSS |
|----------|-------|-----|
| scrollbar-width | thin | `scrollbar-width: thin` |
| scrollbar-color | #998C5F #00070C | `scrollbar-color: #998C5F #00070C` (thumb / track) |
| webkit-scrollbar width | 6px | `::-webkit-scrollbar { width: 6px }` |
| webkit-scrollbar-thumb | #998C5F, rounded | `::-webkit-scrollbar-thumb { background: #998C5F; border-radius: 3px }` |
| webkit-scrollbar-track | transparent | `::-webkit-scrollbar-track { background: transparent }` |

---

## Animation & Transitions

| Element | Property | Duration | Easing | Trigger |
|---------|----------|----------|--------|---------|
| Dropdown | opacity, transform | 150ms | ease-out | Open/Close toggle |
| Chevron Icon | transform (rotate) | 150ms | ease-out | Open/Close toggle (0° → 180°) |
| Department Item | background-color | 150ms | ease-in-out | Hover |
| Selected Text | text-shadow | 150ms | ease-in-out | Selection change |

---

## Implementation Mapping

| Design Element | Figma Node ID | Tailwind / CSS Class | React Component |
|----------------|---------------|---------------------|-----------------|
| Dropdown Trigger (Closed) | — (inferred) | `inline-flex items-center gap-2 px-4 py-4 bg-[#00070C] border border-[#998C5F] rounded-lg cursor-pointer min-w-[102px] font-montserrat font-bold text-base text-white tracking-[0.5px] focus:ring-2 focus:ring-[#998C5F]` | `<DepartmentDropdown />` (trigger part) |
| "Tất cả" Option | — (virtual) | Same as `<DepartmentOption />` — uses selected/default variant based on state | `<DepartmentOption code="all" label="Tất cả" />` |
| Dropdown Container (Open) | 563:8027 | `flex flex-col p-1.5 bg-[#00070C] border border-[#998C5F] rounded-lg max-h-[400px] overflow-y-auto min-w-[102px] w-auto scrollbar-thin scrollbar-thumb-[#998C5F] scrollbar-track-transparent` | `<DepartmentDropdown />` (list part) |
| Dept Item (Selected) | I563:8027;563:7956 | `flex items-center gap-1 w-full h-14 px-4 rounded bg-[rgba(255,234,158,0.1)] focus:outline-2 focus:outline-[#998C5F] focus:-outline-offset-2` | `<DepartmentOption selected />` |
| Dept Item (Default) | I563:8027;563:7957 | `flex items-center gap-1 w-full h-14 px-4 rounded hover:bg-[rgba(255,234,158,0.1)] focus:outline-2 focus:outline-[#998C5F] focus:-outline-offset-2` | `<DepartmentOption />` |
| Dept Code Text (Selected) | I563:8027;563:7956;186:1497 | `font-montserrat font-bold text-base text-white tracking-[0.5px] [text-shadow:0_4px_4px_rgba(0,0,0,0.25),0_0_6px_#FAE287]` | Text within option |
| Dept Code Text (Default) | I563:8027;563:7957;186:1439 | `font-montserrat font-bold text-base text-white tracking-[0.5px]` | Text within option |
| Chevron Icon | — (inferred) | `w-4 h-4 text-white transition-transform duration-150` (rotate-180 when open) | Icon within trigger |

---

## Notes

- All colors should use CSS variables for theming support
- Prefer Tailwind utility classes as per project constitution (TailwindCSS 4.x)
- Font: Montserrat Bold must be loaded (consistent with language dropdown)
- The dropdown uses the same dark theme as the Language Dropdown (#00070C bg, #998C5F border)
- **Key difference from Language Dropdown**: text-only items (no flag icons), glowing text-shadow on selected item
- The selected item uses a slightly lower opacity highlight (0.1 vs 0.2 in language dropdown)
- With ~50 departments, the dropdown MUST be scrollable (`max-height` + `overflow-y: auto`)
- All icons **MUST BE** in **Icon Component** instead of svg files or img tags
- Department items share the same Figma component set (`186:1426`) as the language dropdown buttons, suggesting a shared base component
