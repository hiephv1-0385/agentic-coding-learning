# Implementation Plan: Homepage SAA

**Frame**: `2167-9026-Homepage-SAA`
**Date**: 2026-03-10
**Spec**: `specs/2167-9026-Homepage-SAA/spec.md`

---

## Summary

Build the main landing page for Sun* Annual Awards 2025 — the platform's central hub. The page features a hero banner with "ROOT FURTHER" branding, a real-time countdown timer, CTA buttons, a 6-card awards overview grid, a Sun* Kudos promo section, a floating widget button, and shared Header/Footer components. The page is primarily a Server Component with Client Components for countdown, widget button, and header dropdowns.

---

## Technical Context

**Language/Framework**: TypeScript (strict) / Next.js 15 App Router
**Primary Dependencies**: React 19, TailwindCSS 4.x, Supabase SSR, Zod, next/image, next/link, next/font
**Database**: Supabase PostgreSQL (via Supabase JS SDK, with RLS)
**Testing**: Vitest (unit/integration), @testing-library/react (component), Playwright (E2E)
**State Management**: Local state only (useState/useEffect for countdown, widget button, dropdowns)
**API Style**: REST (Next.js Route Handlers)
**Deployment**: Cloudflare Workers via @opennextjs/cloudflare

---

## Constitution Compliance Check

*GATE: Must pass before implementation can begin*

- [x] Follows project coding conventions (TypeScript strict, PascalCase components, camelCase hooks/utils, kebab-case routes)
- [x] Uses approved libraries and patterns (Next.js App Router, Supabase Auth, TailwindCSS utilities)
- [x] Adheres to folder structure guidelines (`src/app/`, `src/components/`, `src/hooks/`, `src/libs/`, `src/types/`, `src/utils/`)
- [x] Meets security requirements (Supabase Auth middleware, NEXT_PUBLIC_ prefix for client vars, no dangerouslySetInnerHTML)
- [x] Follows testing standards (TDD, co-located tests, integration tests for happy path + errors)

**Violations (if any)**:

| Violation | Justification | Alternative Rejected |
|-----------|---------------|---------------------|
| Custom fonts (Digital Numbers, SVN-Gotham) loaded via `next/font/local` | Required by design spec for countdown digits and Kudos branding; not available on Google Fonts | Web font CDN (no self-hosting, slower, no font optimization) |
| Arbitrary Tailwind values (e.g., `text-[49.15px]`, `bg-[#00101A]`) | Design tokens from Figma don't map to standard Tailwind scale; mitigated by defining custom theme tokens in `globals.css` `@theme inline` block to avoid raw arbitrary values in components | Creating a full tailwind.config — unnecessary with v4 `@theme` |
| New dev dependencies: Vitest, @testing-library/react, MSW, Zod | Constitution mandates TDD and server-side validation; no existing test framework or validation library installed | Jest (heavier, slower with ESM); Yup (less TypeScript-native than Zod) |

---

## Architecture Decisions

### Frontend Approach

- **Component Structure**: Feature-based under `src/components/homepage/` for page-specific components; shared components in `src/components/ui/` and `src/components/shared/`
- **Styling Strategy**: Tailwind utility classes exclusively. Custom design tokens defined via `@theme inline` in `globals.css`. No `@apply` rules — extract to components instead.
- **Data Fetching**: Homepage `page.tsx` (Server Component) fetches awards + event data via Supabase server SDK, then passes as props to child components. No client-side data fetching except countdown reading `NEXT_PUBLIC_EVENT_DATETIME` env var. This avoids the waterfall of client-side fetch and leverages server-side rendering.
- **Font Strategy**: Montserrat via `next/font/google`. Digital Numbers, SVN-Gotham, and Montserrat Alternates via `next/font/local` (self-hosted `.woff2` files in `public/fonts/`). Font CSS variables are set on `<body>` and referenced via Tailwind `@theme` tokens.
- **Image Strategy (v1)**: Hero banner and award thumbnails are static assets in `public/images/` extracted from Figma. The `AwardCategory.thumbnailUrl` and `Event.heroBannerUrl` DB fields store relative paths (e.g., `/images/awards/top-talent.webp`). In a future version, images can migrate to Supabase Storage — only the URL values change, no code changes needed.

### Backend Approach

- **API Design**: Two GET endpoints — `/api/event` and `/api/awards` — implemented as Next.js Route Handlers. Return JSON matching predicted response shapes in spec. Note: Homepage `page.tsx` fetches data directly via Supabase server SDK (not via these API endpoints) for SSR performance. The API endpoints exist for client-side use by other pages or future features.
- **Data Access**: Supabase server client with RLS. For v1, data is seeded via `supabase/seeds/common/` SQL files.
- **Validation**: Zod schemas for API response shapes and any future input validation. Schemas co-located with type definitions in `src/types/`.
- **Database**: Two tables needed — `events` and `award_categories` — with RLS policies allowing public read access. Schema design (via `/momorph.database` or manual SQL) must happen before Phase 3.

### Integration Points

- **Existing Services**: Supabase Auth helpers (`src/libs/supabase/client.ts`, `server.ts`, `middleware.ts`) — already set up. Note: `src/middleware.ts` (the Next.js middleware entry point) is NEW and will import from the existing `src/libs/supabase/middleware.ts` helper.
- **Shared Components**: `<Header>`, `<Footer>`, `<SunKudosPromo>` — shared with Awards System page (`.momorph/specs/313-8436-He-thong-giai/`). Build once, reuse across pages.
- **Dropdown Components**: Language, Profile, Admin Profile dropdowns are separate specs — implement as composable sub-components within Header
- **API Contracts**: See predicted response shapes in spec.md (EventResponse, AwardCategoryResponse)

---

## Project Structure

### Documentation (this feature)

```text
.momorph/specs/2167-9026-Homepage-SAA/
├── spec.md              # Feature specification
├── design-style.md      # Design specifications
├── plan.md              # This file
├── tasks.md             # Task breakdown (next step)
└── assets/
    └── frame.png        # Figma frame screenshot
```

### Source Code (affected areas)

#### New Files

```text
src/
├── app/
│   ├── loading.tsx              # NEW: Page-level loading skeleton (Suspense fallback)
│   ├── error.tsx                # NEW: Page-level error boundary (Client Component)
│   ├── not-found.tsx            # NEW: 404 page (per constitution)
│   ├── awards/
│   │   └── page.tsx             # NEW: Awards System page (stub — navigation target)
│   ├── kudos/
│   │   └── page.tsx             # NEW: Sun* Kudos page (stub — navigation target for CTA + "Chi tiết")
│   └── api/
│       ├── event/
│       │   └── route.ts         # NEW: GET /api/event endpoint
│       └── awards/
│           └── route.ts         # NEW: GET /api/awards endpoint
├── components/
│   ├── ui/
│   │   ├── Button.tsx           # NEW: Shared button (variants: cta, outlined, link)
│   │   └── Icon.tsx             # NEW: Icon component wrapper (see Icon Inventory below)
│   ├── shared/
│   │   ├── Header.tsx           # NEW: Global header (shared with Awards page)
│   │   ├── Footer.tsx           # NEW: Global footer (shared with Awards page)
│   │   └── SunKudosPromo.tsx    # NEW: Sun* Kudos promo section (shared)
│   └── homepage/
│       ├── HeroBanner.tsx       # NEW: Hero section with cover image + gradient
│       ├── CountdownTimer.tsx   # NEW: Client Component — countdown logic + display
│       ├── EventInfo.tsx        # NEW: Date, venue, livestream info (receives props from page)
│       ├── CTAButtons.tsx       # NEW: "ABOUT AWARDS" + "ABOUT KUDOS" buttons
│       ├── RootFurtherContent.tsx # NEW: "Root Further" description section
│       ├── AwardsOverview.tsx   # NEW: Awards section header + grid container
│       ├── AwardGrid.tsx        # NEW: Responsive 3/2 col grid
│       ├── AwardCard.tsx        # NEW: Individual award card
│       └── WidgetButton.tsx     # NEW: Client Component — floating action button
├── hooks/
│   └── useCountdown.ts          # NEW: Countdown timer logic hook
├── types/
│   ├── event.ts                 # NEW: Event type + Zod schema
│   └── award.ts                 # NEW: AwardCategory type + Zod schema
├── utils/
│   └── formatDate.ts            # NEW: Date formatting utilities
└── middleware.ts                  # NEW: Next.js middleware (Supabase session refresh + security headers)

vitest.config.ts                   # NEW: Vitest configuration (jsdom, path aliases, setup)

supabase/
├── migrations/
│   └── 00001_create_events_and_awards.sql  # NEW: DB schema for events + award_categories
└── seeds/
    └── common/
        └── 001_seed_saa2025.sql             # NEW: Seed data for SAA 2025 event + 6 awards

public/
├── fonts/
│   ├── DigitalNumbers-Regular.woff2         # NEW: Countdown font
│   ├── SVN-Gotham.woff2                     # NEW: Kudos branding font
│   └── MontserratAlternates-Bold.woff2      # NEW: Footer copyright font
└── images/
    ├── hero-banner.webp                     # NEW: Hero banner image (from Figma)
    ├── root-further.webp                    # NEW: "ROOT FURTHER" stylized graphic
    ├── logo-saa.svg                         # NEW: SAA logo for header/footer
    └── awards/                              # NEW: 6 award category thumbnails
        ├── top-talent.webp
        ├── top-project.webp
        ├── top-project-leader.webp
        ├── best-manager.webp
        ├── signature-2025-creator.webp
        └── mvp.webp
```

#### Modified Files

| File | Changes |
|------|---------|
| `src/app/globals.css` | Replace Geist theme with SAA design tokens via `@theme inline` block: 11 color tokens, 16 typography tokens, spacing tokens, **layout tokens** (`--max-w-page: 1512px`, `--max-w-content: 1224px`, `--max-w-content-narrow: 1152px`). Remove dark mode media query. Components use named tokens (e.g., `max-w-page`) instead of arbitrary values. |
| `src/app/layout.tsx` | Replace Geist/Geist_Mono with Montserrat (Google) + 3 local fonts. Update metadata (title, description). Apply font CSS variables to `<body>`. |
| `src/app/page.tsx` | Replace default Next.js content with Homepage SAA Server Component. Fetches event + awards data via Supabase server SDK, passes as props to child sections. |
| `next.config.ts` | Add `images.remotePatterns` for Supabase Storage domain (future-proofing). No other changes needed for v1 static images. |
| `.env.example` | Add `NEXT_PUBLIC_EVENT_DATETIME` with ISO-8601 example value. |
| `package.json` | Add dependencies: `zod`. Add devDependencies: `vitest`, `@vitejs/plugin-react`, `@testing-library/react`, `@testing-library/jest-dom`, `jsdom`, `msw`. Add scripts: `"test"`, `"test:watch"`, `"test:coverage"`. |

#### Icon Inventory

Icons needed for `Icon.tsx` (all rendered as inline SVG within the component, not separate files):

| Icon Name | Usage | Source |
|-----------|-------|--------|
| `arrow-right` | CTA buttons, "Chi tiết" links | Design: → icon |
| `bell` | Header notification bell | Design: Node I2167:9091;186:2101 |
| `user` | Header profile icon | Design: Node I2167:9091;186:1597 |
| `chevron-down` | Language selector dropdown indicator | Design: "VN▼" |
| `pencil` | Widget button left icon | Design: Node 5022:15169 |
| `saa-logo` | Widget button right icon | Design: Node 5022:15169 |
| `globe` | Language selector (if needed) | Predicted |

---

## Implementation Strategy

### Phase Breakdown

#### Phase 0: Asset Preparation & Project Setup
1. **Install new dependencies**:
   - Production: `zod`
   - Dev: `vitest`, `@vitejs/plugin-react`, `@testing-library/react`, `@testing-library/jest-dom`, `jsdom`, `msw`
   - Add `package.json` scripts: `"test": "vitest run"`, `"test:watch": "vitest"`, `"test:coverage": "vitest run --coverage"`
   - Create `vitest.config.ts`: jsdom environment, `@/` → `src/` path alias, setup file for `@testing-library/jest-dom` matchers
2. **Download assets from Figma** using `get_media_files`:
   - Hero banner image → `public/images/hero-banner.webp`
   - 6 award category thumbnails → `public/images/awards/{slug}.webp`
   - SAA logo → `public/images/logo-saa.svg`
   - "ROOT FURTHER" stylized graphic → `public/images/root-further.webp` (or SVG if vector)
   - Widget button icons (pencil, SAA icon) — extract as SVG paths for Icon component
3. **Source custom fonts** → `public/fonts/`:
   - Digital Numbers Regular (`.woff2`) — countdown digits
   - SVN-Gotham (`.woff2`) — "KUDOS" decorative text
   - Montserrat Alternates Bold (`.woff2`) — footer copyright
4. **Update `globals.css`**: Remove Geist theme and dark mode media query. Add SAA design tokens via `@theme inline`:
   - Colors: `--color-page-bg: #00101A`, `--color-gold-primary: #FFEA9E`, `--color-header-bg: rgba(16,20,23,0.8)`, etc. (11 tokens from design-style.md)
   - Typography: custom font family variables for Digital Numbers, SVN-Gotham, Montserrat Alternates
   - Spacing: `--spacing-page-x: 144px`, `--spacing-section-gap: 120px`, etc. (8 tokens)
   - Layout: `--max-w-page: 1512px`, `--max-w-content: 1224px`, `--max-w-content-narrow: 1152px` — so components use `max-w-page` not arbitrary `max-w-[1512px]` per constitution
5. **Update `layout.tsx`**: Replace Geist/Geist_Mono with:
   - Montserrat via `next/font/google` (weights: 400, 500, 700)
   - Digital Numbers, SVN-Gotham, Montserrat Alternates via `next/font/local`
   - Set CSS variables on `<body>`: `--font-montserrat`, `--font-digital`, `--font-gotham`, `--font-montserrat-alt`
   - Update `<html>` metadata: title "Sun* Annual Awards 2025", description
6. **Add `NEXT_PUBLIC_EVENT_DATETIME`** to `.env.example` with example: `2025-12-26T18:30:00+07:00`
7. **Create type definitions + Zod schemas**:
   - `src/types/event.ts`: `Event` interface + `eventSchema` Zod schema
   - `src/types/award.ts`: `AwardCategory` interface + `awardCategorySchema` Zod schema
8. **Create `src/middleware.ts`**: Next.js middleware file (must be in `src/` since project uses `src/` directory). Two responsibilities:
   - Call Supabase `updateSession` for auth session refresh on all requests
   - Set security headers per constitution IV: `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`. CSP can be configured via Cloudflare settings for production.
   - Export matcher config to exclude static assets: `matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)']`
9. **Design database schema** (or run `/momorph.database`):
   - `events` table: `id`, `name`, `theme`, `date_time`, `venue`, `livestream_info`, `hero_banner_url`
   - `award_categories` table: `id`, `name`, `slug`, `short_description`, `thumbnail_url`, `order`
   - RLS policies: public read for both tables, admin write
   - Create migration: `supabase/migrations/00001_create_events_and_awards.sql`
   - Create seed: `supabase/seeds/common/001_seed_saa2025.sql` (SAA 2025 event + 6 award categories)

#### Phase 1: Foundation — Shared Components (US6, US5 partial)
1. **Icon** (`src/components/ui/Icon.tsx`):
   - Centralized icon component rendering inline SVGs by name prop
   - Icons: `arrow-right`, `bell`, `user`, `chevron-down`, `pencil`, `saa-logo` (see Icon Inventory above)
   - Props: `name`, `size` (default 24), `className`
   - Per design-style note: "All icons MUST BE in Icon Component"
2. **Button** (`src/components/ui/Button.tsx`):
   - Variants: `cta` (outlined↔filled hover), `outlined` (Kudos "Chi tiết"), `link` (card "Chi tiết")
   - Props: `variant`, `href` (renders `next/link` if provided), `children`, `className`
   - CTA hover: `transition: all 150ms ease-in-out`, normal = white border/text, hover = gold bg/dark text with `border: 1px solid transparent` (prevents layout shift)
   - Focus: `outline: 2px solid #FFEA9E; outline-offset: 2px`
3. **Header** (`src/components/shared/Header.tsx`):
   - **Client Component** (`"use client"`) — requires `usePathname()` for logo scroll-to-top behavior (FR-013) and click handlers for dropdown stubs
   - Sticky, `backdrop-blur`, translucent bg (`rgba(16,20,23,0.8)`), `z-50`
   - Logo (left): `next/link` to `/`. If `usePathname() === "/"`, click scrolls to top via `window.scrollTo({ top: 0, behavior: 'smooth' })` instead of navigation (FR-013)
   - Nav links (center): "About SAA 2025", "Award Information", "Sun* Kudos" — `activeLink` prop highlights current page with gold text + glow text-shadow (`0 4px 4px rgba(0,0,0,0.25), 0 0 6px #FAE287`)
   - Controls (right): notification bell (with red badge — **stub**: renders badge dot based on `hasNotifications` prop, click logs "notification panel not implemented"), language selector ("VN" text + chevron — **stub**: renders text, no action), profile icon (40x40px — **stub**: renders icon, no action)
   - Dropdown implementations deferred to their respective specs
   - **Responsive**: hamburger menu on mobile (< 640px) — predicted, may need design clarification
   - Padding: mobile `px-4`, tablet `sm:px-12`, desktop `lg:px-36` (header uses `12px` vertical per design-style)
4. **Footer** (`src/components/shared/Footer.tsx`):
   - Logo, 4 nav links: "About SAA 2025" → `/`, "Award Information" → `/awards`, "Sun* Kudos" → `/kudos`, "Tiêu chuẩn chung" → `#` (placeholder — target page TBD, render as non-navigating link for v1)
   - Copyright text: Montserrat Alternates 16px Bold ("Bản quyền thuộc về Sun* © 2025")
   - Link hover: gold highlight (#FFEA9E)
   - **Active link state**: design-style.md shows footer links with active gold+glow on current page. For v1, Footer remains a **Server Component** with no active highlighting (simplicity). If needed later, add `activeLink` prop or convert to Client Component with `usePathname()`.
   - Responsive: stack vertically on mobile

#### Phase 2: Core Features — Hero + Countdown (US1, US3)
1. **HeroBanner** (`src/components/homepage/HeroBanner.tsx`):
   - Cover image via `next/image` with `priority` (LCP element), `fill`, `sizes="100vw"`
   - CSS gradient overlay: `linear-gradient(12deg, #00101A 23.7%, rgba(0,18,29,0.46) 38.34%, rgba(0,19,32,0) 48.92%)`
   - **Composition**: HeroBanner renders `<CountdownTimer>`, `<EventInfo>`, and `<CTAButtons>` internally (not via `children` prop). It receives event data as props and passes to EventInfo. This keeps the hero section self-contained.
   - **Null handling**: Props type `{ event: Event | null }`. If `event === null` (fetch failure per Phase 5.1), render hero image + gradient + CountdownTimer but skip EventInfo and show CTA buttons without event-dependent text.
   - Responsive: height `h-auto min-h-screen lg:h-[1392px]`; content stacks vertically on mobile
2. **useCountdown** (`src/hooks/useCountdown.ts`):
   - Reads `process.env.NEXT_PUBLIC_EVENT_DATETIME`
   - Validates ISO-8601 format; returns `{ days, hours, minutes, isExpired, isValid }` — `isValid: false` when env var missing/invalid
   - Uses `setInterval(60_000)` for per-minute updates
   - Cleans up interval on unmount
   - Zero-pads values (e.g., "09" not "9")
3. **CountdownTimer** (`src/components/homepage/CountdownTimer.tsx`):
   - Client Component (`"use client"`)
   - Uses `useCountdown` hook
   - If `!isValid` → renders nothing (section hidden per Edge Case 1)
   - If `isExpired` → hides "Coming soon" label, shows "00" for all values
   - "Digital Numbers" font for digits, Montserrat Bold for unit labels
   - `aria-live="polite"` + `aria-label="X days, Y hours, Z minutes until event"`
   - Countdown digit containers: dark bg, slight border-radius (design-style predicted values)
4. **EventInfo** (`src/components/homepage/EventInfo.tsx`):
   - **Receives data via props** from page.tsx (Server Component — no client fetch)
   - Props: `{ date: string; venue: string; livestreamInfo: string }`
   - Labels in white 16px, values in gold 24px
5. **CTAButtons** (`src/components/homepage/CTAButtons.tsx`):
   - Two `<Button variant="cta">` instances with `href="/awards"` and `href="/kudos"`
   - Each includes `<Icon name="arrow-right" />` after text
   - Responsive: `flex-col w-full` on mobile, `flex-row` on desktop

#### Phase 3: Data Layer & Awards Overview (US2)
1. **Database migration** (`supabase/migrations/00001_create_events_and_awards.sql`):
   - Create `events` and `award_categories` tables
   - Enable RLS with public read policies
2. **Seed data** (`supabase/seeds/common/001_seed_saa2025.sql`):
   - Insert SAA 2025 event (date: 2025-12-26T18:30:00+07:00, venue: Âu Cơ Art Center)
   - Insert 6 award categories with slugs matching hash navigation spec
3. **API Endpoint** (`src/app/api/awards/route.ts`):
   - GET handler: query `award_categories` ordered by `order`, validate with Zod, return JSON
   - Error handling: return 500 with generic message on failure
4. **API Endpoint** (`src/app/api/event/route.ts`):
   - GET handler: query `events` for current/latest event, validate with Zod, return JSON
5. **AwardsOverview** (`src/components/homepage/AwardsOverview.tsx`):
   - Props: `{ awards: AwardCategory[] | null }`
   - If `awards === null` → render section header + 6 skeleton cards (same grid layout, `animate-pulse` placeholders) per Edge Case 2
   - Section header: "Sun* annual awards 2025" subtitle (24px) + "Hệ thống giải thưởng" title (57px gold, `<h2>`) + description
   - Renders `<AwardGrid>` with awards data
6. **AwardGrid** (`src/components/homepage/AwardGrid.tsx`):
   - `grid grid-cols-2 lg:grid-cols-3 gap-6` (mobile-first per constitution)
   - Maps awards data to `<AwardCard>` components
7. **AwardCard** (`src/components/homepage/AwardCard.tsx`):
   - Props: `{ award: AwardCategory }`
   - **Entire card is clickable** (spec US2.3: "clicks an award card (image, title, or 'Chi tiết')"). Implementation: wrap the full card in `next/link` to `/awards#{award.slug}`. The inner "Chi tiết" text is visual only (not a nested `<a>`), styled as a link affordance with → icon.
   - Image: `next/image`, square aspect ratio with glow ring effect
   - Title: `<h3>`, 24px Montserrat weight 400 (not 700), gold
   - Description: 16px, white, `line-clamp-2` for 2-line truncation with ellipsis
   - "Chi tiết →" visual: 16px Montserrat 500, white text + arrow icon (styled as link but not a separate `<a>` since card is already wrapped in `<Link>`)
   - Hover: `transform: translateY(-2px)`, `transition: transform 150ms ease`
   - Focus: visible focus ring on the card `<Link>` wrapper (`outline: 2px solid #FFEA9E; outline-offset: 2px`)

#### Phase 4: Extended Features (US4, US5, US7)
1. **RootFurtherContent** (`src/components/homepage/RootFurtherContent.tsx`):
   - Large padded reading section: `padding: 120px 104px` desktop, `40px 24px` mobile, `80px 48px` tablet
   - `border-radius: 8px`, `max-w-content-narrow` (1152px from `@theme`), centered
   - Background: `--color-content-section-bg: rgba(0, 16, 26, 0.6)` — subtle dark overlay on page bg (from design-style.md)
   - Flex column layout, `gap: 32px`, `align-items: center`
   - Content: "ROOT FURTHER" graphic (extract as image asset from Figma via `get_media_files` in Phase 0 — this is a stylized text/graphic, not rendered text) + description paragraphs (24px Montserrat Bold) + English quote "A tree with deep roots fears no storm" (20px Montserrat Bold)
   - v1: hardcoded Vietnamese text (FR-010), structured for future i18n
2. **SunKudosPromo** (`src/components/shared/SunKudosPromo.tsx`):
   - Props: `{ className?: string }` (shared component, used at 1224px width on both pages)
   - Layout: flex row, content left + "KUDOS" decorative text right
   - Elements: "Phong trào ghi nhận" label, "Sun* Kudos" title (57px gold, `<h2>`), "ĐIỂM MỚI CỦA SAA 2025" highlight label, description, "Chi tiết" bordered button
   - "KUDOS" text: SVN-Gotham 96px, color #DBD1C1
   - "Chi tiết" button: `<Button variant="outlined" href="/kudos">`, outlined style, hover → gold bg/dark text (same CTA pattern)
   - Responsive: stack vertically on mobile, hide "KUDOS" decorative text on small screens
3. ~~**WidgetButton**~~ → **SUPERSEDED** by global `FloatingActionButton` in root layout (`src/components/shared/FloatingActionButton.tsx`). See `.momorph/specs/313_9137-floating-action-button/plan.md` for the full FAB implementation plan. The old `src/components/homepage/WidgetButton.tsx` has been deleted.

#### Phase 5: Page Assembly & Integration
1. **Homepage** (`src/app/page.tsx`):
   - Server Component: fetch event + awards data via Supabase server SDK (`createClient()`)
   - **Awards fetch uses try/catch**: on failure, pass `awards: null` to `<AwardsOverview>` which renders 6 skeleton cards with `animate-pulse` (per Edge Case 2: "do NOT show an error message"). This is NOT handled by `error.tsx` — the page still renders with all other sections.
   - **Event fetch uses try/catch**: on failure, pass `event: null` to `<HeroBanner>` which renders hero without event info.
   - Pass event data as props to `<HeroBanner>` → `<EventInfo>`
   - Pass awards data as props to `<AwardsOverview>`
   - **Layout structure** (matches design-style.md ASCII layout): `<HeroBanner>` is **outside** `<main>` because it's full-bleed (1512px edge-to-edge, no padding). `<main>` wraps only the padded content sections (Root Further, Awards, Kudos) with `py-[--spacing-page-padding-y] px-[--spacing-page-padding-x]` and `flex flex-col items-center gap-[--spacing-section-gap]` on desktop (responsive: `px-4` mobile, `sm:px-12` tablet, `lg:px-36` desktop). `<Header>`, `<Footer>`, and `<WidgetButton>` are also outside `<main>`.
   - Section order: `<Header activeLink="about">` → `<HeroBanner>` → `<main>`: `<RootFurtherContent>` → `<AwardsOverview>` → `<SunKudosPromo>` → `</main>` → `<Footer>` (FAB is now rendered globally in root layout)
   - Semantic `<h1>`: "Sun* Annual Awards 2025" (can be visually hidden if hero text serves as title)
2. **Loading state** (`src/app/loading.tsx`):
   - Skeleton UI: hero placeholder + 6 award card skeletons in grid layout
   - Uses `animate-pulse` Tailwind utility
3. **Error state** (`src/app/error.tsx`):
   - Client Component (`"use client"`), graceful fallback for unexpected errors (e.g., render crash)
   - "Reset" button to retry. Note: awards API failure is handled gracefully via try/catch in page.tsx, NOT via error.tsx.
4. **Not found** (`src/app/not-found.tsx`):
   - Custom 404 page matching SAA design (dark bg, gold text, "Back to home" link)
   - Per constitution: "Use `not-found.tsx` for route-level UX states"
5. **Awards page stub** (`src/app/awards/page.tsx`):
   - Minimal page with `<Header activeLink="awards">` + placeholder content
   - Must handle URL hash fragments for scroll-to-section (future implementation)
6. **Kudos page stub** (`src/app/kudos/page.tsx`):
   - Minimal page with `<Header activeLink="kudos">` + placeholder content
   - Navigation target for CTA "ABOUT KUDOS" button and SunKudosPromo "Chi tiết" link
7. **Verify navigation flows**:
   - CTA "ABOUT AWARDS" → `/awards`
   - CTA "ABOUT KUDOS" → `/kudos` (stub or placeholder)
   - Award card "Chi tiết" → `/awards#top-talent` etc.
   - Header links navigate correctly
   - Footer links navigate correctly
   - Logo → `/` or scroll to top

#### Phase 6: Polish & Accessibility
1. **Semantic HTML**:
   - Heading hierarchy: `<h1>` = "Sun* Annual Awards 2025", `<h2>` = section titles ("Hệ thống giải thưởng", "Sun* Kudos"), `<h3>` = award card titles
   - Use `<nav>` for header nav, footer nav
   - Use `<main>` for page content, `<header>`, `<footer>` for respective sections
   - Use `<section>` with `aria-labelledby` for major content blocks
2. **Accessibility**:
   - `aria-live="polite"` + `aria-label` on countdown timer
   - Widget button: `aria-expanded`, `aria-haspopup="menu"`
   - Header dropdown stubs: `aria-haspopup="true"` even before implementation
   - Alt text: descriptive for award images, hero banner; `alt=""` for decorative (glow rings, gradients)
   - Focus indicators: `outline: 2px solid #FFEA9E; outline-offset: 2px` on all interactive elements
   - Card `focus-within` state matches hover state
3. **Keyboard navigation**:
   - Tab order: Header nav → CTA buttons → RootFurther links (if any) → Award cards → Kudos "Chi tiết" → Footer links → Widget button
   - Enter/Space activates buttons and links
4. **Responsive verification** (should be built into each component, this phase verifies):
   - Mobile (< 640px): `px-4`, stacked CTA buttons (`flex-col w-full`), 2-col award grid, reduced content padding, smaller countdown digits (~32px)
   - Tablet (640-1023px): `sm:px-12`, 2-col award grid, medium content padding
   - Desktop (>= 1024px): `lg:px-36`, 3-col award grid, full content padding, full hero height
5. **Performance**:
   - Hero banner: `priority` prop on `next/image` (LCP element)
   - Award images: lazy loading (default `next/image` behavior)
   - Font loading: `display: swap` for all custom fonts
   - Verify Cloudflare Workers deploy succeeds: `yarn deploy`

### Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Custom fonts (Digital Numbers, SVN-Gotham) unavailable or unlicensed | Medium | High | Source early in Phase 0; fallback: `font-mono` for countdown, `font-serif` for KUDOS decorative |
| Hero banner image too large (1512x1392px) | Medium | Medium | Use `next/image` with `priority` + `placeholder="blur"` + WebP; generate `blurDataURL` at build time |
| Cloudflare Workers bundle size limit | Low | High | Tree-shake imports; avoid large deps; run `yarn deploy` in Phase 0 to validate baseline bundle |
| Header dropdowns depend on unimplemented specs | Medium | Low | Stub with click handlers that do nothing; render trigger elements with correct styling |
| `NEXT_PUBLIC_EVENT_DATETIME` timezone issues | Medium | Medium | Validate ISO-8601 in `useCountdown`; document `+07:00` offset requirement in `.env.example`; return `isValid: false` on parse failure |
| Header mobile responsive design not in Figma | Medium | Medium | Implement standard hamburger menu pattern; flag for design review before merge |
| Zod + MSW + Vitest increase bundle/dev overhead | Low | Low | All are devDependencies except Zod; Zod is tree-shakeable and small (~13KB) |

### Estimated Complexity

- **Frontend**: High (10+ components, responsive design, animations, custom fonts, accessibility)
- **Backend**: Low (2 simple GET endpoints, seeded data)
- **Testing**: Medium (countdown timer logic, responsive layout, navigation flows)

---

## Integration Testing Strategy

### Test Scope

- [x] **Component/Module interactions**: Header nav → page navigation, award card → hash navigation, CTA → page navigation
- [x] **External dependencies**: Supabase (event/awards data fetching)
- [x] **Data layer**: API route handlers returning correct data shapes
- [x] **User workflows**: Homepage → Awards page with hash scroll, Homepage → Kudos page

### Test Categories

| Category | Applicable? | Key Scenarios |
|----------|-------------|---------------|
| UI ↔ Logic | Yes | Countdown timer expiry hides "Coming soon"; award grid renders from API data |
| Service ↔ Service | No | No inter-service communication |
| App ↔ External API | Yes | Supabase data fetch for awards/event; auth state for profile dropdown |
| App ↔ Data Layer | Yes | API route handlers returning seeded data |
| Cross-platform | Yes | Responsive layout at 3 breakpoints; keyboard navigation |

### Test Environment

- **Environment type**: Local (Next.js dev server + Supabase local via `make up`)
- **Test data strategy**: Fixtures for award categories and event info; Supabase seed files
- **Isolation approach**: Fresh Supabase instance per test suite (via Docker)

### Mocking Strategy

| Dependency Type | Strategy | Rationale |
|-----------------|----------|-----------|
| Supabase data (awards, event) | Mock in unit tests, Real in integration | Unit tests need speed; integration tests verify actual data flow |
| `NEXT_PUBLIC_EVENT_DATETIME` | Controlled env var per test | Test countdown at various time deltas |
| `next/image` | Real | Let Next.js handle; no mock needed |
| `next/link` | Real | Standard navigation, tested via E2E |

### Test Scenarios Outline

1. **Happy Path**
   - [x] Homepage renders all sections (hero, countdown, awards grid, kudos, footer)
   - [x] Countdown displays correct remaining time from env var
   - [x] All 6 award cards render with correct data
   - [x] CTA buttons navigate to correct pages
   - [x] Award card "Chi tiết" links include correct hash fragments

2. **Error Handling**
   - [x] Awards API failure → skeleton cards displayed (no error message)
   - [x] Invalid/missing `NEXT_PUBLIC_EVENT_DATETIME` → countdown section hidden
   - [x] Hero image slow load → blur placeholder shown

3. **Edge Cases**
   - [x] Countdown at exactly 0 → "Coming soon" hidden, all digits show "00"
   - [x] Viewport resize across breakpoints → grid columns change correctly
   - [x] Unauthenticated user → page displays normally, profile shows login prompt

### Tooling & Framework

- **Test framework**: Vitest (unit/integration), Playwright (E2E)
- **Supporting tools**: Testing Library (React), MSW (mock API for unit tests)
- **CI integration**: `yarn test` in CI pipeline before deploy

### Coverage Goals

| Area | Target | Priority |
|------|--------|----------|
| Core user flows (navigation, countdown) | 90%+ | High |
| Shared components (Header, Footer) | 85%+ | High |
| Homepage-specific components | 80%+ | Medium |
| API route handlers | 90%+ | High |
| Edge cases (error states, responsive) | 75%+ | Medium |

---

## Dependencies & Prerequisites

### Required Before Start

- [x] `constitution.md` reviewed and understood
- [x] `spec.md` approved by stakeholders
- [ ] `research.md` completed — Codebase research done inline (early-stage project, minimal existing code)
- [ ] API contracts defined — Predicted in spec.md; finalize during Phase 3
- [ ] Database migrations planned — Need `events` and `award_categories` tables with RLS

### External Dependencies

- Custom font files: Digital Numbers, SVN-Gotham, Montserrat Alternates (`.woff2`)
- Hero banner image from design team (or extract via Figma `get_media_files`)
- 6 award category thumbnail images from design team (or extract via Figma)
- SAA logo SVG
- Widget button icons (pencil, SAA logo variant)

---

## Next Steps

After plan approval:

1. **Run** `/momorph.tasks` to generate task breakdown
2. **Review** tasks.md for parallelization opportunities
3. **Begin** implementation following task order

---

## Notes

### Project State
- **Greenfield project** — codebase has only the default Next.js starter, Supabase libs, and Cloudflare config. All components, hooks, types, and routes are new.
- **Fonts**: Current layout uses Geist/Geist Mono — will be completely replaced with Montserrat + 3 custom local fonts.
- **globals.css**: Requires full rewrite — remove Geist theme, dark mode query, add SAA design tokens.

### Page Width Strategy
- Homepage: `max-w-page` (1512px, from `@theme`) `mx-auto` — main content areas are `max-w-content` (1224px) within 144px padding
- Awards page: uses its own max-width (1440px) — main content areas are `max-w-content-narrow` (1152px) within 144px padding
- Shared components (Header, Footer): `w-full` — they stretch to parent width. Internal padding is consistent (`px-36` desktop).
- Root Further content block: `max-w-content-narrow` (1152px, narrower than 1224px content area, centered).

### Shared Component Strategy
Header, Footer, SunKudosPromo are used on both Homepage and Awards System pages:
- **Header**: `activeLink` prop (`"about"` | `"awards"` | `"kudos"`) for highlighting
- **Footer**: Identical on all pages — no props needed beyond className
- **SunKudosPromo**: `className` prop for width customization

### v1 Simplifications
- "Root Further" content: hardcoded Vietnamese text (FR-010)
- Widget button: renders button with `aria-expanded` toggle; menu content TBD
- Header dropdowns: trigger elements render with correct styling; click handlers are no-ops; actual dropdown panels deferred to Language/Profile/Admin dropdown spec implementations
- Notification bell: renders with red badge dot (static `hasNotifications={true}` prop); no actual notification panel

### Database
- Need `events` and `award_categories` tables with RLS public read policies
- Schema design should complete in Phase 0 (prerequisite for Phase 3)
- Consider running `/momorph.database` for formal schema design
- No `BACKEND_API_TESTCASES.md` exists — generate API test cases alongside Phase 3

### Test File Convention
Per constitution: test files MUST be co-located or in `__tests__/` adjacent to the code. Pattern:
```
src/components/homepage/
├── CountdownTimer.tsx
├── __tests__/
│   └── CountdownTimer.test.tsx
src/hooks/
├── useCountdown.ts
├── __tests__/
│   └── useCountdown.test.ts
```

### Data Fetching Architecture
```
Homepage page.tsx (Server Component)
├── Fetches event data via Supabase server SDK → passes as props
├── Fetches awards data via Supabase server SDK → passes as props
├── <CountdownTimer /> reads NEXT_PUBLIC_EVENT_DATETIME (client-side env var)
└── <WidgetButton /> uses local state only

/api/event (Route Handler) — exists for client-side use by other pages
/api/awards (Route Handler) — exists for client-side use by other pages
```
The homepage does NOT call its own API endpoints — it fetches directly via Supabase SDK for SSR performance. The API endpoints are for other consumers (client-side fetching on other pages, external integrations).

---

## Post-Implementation Bugfixes (2026-03-16)

Visual QA against Figma design revealed 4 issues in the original implementation. All have been fixed.

### BF001: Missing ROOT FURTHER hero logo
- **Issue**: HeroBanner did not render the `MM_MEDIA_Root Further Logo` (Figma node `2788:12911`)
- **Fix**: Downloaded image from Figma as `public/images/root-further-hero.png`, added as first element in hero content
- **Files**: `HeroBanner.tsx`, `public/images/root-further-hero.png`

### BF002: Countdown center-aligned instead of left
- **Issue**: CountdownTimer and "Coming soon" text were center-aligned (`items-center`)
- **Fix**: Changed to `items-start` to match Figma left-alignment below ROOT FURTHER logo
- **Files**: `CountdownTimer.tsx`

### BF003: Root Further content showing only "Root"
- **Issue**: RootFurtherContent only rendered `root-further.png` ("ROOT"), missing `root-further-bg.png` ("FURTHER")
- **Fix**: Added both images stacked vertically within a flex container
- **Files**: `RootFurtherContent.tsx`

### BF004: Hero layout — excessive empty space
- **Issue**: Fixed `h-[1392px]` + `justify-end` created ~700px dead zones above and/or below hero content
- **Fix**: Changed to auto height with `pt-[120px]` (clears 80px header + 40px gap) + `pb-24` bottom padding. Background image covers via `object-cover` + `fill`
- **Deviation from Figma**: Figma specifies hero height as 1392px, but this creates unusable dead space in implementation. Auto height preserves the visual intent while eliminating the gap
- **Files**: `HeroBanner.tsx`
