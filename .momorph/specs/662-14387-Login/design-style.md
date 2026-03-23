# Design Style: Login Screen

**Frame**: `662:14387` — Login
**Figma File**: `9ypp4enmFmdK3YAFJLIu6C`
**Created**: 2026-03-10
**Reviewed**: 2026-03-10 (pass 8 — approved)

---

## Design Tokens

### Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-page-bg` | `#00101A` | Page background |
| `--color-header-bg` | `rgba(16, 20, 23, 0.8)` | Header background (translucent) — reuses existing token from globals.css |
| `--color-gold-primary` | `#FFEA9E` | Login button background |
| `--color-text-white` | `#FFFFFF` | ROOT FURTHER heading |
| `--color-text-cream` | `#E8DCC8` | Description text |
| `--color-btn-text` | `#00101A` | Login button text (dark) |
| `--color-footer-border` | `#2E3940` | Footer top border |
| `--color-footer-text` | `#FFFFFF` | Footer copyright text |
| `--color-lang-flag-bg` | `#DA251D` | Vietnam flag red |
| `--color-error-text` | `#FF6B6B` | Error message text color |
| `--color-btn-hover` | `#FFE07A` | Login button hover bg |
| `--color-btn-active` | `#FFD754` | Login button active/pressed bg |

**Token reuse map (existing vs new):**

| Token | Status | Notes |
|-------|--------|-------|
| `--color-page-bg` | Existing | Already in globals.css |
| `--color-header-bg` | Existing | Already in globals.css |
| `--color-gold-primary` | Existing | Already in globals.css |
| `--color-text-white` | Existing | Already in globals.css |
| `--color-btn-text` | Reuse `--color-page-bg` | Same value `#00101A` — use `text-page-bg` or `text-btn-about-bg` |
| `--color-footer-text` | Reuse `--color-text-white` | Same value `#FFFFFF` — use `text-white` |
| `--color-text-cream` | **NEW** | `#E8DCC8` — must be added to globals.css `@theme inline` |
| `--color-footer-border` | **NEW** | `#2E3940` — must be added to globals.css `@theme inline` |
| `--color-error-text` | **NEW** | `#FF6B6B` — must be added to globals.css `@theme inline` |
| `--color-btn-hover` | **NEW** | `#FFE07A` — add if needed, or use arbitrary value `bg-[#FFE07A]` |
| `--color-btn-active` | **NEW** | `#FFD754` — add if needed, or use arbitrary value |
| `--color-lang-flag-bg` | Inline only | `#DA251D` — used only in SVG flag, no CSS token needed |

### Typography

| Element | Font Family | Size (mobile / tablet / desktop) | Weight | Line-Height | Letter-Spacing | Color |
|---------|-------------|----------------------------------|--------|-------------|----------------|-------|
| ROOT FURTHER heading | SVN-Gotham | 48px / 80px / 120px | 400 (see note) | 1.0 | -0.02em | `#FFFFFF` |
| Description text | Montserrat | 16px / 18px / 20px | 500 (Medium) | 1.5 | 0.5px | `#E8DCC8` |
| Login button text | Montserrat | 16px (all) | 700 (Bold) | 1.5 | 0.5px | `#00101A` |
| Language selector "VN" | Montserrat | 14px (all) | 700 (Bold) | 1.4 | 0 | `#FFFFFF` |
| Footer copyright | Montserrat | 14px (all) | 400 (Regular) | 1.4 | 0 | `#FFFFFF` |
| SAA Logo text | Montserrat | 10px (all) | 700 (Bold) | 1.2 | 0 | `#FFFFFF` |
| Error message | Montserrat | 14px (all) | 500 (Medium) | 1.4 | 0 | `#FF6B6B` |

> **Font weight notes**:
> - **Language selector**: Figma shows 600 (SemiBold), but project only loads Montserrat 400/500/700. Use **700 (Bold)** as closest match.
> - **SVN-Gotham**: Registered as weight `400` in `layout.tsx` (single-weight local font). Use `font-normal` in Tailwind, NOT `font-bold`. The font file itself renders as bold. If `font-bold` is used, the browser won't match the registered font.

### Spacing

| Token | Value | Usage |
|-------|-------|-------|
| Header height | 80px | Fixed header bar |
| Header padding-x | 72px (desktop) / 16px (mobile) | Horizontal padding |
| Content padding-left | 144px (desktop) / 24px (mobile) | Left padding for content area |
| Content padding-top | 120px (desktop) / 60px (mobile) | Top padding inside hero area, positions content in upper third. Combined with header (80px), ROOT FURTHER starts at ~200px from viewport top on desktop. |
| Content gap | 24px | Between description and button |
| Heading-to-description gap | 40px | Between ROOT FURTHER and description text |
| Button padding | 16px 40px | Internal button padding |
| Button border-radius | 8px | Rounded corners |
| Footer height | 64px | Footer bar |
| Footer border-top | 1px solid `#2E3940` | Divider line |
| Footer padding-x | 72px (desktop) / 16px (mobile) | Horizontal padding |

### Borders & Radius

| Element | Border | Radius |
|---------|--------|--------|
| Login button | none | 8px |
| Language dropdown trigger | none | 4px |

### Shadows

| Element | Shadow |
|---------|--------|
| Login button (hover) | `0 4px 16px rgba(255, 234, 158, 0.3)` |

---

## Component Style Details

### A. Header

- **Height**: 80px
- **Background**: `rgba(16, 20, 23, 0.8)` with `backdrop-filter: blur(12px)` — reuses `--color-header-bg`
- **Position**: Normal flow (NOT fixed/sticky — page is single-viewport with no scroll)
- **Layout**: Flex row, justify-between, align-center
- **Padding**: 0 72px (desktop), 0 16px (mobile)
- **z-index**: 10 (above hero background image, since BG image covers full page)

#### A.1 Logo (SAA Logo)
- **Image**: `logo-saa.png` from `public/images/` (reuses existing asset)
- **Size**: 64x60px (matches existing shared Header component dimensions)
- **Link**: `/` (homepage)

#### A.2 Language Selector
- **Layout**: Flex row, align-center, gap 6px
- **Flag icon**: 20x14px, Vietnam flag (red bg with yellow star)
- **Text**: "VN", Montserrat 14px Bold (700), white
- **Chevron**: 12px down arrow, white
- **Cursor**: pointer
- **Links to**: Frame `721:4942` (Language dropdown component)

**States:**
| State | Property | Value |
|-------|----------|-------|
| Default | color | `#FFFFFF` |
| Hover | color | `#FFEA9E` (gold-primary) |
| Focus | outline | `2px solid #FFEA9E`, offset 2px |
| Open | chevron | Rotated 180deg |

### B. Hero Content Area

- **Position**: `flex-1` (fills remaining space between header and footer), `relative`
- **Layout**: Flex column, `justify-start` (content is in upper portion, NOT vertically centered)
- **Padding**: `120px 0 0 144px` (desktop), `60px 24px 0 24px` (mobile) — top padding positions content in upper third
- **z-index**: 10 (above background image)

#### B.1 Key Visual (Background Image)
- See **Section C** for full background image specs. The image and gradient overlay are on the page wrapper (not inside the hero area), but visually appear behind the hero content.

#### B.2 ROOT FURTHER Heading
- **Font**: SVN-Gotham, 120px, weight 400 (font file itself is bold — use `font-normal` in Tailwind)
- **Color**: `#FFFFFF`
- **Line-height**: 1.0
- **Letter-spacing**: -0.02em
- **Text**: Two lines — "ROOT" on line 1, "FURTHER" on line 2
- **Mobile**: 48px font-size

#### B.3 Description Text
- **Margin-top**: 40px from heading
- **Font**: Montserrat, 20px, Medium (500)
- **Color**: `#E8DCC8`
- **Line-height**: 1.5
- **Letter-spacing**: 0.5px
- **Text line 1**: "Bắt đầu hành trình của bạn cùng SAA 2025."
- **Text line 2**: "Đăng nhập để khám phá!"
- **Mobile**: 16px font-size

#### B.4 Login Button
- **Margin-top**: 24px from description
- **Width**: 305px (desktop), 100% max-w-[305px] (mobile)
- **Height**: 60px
- **Background**: `#FFEA9E`
- **Border-radius**: 8px
- **Padding**: 16px 40px
- **Layout**: Flex row, align-center, justify-center, gap 12px
- **Text**: "LOGIN With Google", Montserrat 16px Bold, `#00101A`
- **Google icon**: 24x24px, Google "G" logo (multicolor)
- **Cursor**: pointer

**States:**
| State | Property | Value |
|-------|----------|-------|
| Default | background | `#FFEA9E` |
| Hover | background | `#FFE07A` |
| Hover | box-shadow | `0 4px 16px rgba(255, 234, 158, 0.3)` |
| Active | background | `#FFD754` |
| Focus | outline | `2px solid #FFEA9E`, offset 2px |
| Disabled | background | `#9CA3AF` |
| Disabled | cursor | not-allowed |
| Loading | content | Spinner replaces Google icon |
| Loading | opacity | `0.7` |
| Loading | pointer-events | `none` |

### C. Key Visual Background

- **Image**: Reuses `hero-banner.png` from `public/images/` (same key visual as Homepage SAA)
- **Position**: `absolute inset-0` on the PAGE wrapper (covers entire viewport including behind header and footer)
- **Size**: `object-fit: cover`, `object-position: center`
- **z-index**: 0 (header, hero content, and footer all use z-10 to sit above)
- **Gradient overlay**: `absolute inset-0 z-[1]`, left-to-right dark gradient for text readability
  - `background: linear-gradient(to right, rgba(0,16,26,0.85) 0%, rgba(0,16,26,0.1) 60%, transparent 100%)`

### D. Footer

- **Height**: 64px
- **Background**: transparent (inherits page bg)
- **Border-top**: 1px solid `#2E3940`
- **Layout**: Flex row, align-center, justify-center
- **Padding**: 0 72px (desktop), 0 16px (mobile)
- **Text**: "Bản quyền thuộc về Sun* (C) 2025", Montserrat 14px Regular, white
- **Position**: Normal flow at bottom of `h-screen flex flex-col` page. Hero above is `flex-1`, so footer naturally sits at viewport bottom.

### E. Error Message (below login button)

- **Margin-top**: 12px from button
- **Font**: Montserrat, 14px, Medium (500)
- **Color**: `#FF6B6B`
- **Text-align**: left (desktop), center (mobile)
- **Max-width**: 305px (same as button)
- **Animation**: Fade-in on appear, auto-dismiss after 5s for domain-specific errors

### F. Google Icon (inside login button)

- **Type**: Inline SVG (multicolor Google "G" logo)
- **Size**: 24x24px
- **Position**: Right of button text, 12px gap
- **Colors**: Google brand colors (blue #4285F4, red #EA4335, yellow #FBBC05, green #34A853)
- **Note**: Must be inline SVG (not external image) since it's multicolor and small

### G. Loading Spinner (replaces Google icon during auth)

- **Type**: CSS spinner or inline SVG
- **Size**: 24x24px (same as Google icon position)
- **Color**: `#00101A` (matches button text)
- **Animation**: `spin 1s linear infinite`

---

## Layout Structure

### Desktop (>= 1024px)

```
┌──────────────────────────────────────────────────────────┐ 1440px
│ ┌─ Page: h-screen flex flex-col relative ──────────────┐ │
│ │                                                      │ │
│ │ ┌─ BG Image (absolute inset-0, covers full page) ──┐│ │
│ │ │ ┌─ Gradient Overlay (left-to-right) ────────────┐ ││ │
│ │ │ └──────────────────────────────────────────────┘ ││ │
│ │ └──────────────────────────────────────────────────┘│ │
│ │                                                      │ │
│ │ ┌─ Header: h-20, z-10, normal flow ────────────────┐│ │ 80px
│ │ │ Logo(64x60)                              🇻🇳 VN ▾ ││ │
│ │ └──────────────────────────────────────────────────┘│ │
│ │                                                      │ │
│ │ ┌─ Hero: flex-1, z-10, pt-[120px] pl-36 ──────────┐│ │
│ │ │                                                   ││ │
│ │ │  ROOT                   (SVN-Gotham 120px w400)   ││ │
│ │ │  FURTHER                                          ││ │
│ │ │                         (mt-10 = 40px)            ││ │
│ │ │  Bắt đầu hành trình... (Montserrat 20px Med)     ││ │
│ │ │  Đăng nhập để khám phá!                           ││ │
│ │ │                         (mt-6 = 24px)             ││ │
│ │ │  ┌────────────────────────────────┐               ││ │
│ │ │  │ LOGIN With Google  G  305x60px │               ││ │
│ │ │  └────────────────────────────────┘               ││ │
│ │ │  (error message area, mt-3, hidden by default)    ││ │
│ │ │                                                   ││ │
│ │ │         (remaining space — empty)                 ││ │
│ │ │                                                   ││ │
│ │ └──────────────────────────────────────────────────┘│ │
│ │                                                      │ │
│ │ ┌─ Footer: h-16, z-10, border-t ──────────────────┐│ │ 64px
│ │ │         Bản quyền thuộc về Sun* © 2025            ││ │
│ │ └──────────────────────────────────────────────────┘│ │
│ └──────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────┘
```

### Mobile (< 640px)

```
┌────────────────────────┐ 375px
│ ┌─ h-screen flex-col ┐ │
│ │                     │ │
│ │ ┌─ BG (absolute) ─┐│ │
│ │ └──────────────────┘│ │
│ │                     │ │
│ │ ┌─ Header: h-20 ──┐│ │ 80px
│ │ │ Logo       VN ▾  ││ │
│ │ └──────────────────┘│ │
│ │                     │ │
│ │ ┌─ Hero: flex-1 ──┐│ │
│ │ │ pt-[60px] px-6   ││ │
│ │ │                  ││ │
│ │ │ ROOT             ││ │
│ │ │ FURTHER (48px)   ││ │
│ │ │                  ││ │
│ │ │ Bắt đầu...(16px)││ │
│ │ │                  ││ │
│ │ │ ┌──────────────┐ ││ │
│ │ │ │LOGIN Google G│ ││ │
│ │ │ └──────────────┘ ││ │
│ │ │ (error msg area) ││ │
│ │ │                  ││ │
│ │ └──────────────────┘│ │
│ │                     │ │
│ │ ┌─ Footer: h-16 ──┐│ │ 64px
│ │ │ Bản quyền...     ││ │
│ │ └──────────────────┘│ │
│ └─────────────────────┘ │
└────────────────────────┘
```

---

## Implementation Mapping

| Figma Element | Tailwind / CSS | React Component |
|---------------|----------------|-----------------|
| Page wrapper | `h-screen flex flex-col bg-page-bg relative` | `LoginPage` (Server Component) |
| Header | `relative z-10 w-full h-20 bg-header-bg backdrop-blur-md flex items-center justify-between px-4 sm:px-12 lg:px-[72px]` | `LoginHeader` (Server Component) |
| Logo | `w-16 h-[60px]` | `next/image` with `logo-saa.png` (64x60px) |
| Language selector | `flex items-center gap-1.5 text-sm font-bold text-white cursor-pointer hover:text-gold-primary transition-colors` | `LanguageSelector` (Client Component) |
| Hero area | `relative z-10 flex-1 flex flex-col justify-start pt-[60px] lg:pt-[120px] px-6 sm:px-12 lg:px-0 lg:pl-36` | `LoginHero` (Server Component wrapper) |
| Background image | `absolute inset-0 z-0 object-cover` (on page wrapper) | `next/image` with priority, fill |
| Gradient overlay | `absolute inset-0 z-[1]` + `style={{ background: 'linear-gradient(to right, rgba(0,16,26,0.85) 0%, rgba(0,16,26,0.1) 60%, transparent 100%)' }}` | `<div>` overlay (sibling of Image, inside page wrapper). **Do NOT use Tailwind `via`** — it defaults to 50% midpoint, but design requires 60%. |
| ROOT FURTHER | `font-[family-name:var(--font-gotham)] text-[48px] sm:text-[80px] lg:text-[120px] font-normal leading-none tracking-[-0.02em] text-white` | `<h1>` |
| Description | `font-[family-name:var(--font-montserrat)] text-base sm:text-lg lg:text-xl font-medium text-[#E8DCC8] tracking-[0.5px] leading-normal` | `<p>` |
| Login button | `w-full max-w-[305px] h-[60px] bg-gold-primary rounded-lg flex items-center justify-center gap-3 font-bold text-base text-page-bg tracking-[0.5px] hover:bg-[#FFE07A] hover:shadow-[0_4px_16px_rgba(255,234,158,0.3)] transition-all cursor-pointer` | `LoginButton` (Client Component) |
| Google icon | `w-6 h-6` | Inline SVG (multicolor, see section F) |
| Footer | `relative z-10 h-16 border-t border-[#2E3940] flex items-center justify-center px-4 lg:px-[72px]` | `LoginFooter` (Server Component) |
| Footer text | `font-[family-name:var(--font-montserrat)] text-sm text-white` | `<p>` |
| Error message | `text-sm font-medium text-[#FF6B6B] mt-3 max-w-[305px]` | `<p role="alert">` |
| Loading spinner | `w-6 h-6 animate-spin text-[#00101A]` | Inline SVG |

---

## Responsive Breakpoints

| Breakpoint | Changes |
|------------|---------|
| Mobile (< 640px) | Heading: 48px, Description: 16px, Content px-6, Button max-w-full, Header px-4 |
| Tablet (640px - 1023px) | Heading: 80px, Description: 18px, Content px-12, Button centered |
| Desktop (>= 1024px) | Heading: 120px, Description: 20px, Content pl-36 (144px), Full layout as designed |

---

## Accessibility

- Login button: Uses `<button>` element (native button, no need for `role="button"`), `aria-label="Đăng nhập bằng Google"`, focus-visible outline
- Error message: `role="alert"`, `aria-live="assertive"` for screen reader announcement
- Language selector: `aria-haspopup="listbox"`, `aria-expanded`, `aria-label="Chọn ngôn ngữ"`
- Background image: Decorative, `aria-hidden="true"`, `alt=""`
- Heading: Semantic `<h1>` for ROOT FURTHER
- Footer: `<footer>` semantic element
- Color contrast: Gold `#FFEA9E` on `#00101A` button text meets WCAG AAA (>7:1)
