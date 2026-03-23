# Design Style: Open Secret Box (Chưa Mở)

**Frame ID**: `1466:7676`
**Frame Name**: `Open secret box- chưa mở`
**Figma Link**: https://www.figma.com/file/9ypp4enmFmdK3YAFJLIu6C/?node-id=1466:7676
**Extracted At**: 2026-03-16

---

## Design Tokens

### Colors

| Token Name | Hex Value | Opacity | Usage |
|------------|-----------|---------|-------|
| --color-bg-overlay | #00101A | 70% | Backdrop overlay behind modal |
| --color-bg-modal | #00101A | 100% | Modal background (Details-Background) |
| --color-separator | #2E3940 | 100% | Horizontal line separators |
| --color-accent-gold | #FFEA9E | 100% | Title text, box count number |
| --color-text-white | #FFFFFF | 100% | Instruction text, label text |

### Typography

| Token Name | Font Family | Size | Weight | Line Height | Letter Spacing |
|------------|-------------|------|--------|-------------|----------------|
| --text-modal-title | Montserrat | 25.46px | 700 | 31.82px | 0px |
| --text-instruction | Montserrat | 12.73px | 700 | 19.09px | 0.4px |
| --text-box-count | Montserrat | 28.64px | 700 | 35px | 0px |
| --text-box-label | Montserrat | 12.73px | 700 | 19.09px | 0.4px |

### Spacing

| Token Name | Value | Usage |
|------------|-------|-------|
| --spacing-modal-padding-x | 12.73px | Modal horizontal padding |
| --spacing-modal-padding-y | 23.87px | Modal vertical padding |
| --spacing-modal-gap | 22.28px | Gap between modal sections |

### Border & Radius

| Token Name | Value | Usage |
|------------|-------|-------|
| --radius-modal | 12.73px | Modal container corners |
| --border-separator | 1px solid #2E3940 | Horizontal separator lines |

### Shadows

| Token Name | Value | Usage |
|------------|-------|-------|
| (none documented) | — | — |

---

## Layout Specifications

### Container (Modal Frame: 1466:7676)

| Property | Value | Notes |
|----------|-------|-------|
| width | 651.55px | Modal width (~652px) |
| height | 822.59px | Modal height (~823px); use max-height with overflow if viewport is shorter |
| position | fixed | Viewport-fixed positioning |
| z-index | 50 | Above backdrop overlay (z-40) |
| top / left | 50% / 50% | `top: 50%; left: 50%; transform: translate(-50%, -50%)` to center on viewport |
| display | flex | Vertical layout |
| flex-direction | column | Top to bottom |
| align-items | center | Center children horizontally |
| justify-content | center | Center children vertically |
| padding | 23.87px 12.73px | Top/Bottom Left/Right (~24px ~13px) |
| gap | 22.28px | Between sections (~22px) |
| background | #00101A | Dark background |
| border-radius | 12.73px | Rounded corners (~13px) |
| max-height | 90vh | Prevent modal exceeding viewport height on small screens |
| overflow-y | auto | Scroll if content exceeds max-height |

### Layout Structure (ASCII)

```
┌──────────────────────────────────────────────────────┐
│  Modal (651.55 x 822.59, bg: #00101A, r: 12.73px)   │
│  padding: 23.87px 12.73px, gap: 22.28px              │
│                                                      │
│  ┌──────────────────────────────────────────────────┐│
│  │ A: Title Bar (626 x 31)                          ││
│  │ "KHÁM PHÁ SECRET BOX CỦA BẠN"    [X close btn]  ││
│  │ 25.46px/700, gold, center                        ││
│  └──────────────────────────────────────────────────┘│
│  ────────────────────────────────────────── separator │
│  ┌──────────────────────────────────────────────────┐│
│  │ B: Instruction (142 x 20, centered)              ││
│  │ "Click vào box để mở"                            ││
│  │ 12.73px/700, white, right-aligned                ││
│  └──────────────────────────────────────────────────┘│
│  ┌──────────────────────────────────────────────────┐│
│  │ C: Box Image Area (557 x 557)                    ││
│  │                                                  ││
│  │   ┌────────────────────────────────┐             ││
│  │   │ Gift box image (558 x 558)    │             ││
│  │   │ (unopened gift box)            │             ││
│  │   │                               │             ││
│  │   │ + sparkle effect overlay       │             ││
│  │   │   (546 x 546, image bg)       │             ││
│  │   └────────────────────────────────┘             ││
│  │                                                  ││
│  └──────────────────────────────────────────────────┘│
│  ────────────────────────────────────────── separator │
│  ┌──────────────────────────────────────────────────┐│
│  │ D: Box Counter (174 x 35, flex-row, gap: 6.36px) ││
│  │ "Secretbox chưa mở"  "05"                        ││
│  │  12.73px/700/white    28.64px/700/gold            ││
│  └──────────────────────────────────────────────────┘│
└──────────────────────────────────────────────────────┘
```

---

## Pixel Value Normalization

> **Important**: The Figma frame uses fractional pixel values (e.g., 25.46px, 12.73px, 651.55px) which suggest the design was created at a non-standard scale. For implementation, **round to the nearest sensible value**:
> - 25.46px → 25px or 26px
> - 12.73px → 13px
> - 651.55px → 652px or use responsive `max-w-[652px]`
> - 22.28px → 22px
> - 23.87px → 24px
> - 28.64px → 29px
> - 6.36px → 6px
>
> The exact fractional values are preserved in this document for reference, but implementation should use rounded integers.

---

## Component Style Details

### Backdrop Overlay

| Property | Value | CSS |
|----------|-------|-----|
| position | fixed | `position: fixed` |
| inset | 0 | `inset: 0` |
| background | rgba(0, 16, 26, 0.70) | `background: rgba(0, 16, 26, 0.7)` |
| z-index | 40 | `z-index: 40` |
| cursor | pointer | `cursor: pointer` (click to dismiss) |

> Follows the same backdrop pattern as `RulesPanel.tsx` in the existing codebase.

---

### A: Title Bar (Frame 551)

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | 1466:7677 | - |
| width | 626px | `width: 100%` |
| height | 31px | `height: auto` |
| position | relative | `position: relative` |

#### Title Text - "KHÁM PHÁ SECRET BOX CỦA BẠN"

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | 1466:7678 | - |
| width | 626px | `width: 100%` |
| font-family | Montserrat | `font-family: 'Montserrat', sans-serif` |
| font-size | 25.46px | `font-size: 25.46px` |
| font-weight | 700 | `font-weight: 700` |
| line-height | 31.82px | `line-height: 31.82px` |
| letter-spacing | 0px | `letter-spacing: 0` |
| color | #FFEA9E | `color: var(--color-accent-gold)` |
| text-align | center | `text-align: center` |

#### Close Button (X Icon)

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | 1466:7679 | - |
| **Component ID** | 214:3851 (Component Set: 178:1020) | - |
| width | 19px | `width: 19px` |
| height | 19px | `height: 19px` |
| position | absolute right | `position: absolute; right: 0; top: 50%; transform: translateY(-50%)` |
| cursor | pointer | `cursor: pointer` |
| touch target | 44x44px minimum | Ensure touch area meets constitution requirement (44x44px on mobile) |

**States:**

| State | Changes |
|-------|---------|
| Default | opacity: 1 |
| Hover | opacity: 0.7 |
| Focus | outline: 2px solid #FFEA9E, outline-offset: 2px |
| Active | opacity: 0.5 |

---

### Separator Lines

| Property | Value | CSS |
|----------|-------|-----|
| **Node IDs** | 1466:7680, 1466:7688 | - |
| width | 626px | `width: 100%` |
| height | 1px | `height: 1px` |
| background | #2E3940 | `background-color: #2E3940` |

---

### B: Instruction Text

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | 1466:7683 (inside 1466:7681) | - |
| width | 142px | `width: auto` |
| font-family | Montserrat | `font-family: 'Montserrat', sans-serif` |
| font-size | 12.73px | `font-size: 12.73px` |
| font-weight | 700 | `font-weight: 700` |
| line-height | 19.09px | `line-height: 19.09px` |
| letter-spacing | 0.4px | `letter-spacing: 0.4px` |
| color | #FFFFFF | `color: white` |
| text-align | right | `text-align: right` |

---

### C: Box Image Area

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | 1466:7684 | - |
| width | 557px | `width: 100%; max-width: 557px` |
| height | 557px | `aspect-ratio: 1/1` |
| position | relative | For overlapping images |

#### Gift Box Image (Unopened)

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | 1466:7686 (MM_MEDIA_box quà chưa mở) | - |
| width | 558.47px | `width: 100%` |
| height | 558.47px | `height: 100%` |
| aspect-ratio | 1/1 | `aspect-ratio: 1/1` |
| cursor | pointer | `cursor: pointer` (clickable to open) |

**States:**

| State | Changes |
|-------|---------|
| Default | cursor: pointer, opacity: 1 |
| Hover | transform: scale(1.03), transition: 200ms ease-out |
| Active (clicking) | transform: scale(0.98) |
| Disabled (count = 0) | opacity: 0.5, cursor: not-allowed, pointer-events: none |
| Loading (API in-flight) | opacity: 0.7, cursor: wait; show loading indicator overlay |

#### Sparkle Effect Overlay

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | 1466:7685 (MM_MEDIA_hiệu ứng box quà) | - |
| width | 546.54px | `width: ~98%` |
| height | 546.54px | `height: ~98%` |
| background | image overlay | `background: url(...) lightgray -102.9px -102.5px / 138.5% 138.5% no-repeat` |
| position | absolute | Overlaid on gift box |
| pointer-events | none | Should not block clicks on box |

---

### D: Box Counter

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | 1466:7689 | - |
| width | 174px | `width: auto` |
| height | 35px | `height: auto` |
| display | flex | `display: flex` |
| flex-direction | row | `flex-direction: row` |
| align-items | center | `align-items: center` |
| gap | 6.36px | `gap: 6px` |

#### Box Count Number

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | 1466:7693 | - |
| font-family | Montserrat | `font-family: 'Montserrat', sans-serif` |
| font-size | 28.64px | `font-size: 28.64px` |
| font-weight | 700 | `font-weight: 700` |
| line-height | 35px | `line-height: 35px` |
| color | #FFEA9E | `color: var(--color-accent-gold)` |
| text-align | right | `text-align: right` |

#### Box Count Label - "Secretbox chưa mở"

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | 1466:7692 | - |
| font-family | Montserrat | `font-family: 'Montserrat', sans-serif` |
| font-size | 12.73px | `font-size: 12.73px` |
| font-weight | 700 | `font-weight: 700` |
| line-height | 19.09px | `line-height: 19.09px` |
| letter-spacing | 0.4px | `letter-spacing: 0.4px` |
| color | #FFFFFF | `color: white` |
| text-align | right | `text-align: right` |

---

## Component Hierarchy with Styles

```
Backdrop Overlay (fixed, inset-0, z-40, bg: rgba(0,16,26,0.7), cursor: pointer)
│
Modal: Open secret box (fixed, z-50, ~652 x ~823, bg: #00101A, r: ~13px, flex-col, center, gap: ~22px, p: ~24px/~13px)
├── A: Title Bar (626 x 31, relative)
│   ├── Title Text: "KHÁM PHÁ SECRET BOX CỦA BẠN" (25px/700, gold #FFEA9E, center)
│   └── Close Icon (19x19, absolute right, componentId: 214:3851, touch: 44x44)
│
├── Separator (w-full x 1, bg: #2E3940)
│
├── B: Instruction (auto width, centered) [hidden when count = 0]
│   └── "Click vào box để mở" (13px/700, white)
│
├── C: Box Image (~557 x ~557, relative)
│   ├── Gift Box Image (~558 x ~558, clickable, media: "box quà chưa mở")
│   │   States: hover(scale 1.03), disabled(opacity 0.5 when count=0), loading(opacity 0.7)
│   ├── Sparkle Effect (~546 x ~546, absolute overlay, pointer-events: none, media: "hiệu ứng box quà")
│   └── "about link" frame (457 x 14, flex-row, empty — appears unused, ignore in implementation)
│
├── Separator (w-full x 1, bg: #2E3940)
│
└── D: Box Counter (auto width, flex-row, gap: ~6px, centered)
    ├── Label: "Secretbox chưa mở" (13px/700, white)
    └── Count: "05" (29px/700, gold #FFEA9E, zero-padded 2 digits)
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
| Modal | width: 90vw, max-width: 100% |
| Title | font-size: 20px |
| Box Image | width: 100%, aspect-ratio: 1/1 |
| Padding | reduce proportionally |

#### Tablet (640px - 1023px)

| Component | Changes |
|-----------|---------|
| Modal | width: 80vw, max-width: 651px |
| Layout | As designed, proportionally scaled |

#### Desktop (>= 1024px)

| Component | Changes |
|-----------|---------|
| Modal | width: 651.55px, as designed |
| Layout | Exact Figma specs |

---

## Icon Specifications

| Icon Name | Size | Color | Usage | Component ID |
|-----------|------|-------|-------|-------------|
| Close (X) | 19x19 | #FFFFFF | Modal close button | 214:3851 (Set: 178:1020) |

---

## Animation & Transitions

| Element | Property | Duration | Easing | Trigger |
|---------|----------|----------|--------|---------|
| Modal | opacity, transform (scale) | 300ms | ease-out | Open |
| Modal | opacity, transform | 200ms | ease-in | Close |
| Gift Box | transform (scale) | 200ms | ease-out | Hover |
| Gift Box | — | — | — | Click → triggers open animation (see "opened" frame) |
| Sparkle Effect | opacity, transform | continuous | ease-in-out | Ambient animation (optional) |

---

## Implementation Mapping

| Design Element | Figma Node ID | Tailwind / CSS Class | React Component |
|----------------|---------------|---------------------|-----------------|
| Backdrop overlay | — | `fixed inset-0 z-40 bg-[rgba(0,16,26,0.7)] cursor-pointer` | `<SecretBoxModal />` (backdrop) |
| Modal container | 1466:7676 | `fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-h-[90vh] overflow-y-auto flex flex-col items-center justify-center gap-[22px] p-[24px_13px] bg-[#00101A] rounded-xl` | `<SecretBoxModal />` (panel) |
| Title bar | 1466:7677 | `relative w-full` | `<div>` |
| Title text | 1466:7678 | `text-center font-montserrat text-[25px] font-bold leading-[32px] text-[#FFEA9E]` | `<h2>` |
| Close button | 1466:7679 | `absolute right-0 top-1/2 -translate-y-1/2 w-[19px] h-[19px] cursor-pointer` | `<Icon name="close" size={19} />` (project `<Icon>` component) |
| Separator | 1466:7680 | `w-full h-px bg-[#2E3940]` | `<div>` |
| Instruction | 1466:7683 | `font-montserrat text-[13px] font-bold leading-[19px] tracking-[0.4px] text-white` | `<p>` |
| Box image area | 1466:7684 | `relative w-full max-w-[557px] aspect-square` | `<div>` |
| Gift box image | 1466:7686 | `w-full h-full object-contain cursor-pointer` | `<Image />` (Next.js) |
| Sparkle overlay | 1466:7685 | `absolute inset-0 pointer-events-none` | `<Image />` |
| Counter area | 1466:7689 | `flex items-center gap-[6px]` | `<div>` |
| Count number | 1466:7693 | `font-montserrat text-[29px] font-bold leading-[35px] text-[#FFEA9E]` | `<span>` |
| Count label | 1466:7692 | `font-montserrat text-[13px] font-bold leading-[19px] tracking-[0.4px] text-white` | `<span>` |

---

## Notes

- All text uses **Montserrat** font family exclusively
- The modal uses the project's dark theme (#00101A background)
- The gift box image is a media asset ("box quà chưa mở") that must be exported from Figma
- The sparkle effect is a separate image overlay ("hiệu ứng box quà") that creates the glowing particles effect
- The Close icon **MUST BE** an **Icon Component** using the project's `<Icon>` component (see `src/components/ui/Icon.tsx`), matching componentId: 214:3851
- This is the "unopened" state — there should be a corresponding "opened" state frame for after the user clicks
- The box count ("05") is dynamic and comes from user data, formatted as zero-padded 2-digit number
- Badge probability distribution (from design specs): Stay Gold 30%, Flow to Horizon 25%, Touch of Light 20%, Beyond the Boundary 10%, Revival 10%, Root Further 5%
- **Pixel normalization**: All fractional pixel values from Figma should be rounded to nearest integer in implementation (see "Pixel Value Normalization" section above)
- **Node 1466:7687 ("about link")**: An empty flex-row frame (457x14) inside the Box Image area. This appears to be unused in the current design and should be **ignored** in implementation unless future designs add content to it
- **Existing code reference**: The trigger button already exists at `src/components/kudos/SecretBoxButton.tsx` with a TODO to open this modal dialog. Follow the modal pattern established in `src/components/rules/RulesPanel.tsx` for backdrop, animation, focus management, and body scroll lock
