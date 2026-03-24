# Implementation Plan: Hệ thống giải thưởng SAA 2025

**Frame**: `313:8436-he-thong-giai`
**Date**: 2026-03-12
**Spec**: `specs/313-8436-he-thong-giai/spec.md`
**Reviewed**: 2026-03-12 (8th review pass — fully verified, implementation-ready)

---

## Summary

Build the Awards System page (`/awards`) — a content display page showcasing 6 SAA 2025 award categories with hero banner, sidebar navigation with scroll spy, alternating-layout award cards, and a Sun* Kudos promotional section. Primarily a Server Component page with a single client-side sidebar for scroll spy/smooth scrolling.

---

## Technical Context

**Language/Framework**: TypeScript / Next.js 15 (App Router)
**Primary Dependencies**: React 19, TailwindCSS 4, Supabase SSR, next/image, next/link
**Database**: PostgreSQL (Supabase) — `award_categories` table (needs migration for new columns)
**Testing**: Vitest + Testing Library (unit/integration), Playwright (E2E future)
**State Management**: Local state only (activeCategory in sidebar client component)
**API Style**: Direct Supabase query in Server Component (no REST endpoint needed)
**Backend API Test Cases**: N/A — `.momorph/contexts/BACKEND_API_TESTCASES.md` does not exist; no REST endpoints needed for this feature

---

## Constitution Compliance Check

*GATE: Must pass before implementation can begin*

- [x] TypeScript strict mode
- [x] Server Components by default, `"use client"` only for sidebar scroll spy
- [x] `next/image` for all images, `next/link` for navigation
- [x] TailwindCSS utility classes exclusively (design tokens in `globals.css` theme)
- [x] `@/*` path aliases for imports
- [x] PascalCase components, camelCase hooks/utils, kebab-case routes
- [x] App Router conventions: `loading.tsx`, `error.tsx` for route states
- [x] Supabase with RLS for data access
- [x] No Node.js native modules (Cloudflare Workers compatible)
- [x] Mobile-first responsive design (3 breakpoints: <640px, 640-1023px, ≥1024px)
- [x] WCAG AA contrast compliance
- [x] Yarn 1.22.22 package manager
- [x] TDD: Red-Green-Refactor cycle — tests written BEFORE implementation within each phase
- [x] One component per file
- [x] No dead code
- [x] Mock external services at boundary (Supabase), never mock internal modules

**Violations**: None

---

## Architecture Decisions

### Frontend Approach

- **Component Structure**: Feature-based under `src/components/awards/`
- **Rendering**: Server Component page fetches award data from Supabase at request time. Only `AwardSidebar` is a client component (for IntersectionObserver scroll spy + smooth scroll click handlers)
- **Styling Strategy**: Tailwind utilities with custom theme tokens. Reuse existing tokens from `globals.css` where possible (see Token Reuse Mapping below); only add truly new tokens
- **Data Fetching**: Direct Supabase query in the page Server Component — no API route needed (existing `/api/awards` route remains for other consumers like homepage)

### Backend Approach

- **Database Migration**: Add missing columns to `award_categories` table: `description`, `quantity`, `unit_type`, `prize_value`, `prize_sub_label`, `prize_value_team`, `prize_sub_label_team`. The existing `short_description` column remains for homepage use; `description` is the full award paragraph for the awards page. The existing `thumbnail_url` column serves as the image URL (spec's `image_url` maps to this).
- **Seed Update**: Expand seed data with full award descriptions, quantities, prize values per spec's Award Data Reference table (spec lines 215-222)
- **No new API endpoints**: Server Component queries Supabase directly. Existing `/api/awards` route untouched
- **Column name mapping**: DB uses `short_description`, `thumbnail_url`, `order`; spec uses `description`, `image_url`, `display_order`. The type schema handles this mapping with camelCase aliases.

### Integration Points

- **Existing Services**: Supabase via `@/libs/supabase/server.ts`
- **Shared Components**: `<Header />` (pass `activeLink="awards"`), `<Footer />` — both already exist
- **Reuse Decision: `SunKudosPromo`**: The existing `src/components/shared/SunKudosPromo.tsx` is used by the homepage. The awards page design differs significantly (24px gold label, 57px title, single-text-node description, warm beige CTA button, Kudos logo artwork). **Create a new `AwardsSunKudosSection` component** under `src/components/awards/` rather than modifying the shared component (avoids breaking homepage)
- **Button Variant**: Spec calls for a warm beige CTA (#DBD1C1 bg, #00101A text). Add a new `"warm"` variant to `src/components/ui/Button.tsx`. Note: `--color-kudos-text: #DBD1C1` already exists in globals.css — reuse as `bg-kudos-text` rather than adding a duplicate token.
- **Icons**: Need 3 new icons: `award-prefix` (circular target), `quantity` (pin/diamond), `prize` (badge/license). Add to `src/components/ui/Icon.tsx`. Extract SVG paths from Figma using `mcp__momorph__get_design_item_image` for node IDs in the award card area during Phase 0.

### Token Reuse Mapping (existing globals.css → design-style.md)

| Design Token | Existing CSS Variable | Tailwind Class |
|---|---|---|
| `--color-page-bg` (#00101A) | `--color-page-bg` ✅ | `bg-page-bg` |
| `--color-gold-primary` (#FFEA9E) | `--color-gold-primary` ✅ | `text-gold-primary` |
| `--color-divider` (#2E3940) | `--color-divider` ✅ | `bg-divider`, `border-divider` |
| `--color-cta-bg` (#DBD1C1) | `--color-kudos-text` ✅ (same value) | `bg-kudos-text` |
| `--color-gold-hover` (rgba 10%) | `--color-gold-10` ✅ | `bg-gold-10` |
| `--spacing-award-gap` (80px) | `--spacing-awards-gap` ✅ | `gap-awards-gap` |
| `--spacing-section-gap` (120px) | `--spacing-section-gap` ✅ | `gap-section-gap` |
| `--color-header-bg` | `--color-header-bg` ✅ | `bg-header-bg` |
| `--text-shadow-gold` (sidebar active) | `--shadow-nav-active` ✅ (same value) | `[text-shadow:var(--shadow-nav-active)]` |
| `--radius-card` (24px) | `--radius-kudos-card` ✅ (same value) | `rounded-kudos-card` |
| `--radius-card-image` (16px) | `--radius-carousel-card` ✅ (same value) | `rounded-carousel-card` |
| `--max-w-content` (1152px) | `--max-w-content-narrow` ✅ (same value) | `max-w-content-narrow` |

### Key Technical Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Scroll spy implementation | IntersectionObserver | Native browser API, no dependency, performant. `threshold: 0.3` to detect when 30% of card is visible |
| Sidebar sticky behavior | `position: sticky; top: 96px` | Header is 80px sticky + 16px buffer. CSS-only, no JS needed |
| Alternating card layout | `flex-direction: row` / `row-reverse` via index parity | CSS-only alternation, `index % 2 === 0 ? "row" : "row-reverse"` (0-indexed even = image-left) |
| Section title hero overlap | Negative margin-top on main content area + `relative z-10` | Pulls section title upward to visually overlap hero gradient. `relative z-10` on `<main>` is **required** to ensure content renders above the hero's absolute gradient overlay — without it, the section title and first card title are hidden behind the hero |
| `scroll-padding-top` | Set on `html` via `globals.css` | Prevents header from obscuring anchor targets on sidebar click. Harmless globally — benefits any future anchor navigation |
| Award data source | Supabase Server Component fetch | Constitution mandates Server Component data fetching; data is semi-static so request-time fetch is fine |
| Prize value formatting | `Intl.NumberFormat('vi-VN')` utility | Formats integer DB values (e.g., `7000000`) to "7.000.000 VNĐ" display format. Cloudflare Workers runtime supports Intl API. |
| Image fallback | CSS layering (no JS) | Fallback div rendered BEHIND `next/image` via z-index. On image load failure, transparent img reveals fallback. No `onError` needed — AwardCard stays a Server Component. |
| `name_en` field | Deferred — not in migration | Multi-language is explicitly out of scope (spec line 285). Will add column when i18n is implemented. |

---

## Project Structure

### Documentation (this feature)

```text
.momorph/specs/313-8436-he-thong-giai/
├── spec.md              # Feature specification ✅
├── design-style.md      # Design specifications ✅
├── plan.md              # This file ✅
├── tasks.md             # Task breakdown (next step)
└── assets/              # Screenshots ✅
```

### Source Code (affected areas)

```text
# New Files
src/
├── app/awards/
│   ├── page.tsx              # REWRITE — Server Component: Supabase fetch + full page composition
│   ├── loading.tsx           # NEW — Skeleton: hero placeholder + 3 card skeletons (dark theme)
│   └── error.tsx             # NEW — "use client", error message + retry button (dark theme)
├── components/awards/
│   ├── AwardsHeroSection.tsx    # NEW — Hero banner: next/image fill, gradient overlay, "ROOT FURTHER" decorative
│   ├── SectionTitle.tsx         # NEW — Subtitle (24px) + divider (1px) + h1 title (57px gold)
│   ├── AwardSidebar.tsx         # NEW — "use client": IntersectionObserver scroll spy, sticky, keyboard nav
│   ├── AwardCard.tsx            # NEW — Alternating flex row/row-reverse, image + content, anchor target
│   ├── AwardCardStats.tsx       # NEW — Quantity inline row + prize multi-line section + "Hoặc" for Signature
│   ├── HoacDivider.tsx          # NEW — Inline-labeled divider: line + "Hoặc" text + line
│   └── AwardsSunKudosSection.tsx # NEW — Two-column: left (label+title+desc+CTA) + right (logo+deco text)
├── utils/
│   └── formatPrizeValue.ts   # NEW — Format integer to "X.XXX.XXX VNĐ" using Intl.NumberFormat
└── types/
    └── award.ts              # MODIFY — Add: description, quantity, unitType, prizeValue, prizeSubLabel, prizeValueTeam, prizeSubLabelTeam

# Modified Files
src/app/globals.css           # MODIFY — Add: --color-section-bg (#0F0F0F), --shadow-gold-glow, --spacing-award-card-gap (48px); add html { scroll-padding-top: 96px }
src/components/ui/Button.tsx  # MODIFY — Add "warm" variant: bg-kudos-text text-text-dark, hover opacity 0.9, rounded, padding 16px
src/components/ui/Icon.tsx    # MODIFY — Add 3 icons to IconName type + icons record: "award-prefix", "quantity", "prize" (all 24x24 viewBox paths, rendered at size={16} by callers)

# Database
supabase/migrations/00004_add_award_details.sql   # NEW — ALTER TABLE add 7 columns with defaults
supabase/seeds/common/001_seed_saa2025.sql        # MODIFY — Add description, quantity, unit_type, prize_value, prize_sub_label, prize_value_team, prize_sub_label_team to all 6 awards

# Tests (co-located per constitution)
src/app/awards/__tests__/page.test.tsx                        # NEW — Page integration: renders 6 cards, correct data, alternating layout
src/components/awards/__tests__/AwardCard.test.tsx             # NEW — Card: image, title, description, stats, alternating direction
src/components/awards/__tests__/AwardSidebar.test.tsx          # NEW — Sidebar: renders 6 items, click handler, active state, keyboard nav
src/components/awards/__tests__/AwardsSunKudosSection.test.tsx # NEW — Kudos section: content rendering, CTA links to /kudos
src/utils/__tests__/formatPrizeValue.test.ts                   # NEW — Formatting: 7000000 → "7.000.000 VNĐ", 0 → "0 VNĐ", null handling
```

### Dependencies

No new packages needed. All required dependencies are already installed:
- `next`, `react`, `@supabase/ssr`, `@supabase/supabase-js` (core)
- `tailwindcss` (styling)
- `vitest`, `@testing-library/react`, `msw` (testing)

---

## Implementation Strategy

> **TDD Note**: Per constitution, each phase follows Red-Green-Refactor. Write failing tests FIRST, then implement minimum code to pass, then refactor. Tests and implementation are interleaved within each phase, not separated into a later phase.

### Phase 0: Asset & Infrastructure Preparation

**0.1 Database Migration**
- Create `supabase/migrations/00004_add_award_details.sql`:
  ```sql
  ALTER TABLE award_categories
    ADD COLUMN IF NOT EXISTS description TEXT NOT NULL DEFAULT '',
    ADD COLUMN IF NOT EXISTS quantity INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN IF NOT EXISTS unit_type TEXT NOT NULL DEFAULT '',
    ADD COLUMN IF NOT EXISTS prize_value INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN IF NOT EXISTS prize_sub_label TEXT NOT NULL DEFAULT '',
    ADD COLUMN IF NOT EXISTS prize_value_team INTEGER,
    ADD COLUMN IF NOT EXISTS prize_sub_label_team TEXT;
  ```
- Note: `short_description` (existing) = brief text for homepage cards. `description` (new) = full paragraph for awards detail page. Both coexist.
- Note: `thumbnail_url` (existing) = image URL for award badges. No rename needed — awards page uses this column.
- Note: `order` (existing) = display order (1-6). No rename to `display_order` — keep DB column name, map in type schema.

**0.2 Seed Data Update**
- Update `supabase/seeds/common/001_seed_saa2025.sql` with full data per spec Award Data Reference (spec lines 215-222):
  - Top Talent: quantity=10, unit_type="Cá nhân", prize_value=7000000, prize_sub_label="cho mỗi giải thưởng"
  - Top Project: quantity=2, unit_type="Tập thể", prize_value=15000000, prize_sub_label="cho mỗi giải thưởng"
  - Top Project Leader: quantity=3, unit_type="Cá nhân", prize_value=7000000, prize_sub_label="cho mỗi giải thưởng"
  - Best Manager: quantity=1, unit_type="Cá nhân", prize_value=10000000, prize_sub_label="cho mỗi giải thưởng"
  - Signature 2025: quantity=1, unit_type="Cá nhân hoặc tập thể", prize_value=5000000, prize_sub_label="cho giải cá nhân", prize_value_team=8000000, prize_sub_label_team="cho giải tập thể"
  - MVP: quantity=1, unit_type="Cá nhân", prize_value=15000000, prize_sub_label=""
- **Description texts**: Full award description paragraphs are NOT in the spec — they exist only in the Figma frame. During implementation, extract text content from Figma design items using `mcp__momorph__list_design_items` (fileKey: `9ypp4enmFmdK3YAFJLIu6C`, frameId: `313:8436`) and copy the description paragraph text for each of the 6 award cards into the seed SQL.
- Run `supabase db reset` to apply

**0.3 Type Expansion**
- Update `src/types/award.ts` to match new database schema (note: existing file uses `import { z } from "zod/v4"` — preserve this import):
  ```typescript
  export const awardCategorySchema = z.object({
    id: z.string(),
    name: z.string(),
    slug: z.string(),
    shortDescription: z.string(),
    description: z.string(),
    thumbnailUrl: z.string(),
    order: z.number(),
    quantity: z.number(),
    unitType: z.string(),
    prizeValue: z.number(),
    prizeSubLabel: z.string(),
    prizeValueTeam: z.number().nullable(),
    prizeSubLabelTeam: z.string().nullable(),
  });
  ```
- DB column `thumbnail_url` → type field `thumbnailUrl` (existing mapping)
- DB column `order` → type field `order` (keeps existing name; spec's `display_order` is a spec-only alias)

**0.4 Prize Value Formatting Utility**
- Create `src/utils/formatPrizeValue.ts`:
  ```typescript
  export function formatPrizeValue(value: number): string {
    return `${new Intl.NumberFormat('vi-VN').format(value)} VNĐ`;
  }
  ```
- Test first: `src/utils/__tests__/formatPrizeValue.test.ts`
  - `formatPrizeValue(7000000)` → `"7.000.000 VNĐ"`
  - `formatPrizeValue(15000000)` → `"15.000.000 VNĐ"`
  - `formatPrizeValue(0)` → `"0 VNĐ"`

**0.5 Tailwind Theme Tokens**
- Add ONLY truly new tokens to `globals.css` `@theme inline` block (reuse existing where possible — see Token Reuse Mapping):
  ```css
  /* Awards page tokens (new) */
  --color-section-bg: #0F0F0F;  /* matches design-style.md --color-section-bg */
  --shadow-gold-glow: 0 4px 4px 0 rgba(0,0,0,0.25), 0 0 6px 0 #FAE287;
  --spacing-award-card-gap: 48px;
  ```
- Add to `globals.css` body/html section:
  ```css
  html {
    scroll-padding-top: 96px; /* header 80px + 16px buffer for anchor nav */
  }
  ```
- Note: `--color-cta-warm` NOT needed — reuse `--color-kudos-text: #DBD1C1` (same value, already exists)
- Note: `--radius-award-image` NOT needed — reuse `--radius-carousel-card: 16px` (same value)
- Note: `--radius-award-card` NOT needed — reuse `--radius-kudos-card: 24px` (same value)

**0.6 Icon Assets**
- Add 3 icons to `src/components/ui/Icon.tsx`: `award-prefix`, `quantity`, `prize`
- **Extraction method**: Use `mcp__momorph__get_design_item_image` with the icon node IDs from the Figma frame to visually identify the icon shapes, then create matching SVG paths.
- **IMPORTANT — viewBox**: All existing icons in `Icon.tsx` use `0 0 24 24` viewBox by default. New icon SVG `<path>` data MUST be drawn for 24×24 viewBox (matching existing icons). Callers render at 16px via `<Icon name="award-prefix" size={16} />`. Do NOT add custom viewBox mappings — keep the default 24×24.
- **Icon descriptions for SVG creation**:
  - `award-prefix`: Small circular target/crosshair icon (used in sidebar tabs + card title rows)
  - `quantity`: Pin/diamond shape icon (used in "Số lượng giải thưởng:" stat row)
  - `prize`: Badge/license shape icon (used in "Giá trị giải thưởng:" stat row)
- If exact paths cannot be extracted from Figma, use simple geometric approximations from a standard icon library (e.g., Lucide icons: `target` for award-prefix, `map-pin` for quantity, `award` for prize) — ensuring 24×24 viewBox paths and `currentColor` fill.

**0.7 Button Variant**
- Add `"warm"` variant to `src/components/ui/Button.tsx`:
  ```typescript
  warm: [
    "inline-flex items-center gap-2 px-4 py-4",
    "font-[family-name:var(--font-montserrat)] text-base font-bold leading-6",
    "bg-kudos-text text-text-dark",  // #DBD1C1 bg, #00101A text
    "hover:opacity-90",
    "active:scale-[0.98]",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-primary",
    "transition-all duration-150 ease-in-out rounded",
  ].join(" "),
  ```
- Update `ButtonVariant` type to include `"warm"`

### Phase 1: Core Page Structure (US1 — P1)

> TDD: Write page integration tests first (page.test.tsx), then implement components.

**1.1 Awards Hero Section** (`AwardsHeroSection.tsx`)
- Full-width hero (h-[547px] on desktop, h-auto on mobile) with background image
- Background: `next/image` with `fill` + `object-cover` + `priority` (same pattern as homepage `HeroBanner`)
- Gradient overlay: `absolute inset-0 bg-gradient-to-t from-page-bg to-transparent`
- "ROOT FURTHER" decorative image: `next/image` with `src="/images/root-further-hero.png"`, positioned top-left with `pt-[88px] lg:pt-[100px]`, `aria-hidden="true"`. Uses the same image asset as the homepage HeroBanner. Responsive: `w-[200px] sm:w-[280px] lg:w-[451px]`

**1.2 Section Title** (`SectionTitle.tsx`)
- Three stacked elements:
  1. `<p>` subtitle "Sun* Annual Awards 2025" — 24px white center (`text-2xl font-bold text-white text-center w-full`)
  2. `<hr>` divider — 1px #2E3940 (`w-full h-px bg-divider border-0`)
  3. `<h1>` title "Hệ thống giải thưởng SAA 2025" — 57px gold left (`text-[57px] leading-[64px] tracking-[-0.25px] font-bold text-gold-primary`)
- Negative margin-top on `<main>` container to overlap hero background visually
- Responsive: mobile title 28-32px + subtitle 16px; tablet title 40-48px

**1.3 Award Card** (`AwardCard.tsx`)
- Props: `award: AwardCategory`, `index: number` (for alternating layout), `id: string` (anchor target)
- Layout: `flex gap-award-card-gap` (48px) with `flex-direction: row` (even index) or `row-reverse` (odd index)
  - 0-indexed: index 0 → row (image-left), index 1 → row-reverse (image-right), etc.
- Left side: image (336×336, rounded-carousel-card, border gold, shadow-gold-glow, `next/image`, `flex-shrink-0`)
- Right side: content column (`flex-1 flex-col gap-4 justify-center`)
  - Title row: `flex items-center gap-2` — icon (award-prefix 16×16 gold) + `<h2 tabindex="-1">` text (24px gold bold). `tabindex="-1"` enables programmatic focus from sidebar click without adding to Tab order.
  - Description: `<p>` 16px white bold, text-justify, tracking-[0.5px]
  - Divider: `<hr>` 1px #2E3940
  - `<AwardCardStats>` sub-component
- Image fallback (CSS-only, no JS): wrap in `relative` container div. Render fallback div (336×336 `bg-divider rounded-carousel-card`, centered award name text) at `absolute inset-0`. Render `next/image` at `relative z-10`. On image load, img covers fallback. On failure, transparent img reveals fallback behind. No `onError` needed — keeps AwardCard as Server Component.
- Responsive: mobile `flex-col`, image `w-full max-w-[280px] mx-auto`, alternating disabled

**1.4 Award Card Stats** (`AwardCardStats.tsx`)
- Props: `award: AwardCategory`
- **Quantity row (SINGLE INLINE)**: `flex items-baseline gap-1`
  - Icon `quantity` (16×16 gold) + "Số lượng giải thưởng:" (14px gold) + number (36px gold, formatted with leading zeros for single digits e.g. "01") + unit text (14px white)
- **Divider**: 1px #2E3940
- **Prize section (MULTI-LINE)**: `flex flex-col`
  - Label row: Icon `prize` (16×16 gold) + "Giá trị giải thưởng:" (14px gold) — `flex items-center gap-1`
  - Value: `formatPrizeValue(award.prizeValue)` (36px gold)
  - Sub-label: `award.prizeSubLabel` (14px white) — only if non-empty
- **Signature 2025 special case** (`award.prizeValueTeam !== null`):
  - After first prize section → `<HoacDivider />` → second prize section (same structure with `prizeValueTeam` and `prizeSubLabelTeam`)

**1.5 "Hoặc" Divider** (`HoacDivider.tsx`)
- `flex items-center gap-2`: left line (`flex-1 h-px bg-divider`) + "Hoặc" text (14px bold #2E3940 `text-divider`) + right line

**1.6 Awards Page** (`page.tsx`)
- Server Component: fetch `award_categories` from Supabase via `createClient()` ordered by `order` ASC
- Select: `id, name, slug, short_description, description, thumbnail_url, order, quantity, unit_type, prize_value, prize_sub_label, prize_value_team, prize_sub_label_team`
- Map DB snake_case to camelCase in the query result handler (same pattern as existing `/api/awards/route.ts`)
- **Empty state**: If query returns 0 rows, render a centered message within `<main>`: "Chưa có thông tin giải thưởng." (16px white) — consistent with dark theme. Do NOT render sidebar, award cards, or Kudos section when no data. Hero + Section Title still render.
- Render hierarchy:
  ```
  <div bg-page-bg min-h-screen>
    <Header activeLink="awards" />
    <AwardsHeroSection />  {/* full-width hero — NOT constrained by max-width */}
    <main relative z-10 px-4 sm:px-10 lg:px-36 pt-8 lg:pt-0 pb-16 lg:pb-page-padding-y -mt-32 lg:-mt-[180px] flex flex-col>
      {/* NOTE: No max-w-[1440px] mx-auto — content uses same px-36 (144px) as Header so edges align on all screen sizes */}
      <SectionTitle />
      <section mt-6 lg:mt-10 flex flex-col lg:flex-row gap-awards-gap>
        <AwardSidebar categories={categories} />
        <div flex flex-col gap-section-gap>
          {categories.map((award, i) => <AwardCard key={award.id} award={award} index={i} id={`award-${award.slug}`} />)}
        </div>
      </section>
      <div mt-section-gap>
        <AwardsSunKudosSection />
      </div>
    </main>
    <Footer />
  </div>
  ```
  Note: Main uses individual margins instead of uniform `gap-section-gap` — the section title needs a tighter gap (~40px) to the award system, while the Kudos section uses the full 120px `mt-section-gap`.

### Phase 2: Sidebar Navigation (US2 — P2)

> TDD: Write AwardSidebar tests first (click handler, active state, keyboard nav), then implement.

**2.1 Award Sidebar** (`AwardSidebar.tsx`) — `"use client"`
- Props: `categories: {id: string, name: string, slug: string}[]`
- State: `activeCategory` (string, defaults to first category slug)
- Ref: `isScrollingRef` (boolean ref, prevents scroll spy from overriding during programmatic scroll)
- Sticky positioning: `sticky top-24 self-start min-w-[180px] shrink-0`
- Each tab: `<a href="#award-{slug}">` with prefix icon (`award-prefix`, 16×16)
  - Tab styles: `flex items-center gap-2 py-4 px-4 text-sm font-bold tracking-[0.25px]`
  - Default: `text-white`, Hover: `bg-gold-10`, Active: `text-gold-primary border-b border-gold-primary [text-shadow:var(--shadow-nav-active)]`
  - Focus: `outline-2 outline-gold-primary outline-offset-[-2px]`
- Click handler: `e.preventDefault()` → set `isScrollingRef = true` → `document.getElementById(`award-${slug}`)?.scrollIntoView({ behavior: 'smooth' })` → set `activeCategory` → `setTimeout(() => isScrollingRef = false, 500)` (debounce) → move focus: `document.getElementById(`award-${slug}`)?.querySelector('h2')?.focus({ preventScroll: true })`
- Scroll spy: `useEffect` with IntersectionObserver on all `#award-{slug}` elements
  - Options: `{ rootMargin: "-96px 0px 0px 0px", threshold: 0.3 }`
  - On intersection: if `!isScrollingRef.current`, update `activeCategory`
  - **Cleanup**: `useEffect` returns `() => observer.disconnect()` to prevent memory leaks on unmount
- Keyboard: native `<a>` provides Tab + Enter. Add `onKeyDown` for Space to trigger click.
- ARIA: `<nav role="navigation" aria-label="Danh mục giải thưởng">`, active tab gets `aria-current="true"`

**2.2 Award System Layout**
- Already defined in Phase 1.6 page structure
- Desktop: `flex flex-row gap-awards-gap` (80px)
- Mobile: `flex flex-col`, sidebar becomes horizontal scrollable tab bar (`flex flex-row overflow-x-auto gap-0 lg:flex-col lg:overflow-visible`)

### Phase 3: Sun* Kudos Section (US3 — P2)

> TDD: Write AwardsSunKudosSection tests first (renders content, CTA links to /kudos), then implement.

**3.1 Awards Sun* Kudos Section** (`AwardsSunKudosSection.tsx`)
- Container: `w-full lg:h-[500px] flex flex-col lg:flex-row items-center justify-between relative overflow-hidden bg-section-bg`
- Left column (`flex flex-col gap-4 lg:w-[457px]`):
  - "Phong trào ghi nhận" — `<p>` 24px bold gold (`text-2xl font-bold text-gold-primary`)
  - "Sun* Kudos" — `<h2>` 57px bold gold (`text-[57px] leading-[64px] tracking-[-0.25px] font-bold text-gold-primary`)
  - Description block — `<p>` 16px bold white justified, with first line `<span className="block">ĐIỂM MỚI CỦA SAA 2025</span>` followed by the description text
  - "Chi tiết" button — `<Button variant="warm" href="/kudos" showArrow>Chi tiết</Button>`
- Right column (`hidden lg:flex items-center`):
  - Kudos logo: `next/image` with `kudos-logo.png`
  - Decorative "KUDOS" text: `<span>` SVN-Gotham ~96px #DBD1C1 (`font-[family-name:var(--font-gotham)] text-[96px] font-normal text-kudos-text tracking-[-0.13em] select-none`)
- Responsive: mobile `flex-col h-auto py-6`, right column `hidden lg:flex`

### Phase 4: Route States & Error Handling (FR-009)

**4.1 Loading State** (`loading.tsx`)
- Skeleton layout matching awards page structure:
  - Hero placeholder: `w-full h-[300px] lg:h-[547px] bg-divider animate-pulse`
  - Section title: two bars (24px and 57px height) with divider
  - 3 award card skeletons: alternating image+content bars
- Dark theme: use `bg-divider` (#2E3940) on `bg-page-bg` (#00101A) for subtle contrast

**4.2 Error State** (`error.tsx`)
- `"use client"` (required by Next.js)
- Props: `{ error: Error & { digest?: string }; reset: () => void }`
- Layout: `min-h-screen bg-page-bg flex flex-col items-center justify-center gap-6 px-4` (follows established pattern from `src/app/kudos/error.tsx` — simple centered layout, NO Header/Footer)
- Heading: `<h2>` "Something went wrong" (24px bold white)
- Error message: "Không thể tải thông tin giải thưởng." (16px text-text-gray)
- Retry button: `<button onClick={reset}>` with gold-primary bg, bold text (same pattern as kudos error.tsx)
- Maintains dark theme aesthetic

### Phase 5: Responsive Design (US4 — P3)

> Note: Responsive classes are applied during component implementation (Phases 1-3) using Tailwind's mobile-first approach. This phase documents the responsive rules for reference; they are NOT a separate implementation step.

**5.1 Mobile (< 640px)** — base styles
- Page padding: `px-4 py-6`
- Hero: `h-auto min-h-[300px]`, title: `text-[32px]`
- Section title: `text-[28px]` (h1), `text-base` (subtitle)
- Award system: `flex-col`
- Sidebar: horizontal scroll (`flex flex-row overflow-x-auto`) or hidden
- Award cards: `flex-col`, image: `w-full max-w-[280px] mx-auto`, alternating disabled
- Stat number: `text-[28px]`
- Sun* Kudos: `flex-col h-auto`, right column `hidden`
- Footer: `flex-col gap-6 text-center`
- Touch targets: all interactive elements ≥ 44×44px (sidebar tabs already 16px padding = OK)

**5.2 Tablet (sm: 640-1023px)**
- Page padding: `sm:px-10 sm:py-12`
- Section title: `sm:text-[40px]` (h1)
- Award cards: gap `sm:gap-6`, image `sm:w-[240px] sm:h-[240px]`
- Sidebar: narrower or stacked above cards
- Sun* Kudos: maintain row layout, reduce padding

**5.3 Desktop (lg: ≥ 1024px)**
- Full design spec values: `lg:px-36 lg:py-section-gap`
- Page root: full-width `bg-page-bg` (Hero spans entire viewport). `<main>` uses `lg:px-36` padding (same as Header) — no `max-w`/`mx-auto` so content edges align with header on all screen sizes.
- At 1440px viewport, effective content width = 1152px (1440 - 2×144px padding). On wider screens, content grows proportionally.
- All components use design-style.md specified values

### Phase 6: Accessibility (US5 — P3)

> Note: Accessibility attributes are applied during component implementation (Phases 1-3). This phase documents the a11y rules for reference.

- Sidebar: `<nav role="navigation" aria-label="Danh mục giải thưởng">`
- Active tab: `aria-current="true"`
- Award card images: `alt="[Award name] award badge"` (e.g., "Top Talent award badge")
- "ROOT FURTHER": `aria-hidden="true"` (decorative)
- Focus styles: `focus-visible:outline-2 focus-visible:outline-gold-primary focus-visible:outline-offset-2` on all interactive elements
- Heading hierarchy: `<h1>` page title → `<h2>` award names + "Sun* Kudos"
- Keyboard: native `<a>` elements for sidebar (Tab + Enter), Space handler added
- Focus management: after sidebar click scrolls to card, focus moves to card's `<h2>` via `element.focus({ preventScroll: true })`

### Phase 7: Performance Optimization (TR-001)

- **Images**: All award images use `next/image` with explicit `width={336} height={336}` for CLS prevention. Hero uses `priority` for LCP optimization.
- **Fonts**: Montserrat loaded via `next/font/google` with `display: "swap"` (already configured in `layout.tsx`). SVN-Gotham loaded locally for decorative "KUDOS" only.
- **Bundle size**: Only `AwardSidebar` is client component (~small bundle). All other components are Server Components — zero client JS.
- **Lazy loading**: Award images below the fold use default lazy loading from `next/image`. Only hero image uses `priority`.
- **Lighthouse target**: >= 90 performance score. Monitor: LCP (hero image), CLS (image dimensions), TBT (minimal client JS).
- **Verify**: Run `yarn build && npx next start` locally, then Lighthouse audit on `/awards`.

---

## Integration Testing Strategy

### Test Scope

- [x] **Component interactions**: Sidebar ↔ Award Cards (scroll spy, click-to-scroll)
- [x] **Data layer**: Supabase query → page render with award data
- [x] **User workflows**: Load page → view awards → click sidebar → scroll to card → click CTA

### Test Categories

| Category | Applicable? | Key Scenarios |
|----------|-------------|---------------|
| UI ↔ Logic | Yes | Sidebar click triggers smooth scroll; scroll spy updates active tab |
| App ↔ Data Layer | Yes | Page renders 6 awards from Supabase; handles empty/error states |
| Cross-platform | Yes | Responsive layout at 3 breakpoints |

### Test Environment

- **Environment type**: Local (jsdom for unit/integration, browser for E2E)
- **Test data strategy**: Mock Supabase responses in integration tests; seeded DB for E2E
- **Isolation approach**: Fresh mock state per test

### Mocking Strategy

| Dependency Type | Strategy | Rationale |
|-----------------|----------|-----------|
| Supabase client (`@/libs/supabase/server`) | Mock | Constitution: mock external services at boundary |
| next/image | Pass through | Testing Library renders as `<img>` |
| next/link | Pass through | Testing Library handles |
| IntersectionObserver | Mock | Not available in jsdom. Use `vi.fn()` to simulate entries. |
| `scrollIntoView` | Mock | Not available in jsdom. Verify it's called with correct args. |

### Test Scenarios Outline

1. **Happy Path**
   - [x] Page renders hero, section title, 6 award cards, Kudos section, footer
   - [x] Award cards display correct data (title, description, quantity with formatted number, prize with VNĐ format)
   - [x] Alternating layout: odd cards image-left, even cards image-right
   - [x] Sidebar shows 6 items matching award names
   - [x] "Chi tiết" button has `href="/kudos"`
   - [x] Award card title uses `<h2>` element

2. **Error Handling**
   - [x] `error.tsx` renders when Supabase query fails
   - [x] `loading.tsx` renders skeleton during data fetch
   - [x] Award images show fallback when load fails (fallback div with award name)

3. **Edge Cases**
   - [x] Signature 2025 card renders two prize tiers with "Hoặc" divider
   - [x] MVP card renders without sub-label (prize_sub_label is empty string)
   - [x] Sidebar scroll spy handles rapid scrolling (isScrollingRef debounce)
   - [x] `formatPrizeValue(0)` renders "0 VNĐ" correctly
   - [x] Empty award data (no rows) — shows "Chưa có thông tin giải thưởng." message, no sidebar/cards/Kudos section

### Tooling & Framework

- **Test framework**: Vitest + @testing-library/react
- **Supporting tools**: MSW for Supabase mocking (already installed)
- **CI integration**: `yarn test` in CI pipeline

### Coverage Goals

| Area | Target | Priority |
|------|--------|----------|
| Award card rendering | 90%+ | High |
| Sidebar interaction | 85%+ | High |
| Prize formatting utility | 100% | High |
| Sun* Kudos section | 85%+ | Medium |
| Error/loading states | 80%+ | Medium |
| Responsive layouts | 70%+ | Medium |

---

## Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Hero section title overlap requires pixel-perfect positioning | Medium | Medium | Use negative margin-top approach; test across breakpoints; fallback to gap-based layout if overlap proves fragile |
| IntersectionObserver scroll spy conflicting with smooth scroll click | Medium | Low | `isScrollingRef` debounce flag (500ms timeout) disables observer during programmatic scroll |
| 57px title overflow on narrow viewports | Low | Medium | Responsive font scaling: 28-32px mobile, 40-48px tablet. Test at 320px minimum width. |
| Missing award card icon SVG paths from Figma | Medium | Low | Use Lucide icon approximations (target, map-pin, award) as fallback; refine later with exact Figma paths |
| Database migration breaking existing `/api/awards` route | Low | Medium | New columns have defaults; existing route only selects `id, name, slug, short_description, thumbnail_url, order` — no breakage. Verify with `yarn dev` after migration. |
| SVN-Gotham font for decorative "KUDOS" text not loading | Low | Low | Already loaded in `layout.tsx`; fallback: sans-serif with similar styling |
| `Intl.NumberFormat('vi-VN')` not supported on Cloudflare Workers | Low | High | Cloudflare Workers support Intl API. Fallback: manual `.replace(/\B(?=(\d{3})+(?!\d))/g, '.')` regex formatting. |

### Estimated Complexity

- **Frontend**: Medium-High (7 new components, scroll spy, responsive, alternating layout)
- **Backend**: Low (single migration + seed update)
- **Testing**: Medium (5 test files, scroll spy mocking, IntersectionObserver mock)

---

## Dependencies & Prerequisites

### Required Before Start

- [x] `constitution.md` reviewed and understood
- [x] `spec.md` approved (10th review pass — implementation-ready)
- [x] `design-style.md` approved (10th review pass — implementation-ready)
- [x] Award images available (`public/images/awards/` — 6 images + glow ring ✅)
- [x] Fonts configured (Montserrat, SVN-Gotham, Montserrat Alternates ✅)
- [x] Shared Header component available ✅
- [x] Shared Footer component available ✅
- [x] Supabase client setup exists (`@/libs/supabase/server.ts` ✅)

### External Dependencies

- Hero banner artwork for awards page — **Fallback**: Reuse `/images/hero-banner.png` (same "ROOT FURTHER" hero as homepage). If design team provides awards-specific artwork later, swap the image path in `AwardsHeroSection.tsx`. Implementation should not block on this.
- Kudos logo artwork for Sun* Kudos section right column — **Fallback**: Use existing `/images/kudos-logo.png`. Extract additional assets from Figma during Phase 0 using `mcp__momorph__get_media_files`. If extraction fails, the right column renders logo only without decorative elements.

---

## Next Steps

After plan approval:

1. **Run** `/momorph.tasks` to generate task breakdown
2. **Review** tasks.md for parallelization opportunities
3. **Begin** implementation following task order

---

## Notes

- The existing `SunKudosPromo` in `src/components/shared/` will NOT be modified — it serves the homepage. A new `AwardsSunKudosSection` component is created for the awards page with different typography, colors, and layout per the spec
- The existing `/api/awards` route handler (`src/app/api/awards/route.ts`) remains unchanged for backward compatibility. The awards page fetches data directly via Supabase Server Component query
- Award card node IDs in the spec (313:8467-8510) don't follow sequential numbering — the implementation uses `award_categories.order` field (1-6) for both display order and alternating layout logic
- The `SectionTitle` component could potentially be reused across other pages (e.g., if Kudos page needs a similar pattern), so it's built as a standalone component under `awards/` with clean props
- `scroll-padding-top: 96px` is added globally to `html` in `globals.css` — safe for all pages and benefits any future anchor navigation
- The homepage `HeroBanner` component uses a different layout (full-screen with countdown), so the awards hero is a separate `AwardsHeroSection` component
- Graceful degradation without JavaScript: all content renders server-side. Sidebar anchor links (`<a href="#...">`) still work natively. Scroll spy and smooth scroll enhance but don't gate functionality.
- Quantity display: DB stores integers (e.g., 1, 2, 10). Display with leading zero for single digits: `String(quantity).padStart(2, '0')` → "01", "02", "10"
