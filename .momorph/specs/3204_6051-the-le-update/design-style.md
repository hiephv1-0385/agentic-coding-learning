# Design Style: Thể lệ (Rules) Panel

**Frame ID**: `3204:6051`
**Frame Name**: `Thể lệ UPDATE`
**Figma Link**: https://www.figma.com/file/9ypp4enmFmdK3YAFJLIu6C/?node-id=3204:6051
**Extracted At**: 2026-03-16

---

## Design Tokens

### Colors

| Token Name | Hex Value | Opacity | Usage |
|------------|-----------|---------|-------|
| --color-bg-dark | #00101A | 100% | Page/modal background |
| --color-bg-panel | #00070C | 100% | Panel background (left content area) |
| --color-accent-gold | #FFEA9E | 100% | Title text, section headings, accent borders |
| --color-text-white | #FFFFFF | 100% | Body text, badge labels, button text (secondary) |
| --color-text-dark | #00101A | 100% | Primary button text (on gold background) |
| --color-border-gold | #998C5F | 100% | Secondary button border |
| --color-btn-primary | #FFEA9E | 100% | Primary button background ("Viết KUDOS") |
| --color-btn-secondary-bg | rgba(255, 234, 158, 0.10) | 10% | Secondary button background ("Đóng") |
| --color-badge-border | #FFEA9E | 100% | Hero badge pill border |
| --color-badge-icon-border | #FFFFFF | 100% | Collection badge circular border |

### Typography

| Token Name | Font Family | Size | Weight | Line Height | Letter Spacing |
|------------|-------------|------|--------|-------------|----------------|
| --text-title | Montserrat | 45px | 700 | 52px | 0px |
| --text-section-heading | Montserrat | 22px | 700 | 28px | 0px |
| --text-subsection-heading | Montserrat | 24px | 700 | 32px | 0px |
| --text-body | Montserrat | 16px | 700 | 24px | 0.5px |
| --text-body-sm | Montserrat | 14px | 700 | 20px | 0.1px |
| --text-badge-label | Montserrat | 12px | 700 | 16px | 0.5px |
| --text-badge-label-sm | Montserrat | 11px | 700 | 16px | 0.5px |
| --text-hero-badge | Montserrat | 13px | 700 | 19px | 0.094px |
| --text-button | Montserrat | 16px | 700 | 24px | 0.5px |

### Spacing

| Token Name | Value | Usage |
|------------|-------|-------|
| --spacing-panel-top | 24px | Panel top padding |
| --spacing-panel-x | 40px | Panel horizontal padding |
| --spacing-panel-bottom | 40px | Panel bottom padding |
| --spacing-section-gap | 24px | Gap between sections |
| --spacing-content-gap | 16px | Gap between content items |
| --spacing-badge-grid-gap | 16px | Gap between badge items in grid |
| --spacing-badge-inner | 8px | Gap between badge icon and label |
| --spacing-button-gap | 16px | Gap between footer buttons |
| --spacing-button-padding | 16px | Button internal padding |
| --spacing-badge-list-px | 24px | Badge list horizontal padding |

### Border & Radius

| Token Name | Value | Usage |
|------------|-------|-------|
| --radius-button | 4px | Button corners |
| --radius-hero-badge | 55.579px | Hero badge pill shape (fully rounded) |
| --radius-collection-badge | 100px | Collection badge circular shape |
| --border-badge-pill | 0.579px solid #FFEA9E | Hero badge pill border |
| --border-badge-circle | 2px solid #FFFFFF | Collection badge circle border |
| --border-btn-secondary | 1px solid #998C5F | Secondary button border |

### Shadows

| Token Name | Value | Usage |
|------------|-------|-------|
| --shadow-hero-text | 0 0.45px 1.8px #000 | Hero badge text shadow (Rising/Super Hero) |
| --shadow-legend-glow | 0 0 1.5px #FFF | Legend Hero text glow |

---

## Layout Specifications

### Container (Frame: Thể lệ UPDATE)

| Property | Value | Notes |
|----------|-------|-------|
| width | 1440px | Full desktop width |
| height | 1796px | Full frame height |
| background | #00101A | Dark background |

### Overlay/Backdrop

| Property | Value | Notes |
|----------|-------|-------|
| background | rgba(0, 16, 26, 0.70) | Semi-transparent dark overlay |
| position | fixed | Full viewport coverage |
| inset | 0 | Covers entire screen |
| z-index | 40 | Below panel, above page content |
| cursor | pointer | Clickable to dismiss panel |

### Content Panel (Node: 3204:6052 "Thể Lệ")

| Property | Value | Notes |
|----------|-------|-------|
| width | 553px | Right-aligned panel |
| display | flex | Vertical layout |
| flex-direction | column | Top to bottom |
| justify-content | space-between | Content + buttons spaced |
| padding | 24px 40px 40px 40px | Top Right Bottom Left |
| gap | 40px | Between content and footer |
| background | #00070C | Darker panel background |
| position | fixed | Positioned right side (Figma uses absolute, implementation MUST use fixed) |
| right | 0 | Aligned to right edge |
| top | 0 | Full height |
| bottom | 0 | Full height |
| z-index | 50 | Above overlay |
| overflow | hidden | Panel itself does NOT scroll — see Content Area below |

#### Content Area (scrollable region)

The **Content Area** (everything above the Button Footer) MUST be the scrollable element, NOT the panel container. This ensures the Button Footer stays fixed at the bottom.

| Property | Value | Notes |
|----------|-------|-------|
| flex | 1 | Takes remaining space above footer |
| overflow-y | auto | Scrolls when content exceeds available height |
| min-height | 0 | Required for flex overflow to work correctly |

### Layout Structure (ASCII)

```
┌─────────────────────────────────────────────────────────────────────┐
│  Frame (1440 x 1796, bg: #00101A)                                   │
│                                                                     │
│  ┌─────────────────────────────────────────┐                        │
│  │                                         │                        │
│  │       (Left area - background only)     │                        │
│  │       887px wide                        │                        │
│  │                                         │                        │
│  └─────────────────────────────────────────┘                        │
│                                             ┌──────────────────────┐│
│                                             │ Panel (553px wide)   ││
│                                             │ bg: #00070C          ││
│                                             │ p: 24 40 40 40       ││
│                                             │                      ││
│                                             │ ┌──────────────────┐ ││
│                                             │ │ Title: "Thể lệ"  │ ││
│                                             │ │ 45px/700 gold    │ ││
│                                             │ └──────────────────┘ ││
│                                             │ gap: 24px            ││
│                                             │ ┌──────────────────┐ ││
│                                             │ │ Section: NGƯỜI   │ ││
│                                             │ │ NHẬN KUDOS       │ ││
│                                             │ │ 22px/700 gold    │ ││
│                                             │ │                  │ ││
│                                             │ │ Body text 16px   │ ││
│                                             │ │ white             │ ││
│                                             │ │                  │ ││
│                                             │ │ [Hero Badge] txt │ ││
│                                             │ │ [Hero Badge] txt │ ││
│                                             │ │ [Hero Badge] txt │ ││
│                                             │ │ [Hero Badge] txt │ ││
│                                             │ └──────────────────┘ ││
│                                             │ gap: 16px            ││
│                                             │ ┌──────────────────┐ ││
│                                             │ │ Section: NGƯỜI   │ ││
│                                             │ │ GỬI KUDOS        │ ││
│                                             │ │ 22px/700 gold    │ ││
│                                             │ │                  │ ││
│                                             │ │ Body text 16px   │ ││
│                                             │ │                  │ ││
│                                             │ │ [Badge][Badge]   │ ││
│                                             │ │ [Badge]          │ ││
│                                             │ │ [Badge][Badge]   │ ││
│                                             │ │ [Badge]          │ ││
│                                             │ └──────────────────┘ ││
│                                             │ gap: 16px            ││
│                                             │ ┌──────────────────┐ ││
│                                             │ │ KUDOS QUỐC DÂN   │ ││
│                                             │ │ 24px/700 gold    │ ││
│                                             │ │ Body text 16px   │ ││
│                                             │ └──────────────────┘ ││
│                                             │                      ││
│                                             │ gap: 40px            ││
│                                             │ ┌──────────────────┐ ││
│                                             │ │[Đóng][Viết KUDOS]│ ││
│                                             │ │ gap: 16px        │ ││
│                                             │ └──────────────────┘ ││
│                                             └──────────────────────┘│
└─────────────────────────────────────────────────────────────────────┘
```

---

## Component Style Details

### Title - "Thể lệ"

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | 3204:6055 | - |
| width | 473px | `width: 473px` |
| height | 52px | `height: auto` |
| font-family | Montserrat | `font-family: 'Montserrat', sans-serif` |
| font-size | 45px | `font-size: 45px` |
| font-weight | 700 | `font-weight: 700` |
| line-height | 52px | `line-height: 52px` |
| color | #FFEA9E | `color: var(--color-accent-gold)` |
| text-align | left | `text-align: left` |

---

### Section Heading (e.g., "NGƯỜI NHẬN KUDOS...", "NGƯỜI GỬI KUDOS...")

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | 3204:6132 (Người nhận), 3204:6077 (Người gửi) | - |
| width | 473px | `width: 100%` |
| font-family | Montserrat | `font-family: 'Montserrat', sans-serif` |
| font-size | 22px | `font-size: 22px` |
| font-weight | 700 | `font-weight: 700` |
| line-height | 28px | `line-height: 28px` |
| color | #FFEA9E | `color: var(--color-accent-gold)` |
| text-align | left | `text-align: left` |

---

### Subsection Heading - "KUDOS QUỐC DÂN"

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | 3204:6090 | - |
| width | 473px | `width: 100%` |
| font-family | Montserrat | `font-family: 'Montserrat', sans-serif` |
| font-size | 24px | `font-size: 24px` |
| font-weight | 700 | `font-weight: 700` |
| line-height | 32px | `line-height: 32px` |
| color | #FFEA9E | `color: var(--color-accent-gold)` |

---

### Body Text

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | 3204:6133 (example) | - |
| width | 473px | `width: 100%` |
| font-family | Montserrat | `font-family: 'Montserrat', sans-serif` |
| font-size | 16px | `font-size: 16px` |
| font-weight | 700 | `font-weight: 700` |
| line-height | 24px | `line-height: 24px` |
| letter-spacing | 0.5px | `letter-spacing: 0.5px` |
| color | #FFFFFF | `color: var(--color-text-white)` |
| text-align | justified | `text-align: justify` |

---

### Hero Badge Pill (e.g., "New Hero", "Rising Hero", etc.)

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID (New Hero)** | 3204:6163 | - |
| **Node ID (Rising Hero)** | 3204:6172 | - |
| **Node ID (Super Hero)** | 3204:6181 | - |
| **Node ID (Legend Hero)** | 3204:6190 | - |
| **Component Set ID** | 3007:17505 | - |
| width | 126px (auto, fits content) | `width: auto; min-width: 126px` |
| height | 22px | `height: 22px` |
| border | 0.579px solid #FFEA9E | `border: 0.579px solid var(--color-badge-border)` |
| border-radius | 55.579px | `border-radius: 9999px` (pill shape) |
| background | Image export from Figma | Each tier has a unique image background; export as PNG/WebP from component set 3007:17505 |
| text color | #FFFFFF | `color: white` |
| text font-size | 13px | `font-size: 13px` |
| text font-weight | 700 | `font-weight: 700` |
| text-shadow | varies by tier | See individual badges below |

**Badge Variants:**

| Badge | Component ID | Text Shadow | Special |
|-------|-------------|-------------|---------|
| New Hero | 3007:17506 | none | Plain background |
| Rising Hero | 3007:17509 | 0 0.447px 1.787px #000 | Gradient overlay |
| Super Hero | 3007:17512 | 0 0.457px 1.83px #000 | Gradient overlay |
| Legend Hero | 3007:17516 | 0 0 1.505px #FFF (glow) | Glowing effect, image overlay |

---

### Hero Badge Row Layout (each tier row)

Each hero badge tier is displayed as a content block with the following internal layout:

| Property | Value | CSS |
|----------|-------|-----|
| width | 400px | `width: 100%; max-width: 400px` |
| height | auto (72px typical) | `height: auto` |
| layout | block | Two lines: badge line + description line |

**Line 1** (Badge + Threshold): badge pill and threshold text are inline, side by side.

| Property | Value | CSS |
|----------|-------|-----|
| display | flex / inline | `display: flex; align-items: center; gap: 8px` |
| pill | inline, 126x22px | Pill element (see below) |
| threshold text | inline, after pill | `font-size: 16px; font-weight: 700` |

**Line 2** (Sub-description): motivational text below, spanning full width.

| Property | Value | CSS |
|----------|-------|-----|
| margin-top | 8px | `margin-top: 8px` |
| width | full (up to 453px) | `width: 100%` |
| font-size | 14px | `font-size: 14px; font-weight: 700` |

> **Implementation note**: Hero badge pills use **image-based backgrounds** exported from Figma (Component Set 3007:17505). These are NOT achievable with pure CSS gradients — export each variant as a small image asset and use as background.

---

### Hero Badge Description Text (beside each pill)

| Property | Value | CSS |
|----------|-------|-----|
| **Example Node ID** | 3204:6162 | - |
| font-family | Montserrat | `font-family: 'Montserrat', sans-serif` |
| font-size | 16px | `font-size: 16px` |
| font-weight | 700 | `font-weight: 700` |
| line-height | 24px | `line-height: 24px` |
| letter-spacing | 0.5px | `letter-spacing: 0.5px` |
| color | #FFFFFF | `color: white` |

### Hero Badge Sub-description Text

| Property | Value | CSS |
|----------|-------|-----|
| **Example Node ID** | 3204:6168 | - |
| font-family | Montserrat | `font-family: 'Montserrat', sans-serif` |
| font-size | 14px | `font-size: 14px` |
| font-weight | 700 | `font-weight: 700` |
| line-height | 20px | `line-height: 20px` |
| letter-spacing | 0.1px | `letter-spacing: 0.1px` |
| color | #FFFFFF | `color: white` |

---

### Collection Badge Icon (e.g., REVIVAL, TOUCH OF LIGHT, etc.)

| Property | Value | CSS |
|----------|-------|-----|
| **Component Set ID** | 737:20452 | - |
| **REVIVAL** | 737:20446 | Node: 3204:6082 |
| **TOUCH OF LIGHT** | 737:20450 | Node: 3204:6087 |
| **STAY GOLD** | 737:20449 | Node: 3204:6086 |
| **FLOW TO HORIZON** | 737:20447 | Node: 3204:6083 |
| **BEYOND THE BOUNDARY** | 737:20448 | Node: 3204:6084 |
| **ROOT FURTHER** | 737:20451 | Node: 3204:6088 |
| icon container width | 80px | `width: 80px` |
| icon circle size | 64x64px | `width: 64px; height: 64px` |
| icon border | 2px solid #FFFFFF | `border: 2px solid white` |
| icon border-radius | 100px | `border-radius: 50%` |
| label font-size | 12px (REVIVAL, STAY GOLD) / 11px (others with longer names) | `font-size: 11px` (default, use 12px for short names) |
| label font-weight | 700 | `font-weight: 700` |
| label line-height | 16px | `line-height: 16px` |
| label letter-spacing | 0.5px | `letter-spacing: 0.5px` |
| label color | #FFFFFF | `color: white` |
| label text-align | center | `text-align: center` |
| layout | flex column, center | `display: flex; flex-direction: column; align-items: center` |
| gap (icon-to-label) | 8px | `gap: 8px` |

**Badge Grid Layout:**

| Property | Value | Notes |
|----------|-------|-------|
| display | flex | Row layout |
| justify-content | space-between | Evenly distributed |
| gap | 16px | Between badges |
| rows | 2 rows, 3 per row | 3x2 grid |
| row 1 | REVIVAL, TOUCH OF LIGHT, STAY GOLD | |
| row 2 | FLOW TO HORIZON, BEYOND THE BOUNDARY, ROOT FURTHER | |
| container padding-x | 24px (outer) + 24px (inner) | Nested padding |

---

### Primary Button - "Viết KUDOS"

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | 3204:6094 | - |
| **Component ID** | 186:1567 | - |
| width | 363px | `flex: 1` |
| height | 56px | `height: 56px` |
| padding | 16px | `padding: 16px` |
| background | #FFEA9E | `background-color: var(--color-btn-primary)` |
| border | none | `border: none` |
| border-radius | 4px | `border-radius: 4px` |
| display | flex | `display: flex` |
| align-items | center | `align-items: center` |
| justify-content | center | `justify-content: center` |
| gap | 8px | `gap: 8px` |
| font-family | Montserrat | `font-family: 'Montserrat', sans-serif` |
| font-size | 16px | `font-size: 16px` |
| font-weight | 700 | `font-weight: 700` |
| line-height | 24px | `line-height: 24px` |
| letter-spacing | 0.5px | `letter-spacing: 0.5px` |
| text color | #00101A | `color: var(--color-text-dark)` |
| icon | Pen (24x24px) | Left of text |

**States:**

| State | Changes |
|-------|---------|
| Default | background: #FFEA9E, color: #00101A |
| Hover | background: #FFE077, box-shadow: 0 2px 8px rgba(255, 234, 158, 0.4) |
| Active | background: #FFD54F |
| Focus | outline: 2px solid #FFEA9E, outline-offset: 2px |
| Disabled | opacity: 0.5, cursor: not-allowed, pointer-events: none |

---

### Secondary Button - "Đóng"

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | 3204:6093 | - |
| **Component ID** | 186:2757 | - |
| width | auto (94px) | `width: auto` |
| height | 56px | `height: 56px` |
| padding | 16px | `padding: 16px` |
| background | rgba(255, 234, 158, 0.10) | `background-color: var(--color-btn-secondary-bg)` |
| border | 1px solid #998C5F | `border: 1px solid var(--color-border-gold)` |
| border-radius | 4px | `border-radius: 4px` |
| display | flex | `display: flex` |
| align-items | center | `align-items: center` |
| justify-content | center | `justify-content: center` |
| gap | 8px | `gap: 8px` |
| font-family | Montserrat | `font-family: 'Montserrat', sans-serif` |
| font-size | 16px | `font-size: 16px` |
| font-weight | 700 | `font-weight: 700` |
| line-height | 24px | `line-height: 24px` |
| letter-spacing | 0.5px | `letter-spacing: 0.5px` |
| text color | #FFFFFF | `color: var(--color-text-white)` |
| icon | Close/X (24x24px) | Left of text |

**States:**

| State | Changes |
|-------|---------|
| Default | bg: rgba(255,234,158,0.10), border: 1px solid #998C5F |
| Hover | bg: rgba(255,234,158,0.20), border: 1px solid #FFEA9E |
| Active | bg: rgba(255,234,158,0.30), border: 1px solid #FFEA9E |
| Focus | outline: 2px solid #FFEA9E, outline-offset: 2px |
| Disabled | opacity: 0.5, cursor: not-allowed, pointer-events: none |

---

## Component Hierarchy with Styles

```
Frame: Thể lệ UPDATE (1440x1796, bg: #00101A)
├── Overlay (fixed, inset-0, z-40, bg:rgba(0,16,26,0.7))
└── Panel: Thể Lệ (fixed, right-0, top-0, bottom-0, z-50, w:553, flex-col, space-between, p:24/40/40/40, bg:#00070C, overflow:hidden)
    ├── Content Area (flex-1, overflow-y:auto, min-h:0, flex-col, gap:24) ← SCROLLABLE
    │   ├── Title Frame (flex-col, gap:16)
    │   │   └── "Thể lệ" (45px/700, gold #FFEA9E)
    │   │
    │   └── Body Sections (flex-col, gap:16)
    │       ├── Section: Người nhận (flex-col, gap:16)
    │       │   ├── Heading: "NGƯỜI NHẬN KUDOS..." (22px/700, gold)
    │       │   ├── Description text (16px/700, white, justify)
    │       │   ├── Hero Row: [New Hero pill] + "Có 1-4..." + sub-desc
    │       │   ├── Hero Row: [Rising Hero pill] + "Có 5-9..." + sub-desc
    │       │   ├── Hero Row: [Super Hero pill] + "Có 10-20..." + sub-desc
    │       │   └── Hero Row: [Legend Hero pill] + "Có hơn 20..." + sub-desc
    │       │
    │       ├── Heading: "NGƯỜI GỬI KUDOS..." (22px/700, gold)
    │       ├── Description text (16px/700, white, justify)
    │       ├── Badge Grid (px:24+24, flex-col, gap:16)
    │       │   ├── Row 1 (flex-row, space-between, gap:16)
    │       │   │   ├── Badge: REVIVAL (80px, circle 64px)
    │       │   │   ├── Badge: TOUCH OF LIGHT (80px, circle 64px)
    │       │   │   └── Badge: STAY GOLD (80px, circle 64px)
    │       │   └── Row 2 (flex-row, space-between, gap:16)
    │       │       ├── Badge: FLOW TO HORIZON (80px, circle 64px)
    │       │       ├── Badge: BEYOND THE BOUNDARY (80px, circle 64px)
    │       │       └── Badge: ROOT FURTHER (80px, circle 64px)
    │       │
    │       ├── Completion text (16px/700, white, justify)
    │       ├── Heading: "KUDOS QUỐC DÂN" (24px/700, gold)
    │       └── Description text (16px/700, white, justify)
    │
    └── Button Footer (flex-row, gap:16, flex-shrink:0) ← FIXED at bottom, NOT scrollable
        ├── Btn "Đóng" (secondary, outlined, icon+text)
        └── Btn "Viết KUDOS" (primary, gold bg, icon+text, flex:1)
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

#### Mobile (< 640px)

| Component | Changes |
|-----------|---------|
| Panel | width: 100%, full-screen overlay |
| Title | font-size: 32px |
| Section headings | font-size: 18px |
| Badge grid | 3 columns maintained, badges scale down |
| Buttons | stack vertically or full-width |
| Padding | reduce to 16px |

#### Tablet (640px - 1023px)

| Component | Changes |
|-----------|---------|
| Panel | width: 80%, or slide-in from right |
| Padding | 24px |
| Badge grid | 3 columns maintained |

#### Desktop (>= 1024px)

| Component | Changes |
|-----------|---------|
| Panel | width: 553px, right-aligned |
| Layout | As designed in Figma |

---

## Icon Specifications

| Icon Name | Size | Color | Usage | Component ID |
|-----------|------|-------|-------|-------------|
| Close (X) | 24x24 | #FFFFFF | "Đóng" button prefix | 214:3851 |
| Pen | 24x24 | #00101A | "Viết KUDOS" button prefix | 214:3812 |

---

## Animation & Transitions

| Element | Property | Duration | Easing | Trigger |
|---------|----------|----------|--------|---------|
| Panel | transform (slide-in) | 300ms | ease-out | Open |
| Panel | opacity | 200ms | ease-in | Close |
| Primary Button | background-color | 150ms | ease-in-out | Hover |
| Secondary Button | background-color, border-color | 150ms | ease-in-out | Hover |
| Overlay | opacity | 200ms | ease-in | Open/Close |

---

## Implementation Mapping

| Design Element | Figma Node ID | Tailwind / CSS Class | React Component |
|----------------|---------------|---------------------|-----------------|
| Overlay/Backdrop | — | `fixed inset-0 z-40 bg-[rgba(0,16,26,0.7)] cursor-pointer` | `<RulesPanel />` (backdrop) |
| Panel container | 3204:6052 | `fixed right-0 top-0 bottom-0 z-50 w-[553px] flex flex-col justify-between bg-[#00070C] pt-6 px-10 pb-10 overflow-hidden` | `<RulesPanel />` (panel) |
| Content area | — | `flex-1 overflow-y-auto min-h-0 flex flex-col gap-6` | `<div>` (scrollable wrapper, gap-6 = 24px) |
| Title | 3204:6055 | `text-[45px] font-bold leading-[52px] text-[#FFEA9E] font-montserrat` | `<h2>` |
| Section heading | 3204:6132 | `text-[22px] font-bold leading-7 text-[#FFEA9E] font-montserrat` | `<h3>` |
| Body text | 3204:6133 | `text-base font-bold leading-6 tracking-[0.5px] text-white font-montserrat text-justify` | `<p>` |
| Hero badge pill | 3204:6163 | `inline-flex items-center rounded-full border border-[#FFEA9E] px-3 h-[22px]` | `<HeroBadge tier="new" />` |
| Collection badge | 3204:6082 | `flex flex-col items-center gap-2 w-20` | `<CollectionBadge name="revival" />` |
| Badge icon circle | - | `w-16 h-16 rounded-full border-2 border-white overflow-hidden` | `<BadgeIcon />` |
| Badge label | - | `text-[11px] font-bold leading-4 tracking-[0.5px] text-white text-center` | `<span>` |
| Primary button | 3204:6094 | `flex items-center justify-center gap-2 bg-[#FFEA9E] rounded px-4 py-4 text-base font-bold text-[#00101A]` | `<Button variant="primary">` |
| Secondary button | 3204:6093 | `flex items-center justify-center gap-2 bg-[rgba(255,234,158,0.1)] border border-[#998C5F] rounded px-4 py-4 text-base font-bold text-white` | `<Button variant="secondary">` |
| Button footer | 3204:6092 | `flex gap-4 shrink-0` | `<div>` |

---

## Notes

- All text uses **Montserrat** font family exclusively - must be loaded via Google Fonts or local files
- The design uses a very dark theme (#00101A / #00070C) - ensure sufficient contrast
- Hero badge pills contain background images/gradients that increase in visual complexity by tier
- Collection badges use circular cropped images with white borders
- All icons **MUST BE** in **Icon Component** instead of svg files or img tags
- Badge images should be fetched from the SAA 2025 assets or Figma exports
- The panel appears to be a modal/slide-in overlay on the right side of the screen
- All body text uses font-weight: 700 (bold) throughout - this is intentional per design
