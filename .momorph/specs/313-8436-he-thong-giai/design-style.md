# Design Style: Hệ thống giải thưởng SAA 2025

**Frame ID**: `313:8436`
**Frame Name**: `Hệ thống giải`
**File Key**: `9ypp4enmFmdK3YAFJLIu6C`
**Extracted At**: 2026-03-12
**Reviewed**: 2026-03-12 (10th pass — implementation-ready)

---

## Design Tokens

### Colors

| Token Name | Hex Value | Opacity | Usage |
|------------|-----------|---------|-------|
| --color-page-bg | #00101A | 100% | Page background (deep dark blue) |
| --color-header-bg | rgba(16, 20, 23, 0.80) | 80% | Header background overlay |
| --color-section-bg | #0F0F0F | 100% | Dark content section backgrounds |
| --color-gold-primary | #FFEA9E | 100% | Active nav text, award titles, section headers |
| --color-gold-glow | #FAE287 | 100% | Glow effects (box-shadow, text-shadow) |
| --color-gold-muted | #998C5F | 100% | Border accents (user profile, muted gold) |
| --color-gold-hover | rgba(255, 234, 158, 0.10) | 10% | Button hover/active background |
| --color-text-primary | #FFFFFF | 100% | Body text, nav text, descriptions |
| --color-divider-fill | #2E3940 | 100% | Divider rectangles, separator fills, "Hoặc" text (same as --color-divider) |
| --color-cta-bg | #DBD1C1 | 100% | "Chi tiết" CTA button background |
| --color-cta-text | #00101A | 100% | "Chi tiết" CTA button text |
| --color-notification | #D4271D | 100% | Notification badge dot (red) |
| --color-kudos-deco | #DBD1C1 | 100% | Decorative "KUDOS" large text |
| --color-divider | #2E3940 | 100% | Footer top border, card dividers (consolidate with --color-divider-fill) |
| --color-gradient-start | #00101A | 100% | Cover gradient start (bottom) |
| --color-gradient-end | rgba(0, 19, 32, 0.00) | 0% | Cover gradient end (transparent) |

### Typography

| Token Name | Font Family | Size | Weight | Line Height | Letter Spacing | Color |
|------------|-------------|------|--------|-------------|----------------|-------|
| --text-hero-title | Montserrat | 57px | 700 | 64px | -0.25px | #FFFFFF |
| --text-page-title | Montserrat | 57px | 700 | 64px | -0.25px | #FFEA9E |
| --text-subtitle | Montserrat | 24px | 700 | 32px | 0px | #FFFFFF |
| --text-stat-number | Montserrat | 36px | 700 | 44px | 0px | #FFEA9E |
| --text-section-heading | Montserrat | 24px | 700 | 32px | 0px | #FFEA9E |
| --text-body | Montserrat | 16px | 700 | 24px | 0.5px | #FFFFFF |
| --text-nav-primary | Montserrat | 16px | 700 | 24px | 0.15px | #FFFFFF (default) / #FFEA9E (active) |
| --text-button | Montserrat | 16px | 700 | 24px | 0.15px | #00101A (CTA) |
| --text-label | Montserrat | 14px | 700 | 20px | 0.1px | #FFEA9E |
| --text-nav-secondary | Montserrat | 14px | 700 | 20px | 0.1px | #FFFFFF |
| --text-sidebar-tab | Montserrat | 14px | 700 | 20px | 0.25px | #FFFFFF (default) / #FFEA9E (active) |
| --text-kudos-title | Montserrat | 57px | 700 | 64px | -0.25px | #FFEA9E |
| --text-kudos-label | Montserrat | 24px | 700 | 32px | 0px | #FFEA9E |
| --text-copyright | Montserrat Alternates | 16px | 700 | 24px | 0% | #FFFFFF |
| --text-kudos-deco | SVN-Gotham | ~96px | 400 | ~24px | -13% | #DBD1C1 |

### Spacing

| Token Name | Value | Usage |
|------------|-------|-------|
| --spacing-section-gap | 120px | Between major page sections |
| --spacing-content-padding | 96px 144px | Main content area padding |
| --spacing-header-padding | 12px 144px | Header vertical/horizontal padding |
| --spacing-award-gap | 80px | Sidebar-to-content gap in award system |
| --spacing-footer-padding | 40px 90px | Footer padding |
| --spacing-card-gap | 48px | Gap between image and content within each award card (flex gap) |
| --spacing-kv-gap | 40px | Key visual section internal gap |
| --spacing-medium | 32px | Medium section gaps |
| --spacing-nav-gap | 24px | Nav link group spacing |
| --spacing-small | 16px | Small section gaps, nav items |
| --spacing-xs | 10px | General small gap |
| --spacing-icon-text | 4px | Inline icon+text pairs |

### Border & Radius

| Token Name | Value | Usage |
|------------|-------|-------|
| --radius-none | 0px | Most frames (no rounding) |
| --radius-sm | 4px | Buttons, nav items |
| --radius-card-image | 16px | Award card images |
| --radius-card | 24px | Award card containers |
| --radius-full | 100px | Notification badge dot (circle) |
| --border-profile | 1px solid #998C5F | User profile icon button |
| --border-award-image | 0.955px solid #FFEA9E | Award image frame border |
| --border-active-nav | border-bottom: 1px solid #FFEA9E | Active nav tab underline |
| --border-footer | border-top: 1px solid #2E3940 | Footer top divider |

### Shadows

| Token Name | Value | Usage |
|------------|-------|-------|
| --shadow-gold-glow | 0 4px 4px 0 rgba(0,0,0,0.25), 0 0 6px 0 #FAE287 | Gold glow on award picture frames |
| --text-shadow-gold | 0 4px 4px rgba(0,0,0,0.25), 0 0 6px #FAE287 | Gold glow on active nav/sidebar text |

---

## Layout Specifications

### Container

| Property | Value | Notes |
|----------|-------|-------|
| page-width | 1440px | Full page width |
| content-max-width | 1152px | 1440px - 2 * 144px padding |
| padding-x | 144px | Horizontal padding |
| padding-y | 96px | Vertical padding |
| header-height | 80px | Fixed header height |

### Grid/Flex Layout

| Property | Value | Notes |
|----------|-------|-------|
| display | flex | Main layout |
| flex-direction | column | Vertical stack for page sections |
| gap | 120px | Between major sections |
| align-items | flex-start | Content left-aligned |

### Layout Structure (ASCII)

```
┌─────────────────────────────────────────────────────────────────┐
│  Page Root (w: 1440px, bg: #00101A)                             │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  Header (w: 1440px, h: 80px, bg: rgba(16,20,23,0.80))   │  │
│  │  position: fixed, z-index: 50                            │  │
│  │  px: 144px, py: 12px, flex, row, space-between           │  │
│  │  ┌────────┐  ┌──────────────────────┐  ┌──────────────┐  │  │
│  │  │ Logo   │  │ Nav Links (gap:24px) │  │ User Actions │  │  │
│  │  └────────┘  └──────────────────────┘  └──────────────┘  │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  Keyvisual / Hero (w: 1440px, h: 547px)                  │  │
│  │  background: cover image                                  │  │
│  │  ┌─────────────────────────────────────────────────────┐  │  │
│  │  │  Cover Gradient (h: 627px, gradient bottom→up)      │  │  │
│  │  │  "ROOT FURTHER" (decorative image asset)            │  │  │
│  │  │  (root-further-hero.png, same as homepage)          │  │  │
│  │  └─────────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  Main Content "Bia" (w: 1440px, px: 144px, py: 96px)     │  │
│  │  flex, column, gap: 120px                                 │  │
│  │                                                           │  │
│  │  ┌─────────────────────────────────────────────────────┐  │  │
│  │  │  A. Section Title (w: 1152px)                       │  │  │
│  │  │  NOTE: Visually overlaps hero artwork background    │  │  │
│  │  │  "Sun* Annual Awards 2025" (24px, white, center)    │  │  │
│  │  │  ── divider line (1152×1px, #2E3940) ──             │  │  │
│  │  │  "Hệ thống giải thưởng SAA 2025" (57px, gold)      │  │  │
│  │  └─────────────────────────────────────────────────────┘  │  │
│  │                                                           │  │
│  │  ┌─────────────────────────────────────────────────────┐  │  │
│  │  │  B. Award System (w: 1152px, flex, row, gap: 80px)  │  │  │
│  │  │                                                     │  │  │
│  │  │  ┌──────────┐  ┌────────────────────────────────┐   │  │  │
│  │  │  │ Sidebar  │  │  Award Cards (flex, column)    │   │  │  │
│  │  │  │ Menu     │  │                                │   │  │  │
│  │  │  │ (sticky) │  │  ┌──────────────────────────┐  │   │  │  │
│  │  │  │          │  │  │ Card: Top Talent         │  │   │  │  │
│  │  │  │ • Top    │  │  │ (flex, row, gap: 48px)   │  │   │  │  │
│  │  │  │   Talent │  │  │ ┌──────┐ ┌────────────┐  │  │   │  │  │
│  │  │  │ • Top    │  │  │ │Image │ │Content     │  │  │   │  │  │
│  │  │  │   Proj.  │  │  │ │336x  │ │Title+Desc  │  │  │   │  │  │
│  │  │  │ • TPL    │  │  │ │336px │ │Stats+Value │  │  │   │  │  │
│  │  │  │ • Best   │  │  │ └──────┘ └────────────┘  │  │   │  │  │
│  │  │  │   Mgr    │  │  └──────────────────────────┘  │   │  │  │
│  │  │  │ • Sig    │  │                                │   │  │  │
│  │  │  │   2025   │  │  ┌──────────────────────────┐  │   │  │  │
│  │  │  │ • MVP    │  │  │ Card: Top Project        │  │   │  │  │
│  │  │  │          │  │  └──────────────────────────┘  │   │  │  │
│  │  │  └──────────┘  │  ... (4 more cards)            │   │  │  │
│  │  │                 └────────────────────────────────┘   │  │  │
│  │  └─────────────────────────────────────────────────────┘  │  │
│  │                                                           │  │
│  │  ┌─────────────────────────────────────────────────────┐  │  │
│  │  │  D1. Sun* Kudos Section (w: 1152px, h: 500px)      │  │  │
│  │  │  flex, ROW, space-between, align-items: center      │  │  │
│  │  │  ┌──────────────────────┐ ┌──────────────────────┐  │  │  │
│  │  │  │ Left: text+CTA      │ │ Right: logo/artwork  │  │  │  │
│  │  │  │ "Phong trào ghi nhận"│ │ Sun* Kudos logo      │  │  │  │
│  │  │  │ "Sun* Kudos" (large) │ │ + deco "KUDOS"       │  │  │  │
│  │  │  │ "ĐIỂM MỚI..." + desc│ │                      │  │  │  │
│  │  │  │ "Chi tiết" button    │ │                      │  │  │  │
│  │  │  └──────────────────────┘ └──────────────────────┘  │  │  │
│  │  └─────────────────────────────────────────────────────┘  │  │
│  │                                                           │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  Footer (w: 1440px, px: 90px, py: 40px)                  │  │
│  │  border-top: 1px solid #2E3940                            │  │
│  │  flex, row, space-between                                 │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Component Style Details

### Header Navigation

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | 313:8437 (parent) | - |
| width | 1440px | `width: 100%` |
| height | 80px | `height: 80px` |
| padding | 12px 144px | `padding: 12px 144px` |
| background | rgba(16, 20, 23, 0.80) | `background: rgba(16, 20, 23, 0.80)` |
| display | flex | `display: flex` |
| flex-direction | row | `flex-direction: row` |
| justify-content | space-between | `justify-content: space-between` |
| align-items | center | `align-items: center` |

### Nav Link (Default)

| Property | Value | CSS |
|----------|-------|-----|
| font-family | Montserrat | `font-family: 'Montserrat', sans-serif` |
| font-size | 16px | `font-size: 16px` |
| font-weight | 700 | `font-weight: 700` |
| line-height | 24px | `line-height: 24px` |
| letter-spacing | 0.15px | `letter-spacing: 0.15px` |
| color | #FFFFFF | `color: #FFFFFF` |
| padding | 16px | `padding: 16px` |
| border-radius | 4px | `border-radius: 4px` |
| background | transparent | `background: transparent` |

**States:**
| State | Changes |
|-------|---------|
| Default | color: #FFFFFF, background: transparent |
| Hover | background: rgba(255, 234, 158, 0.10) |
| Active | color: #FFEA9E, border-bottom: 1px solid #FFEA9E, text-shadow: 0 4px 4px rgba(0,0,0,0.25), 0 0 6px #FAE287 |
| Focus | outline: 2px solid #FFEA9E, outline-offset: 2px |

### Sidebar Navigation Menu

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | 313:8459 | - |
| display | flex | `display: flex` |
| flex-direction | column | `flex-direction: column` |
| gap | 0px | `gap: 0` |
| width | auto (content-driven) | `min-w-[180px]` (estimated ~180-200px based on longest tab text "Top Project Leader") |
| flex-shrink | 0 | `flex-shrink: 0` (prevent sidebar from shrinking in flex row) |
| position | sticky | `position: sticky` |
| top | 96px | `top: 96px` (header height 80px + 16px offset) |
| align-self | flex-start | `align-self: flex-start` |

### Sidebar Tab Item

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | 313:8460 - 313:8465 | - |
| display | flex | `display: flex` |
| align-items | center | `align-items: center` |
| gap | 8px | `gap: 8px` (icon to text) |
| font-family | Montserrat | `font-family: 'Montserrat', sans-serif` |
| font-size | 14px | `font-size: 14px` |
| font-weight | 700 | `font-weight: 700` |
| line-height | 20px | `line-height: 20px` |
| letter-spacing | 0.25px | `letter-spacing: 0.25px` |
| text-align | left | `text-align: left` |
| color | #FFFFFF | `color: #FFFFFF` |
| padding | 16px | `padding: 16px` |

**Prefix Icon:** Each tab item has a small circular award/target icon (16x16) before the text. Icon color matches text state (white default, gold active).

**States:**
| State | Changes |
|-------|---------|
| Default | color: #FFFFFF, icon: #FFFFFF, no border |
| Active | color: #FFEA9E, icon: #FFEA9E, border-bottom: 1px solid #FFEA9E, text-shadow: gold glow |
| Hover | background: rgba(255, 234, 158, 0.10) |
| Focus | outline: 2px solid #FFEA9E, outline-offset: -2px |

### Section Title

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | 313:8453 | - |
| display | flex | `display: flex` |
| flex-direction | column | `flex-direction: column` |
| align-items | flex-start | `align-items: flex-start` |
| width | 1152px | `width: 100%` |

**Children:**
| # | Element | Node ID | Styles |
|---|---------|---------|--------|
| 1 | Subtitle "Sun* Annual Awards 2025" | 313:8454 | 24px, Montserrat Bold, #FFFFFF, text-align: center, line-height: 32px (`--text-subtitle`) |
| 2 | Divider line | 313:8455 | 1152×1px, bg: #2E3940 (`--color-divider`) |
| 3 | Title "Hệ thống giải thưởng SAA 2025" | 313:8457 | 57px, Montserrat Bold, #FFEA9E, line-height: 64px, letter-spacing: -0.25px (`--text-page-title`) |

**Note:** The subtitle is center-aligned while the title is left-aligned (within a center-justified wrapper frame 313:8456). The visual effect is subtitle centered above and title left-aligned below, separated by the divider.

### Award Cards Container

| Property | Value | CSS |
|----------|-------|-----|
| display | flex | `display: flex` |
| flex-direction | column | `flex-direction: column` |
| gap | 120px | `gap: 120px` |

### Award Card

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | 313:8467 (Top Talent as reference) | - |
| display | flex | `display: flex` |
| flex-direction | row (odd cards) / row-reverse (even cards) | `flex-direction: row` or `flex-direction: row-reverse` |
| gap | 48px | `gap: 48px` |
| padding | 0px | `padding: 0` |
| border-radius | 24px | `border-radius: 24px` (from Figma frame; card has no visible bg, so only applies if a hover/focus bg is added) |
| width | 100% | `width: 100%` |

**Alternating Layout Rule:**
| Card Position | Layout Direction | CSS |
|---------------|-----------------|-----|
| 1st (Top Talent) | Image left, Content right | `flex-direction: row` |
| 2nd (Top Project) | Content left, Image right | `flex-direction: row-reverse` |
| 3rd (Top Project Leader) | Image left, Content right | `flex-direction: row` |
| 4th (Best Manager) | Content left, Image right | `flex-direction: row-reverse` |
| 5th (Signature 2025) | Image left, Content right | `flex-direction: row` |
| 6th (MVP) | Content left, Image right | `flex-direction: row-reverse` |

### Award Card - Image

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | I313:8467;214:2525 | - |
| width | 336px | `width: 336px` |
| height | 336px | `height: 336px` |
| border-radius | 16px | `border-radius: 16px` |
| border | 0.955px solid #FFEA9E | `border: 1px solid #FFEA9E` |
| box-shadow | 0 4px 4px 0 rgba(0,0,0,0.25), 0 0 6px 0 #FAE287 | `box-shadow: var(--shadow-gold-glow)` |
| object-fit | cover | `object-fit: cover` |
| flex-shrink | 0 | `flex-shrink: 0` (prevent image from shrinking in flex row) |

### Award Card - Content

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | I313:8467;214:2526 | - |
| display | flex | `display: flex` |
| flex-direction | column | `flex-direction: column` |
| gap | 16px | `gap: 16px` (between title row, description, dividers, stat rows) |
| flex | 1 | `flex: 1` |
| justify-content | center | `justify-content: center` |

**Internal Content Order & Spacing:**
| # | Element | Layout | Gap After |
|---|---------|--------|-----------|
| 1 | Title Row (icon 16x16 + title text) | flex, row, align-items: center, gap: 8px | 16px |
| 2 | Description paragraph | block text, text-align: justify | 16px |
| 3 | Divider line (1px, #2E3940) | full width | 16px |
| 4 | **Quantity Stat (SINGLE INLINE ROW):** icon + "Số lượng giải thưởng:" (14px gold) + number (36px gold) + unit text (14px white, may wrap vertically beside number) | flex, row, align-items: baseline, gap: 4-8px | 16px |
| 5 | Divider line (1px, #2E3940) | full width | 16px |
| 6 | **Prize Section (MULTI-LINE):** | flex, column | — |
| 6.1 | → Label row: icon + "Giá trị giải thưởng:" (14px gold) | flex, row, gap: 4px | ~4px |
| 6.2 | → Value: "X.XXX.XXX VNĐ" (36px gold) | block | ~4px |
| 6.3 | → Sub-label: "cho [qualifier]" (14px white) — optional | block | — |
| 7 | *(Signature 2025 only)* "Hoặc" inline-labeled divider | flex, row (see component below) | 16px |
| 7.1 | → **Second Prize Section (same structure as #6):** icon + "Giá trị giải thưởng:" + amount + sub-label | flex, column (repeat of #6) | — |

### Award Card - Title Row

| Property | Value | CSS |
|----------|-------|-----|
| display | flex | `display: flex` |
| align-items | center | `align-items: center` |
| gap | 8px | `gap: 8px` (icon to title text) |

**Prefix Icon:** Same circular award/target icon as sidebar (16x16, #FFEA9E). Placed before the title text.

**Title Text:**
| Property | Value | CSS |
|----------|-------|-----|
| font-family | Montserrat | `font-family: 'Montserrat', sans-serif` |
| font-size | 24px | `font-size: 24px` |
| font-weight | 700 | `font-weight: 700` |
| line-height | 32px | `line-height: 32px` |
| color | #FFEA9E | `color: var(--color-gold-primary)` |

### Award Card - Description

| Property | Value | CSS |
|----------|-------|-----|
| font-family | Montserrat | `font-family: 'Montserrat', sans-serif` |
| font-size | 16px | `font-size: 16px` |
| font-weight | 700 | `font-weight: 700` |
| line-height | 24px | `line-height: 24px` |
| letter-spacing | 0.5px | `letter-spacing: 0.5px` |
| color | #FFFFFF | `color: #FFFFFF` |
| text-align | justify | `text-align: justify` |

### Award Card - Stat Number

| Property | Value | CSS |
|----------|-------|-----|
| font-family | Montserrat | `font-family: 'Montserrat', sans-serif` |
| font-size | 36px | `font-size: 36px` |
| font-weight | 700 | `font-weight: 700` |
| line-height | 44px | `line-height: 44px` |
| color | #FFEA9E | `color: var(--color-gold-primary)` |

### Award Card - Label ("Số lượng giải thưởng:", "Giá trị giải thưởng:")

| Property | Value | CSS |
|----------|-------|-----|
| font-family | Montserrat | `font-family: 'Montserrat', sans-serif` |
| font-size | 14px | `font-size: 14px` |
| font-weight | 700 | `font-weight: 700` |
| line-height | 20px | `line-height: 20px` |
| letter-spacing | 0.1px | `letter-spacing: 0.1px` |
| color | #FFEA9E | `color: var(--color-gold-primary)` |

### Award Card - Sub-label ("cho mỗi giải thưởng", "cho giải cá nhân", etc.)

| Property | Value | CSS |
|----------|-------|-----|
| font-family | Montserrat | `font-family: 'Montserrat', sans-serif` |
| font-size | 14px | `font-size: 14px` |
| font-weight | 700 | `font-weight: 700` |
| line-height | 20px | `line-height: 20px` |
| color | #FFFFFF | `color: var(--color-text-primary)` |

### Award Card - Divider Line

| Property | Value | CSS |
|----------|-------|-----|
| width | 100% | `width: 100%` |
| height | 1px | `height: 1px` |
| background | #2E3940 | `background: var(--color-divider)` |

### Award Card - Stat Row Icon (Pin icon for quantity, Badge icon for prize)

| Property | Value | CSS |
|----------|-------|-----|
| size | 16x16 | `width: 16px; height: 16px` |
| color | #FFEA9E | `color: var(--color-gold-primary)` |
| gap-to-label | 4px | `gap: 4px` (inline with label text) |

### Award Card - "Hoặc" Inline-Labeled Divider (Signature 2025 only)

A horizontal divider line with "Hoặc" text centered on it (the text breaks the line, lines extend on both sides).

| Property | Value | CSS |
|----------|-------|-----|
| **Layout** | flex, row, align-items: center, gap: 8px | `flex items-center gap-2` |
| **Left line** | flex: 1, height: 1px, bg: #2E3940 | `flex-1 h-px bg-[#2E3940]` |
| **"Hoặc" text** | Montserrat, 14px, 700, #2E3940 | `text-sm font-bold text-[#2E3940]` |
| **Right line** | flex: 1, height: 1px, bg: #2E3940 | `flex-1 h-px bg-[#2E3940]` |

This pattern separates the two prize tiers (individual and team) within the Signature 2025 card.

### Sun* Kudos Section Container

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | 335:12023 | - |
| width | 1152px | `width: 100%` |
| height | 500px | `height: 500px` (desktop), `height: auto` (mobile) |
| display | flex | `display: flex` |
| flex-direction | **row** | `flex-direction: row` |
| justify-content | space-between | `justify-content: space-between` |
| align-items | center | `align-items: center` |
| position | relative | `position: relative` (for decorative "KUDOS" overlay) |
| overflow | hidden | `overflow: hidden` (clip decorative text) |
| background | #0F0F0F (or dark gradient) | `background: var(--color-section-bg)` |

**Sub-layout (Left column: I335:12023;313:8420, flex column, gap: 16px, w: 457px):**
| # | Element | Node ID | Styles |
|---|---------|---------|--------|
| 1 | "Phong trào ghi nhận" | I335:12023;313:8421 | 24px, Montserrat Bold, #FFEA9E (gold), text-align: left (`--text-kudos-label`) — designer-confirmed gold color (overrides Figma #FFFFFF) |
| 2 | "Sun* Kudos" | I335:12023;313:8422 | 57px, Montserrat Bold, #FFEA9E, line-height: 64px, letter-spacing: -0.25px (`--text-kudos-title`) — same metrics as `--text-page-title` |
| 3 | "ĐIỂM MỚI CỦA SAA 2025\n[description paragraph]" | I335:12023;313:8423 | **Single text node**: 16px, Montserrat Bold, #FFFFFF, line-height: 24px, letter-spacing: 0.5px, text-align: justified. First line "ĐIỂM MỚI CỦA SAA 2025" is visually uppercase but is part of the same text block as the description |
| 4 | "Chi tiết →" button | I335:12023;313:8426 | See CTA Button component below |

**Right column:**
| Part | Layout | Content |
|------|--------|---------|
| Right column | flex, center | Sun* Kudos logo (S-wing mark + "KUDOS" wordmark) with decorative large "KUDOS" text behind |

### Sun* Kudos - Description Block (including "ĐIỂM MỚI CỦA SAA 2025")

**Note:** In Figma, "ĐIỂM MỚI CỦA SAA 2025" and the description paragraph are a **single text node** (I335:12023;313:8423). The sub-heading is the first line, separated from the body by a line break. In implementation, this can be rendered as a single `<p>` with the first line styled via `<span class="uppercase">` or split into two elements for semantic clarity.

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | I335:12023;313:8423 | - |
| font-family | Montserrat | `font-family: 'Montserrat', sans-serif` |
| font-size | 16px | `font-size: 16px` |
| font-weight | 700 | `font-weight: 700` |
| line-height | 24px | `line-height: 24px` |
| letter-spacing | 0.5px | `letter-spacing: 0.5px` |
| color | #FFFFFF | `color: var(--color-text-primary)` |
| text-align | justify | `text-align: justify` |
| **First line** | "ĐIỂM MỚI CỦA SAA 2025" | Visually uppercase (content is uppercase in source text) |

### "Chi tiết" CTA Button (Sun* Kudos)

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | I335:12023;313:8426 | - |
| font-family | Montserrat | `font-family: 'Montserrat', sans-serif` |
| font-size | 16px | `font-size: 16px` |
| font-weight | 700 | `font-weight: 700` |
| line-height | 24px | `line-height: 24px` |
| color | #00101A | `color: var(--color-cta-text)` |
| background | #DBD1C1 | `background: var(--color-cta-bg)` |
| padding | 16px | `padding: 16px` |
| border-radius | 4px | `border-radius: 4px` |
| cursor | pointer | `cursor: pointer` |

**States:**
| State | Changes |
|-------|---------|
| Default | background: #DBD1C1, color: #00101A |
| Hover | opacity: 0.9 (estimated) |
| Focus | outline: 2px solid #FFEA9E, outline-offset: 2px |
| Active | transform: scale(0.98) |

### Footer

| Property | Value | CSS |
|----------|-------|-----|
| width | 1440px | `width: 100%` |
| padding | 40px 90px | `padding: 40px 90px` |
| border-top | 1px solid #2E3940 | `border-top: 1px solid var(--color-divider)` |
| display | flex | `display: flex` |
| justify-content | space-between | `justify-content: space-between` |
| align-items | center | `align-items: center` |
| gap | 80px | `gap: 80px` |
| font-family | Montserrat Alternates | `font-family: 'Montserrat Alternates', sans-serif` |
| font-size | 16px | `font-size: 16px` |
| font-weight | 700 | `font-weight: 700` |
| color | #FFFFFF | `color: #FFFFFF` |

---

## Component Hierarchy with Styles

```
Page Root (bg: #00101A, w: 1440px)
├── Header (h: 80px, bg: rgba(16,20,23,0.80), px: 144px, flex, row, space-between)
│   ├── Logo (image)
│   ├── NavLinks (flex, row, gap: 24px)
│   │   ├── NavItem "About SAA 2025" (16px, Montserrat Bold, #FFF, px: 16px)
│   │   ├── NavItem "Award Information" (active: #FFEA9E, border-bottom gold)
│   │   └── NavItem "Sun* Kudos" (16px, Montserrat Bold, #FFF)
│   └── UserActions (flex, row, gap: 16px)
│       ├── NotificationBell (icon, badge: #D4271D)
│       ├── LanguageSelector ("VN")
│       └── ProfileButton (border: 1px solid #998C5F)
│
├── Keyvisual (w: 1440px, h: 547px, background: cover image)
│   └── CoverGradient (gradient: #00101A → transparent)
│       └── HeroImage "ROOT FURTHER" (root-further-hero.png, decorative, aria-hidden)
│
├── Main "Bia" (px: 144px, py: 96px, flex, column, gap: 120px)
│   ├── SectionTitle (313:8453)
│   │   ├── Subtitle "Sun* Annual Awards 2025" (313:8454, 24px, #FFF, text-align: center)
│   │   ├── Divider (313:8455, 1152×1px, #2E3940)
│   │   └── Title "Hệ thống giải thưởng SAA 2025" (313:8457, 57px, #FFEA9E, --text-page-title)
│   │
│   ├── AwardSystem (313:8458, flex, row, gap: 80px)
│   │   ├── SidebarMenu (313:8459, flex, column, sticky)
│   │   │   ├── Tab "Top Talent" (313:8460, 14px, active: gold)
│   │   │   ├── Tab "Top Project" (313:8461)
│   │   │   ├── Tab "Top Project Leader" (313:8462)
│   │   │   ├── Tab "Best Manager" (313:8463)
│   │   │   ├── Tab "Signature 2025" (313:8464)
│   │   │   └── Tab "MVP" (313:8465)
│   │   │
│   │   └── AwardCards (flex, column, gap: 120px)
│   │       ├── Card "Top Talent" (313:8467, flex, ROW, gap: 48px) ← odd: image-left
│   │       │   ├── Image (336x336, r: 16px, border: gold, shadow: gold glow)
│   │       │   └── Content (flex, column, gap: 16px, justify-content: center)
│   │       │       ├── TitleRow (flex, row, gap: 8px)
│   │       │       │   ├── Icon (16x16, #FFEA9E)
│   │       │       │   └── "Top Talent" (24px, #FFEA9E)
│   │       │       ├── Description (16px, #FFF, text-align: justify)
│   │       │       ├── Divider (1px, #2E3940)
│   │       │       ├── QuantityStat (flex, row, baseline, SINGLE LINE)
│   │       │       │   ├── Icon (16x16, #FFEA9E)
│   │       │       │   ├── "Số lượng giải thưởng:" (14px, gold)
│   │       │       │   ├── "10" (36px, gold)
│   │       │       │   └── "Cá nhân" (14px, #FFF, wraps beside number)
│   │       │       ├── Divider (1px, #2E3940)
│   │       │       └── PrizeSection (flex, column, MULTI-LINE)
│   │       │           ├── LabelRow: Icon + "Giá trị giải thưởng:" (14px, gold)
│   │       │           ├── "7.000.000 VNĐ" (36px, #FFEA9E)
│   │       │           └── "cho mỗi giải thưởng" (14px, #FFF)
│   │       │
│   │       ├── Card "Top Project" (313:8468, flex, ROW-REVERSE, gap: 48px) ← even: image-right
│   │       │   └── Stats: "02" Tập thể / "15.000.000 VNĐ"
│   │       │
│   │       ├── Card "Top Project Leader" (313:8469, flex, ROW) ← odd
│   │       │   └── Stats: "03" Cá nhân / "7.000.000 VNĐ"
│   │       │
│   │       ├── Card "Best Manager" (313:8470, flex, ROW-REVERSE) ← even
│   │       │   └── Stats: "01" Cá nhân / "10.000.000 VNĐ"
│   │       │
│   │       ├── Card "Signature 2025" (313:8471, flex, ROW) ← odd
│   │       │   └── Content:
│   │       │       ├── QuantityStat: "01" + "Cá nhân hoặc tập thể"
│   │       │       ├── Divider
│   │       │       ├── PrizeSection1: Icon + "Giá trị giải thưởng:" → "5.000.000 VNĐ" → "cho giải cá nhân"
│   │       │       ├── "Hoặc" inline-labeled divider
│   │       │       └── PrizeSection2: Icon + "Giá trị giải thưởng:" → "8.000.000 VNĐ" → "cho giải tập thể"
│   │       │
│   │       └── Card "MVP" (313:8510, flex, ROW-REVERSE) ← even
│   │           └── Stats: "01" Cá nhân / "15.000.000 VNĐ"
│   │
│   └── SunKudos (335:12023, w: 1152px, h: 500px, flex, ROW, space-between, relative)
│       ├── LeftColumn (I335:12023;313:8420, flex, column, gap: 16px, w: 457px)
│       │   ├── Label "Phong trào ghi nhận" (I335:12023;313:8421, 24px, #FFEA9E, --text-kudos-label)
│       │   ├── Title "Sun* Kudos" (I335:12023;313:8422, 57px, #FFEA9E, --text-kudos-title)
│       │   ├── DescBlock "ĐIỂM MỚI CỦA SAA 2025\n[description]" (I335:12023;313:8423, SINGLE TEXT NODE, 16px, #FFF, justified)
│       │   └── CTAButton "Chi tiết →" (I335:12023;313:8426, bg: #DBD1C1, color: #00101A)
│       └── RightColumn (flex, center)
│           ├── KudosLogo (decorative image)
│           └── DecoText "KUDOS" (SVN-Gotham, ~96px, #DBD1C1, decorative background)
│
└── Footer (px: 90px, py: 40px, border-top: 1px solid #2E3940, flex, space-between)
    ├── FooterNav (flex, row, gap: 24px)
    │   ├── "About SAA 2025"
    │   ├── "Award Information"
    │   └── "Sun* Kudos"
    ├── "Tiêu chuẩn chung"
    └── Copyright "Bản quyền thuộc về Sun* © 2025" (Montserrat Alternates)
```

---

## Responsive Specifications

### Breakpoints (per Constitution)

| Name | Min Width | Max Width |
|------|-----------|-----------|
| Mobile | 0 | 639px |
| Tablet | 640px | 1023px |
| Desktop | 1024px | ∞ |

### Responsive Changes

#### Mobile (< 640px)

| Component | Changes |
|-----------|---------|
| Page | width: 100%, padding: 16px |
| Header | height: auto, padding: 12px 16px, hamburger menu |
| Keyvisual | height: auto, maintain aspect ratio |
| Hero Title | font-size: 32px |
| Section Page Title | font-size: 28-32px (scale down from 57px to fit <640px viewport) |
| Section Subtitle | font-size: 16px (scale down from 24px) |
| Main Content | padding: 24px 16px, gap: 48px |
| Award System | flex-direction: column, sidebar hidden or horizontal scroll |
| Sidebar Menu | display: horizontal scroll or dropdown |
| Award Card | flex-direction: column, image: w-full h-auto |
| Award Image | width: 100%, max-width: 280px, center |
| Stat Number | font-size: 28px |
| Sun* Kudos | flex-direction: column, height: auto, padding: 24px, right column (logo) stacks below left column (text) or hidden |
| Footer | flex-direction: column, gap: 24px, text-align: center |

#### Tablet (640px - 1023px)

| Component | Changes |
|-----------|---------|
| Page | width: 100%, padding: 40px |
| Header | padding: 12px 40px |
| Section Page Title | font-size: 40-48px (scale down from 57px) |
| Main Content | padding: 48px 40px, gap: 80px |
| Award System | flex-direction: column or sidebar narrower |
| Award Card | gap: 24px, image: 240x240 |
| Sun* Kudos | flex-direction: row (maintain), reduce padding, logo column may shrink |
| Footer | padding: 40px |

#### Desktop (≥ 1024px)

| Component | Changes |
|-----------|---------|
| Page | max-width: 1440px, margin: 0 auto |
| All components | Use design values as specified above |

---

## Icon Specifications

| Icon Name | Size | Color | Usage |
|-----------|------|-------|-------|
| icon-notification-bell | 24x24 | #FFFFFF | Header notification |
| icon-notification-dot | 8x8 | #D4271D | Notification badge |
| icon-chevron-down | 16x16 | #FFFFFF | Language dropdown |
| icon-user-profile | 24x24 | #FFFFFF | Profile button |
| icon-arrow-right | 16x16 | #00101A | "Chi tiết" button icon |
| icon-award-prefix | 16x16 | #FFEA9E (gold) / #FFFFFF (default) | Sidebar tab prefix icon + award card title prefix icon (circular award/target shape) |
| icon-quantity | 16x16 | #FFEA9E | Quantity stat row icon (pin/diamond shape) |
| icon-prize | 16x16 | #FFEA9E | Prize stat row icon (badge/license shape) |

---

## Animation & Transitions

| Element | Property | Duration | Easing | Trigger |
|---------|----------|----------|--------|---------|
| Nav Link | background-color, color | 150ms | ease-in-out | Hover |
| Sidebar Tab | background-color, color, border | 150ms | ease-in-out | Click |
| CTA Button | opacity, transform | 150ms | ease-in-out | Hover |
| Award Card | Scroll into view | 300ms | ease-out | Sidebar click (smooth scroll) |

---

## Implementation Mapping

| Design Element | Figma Node ID | Tailwind / CSS Class | React Component |
|----------------|---------------|---------------------|-----------------|
| Page Background | 313:8436 | `bg-[#00101A] min-h-screen` | `<AwardsPage />` (Server Component) |
| Header | (shared) | `fixed top-0 w-full bg-black/80 h-20 px-36 flex items-center justify-between z-50` | `<Header />` (shared) |
| Hero/Keyvisual | 313:8437 | `relative w-full h-[547px] bg-cover bg-center` | `<HeroSection />` |
| Cover Gradient | (within hero) | `absolute inset-0 bg-gradient-to-t from-page-bg to-transparent` | (part of `<AwardsHeroSection />`) |
| ROOT FURTHER Image | (within hero) | `next/image src="/images/root-further-hero.png" aria-hidden, positioned top-left with pt-[100px]` | (part of `<AwardsHeroSection />`) |
| Section Title | 313:8453 | `flex flex-col items-start` | `<SectionTitle />` |
| Section Subtitle | 313:8454 | `text-2xl font-bold text-white text-center w-full` | (part of `<SectionTitle />`) |
| Section Divider | 313:8455 | `w-full h-px bg-[#2E3940]` | (part of `<SectionTitle />`) |
| Section Page Title | 313:8457 | `text-[57px] font-bold leading-[64px] tracking-[-0.25px] text-gold` | (part of `<SectionTitle />`) |
| Award System | 313:8458 | `flex gap-20` | `<AwardSystem />` (Server Component) |
| Sidebar Menu | 313:8459 | `flex flex-col sticky top-24 self-start min-w-[180px] shrink-0` | `<AwardSidebar />` ("use client") |
| Sidebar Tab | 313:8460-8465 | `py-4 px-4 text-sm font-bold text-white hover:bg-gold/10` | `<SidebarTab />` |
| Award Cards Container | (within 313:8458) | `flex flex-col gap-[120px]` | (part of `<AwardSystem />`) |
| Award Card (odd) | 313:8467,8469,8471 | `flex flex-row gap-12` | `<AwardCard direction="row" />` |
| Award Card (even) | 313:8468,8470,8510 | `flex flex-row-reverse gap-12` | `<AwardCard direction="row-reverse" />` |
| Award Image | I313:8467;214:2525 | `w-[336px] h-[336px] rounded-2xl border border-gold shadow-gold` | (uses `next/image`) |
| Award Card Content | I313:8467;214:2526 | `flex flex-col flex-1 gap-4 justify-center` | (part of `<AwardCard />`) |
| Award Card Divider | (within cards) | `w-full h-px bg-[#2E3940]` | `<hr>` or `<div>` |
| Award Stat Row (Quantity) | (within cards) | `flex items-baseline gap-1` | (part of `<AwardCard />`) — baseline aligns mixed 14px/36px text correctly |
| Sun* Kudos | 335:12023 | `w-full h-[500px] flex flex-row items-center justify-between relative overflow-hidden` | `<SunKudosSection />` |
| Kudos Deco Text | (within 335:12023) | `absolute text-[96px] font-normal text-[#DBD1C1] opacity-20` | (decorative, part of `<SunKudosSection />`) |
| CTA Button | I335:12023;313:8426 | `px-4 py-4 bg-[#DBD1C1] text-[#00101A] font-bold rounded flex items-center gap-2` | `<Button variant="cta" />` (uses `next/link`) |
| Footer | (shared) | `w-full px-[90px] py-10 border-t border-[#2E3940] flex justify-between` | `<Footer />` (shared) |

---

## Notes

- All colors should use CSS variables for theming support
- Font: Montserrat must be loaded (Google Fonts or local). Montserrat Alternates for footer only. SVN-Gotham for decorative "KUDOS" text only.
- The design is dark-themed with gold (#FFEA9E) as the primary accent color
- All icons **MUST BE** in **Icon Component** instead of svg files or img tags
- Award card images have a distinctive gold glow shadow effect
- Sidebar navigation uses smooth scroll to anchor award cards
- The page width is 1440px design, content area is 1152px (144px padding each side)
- Ensure color contrast meets WCAG AA for all text on dark backgrounds
- **Constitution compliance**: Arbitrary Tailwind values (e.g., `bg-[#00101A]`, `gap-[120px]`) SHOULD be defined as custom theme tokens in `tailwind.config.ts` under `extend.colors` and `extend.spacing` rather than using inline arbitrary values. Define at minimum: `gold` (#FFEA9E), `page-bg` (#00101A), `divider` (#2E3940) as theme colors.
- **`--color-divider-fill` and `--color-divider`** are the same value (#2E3940). In implementation, consolidate to a single token `--color-divider`.
- **`scroll-padding-top: 96px`** MUST be set on the page (`html` or scroll container) to prevent fixed header (80px) from obscuring anchor-scroll targets. Value = header height (80px) + 16px buffer.
- **"ROOT FURTHER"** renders as a decorative image (`/images/root-further-hero.png`) in the hero, matching the homepage HeroBanner. The image shows "ROOT" on line 1 and "FURTHER" on line 2 in a stylized font (interlinked "OO", unique letterforms). Do NOT use plain text — use the image asset.
- **Section Title visual overlap**: The Section Title (313:8453) is structurally a child of Main Content, but visually it overlaps with the bottom of the hero artwork background. Implementation uses negative margin-top (`-mt-[180px]`) on `<main>` **plus `relative z-10`** to ensure content renders above the hero's absolute gradient overlay. Without `z-10`, the section title and card titles are hidden behind the hero gradient.
- **Typography token consolidation**: Several tokens share identical metrics. In implementation, consider reusing: `--text-page-title` = `--text-kudos-title` = `--text-hero-title` (all 57px/64px/700/-0.25px, differ only in color). `--text-subtitle` = `--text-kudos-label` (both 24px/32px/700/0px, differ only in text-align and color). Separate tokens are kept for semantic clarity.
- **"Phong trào ghi nhận"** is 24px per Figma data (9th pass). Color confirmed as **gold (#FFEA9E)** by stakeholder (overrides Figma #FFFFFF). No italic fontStyle in Figma data — previous italic documentation removed.
- **"ĐIỂM MỚI CỦA SAA 2025"** and the description paragraph are a single Figma text node (I335:12023;313:8423) at 16px. The sub-heading is the first line, not a separate element. In implementation, split into separate elements for semantic HTML if needed.
