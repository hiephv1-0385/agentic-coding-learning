# Design Style: Viet Kudo (Write Kudos Modal)

**Frame ID**: `520:11602`
**Frame Name**: `Viet Kudo`
**File Key**: `9ypp4enmFmdK3YAFJLIu6C`
**Extracted At**: 2026-03-12

---

## Design Tokens

### Colors

| Token Name | Hex Value | Opacity | Usage |
|------------|-----------|---------|-------|
| --color-modal-bg | #FFF8E1 | 100% | Modal background (rgba(255, 248, 225, 1)) |
| --color-overlay | #00101A | 80% | Backdrop overlay (rgba(0, 16, 26, 0.8)) |
| --color-text-primary | #00101A | 100% | Headings, labels, body text |
| --color-text-placeholder | #999999 | 100% | Input placeholders, hint text |
| --color-text-hint | #999999 | 100% | Helper text below fields |
| --color-required-asterisk | #CF1322 | 100% | Required field indicator (*) |
| --color-border | #998C5F | 100% | Input borders, toolbar borders |
| --color-input-bg | #FFFFFF | 100% | Input/textarea backgrounds |
| --color-btn-primary-bg | #FFEA9E | 100% | Submit button background |
| --color-btn-secondary-bg | rgba(255, 234, 158, 0.10) | 10% | Cancel button background |
| --color-delete-badge | #D4271D | 100% | Image delete (x) button |
| --color-link-red | #E46060 | 100% | "Tiêu chuẩn cộng đồng" link text |
| --color-page-bg | #00101A | 100% | Page background behind modal |

### Typography

| Token Name | Font Family | Size | Weight | Line Height | Letter Spacing |
|------------|-------------|------|--------|-------------|----------------|
| --text-modal-title | Montserrat | 32px | 700 | 40px | 0 |
| --text-field-label | Montserrat | 22px | 700 | 28px | 0 |
| --text-input | Montserrat | 16px | 700 | 24px | 0.15px |
| --text-hint | Montserrat | 16px | 700 | 24px | 0.5px |
| --text-btn-primary | Montserrat | 22px | 700 | 28px | 0 |
| --text-btn-secondary | Montserrat | 16px | 700 | 24px | 0.15px |
| --text-checkbox-label | Montserrat | 22px | 700 | 28px | 0 |
| --text-required | Noto Sans JP | 16px | 700 | 20px | 0 |
| --text-tag-label | Montserrat | 11px | 700 | 16px | 0.5px |
| --text-community-link | Montserrat | 16px | 700 | 24px | 0.15px |

### Spacing

| Token Name | Value | Usage |
|------------|-------|-------|
| --spacing-modal-padding | 40px | Modal internal padding (all sides) |
| --spacing-section-gap | 32px | Gap between major modal sections |
| --spacing-field-gap | 16px | Gap between label and input (horizontal) |
| --spacing-content-gap | 24px | Gap between content sections (toolbar+textarea, hashtag, image) |
| --spacing-input-padding-x | 24px | Input horizontal padding |
| --spacing-input-padding-y | 16px | Input vertical padding |
| --spacing-btn-padding-primary | 16px | Primary button padding |
| --spacing-btn-padding-secondary | 16px 40px | Cancel button padding |
| --spacing-toolbar-padding | 10px 16px | Toolbar button padding |
| --spacing-action-gap | 24px | Gap between Cancel and Submit buttons |
| --spacing-tag-gap | 8px | Gap between hashtag chips |
| --spacing-image-gap | 16px | Gap between image thumbnails |
| --spacing-hint-gap | 4px | Gap between textarea and hint text |

### Border & Radius

| Token Name | Value | Usage |
|------------|-------|-------|
| --radius-modal | 24px | Modal container |
| --radius-input | 8px | Input fields, dropdown |
| --radius-btn-primary | 8px | Submit button |
| --radius-btn-secondary | 4px | Cancel button |
| --radius-toolbar-left | 8px 0 0 0 | First toolbar button (Bold) |
| --radius-toolbar-right | 0 8px 0 0 | Last toolbar button area |
| --radius-textarea | 0 0 8px 8px | Textarea (below toolbar) |
| --radius-checkbox | 4px | Checkbox |
| --radius-image-thumb | 4px | Image thumbnail |
| --radius-image-container | 18px | Image container outer |
| --radius-delete-badge | 71px | Circular delete badge |
| --border-width | 1px | All borders |
| --border-style | solid | All borders |

### Shadows

| Token Name | Value | Usage |
|------------|-------|-------|
| --shadow-modal | none | Modal has no box-shadow in design |

---

## Layout Specifications

### Container (Modal)

| Property | Value | Notes |
|----------|-------|-------|
| width | 752px | Fixed modal width |
| height | auto | Content-driven height (Figma frame: 1012px) |
| max-height | calc(100vh - 80px) | Viewport-constrained with 40px margin top/bottom |
| overflow-y | auto | Scroll when content exceeds max-height |
| padding | 40px | All sides |
| border-radius | 24px | Rounded corners |
| background | #FFF8E1 | Warm cream |

### Overlay (Backdrop)

| Property | Value | Notes |
|----------|-------|-------|
| width | 100% | Full viewport |
| height | 100% | Full viewport |
| background | rgba(0, 16, 26, 0.8) | Dark overlay |
| position | fixed | Cover entire screen |

### Grid/Flex Layout

| Property | Value | Notes |
|----------|-------|-------|
| display | flex | Modal content |
| flex-direction | column | Vertical stack |
| gap | 32px | Between major sections |
| align-items | flex-start | Left-aligned children |

### Layout Structure (ASCII)

```
┌─────────────── Modal (752px, p: 40px, r: 24px, bg: #FFF8E1) ──────────────┐
│                                                                             │
│  ┌──────────────────────── Title (672px) ──────────────────────────┐        │
│  │  "Gửi lời cám ơn và ghi nhận đến đồng đội"                      │        │
│  │  (32px, 700, center, color: #00101A)                            │        │
│  └─────────────────────────────────────────────────────────────────┘        │
│                                gap: 32px                                    │
│  ┌─ Người nhận (672px, flex-row, gap: 16px) ──────────────────────┐        │
│  │ [Label 146px] [Search Input (flex:1, h:56px, r:8px)]           │        │
│  └─────────────────────────────────────────────────────────────────┘        │
│                                gap: 32px                                    │
│  ┌─ Danh hiệu (672px) ────────────────────────────────────────────┐        │
│  │ [Label 139px] [Text Input (514px, h:56px, r:8px)]              │        │
│  │ [Hint text: "Ví dụ: Người truyền động lực cho tôi..."]          │        │
│  └─────────────────────────────────────────────────────────────────┘        │
│                                gap: 32px                                    │
│  ┌─ Content (672px, gap: 24px) ───────────────────────────────────┐        │
│  │                                                                 │        │
│  │  ┌─ Nhập kudo (672px) ────────────────────────────────┐        │        │
│  │  │ ┌─ Toolbar (672px, h: 40px, flex-row) ────────────┐│        │        │
│  │  │ │ [B][I][S][#][🔗][""] │ [Tiêu chuẩn cộng đồng]   ││        │        │
│  │  │ │ (each: 40px h, p: 10px 16px, border: #998C5F)  ││        │        │
│  │  │ └─────────────────────────────────────────────────┘│        │        │
│  │  │ ┌─ Textarea (672px, h: 200px, min-h: 120px) ─────┐│        │        │
│  │  │ │ placeholder: "Hãy gửi gắm lời cám ơn..."         ││        │        │
│  │  │ │ (bg: #FFF, border: #998C5F, r: 0 0 8px 8px)     ││        │        │
│  │  │ └─────────────────────────────────────────────────┘│        │        │
│  │  │ [Hint: 'Bạn có thể "@ + tên" để nhắc tới...' ]     │        │        │
│  │  └────────────────────────────────────────────────────┘        │        │
│  │                          gap: 24px                              │        │
│  │  ┌─ Hashtag (672px, flex-row, gap: 16px) ─────────────┐       │        │
│  │  │ [Label 108px] [+ Hashtag btn (116x48)] [chips...]  │       │        │
│  │  └────────────────────────────────────────────────────┘        │        │
│  │                          gap: 24px                              │        │
│  │  ┌─ Image (672px, flex-row, gap: 16px) ───────────────┐       │        │
│  │  │ [Label 74px] [Thumb 80x80]x5 [+ Image btn 98x48]  │       │        │
│  │  └────────────────────────────────────────────────────┘        │        │
│  └─────────────────────────────────────────────────────────────────┘        │
│                                gap: 32px                                    │
│  ┌─ Anonymous Section (672px, flex-col) ──────────────────────────┐        │
│  │ ┌─ Checkbox Row (flex-row, gap: 16px) ───────────────────────┐│        │
│  │ │ [Checkbox 24x24] [Label: "Gửi lời cám ơn và ghi nhận..."]  ││        │
│  │ └────────────────────────────────────────────────────────────┘│        │
│  │ ┌─ Anonymous Name (conditional, mt: 16px) ───────────────────┐│        │
│  │ │ [Text Input (672px, h:56px, r:8px)] (hidden by default)    ││        │
│  │ └────────────────────────────────────────────────────────────┘│        │
│  └─────────────────────────────────────────────────────────────────┘        │
│                                gap: 32px                                    │
│  ┌─ Actions (672px, flex-row, gap: 24px) ─────────────────────────┐        │
│  │ [Huy btn (auto, h:60px)] [Gui btn (502px, h:60px, bg:#FFEA9E)]│        │
│  └─────────────────────────────────────────────────────────────────┘        │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Component Style Details

### Modal Title - "Gửi lời cám ơn và ghi nhận đến đồng đội"

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | I520:11647;520:9870 | - |
| width | 672px | `width: 100%` |
| height | 80px | `height: auto` |
| font-family | Montserrat | `font-family: 'Montserrat', sans-serif` |
| font-size | 32px | `font-size: 32px` |
| font-weight | 700 | `font-weight: 700` |
| line-height | 40px | `line-height: 40px` |
| text-align | center | `text-align: center` |
| color | #00101A | `color: #00101A` |

---

### Field Label (Người nhận* / Danh hiệu* / Hashtag* / Image)

**Note:** Người nhận, Danh hiệu, and Hashtag labels have a red asterisk (*) indicating required fields. The Image label does NOT have an asterisk (optional field).

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | I520:11647;520:9872 (Người nhận*), I520:11647;1688:10436 (Danh hiệu*), I520:11647;520:9891 (Hashtag*), I520:11647;520:9897 (Image) | - |
| font-family | Montserrat | `font-family: 'Montserrat', sans-serif` |
| font-size | 22px | `font-size: 22px` |
| font-weight | 700 | `font-weight: 700` |
| line-height | 28px | `line-height: 28px` |
| color | #00101A | `color: #00101A` |
| display | flex | `display: flex` |
| align-items | center | `align-items: center` |
| gap | 2px | `gap: 2px` |

**Required Asterisk (*):**
| Property | Value | CSS |
|----------|-------|-----|
| font-family | Noto Sans JP | `font-family: 'Noto Sans JP', sans-serif` |
| font-size | 16px | `font-size: 16px` |
| font-weight | 700 | `font-weight: 700` |
| line-height | 20px | `line-height: 20px` |
| color | #CF1322 | `color: #CF1322` |

---

### Search Input (Người nhận dropdown)

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | I520:11647;520:9873 | - |
| flex | 1 0 0 | `flex: 1 0 0` |
| height | 56px | `height: 56px` |
| padding | 16px 24px | `padding: 16px 24px` |
| background | #FFFFFF | `background-color: #FFFFFF` |
| border | 1px solid #998C5F | `border: 1px solid #998C5F` |
| border-radius | 8px | `border-radius: 8px` |
| display | flex | `display: flex` |
| align-items | center | `align-items: center` |
| justify-content | space-between | `justify-content: space-between` |

**Placeholder Text:**
| Property | Value | CSS |
|----------|-------|-----|
| font-family | Montserrat | `font-family: 'Montserrat', sans-serif` |
| font-size | 16px | `font-size: 16px` |
| font-weight | 700 | `font-weight: 700` |
| line-height | 24px | `line-height: 24px` |
| letter-spacing | 0.15px | `letter-spacing: 0.15px` |
| color | #999999 | `color: #999` |

**Dropdown Icon:** 24x24px, right-aligned

**States:**
| State | Changes |
|-------|---------|
| Default | border: 1px solid #998C5F |
| Focus | border-color: #FFEA9E (predicted) |
| Error | border-color: #CF1322 (predicted) |

---

### Danh hiệu Input (Title/Honor Input)

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | I520:11647;1688:10437 | - |
| width | 514px | `width: 514px` |
| height | 56px | `height: 56px` |
| padding | 16px 24px | `padding: 16px 24px` |
| background | #FFFFFF | `background-color: #FFFFFF` |
| border | 1px solid #998C5F | `border: 1px solid #998C5F` |
| border-radius | 8px | `border-radius: 8px` |

**Hint Text below:**
| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | I520:11647;1688:10447 | - |
| font-family | Montserrat | `font-family: 'Montserrat', sans-serif` |
| font-size | 16px | `font-size: 16px` |
| font-weight | 700 | `font-weight: 700` |
| line-height | 24px | `line-height: 24px` |
| color | #999999 | `color: #999` |

**States:**
| State | Changes |
|-------|---------|
| Default | border: 1px solid #998C5F |
| Focus | border-color: #FFEA9E (predicted) |
| Error | border-color: #CF1322 (predicted) |

---

### Rich Text Toolbar

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | I520:11647;520:9877 | - |
| width | 672px (fills container) | `width: 100%` |
| height | 40px | `height: 40px` |
| display | flex | `display: flex` |
| flex-direction | row | `flex-direction: row` |

**Toolbar Button (Bold, Italic, Strikethrough, Number List, Link, Quote):**
| Property | Value | CSS |
|----------|-------|-----|
| **Node IDs** | I520:11647;520:9881, I520:11647;662:11119, I520:11647;662:11213, I520:11647;662:10376, I520:11647;662:10507, I520:11647;662:10647 | - |
| height | 40px | `height: 40px` |
| padding | 10px 16px | `padding: 10px 16px` |
| background | transparent | `background: transparent` |
| border | 1px solid #998C5F | `border: 1px solid #998C5F` |
| icon-size | 24x24px | `width: 24px; height: 24px` |

**First button (Bold):** border-radius: 8px 0 0 0
**Community Standards Link:**
| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | I520:11647;3053:11621 | - |
| font-size | 16px | `font-size: 16px` |
| color | #E46060 | `color: #E46060` |
| text-align | right | `text-align: right` |

**States:**
| State | Changes |
|-------|---------|
| Default | background: transparent |
| Active/Toggled | background: rgba(255, 234, 158, 0.2) (predicted) |
| Hover | background: rgba(0, 0, 0, 0.05) (predicted) |

---

### Textarea (Kudos Message)

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | I520:11647;520:9886 | - |
| width | 672px (fill) | `width: 100%` |
| height | 200px | `height: 200px` |
| min-height | 120px | `min-height: 120px` |
| padding | 16px 24px | `padding: 16px 24px` (Figma shows padding-left: 24px; top/right/bottom padding inferred from visual spacing of placeholder text) |
| background | #FFFFFF | `background-color: #FFFFFF` |
| border | 1px solid #998C5F | `border: 1px solid #998C5F` |
| border-radius | 0 0 8px 8px | `border-radius: 0 0 8px 8px` |

**Placeholder:** "Hãy gửi gắm lời cám ơn và ghi nhận đến đồng đội tại đây nhé!"
| Property | Value |
|----------|-------|
| font-size | 16px |
| font-weight | 700 |
| color | #999999 |
| line-height | 24px |

**States:**
| State | Changes |
|-------|---------|
| Default | border: 1px solid #998C5F, background: #FFFFFF |
| Focus | border-color: #FFEA9E (predicted) |
| Error | border-color: #CF1322 (predicted) |
| Disabled | background: #F5F5F5, cursor: not-allowed (predicted, during submission) |

**Hint below textarea:**
| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | I520:11647;520:9888 | - |
| text | Bạn có thể "@ + tên" để nhắc tới đồng nghiệp khác | - |
| font-size | 16px | `font-size: 16px` |
| font-weight | 700 | `font-weight: 700` |
| line-height | 24px | `line-height: 24px` |
| letter-spacing | 0.5px | `letter-spacing: 0.5px` |
| color | #00101A | `color: #00101A` |

---

### Hashtag Chip / Add Button

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | I520:11647;662:8911 | - |
| height | 48px | `height: 48px` |
| padding | 4px 8px | `padding: 4px 8px` |
| background | #FFFFFF | `background-color: #FFFFFF` |
| border | 1px solid #998C5F | `border: 1px solid #998C5F` |
| border-radius | 8px | `border-radius: 8px` |
| gap | 8px | `gap: 8px` |
| display | flex | `display: flex` |
| align-items | center | `align-items: center` |

**"+ Hashtag" label:**
| Property | Value |
|----------|-------|
| font-size | 11px |
| font-weight | 700 |
| color | #999 |
| line-height | 16px |
| letter-spacing | 0.5px |

**"Tối đa 5" sub-label:** same style as above

**Plus icon:** 24x24px

**States (applies to both "+ Hashtag" and "+ Image" buttons):**
| State | Changes |
|-------|---------|
| Default | background: #FFFFFF, border: 1px solid #998C5F |
| Hover | background: #FFF8E1 (predicted) |
| Focus | outline: 2px solid #FFEA9E, outline-offset: 2px (predicted) |
| Hidden | display: none (when max 5 reached) |

---

### Image Thumbnail

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | I520:11647;662:9197 (and siblings) | - |
| width | 80px | `width: 80px` |
| height | 80px | `height: 80px` |
| aspect-ratio | 1/1 | `aspect-ratio: 1/1` |
| border | 1px solid #998C5F | `border: 1px solid #998C5F` |
| border-radius | 18px (outer), 4px (inner image) | `border-radius: 18px` |
| background | #FFFFFF | `background: #FFFFFF` |

**Delete Badge (x):**
| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | I520:11647;662:9197;662:9287 | - |
| width | 20px | `width: 20px` |
| height | 20px | `height: 20px` |
| background | #D4271D | `background-color: #D4271D` |
| border-radius | 71px (circle) | `border-radius: 50%` |
| position | top-right | `position: absolute; top: -4px; right: -4px` |
| icon-size | 17x17px | - |

**"+ Image" Button:**
| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | I520:11647;662:9133 | - |
| height | 48px | `height: 48px` |
| padding | 4px 8px | `padding: 4px 8px` |
| background | #FFFFFF | `background-color: #FFFFFF` |
| border | 1px solid #998C5F | `border: 1px solid #998C5F` |
| border-radius | 8px | `border-radius: 8px` |

**"+ Image" label & "Tối đa 5" sub-label:** Same style as "+ Hashtag" label (11px, 700, #999, line-height: 16px, letter-spacing: 0.5px)

---

### Anonymous Checkbox

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | I520:11647;520:14099 | - |
| display | flex | `display: flex` |
| align-items | center | `align-items: center` |
| gap | 16px | `gap: 16px` |

**Checkbox:**
| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | I520:11647;520:14099;520:14097 | - |
| width | 24px | `width: 24px` |
| height | 24px | `height: 24px` |
| background | #FFFFFF | `background-color: #FFFFFF` |
| border | 1px solid #999 | `border: 1px solid #999` |
| border-radius | 4px | `border-radius: 4px` |

**Checkbox States:**
| State | Changes |
|-------|---------|
| Unchecked (default) | background: #FFFFFF, border: 1px solid #999 |
| Checked | background: #FFEA9E, border: 1px solid #998C5F, checkmark icon in #00101A (predicted) |
| Hover | border-color: #998C5F (predicted) |
| Focus | outline: 2px solid #FFEA9E, outline-offset: 2px (predicted) |

**Label:** "Gửi lời cám ơn và ghi nhận ẩn danh"
| Property | Value |
|----------|-------|
| font-size | 22px |
| font-weight | 700 |
| color | #999999 |

---

### Anonymous Name Field (Conditional - visible when checkbox checked)

| Property | Value | CSS |
|----------|-------|-----|
| width | 672px (fill) | `width: 100%` |
| height | 56px | `height: 56px` |
| padding | 16px 24px | `padding: 16px 24px` |
| background | #FFFFFF | `background-color: #FFFFFF` |
| border | 1px solid #998C5F | `border: 1px solid #998C5F` |
| border-radius | 8px | `border-radius: 8px` |
| margin-top | 16px | `margin-top: 16px` (below checkbox row) |
| visibility | hidden by default | Shown via conditional rendering when isAnonymous=true |

**States:**
| State | Changes |
|-------|---------|
| Default | border: 1px solid #998C5F |
| Focus | border-color: #FFEA9E (predicted) |
| Error | border-color: #CF1322 (predicted) |

**Note:** This field is revealed with a slide-down animation (200ms ease-out) when the anonymous checkbox is checked.

---

### Cancel Button (Huy)

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | I520:11647;520:9906 | - |
| padding | 16px 40px | `padding: 16px 40px` |
| height | 60px (stretch) | `align-self: stretch` |
| background | rgba(255, 234, 158, 0.10) | `background: rgba(255, 234, 158, 0.10)` |
| border | 1px solid #998C5F | `border: 1px solid #998C5F` |
| border-radius | 4px | `border-radius: 4px` |
| font-size | 16px | `font-size: 16px` |
| font-weight | 700 | `font-weight: 700` |
| color | #00101A | `color: #00101A` |
| gap | 8px | `gap: 8px` (text + close icon) |

**Icon:** Close icon, 24x24px

**States:**
| State | Changes |
|-------|---------|
| Default | background: rgba(255, 234, 158, 0.10), border: 1px solid #998C5F |
| Hover | background: rgba(255, 234, 158, 0.20) (predicted) |
| Active | background: rgba(255, 234, 158, 0.30) (predicted) |
| Disabled | opacity: 0.5, cursor: not-allowed (predicted, during submission) |

---

### Submit Button (Gui)

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | I520:11647;520:9907 | - |
| width | 502px | `flex: 1` |
| height | 60px | `height: 60px` |
| padding | 16px | `padding: 16px` |
| background | #FFEA9E | `background-color: #FFEA9E` |
| border | none | `border: none` |
| border-radius | 8px | `border-radius: 8px` |
| font-size | 22px | `font-size: 22px` |
| font-weight | 700 | `font-weight: 700` |
| color | #00101A | `color: #00101A` |
| display | flex | `display: flex` |
| justify-content | center | `justify-content: center` |
| align-items | center | `align-items: center` |
| gap | 4px | `gap: 4px` (text + send icon) |

**Icon:** Send icon, 24x24px

**States:**
| State | Changes |
|-------|---------|
| Default | background: #FFEA9E |
| Hover | background: #FFE082 (predicted) |
| Disabled | background: #E0D6B8, color: #999, cursor: not-allowed (predicted) |

---

## Component Hierarchy with Styles

```
Overlay (fixed, bg: rgba(0,16,26,0.8))
└── Modal (752px, p: 40px, r: 24px, bg: #FFF8E1, flex-col, gap: 32px)
    ├── Title (672px, text: 32px/700, center, color: #00101A)
    │
    ├── NguoiNhan Row (672px, flex-row, gap: 16px, items-center)
    │   ├── Label "Người nhận*" (22px/700, #00101A + 16px/700 #CF1322)
    │   └── SearchInput (flex:1, h:56px, p:16px 24px, r:8px, border:#998C5F)
    │       ├── Placeholder "Tìm kiếm" (16px/700, #999)
    │       └── DropdownIcon (24x24)
    │
    ├── DanhHieu Section (672px)
    │   ├── Row (flex-row, gap: 16px)
    │   │   ├── Label "Danh hiệu*" (22px/700)
    │   │   └── Input (514px, h:56px, p:16px 24px, r:8px, border:#998C5F)
    │   └── HintText (16px/700, #999, "Ví dụ: Người truyền động lực cho tôi...")
    │
    ├── Content (672px, flex-col, gap: 24px)
    │   ├── NhapKudo (672px, flex-col, gap: 4px)
    │   │   ├── NhapNoiDung (672px, flex-col)
    │   │   │   ├── Toolbar (672px, h:40px, flex-row)
    │   │   │   │   ├── BoldBtn (p:10px 16px, r:8px 0 0 0, border:#998C5F)
    │   │   │   │   ├── ItalicBtn (same, no radius)
    │   │   │   │   ├── StrikeBtn (same)
    │   │   │   │   ├── ListBtn (same)
    │   │   │   │   ├── LinkBtn (same)
    │   │   │   │   ├── QuoteBtn (same)
    │   │   │   │   └── CommunityLink (16px, #E46060, r:0 8px 0 0)
    │   │   │   └── Textarea (672px, h:200px, min-h:120px, p:16px 24px, r:0 0 8px 8px)
    │   │   └── HintRow (flex-row, between)
    │   │       └── "Bạn có thể '@+tên'..." (16px/700, #00101A, ls:0.5px)
    │   │
    │   ├── Hashtag Row (672px, flex-row, gap: 16px)
    │   │   ├── Label "Hashtag*" (22px/700)
    │   │   └── TagGroup (flex-row, gap: 8px)
    │   │       ├── AddBtn "+" (h:48px, p:4px 8px, r:8px, border:#998C5F)
    │   │       └── [Chips...]
    │   │
    │   └── Image Row (672px, flex-row, gap: 16px, items-center)
    │       ├── Label "Image" (22px/700)
    │       ├── Thumbnails x5 (80x80, r:18px, border:#998C5F)
    │       │   ├── Image (80x80, r:4px)
    │       │   └── DeleteBadge (20x20, r:50%, bg:#D4271D, top-right)
    │       └── AddBtn "+" (h:48px, p:4px 8px, r:8px, border:#998C5F)
    │
    ├── AnonymousSection (672px, flex-col)
    │   ├── CheckboxRow (flex-row, gap: 16px, items-center)
    │   │   ├── Checkbox (24x24, r:4px, border:#999, bg:#FFF)
    │   │   └── Label (22px/700, #999)
    │   └── AnonymousNameInput (conditional, mt:16px, h:56px, r:8px, border:#998C5F)
    │
    └── Actions (672px, flex-row, gap: 24px)
        ├── CancelBtn (auto, h:60px, p:16px 40px, r:4px, bg:rgba(255,234,158,0.1))
        └── SubmitBtn (502px, h:60px, p:16px, r:8px, bg:#FFEA9E)
```

---

## Responsive Specifications

### Breakpoints

| Name | Min Width | Max Width |
|------|-----------|-----------|
| Mobile | 0 | 639px |
| Tablet | 640px | 1023px |
| Desktop | 1024px | -- |

### Responsive Changes

#### Mobile (< 640px)

| Component | Changes |
|-----------|---------|
| Modal | width: 100%, height: 100vh, border-radius: 0, padding: 24px |
| Title | font-size: 24px |
| Field Labels | font-size: 18px |
| Actions | flex-direction: column, gap: 16px |
| Submit Button | width: 100% |
| Cancel Button | width: 100% |
| Image Thumbnails | width: 60px, height: 60px |
| Toolbar | flex-wrap: wrap |

#### Tablet (640px - 1023px)

| Component | Changes |
|-----------|---------|
| Modal | width: 90%, max-width: 752px |
| Padding | 32px |

#### Desktop (>= 1024px)

| Component | Changes |
|-----------|---------|
| Modal | width: 752px, centered horizontally and vertically |

---

## Icon Specifications

| Icon Name | Size | Color | Usage |
|-----------|------|-------|-------|
| icon-dropdown | 24x24 | #00101A | Người nhận search dropdown arrow |
| icon-bold | 24x24 | #00101A | Toolbar bold toggle |
| icon-italic | 24x24 | #00101A | Toolbar italic toggle |
| icon-strikethrough | 24x24 | #00101A | Toolbar strikethrough toggle |
| icon-list-numbered | 24x24 | #00101A | Toolbar numbered list toggle |
| icon-link | 24x24 | #00101A | Toolbar link insert |
| icon-quote | 24x24 | #00101A | Toolbar blockquote toggle |
| icon-plus | 24x24 | #999 | Add hashtag / Add image button |
| icon-close | 24x24 | #00101A | Cancel button icon |
| icon-close-tiny | 17x17 | #FFFFFF | Image delete badge |
| icon-send | 24x24 | #00101A | Submit button icon |

---

## Animation & Transitions

| Element | Property | Duration | Easing | Trigger |
|---------|----------|----------|--------|---------|
| Modal | opacity, transform | 200ms | ease-out | Open/Close |
| Overlay | opacity | 200ms | ease-out | Open/Close |
| Button (Submit/Cancel) | background-color | 150ms | ease-in-out | Hover |
| Input | border-color | 150ms | ease-in-out | Focus |
| Toolbar Button | background-color | 100ms | ease-in-out | Hover/Toggle |
| Image Delete Badge | opacity, transform | 150ms | ease-out | Hover on thumbnail |
| Checkbox | background-color, border-color | 100ms | ease-in-out | Toggle |

---

## Implementation Mapping

| Design Element | Figma Node ID | Tailwind / CSS Class | React Component |
|----------------|---------------|---------------------|-----------------|
| Modal Container | 520:11647 | `w-[752px] p-10 rounded-3xl bg-[#FFF8E1] flex flex-col gap-8` | `<KudoModal />` |
| Overlay | 520:11646 | `fixed inset-0 bg-[#00101A]/80` | `<ModalOverlay />` |
| Title | I520:11647;520:9870 | `text-[32px] font-bold leading-10 text-center text-[#00101A]` | `<h2>` in modal |
| Field Label | I520:11647;520:9872 | `text-[22px] font-bold leading-7 text-[#00101A]` | `<label>` |
| Required * | - | `text-base font-bold text-[#CF1322]` | `<span>` |
| Search Input | I520:11647;520:9873 | `flex-1 h-14 px-6 py-4 rounded-lg border border-[#998C5F] bg-white` | `<RecipientSearch />` |
| Danh hiệu Input | I520:11647;1688:10437 | `w-[514px] h-14 px-6 py-4 rounded-lg border border-[#998C5F] bg-white` | `<Input />` |
| Toolbar | I520:11647;520:9877 | `flex h-10 border border-[#998C5F]` | `<RichTextToolbar />` |
| Toolbar Button | I520:11647;520:9881 | `h-10 px-4 py-2.5 border-r border-[#998C5F]` | `<ToolbarButton />` |
| Textarea | I520:11647;520:9886 | `w-full h-[200px] min-h-[120px] px-6 py-4 rounded-b-lg border border-[#998C5F] bg-white` | `<RichTextEditor />` |
| Hashtag Group | I520:11647;662:8595 | `flex gap-2 items-center` | `<HashtagSelector />` |
| Add Hashtag Button | I520:11647;662:8911 | `h-12 px-2 py-1 rounded-lg border border-[#998C5F] bg-white` | `<Button variant="tag">` |
| Image Thumbnail | I520:11647;662:9197 | `w-20 h-20 rounded-[18px] border border-[#998C5F] relative` | `<ImageThumbnail />` |
| Delete Badge | I520:11647;662:9197;662:9287 | `absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#D4271D]` | `<DeleteBadge />` |
| Checkbox | I520:11647;520:14099;520:14097 | `w-6 h-6 rounded border border-[#999] bg-white` | `<Checkbox />` |
| Anonymous Name Input | - (conditional) | `w-full h-14 px-6 py-4 rounded-lg border border-[#998C5F] bg-white mt-4` | `<Input />` (conditional) |
| Cancel Button | I520:11647;520:9906 | `px-10 py-4 rounded border border-[#998C5F] bg-[#FFEA9E]/10` | `<Button variant="secondary">` |
| Submit Button | I520:11647;520:9907 | `flex-1 h-[60px] rounded-lg bg-[#FFEA9E] text-[22px] font-bold` | `<Button variant="primary">` |

---

## Notes

- All colors should use CSS variables for theming support
- Prefer Tailwind utility classes where project uses Tailwind
- Icons should be SVG for scalability
- Font should be loaded via Google Fonts or local files (Montserrat, Noto Sans JP)
- Ensure color contrast meets WCAG AA (4.5:1 for normal text)
- All icons **MUST BE** in **Icon Component** instead of svg files or img tags.
- The modal is designed at 752px width on a 1440px viewport
- Toolbar and textarea share a connected border (toolbar has top radius, textarea has bottom radius)
- The community standards link "Tiêu chuẩn cộng đồng" sits right-aligned within the toolbar row; hover state: underline + color darken to #C04040 (predicted)
- **Constitution compliance note**: Arbitrary Tailwind values (e.g., `bg-[#FFF8E1]`) used in the Implementation Mapping table SHOULD be registered as design tokens in `tailwind.config.ts` (e.g., `colors.modal.bg: '#FFF8E1'`) per constitution V.TailwindCSS: "Use design tokens from the Tailwind config rather than arbitrary values."
- All states marked "(predicted)" are inferred from design patterns in this project since Figma only shows the default state for this frame. These should be validated during implementation
