# Design Style: Dropdown List Hashtag (Multi-Select)

**Frame ID**: `1002:13013`
**Frame Name**: `Dropdown list hashtag`
**Figma Link**: `https://www.figma.com/design/9ypp4enmFmdK3YAFJLIu6C?node-id=1002:13013`
**Extracted At**: 2026-03-09

---

## Design Tokens

### Colors

| Token Name | Hex Value | Opacity | Usage |
|------------|-----------|---------|-------|
| --color-trigger-bg | #FFFFFF | 100% | Trigger button background |
| --color-trigger-border | #998C5F | 100% | Trigger button border (gold/brown) |
| --color-trigger-text | #999999 | 100% | Trigger button label text |
| --color-dropdown-bg | #00070C | 100% | Dropdown container background (very dark blue-black) |
| --color-dropdown-border | #998C5F | 100% | Dropdown container border (gold/brown) |
| --color-item-selected-bg | rgba(255, 234, 158, 0.20) | 20% | Selected item background (subtle gold tint) |
| --color-item-hover-bg | rgba(255, 234, 158, 0.10) | 10% | Item hover background (**predicted**, subtler gold) |
| --color-text-hashtag | #FFFFFF | 100% | Hashtag item text (both states) |
| --color-check-icon | #FFFFFF | 100% | Checkmark icon color for selected state |

### Typography

| Token Name | Font Family | Size | Weight | Line Height | Letter Spacing | Usage |
|------------|-------------|------|--------|-------------|----------------|-------|
| --text-trigger-label | Montserrat | 11px | 700 | 16px | 0.5px | Trigger button label ("Hashtag / Tối đa 5") |
| --text-hashtag | Montserrat | 16px | 700 | 24px | 0.15px | All hashtag item text (both states) |

### Spacing

| Token Name | Value | Usage |
|------------|-------|-------|
| --spacing-trigger-padding | 4px 8px | Trigger button internal padding |
| --spacing-trigger-gap | 8px | Gap between icon and text inside trigger |
| --spacing-trigger-text-gap | 4px | Gap between label lines inside trigger text area |
| --spacing-dropdown-padding | 6px | Dropdown container internal padding (all sides) |
| --spacing-item-padding-x | 16px | Item horizontal padding (left and right) |
| --spacing-item-padding-y | 0px | Item vertical padding (centered via flexbox) |
| --spacing-item-gap | 0px | Gap between items (items are flush, no gap) |
| --spacing-item-internal-gap | 2px | Gap between hashtag text and check icon |
| --spacing-trigger-dropdown-gap | 6px | Vertical gap between trigger bottom and dropdown top |

### Border & Radius

| Token Name | Value | Usage |
|------------|-------|-------|
| --radius-trigger | 8px | Trigger button border radius |
| --radius-dropdown | 8px | Dropdown container border radius |
| --radius-item-selected | 2px | Selected item border radius |
| --radius-item-default | 0px | Default (unselected) item border radius |
| --border-trigger | 1px solid #998C5F | Trigger button border |
| --border-dropdown | 1px solid #998C5F | Dropdown container border |

### Shadows & Effects

| Token Name | Value | Usage |
|------------|-------|-------|
| --shadow-dropdown | none | Dropdown container has no box-shadow in design |

---

## Layout Specifications

### Trigger Button

| Property | Value | Notes |
|----------|-------|-------|
| width | 116px (hug content) | Adapts to label text |
| height | 48px | Fixed height |
| padding | 4px 8px | Internal padding |
| border | 1px solid #998C5F | Gold border |
| border-radius | 8px | Rounded corners |
| background | #FFFFFF | White background |
| display | flex | Flexbox layout |
| align-items | center | Vertically centered |
| gap | 8px | Between icon and text |

### Trigger Button Content

| Element | Size | Notes |
|---------|------|-------|
| Plus icon (MM_MEDIA_Plus) | 24×24px | Left side of trigger |
| Label text area | ~100×38px | Right side, two lines: "Hashtag" + "Tối đa 5" |

### Dropdown Container

| Property | Value | Notes |
|----------|-------|-------|
| width | 318px | Fixed width from design |
| padding | 6px | All sides |
| border | 1px solid #998C5F | Gold border |
| border-radius | 8px | Rounded corners |
| background | #00070C | Very dark background |
| max-height | 340px | ~8 items visible (8×40px + 12px padding); scrollable beyond |
| display | flex | Flexbox layout |
| flex-direction | column | Vertical stack |
| align-items | flex-start | Left-aligned children |
| overflow-y | auto | Scroll when content exceeds max-height |

### Hashtag Item (Both States)

| Property | Value | Notes |
|----------|-------|-------|
| width | 306px (fill parent minus padding) | Fills container width |
| height | 40px | Fixed height |
| padding | 0 16px | Horizontal padding only |
| display | flex | Flexbox layout |
| align-items | center | Vertically centered |
| flex-direction | row | Horizontal layout |
| justify-content | flex-start | Left-aligned |
| gap | 2px | Between text and icon |

### Layout Structure (ASCII)

```
┌──────────────────────────────────────────────┐
│  Trigger Button (116×48px, bg: #FFF,          │
│  border: 1px #998C5F, radius: 8px, p: 4px 8px)│
│  ┌──────┐  ┌───────────────────────┐          │
│  │  +   │  │  Hashtag              │          │
│  │ 24×24│  │  Tối đa 5             │          │
│  └──────┘  │  (Montserrat 11/700)  │          │
│            └───────────────────────┘          │
└──────────────────────────────────────────────┘
         ↓ (6px gap, left-aligned with trigger)
┌──────────────────────────────────────────────────────────┐
│  Dropdown Container (318px, bg: #00070C,                  │
│  border: 1px #998C5F, radius: 8px, p: 6px)               │
│                                                           │
│  ┌────────────────────────────────────────────────────┐  │
│  │  A: Selected Item (306×40px, radius: 2px,          │  │
│  │     bg: rgba(255,234,158,0.20), px: 16px)          │  │
│  │  "#High-perorming" .......................... ✓    │  │
│  └────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────┐  │
│  │  B: Selected Item (same styling)                   │  │
│  │  "#BE PROFESSIONAL" ......................... ✓    │  │
│  └────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────┐  │
│  │  C: Selected Item (same styling)                   │  │
│  │  "#BE OPTIMISTIC" ........................... ✓    │  │
│  └────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────┐  │
│  │  D: Default Item (306×40px, radius: 0px,           │  │
│  │     bg: transparent, px: 16px)                     │  │
│  │  "#BE A TEAM"                                      │  │
│  └────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────┐  │
│  │  E: Default Item                                   │  │
│  │  "#THINK OUTSIDE THE BOX"                          │  │
│  └────────────────────────────────────────────────────┘  │
│  ... (scrollable for remaining items)                    │
└──────────────────────────────────────────────────────────┘
```

---

## Component Style Details

### Trigger Button

| Property | Value | CSS / Tailwind |
|----------|-------|----------------|
| **Node ID** | `1002:15115` | - |
| **Component ID** | `186:2757` (instance of set `186:1426`) | - |
| width | hug content (~116px) | `w-auto` |
| height | 48px | `h-12` |
| padding | 4px 8px | `px-2 py-1` |
| background | #FFFFFF | `bg-white` |
| border | 1px solid #998C5F | `border border-[#998C5F]` |
| border-radius | 8px | `rounded-lg` |
| display | flex | `flex` |
| align-items | center | `items-center` |
| gap | 8px | `gap-2` |
| cursor | pointer | `cursor-pointer` |

**Plus Icon:**

| Property | Value | CSS / Tailwind |
|----------|-------|----------------|
| **Node ID** | `I1002:15115;186:2759` | - |
| **Component ID** | `490:5726` (instance of set `178:1020`) | - |
| width | 24px | `w-6` |
| height | 24px | `h-6` |

**Trigger Label Text:**

| Property | Value | CSS / Tailwind |
|----------|-------|----------------|
| **Node ID** | `I1002:15115;186:2760` | - |
| font-family | Montserrat | `font-montserrat` |
| font-size | 11px | `text-[11px]` |
| font-weight | 700 | `font-bold` |
| line-height | 16px | `leading-4` |
| letter-spacing | 0.5px | `tracking-[0.5px]` |
| color | #999999 | `text-[#999]` |

**Trigger Button States:**

| State | Property | Value | Tailwind |
|-------|----------|-------|----------|
| Default | background | #FFFFFF | `bg-white` |
| Hover | background | #F5F5F5 (**predicted** — not in Figma) | `hover:bg-gray-100` |
| Active/Open | border-color | #998C5F (same as default) | No visual change; dropdown visibility indicates open state |
| Focused | outline | 2px solid #998C5F, offset 2px (**predicted**) | `focus-visible:outline-2 focus-visible:outline-[#998C5F] focus-visible:outline-offset-2` |
| Disabled | opacity | 0.5 (**predicted** — not in Figma) | `disabled:opacity-50 disabled:cursor-not-allowed` |

---

### Dropdown Container

| Property | Value | CSS / Tailwind |
|----------|-------|----------------|
| **Node ID** | `1002:13102` | - |
| width | 318px | `w-[318px]` |
| max-height | 340px | `max-h-[340px]` |
| padding | 6px | `p-1.5` |
| background | #00070C | `bg-[#00070C]` |
| border | 1px solid #998C5F | `border border-[#998C5F]` |
| border-radius | 8px | `rounded-lg` |
| display | flex | `flex` |
| flex-direction | column | `flex-col` |
| align-items | flex-start | `items-start` |
| overflow-y | auto | `overflow-y-auto` |

---

### Selected Hashtag Item (with Checkmark)

| Property | Value | CSS / Tailwind |
|----------|-------|----------------|
| **Node ID (example)** | `1002:13185` | - |
| width | fill parent (306px) | `w-full` |
| height | 40px | `h-10` |
| padding | 0 16px | `px-4` |
| background | rgba(255, 234, 158, 0.20) | `bg-[rgba(255,234,158,0.20)]` |
| border-radius | 2px | `rounded-sm` |
| display | flex | `flex` |
| align-items | center | `items-center` |
| flex-direction | row | `flex-row` |
| justify-content | flex-start | `justify-start` |
| gap | 2px | `gap-0.5` |
| cursor | pointer | `cursor-pointer` |

**Selected Hashtag Text:**

| Property | Value | CSS / Tailwind |
|----------|-------|----------------|
| **Node ID (example)** | `1002:13190` | - |
| font-family | Montserrat | `font-montserrat` |
| font-size | 16px | `text-base` |
| font-weight | 700 | `font-bold` |
| line-height | 24px | `leading-6` |
| letter-spacing | 0.15px | `tracking-[0.15px]` |
| color | #FFFFFF | `text-white` |
| text-align | left | `text-left` |
| flex | 1 | `flex-1` (fills remaining space) |

**Checkmark Icon:**

| Property | Value | CSS / Tailwind |
|----------|-------|----------------|
| **Node ID (example)** | `1002:13204` | - |
| **Component ID** | `1002:13201` (instance of set `178:1020`) | - |
| width | 24px | `w-6` |
| height | 24px | `h-6` |
| position | right side of item | Flex order (after text) |

---

### Default (Unselected) Hashtag Item

| Property | Value | CSS / Tailwind |
|----------|-------|----------------|
| **Node ID (example)** | `1002:13104` | - |
| **Component ID** | `490:5562` | - |
| width | fill parent (306px) | `w-full` |
| height | 40px | `h-10` |
| padding | 0 16px | `px-4` |
| background | transparent | `bg-transparent` |
| border-radius | 0px | `rounded-none` |
| display | flex | `flex` |
| align-items | center | `items-center` |
| flex-direction | row | `flex-row` |
| justify-content | flex-start | `justify-start` |
| gap | 2px | `gap-0.5` |
| cursor | pointer | `cursor-pointer` |

**Default Hashtag Text:**

| Property | Value | CSS / Tailwind |
|----------|-------|----------------|
| **Node ID (example)** | `I1002:13104;490:5559` | - |
| font-family | Montserrat | `font-montserrat` |
| font-size | 16px | `text-base` |
| font-weight | 700 | `font-bold` |
| line-height | 24px | `leading-6` |
| letter-spacing | 0.15px | `tracking-[0.15px]` |
| color | #FFFFFF | `text-white` |
| text-align | left | `text-left` |
| flex | 1 | `flex-1` |

**No checkmark icon** — icon area is absent for unselected items.

---

### Empty State Placeholder (**predicted** — not in Figma)

| Property | Value | CSS / Tailwind |
|----------|-------|----------------|
| font-family | Montserrat | `font-montserrat` |
| font-size | 14px | `text-sm` |
| font-weight | 400 | `font-normal` |
| color | rgba(255, 255, 255, 0.50) | `text-white/50` |
| text-align | center | `text-center` |
| padding | 16px | `p-4` |
| content | "Không có hashtag" | - |

---

**Item States:**

| State | Property | Value | Tailwind |
|-------|----------|-------|----------|
| Default | background | transparent | `bg-transparent` |
| Hover (unselected) | background | rgba(255, 234, 158, 0.10) | `hover:bg-[rgba(255,234,158,0.10)]` |
| Selected | background | rgba(255, 234, 158, 0.20) | `bg-[rgba(255,234,158,0.20)]` |
| Selected | border-radius | 2px | `rounded-sm` |
| Selected | checkmark | visible (24×24px) | Icon appears |
| Hover (selected) | background | rgba(255, 234, 158, 0.25) (**predicted**) | `hover:bg-[rgba(255,234,158,0.25)]` |
| Disabled (max reached) | opacity | 0.4 (**predicted** — not in Figma) | `opacity-40` |
| Disabled (max reached) | cursor | not-allowed (**predicted**) | `cursor-not-allowed` |
| Focused (keyboard) | outline | 2px solid #998C5F, offset 2px | `data-[focused]:outline-2 data-[focused]:outline-[#998C5F] data-[focused]:outline-offset-2` |

---

## Component Hierarchy with Styles

```
HashtagMultiSelectDropdown
│
├── TriggerButton <button> (w-auto h-12 px-2 py-1 bg-white border border-[#998C5F]
│                           rounded-lg flex items-center gap-2 cursor-pointer)
│                           aria-haspopup="listbox" aria-expanded="true|false"
│   ├── PlusIcon <Icon> (w-6 h-6)
│   │   └── MM_MEDIA_Plus (component 490:5726)
│   └── LabelText <span> (font-montserrat text-[11px] font-bold text-[#999]
│                          leading-4 tracking-[0.5px])
│       └── "Hashtag\nTối đa 5"
│
└── DropdownPanel <div> (w-[318px] max-h-[340px] p-1.5 bg-[#00070C] border border-[#998C5F]
                         rounded-lg flex flex-col items-start overflow-y-auto)
                         role="listbox" aria-label="Chọn hashtag" aria-multiselectable="true"
    │
    ├── HashtagItem [selected] <button> (w-full h-10 px-4 rounded-sm flex items-center
    │                                    gap-0.5 bg-[rgba(255,234,158,0.20)]
    │                                    cursor-pointer transition-colors duration-150)
    │                                    role="option" aria-selected="true"
    │   ├── Text <span> (font-montserrat text-base font-bold text-white leading-6
    │   │                 tracking-[0.15px] flex-1 truncate)
    │   │   └── "#High-perorming"
    │   └── CheckIcon <Icon> (w-6 h-6)
    │       └── Component 1002:13201
    │
    ├── HashtagItem [selected] (same structure)
    │   └── "#BE PROFESSIONAL" + ✓
    │
    ├── HashtagItem [selected] (same structure)
    │   └── "#BE OPTIMISTIC" + ✓
    │
    ├── HashtagItem [default] <button> (w-full h-10 px-4 rounded-none flex items-center
    │                                   gap-0.5 bg-transparent
    │                                   hover:bg-[rgba(255,234,158,0.10)]
    │                                   cursor-pointer transition-colors duration-150)
    │                                   role="option" aria-selected="false"
    │   └── Text <span> (same text styling, flex-1 truncate)
    │       └── "#BE A TEAM"
    │
    ├── HashtagItem [default] (same structure)
    │   └── "#THINK OUTSIDE THE BOX"
    │
    ├── ... (repeat for remaining hashtags)
    │
    └── HashtagItem [default] (last item)
        └── "#WASSHOI"
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

#### Mobile (< 640px)

| Component | Changes | Tailwind |
|-----------|---------|----------|
| Dropdown Container | width: calc(100vw - 32px), max-width: 300px | `w-[calc(100vw-32px)] max-w-[300px]` (base) |
| Dropdown max-height | 50vh | `max-h-[50vh]` (base) |
| Item height | 44px (WCAG/constitution minimum touch target) | `h-11` (base) |
| Item padding | 12px | `px-3` (base) |
| Text size | 14px | `text-sm` (base) |
| Trigger button | Same size | No change |

#### Tablet (640px - 1023px)

| Component | Changes | Tailwind |
|-----------|---------|----------|
| Dropdown Container | width: 318px | `sm:w-[318px]` |
| Dropdown max-height | 400px | `sm:max-h-[400px]` |
| Item height | 40px | `sm:h-10` |
| Item padding | 16px | `sm:px-4` |
| Text size | 16px | `sm:text-base` |

#### Desktop (>= 1024px)

| Component | Changes | Tailwind |
|-----------|---------|----------|
| Layout | As specified in Figma design | All desktop styles as documented above |

---

## Icon Specifications

| Icon Name | Node ID | Component ID | Size | Color | Usage |
|-----------|---------|-------------|------|-------|-------|
| MM_MEDIA_Plus | `I1002:15115;186:2759` | `490:5726` (set `178:1020`) | 24×24px | Context-dependent | Trigger button "add" icon |
| Checkmark (đã chọn) | `1002:13204` | `1002:13201` (set `178:1020`) | 24×24px | #FFFFFF | Selected item indicator |

---

## Animation & Transitions

| Element | Property | Duration | Easing | Trigger |
|---------|----------|----------|--------|---------|
| Dropdown | opacity, transform (scale 0.95→1) | 150ms | ease-out | Open |
| Dropdown | opacity, transform (scale 1→0.95) | 100ms | ease-in | Close |
| Item | background-color | 150ms | ease-in-out | Hover/Select/Deselect |
| Checkmark | opacity (0→1 / 1→0) | 150ms | ease-in-out | Select/Deselect |

---

## Implementation Mapping

| Design Element | Figma Node ID | Tailwind Classes | React Component |
|----------------|---------------|------------------|-----------------|
| Trigger Button | `1002:15115` | `w-auto h-12 px-2 py-1 bg-white border border-[#998C5F] rounded-lg flex items-center gap-2 cursor-pointer` | `<button>` (trigger) |
| Trigger Label | `I1002:15115;186:2760` | `font-montserrat text-[11px] font-bold text-[#999] leading-4 tracking-[0.5px]` | `<span>` |
| Plus Icon | `I1002:15115;186:2759` | `w-6 h-6` | `<Icon name="plus">` |
| Dropdown Container | `1002:13102` | `w-[318px] max-h-[340px] p-1.5 bg-[#00070C] border border-[#998C5F] rounded-lg flex flex-col items-start overflow-y-auto` | `<div role="listbox">` |
| Selected Item | `1002:13185` | `w-full h-10 px-4 rounded-sm flex items-center gap-0.5 bg-[rgba(255,234,158,0.20)] cursor-pointer transition-colors duration-150` | `<button role="option">` |
| Default Item | `1002:13104` | `w-full h-10 px-4 rounded-none flex items-center gap-0.5 bg-transparent hover:bg-[rgba(255,234,158,0.10)] cursor-pointer transition-colors duration-150` | `<button role="option">` |
| Hashtag Text | `1002:13190` | `font-montserrat text-base font-bold text-white leading-6 tracking-[0.15px] flex-1 truncate` | `<span>` |
| Checkmark Icon | `1002:13204` | `w-6 h-6` | `<Icon name="check">` |

---

## Notes

- All colors use Tailwind arbitrary values — this component follows the dark theme with gold accents consistent with other components in the project.
- **Font**: Montserrat MUST be loaded and configured as `font-montserrat` in Tailwind. Verify in `layout.tsx`.
- **Multi-select**: Unlike the single-select Dropdown Hashtag Filter (frame `721:5580`), this component supports selecting **up to 5 hashtags simultaneously**. Selected items show a checkmark icon; unselected items do not.
- **Checkmark icon**: Uses the same component set (`178:1020`) as the plus icon in the trigger. Must be rendered via Icon Component, not as SVG files or img tags.
- **Selected vs unselected border-radius difference**: Selected items have `border-radius: 2px`, unselected items have `border-radius: 0px`. This is a subtle but intentional design distinction.
- Color contrast: White (#FFFFFF) on dark (#00070C) exceeds WCAG AA requirements (contrast ratio > 15:1).
- Trigger label text (#999) on white (#FFF) has ~2.8:1 contrast ratio — below WCAG AA for small text. Consider flagging to designers, but implement as designed.
- **Dropdown positioning**: Left-aligned with trigger's left edge, 6px below trigger's bottom edge (`mt-1.5`). The dropdown (318px) extends significantly beyond the trigger's right edge (116px).
- **Mobile-first implementation**: Component Style Details tables document **desktop (Figma) values**. For Tailwind implementation, use mobile-first: base classes = mobile values (from Responsive → Mobile section), `sm:` = tablet overrides, `lg:` = desktop (as documented in Component Style Details). See Responsive Specifications section for exact breakpoint values.
