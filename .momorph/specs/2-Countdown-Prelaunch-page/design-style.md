# Design Style: Countdown - Prelaunch Page

**Frame ID**: `2268:35127`
**Frame Name**: `Countdown - Prelaunch page`
**Figma Link**: `https://www.figma.com/design/9ypp4enmFmdK3YAFJLIu6C?node-id=2268:35127`
**Extracted At**: 2026-03-09

---

## Design Tokens

### Colors

| Token Name | Hex Value | Opacity | Usage |
|------------|-----------|---------|-------|
| --color-page-bg | #00101A | 100% | Page background (dark navy) |
| --color-text-white | #FFFFFF | 100% | Title text, digit text, unit labels |
| --color-gradient-start | #00101A | 100% | Gradient overlay start (dark) |
| --color-gradient-mid | rgba(0, 18, 29, 0.46) | 46% | Gradient overlay midpoint |
| --color-gradient-end | rgba(0, 19, 32, 0.00) | 0% | Gradient overlay end (transparent) |
| --color-card-border | #FFEA9E | 50% | Digit card border (gold, 50% opacity) |
| --color-card-gradient-start | #FFFFFF | 100% | Digit card bg gradient start (white) |
| --color-card-gradient-end | rgba(255, 255, 255, 0.10) | 10% | Digit card bg gradient end |

### Typography

| Token Name | Font Family | Size | Weight | Line Height | Letter Spacing | Usage |
|------------|-------------|------|--------|-------------|----------------|-------|
| --text-title | Montserrat | 36px | 700 (italic) | 48px | 0px | Page title (i18n: VN "Sự kiện sẽ bắt đầu sau") |
| --text-unit-label | Montserrat | 36px | 700 | 48px | 0px | Unit labels (i18n: VN "NGÀY"/"GIỜ"/"PHÚT", EN "DAYS"/"HOURS"/"MINUTES") |
| --text-digit | Digital Numbers | 73.73px | 400 | auto | 0% | Countdown digit numbers |

### Spacing

| Token Name | Value | Usage |
|------------|-------|-------|
| --spacing-content-padding | 96px 144px | Content container padding (top/bottom, left/right) |
| --spacing-title-countdown-gap | 24px | Gap between title and countdown row |
| --spacing-unit-gap | 60px | Gap between countdown units (Days, Hours, Minutes) |
| --spacing-digit-gap | 21px | Gap between two digit cards within a unit |
| --spacing-digits-label-gap | 21px | Gap between digit cards row and unit label |

### Border & Radius

| Token Name | Value | Usage |
|------------|-------|-------|
| --radius-digit-card | 12px | Digit card border radius |
| --border-digit-card | 0.75px solid rgba(255, 234, 158, 0.50) | Digit card border (gold at 50%) |

### Shadows & Effects

| Token Name | Value | Usage |
|------------|-------|-------|
| --blur-digit-card | blur(24.96px) | Digit card backdrop blur (glassmorphism) |
| --opacity-digit-card | 0.5 | Digit card overall opacity |

---

## Layout Specifications

### Container (Full Page)

| Property | Value | Notes |
|----------|-------|-------|
| width | 100vw | Full viewport width |
| height | 100vh (min) | `min-h-screen` — NOT fixed height |
| background | #00101A | Dark navy base |
| overflow | hidden | Prevent scroll on background layers |
| position | relative | For absolute positioning of layers |

### Background Layers

| Property | Value | Notes |
|----------|-------|-------|
| BG Image | 100% width, 100% height, object-cover | Fills entire viewport |
| Gradient Overlay | linear-gradient(18deg, #00101A 15.48%, rgba(0,18,29,0.46) 52.13%, rgba(0,19,32,0) 63.41%) | On top of image |
| z-index stacking | Image: 0, Gradient: 1, Content: 2 | Layering order |

### Content Area

| Property | Value | Notes |
|----------|-------|-------|
| display | flex | Flexbox layout |
| flex-direction | column | Vertical stack |
| align-items | center | Horizontally centered |
| justify-content | center | Vertically centered |
| padding | 96px 144px | Desktop padding |
| gap | 24px | Between title and countdown |
| position | relative | Above background layers |
| z-index | 2 | On top of overlay |

### Layout Structure (ASCII)

```
┌──────────────────────────────────────────────────────────────────────────┐
│  Page Container (100vw x 100vh, bg: #00101A, position: relative)        │
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────────┐  │
│  │  BG Image (absolute, inset: 0, object-cover, z-index: 0)          │  │
│  └────────────────────────────────────────────────────────────────────┘  │
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────────┐  │
│  │  Gradient Overlay (absolute, inset: 0, z-index: 1)                 │  │
│  │  background: linear-gradient(18deg, ...)                           │  │
│  └────────────────────────────────────────────────────────────────────┘  │
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────────┐  │
│  │  Content (relative, z-2, flex-col, center, p: 96px 144px)         │  │
│  │                                                                    │  │
│  │  ┌────────────────────────────────────────────────────────────┐    │  │
│  │  │  D: Title "Sự kiện sẽ bắt đầu sau"                        │    │  │
│  │  │  (Montserrat 36px/700 italic, white, text-center)          │    │  │
│  │  └────────────────────────────────────────────────────────────┘    │  │
│  │                           gap: 24px                                │  │
│  │  ┌────────────────────────────────────────────────────────────┐    │  │
│  │  │  E: Countdown Row (flex-row, gap: 60px, centered)          │    │  │
│  │  │                                                            │    │  │
│  │  │  ┌──────────┐     ┌──────────┐     ┌──────────┐           │    │  │
│  │  │  │ E.1 DAYS │     │ E.2 HOURS│     │E.3 MINS  │           │    │  │
│  │  │  │ 175x192  │     │ 175x192  │     │ 175x192  │           │    │  │
│  │  │  │          │     │          │     │          │           │    │  │
│  │  │  │ ┌──┐┌──┐ │     │ ┌──┐┌──┐ │     │ ┌──┐┌──┐ │           │    │  │
│  │  │  │ │00││00│ │     │ │00││05│ │     │ │02││00│ │           │    │  │
│  │  │  │ └──┘└──┘ │     │ └──┘└──┘ │     │ └──┘└──┘ │           │    │  │
│  │  │  │  21px    │     │  21px    │     │  21px    │           │    │  │
│  │  │  │  DAYS    │     │  HOURS   │     │ MINUTES  │           │    │  │
│  │  │  └──────────┘     └──────────┘     └──────────┘           │    │  │
│  │  │       60px gap          60px gap                           │    │  │
│  │  └────────────────────────────────────────────────────────────┘    │  │
│  └────────────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## Component Style Details

### A: Background Image

| Property | Value | CSS / Tailwind |
|----------|-------|----------------|
| **Node ID** | `2268:35129` | - |
| width | 100% | `w-full` |
| height | 100% | `h-full` |
| position | absolute | `absolute` |
| inset | 0 | `inset-0` |
| object-fit | cover | `object-cover` |
| z-index | 0 | `z-0` |

**Notes:** Use `next/image` with `fill` prop and `priority` for LCP optimization. Add `aria-hidden="true"` (decorative).

---

### B: Gradient Overlay

| Property | Value | CSS / Tailwind |
|----------|-------|----------------|
| **Node ID** | `2268:35130` | - |
| width | 100% | `w-full` |
| height | 100% | `h-full` |
| position | absolute | `absolute` |
| inset | 0 | `inset-0` |
| z-index | 1 | `z-[1]` |
| background | linear-gradient(18deg, #00101A 15.48%, rgba(0,18,29,0.46) 52.13%, rgba(0,19,32,0) 63.41%) | `bg-[linear-gradient(18deg,#00101A_15.48%,rgba(0,18,29,0.46)_52.13%,rgba(0,19,32,0)_63.41%)]` |

---

### C: Content Container

| Property | Value | CSS / Tailwind |
|----------|-------|----------------|
| **Node ID** | `2268:35131` | - |
| width | 100% | `w-full` |
| height | min 100vh | `min-h-screen` (NOT fixed `h-screen`) |
| display | flex | `flex` |
| flex-direction | column | `flex-col` |
| align-items | center | `items-center` |
| justify-content | center | `justify-center` |
| padding | 96px 144px | `py-24 px-36` (desktop) |
| gap | 24px | `gap-6` |
| position | relative | `relative` |
| z-index | 2 | `z-[2]` |

---

### D: Title - "Sự kiện sẽ bắt đầu sau"

| Property | Value | CSS / Tailwind |
|----------|-------|----------------|
| **Node ID** | `2268:35137` | - |
| width | auto | `w-auto` |
| height | 48px | `h-12` |
| font-family | Montserrat | `font-montserrat` |
| font-size | 36px | `text-4xl` |
| font-weight | 700 | `font-bold` |
| font-style | italic | `italic` |
| line-height | 48px | `leading-[48px]` |
| letter-spacing | 0px | `tracking-normal` |
| color | #FFFFFF | `text-white` |
| text-align | center | `text-center` |

---

### E: Countdown Row

| Property | Value | CSS / Tailwind |
|----------|-------|----------------|
| **Node ID** | `2268:35138` | - |
| width | 644px (auto/hug) | `w-auto` |
| height | 192px (auto/hug) | `h-auto` |
| display | flex | `flex` |
| flex-direction | row | `flex-row` |
| align-items | center | `items-center` |
| gap | 60px | `gap-[60px]` |

---

### E.1 / E.2 / E.3: Time Unit (Days / Hours / Minutes)

| Property | Value | CSS / Tailwind |
|----------|-------|----------------|
| **Node IDs** | `2268:35139` (Days), `2268:35144` (Hours), `2268:35149` (Minutes) | - |
| width | 175px | `w-[175px]` |
| height | 192px (auto/hug) | `h-auto` |
| display | flex | `flex` |
| flex-direction | column | `flex-col` |
| align-items | flex-start | `items-start` |
| justify-content | center | `justify-center` |
| gap | 21px | `gap-[21px]` |

### Digit Cards Row (within each unit)

| Property | Value | CSS / Tailwind |
|----------|-------|----------------|
| **Node IDs** | `2268:35140` (Days), `2268:35145` (Hours), `2268:35150` (Minutes) | - |
| width | 175px | `w-[175px]` |
| height | 123px (auto/hug) | `h-auto` |
| display | flex | `flex` |
| flex-direction | row | `flex-row` |
| align-items | center | `items-center` |
| gap | 21px | `gap-[21px]` |

---

### F: Digit Card (Glassmorphism)

| Property | Value | CSS / Tailwind |
|----------|-------|----------------|
| **Component ID** | `186:2619` | Reusable Figma component |
| **Instance examples** | `2268:35141`, `2268:35142`, `2268:35146`, `2268:35147`, `2268:35151`, `2268:35152` | - |
| width | 77px (container) / 76.8px (card) | `w-[77px]` |
| height | 123px (container) / 122.88px (card) | `h-[123px]` |
| position | relative | `relative` |

**Card Background (Rectangle):**

| Property | Value | CSS / Tailwind |
|----------|-------|----------------|
| **Node pattern** | `*;186:2616` | - |
| width | 76.8px | `w-full` (fills container) |
| height | 122.88px | `h-full` (fills container) |
| opacity | 0.5 | `opacity-50` (on this CardBg div ONLY — NOT on parent DigitCard, so digit text remains fully opaque) |
| background | linear-gradient(180deg, #FFF 0%, rgba(255,255,255,0.10) 100%) | `bg-[linear-gradient(180deg,#FFF_0%,rgba(255,255,255,0.10)_100%)]` |
| border | 0.75px solid #FFEA9E | `border-[0.75px] border-[#FFEA9E]` |
| border-radius | 12px | `rounded-xl` |
| backdrop-filter | blur(24.96px) | `backdrop-blur-[25px]` (add `-webkit-backdrop-filter` for Safari) |

**Digit Text:**

| Property | Value | CSS / Tailwind |
|----------|-------|----------------|
| **Node pattern** | `*;186:2617` | - |
| font-family | Digital Numbers | `font-digital` (custom) |
| font-size | 73.73px | `text-[73.73px]` |
| font-weight | 400 | `font-normal` |
| color | #FFFFFF | `text-white` |
| text-align | center | `text-center` |
| position | centered in card | `absolute inset-0 flex items-center justify-center` |

---

### G: Unit Label (DAYS / HOURS / MINUTES)

| Property | Value | CSS / Tailwind |
|----------|-------|----------------|
| **Node IDs** | `2268:35143` (DAYS), `2268:35148` (HOURS), `2268:35153` (MINUTES) | - |
| width | auto (103px / 138px / 173px) | `w-auto` |
| height | 48px | `h-12` |
| font-family | Montserrat | `font-montserrat` |
| font-size | 36px | `text-[36px]` |
| font-weight | 700 | `font-bold` |
| line-height | 48px | `leading-[48px]` |
| letter-spacing | 0px | `tracking-normal` |
| color | #FFFFFF | `text-white` |
| text-align | left | `text-left` |
| text-transform | uppercase | `uppercase` |

---

## Component Hierarchy with Styles

```
CountdownPrelaunchPage (relative w-full min-h-screen bg-[#00101A] overflow-hidden)
├── BackgroundImage <Image> (absolute inset-0 z-0 object-cover w-full h-full)
│   └── next/image with fill, priority, aria-hidden="true"
│
├── GradientOverlay <div> (absolute inset-0 z-[1]
│                          bg-[linear-gradient(18deg,#00101A_15.48%,rgba(0,18,29,0.46)_52.13%,rgba(0,19,32,0)_63.41%)])
│
└── Content <main> (relative z-[2] flex flex-col items-center justify-center
│                    min-h-screen py-24 px-36 gap-6)
    │
    ├── Title <h1> (text-4xl font-bold italic font-montserrat text-white text-center leading-[48px])
    │   └── "Sự kiện sẽ bắt đầu sau"
    │
    └── CountdownRow <div> (flex flex-row items-center gap-[60px]) role="timer" aria-live="polite"
        │
        ├── TimeUnit <div> (flex flex-col items-start justify-center gap-[21px] w-[175px])
        │   ├── DigitCardsRow <div> (flex flex-row items-center gap-[21px])
        │   │   ├── DigitCard <div> (relative w-[77px] h-[123px])
        │   │   │   ├── CardBg <div> (absolute inset-0 opacity-50 rounded-xl
        │   │   │   │                  bg-[linear-gradient(180deg,#FFF_0%,rgba(255,255,255,0.10)_100%)]
        │   │   │   │                  border-[0.75px] border-[#FFEA9E]
        │   │   │   │                  backdrop-blur-[25px])
        │   │   │   └── Digit <span> (absolute inset-0 flex items-center justify-center
        │   │   │                      font-digital text-[73.73px] font-normal text-white
        │   │   │                      transition-all duration-300 ease-in-out)
        │   │   │       └── "0"
        │   │   └── DigitCard (same structure, second digit)
        │   └── Label <span> (text-[36px] font-bold font-montserrat text-white uppercase leading-[48px])
        │       └── "DAYS"
        │
        ├── TimeUnit (same structure)
        │   └── Label: "HOURS"
        │
        └── TimeUnit (same structure)
            └── Label: "MINUTES"
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
| Content padding | padding: 24px 16px | `py-6 px-4` (base) |
| Title | font-size: 20px, line-height: 28px | `text-xl leading-7` (base) |
| Countdown Row | flex-wrap: wrap, gap: 24px, justify: center | `flex-wrap gap-6 justify-center` (base) |
| Time Unit | width: auto, align: center (labels centered under digits) | `w-auto items-center` (base) |
| Digit Cards Row | gap: 12px | `gap-3` (base) |
| Digit Card | width: 52px, height: 83px | `w-[52px] h-[83px]` (base) |
| Digit Text | font-size: 50px | `text-[50px]` (base) |
| Unit Label | font-size: 20px, line-height: 28px | `text-xl leading-7` (base) |
| Digits-Label gap | 12px | `gap-3` (base) |

#### Tablet (640px - 1023px)

| Component | Changes | Tailwind |
|-----------|---------|----------|
| Content padding | padding: 48px 48px | `sm:py-12 sm:px-12` |
| Title | font-size: 28px, line-height: 36px | `sm:text-[28px] sm:leading-9` |
| Countdown Row | gap: 40px, no wrap (all 3 units in row) | `sm:gap-10 sm:flex-nowrap` |
| Digit Card | width: 64px, height: 102px | `sm:w-[64px] sm:h-[102px]` |
| Digit Text | font-size: 61px | `sm:text-[61px]` |
| Unit Label | font-size: 28px, line-height: 36px | `sm:text-[28px] sm:leading-9` |
| Digits-Label gap | 16px | `sm:gap-4` |

#### Desktop (>= 1024px)

| Component | Changes | Tailwind |
|-----------|---------|----------|
| Content padding | padding: 96px 144px | `lg:py-24 lg:px-36` |
| Title | font-size: 36px, line-height: 48px | `lg:text-[36px] lg:leading-[48px]` |
| Countdown Row | gap: 60px | `lg:gap-[60px]` |
| Time Unit | width: 175px, align: flex-start (labels left-aligned) | `lg:w-[175px] lg:items-start` |
| Digit Card | width: 77px, height: 123px | `lg:w-[77px] lg:h-[123px]` |
| Digit Text | font-size: 73.73px | `lg:text-[73.73px]` |
| Unit Label | font-size: 36px, line-height: 48px | `lg:text-[36px] lg:leading-[48px]` |
| Digit Cards Row gap | 21px | `lg:gap-[21px]` |

---

## Icon Specifications

No icons are used in this design. All visual elements are text, background images, and CSS effects.

---

## Animation & Transitions

| Element | Property | Duration | Easing | Trigger |
|---------|----------|----------|--------|---------|
| Digit Value | opacity, transform (translateY) | 300ms | ease-in-out | Value change |
| Digit Card | backdrop-filter | 0ms | - | Static (always applied) |
| Background Image | opacity | 500ms | ease-in | Page load (fade in) |
| Content | opacity, transform (translateY 20px->0) | 600ms | ease-out | Page load (fade up) |

---

## Implementation Mapping

| Design Element | Figma Node ID | Tailwind Classes | React Component |
|----------------|---------------|------------------|-----------------|
| Page Container | `2268:35127` | `relative w-full min-h-screen bg-[#00101A] overflow-hidden` | `<CountdownPrelaunchPage>` |
| Background Image | `2268:35129` | `absolute inset-0 z-0 object-cover` | `<Image fill priority>` |
| Gradient Overlay | `2268:35130` | `absolute inset-0 z-[1] bg-[linear-gradient(...)]` | `<div>` |
| Content Container | `2268:35131` | `relative z-[2] flex flex-col items-center justify-center min-h-screen py-24 px-36 gap-6` | `<main>` |
| Title | `2268:35137` | `text-4xl font-bold italic font-montserrat text-white text-center leading-[48px]` | `<h1>` |
| Countdown Row | `2268:35138` | `flex flex-row items-center gap-[60px]` | `<div role="timer">` |
| Days Unit | `2268:35139` | `flex flex-col items-start justify-center gap-[21px] w-[175px]` | `<TimeUnit>` |
| Hours Unit | `2268:35144` | (same as Days) | `<TimeUnit>` |
| Minutes Unit | `2268:35149` | (same as Days) | `<TimeUnit>` |
| Digit Card | `186:2619` | `relative w-[77px] h-[123px]` | `<DigitCard>` |
| Card Background | `*;186:2616` | `absolute inset-0 opacity-50 rounded-xl bg-[linear-gradient(...)] border-[0.75px] border-[#FFEA9E] backdrop-blur-[25px]` | `<div>` |
| Digit Text | `*;186:2617` | `absolute inset-0 flex items-center justify-center font-digital text-[73.73px] text-white transition-all duration-300` | `<span>` |
| DAYS Label | `2268:35143` | `text-[36px] font-bold font-montserrat text-white uppercase leading-[48px]` | `<span>` |
| HOURS Label | `2268:35148` | (same as DAYS) | `<span>` |
| MINUTES Label | `2268:35153` | (same as DAYS) | `<span>` |

---

## Notes

- **Flattened hierarchy**: The Figma design has nested wrapper frames (2268:35131 → 2268:35132 → 2268:35135 → 2268:35136) that serve no visual purpose. The implementation collapses these into a single Content container. The effective gap between title and countdown row is 24px (from the innermost frame 2268:35136).
- All colors use Tailwind arbitrary values since they are unique to this design (dark theme vs warm theme of other components).
- **Fonts**: Two fonts required:
  - **Montserrat** (title + labels) - Must be configured in Tailwind as `font-montserrat`. Verify it is loaded in `layout.tsx`.
  - **Digital Numbers** (digits) - Must be loaded locally and configured in Tailwind as `font-digital`. This is a specialty font for the LED-style countdown appearance.
- **Glassmorphism**: The digit card uses `backdrop-filter: blur(25px)` with a gradient background at 50% opacity. Ensure the `-webkit-backdrop-filter` prefix is applied for Safari compatibility.
- **Background image**: Available via MoMorph media (node `2268:35129`). Use `next/image` with `fill` and `priority` props for optimal loading.
- Color contrast: White (#FFFFFF) on dark (#00101A) yields contrast ratio > 15:1, well exceeding WCAG AA requirements.
- All icons MUST BE in Icon Component instead of svg files or img tags (no icons in this design).
- The digit card component (`186:2619`) is a reusable Figma component instance - implement as a standalone `DigitCard` React component.
- **i18n**: Title and unit labels are localized via the app's i18n system (`src/locales/`). The Figma design shows Vietnamese text; English translations are defined in locale files. See `spec.md` FR-006 and Notes for details.
