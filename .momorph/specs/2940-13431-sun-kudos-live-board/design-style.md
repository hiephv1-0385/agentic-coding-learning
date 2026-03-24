# Design Style: Sun* Kudos Live Board

**Frame ID**: `2940:13431`
**Frame Name**: `Sun* Kudos - Live board`
**Figma Link**: Figma file `9ypp4enmFmdK3YAFJLIu6C`, frame `2940:13431`
**Extracted At**: 2026-03-11
**Reviewed At**: 2026-03-11

---

## Design Tokens

### Colors

| Token Name | Hex Value | Opacity | Usage |
|------------|-----------|---------|-------|
| --color-page-bg | #00101A | 100% | Page background |
| --color-container-dark | #00070C | 100% | Sidebar card containers |
| --color-nav-bg | #10141780 | 80% | Navigation bar background |
| --color-card-bg | #FFF8E1 | 100% | Kudos card background, active carousel card |
| --color-gold | #FFEA9E | 100% | Section titles, accent text, dividers, CTA button bg, active borders |
| --color-gold-10 | rgba(255, 234, 158, 0.10) | 10% | Secondary button bg, filter pill bg, footer active tab |
| --color-gold-40 | rgba(255, 234, 158, 0.40) | 40% | Quote box background |
| --color-border | #998C5F | 100% | Muted gold borders (sidebar cards, filter buttons) |
| --color-text-white | #FFFFFF | 100% | Nav text, body text on dark bg, leaderboard names |
| --color-text-gray | #999999 | 100% | Timestamps, secondary text, carousel page indicator |
| --color-text-dark | #00101A | 100% | Text on light cards |
| --color-divider | #2E3940 | 100% | Section divider lines |
| --color-red | #D4271D | 100% | Hashtag text, notification badge |
| --color-red-light | #F17676 | 100% | Word cloud highlighted word |
| --color-badge-bg | #FFF3C6 | 100% | Award badge background |

### CSS Custom Properties (from Figma variables)

| Variable | Value | Usage |
|----------|-------|-------|
| --Details-Background | #00101A | Page/section background |
| --Details-Container-2 | #00070C | Dark card containers |
| --Details-Text-Primary-1 | #FFEA9E | Gold accent text |
| --Details-Text-Secondary-1 | #FFF | White text |
| --Details-Text-Secondary-2 | #999 | Gray text |
| --Details-Border | #998C5F | Muted gold borders |
| --Details-SecondaryButton-Normal | rgba(255, 234, 158, 0.10) | Secondary button bg |
| --Details-ButtonSecondary-Hover | rgba(255, 234, 158, 0.40) | Secondary button hover / quote bg |
| --Details-PrimaryButton-Hover | #FFF8E1 | Active card bg |
| --Details-TextButton-Normal | rgba(0, 0, 0, 0.00) | Ghost button bg |

### Gradients

| Name | Value | Usage |
|------|-------|-------|
| Hero overlay | `linear-gradient(25deg, #00101A 14.74%, rgba(0, 19, 32, 0.00) 47.8%)` | Hero banner dark overlay |
| Carousel fade left | `linear-gradient(90deg, #00101A 50%, rgba(255, 255, 255, 0.00) 100%)` | Carousel left edge fade |
| Carousel fade right | `linear-gradient(270deg, #00101A 50%, rgba(255, 255, 255, 0.00) 100%)` | Carousel right edge fade |
| Spotlight overlay | `linear-gradient(0deg, rgba(0, 0, 0, 0.70), rgba(0, 0, 0, 0.70))` | Spotlight image darkening |

### Typography

| Token Name | Font Family | Size | Weight | Line Height | Letter Spacing |
|------------|-------------|------|--------|-------------|----------------|
| --text-section-tab | Montserrat | 57px | 700 | 64px | -0.25px |
| --text-hero-title | Montserrat | 36px | 700 | 44px | 0 |
| --text-hero-number | SVN-Gotham | 139.78px | 400 | 34.95px | -13% |
| --text-stat-number | Montserrat | 32px | 700 | 40px | 0 |
| --text-carousel-page | Montserrat | 28px | 700 | 36px | 0 |
| --text-section-heading | Montserrat | 24px | 700 | 32px | 0 |
| --text-sidebar-heading | Montserrat | 22px | 700 | 28px | 0 |
| --text-kudos-message | Montserrat | 20px | 700 | 32px | 0 |
| --text-body | Montserrat | 16px | 700 | 24px | 0.15px |
| --text-nav-link | Montserrat | 16px | 700 | 24px | 0.15px |
| --text-hashtag | Montserrat | 16px | 700 | 24px | 0.5px |
| --text-timestamp | Montserrat | 14px | 700 | 20px | 0.1px |
| --text-copyright | Montserrat Alternates | 16px | 700 | 24px | 0.15px |

### Spacing

| Token Name | Value | Usage |
|------------|-------|-------|
| --spacing-page-gutter | 144px | Horizontal page padding (left/right) |
| --spacing-section-gap | 64px | Gap between major page sections |
| --spacing-card-padding | 40px 40px 16px 40px | Kudos card internal padding |
| --spacing-sidebar-padding | 24px | Sidebar card internal padding |
| --spacing-card-gap | 24px | Gap between kudos cards in feed |
| --spacing-component-gap | 16px | Default gap between card sub-sections |
| --spacing-button-padding | 16px | Button internal padding |
| --spacing-small-gap | 8px | Small gaps (filter buttons, leaderboard rows) |
| --spacing-avatar-name-gap | 13px | Gap between avatar and name text |
| --spacing-footer-padding | 40px 90px | Footer padding |
| --spacing-feed-sidebar-gap | 80px | Gap between kudos feed column and sidebar |

### Border & Radius

| Token Name | Value | Usage |
|------------|-------|-------|
| --radius-nav-tab | 4px | Nav tabs, filter buttons |
| --radius-cta-button | 8px | CTA button ("Mo qua"), scrollbar |
| --radius-quote-box | 12px | Kudos message quote box |
| --radius-carousel-card | 16px | Highlighted carousel card |
| --radius-sidebar-card | 17px | Sidebar stat/leaderboard cards |
| --radius-sticker | 18px | Award sticker containers |
| --radius-kudos-card | 24px | Kudos post card |
| --radius-spotlight | 47.14px | Spotlight board container |
| --radius-badge-pill | 48px | Award badge pill |
| --radius-avatar | 64px | User avatars (circle) |
| --radius-pill | 68px | Search/filter pill inputs |
| --radius-notification-dot | 100px | Notification dot |
| --border-default | 1px solid var(--Details-Border, #998C5F) | Sidebar cards, filter buttons |
| --border-active-card | 4px solid var(--Details-Text-Primary-1, #FFEA9E) | Active carousel card |
| --border-avatar | 1.869px solid #FFF | User avatar border |
| --border-badge | 0.5px solid #FFEA9E | Award badge pill |
| --border-gold-accent | 1px solid var(--Details-Text-Primary-1, #FFEA9E) | Quote box, sticker images |

### Shadows

| Token Name | Value | Usage |
|------------|-------|-------|
| --shadow-nav-glow | 0 4px 4px rgba(0, 0, 0, 0.25), 0 0 6px #FAE287 | Active nav link text-shadow |
| --shadow-badge-glow | 0 0 1.3px #FFF | Award badge name glow |

---

## Layout Specifications

### Page Container

| Property | Value | Notes |
|----------|-------|-------|
| width | 1440px | Design width; responsive scaling needed |
| background | #00101A | Deep navy page background |
| padding-x | 144px | Horizontal page gutters |

### Main Layout Structure

| Property | Value | Notes |
|----------|-------|-------|
| display | flex column | Vertical page stack |
| content-width | 1152px | 1440px - 2 * 144px gutters |
| feed-sidebar | flex row | 680px feed + 80px gap + 422px sidebar |

### Layout Structure (ASCII)

```
+--[1440px]---------------------------------------------------------------+
| NAV BAR (1440x80, bg: rgba(16,20,23,0.8), padding: 12px 144px)        |
| [Logo 52x48] --- [Nav Links gap:24px] --- [Lang|Bell|Avatar]           |
+------------------------------------------------------------------------+
| HERO BANNER (1440x512, bg-image + gradient overlay)                    |
| [padding: 0 144px]                                                     |
|   "He thong ghi nhan va cam on" (36px/700 Montserrat, gold)           |
|   [Sun* S-wing logo] + KUDOS (SVN-Gotham 139.78px, leading-[0.85])  |
|   [Input Pill 68px radius] ---- [Search Pill 68px radius]             |
+------------------------------------------------------------------------+
|                          gap: 120px                                     |
+--[padding: 0 144px]----------------------------------------------------+
| HIGHLIGHT KUDOS SECTION                                                |
|   "Sun* Annual Awards 2025" (24px) | "HIGHLIGHT KUDOS" (57px gold)    |
|   [Hashtag filter btn] [Phong ban filter btn]                          |
|   +--CAROUSEL (gap:24px)------------------------------------------+   |
|   | [fade] [dim card] [ACTIVE CARD 528px, 4px gold border] [dim]  |   |
|   +---------------------------------------------------------------+   |
|   [< arrow]  2/5  [arrow >]  (gap:32px, centered)                    |
+------------------------------------------------------------------------+
|                          gap: 64px                                      |
+--[padding: 0 144px]----------------------------------------------------+
| SPOTLIGHT BOARD SECTION                                                |
|   "Sun* Annual Awards 2025" | "SPOTLIGHT BOARD" (57px gold)           |
|   +--BOARD (1157x548, radius:47px, border:1px #998C5F)----------+    |
|   | bg-image + dark overlay (70%)                                 |    |
|   | "388 KUDOS" (36px white) + [pan/zoom btn] + [search input]   |    |
|   | [Word cloud: variable size 6-11px, opacity 0.1-1.0]          |    |
|   +--------------------------------------------------------------+    |
+------------------------------------------------------------------------+
|                          gap: 64px                                      |
+--[padding: 0 144px]----------------------------------------------------+
| ALL KUDOS SECTION                                                      |
|   "Sun* Annual Awards 2025" | "ALL KUDOS" (57px gold)                 |
|   +--[FEED 680px]---------------+--80px--+--[SIDEBAR 422px]------+    |
|   | KUDOS CARD (24px radius)    |        | STATS CARD (17px r)   |    |
|   |  padding: 40px 40px 16px    |        |  padding: 24px        |    |
|   |  bg: #FFF8E1                |        |  bg: #00070C          |    |
|   |  [sender] -> [receiver]     |        |  border: 1px #998C5F  |    |
|   |  [timestamp]                |        |  [stat rows]          |    |
|   |  [message 5 lines max]     |        |  [Mo Secret Box btn]  |    |
|   |  [images row max 5]        |        +------------------------+    |
|   |  [hashtags red]            |        | gap: 24px              |    |
|   |  [hearts] [copy link]     |        +------------------------+    |
|   +---gap:24px-----------------+        | LEADERBOARD (17px r)   |    |
|   | KUDOS CARD ...             |        |  "10 SUNNER NHAN QUA"  |    |
|   | (infinite scroll)          |        |  [scrollable list]     |    |
|   +----------------------------+        +------------------------+    |
+------------------------------------------------------------------------+
|                          gap: 64px                                      |
+--FOOTER (1440px, padding: 40px 90px)-----------------------------------+
| [Logo 69x64] --- [Nav Links gap:48px] --- [Copyright]                  |
+------------------------------------------------------------------------+
```

---

## Component Style Details

### Navigation Bar

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | (Section 2) | - |
| width | 1440px | `width: 100%` |
| height | 80px | `height: 80px` |
| padding | 12px 144px | `padding: 12px 144px` |
| background | rgba(16, 20, 23, 0.8) | `background-color: rgba(16, 20, 23, 0.8)` |
| display | flex row | `display: flex; flex-direction: row` |
| justify-content | space-between | `justify-content: space-between` |
| gap | 238px | `gap: 238px` |

**Nav Link States:**
| State | Changes |
|-------|---------|
| Default | color: #FFF, font: 700 16px/24px Montserrat, padding: 16px, border-radius: 4px |
| Hover | color: #FFEA9E, transition: color 150ms ease-in-out |
| Active | border-bottom: 1px solid #FFEA9E, color: #FFEA9E, text-shadow: 0 4px 4px rgba(0,0,0,0.25), 0 0 6px #FAE287 |
| Focus | outline: 2px solid #FFEA9E, outline-offset: 2px |

---

### Hero Banner

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | 2940:13437 | - |
| width | 1440px | `width: 100%` |
| height | 512px | `height: 512px` |
| position | relative | `position: relative` |
| background | image + gradient | `background: url(banner.png) center/cover, linear-gradient(25deg, #00101A 14.74%, rgba(0,19,32,0) 47.8%)` |
| content-padding | 0 144px | `padding: 0 144px` |

**Hero Content Structure:**
| # | Element | Styles |
|---|---------|--------|
| 1 | Title "Hệ thống ghi nhận và cảm ơn" | 36px/44px Montserrat Bold, gold (#FFEA9E) |
| 2 | Logo + "KUDOS" | flex items-end gap-1. Logo: `<Icon name="rules" />` (Sun* S-wing mark, red #E73928/#B72927), ~80px on desktop. "KUDOS": SVN-Gotham 139.78px, `leading-[0.85]` (NOT 34.95px line-height from Figma — that value causes text to overflow upward in CSS). tracking: -13%, color: #DBD1C1 |
| 3 | Input row | flex row gap-2: KudosInputPill + SearchPill |

**Important — KUDOS line-height**: Figma exports line-height as 34.95px for the 139.78px KUDOS text, but this value creates a tiny line box in CSS causing the text to visually overflow upward and overlap with the title. Use `leading-[0.85]` (~119px) instead to prevent overlap while keeping the text visually compact.

---

### Kudos Input Pill

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | 2940:13449 | - |
| padding | 24px 16px | `padding: 24px 16px` |
| border | 1px solid #998C5F | `border: 1px solid var(--Details-Border)` |
| border-radius | 68px | `border-radius: 68px` |
| background | rgba(255, 234, 158, 0.10) | `background: var(--Details-SecondaryButton-Normal)` |
| font | 700 16px/24px Montserrat | `font: 700 16px/24px 'Montserrat'` |
| color | #FFF | `color: white` |
| icon-size | 24x24px | left icon |
| cursor | pointer | `cursor: pointer` |

**States:**
| State | Changes |
|-------|---------|
| Default | bg: rgba(255,234,158,0.10), border: 1px solid #998C5F |
| Hover | bg: rgba(255,234,158,0.40) (--Details-ButtonSecondary-Hover) |
| Focus | outline: 2px solid #FFEA9E, outline-offset: 2px |

---

### Filter Button (Hashtag / Phong ban)

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | 2940:13459, 2940:13460 | - |
| padding | 16px | `padding: 16px` |
| gap | 8px | `gap: 8px` |
| display | flex row | `display: flex; align-items: center` |
| border | 1px solid #998C5F | `border: 1px solid var(--Details-Border)` |
| border-radius | 4px | `border-radius: 4px` |
| background | rgba(255, 234, 158, 0.10) | `background: var(--Details-SecondaryButton-Normal)` |
| font | 700 16px/24px Montserrat | `font-weight: 700; font-size: 16px` |
| color | #FFF | `color: white` |

**States:**
| State | Changes |
|-------|---------|
| Default | bg: rgba(255,234,158,0.10), border: 1px solid #998C5F |
| Hover | bg: rgba(255,234,158,0.40) |
| Active (filter applied) | bg: rgba(255,234,158,0.40), border-color: #FFEA9E |
| Focus | outline: 2px solid #FFEA9E, outline-offset: 2px |

---

### Highlight Carousel Card (Active)

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | 2940:13465 | - |
| width | 528px | `width: 528px` |
| padding | 24px 24px 16px 24px | `padding: 24px 24px 16px 24px` |
| background | #FFF8E1 | `background: var(--Details-PrimaryButton-Hover)` |
| border | 4px solid #FFEA9E | `border: 4px solid var(--Details-Text-Primary-1)` |
| border-radius | 16px | `border-radius: 16px` |
| display | flex column | `display: flex; flex-direction: column` |
| gap | 16px | `gap: 16px` |

**Carousel Card States:**
| State | Changes |
|-------|---------|
| Active (center) | As above: full opacity, 4px gold border, #FFF8E1 bg |
| Inactive (side) | opacity: 0.5, smaller scale, partially hidden behind fade overlays |
| Transition | transform + opacity animation 300ms ease-in-out on slide change |

**Carousel Card Actions (differs from Feed Card):**
| Action | Carousel Card | Feed Card |
|--------|--------------|-----------|
| Heart/like | Yes | Yes |
| Copy Link | Yes | Yes |
| "Xem chi tiet" link | Yes (opens detail) | No |
| Click image for full view | No (3-line truncated) | Yes (max 5 thumbnails) |

---

### Carousel Navigation Arrow

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | 2940:13468, 2940:13470 | - |
| width | 48px | `width: 48px` |
| height | 48px | `height: 48px` |
| padding | 10px | `padding: 10px` |
| cursor | pointer | `cursor: pointer` |

**States:**
| State | Changes |
|-------|---------|
| Default | opacity: 1, cursor: pointer |
| Hover | opacity: 0.7 |
| Disabled (at boundary) | opacity: 0.3, cursor: not-allowed, pointer-events: none |
| Focus | outline: 2px solid #FFEA9E, outline-offset: 2px |

---

### Spotlight Board Container

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | 2940:14174 | - |
| width | 1157px | `width: 100%; max-width: 1157px` |
| height | 548px | `height: 548px` |
| border | 1px solid #998C5F | `border: 1px solid var(--Details-Border)` |
| border-radius | 47.14px | `border-radius: 47px` |
| background | image + dark overlay | `background: linear-gradient(0deg, rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url(spotlight-bg.png) center/cover` |
| overflow | hidden | `overflow: hidden` |

**Spotlight Sub-components:**
| Element | Style |
|---------|-------|
| Title "388 KUDOS" | 700 36px/44px Montserrat, color: #FFF |
| Pan/zoom button | 40x40px, padding: 10px, icon: 24x24, color: #FFF |
| Search input | Node ID: 2940:14833, placeholder: "Tim kiem", font: 700 16px/24px Montserrat, color: #FFF, icon: magnifier 24x24 |
| Word cloud text | Montserrat, sizes 6.66px-11.34px, color: #FFF, opacity: 0.1-1.0 |
| Highlighted name | color: #F17676, opacity: 1.0 |

---

### Kudos Post Card

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | 3127:21871 | - |
| width | 680px | `width: 100%` |
| padding | 40px 40px 16px 40px | `padding: 40px 40px 16px 40px` |
| background | #FFF8E1 | `background-color: #FFF8E1` |
| border-radius | 24px | `border-radius: 24px` |
| display | flex column | `display: flex; flex-direction: column` |
| gap | 16px | `gap: 16px` |

**Sub-components:**
| Element | Style |
|---------|-------|
| Card header | flex row, gap: 24px, justify: space-between |
| User avatar | 64x64px, border: 1.869px solid #FFF, border-radius: 64px |
| User name | 700 16px/24px Montserrat, color: #00101A |
| Timestamp | 700 14px/20px Montserrat, color: #999 |
| Arrow icon | 32x32px centered |
| Divider | width: 100%, height: 1px, bg: #FFEA9E |
| Quote box | padding: 16px 24px, bg: rgba(255,234,158,0.40), border: 1px solid #FFEA9E, radius: 12px |
| Quote text | 700 20px/32px Montserrat, color: #00101A, text-align: justify |
| Sticker images | 88x88px each, gap: 16px, border: 1px solid #998C5F, radius: 18px |
| Hashtags | 700 16px/24px Montserrat, color: #D4271D |
| Heart count | 700 24px/32px Montserrat, color: #00101A, with 32x32px emoji icon |
| Action button | padding: 16px, gap: 4px, radius: 4px, 700 16px/24px Montserrat |
| Video play icon | 30x30px, triangular play button overlay on media thumbnail, semi-transparent bg |
| Category label | "IDOL GIOI TRE" badge, 700 16px/24px Montserrat, color: #00101A |

**Heart Button States:**
| State | Changes |
|-------|---------|
| Default (not liked) | icon: gray heart, count text: #00101A |
| Liked (active) | icon: red heart (#D4271D), count text: #00101A |
| Hover | scale: 1.1 on heart icon |
| Disabled (own kudos) | opacity: 0.4, cursor: not-allowed |

**Copy Link Button States:**
| State | Changes |
|-------|---------|
| Default | color: #00101A, icon: link |
| Hover | opacity: 0.7 |
| Clicked | Show toast "Link copied -- ready to share!" |

---

### Sidebar Stats Card

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | 2940:13488 | - |
| width | 422px | `width: 100%` |
| padding | 24px | `padding: 24px` |
| background | #00070C | `background: var(--Details-Container-2)` |
| border | 1px solid #998C5F | `border: 1px solid var(--Details-Border)` |
| border-radius | 17px | `border-radius: 17px` |
| display | flex column | `display: flex; flex-direction: column` |
| gap | 16px | `gap: 16px` |

**Sub-components:**
| Element | Style |
|---------|-------|
| Stat label | 700 16px/24px Montserrat, color: #FFF |
| Stat number | 700 32px/40px Montserrat, color: #FFEA9E |
| Divider | height: 1px, bg: #2E3940 |
| CTA Button | padding: 16px, gap: 8px, bg: #FFEA9E, radius: 8px, 700 22px/28px Montserrat, color: #00101A |

**CTA Button ("Mo Secret Box") States:**
| State | Changes |
|-------|---------|
| Default | bg: #FFEA9E, color: #00101A |
| Hover | bg: #FFF8E1 (lighter gold) |
| Active | bg: #FFE082 (darker gold) |
| Disabled (no boxes) | opacity: 0.5, cursor: not-allowed |
| Focus | outline: 2px solid #FFEA9E, outline-offset: 2px |

---

### Sidebar Leaderboard Card

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | 2940:13510 | - |
| width | 422px | `width: 100%` |
| padding | 24px 16px 24px 24px | `padding: 24px 16px 24px 24px` |
| background | #00070C | `background: var(--Details-Container-2)` |
| border | 1px solid #998C5F | `border: 1px solid var(--Details-Border)` |
| border-radius | 17px | `border-radius: 17px` |

**Sub-components:**
| Element | Style |
|---------|-------|
| Title | 700 22px/28px Montserrat, color: #FFEA9E, width: 382px |
| List area | 382x384px, flex column, gap: 16px, overflow-y: auto |
| Scrollbar | width: 2px, bg: #999, radius: 8px |
| Row | 364x64px, flex row, gap: 8px |
| Row avatar | 64x64px, border: 1.869px solid #FFF, radius: 64px |
| Row indicator | Colored heart/emoji icon (e.g., red heart), 16x16px, positioned left of name |
| Row name | 700 22px/28px Montserrat, color: #FFEA9E |
| Row description | 700 16px/24px Montserrat, color: #FFF (gift description, e.g., "Nhan duoc 1 ao phong SAA") |

---

### Footer

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | (Footer section) | - |
| width | 1440px | `width: 100%` |
| padding | 40px 90px | `padding: 40px 90px` |
| display | flex row | `display: flex; justify-content: space-between; align-items: center` |

**Sub-components:**
| Element | Style |
|---------|-------|
| Logo | 69x64px |
| Nav links | flex row, gap: 48px; links: "About SAA 2025", "Award Information", "Sun* Kudos" (active), "Tieu chuan chung" |
| Nav link | padding: 16px, radius: 4px, 700 16px/24px Montserrat, color: #FFF |
| Active link | bg: rgba(255,234,158,0.10), text-shadow: 0 4px 4px rgba(0,0,0,0.25), 0 0 6px #FAE287 |
| Copyright | "Ban quyen thuoc ve Sun* (c) 2025", 700 16px/24px Montserrat Alternates, color: #FFF |

---

## Component Hierarchy with Styles

```
Page (bg: #00101A, width: 1440px)
+-- NavBar (h: 80px, bg: rgba(16,20,23,0.8), px: 144px, flex-row, gap: 238px)
|   +-- Logo (52x48px)
|   +-- NavLinks (flex-row, gap: 24px)
|   |   +-- NavLink (p: 16px, r: 4px, 700 16px Montserrat, white)
|   |   +-- NavLink.active (border-bottom: 1px #FFEA9E, color: #FFEA9E, text-shadow)
|   +-- RightActions (flex-row, gap: 8px)
|       +-- LangSwitcher (108x56px, p: 16px, r: 4px)
|       +-- NotificationBell (40x40px, p: 10px, r: 4px)
|       |   +-- RedDot (8x8px, bg: #D4271D, r: 100px)
|       +-- UserAvatar (40x40px, border: 1px #998C5F, r: 4px)
|
+-- HeroBanner (1440x512px, bg-image + gradient overlay)
|   +-- ContentArea (px: 144px, flex-col, justify-end, gap: 40px)
|       +-- TitleBlock (flex-col, gap: 4px)
|       |   +-- Title "Hệ thống ghi nhận và cảm ơn" (700 36px/44px Montserrat, #FFEA9E)
|       |   +-- "KUDOS" (SVN-Gotham 139.78px, leading-[0.85], #DBD1C1)
|       |   +-- (TODO: Sun* Kudos wing logo before KUDOS text — correct asset not yet available)
|       +-- InputRow (flex-row, gap: 8px)
|           +-- KudosInputPill (p: 24px 16px, r: 68px, border: 1px #998C5F, bg: gold-10%)
|           +-- SearchPill (p: 24px 16px, r: 68px, border: 1px #998C5F, bg: gold-10%)
|
+-- gap: 120px
|
+-- HighlightSection (px: 144px, flex-col, gap: 16px)
|   +-- SectionHeader (flex-col, gap: 16px)
|   |   +-- Subtitle (700 24px Montserrat, white)
|   |   +-- Divider (h: 1px, bg: #2E3940)
|   |   +-- TitleRow (flex-row, justify: space-between)
|   |       +-- Title (700 57px Montserrat, #FFEA9E)
|   |       +-- FilterButtons (flex-row, gap: 8px)
|   |           +-- FilterBtn (p: 16px, gap: 8px, border: 1px #998C5F, r: 4px, bg: gold-10%)
|   +-- Carousel (flex-row, gap: 24px, position: relative)
|   |   +-- FadeLeft (400x525px, gradient 90deg)
|   |   +-- DimCard (opacity: 0.5)
|   |   +-- ActiveCard (528px, p: 24px, bg: #FFF8E1, border: 4px #FFEA9E, r: 16px)
|   |   +-- DimCard (opacity: 0.5)
|   |   +-- FadeRight (400x525px, gradient 270deg)
|   +-- CarouselNav (flex-row, centered, gap: 32px)
|       +-- ArrowBtn (48x48px, p: 10px)
|       +-- PageIndicator (700 28px Montserrat, #999)
|       +-- ArrowBtn (48x48px, p: 10px)
|
+-- gap: 64px
|
+-- SpotlightSection (px: 144px, flex-col, gap: 16px)
|   +-- SectionHeader (same pattern as above)
|   +-- SpotlightBoard (full width, r: 47px, border: 1px #998C5F)
|       +-- BgImage (cover) + DarkOverlay (70%)
|       +-- Header (flex-row)
|       |   +-- TotalCount (700 36px Montserrat, white)
|       |   +-- PanZoomBtn (icon)
|       |   +-- SearchInput
|       +-- WordCloud (scattered text nodes, size: 6-11px, opacity: 0.1-1.0)
|
+-- gap: 64px
|
+-- AllKudosSection (px: 144px, flex-col, gap: 16px)
|   +-- SectionHeader (same pattern)
|   +-- ContentRow (flex-row, gap: 80px)
|       +-- FeedColumn (flex-1 min-w-0, flex-col, gap: 24px)
|       |   +-- KudosCard (w: 680px, p: 40px 40px 16px, bg: #FFF8E1, r: 24px)
|       |   |   +-- CardHeader (flex-row, gap: 24px)
|       |   |   |   +-- SenderInfo (flex-col, centered, gap: 13px)
|       |   |   |   |   +-- Avatar (64x64, border: 1.87px #FFF, r: 64px)
|       |   |   |   |   +-- Name (700 16px, #00101A)
|       |   |   |   |   +-- AwardBadge (r: 48px, border: 0.5px #FFEA9E)
|       |   |   |   +-- ArrowIcon (32x32px)
|       |   |   |   +-- ReceiverInfo (same as SenderInfo)
|       |   |   +-- Timestamp (700 14px, #999)
|       |   |   +-- Divider (h: 1px, bg: #FFEA9E)
|       |   |   +-- MessageArea (flex-col, gap: 16px)
|       |   |   |   +-- Label (700 16px, #999)
|       |   |   |   +-- QuoteBox (p: 16px 24px, bg: gold-40%, border: 1px #FFEA9E, r: 12px)
|       |   |   |   |   +-- Text (700 20px/32px, #00101A, justify)
|       |   |   |   +-- StickerRow (flex-row, gap: 16px)
|       |   |   |   |   +-- Sticker (88x88, border: 1px #998C5F, r: 18px)
|       |   |   |   +-- Hashtags (700 16px, #D4271D)
|       |   |   +-- ActionBar (flex-row, gap: 24px, justify: space-between)
|       |   |       +-- HeartBtn (p: 16px, gap: 4px, 700 24px, #00101A)
|       |   |       +-- CopyLinkBtn (p: 16px, gap: 4px, 700 16px, #00101A)
|       |   +-- KudosCard (repeating, infinite scroll)
|       |
|       +-- SidebarColumn (w: 422px flex-shrink-0, flex-col, gap: 24px)
|           +-- StatsCard (p: 24px, bg: #00070C, border: 1px #998C5F, r: 17px)
|           |   +-- StatRow (flex-row, justify: space-between)
|           |   |   +-- Label (700 16px, #FFF)
|           |   |   +-- Value (700 32px, #FFEA9E)
|           |   +-- Divider (h: 1px, bg: #2E3940)
|           |   +-- CTAButton (p: 16px, bg: #FFEA9E, r: 8px, 700 22px, #00101A)
|           +-- LeaderboardCard (p: 24px 16px 24px 24px, bg: #00070C, border: 1px #998C5F, r: 17px)
|               +-- Title (700 22px, #FFEA9E)
|               +-- ScrollableList (382x384px, flex-col, gap: 16px)
|                   +-- Row (364x64px, flex-row, gap: 8px)
|                       +-- Avatar (64x64, border: 1.87px #FFF, r: 64px)
|                       +-- Info (flex-col)
|                           +-- Name (700 22px, #FFEA9E)
|                           +-- Dept (700 16px, #FFF)
|
+-- gap: 64px
|
+-- Footer (px: 90px, py: 40px, flex-row, justify: space-between)
    +-- Logo (69x64px)
    +-- NavLinks (flex-row, gap: 48px)
    |   +-- Link (p: 16px, r: 4px, 700 16px Montserrat, #FFF)
    |   +-- Link.active (bg: gold-10%, text-shadow: glow)
    +-- Copyright (700 16px Montserrat Alternates, #FFF)
```

---

## Responsive Specifications

### Breakpoints

| Name | Min Width | Max Width |
|------|-----------|-----------|
| Mobile | 0 | 639px |
| Tablet | 640px | 1023px |
| Desktop | 1024px | Infinity |

### Responsive Changes

#### Mobile (< 640px)

| Component | Changes |
|-----------|---------|
| Page gutters | padding: 0 16px (from 144px) |
| Nav bar | Collapse to hamburger menu, keep logo + avatar |
| Hero banner | Reduce height, stack input pills vertically |
| Section tab titles | font-size: 32px (from 57px) |
| Highlight carousel | Single card view, full width |
| Spotlight board | Reduce height, simplified view |
| All Kudos layout | Stack feed above sidebar (single column) |
| Kudos card | Full width, reduce padding to 24px 16px 12px |
| Sidebar | Full width below feed |
| Footer | Stack vertically, center align |

#### Tablet (640px - 1023px)

| Component | Changes |
|-----------|---------|
| Page gutters | padding: 0 48px |
| Highlight carousel | Show 1-2 cards |
| All Kudos layout | Stack feed above sidebar |
| Feed column | Full width |
| Sidebar | Full width below feed, 2-column grid for stats |

#### Desktop (>= 1024px)

| Component | Changes |
|-----------|---------|
| Page gutters | padding: 0 144px (or scaled proportionally) |
| All Kudos layout | Side-by-side: 680px feed + 80px gap + 422px sidebar |
| Everything else | As designed at 1440px |

---

## Icon Specifications

| Icon Name | Size | Color | Usage |
|-----------|------|-------|-------|
| Pen/Edit icon | 24x24 | #FFF | Kudos input pill prefix |
| Search/Magnifier | 24x24 | #FFF | Search pill prefix, Spotlight search |
| Chevron Down | 24x24 | #FFF | Filter dropdown indicator |
| Chevron Left | 28x28 | #FFF | Carousel previous arrow |
| Chevron Right | 28x28 | #FFF | Carousel next arrow |
| Arrow (sent) | 32x32 | #00101A | Sender-to-receiver indicator on cards |
| Heart (inactive) | 32x32 | gray | Like button (not liked) |
| Heart (active) | 32x32 | red | Like button (liked) |
| Copy/Link | 24x24 | #00101A | Copy link button |
| Bell | 20x20 | #FFF | Notification bell |
| Pan/Zoom | 24x24 | #FFF | Spotlight pan/zoom toggle |
| Gift/Box | 24x24 | #00101A | "Mo Secret Box" button icon |
| Globe/Flag | 24x24 | - | Language switcher |

---

## Animation & Transitions

| Element | Property | Duration | Easing | Trigger |
|---------|----------|----------|--------|---------|
| Carousel slide | transform | 300ms | ease-in-out | Arrow click |
| Heart icon | color, scale | 200ms | ease-out | Click |
| Nav link | text-shadow, color | 150ms | ease-in-out | Hover/Active |
| Filter button | background-color | 150ms | ease-in-out | Hover |
| Profile tooltip | opacity, transform | 200ms | ease-out | Hover |
| Copy link toast | opacity | 300ms | ease-in-out | Show/hide |
| Infinite scroll | opacity | 200ms | ease-in | Load |

---

## Implementation Mapping

| Design Element | Figma Node ID | Tailwind / CSS Class | React Component |
|----------------|---------------|---------------------|-----------------|
| Page Container | 2940:13431 | `bg-[#00101A] min-h-screen` | `<KudosLiveBoard />` |
| Navigation Bar | (Section 2) | `fixed top-0 w-full bg-[rgba(16,20,23,0.8)] px-36 py-3` | `<NavBar />` |
| Hero Banner | 2940:13437 | `relative h-[512px] bg-cover` | `<HeroBanner />` |
| Kudos Input Pill | 2940:13449 | `rounded-[68px] border border-[#998C5F] bg-[rgba(255,234,158,0.1)] px-4 py-6` | `<KudosInputPill />` |
| Highlight Section | 2940:13451 | `px-36 flex flex-col gap-4` | `<HighlightKudos />` |
| Filter Button | 2940:13459 | `rounded border border-[#998C5F] bg-[rgba(255,234,158,0.1)] p-4` | `<FilterButton />` |
| Carousel | 2940:13461 | `flex flex-row gap-6 relative` | `<KudosCarousel />` |
| Carousel Card | 2940:13465 | `w-[528px] rounded-2xl border-4 border-[#FFEA9E] bg-[#FFF8E1] p-6` | `<HighlightCard />` |
| Spotlight Board | 2940:14174 | `rounded-[47px] border border-[#998C5F] overflow-hidden` | `<SpotlightBoard />` |
| All Kudos Section | 2940:13475 | `px-36 flex flex-col gap-4` | `<AllKudos />` |
| Kudos Post Card | 3127:21871 | `rounded-3xl bg-[#FFF8E1] p-10 pb-4` | `<KudosCard />` |
| User Info Block | (multiple) | `flex flex-col items-center gap-[13px]` | `<UserInfo />` |
| Avatar | (multiple) | `w-16 h-16 rounded-full border-2 border-white` | `<Avatar />` |
| Quote Box | (message area) | `rounded-xl border border-[#FFEA9E] bg-[rgba(255,234,158,0.4)] p-4 px-6` | `<QuoteBox />` |
| Hashtag | (multiple) | `text-[#D4271D] font-bold text-base` | `<Hashtag />` |
| Heart Button | (multiple) | `flex items-center gap-1 p-4 rounded` | `<HeartButton />` |
| Sidebar Stats | 2940:13488 | `rounded-[17px] border border-[#998C5F] bg-[#00070C] p-6` | `<StatsCard />` |
| CTA Button | 2940:13497 | `rounded-lg bg-[#FFEA9E] p-4 text-[#00101A] font-bold` | `<SecretBoxButton />` |
| Leaderboard | 2940:13510 | `rounded-[17px] border border-[#998C5F] bg-[#00070C] p-6` | `<LeaderboardCard />` |
| Video Play Overlay | (multiple) | `absolute inset-0 flex items-center justify-center` | `<VideoPlayOverlay />` |
| Category Label | D.4 (I3127:21871;2234:33038) | `font-bold text-base text-[#00101A]` | `<CategoryLabel />` |
| Notification Bell | (nav) | `relative w-10 h-10 p-[10px] rounded` | `<NotificationBell />` |
| Search Pill | 2940:14833 | `rounded-[68px] border border-[#998C5F] bg-[rgba(255,234,158,0.1)] px-4 py-6` | `<SearchPill />` |
| Footer | (Footer) | `w-full px-[90px] py-10 flex justify-between items-center` | `<Footer />` |

---

## Notes

- All colors should use CSS variables for theming support (Figma variables already defined)
- Primary font is **Montserrat** (Google Fonts), with **Montserrat Alternates** for copyright text
- **SVN-Gotham** is used only for the large decorative "KUDOS" text in the hero - load as local font. **Important**: Figma exports line-height as 34.95px for the 139.78px KUDOS text, but this creates text overflow in CSS. Use `leading-[0.85]` instead.
- **Hero KUDOS logo**: The Sun* S-wing mark is rendered using `<Icon name="rules" />` (hardcoded red fills #E73928/#B72927) before the "KUDOS" text in a `flex items-end` row. Sized at 48px mobile, 60px tablet, 80px desktop.
- All icons **MUST BE** in **Icon Component** instead of svg files or img tags
- Ensure color contrast meets WCAG AA (4.5:1 for normal text) - gold on dark navy meets this
- The design uses a **dark theme** with gold accent palette throughout
- All font weights appear to be **700 (bold)** - this is intentional per the design system
- **Constitution compliance**: Per constitution V.TailwindCSS, the custom color/spacing values in this design should be added to `tailwind.config` as design tokens (e.g., `colors.kudos.gold: '#FFEA9E'`) rather than using arbitrary values like `bg-[#FFEA9E]` throughout. The implementation mapping above uses arbitrary values for clarity; during implementation, extract these into the Tailwind config theme extension.
- **Constitution compliance**: Per constitution V.Next.js, prefer Server Components for data fetching (kudos feed, highlights, stats, leaderboard). Use `"use client"` only for interactive components (carousel, heart button, spotlight pan/zoom, infinite scroll trigger).
- **Font loading**: Montserrat should be loaded via `next/font/google`. SVN-Gotham is a custom font and must be loaded via `next/font/local` from `public/fonts/`.
