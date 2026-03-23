# Design Style: Floating Action Button

**Frame ID**: `313:9137` (collapsed), `313:9139` (expanded)
**Frame Name**: `Floating Action Button - phim nổi chức năng`
**Figma Link**: https://www.figma.com/design/9ypp4enmFmdK3YAFJLIu6C?node-id=313:9137
**Extracted At**: 2026-03-16
**Reviewed At**: 2026-03-16

---

## Design Tokens

### Colors

| Token Name | Hex Value | Opacity | Usage |
|------------|-----------|---------|-------|
| --color-fab-bg | #FFEA9E | 100% | FAB pill & expanded button background (rgba(255, 234, 158, 1)) |
| --color-fab-text | #00101A | 100% | Separator "/" text & expanded button label color (rgba(0, 16, 26, 1)) |
| --color-page-bg | #00101A | 100% | Page dark background (rgba(0, 16, 26, 1)) |
| --color-fab-glow | #FAE287 | 100% | FAB outer glow shadow color |
| --color-fab-shadow | #000000 | 25% | FAB drop shadow (rgba(0, 0, 0, 0.25)) |
| --color-fab-close-bg | #D4271D | 100% | Close button red background (rgba(212, 39, 29, 1)) |
| --color-fab-close-icon | #FFFFFF | 100% | Close button X icon color |

### Typography

| Token Name | Font Family | Size | Weight | Line Height | Letter Spacing |
|------------|-------------|------|--------|-------------|----------------|
| --text-fab-separator | Montserrat | 24px | 700 | 32px | 0px |
| --text-fab-label | Montserrat | 24px | 700 | 32px | 0px |

### Spacing

| Token Name | Value | Usage |
|------------|-------|-------|
| --spacing-fab-padding | 16px | Internal padding of FAB pill |
| --spacing-fab-gap | 8px | Gap between icon groups inside collapsed FAB pill |
| --spacing-fab-expanded-gap | 20px | Gap between buttons in expanded state |

### Border & Radius

| Token Name | Value | Usage |
|------------|-------|-------|
| --radius-fab | 100px | Full pill/capsule shape for FAB |

### Shadows

| Token Name | Value | Usage |
|------------|-------|-------|
| --shadow-fab | 0 4px 4px 0 rgba(0, 0, 0, 0.25), 0 0 6px 0 #FAE287 | FAB elevation + golden glow |

---

## Layout Specifications

### Container

| Property | Value | Notes |
|----------|-------|-------|
| width | 1440px | Desktop viewport |
| height | 1024px | Full viewport height |
| background | #00101A | Dark background |

### FAB Positioning

| Property | Value | Notes |
|----------|-------|-------|
| position | fixed | Floating over content (Figma uses absolute but implementation MUST use fixed) |
| bottom | ~120px from bottom | startY: 840, endY: 904 in 1024px viewport |
| right | ~143px from right | startX: 1191, endX: 1297 in 1440px viewport |

### Layout Structure (ASCII)

**Collapsed State (frame 313:9137):**
```
┌──────────────────────────────────────────────────────────────┐
│  Page (1440 x 1024, bg: #00101A)                             │
│                                                              │
│                                                              │
│                                         ┌──────────────────┐ │
│                                         │  FAB Pill         │ │
│                                         │  (106 x 64px)    │ │
│                                         │  bg: #FFEA9E     │ │
│                                         │  radius: 100px   │ │
│                                         │  ┌──┐   ┌──┐    │ │
│                                         │  │✏️│ / │⚡│    │ │
│                                         │  └──┘   └──┘    │ │
│                                         └──────────────────┘ │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

**Expanded State (frame 313:9139):**
```
┌──────────────────────────────────────────────────────────────┐
│  Page (1440 x 1024, bg: #00101A)                             │
│                                                              │
│                                                              │
│                                    ┌───────────────────┐     │
│                                    │ ⚡  Thể lệ        │     │
│                                    │ 149x64, r:4, p:16 │     │
│                                    └───────────────────┘     │
│                                              gap: 20px       │
│                               ┌────────────────────────┐     │
│                               │ ✏️  Viết KUDOS         │     │
│                               │ 214x64, r:4, p:16     │     │
│                               └────────────────────────┘     │
│                                              gap: 20px       │
│                                         ┌──────────┐        │
│                                         │    X     │        │
│                                         │ 56x56    │        │
│                                         │ #D4271D  │        │
│                                         └──────────┘        │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

## Component Style Details

### A_Widget Button (FAB Wrapper)

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | 313:9138 | - |
| position | absolute | `position: fixed` (implementation: fixed for scroll persistence) |
| display | flex | `display: flex` |
| align-items | flex-start | `align-items: flex-start` |
| box-shadow | 0 4px 4px 0 rgba(0,0,0,0.25), 0 0 6px 0 #FAE287 | `box-shadow: var(--shadow-fab)` |

**States:**
| State | Changes |
|-------|---------|
| Default | box-shadow: 0 4px 4px 0 rgba(0,0,0,0.25), 0 0 6px 0 #FAE287 |
| Hover | box-shadow: 0 4px 8px 0 rgba(0,0,0,0.35), 0 0 12px 2px #FAE287; transform: scale(1.03) |
| Focus | outline: 2px solid #FAE287; outline-offset: 2px (for keyboard navigation) |
| Active/Click | Transitions to expanded FAB state (frame 313:9139) — collapsed pill hides, expanded menu appears |

---

### Button (FAB Pill)

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | I313:9138;214:3839 | - |
| width | 106px | `width: 106px` |
| height | 64px | `height: 64px` |
| padding | 16px | `padding: 16px` |
| gap | 8px | `gap: 8px` |
| background | #FFEA9E | `background-color: var(--color-fab-bg)` |
| border-radius | 100px | `border-radius: var(--radius-fab)` |
| display | flex | `display: flex` |
| flex-direction | row | `flex-direction: row` |
| align-items | center | `align-items: center` |
| cursor | pointer | `cursor: pointer` |

---

### A.1 - Icon Viết Kudos (Left Icon Group)

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | I313:9138;214:3839;186:1935 | - |
| width | 42px | `width: 42px` |
| height | 32px | `height: 32px` |
| display | flex | `display: flex` |
| flex-direction | row | `flex-direction: row` |
| align-items | center | `align-items: center` |
| gap | 8px | `gap: 8px` |

#### Pen Icon (MM_MEDIA_Pen)

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | I313:9138;214:3839;186:1763 | - |
| width | 24px | `width: 24px` |
| height | 24px | `height: 24px` |
| Component ID | 214:3812 | Component Set: 178:1020 |

#### Separator Text "/"

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | I313:9138;214:3839;186:1568 | - |
| width | 10px | `width: auto` |
| height | 32px | `height: 32px` |
| font-family | Montserrat | `font-family: 'Montserrat', sans-serif` |
| font-size | 24px | `font-size: 24px` |
| font-weight | 700 | `font-weight: 700` |
| line-height | 32px | `line-height: 32px` |
| text-align | center | `text-align: center` |
| color | #00101A | `color: var(--color-fab-text)` |
| content | "/" | Text content: "/" |

---

### A.2 - Icon Thể Lệ SAA (Right Icon)

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | I313:9138;214:3839;186:1766 | - |
| width | 24px | `width: 24px` |
| height | 24px | `height: 24px` |
| Component ID | 214:3752 | Component Set: 178:1020 |

---

### Expanded State Components (frame `313:9139`)

> Values confirmed from `list_frame_styles` on frame `313:9139`.

#### Expanded Container (Widget Button) [313:9140]

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | 313:9140 | - |
| width | 214px | `width: 214px` |
| height | 224px | `height: auto` (content-driven) |
| gap | 20px | `gap: 20px` |
| display | flex | `display: flex` |
| flex-direction | column | `flex-direction: column` |
| align-items | flex-end | `align-items: flex-end` |

#### A - "Thể lệ" Action Button (Top) [I313:9140;214:3799]

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | I313:9140;214:3799 | - |
| width | 149px | `width: 149px` |
| height | 64px | `height: 64px` |
| padding | 16px | `padding: 16px` |
| gap | 8px | `gap: 8px` |
| background | #FFEA9E | `background-color: var(--color-fab-bg)` |
| border-radius | 4px | `border-radius: 4px` |
| display | flex | `display: flex; flex-direction: row; align-items: center` |
| font | Montserrat 700 24px/32px | `font-family: Montserrat; font-weight: 700; font-size: 24px; line-height: 32px` |
| color | #00101A | `color: var(--color-fab-text)` |
| content | ⚡ + "Thể lệ" | Lightning icon (MM_MEDIA_LOGO, 214:3752) + label text |
| cursor | pointer | `cursor: pointer` |
| Navigation | → `/awards/rules` (frame `3204:6051`) | "Thể lệ" page |

**States:**
| State | Changes |
|-------|---------|
| Default | background: #FFEA9E |
| Hover | background: #F5E08E (slightly darker); box-shadow: 0 2px 4px rgba(0,0,0,0.15) *(estimated from design intent: "tăng bóng nhẹ")* |
| Focus | outline: 2px solid #FAE287; outline-offset: 2px |

#### B - "Viết KUDOS" Action Button (Middle) [I313:9140;214:3732]

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | I313:9140;214:3732 | - |
| width | 214px | `width: 214px` |
| height | 64px | `height: 64px` |
| padding | 16px | `padding: 16px` |
| gap | 8px | `gap: 8px` |
| background | #FFEA9E | `background-color: var(--color-fab-bg)` |
| border-radius | 4px | `border-radius: 4px` |
| display | flex | `display: flex; flex-direction: row; align-items: center` |
| font | Montserrat 700 24px/32px | `font-family: Montserrat; font-weight: 700; font-size: 24px; line-height: 32px` |
| color | #00101A | `color: var(--color-fab-text)` |
| content | ✏️ + "Viết KUDOS" | Pen icon (MM_MEDIA_Pen, 214:3812) + label text |
| cursor | pointer | `cursor: pointer` |
| Navigation | → frame `520:11602` | "Viết Kudo" modal |

**States:** Same as "Thể lệ" button above.

#### C - Close (X) Button (Bottom) [I313:9140;214:3827]

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | I313:9140;214:3827 | - |
| width | 56px | `width: 56px` |
| height | 56px | `height: 56px` |
| padding | 16px | `padding: 16px` |
| background | #D4271D | `background-color: var(--color-fab-close-bg)` |
| border-radius | 100px | `border-radius: 100px` (full circle) |
| display | flex | `display: flex; flex-direction: row; align-items: center; justify-content: center` |
| icon | MM_MEDIA_Close (24x24px) | Icon Component (214:3851, set: 178:1020) |
| icon color | #FFFFFF | `color: var(--color-fab-close-icon)` |
| cursor | pointer | `cursor: pointer` |

**States:**
| State | Changes |
|-------|---------|
| Default | background: #D4271D |
| Hover | background: #B8211A (darker red) |
| Focus | outline: 2px solid #D4271D; outline-offset: 2px |

---

## Component Hierarchy with Styles

```
FloatingActionButton (position: fixed, bottom-right, z-50)
│
├── [Collapsed State - frame 313:9137]
│   └── A_Widget Button [313:9138]
│       │   shadow: 0 4px 4px rgba(0,0,0,0.25), 0 0 6px #FAE287
│       │
│       └── Button [I313:9138;214:3839] (w: 106px, h: 64px, p: 16px)
│           │   bg: #FFEA9E, radius: 100px, flex row, gap: 8px
│           │
│           ├── A.1_icon viết kudos [I313:9138;214:3839;186:1935] (w: 42px, h: 32px)
│           │   │   flex row, items-center, gap: 8px
│           │   │
│           │   ├── Pen Icon [I313:9138;214:3839;186:1763] (24x24px)
│           │   └── "/" Text [I313:9138;214:3839;186:1568]
│           │       font: Montserrat 700 24px/32px, color: #00101A
│           │
│           └── A.2_icon thể lệ saa [I313:9138;214:3839;186:1766] (24x24px)
│               └── Lightning/Rules Icon Group (20x18px)
│
└── [Expanded State - frame 313:9139]
    └── Widget Button [313:9140] (w: 214px, h: 224px)
        │   flex column, align-items: flex-end, gap: 20px
        │
        ├── A_Button thể lệ [I313:9140;214:3799] (w: 149px, h: 64px, p: 16px)
        │   │   bg: #FFEA9E, radius: 4px, flex row, gap: 8px
        │   │
        │   ├── MM_MEDIA_LOGO Icon [I313:9140;214:3799;186:1763] (24x24px)
        │   └── "Thể lệ" Text [I313:9140;214:3799;186:1568]
        │       font: Montserrat 700 24px/32px, color: #00101A
        │
        ├── B_Button viết kudos [I313:9140;214:3732] (w: 214px, h: 64px, p: 16px)
        │   │   bg: #FFEA9E, radius: 4px, flex row, gap: 8px
        │   │
        │   ├── MM_MEDIA_Pen Icon [I313:9140;214:3732;186:1763] (24x24px)
        │   └── "Viết KUDOS" Text [I313:9140;214:3732;186:1568]
        │       font: Montserrat 700 24px/32px, color: #00101A
        │
        └── C_Button huỷ [I313:9140;214:3827] (w: 56px, h: 56px, p: 16px)
            │   bg: #D4271D, radius: 100px (circle)
            └── MM_MEDIA_Close Icon [I313:9140;214:3827;186:1766] (24x24px, white)
```

---

## Responsive Specifications

### Breakpoints

| Name | Min Width | Max Width |
|------|-----------|-----------|
| Mobile | 0 | 639px |
| Tablet | 640px | 1023px (< 1024px) |
| Desktop | 1024px | ∞ |

### Responsive Changes

#### Mobile (< 640px)

| Component | Changes |
|-----------|---------|
| FAB | position: fixed, bottom: 20px, right: 16px |
| FAB Pill | Same dimensions (106x64px) - touch-friendly at 64px height |

#### Tablet (640px - 1023px)

| Component | Changes |
|-----------|---------|
| FAB | position: fixed, bottom: 24px, right: 24px |

#### Desktop (≥ 1024px)

| Component | Changes |
|-----------|---------|
| FAB | position: fixed, bottom: ~120px, right: ~143px (as per Figma) |

---

## Icon Specifications

| Icon Name | Component ID | Component Set | Size | Usage |
|-----------|-------------|---------------|------|-------|
| MM_MEDIA_Pen (Pen/Write icon) | 214:3812 | 178:1020 | 24x24px | Write kudos action (collapsed + expanded) |
| MM_MEDIA_LOGO (Lightning/Rules icon) | 214:3752 | 178:1020 | 24x24px (inner: 20x18px) | View rules action (collapsed + expanded) |
| MM_MEDIA_Close (Close/X icon) | 214:3851 | 178:1020 | 24x24px | Close/collapse expanded FAB |

---

## Animation & Transitions

| Element | Property | Duration | Easing | Trigger |
|---------|----------|----------|--------|---------|
| FAB Pill (collapsed) | box-shadow | 200ms | ease-in-out | Hover |
| FAB Pill (collapsed) | transform: scale(1.03) | 200ms | ease-out | Hover |
| FAB Pill (collapsed) | opacity, transform | 300ms | ease-out | Page load (fade-in) |
| Collapsed → Expanded | Pill: opacity 0 + scale(0.8); Menu: opacity 1 + translateY(0) | 250ms | ease-out | Click on pill |
| Expanded → Collapsed | Menu: opacity 0 + translateY(10px); Pill: opacity 1 + scale(1) | 200ms | ease-in | Click X / outside / Escape |
| Expanded action buttons | background-color | 150ms | ease-in-out | Hover |

---

## Implementation Mapping

| Design Element | Figma Node ID | Tailwind / CSS Class | React Component |
|----------------|---------------|---------------------|-----------------|
| FAB Container | 313:9138 | `fixed bottom-5 right-4 lg:bottom-[120px] lg:right-[143px] z-50` | `<FloatingActionButton />` |
| FAB Pill (collapsed) | I313:9138;214:3839 | `flex items-center gap-2 px-4 py-4 bg-[#FFEA9E] rounded-full shadow-fab cursor-pointer` | Collapsed state inner button |
| Pen Icon | I313:9138;214:3839;186:1763 | `w-6 h-6` | `<PenIcon />` (Icon Component) |
| Separator | I313:9138;214:3839;186:1568 | `font-montserrat text-2xl font-bold leading-8 text-[#00101A]` | `<span>/</span>` |
| Rules Icon | I313:9138;214:3839;186:1766 | `w-6 h-6` | `<RulesIcon />` (Icon Component) |
| Expanded Container | 313:9140 | `flex flex-col items-end gap-5 w-[214px]` | Expanded state wrapper |
| "Thể lệ" Button | I313:9140;214:3799 | `flex items-center gap-2 w-[149px] h-16 p-4 bg-fab rounded font-montserrat font-bold text-2xl leading-8 text-fab-text cursor-pointer hover:bg-[#F5E08E]` | Expanded action button |
| "Viết KUDOS" Button | I313:9140;214:3732 | `flex items-center gap-2 w-[214px] h-16 p-4 bg-fab rounded font-montserrat font-bold text-2xl leading-8 text-fab-text cursor-pointer hover:bg-[#F5E08E]` | Expanded action button |
| Close Button | I313:9140;214:3827 | `w-14 h-14 rounded-full bg-[#D4271D] hover:bg-[#B8211A] flex items-center justify-center text-white cursor-pointer p-4` | Close button |

> **Note on arbitrary values**: Constitution recommends design tokens from Tailwind config. Consider extending `tailwind.config` with `fab` theme tokens (e.g., `colors.fab.bg: '#FFEA9E'`) to avoid inline arbitrary values like `bg-[#FFEA9E]`.

---

## Notes

- All colors should use CSS variables for theming support
- Prefer Tailwind utility classes as per project constitution (TailwindCSS 4.x)
- Icons **MUST BE** in **Icon Component** instead of svg files or img tags
- The FAB uses `position: fixed` in implementation (not `absolute`) to remain visible during scroll
- Font Montserrat must be loaded for the "/" separator (check if already in project fonts)
- The golden glow shadow (#FAE287) is a key visual identity element - must be preserved
- Touch target (106x64px) exceeds the 44x44px minimum requirement from constitution
