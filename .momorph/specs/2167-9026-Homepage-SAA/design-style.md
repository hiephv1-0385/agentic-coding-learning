# Design Style: Homepage SAA

**Frame ID**: `2167:9026`
**Frame Name**: `Homepage SAA`
**Figma Link**: https://www.figma.com/file/9ypp4enmFmdK3YAFJLIu6C?node-id=2167:9026
**Extracted At**: 2026-03-10

---

## Design Tokens

### Colors

| Token Name | Hex Value | Opacity | Usage |
|------------|-----------|---------|-------|
| --color-page-bg | #00101A | 100% | Page background (deep dark blue) |
| --color-header-bg | rgba(16, 20, 23, 0.8) | 80% | Header background (translucent) |
| --color-gold-primary | #FFEA9E | 100% | Section titles, active nav, event info values, award card titles |
| --color-text-white | #FFFFFF | 100% | Body text, descriptions, nav items, countdown labels |
| --color-text-glow | #FAE287 | - | Active nav text glow effect |
| --color-text-shadow | rgba(0, 0, 0, 0.25) | 25% | Text shadow on active items |
| --color-btn-about-bg | #00101A | 100% | "ABOUT AWARDS" button text (hover state, dark on gold bg) |
| --color-cover-gradient | linear-gradient(12deg, #00101A 23.7%, rgba(0,18,29,0.46) 38.34%, rgba(0,19,32,0) 48.92%) | - | Hero gradient overlay |
| --color-content-section-bg | rgba(0, 16, 26, 0.6) | 60% | Content section subtle bg (predicted, dark overlay on page bg) |
| --color-kudos-text | #DBD1C1 | 100% | "KUDOS" decorative text |
| --color-notification-badge | #FF3B30 | 100% | Notification bell unread badge (red dot) |

### Typography

| Token Name | Font Family | Size | Weight | Line Height | Letter Spacing | Usage |
|------------|-------------|------|--------|-------------|----------------|-------|
| --text-page-title | Montserrat | 57px | 700 | 64px | -0.25px | "Hệ thống giải thưởng", "Sun* Kudos" titles |
| --text-countdown-digit | Digital Numbers | 49.15px | 400 | - | 0% | Countdown timer digits |
| --text-countdown-label | Montserrat | 24px | 700 | 32px | 0px | "DAYS", "HOURS", "MINUTES" |
| --text-subtitle | Montserrat | 24px | 700 | 32px | 0px | "Coming soon", "Sun* annual awards 2025", event date/venue |
| --text-cta-button | Montserrat | 22px | 700 | 28px | 0px | "ABOUT AWARDS", "ABOUT KUDOS" |
| --text-body-content | Montserrat | 24px | 700 | 32px | 0px | "Root Further" description paragraphs |
| --text-quote | Montserrat | 20px | 700 | 32px | - | English quote text |
| --text-body | Montserrat | 16px | 700 | 24px | 0.5px | Event info, descriptions, Sun* Kudos content |
| --text-body-label | Montserrat | 16px | 700 | 24px | 0.15px | "Thời gian:", "Địa điểm:" labels |
| --text-card-title | Montserrat | 24px | 400 | 32px | 0px | Award card titles (lighter weight) |
| --text-card-desc | Montserrat | 16px | 400 | 24px | 0.5px | Award card descriptions |
| --text-card-link | Montserrat | 16px | 500 | 24px | 0.15px | "Chi tiết" links |
| --text-nav-item | Montserrat | 14px | 700 | 20px | 0.1px | Header navigation links |
| --text-kudos-brand | SVN-Gotham | 96.16px | 400 | 24px | -13% | "KUDOS" decorative text |
| --text-footer | Montserrat Alternates | 16px | 700 | 24px | 0% | Footer copyright |

### Spacing

| Token Name | Value | Usage |
|------------|-------|-------|
| --spacing-page-padding-x | 144px | Horizontal page padding |
| --spacing-page-padding-y | 96px | Vertical section padding |
| --spacing-section-gap | 120px | Gap between major sections |
| --spacing-content-padding | 120px 104px | "Root Further" content section inner padding |
| --spacing-content-gap | 32px | Gap within content section |
| --spacing-awards-gap | 80px | Gap between awards header and grid |
| --spacing-hero-gap | 40px | Gap within hero sub-sections |
| --spacing-header-padding | 12px 144px | Header padding |

### Border & Radius

| Token Name | Value | Usage |
|------------|-------|-------|
| --radius-content-section | 8px | "Root Further" content block |
| --radius-none | 0px | Page frame, hero, awards section |

### Shadows

| Token Name | Value | Usage |
|------------|-------|-------|
| --shadow-nav-active | 0 4px 4px rgba(0,0,0,0.25), 0 0 6px #FAE287 | Active nav item text glow |

---

## Layout Specifications

### Page Container

| Property | Value | Notes |
|----------|-------|-------|
| width | 1512px | Full desktop width |
| height | 4480px | Full page height |
| background | #00101A | Deep dark blue |

### Layout Structure (ASCII)

```
┌────────────────────────────────────────────────────────────────┐
│  Page (1512px, bg: #00101A)                                    │
│                                                                │
│  ┌────────────────────────────────────────────────────────┐    │
│  │  Header (1512x80px, bg: rgba(16,20,23,0.8), sticky)   │    │
│  │  [Logo] [About SAA* | Awards Info | Kudos]             │    │
│  │                           [Bell] [VN▼] [👤]            │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                │
│  ┌────────────────────────────────────────────────────────┐    │
│  │  Hero / Keyvisual (1512x1392px)                        │    │
│  │  ┌──────────────────────────────┐                      │    │
│  │  │  "ROOT FURTHER" (large text) │                      │    │
│  │  │  "Coming soon"               │                      │    │
│  │  │  [20] [20] [20]              │  Countdown timer     │    │
│  │  │  DAYS  HRS  MIN              │                      │    │
│  │  │                              │                      │    │
│  │  │  Date: 26/12/2025            │                      │    │
│  │  │  Venue: Âu Cơ Art Center     │                      │    │
│  │  │  Livestream info              │                      │    │
│  │  │                              │                      │    │
│  │  │  [ABOUT AWARDS] [ABOUT KUDOS]│  CTA Buttons         │    │
│  │  └──────────────────────────────┘                      │    │
│  │  Background: cover image + gradient overlay             │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                │
│  ┌────────────────────────────────────────────────────────┐    │
│  │  Main Content (padding: 96px 144px, gap: 120px)        │    │
│  │                                                        │    │
│  │  ┌────────────────────────────────────────────────┐    │    │
│  │  │  "Root Further" Content Block (1152px)         │    │    │
│  │  │  (padding: 120px 104px, radius: 8px)           │    │    │
│  │  │  ROOT FURTHER graphic + long description       │    │    │
│  │  │  + English quote                               │    │    │
│  │  │  + More description paragraphs                 │    │    │
│  │  └────────────────────────────────────────────────┘    │    │
│  │                    gap: 120px                          │    │
│  │  ┌────────────────────────────────────────────────┐    │    │
│  │  │  Awards Section (1224px, gap: 80px)            │    │    │
│  │  │                                                │    │    │
│  │  │  "Sun* annual awards 2025" (subtitle)          │    │    │
│  │  │  "Hệ thống giải thưởng" (57px, gold)          │    │    │
│  │  │  Subtitle description                          │    │    │
│  │  │                                                │    │    │
│  │  │  ┌──────────┐ ┌──────────┐ ┌──────────┐       │    │    │
│  │  │  │Top Talent│ │Top Proj. │ │Top PL    │       │    │    │
│  │  │  │  [img]   │ │  [img]   │ │  [img]   │       │    │    │
│  │  │  │  title   │ │  title   │ │  title   │       │    │    │
│  │  │  │  desc    │ │  desc    │ │  desc    │       │    │    │
│  │  │  │  [link]  │ │  [link]  │ │  [link]  │       │    │    │
│  │  │  └──────────┘ └──────────┘ └──────────┘       │    │    │
│  │  │  ┌──────────┐ ┌──────────┐ ┌──────────┐       │    │    │
│  │  │  │Best Mgr  │ │Signature │ │  MVP     │       │    │    │
│  │  │  │  [img]   │ │  [img]   │ │  [img]   │       │    │    │
│  │  │  │  ...     │ │  ...     │ │  ...     │       │    │    │
│  │  │  └──────────┘ └──────────┘ └──────────┘       │    │    │
│  │  └────────────────────────────────────────────────┘    │    │
│  │                    gap: 120px                          │    │
│  │  ┌────────────────────────────────────────────────┐    │    │
│  │  │  Sun* Kudos Section (1224x500px)               │    │    │
│  │  │  [Content + KUDOS logo + "Chi tiết" CTA]       │    │    │
│  │  └────────────────────────────────────────────────┘    │    │
│  │                                                        │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                │
│  [Widget Button] (floating, bottom-right, pill shape, yellow)  │
│                                                                │
│  ┌────────────────────────────────────────────────────────┐    │
│  │  Footer (padding: 40px 90px)                           │    │
│  │  [Logo] [About SAA | Awards | Kudos | Tiêu chuẩn chung]│   │
│  │                      [Bản quyền thuộc về Sun* © 2025]  │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

---

## Component Style Details

### Header - `A1_Header`

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | 2167:9091 | - |
| width | 1512px | `width: 100%` |
| height | 80px | `height: 80px` |
| padding | 12px 144px | `padding: 12px 144px` |
| background | rgba(16, 20, 23, 0.8) | `background: rgba(16,20,23,0.8); backdrop-filter: blur(8px)` |
| display | flex | `display: flex` |
| align-items | center | `align-items: center` |
| justify-content | space-between | `justify-content: space-between` |
| position | sticky (predicted) | `position: sticky; top: 0; z-index: 50` |

**Header Nav States:**
| State | Property | Value |
|-------|----------|-------|
| Active (About SAA) | color | #FFEA9E, text-shadow: `0 4px 4px rgba(0,0,0,0.25), 0 0 6px #FAE287`, font: 14px 700 |
| Hover (Award Info) | color | #FFFFFF (white, predicted highlight bg) |
| Normal (Sun* Kudos) | color | #FFFFFF, font: 14px 700 |

**Header Controls:**
| Element | Node ID | Size | Details |
|---------|---------|------|---------|
| Logo | I2167:9091;178:1033 | 64x60px | Click: navigate home / scroll to top |
| Notification Bell | I2167:9091;186:2101 | 40x40px | Red badge (#FF3B30) when unread notifications exist |
| Language Selector | I2167:9091;186:1696 | auto | Shows current language "VN", click opens language dropdown |
| Profile Icon | I2167:9091;186:1597 | 40x40px | Click opens profile dropdown (linked to frame 721:5223) |

---

### Hero / Keyvisual - `3.5_Keyvisual`

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | 2167:9027 | - |
| width | 1512px | `width: 100%` |
| height | auto (content-driven) | `width: 100%` — see Implementation Note below |
| background | Cover image | `background: url(...) center/cover no-repeat` |

**⚠️ Implementation Note (2026-03-16 bugfix):**
Figma specifies hero height as 1392px, but using a fixed height with `justify-end` creates ~700px of dead space either above or below the content depending on alignment. The implementation uses **auto height** with `pt-[120px]` (clears 80px sticky header + 40px gap) and `pb-24` bottom padding. This keeps the content tightly positioned below the header as shown in the Figma visual, without artificial dead space. The background image uses `object-cover` + `fill` to cover the content area naturally.

**ROOT FURTHER Hero Logo:**
| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | 2788:12911 | - |
| name | `MM_MEDIA_Root Further Logo` | - |
| asset | `public/images/root-further-hero.png` | Downloaded from Figma |
| size | 451x200px (native) | `w-[280px] sm:w-[360px] lg:w-[451px] h-auto` |
| position | First element in hero content, left-aligned below header | - |

**Gradient Overlay:**
| Property | Value |
|----------|-------|
| **Node ID** | 2167:9029 |
| gradient | linear-gradient(12deg, #00101A 23.7%, rgba(0,18,29,0.46) 38.34%, rgba(0,19,32,0) 48.92%) |

**Hero Content Layout:**
Content is **left-aligned** (not centered) within the hero. Order: ROOT FURTHER logo → "Coming soon" + Countdown → Event info → CTA Buttons. All items use `items-start` (left alignment).

---

### Countdown Timer - `B1_Countdown time`

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | 2167:9035 | - |
| **Coming Soon Node** | 2167:9036 | - |
| **Timer Node** | 2167:9037 | - |

**Countdown Digit Container:**
| Property | Value | CSS |
|----------|-------|-----|
| background | dark (predicted rgba(0,0,0,0.3)) | Dark box behind each digit pair |
| border-radius | 4px (predicted) | Slight rounding |
| padding | 8px 12px (predicted) | Inner spacing around digits |

**Countdown Digit:**
| Property | Value | CSS |
|----------|-------|-----|
| font-family | Digital Numbers | `font-family: 'Digital Numbers'` |
| font-size | 49.15px | `font-size: 49.15px` |
| font-weight | 400 | `font-weight: 400` |
| color | #FFFFFF | `color: #FFFFFF` |

**Countdown Unit Label:**
| Property | Value | CSS |
|----------|-------|-----|
| font-family | Montserrat | `font-family: 'Montserrat'` |
| font-size | 24px | `font-size: 24px` |
| font-weight | 700 | `font-weight: 700` |
| line-height | 32px | `line-height: 32px` |
| color | #FFFFFF | `color: #FFFFFF` |

**Countdown Units:**
| Node ID | Unit |
|---------|------|
| 2167:9038 | Days |
| 2167:9043 | Hours |
| 2167:9048 | Minutes |

---

### CTA Buttons - `B3_Call-To-Action`

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | 2167:9062 | - |

**"ABOUT AWARDS" (Hover State) - B3.1:**
| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | 2167:9063 | - |
| type | icon_text | Button with text + arrow → icon |
| font-size | 22px | `font-size: 22px` |
| font-weight | 700 | `font-weight: 700` |
| line-height | 28px | `line-height: 28px` |
| text color | #00101A (dark) | `color: #00101A` |
| background | #FFEA9E (gold) | `background: #FFEA9E` (hover state) |
| padding | 12px 24px (predicted) | `padding: 12px 24px` |
| icon | Arrow → (right of text) | `→` icon, same color as text |

**"ABOUT KUDOS" (Normal State) - B3.2:**
| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | 2167:9064 | - |
| type | icon_text | Button with text + arrow → icon |
| font-size | 22px | `font-size: 22px` |
| font-weight | 700 | `font-weight: 700` |
| line-height | 28px | `line-height: 28px` |
| text color | #FFFFFF | `color: #FFFFFF` |
| background | transparent | `background: transparent` |
| border | 1px solid #FFFFFF (predicted) | `border: 1px solid #FFFFFF` |
| padding | 12px 24px (predicted) | `padding: 12px 24px` |
| icon | Arrow → (right of text) | `→` icon, same color as text |

**CTA Button States:**
| State | About Awards | About Kudos |
|-------|-------------|-------------|
| Normal | White text, transparent bg, `border: 1px solid #FFFFFF`, → icon | White text, transparent bg, `border: 1px solid #FFFFFF`, → icon |
| Hover | Dark text (#00101A), gold bg (#FFEA9E), `border: 1px solid transparent` (prevents layout shift), → icon | Dark text (#00101A), gold bg (#FFEA9E), `border: 1px solid transparent`, → icon |
| Focus | Visible focus ring (`outline: 2px solid #FFEA9E; outline-offset: 2px`) | Same as About Awards focus |

**CTA Button Transition:**
`transition: all 150ms ease-in-out` — applies to background, color, and border-color changes per SC-003.

---

### Event Info - `B2_Thông tin sự kiện`

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | 2167:9053 | - |

| Data | Label Style | Value Style |
|------|------------|-------------|
| Date: 26/12/2025 | 16px 700 #FFF | 24px 700 #FFEA9E |
| Venue: Âu Cơ Art Center | 16px 700 #FFF | 24px 700 #FFEA9E |
| Livestream info | 16px 700 #FFF, 0.5px spacing | - |

---

### Award Card Grid - `C2_Award list`

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | 5005:14974 | - |
| display | grid | `display: grid` |
| grid-template-columns | repeat(3, 1fr) | Desktop: 3 columns |
| gap | ~24px (predicted from visual) | Between cards horizontally and vertically |
| responsive | 2 cols tablet, 2 cols mobile | Adaptive grid |

**Individual Award Card (e.g., Top Talent C2.1):**
| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | 2167:9075 | - |
| Image (C2.1.1) | I2167:9075;214:1019 | Square thumbnail with glow ring |
| Title (C2.1.2) | 24px Montserrat 400 #FFEA9E | `font-size: 24px; font-weight: 400; color: #FFEA9E` |
| Description (C2.1.3) | 16px Montserrat 400 #FFF, max 2 lines with ellipsis | `line-clamp: 2` |
| "Chi tiết" link (C2.1.4) | 16px Montserrat 500 #FFF + arrow → icon | `font-weight: 500` |

**All Award Cards:**
| # | Node ID | Title |
|---|---------|-------|
| C2.1 | 2167:9075 | Top Talent |
| C2.2 | 2167:9076 | Top Project |
| C2.3 | 2167:9077 | Top Project Leader |
| C2.4 | 2167:9079 | Best Manager |
| C2.5 | 2167:9080 | Signature 2025 - Creator |
| C2.6 | 2167:9081 | MVP (Most Valuable Person) |

**Card Hover/Focus State:**
| State | Changes |
|-------|---------|
| Default | Normal display |
| Hover | Slight elevation (`transform: translateY(-2px)`), border/glow highlight (predicted); `transition: transform 150ms ease` |
| Focus-within | Same visual as hover — triggered when any focusable child (link) receives keyboard focus |

**"Chi tiết" Link States:**
| State | Changes |
|-------|---------|
| Default | 16px Montserrat 500 #FFFFFF + → icon |
| Hover | Underline or gold color highlight (predicted) |
| Focus | `outline: 2px solid #FFEA9E; outline-offset: 2px` |

---

### "Root Further" Content Section - `B4_content`

| Property | Value | CSS |
|----------|-------|-----|
| **Container Node ID** | 3204:10152 | - |
| **Text Content Node ID** | 5001:14827 | B4 — description paragraphs |
| width | 1152px | `width: 1152px` (narrower than 1224px content area, centered) |
| padding | 120px 104px | `padding: 120px 104px` |
| border-radius | 8px | `border-radius: 8px` |
| gap | 32px | `gap: 32px` |
| display | flex | `display: flex; flex-direction: column; align-items: center` |

**⚠️ Implementation Note (2026-03-16 bugfix):**
The "ROOT FURTHER" graphic consists of **two separate images** stacked vertically:
- `MM_MEDIA_Root Text` (Node `3204:10155`) → `public/images/root-further.png` — displays "ROOT"
- `MM_MEDIA_Further Text` (Node `3204:10154`) → `public/images/root-further-bg.png` — displays "FURTHER"

Both images must be rendered together to show the full "ROOT FURTHER" text. Previously only the first image was used, showing only "Root".

---

### Widget Button (Floating) - `6_Widget Button`

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | 5022:15169 | - |
| size | 105x64px | Pill shape |
| background | #FFEA9E (gold/yellow) | `background: #FFEA9E` |
| border-radius | pill (9999px) | `border-radius: 9999px` |
| position | fixed | `position: fixed; bottom: 24px; right: 24px` |
| z-index | high | `z-index: 40` |
| content | Pencil icon + "/" separator + SAA icon | Three elements inside pill |

**Widget Button States:**
| State | Changes |
|-------|---------|
| Default | Gold pill with icons visible |
| Hover | Slight scale or brightness increase (predicted) |
| Active/Open | Opens quick actions menu above button; `aria-expanded="true"` |

---

### Sun* Kudos Section - `D1_Sunkudos`

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | 3390:10349 | - |
| **Content Node** | I3390:10349;313:8419 | - |
| width | 1224px | `width: 1224px` |
| height | 500px | `height: 500px` |
| display | flex | `display: flex; align-items: center; justify-content: space-between` |

**Internal Layout:**
| Element | Style | Notes |
|---------|-------|-------|
| "Phong trào ghi nhận" label | 16px Montserrat 700 #FFFFFF | Top label above title |
| "Sun* Kudos" title | 57px Montserrat 700 #FFEA9E | Main heading, gold text |
| "ĐIỂM MỚI CỦA SAA 2025" | 16px Montserrat 700 (predicted) | Highlight label |
| Description text | 16px Montserrat 400-700 #FFFFFF | Multi-line promo copy |
| "KUDOS" decorative | SVN-Gotham 96.16px 400 #DBD1C1 | Right side, large decorative text |
| "Chi tiết" button | 16px Montserrat 500 #FFFFFF, bordered | Outlined button with → icon (not a text link) |

**"Chi tiết" Button (Kudos) - D2.1:**
| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | I3390:10349;313:8426 | - |
| type | icon_text (bordered button) | Different from award card text links |
| border | 1px solid #FFFFFF (predicted) | Outlined style |
| padding | 8px 16px (predicted) | Button padding |
| hover | Gold bg (#FFEA9E), dark text (#00101A) (predicted) | Same hover pattern as CTA buttons |

---

### Footer - `7_Footer`

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | 5001:14800 | - |
| padding | 40px 90px | `padding: 40px 90px` |
| display | flex | `display: flex; align-items: center; justify-content: space-between` |

**Footer Elements:**
| Element | Node ID | Description |
|---------|---------|-------------|
| Logo | I5001:14800;342:1408 | 69x64px, same behavior as header logo (A1.1) |
| "About SAA 2025" | I5001:14800;342:1410 | Nav link, same behavior as header A1.2 |
| "Award Information" | I5001:14800;342:1411 | Nav link, same behavior as header A1.3 |
| "Sun* Kudos" | I5001:14800;342:1412 | Nav link, same behavior as header A1.5 |
| "Tiêu chuẩn chung" | I5001:14800;1161:9487 | Nav link to Standards page |
| Copyright | - | "Bản quyền thuộc về Sun* © 2025", Montserrat Alternates 16px 700 |

**Footer Link States:**
| State | Changes |
|-------|---------|
| Normal | #FFFFFF text |
| Hover | Gold highlight (#FFEA9E) or underline (predicted, same behavior as header nav) |
| Active | Same as header active state (gold + glow) if on that page |

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
| Component | Changes |
|-----------|---------|
| Page padding | 16px horizontal (`px-4`) |
| Hero | Reduced height (auto), stacked layout |
| Countdown | Smaller digits (~32px), horizontal row |
| CTA buttons | Full width (`w-full`), stacked vertically (`flex-col`) |
| Award grid | 2 columns (`grid-cols-2`) |
| Content section | Padding 40px 24px (reduced from 120px 104px) |
| Widget button | Smaller, still fixed bottom-right |

#### Tablet (640px - 1023px)
| Component | Changes |
|-----------|---------|
| Page padding | 48px horizontal (`sm:px-12`) |
| Award grid | 2 columns (`grid-cols-2`) |
| Content section | Padding 80px 48px (reduced from 120px 104px) |

#### Desktop (>= 1024px)
| Component | Changes |
|-----------|---------|
| All | As designed (1512px max-width) |
| Award grid | 3 columns |

---

## Implementation Mapping

| Design Element | Figma Node ID | Tailwind / CSS Class | React Component |
|----------------|---------------|---------------------|-----------------|
| Page | 2167:9026 | `min-h-screen bg-[#00101A]` | `<HomepageSAA />` |
| Header | 2167:9091 | `sticky top-0 z-50 h-20 bg-[rgba(16,20,23,0.8)] backdrop-blur px-36` | `<Header />` (shared) |
| Hero Banner | 2167:9027 | `relative w-full` (auto height, `pt-[120px] pb-24`) | `<HeroBanner />` |
| Hero Logo | 2788:12911 | `w-[280px] sm:w-[360px] lg:w-[451px] h-auto` | `<Image>` within hero |
| Gradient Overlay | 2167:9029 | `absolute inset-0` with CSS gradient | Div within hero |
| Countdown | 2167:9037 | `flex gap-4` | `<CountdownTimer />` |
| Countdown Digit | - | `font-['Digital_Numbers'] text-[49px] text-white` | `<CountdownDigit />` |
| CTA Buttons | 2167:9062 | `flex gap-4` | `<CTAButtons />` |
| About Awards Btn | 2167:9063 | `px-6 py-3 font-montserrat font-bold text-[22px] border hover:bg-[#FFEA9E] hover:text-[#00101A]` | `<Button variant="cta" />` |
| Content Block | 3204:10152 | `w-full max-w-[1152px] px-[104px] py-[120px] rounded-lg` | `<RootFurtherContent />` |
| Awards Section Header | 2167:9069 | `flex flex-col gap-4` | Part of `<AwardsOverview />` |
| Awards Section | - | `flex flex-col gap-20 max-w-[1224px]` | `<AwardsOverview />` |
| Award Grid | 5005:14974 | `grid grid-cols-2 lg:grid-cols-3 gap-6` | `<AwardGrid />` |
| Award Card | 2167:9075 | `flex flex-col gap-3 cursor-pointer hover:...` | `<AwardCard />` |
| Card Image | I2167:9075;214:1019 | `aspect-square rounded-lg` | `<AwardImage />` |
| Card Title | - | `font-montserrat font-normal text-2xl text-[#FFEA9E]` | `<h3>` |
| Card Desc | - | `font-montserrat font-normal text-base text-white line-clamp-2` | `<p>` |
| Card Link | - | `font-montserrat font-medium text-base text-white` | `<Link>` |
| Sun* Kudos | 3390:10349 | `w-full max-w-[1224px] h-[500px]` | `<SunKudosPromo />` (shared) |
| Widget Button | 5022:15169 | `fixed bottom-6 right-6 z-40 rounded-full bg-[#FFEA9E]` | `<WidgetButton />` |
| Footer | 5001:14800 | `px-[90px] py-10` | `<Footer />` (shared) |

---

## Notes

- Page width is **1512px** (wider than Awards System page at 1440px) — use `max-width` with responsive scaling
- **Two fonts** besides Montserrat: "Digital Numbers" for countdown digits, "SVN-Gotham" for "KUDOS" decorative text — both must be loaded
- Award card titles use **weight 400** (not 700 like the Awards System page) — lighter, more elegant feel
- CTA buttons have two states that swap: normal = outlined/white, hover = filled/gold with dark text
- CTA buttons and "Chi tiết" links include **arrow → icons** (icon_text button type per Figma)
- The "Root Further" content block has **8px border-radius** and large **120px 104px padding** — a contained reading section
- Countdown timer should be configurable via `NEXT_PUBLIC_EVENT_DATETIME` environment variable (ISO-8601 datetime)
- "Coming soon" label hides when countdown reaches 0
- Award card descriptions are capped at **2 lines with ellipsis** overflow
- Card click navigates to Awards Information page with **hashtag slug** for auto-scroll to specific award
- Widget button is a **floating action button** — 105x64px pill, pencil icon + "/" + SAA icon, gold/yellow bg
- All icons **MUST BE** in **Icon Component** instead of svg files or img tags
- **Event info is dynamic** — values (date, venue, livestream) come from API, not hardcoded. Figma shows sample data.
- **Notification bell** has a red badge indicator (#FF3B30) when unread notifications exist
- **Footer** has 4 nav links (not 3) — includes "Tiêu chuẩn chung" (Standards) link
- **Values marked "(predicted)"** could not be confirmed from Figma data extraction and may need visual verification: CTA button padding, award grid gap, CTA button border width/color
