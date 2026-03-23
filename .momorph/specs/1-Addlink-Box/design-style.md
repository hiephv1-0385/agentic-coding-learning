# Design Style: Add Link Box

**Frame ID**: `1002:12917`
**Frame Name**: `Addlink Box`
**Figma Link**: `https://www.figma.com/design/9ypp4enmFmdK3YAFJLIu6C?node-id=1002:12917`
**Extracted At**: 2026-03-09

---

## Design Tokens

### Colors

| Token Name | Hex Value | Opacity | Usage |
|------------|-----------|---------|-------|
| --color-background | #FFF8E1 | 100% | Dialog background |
| --color-text-primary | #00101A | 100% | Headings, labels, button text |
| --color-input-bg | #FFFFFF | 100% | Input field background |
| --color-border | #998C5F | 100% | Input borders, cancel button border |
| --color-button-primary | #FFEA9E | 100% | Save button background |
| --color-button-primary-hover | #FFE07A | 100% | Save button hover (predicted) |
| --color-button-primary-active | #FFD54F | 100% | Save button active (predicted) |
| --color-button-secondary-bg | rgba(255, 234, 158, 0.10) | 10% | Cancel button background |
| --color-button-secondary-hover | rgba(255, 234, 158, 0.20) | 20% | Cancel button hover (predicted) |
| --color-button-secondary-active | rgba(255, 234, 158, 0.30) | 30% | Cancel button active (predicted) |
| --color-button-disabled-bg | #F5F5F5 | 100% | Disabled button background (predicted) |
| --color-button-disabled-text | #9CA3AF | 100% | Disabled button text (predicted) |
| --color-error | #EF4444 | 100% | Error message text and error border (predicted) |
| --color-placeholder | #9CA3AF | 100% | Input placeholder text (predicted) |

### Typography

| Token Name | Font Family | Size | Weight | Line Height | Letter Spacing | Usage |
|------------|-------------|------|--------|-------------|----------------|-------|
| --text-title | Montserrat | 32px | 700 | 40px | 0px | Dialog title |
| --text-label | Montserrat | 22px | 700 | 28px | 0px | Field labels |
| --text-input | Montserrat | 16px | 400 | 24px | 0px | Input field text (predicted) |
| --text-placeholder | Montserrat | 16px | 400 | 24px | 0px | Input placeholder text (predicted) |
| --text-button-primary | Montserrat | 22px | 700 | 28px | 0px | Save button text |
| --text-button-secondary | Montserrat | 16px | 700 | 24px | 0.15px | Cancel button text |
| --text-error | Montserrat | 14px | 400 | 20px | 0px | Error message text (predicted) |

### Spacing

| Token Name | Value | Usage |
|------------|-------|-------|
| --spacing-dialog-padding | 40px | Dialog internal padding |
| --spacing-section-gap | 32px | Gap between title, fields, buttons |
| --spacing-field-gap | 16px | Gap between label and input within a field row |
| --spacing-button-gap | 24px | Gap between Cancel and Save buttons |
| --spacing-input-padding | 16px 24px | Input field internal padding |
| --spacing-button-cancel-padding | 16px 40px | Cancel button internal padding |
| --spacing-button-save-padding | 16px | Save button internal padding |
| --spacing-error-top | 4px | Gap between input and error message (predicted) |

### Border & Radius

| Token Name | Value | Usage |
|------------|-------|-------|
| --radius-dialog | 24px | Dialog container border radius |
| --radius-input | 8px | Input field border radius |
| --radius-button-save | 8px | Save button border radius |
| --radius-button-cancel | 4px | Cancel button border radius |
| --border-input | 1px solid #998C5F | Input field border |
| --border-input-error | 1px solid #EF4444 | Input field error border (predicted) |
| --border-cancel-button | 1px solid #998C5F | Cancel button border |

### Shadows

| Token Name | Value | Usage |
|------------|-------|-------|
| --shadow-dialog | none | Dialog has no shadow in design |

---

## Layout Specifications

### Container

| Property | Value | Notes |
|----------|-------|-------|
| width | 752px | Dialog width (desktop) |
| height | auto (min 388px) | Height adjusts for error messages |
| padding | 40px | All sides |
| border-radius | 24px | Rounded corners |
| background | #FFF8E1 | Warm yellow background |

### Grid/Flex Layout

| Property | Value | Notes |
|----------|-------|-------|
| display | flex | Main layout |
| flex-direction | column | Vertical stack |
| gap | 32px | Between title, fields, buttons |
| align-items | flex-start | Left-aligned |

### Layout Structure (ASCII)

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  Dialog Container (752px wide, padding: 40px, bg: #FFF8E1, radius: 24px)   │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │  A: Title "Thêm đường dẫn"                                          │   │
│  │  (672 x 40px, Montserrat 32px/700, color: #00101A)                  │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                     gap: 32px                               │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │  B: Content Field Row (672px wide, flex-row, gap: 16px)              │   │
│  │  ┌─────────────┐  ┌─────────────────────────────────────────────┐   │   │
│  │  │ B.1: Label   │  │ B.2: Input (fill, h:56, p:16px 24px,      │   │   │
│  │  │ "Nội dung"   │  │      bg:#FFF, border:1px #998C5F, r:8px)  │   │   │
│  │  │ (107x28)     │  │                                            │   │   │
│  │  │ 22px/700     │  │                                            │   │   │
│  │  └─────────────┘  └─────────────────────────────────────────────┘   │   │
│  │                       ┌─────────────────────────────────────────┐   │   │
│  │                       │ Error message (if any, 14px, #EF4444)   │   │   │
│  │                       └─────────────────────────────────────────┘   │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                     gap: 32px                               │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │  C: URL Field Row (672px wide, flex-row, gap: 16px)                  │   │
│  │  ┌──────────┐  ┌────────────────────────────────────────────────┐   │   │
│  │  │ C.1: Label│  │ C.2: Input (fill, h:56, p:16px 24px,         │   │   │
│  │  │ "URL"     │  │      bg:#FFF, border:1px #998C5F, r:8px)     │   │   │
│  │  │ (47x28)   │  │      + trailing icon (24x24)                 │   │   │
│  │  │ 22px/700  │  │                                              │   │   │
│  │  └──────────┘  └────────────────────────────────────────────────┘   │   │
│  │                    ┌────────────────────────────────────────────┐   │   │
│  │                    │ Error message (if any, 14px, #EF4444)      │   │   │
│  │                    └────────────────────────────────────────────┘   │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                     gap: 32px                               │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │  D: Button Group (672px wide, flex-row, gap: 24px)                   │   │
│  │  ┌──────────────────┐  ┌────────────────────────────────────────┐   │   │
│  │  │ D.1: Cancel       │  │ D.2: Save (flex-1, h:60, bg:#FFEA9E, │   │   │
│  │  │ (146x60, border   │  │      r:8px, p:16px, flex-center)     │   │   │
│  │  │ 1px #998C5F,      │  │      "Lưu" 22px/700 + Link icon     │   │   │
│  │  │ r:4px, p:16px 40) │  │                                      │   │   │
│  │  │ "Hủy" 16px/700   │  │                                      │   │   │
│  │  │ + Close icon      │  │                                      │   │   │
│  │  └──────────────────┘  └────────────────────────────────────────┘   │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## Component Style Details

### A: Title - "Thêm đường dẫn"

| Property | Value | CSS / Tailwind |
|----------|-------|----------------|
| **Node ID** | `I1002:12682;1002:12500` | - |
| width | 672px (fill) | `w-full` |
| height | 40px | `h-10` |
| font-family | Montserrat | `font-montserrat` |
| font-size | 32px | `text-[32px]` |
| font-weight | 700 | `font-bold` |
| line-height | 40px | `leading-10` |
| letter-spacing | 0px | `tracking-normal` |
| color | #00101A | `text-[#00101A]` |
| text-align | left | `text-left` |

---

### B: Content Field Row

| Property | Value | CSS / Tailwind |
|----------|-------|----------------|
| **Node ID** | `I1002:12682;1002:12501` | - |
| width | 672px (fill) | `w-full` |
| min-height | 56px | `min-h-14` (grows when error shown) |
| display | flex | `flex` |
| flex-direction | row | `flex-row` |
| align-items | center | `items-center` |
| gap | 16px | `gap-4` |
| flex-wrap | wrap | `flex-wrap` (for error message below) |

### B.1: Content Label - "Nội dung"

| Property | Value | CSS / Tailwind |
|----------|-------|----------------|
| **Node ID** | `I1002:12682;1002:12502` | - |
| width | 107px | `w-[107px] shrink-0` |
| height | 28px | `h-7` |
| font-family | Montserrat | `font-montserrat` |
| font-size | 22px | `text-[22px]` |
| font-weight | 700 | `font-bold` |
| line-height | 28px | `leading-7` |
| color | #00101A | `text-[#00101A]` |
| text-align | left | `text-left` |

### B.2: Content Input

| Property | Value | CSS / Tailwind |
|----------|-------|----------------|
| **Node ID** | `I1002:12682;1002:12503` | - |
| width | fill (flex: 1 0 0) | `flex-1` |
| height | 56px | `h-14` |
| padding | 16px 24px | `py-4 px-6` |
| background | #FFFFFF | `bg-white` |
| border | 1px solid #998C5F | `border border-[#998C5F]` |
| border-radius | 8px | `rounded-lg` |
| font-family | Montserrat | `font-montserrat` |
| font-size | 16px | `text-base` |
| font-weight | 400 | `font-normal` |
| line-height | 24px | `leading-6` |
| color | #00101A | `text-[#00101A]` |

**States:**

| State | Changes | Tailwind |
|-------|---------|----------|
| Default | border: 1px solid #998C5F | `border-[#998C5F] transition-all duration-150` |
| Placeholder | color: #9CA3AF | `placeholder:text-[#9CA3AF]` |
| Focus | ring: 2px solid #998C5F | `focus:ring-2 focus:ring-[#998C5F] focus:outline-none` |
| Error | border: 1px solid #EF4444 | `border-red-500` |
| Error + Focus | ring: 2px solid #EF4444 | `focus:ring-red-500` |

### Error Message (below Content Input)

| Property | Value | CSS / Tailwind |
|----------|-------|----------------|
| margin-top | 4px | `mt-1` |
| font-family | Montserrat | `font-montserrat` |
| font-size | 14px | `text-sm` |
| font-weight | 400 | `font-normal` |
| line-height | 20px | `leading-5` |
| color | #EF4444 | `text-red-500` |

---

### C: URL Field Row

| Property | Value | CSS / Tailwind |
|----------|-------|----------------|
| **Node ID** | `I1002:12682;1002:12652` | - |
| width | 672px (fill) | `w-full` |
| min-height | 56px | `min-h-14` (grows when error shown) |
| display | flex | `flex` |
| flex-direction | row | `flex-row` |
| align-items | center | `items-center` |
| gap | 16px | `gap-4` |
| flex-wrap | wrap | `flex-wrap` (for error message below) |

### C.1: URL Label - "URL"

| Property | Value | CSS / Tailwind |
|----------|-------|----------------|
| **Node ID** | `I1002:12682;1002:12653` | - |
| width | 47px | `w-[47px] shrink-0` |
| height | 28px | `h-7` |
| font-family | Montserrat | `font-montserrat` |
| font-size | 22px | `text-[22px]` |
| font-weight | 700 | `font-bold` |
| line-height | 28px | `leading-7` |
| color | #00101A | `text-[#00101A]` |
| text-align | left | `text-left` |

### C.2: URL Input (with trailing icon)

| Property | Value | CSS / Tailwind |
|----------|-------|----------------|
| **Node ID** | `I1002:12682;1002:12654` | - |
| width | fill (flex: 1 0 0) | `flex-1` |
| height | 56px | `h-14` |
| padding | 16px 24px | `py-4 px-6` |
| background | #FFFFFF | `bg-white` |
| border | 1px solid #998C5F | `border border-[#998C5F]` |
| border-radius | 8px | `rounded-lg` |
| display | flex | `flex` |
| align-items | center | `items-center` |
| justify-content | space-between | `justify-between` |
| font-family | Montserrat | `font-montserrat` |
| font-size | 16px | `text-base` |
| font-weight | 400 | `font-normal` |
| line-height | 24px | `leading-6` |
| color | #00101A | `text-[#00101A]` |

**Trailing Icon (inside input container):**

| Property | Value | Notes |
|----------|-------|-------|
| Node ID | `I1002:12682;1002:12654;186:2761` | IC instance |
| width | 24px | `w-6` |
| height | 24px | `h-6` |
| position | right side of input | Via `justify-between` on container |

**States:** Same as Content Input (B.2).

### Error Message (below URL Input)

Same styling as Content Input error message.

---

### D: Button Group

| Property | Value | CSS / Tailwind |
|----------|-------|----------------|
| **Node ID** | `I1002:12682;1002:12543` | - |
| width | 672px (fill) | `w-full` |
| height | 60px | `h-[60px]` |
| display | flex | `flex` |
| flex-direction | row | `flex-row` |
| gap | 24px | `gap-6` |
| align-items | flex-start | `items-start` |

### D.1: Cancel Button ("Hủy")

| Property | Value | CSS / Tailwind |
|----------|-------|----------------|
| **Node ID** | `I1002:12682;1002:12544` | - |
| width | auto (146px) | `w-auto` |
| height | 60px (stretch) | `self-stretch` |
| padding | 16px 40px | `py-4 px-10` |
| background | rgba(255, 234, 158, 0.10) | `bg-[rgba(255,234,158,0.10)]` |
| border | 1px solid #998C5F | `border border-[#998C5F]` |
| border-radius | 4px | `rounded` |
| display | flex | `flex` |
| align-items | center | `items-center` |
| gap | 8px | `gap-2` |
| cursor | pointer | `cursor-pointer` |

**Button Text:**

| Property | Value | CSS / Tailwind |
|----------|-------|----------------|
| content | "Hủy" | - |
| font-family | Montserrat | `font-montserrat` |
| font-size | 16px | `text-base` |
| font-weight | 700 | `font-bold` |
| line-height | 24px | `leading-6` |
| letter-spacing | 0.15px | `tracking-[0.15px]` |
| color | #00101A | `text-[#00101A]` |

**Close Icon:**

| Property | Value | Notes |
|----------|-------|-------|
| Node ID | `I1002:12682;1002:12544;186:2761` | MM_MEDIA_Close |
| size | 24x24px | `w-6 h-6` |
| Media | SVG from MoMorph media files | Download and use as Icon component |

**States:**

| State | Changes | Tailwind |
|-------|---------|----------|
| Default | As described above | `transition-colors duration-150` |
| Hover | background: rgba(255, 234, 158, 0.20) | `hover:bg-[rgba(255,234,158,0.20)]` |
| Active | background: rgba(255, 234, 158, 0.30) | `active:bg-[rgba(255,234,158,0.30)]` |
| Focus | outline: 2px solid #998C5F, offset: 2px | `focus:outline-2 focus:outline-[#998C5F] focus:outline-offset-2` |

---

### D.2: Save Button ("Lưu")

| Property | Value | CSS / Tailwind |
|----------|-------|----------------|
| **Node ID** | `I1002:12682;1002:12545` | - |
| width | fill remaining | `flex-1` |
| height | 60px | `h-[60px]` |
| padding | 16px | `p-4` |
| background | #FFEA9E | `bg-[#FFEA9E]` |
| border | none | - |
| border-radius | 8px | `rounded-lg` |
| display | flex | `flex` |
| align-items | center | `items-center` |
| justify-content | center | `justify-center` |
| gap | 8px | `gap-2` |
| cursor | pointer | `cursor-pointer` |

**Button Text:**

| Property | Value | CSS / Tailwind |
|----------|-------|----------------|
| content | "Lưu" | - |
| font-family | Montserrat | `font-montserrat` |
| font-size | 22px | `text-[22px]` |
| font-weight | 700 | `font-bold` |
| line-height | 28px | `leading-7` |
| color | #00101A | `text-[#00101A]` |

**Link Icon:**

| Property | Value | Notes |
|----------|-------|-------|
| Node ID | `I1002:12682;1002:12545;186:1766` | MM_MEDIA_Link |
| size | 24x24px | `w-6 h-6` |
| Media | SVG from MoMorph media files | Download and use as Icon component |

**States:**

| State | Changes | Tailwind |
|-------|---------|----------|
| Default | background: #FFEA9E | `bg-[#FFEA9E] transition-colors duration-150` |
| Hover | background: #FFE07A | `hover:bg-[#FFE07A]` |
| Active | background: #FFD54F | `active:bg-[#FFD54F]` |
| Disabled | background: #F5F5F5, color: #9CA3AF, cursor: not-allowed | `disabled:bg-[#F5F5F5] disabled:text-[#9CA3AF] disabled:cursor-not-allowed` |
| Focus | outline: 2px solid #998C5F, offset: 2px | `focus:outline-2 focus:outline-[#998C5F] focus:outline-offset-2` |

---

## Component Hierarchy with Styles

```
AddLinkBox (bg-[#FFF8E1] rounded-3xl p-10 flex flex-col gap-8 w-full max-w-[752px])
├── Title <h2> (text-[32px] font-bold font-montserrat text-[#00101A] leading-10)
│   └── "Thêm đường dẫn"
│
├── ContentField <div> (flex flex-row items-center gap-4 w-full flex-wrap)
│   ├── Label <label> (text-[22px] font-bold font-montserrat text-[#00101A] w-[107px] shrink-0)
│   │   └── "Nội dung"
│   ├── Input <input> (flex-1 h-14 py-4 px-6 bg-white border border-[#998C5F] rounded-lg
│   │                   font-montserrat text-base placeholder:text-[#9CA3AF]
│   │                   focus:ring-2 focus:ring-[#998C5F] focus:outline-none
│   │                   transition-all duration-150)
│   └── ErrorText <p> (w-full pl-0 sm:pl-[123px] mt-1 text-sm text-red-500 font-montserrat) [conditional]
│
├── URLField <div> (flex flex-row items-center gap-4 w-full flex-wrap)
│   ├── Label <label> (text-[22px] font-bold font-montserrat text-[#00101A] w-[47px] shrink-0)
│   │   └── "URL"
│   ├── InputContainer <div> (flex-1 h-14 py-4 px-6 bg-white border border-[#998C5F] rounded-lg
│   │                          flex items-center justify-between
│   │                          focus-within:ring-2 focus-within:ring-[#998C5F])
│   │   ├── Input <input> (flex-1 bg-transparent outline-none font-montserrat text-base
│   │   │                   placeholder:text-[#9CA3AF])
│   │   └── Icon <span> (w-6 h-6 shrink-0) -- trailing icon
│   └── ErrorText <p> (w-full pl-0 sm:pl-[63px] mt-1 text-sm text-red-500 font-montserrat) [conditional]
│
└── ButtonGroup <div> (flex flex-row gap-6 w-full)
    ├── CancelButton <button> (py-4 px-10 border border-[#998C5F] rounded
    │                          bg-[rgba(255,234,158,0.10)] flex items-center gap-2
    │                          hover:bg-[rgba(255,234,158,0.20)] cursor-pointer
    │                          transition-colors duration-150)
    │   ├── "Hủy" <span> (text-base font-bold font-montserrat tracking-[0.15px])
    │   └── CloseIcon (w-6 h-6)
    └── SaveButton <button> (flex-1 h-[60px] p-4 bg-[#FFEA9E] rounded-lg
                             flex items-center justify-center gap-2
                             hover:bg-[#FFE07A] cursor-pointer
                             disabled:bg-[#F5F5F5] disabled:text-[#9CA3AF] disabled:cursor-not-allowed
                             transition-colors duration-150)
        ├── "Lưu" <span> (text-[22px] font-bold font-montserrat)
        └── LinkIcon (w-6 h-6)
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
| Dialog | width: 100%, padding: 24px, border-radius: 16px | `w-full p-6 rounded-2xl` (base) |
| Title | font-size: 24px, line-height: 32px | `text-2xl leading-8` (base) |
| Field Labels | font-size: 18px | `text-lg` (base) |
| Field Rows | flex-direction: column, gap: 8px | `flex-col gap-2` (base) |
| Labels | width: auto (full width above input) | `w-auto` (base) |
| Inputs | width: 100% | `w-full` (base) |
| Button Group | flex-direction: column-reverse, gap: 12px | `flex-col-reverse gap-3` (base) |
| Cancel Button | width: 100%, justify-content: center | `w-full justify-center` (base) |
| Save Button | width: 100% | `w-full` (base) |
| Error Text | padding-left: 0 | `pl-0` (base) |

#### Tablet (640px - 1023px)

| Component | Changes | Tailwind |
|-----------|---------|----------|
| Dialog | width: 90%, max-width: 752px, padding: 32px | `sm:w-[90%] sm:max-w-[752px] sm:p-8` |
| Field Rows | flex-direction: row | `sm:flex-row` |
| Labels | fixed width | `sm:w-[107px]` / `sm:w-[47px]` |
| Button Group | flex-direction: row | `sm:flex-row` |
| Cancel Button | width: auto | `sm:w-auto` |
| Save Button | flex: 1 | `sm:flex-1` |

#### Desktop (>= 1024px)

| Component | Changes | Tailwind |
|-----------|---------|----------|
| Dialog | width: 752px, padding: 40px | `lg:w-[752px] lg:p-10` |
| Layout | As specified in Figma design | All desktop styles as documented above |

---

## Icon Specifications

| Icon Name | Node ID | Size | Color | Usage | Media Source |
|-----------|---------|------|-------|-------|-------------|
| MM_MEDIA_Close | `I1002:12682;1002:12544;186:2761` | 24x24 | #00101A | Cancel button trailing icon | MoMorph media |
| MM_MEDIA_Link | `I1002:12682;1002:12545;186:1766` | 24x24 | #00101A | Save button trailing icon | MoMorph media |
| IC (URL field) | `I1002:12682;1002:12654;186:2761` | 24x24 | #00101A | URL input trailing icon | MoMorph media |

---

## Animation & Transitions

| Element | Property | Duration | Easing | Trigger |
|---------|----------|----------|--------|---------|
| Dialog | opacity, transform (scale 0.95->1) | 200ms | ease-out | Open/Close |
| Backdrop | opacity (0->1) | 200ms | ease-out | Open/Close |
| Cancel Button | background-color | 150ms | ease-in-out | Hover |
| Save Button | background-color | 150ms | ease-in-out | Hover |
| Input | ring-color, border-color | 150ms | ease-in-out | Focus |
| Error Message | opacity, height | 150ms | ease-in-out | Show/Hide |

---

## Implementation Mapping

| Design Element | Figma Node ID | Tailwind Classes | React Component |
|----------------|---------------|------------------|-----------------|
| Dialog Container | `1002:12682` | `bg-[#FFF8E1] rounded-3xl p-10 flex flex-col gap-8 w-full max-w-[752px]` | `<AddLinkBox>` |
| Title | `I1002:12682;1002:12500` | `text-[32px] font-bold font-montserrat text-[#00101A] leading-10` | `<h2>` |
| Content Field | `I1002:12682;1002:12501` | `flex items-center gap-4 w-full flex-wrap` | `<div>` with `<label>` + `<input>` |
| Content Label | `I1002:12682;1002:12502` | `text-[22px] font-bold font-montserrat text-[#00101A] w-[107px] shrink-0` | `<label htmlFor="link-text">` |
| Content Input | `I1002:12682;1002:12503` | `flex-1 h-14 py-4 px-6 bg-white border border-[#998C5F] rounded-lg font-montserrat text-base` | `<input id="link-text">` |
| URL Field | `I1002:12682;1002:12652` | `flex items-center gap-4 w-full flex-wrap` | `<div>` with `<label>` + input container |
| URL Label | `I1002:12682;1002:12653` | `text-[22px] font-bold font-montserrat text-[#00101A] w-[47px] shrink-0` | `<label htmlFor="link-url">` |
| URL Input Container | `I1002:12682;1002:12654` | `flex-1 h-14 py-4 px-6 bg-white border border-[#998C5F] rounded-lg flex items-center justify-between` | `<div>` wrapping `<input>` + icon |
| URL Input | (inside container) | `flex-1 bg-transparent outline-none font-montserrat text-base` | `<input id="link-url">` |
| Button Group | `I1002:12682;1002:12543` | `flex gap-6 w-full` | `<div>` |
| Cancel Button | `I1002:12682;1002:12544` | `py-4 px-10 border border-[#998C5F] rounded bg-[rgba(255,234,158,0.10)] flex items-center gap-2 hover:bg-[rgba(255,234,158,0.20)]` | `<button type="button">` |
| Save Button | `I1002:12682;1002:12545` | `flex-1 h-[60px] p-4 bg-[#FFEA9E] rounded-lg flex items-center justify-center gap-2 hover:bg-[#FFE07A] disabled:bg-[#F5F5F5]` | `<button type="submit">` |
| Error Text | (predicted) | `mt-1 text-sm text-red-500 font-montserrat` | `<p role="alert">` |

---

## Notes

- All colors should use CSS variables or Tailwind arbitrary values for consistency.
- Font: Montserrat MUST be loaded via Google Fonts or local files and configured in Tailwind.
- All icons MUST be implemented as Icon Components (SVG inline), not img tags.
- Ensure color contrast meets WCAG AA (4.5:1 for normal text) - #00101A on #FFF8E1 passes AA.
- The dialog is an instance of Figma component `1002:12663` - maintain consistency with other instances.
- Error text uses `role="alert"` for screen reader accessibility and `aria-describedby` on the input.
- Use `focus:ring-*` instead of changing `border-width` on focus to avoid layout shift.
