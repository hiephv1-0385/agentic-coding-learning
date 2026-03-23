# Design Style: Dropdown Hashtag Filter

**Frame ID**: `721:5580`
**Frame Name**: `Dropdown Hashtag filter`
**Figma Link**: `https://www.figma.com/design/9ypp4enmFmdK3YAFJLIu6C?node-id=721:5580`
**Extracted At**: 2026-03-09

---

## Design Tokens

### Colors

| Token Name | Hex Value | Opacity | Usage |
|------------|-----------|---------|-------|
| --color-dropdown-bg | #00070C | 100% | Dropdown container background (very dark blue-black) |
| --color-dropdown-border | #998C5F | 100% | Dropdown container border (gold/brown) |
| --color-item-selected-bg | rgba(255, 234, 158, 0.10) | 10% | Selected item background (subtle gold tint) |
| --color-item-hover-bg | rgba(255, 234, 158, 0.05) | 5% | Item hover background (predicted, subtler gold) |
| --color-text-default | #FFFFFF | 100% | Default (unselected) item text |
| --color-text-selected | #FFFFFF | 100% | Selected item text (same white, glow effect differentiates) |
| --color-glow | #FAE287 | 100% | Text shadow glow color for selected state |

### Typography

| Token Name | Font Family | Size | Weight | Line Height | Letter Spacing | Usage |
|------------|-------------|------|--------|-------------|----------------|-------|
| --text-hashtag | Montserrat | 16px | 700 | 24px | 0.5px | All hashtag item text (both states) |

### Spacing

| Token Name | Value | Usage |
|------------|-------|-------|
| --spacing-dropdown-padding | 6px | Dropdown container internal padding (all sides) |
| --spacing-item-padding | 16px | Item internal padding (all sides) |
| --spacing-item-gap | 0px | Gap between items (items are flush, no gap) |
| --spacing-text-gap | 4px | Gap within text frame (icon + text, if applicable) |

### Border & Radius

| Token Name | Value | Usage |
|------------|-------|-------|
| --radius-dropdown | 8px | Dropdown container border radius |
| --radius-item | 4px | Individual item border radius |
| --border-dropdown | 1px solid #998C5F | Dropdown container border |

### Shadows & Effects

| Token Name | Value | Usage |
|------------|-------|-------|
| --shadow-text-selected | 0 4px 4px rgba(0,0,0,0.25), 0 0 6px #FAE287 | Selected item text glow (dual shadow: depth + glow) |
| --shadow-dropdown | none | Dropdown container has no box-shadow in design |

---

## Layout Specifications

### Dropdown Container

| Property | Value | Notes |
|----------|-------|-------|
| width | auto (hug content), min ~147px, max 320px | Adapts to longest hashtag text; capped to prevent overflow |
| max-height | 348px (6 items visible) | Scrollable if more items; design shows 6 of 13 |
| padding | 6px | All sides |
| border | 1px solid #998C5F | Gold border |
| border-radius | 8px | Rounded corners |
| background | #00070C | Very dark background |
| overflow-y | auto | Scroll when content exceeds max-height |
| display | flex | Flexbox layout |
| flex-direction | column | Vertical stack |
| align-items | stretch | Items fill container width (all children are w-full) |

### Layout Structure (ASCII)

```
┌──────────────────────────────────────────────────────────┐
│  Dropdown Container (auto width, max-h ~348px,           │
│  bg: #00070C, border: 1px #998C5F, radius: 8px, p: 6px) │
│                                                          │
│  ┌────────────────────────────────────────────────────┐  │
│  │  A.1: Selected Item (p: 16px, radius: 4px,        │  │
│  │       bg: rgba(255,234,158,0.10))                  │  │
│  │  "#Dedicated" (Montserrat 16/700, white, glow)     │  │
│  └────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────┐  │
│  │  A.2: Default Item (p: 16px, radius: 4px, bg: -)  │  │
│  │  "#Inspring" (Montserrat 16/700, white)            │  │
│  └────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────┐  │
│  │  A.3: Default Item                                 │  │
│  │  "#Dedicated" (same styling)                       │  │
│  └────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────┐  │
│  │  A.4: Default Item                                 │  │
│  └────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────┐  │
│  │  A.5: Default Item                                 │  │
│  └────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────┐  │
│  │  A.6: Default Item                                 │  │
│  └────────────────────────────────────────────────────┘  │
│  ... (scrollable for items 7–13)                         │
└──────────────────────────────────────────────────────────┘
```

---

## Component Style Details

### A: Dropdown Container

| Property | Value | CSS / Tailwind |
|----------|-------|----------------|
| **Node ID** | `563:8026` | - |
| **Component ID** | `525:13420` (instance of component set `563:8216`) | - |
| width | auto (hug), max 320px | `w-auto max-w-xs` |
| max-height | ~348px | `max-h-[348px]` |
| padding | 6px | `p-1.5` |
| background | #00070C | `bg-[#00070C]` |
| border | 1px solid #998C5F | `border border-[#998C5F]` |
| border-radius | 8px | `rounded-lg` |
| display | flex | `flex` |
| flex-direction | column | `flex-col` |
| align-items | stretch | `items-stretch` |
| overflow-y | auto | `overflow-y-auto` |

**Scrollbar styling (predicted):**
| Property | Value | CSS / Tailwind |
|----------|-------|----------------|
| scrollbar-width | thin | `scrollbar-thin` (if using plugin) |
| scrollbar-color | #998C5F transparent | Custom scrollbar matching border color |

---

### A.1: Selected Hashtag Item

| Property | Value | CSS / Tailwind |
|----------|-------|----------------|
| **Node ID** | `I563:8026;525:13508` | - |
| **Component ID** | `186:1496` (selected variant of set `186:1426`) | - |
| width | fill parent (100%) | `w-full` |
| height | 56px | `h-14` |
| padding | 16px | `p-4` |
| background | rgba(255, 234, 158, 0.10) | `bg-[rgba(255,234,158,0.10)]` |
| border-radius | 4px | `rounded` |
| display | flex | `flex` |
| align-items | center | `items-center` |
| gap | 4px | `gap-1` |
| cursor | pointer | `cursor-pointer` |

**Selected Text:**

| Property | Value | CSS / Tailwind |
|----------|-------|----------------|
| font-family | Montserrat | `font-montserrat` |
| font-size | 16px | `text-base` |
| font-weight | 700 | `font-bold` |
| line-height | 24px | `leading-6` |
| letter-spacing | 0.5px | `tracking-[0.5px]` |
| color | #FFFFFF | `text-white` |
| text-align | left | `text-left` |
| text-shadow | 0 4px 4px rgba(0,0,0,0.25), 0 0 6px #FAE287 | `[text-shadow:0_4px_4px_rgba(0,0,0,0.25),0_0_6px_#FAE287]` |

---

### A.2–A.6: Default Hashtag Item

| Property | Value | CSS / Tailwind |
|----------|-------|----------------|
| **Node ID (example)** | `I563:8026;525:14864` | - |
| **Component ID** | `186:1433` (default variant of set `186:1426`) | - |
| width | fill parent (100%) | `w-full` |
| height | 56px | `h-14` |
| padding | 16px | `p-4` |
| background | transparent | `bg-transparent` |
| border-radius | 4px | `rounded` |
| display | flex | `flex` |
| align-items | center | `items-center` |
| gap | 4px | `gap-1` |
| cursor | pointer | `cursor-pointer` |

**Default Text:**

| Property | Value | CSS / Tailwind |
|----------|-------|----------------|
| font-family | Montserrat | `font-montserrat` |
| font-size | 16px | `text-base` |
| font-weight | 700 | `font-bold` |
| line-height | 24px | `leading-6` |
| letter-spacing | 0.5px | `tracking-[0.5px]` |
| color | #FFFFFF | `text-white` |
| text-align | left | `text-left` |
| text-shadow | none | - |

**States:**

| State | Property | Value | Tailwind |
|-------|----------|-------|----------|
| Default | background | transparent | `bg-transparent` |
| Hover | background | rgba(255, 234, 158, 0.05) | `hover:bg-[rgba(255,234,158,0.05)]` |
| Selected | background | rgba(255, 234, 158, 0.10) | `bg-[rgba(255,234,158,0.10)]` |
| Selected | text-shadow | 0 4px 4px rgba(0,0,0,0.25), 0 0 6px #FAE287 | `[text-shadow:...]` |
| Focused (keyboard) | outline | 2px solid #998C5F, offset 2px | `data-[focused]:outline-2 data-[focused]:outline-[#998C5F] data-[focused]:outline-offset-2` (applied via `data-focused` attribute based on `focusedIndex`, since `aria-activedescendant` keeps DOM focus on the container) |

---

## Component Hierarchy with Styles

```
HashtagFilterDropdown (w-auto max-w-xs max-h-[348px] p-1.5 bg-[#00070C] border border-[#998C5F]
│                      rounded-lg flex flex-col items-stretch overflow-y-auto)
│                      role="listbox" aria-label="Hashtag filter"
│
├── HashtagItem [selected] <button> (w-full min-w-0 h-14 p-4 rounded flex items-center gap-1
│                                    bg-[rgba(255,234,158,0.10)] cursor-pointer
│                                    transition-[background-color,text-shadow] duration-150)
│                                    role="option" aria-selected="true"
│   └── Text <span> (font-montserrat text-base font-bold text-white leading-6
│                     tracking-[0.5px] truncate
│                     [text-shadow:0_4px_4px_rgba(0,0,0,0.25),0_0_6px_#FAE287])
│       └── "#Cống hiến"
│
├── HashtagItem [default] <button> (w-full min-w-0 h-14 p-4 rounded flex items-center gap-1
│                                   bg-transparent hover:bg-[rgba(255,234,158,0.05)]
│                                   cursor-pointer transition-[background-color,text-shadow] duration-150)
│                                   role="option" aria-selected="false"
│   └── Text <span> (font-montserrat text-base font-bold text-white leading-6
│                     tracking-[0.5px] truncate)
│       └── "#Toàn diện"
│
├── HashtagItem [default] (same structure)
│   └── "#Giỏi chuyên môn"
│
├── ... (repeat for all 13 hashtags)
│
└── HashtagItem [default] (last item)
    └── "#Quản lý xuất sắc"
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
| Item height | 48px (slightly reduced) | `h-12` (base) |
| Item padding | 12px | `p-3` (base) |
| Text size | 14px | `text-sm` (base) |

#### Tablet (640px - 1023px)

| Component | Changes | Tailwind |
|-----------|---------|----------|
| Dropdown Container | width: auto, max-width: 320px | `sm:w-auto sm:max-w-xs` |
| Dropdown max-height | 348px | `sm:max-h-[348px]` |
| Item height | 56px | `sm:h-14` |
| Item padding | 16px | `sm:p-4` |
| Text size | 16px | `sm:text-base` |

#### Desktop (>= 1024px)

| Component | Changes | Tailwind |
|-----------|---------|----------|
| Layout | As specified in Figma design | All desktop styles as documented above |

---

## Icon Specifications

No icons are used in this design. Hashtag items are text-only.

---

## Animation & Transitions

| Element | Property | Duration | Easing | Trigger |
|---------|----------|----------|--------|---------|
| Dropdown | opacity, transform (scale 0.95->1) | 150ms | ease-out | Open |
| Dropdown | opacity, transform (scale 1->0.95) | 100ms | ease-in | Close |
| Item | background-color | 150ms | ease-in-out | Hover/Select |
| Item text | text-shadow | 150ms | ease-in-out | Select/Deselect |

---

## Implementation Mapping

| Design Element | Figma Node ID | Tailwind Classes | React Component |
|----------------|---------------|------------------|-----------------|
| Dropdown Container | `563:8026` | `w-auto max-w-xs max-h-[348px] p-1.5 bg-[#00070C] border border-[#998C5F] rounded-lg flex flex-col items-stretch overflow-y-auto` | `<HashtagFilterDropdown>` |
| Selected Item | `I563:8026;525:13508` | `w-full min-w-0 h-14 p-4 rounded flex items-center gap-1 bg-[rgba(255,234,158,0.10)] cursor-pointer transition-[background-color,text-shadow] duration-150` | `<button role="option">` |
| Default Item | `I563:8026;525:14864` | `w-full min-w-0 h-14 p-4 rounded flex items-center gap-1 bg-transparent hover:bg-[rgba(255,234,158,0.05)] cursor-pointer transition-[background-color,text-shadow] duration-150` | `<button role="option">` |
| Selected Text | `I563:8026;525:13508;186:1497` | `font-montserrat text-base font-bold text-white leading-6 tracking-[0.5px] truncate [text-shadow:0_4px_4px_rgba(0,0,0,0.25),0_0_6px_#FAE287]` | `<span>` |
| Default Text | `I563:8026;525:14864;186:1439` | `font-montserrat text-base font-bold text-white leading-6 tracking-[0.5px] truncate` | `<span>` |

---

## Notes

- All colors use Tailwind arbitrary values — this component follows the dark theme with gold accents consistent with the Add Link Box component.
- **Font**: Montserrat MUST be loaded and configured as `font-montserrat` in Tailwind. Verify in `layout.tsx`.
- **Text glow**: The selected state uses a CSS `text-shadow` with two layers — a dark shadow for depth and a gold glow (#FAE287). In Tailwind, use the arbitrary property syntax: `[text-shadow:0_4px_4px_rgba(0,0,0,0.25),0_0_6px_#FAE287]`.
- **Scrollbar**: The design shows 6 items visible; with 13 total items, the dropdown needs scrolling. Consider a custom scrollbar style matching the gold theme, or use `scrollbar-thin` if the Tailwind scrollbar plugin is available.
- The dropdown is an instance of Figma component `525:13420` (set `563:8216`). Tag items use component set `186:1426` with two variants: `186:1496` (selected) and `186:1433` (default).
- All icons MUST BE in Icon Component instead of svg files or img tags (no icons in this design).
- Color contrast: White (#FFFFFF) on dark (#00070C) exceeds WCAG AA requirements (contrast ratio > 15:1).
