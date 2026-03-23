# Tasks: Homepage SAA

**Frame**: `2167-9026-Homepage-SAA`
**Prerequisites**: plan.md (required), spec.md (required), design-style.md (required)

---

## Task Format

```
- [ ] T### [P?] [Story?] Description | file/path.ts
```

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this belongs to (US1, US2, US3, US4, US5, US6, US7)
- **|**: File path affected by this task

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Install dependencies, download assets, configure fonts and design tokens, create types and middleware

- [x] T001 Install production dependency: `zod`. Run `yarn add zod` | package.json
- [x] T002 Install dev dependencies: `vitest`, `@vitejs/plugin-react`, `@testing-library/react`, `@testing-library/jest-dom`, `jsdom`, `msw`. Run `yarn add -D vitest @vitejs/plugin-react @testing-library/react @testing-library/jest-dom jsdom msw` | package.json
- [x] T003 Add test scripts to package.json: `"test": "vitest run"`, `"test:watch": "vitest"`, `"test:coverage": "vitest run --coverage"` | package.json
- [x] T004 Create Vitest configuration with jsdom environment, `@/` → `src/` path alias, and setup file for `@testing-library/jest-dom` matchers | vitest.config.ts
- [x] T005 Download Figma assets using `get_media_files` tool: hero banner → `public/images/hero-banner.webp`, 6 award thumbnails → `public/images/awards/{slug}.webp`, SAA logo → `public/images/logo-saa.svg`, "ROOT FURTHER" graphic → `public/images/root-further.webp`, widget button icons (pencil, SAA icon) → extract as SVG paths for Icon component | public/images/
- [x] T006 [P] Source custom font files and place in `public/fonts/`: Digital Numbers Regular (`.woff2`), SVN-Gotham (`.woff2`), Montserrat Alternates Bold (`.woff2`) | public/fonts/
- [x] T007 Replace Geist theme in globals.css with SAA design tokens via `@theme inline` block: 11 color tokens (`--color-page-bg: #00101A`, `--color-gold-primary: #FFEA9E`, `--color-header-bg: rgba(16,20,23,0.8)`, etc.), 16 typography tokens (font families for Digital Numbers, SVN-Gotham, Montserrat Alternates), 8 spacing tokens (`--spacing-page-padding-x: 144px`, `--spacing-section-gap: 120px`, etc.), layout tokens (`--max-w-page: 1512px`, `--max-w-content: 1224px`, `--max-w-content-narrow: 1152px`). Remove dark mode media query. | src/app/globals.css
- [x] T008 Update root layout: replace Geist/Geist_Mono with Montserrat via `next/font/google` (weights 400, 500, 700) + Digital Numbers, SVN-Gotham, Montserrat Alternates via `next/font/local`. Set CSS variables `--font-montserrat`, `--font-digital`, `--font-gotham`, `--font-montserrat-alt` on `<body>`. Update metadata: title "Sun* Annual Awards 2025", description. | src/app/layout.tsx
- [x] T009 [P] Add `NEXT_PUBLIC_EVENT_DATETIME` to env example with value `2025-12-26T18:30:00+07:00` | .env.example
- [x] T010 [P] Create Event type interface + `eventSchema` Zod schema. Fields: `id`, `name`, `theme`, `dateTime` (ISO-8601), `venue`, `livestreamInfo`, `heroBannerUrl` | src/types/event.ts
- [x] T011 [P] Create AwardCategory type interface + `awardCategorySchema` Zod schema. Fields: `id`, `name`, `slug`, `shortDescription`, `thumbnailUrl`, `order` | src/types/award.ts
- [x] T012 Create Next.js middleware entry point: import from existing `src/libs/supabase/middleware.ts` for session refresh, add security headers (`X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`), export matcher config excluding static assets | src/middleware.ts
- [x] T013 [P] Add `images.remotePatterns` for Supabase Storage domain in next config (future-proofing for image migration) | next.config.ts

**Checkpoint**: Project configured — dependencies installed, assets downloaded, fonts sourced, design tokens defined, types created, middleware set up.

---

## Phase 2: Foundation (Blocking Prerequisites)

**Purpose**: Database schema, seed data, and shared UI components required by ALL user stories

**CRITICAL**: No user story work can begin until this phase is complete

### Database

- [x] T014 Create database migration: `events` table (`id`, `name`, `theme`, `date_time`, `venue`, `livestream_info`, `hero_banner_url`) + `award_categories` table (`id`, `name`, `slug`, `short_description`, `thumbnail_url`, `order`). Enable RLS with public read policies on both tables. | supabase/migrations/00001_create_events_and_awards.sql
- [x] T015 Create seed data: SAA 2025 event (date: 2025-12-26T18:30:00+07:00, venue: Au Co Art Center, theme: ROOT FURTHER) + 6 award categories (Top Talent, Top Project, Top Project Leader, Best Manager, Signature 2025 - Creator, MVP) with slugs matching hash navigation spec (`top-talent`, `top-project`, `top-project-leader`, `best-manager`, `signature-2025-creator`, `mvp`) | supabase/seeds/common/001_seed_saa2025.sql

### Shared UI Components

- [x] T016 [P] Create Icon component: centralized inline SVG renderer. Props: `name` (union type of icon names), `size` (default 24), `className`. Icons: `arrow-right`, `bell`, `user`, `chevron-down`, `pencil`, `saa-logo`. Per design-style: "All icons MUST BE in Icon Component" | src/components/ui/Icon.tsx
- [x] T017 [P] Create Button component: variants `cta` (outlined↔filled hover), `outlined` (Kudos "Chi tiết"), `link` (card link style). Props: `variant`, `href` (renders `next/link` if provided), `children`, `className`. CTA hover: `transition: all 150ms ease-in-out`, normal = white border/text, hover = gold bg (#FFEA9E) / dark text (#00101A) with `border: 1px solid transparent`. Focus: `outline: 2px solid #FFEA9E; outline-offset: 2px` | src/components/ui/Button.tsx
- [x] T018 [P] Create date formatting utility for event date display (e.g., "26/12/2025" format) | src/utils/formatDate.ts

**Checkpoint**: Foundation ready — database schema, seed data, Icon, Button, and formatDate utilities are available. User story implementation can now begin.

---

## Phase 3: User Story 6 - Global Header Navigation (Priority: P2, but blocks all pages)

**Goal**: Shared Header component used on Homepage and Awards page. Sticky, translucent, with nav links, notification bell, language selector, and profile icon stubs.

**Independent Test**: Header renders with "About SAA 2025" highlighted as active link (gold + glow). Other nav items clickable. Logo links to `/`. Bell, language, profile render as stubs.

**Why before P1 stories**: Header is a shared layout component rendered on every page — it blocks page assembly in Phase 7.

### Frontend (US6)

- [x] T019 [US6] Create Header component (Client Component with `"use client"`). Sticky `top-0 z-50`, `backdrop-blur`, translucent bg `rgba(16,20,23,0.8)`, height 80px. Logo (left): `next/link` to `/`, if `usePathname() === "/"` click scrolls to top via `window.scrollTo({ top: 0, behavior: 'smooth' })` (FR-013). Nav links (center): "About SAA 2025", "Award Information", "Sun* Kudos" — `activeLink` prop highlights current page with gold text (#FFEA9E) + glow text-shadow (`0 4px 4px rgba(0,0,0,0.25), 0 0 6px #FAE287`). Controls (right): notification bell with red badge dot (static `hasNotifications` prop, click no-op stub), language selector ("VN" text + chevron-down icon, click no-op stub), profile icon 40x40px (click no-op stub). Responsive: `px-4` mobile, `sm:px-12` tablet, `lg:px-36` desktop. Dropdown implementations deferred. | src/components/shared/Header.tsx

**Checkpoint**: Header component complete — renders on all pages with activeLink highlighting and stub controls.

---

## Phase 4: User Story 1 - Countdown & Event Info (Priority: P1)

**Goal**: Hero section with cover image, gradient overlay, countdown timer (Days/Hours/Minutes), event details (date, venue, livestream), and CTA buttons.

**Independent Test**: Load homepage, verify hero banner displays with countdown updating per minute, event info shows date/venue/livestream in gold, and two CTA buttons navigate correctly.

### Frontend (US1)

- [x] T020 [P] [US1] Create `useCountdown` hook: reads `process.env.NEXT_PUBLIC_EVENT_DATETIME`, validates ISO-8601 format, returns `{ days, hours, minutes, isExpired, isValid }`. Uses `setInterval(60_000)` for per-minute updates. Zero-pads values. Cleans up on unmount. `isValid: false` when env var missing/invalid. | src/hooks/useCountdown.ts
- [x] T021 [P] [US1] Create CountdownTimer component (Client Component `"use client"`): uses `useCountdown` hook. If `!isValid` → renders nothing (Edge Case 1). If `isExpired` → hides "Coming soon" label, shows "00" for all values. Digital Numbers font for digits (49.15px), Montserrat Bold 24px for unit labels ("DAYS", "HOURS", "MINUTES"). Dark bg containers with 4px radius around digit pairs. `aria-live="polite"` + `aria-label="X days, Y hours, Z minutes until event"`. Responsive: ~32px digits on mobile. | src/components/homepage/CountdownTimer.tsx
- [x] T022 [P] [US1] Create EventInfo component (Server Component): props `{ date: string; venue: string; livestreamInfo: string }`. Labels in white 16px 700, values in gold (#FFEA9E) 24px 700. Format date using `formatDate` utility. | src/components/homepage/EventInfo.tsx
- [x] T023 [P] [US1] Create CTAButtons component: two `<Button variant="cta">` with `href="/awards"` ("ABOUT AWARDS") and `href="/kudos"` ("ABOUT KUDOS"). Each includes `<Icon name="arrow-right" />` after text. Responsive: `flex-col w-full` on mobile, `flex-row` on desktop. | src/components/homepage/CTAButtons.tsx
- [x] T024 [US1] Create HeroBanner component: cover image via `next/image` with `priority` (LCP element), `fill`, `sizes="100vw"`. CSS gradient overlay: `linear-gradient(12deg, #00101A 23.7%, rgba(0,18,29,0.46) 38.34%, rgba(0,19,32,0) 48.92%)`. Renders `<CountdownTimer>`, `<EventInfo>`, `<CTAButtons>` internally (not via children prop). Props: `{ event: Event | null }`. If `event === null` → render hero image + gradient + CountdownTimer but skip EventInfo. Responsive: `h-auto min-h-screen lg:h-[1392px]`, content stacks vertically on mobile. | src/components/homepage/HeroBanner.tsx

**Checkpoint**: Hero section complete — countdown works, event info displays, CTA buttons navigate to `/awards` and `/kudos`.

---

## Phase 5: User Story 2 - Awards Overview (Priority: P1)

**Goal**: Awards section with title, description, and 6-card responsive grid. Each card links to `/awards#{slug}`.

**Independent Test**: Scroll to awards section, verify 6 cards display with images, gold titles, 2-line descriptions, "Chi tiết →" links. Click a card → navigates to `/awards#top-talent`.

### Backend (US2)

- [x] T025 [P] [US2] Create GET /api/awards route handler: query `award_categories` ordered by `order` via Supabase server SDK, validate with Zod `awardCategorySchema`, return JSON array. Error: return 500 with generic message. | src/app/api/awards/route.ts
- [x] T026 [P] [US2] Create GET /api/event route handler: query `events` for current/latest event via Supabase server SDK, validate with Zod `eventSchema`, return JSON. Error: return 500 with generic message. | src/app/api/event/route.ts

### Frontend (US2)

- [x] T027 [P] [US2] Create AwardCard component: props `{ award: AwardCategory }`. Entire card wrapped in `next/link` to `/awards#{award.slug}` (FR-006). Image: `next/image`, square aspect ratio with glow ring. Title: `<h3>`, 24px Montserrat weight 400, gold (#FFEA9E). Description: 16px, white, `line-clamp-2` (FR-011). "Chi tiết →": 16px Montserrat 500, white text + `<Icon name="arrow-right" />` — visual only, NOT a nested `<a>`. Hover: `translateY(-2px)`, `transition: transform 150ms ease`. Focus: `outline: 2px solid #FFEA9E; outline-offset: 2px` on card Link wrapper. | src/components/homepage/AwardCard.tsx
- [x] T028 [P] [US2] Create AwardGrid component: `grid grid-cols-2 lg:grid-cols-3 gap-6` (mobile-first). Maps awards data to `<AwardCard>` components. | src/components/homepage/AwardGrid.tsx
- [x] T029 [US2] Create AwardsOverview component: props `{ awards: AwardCategory[] | null }`. If `awards === null` → render section header + 6 skeleton cards (`animate-pulse`) in same grid layout (Edge Case 2). Section header: "Sun* annual awards 2025" subtitle (24px), "Hệ thống giải thưởng" title (57px gold `<h2>`), description text. Renders `<AwardGrid>` with awards data. Max-width `max-w-content` (1224px). | src/components/homepage/AwardsOverview.tsx

**Checkpoint**: Awards section complete — 6 cards render from data, skeleton fallback on failure, card clicks navigate with hash.

---

## Phase 6: User Stories 3, 4, 5, 7 - CTA Navigation, Root Further, Sun* Kudos, Widget Button (Priority: P1-P3)

**Goal**: Root Further content section, Sun* Kudos promo block, Footer, and floating widget button.

### US3 - CTA Navigation (P1)

**Independent Test**: CTA buttons already created in Phase 4. This story is satisfied by Phase 4 (T023) + Phase 7 page assembly with navigation verification.

*(No additional tasks — US3 is covered by CTAButtons in T023 and page assembly in T037.)*

### US4 - Root Further Content (P2)

**Independent Test**: Scroll past hero, verify "ROOT FURTHER" graphic, description paragraphs, and English quote "A tree with deep roots fears no storm" are visible.

- [x] T030 [P] [US4] Create RootFurtherContent component: large padded section. Desktop: `padding: 120px 104px`, tablet: `80px 48px`, mobile: `40px 24px`. `border-radius: 8px`, `max-w-content-narrow` (1152px), centered. Background: `--color-content-section-bg: rgba(0, 16, 26, 0.6)`. Flex column, `gap: 32px`, `align-items: center`. Content: "ROOT FURTHER" graphic via `next/image` from `public/images/root-further.webp` + description paragraphs (24px Montserrat Bold) + English quote (20px Montserrat Bold). v1: hardcoded Vietnamese text (FR-010), structured for future i18n. | src/components/homepage/RootFurtherContent.tsx

### US5 - Sun* Kudos Promo (P2)

**Independent Test**: Scroll to Kudos section, verify "Phong trào ghi nhận" label, "Sun* Kudos" title, "KUDOS" decorative text, and "Chi tiết" button navigates to `/kudos`.

- [x] T031 [P] [US5] Create SunKudosPromo shared component: props `{ className?: string }`. Layout: flex row, content left + "KUDOS" decorative text right. Elements: "Phong trào ghi nhận" label (16px), "Sun* Kudos" title (57px gold `<h2>`), "ĐIỂM MỚI CỦA SAA 2025" highlight label, description, `<Button variant="outlined" href="/kudos">Chi tiết</Button>`. "KUDOS" text: SVN-Gotham 96px, color #DBD1C1. Width: `max-w-content` (1224px). Responsive: stack vertically on mobile, hide "KUDOS" decorative text on small screens. | src/components/shared/SunKudosPromo.tsx

### US6 continued - Footer (P2)

- [x] T032 [P] [US6] Create Footer shared component (Server Component): logo (69x64px), 4 nav links via `next/link`: "About SAA 2025" → `/`, "Award Information" → `/awards`, "Sun* Kudos" → `/kudos`, "Tiêu chuẩn chung" → `#` (placeholder, target TBD). Copyright: "Bản quyền thuộc về Sun* (c) 2025" in Montserrat Alternates 16px Bold. Link hover: gold (#FFEA9E). Padding: `40px 90px`. No active link highlighting for v1 (Server Component simplicity). Responsive: stack vertically on mobile. | src/components/shared/Footer.tsx

### US7 - Widget Button (P3) — SUPERSEDED

> **SUPERSEDED**: `WidgetButton.tsx` has been deleted and replaced by global `FloatingActionButton` in root layout. See `.momorph/specs/313_9137-floating-action-button/tasks.md`.

- [x] T033 [P] [US7] ~~Create WidgetButton component~~ → Replaced by global `FloatingActionButton` (`src/components/shared/FloatingActionButton.tsx`). Old file deleted.

**Checkpoint**: All content components complete — Root Further, Sun* Kudos, Footer ready. FAB is now global (root layout).

---

## Phase 7: Page Assembly & Route Stubs

**Purpose**: Assemble all components into the homepage, create loading/error/not-found states, and add stub pages for navigation targets

### Homepage Assembly

- [x] T034 Implement Homepage page.tsx (Server Component): fetch event + awards via Supabase server SDK (`createClient()`). Awards fetch: try/catch → on failure pass `null` to AwardsOverview (Edge Case 2, NOT error.tsx). Event fetch: try/catch → on failure pass `null` to HeroBanner. Layout order: `<Header activeLink="about">` → `<HeroBanner event={event}>` (OUTSIDE `<main>`, full-bleed) → `<main>` with padding (`py-[--spacing-page-padding-y] px-4 sm:px-12 lg:px-36`) and `flex flex-col items-center gap-[--spacing-section-gap]`: `<RootFurtherContent>` → `<AwardsOverview awards={awards}>` → `<SunKudosPromo>` → `</main>` → `<Footer>` → `<WidgetButton>`. Semantic `<h1>`: "Sun* Annual Awards 2025" (visually hidden if hero text serves as title). Page bg: `--color-page-bg`. | src/app/page.tsx
- [x] T035 [P] Create loading.tsx: skeleton UI with hero placeholder + 6 award card skeletons in grid layout, `animate-pulse` | src/app/loading.tsx
- [x] T036 [P] Create error.tsx (Client Component `"use client"`): graceful error boundary with "Reset" button. Dark bg, gold text, SAA styling. Note: awards API failure handled by try/catch in page.tsx, NOT by error.tsx. | src/app/error.tsx
- [x] T037 [P] Create not-found.tsx: custom 404 page matching SAA design (dark bg, gold text, "Back to home" link via `next/link`). Per constitution: "Use `not-found.tsx` for route-level UX states" | src/app/not-found.tsx

### Route Stubs

- [x] T038 [P] Create Awards page stub: `<Header activeLink="awards">` + placeholder content "Awards System - Coming Soon" + `<Footer>`. Must handle URL hash fragments for future scroll-to-section. | src/app/awards/page.tsx
- [x] T039 [P] Create Kudos page stub: `<Header activeLink="kudos">` + placeholder content "Sun* Kudos - Coming Soon" + `<Footer>`. Navigation target for CTA and SunKudosPromo "Chi tiết" link. | src/app/kudos/page.tsx

### Navigation Verification

- [x] T040 Verify all navigation flows end-to-end: CTA "ABOUT AWARDS" → `/awards`, CTA "ABOUT KUDOS" → `/kudos`, award card "Chi tiết" → `/awards#top-talent` etc., header links navigate correctly, footer links navigate correctly, logo → `/` or scroll to top (FR-013). | src/app/page.tsx

**Checkpoint**: Homepage fully assembled and navigable. All routes functional.

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Accessibility, responsive verification, performance, and final quality checks

### Semantic HTML & Accessibility

- [x] T041 [P] Verify semantic heading hierarchy across all pages: `<h1>` = "Sun* Annual Awards 2025", `<h2>` = section titles ("Hệ thống giải thưởng", "Sun* Kudos"), `<h3>` = award card titles. Ensure `<nav>` for header/footer nav, `<main>` for content, `<header>`, `<footer>` for respective sections. Add `<section>` with `aria-labelledby` for major content blocks. | src/app/page.tsx, src/components/shared/Header.tsx, src/components/shared/Footer.tsx
- [x] T042 [P] Verify accessibility attributes: `aria-live="polite"` + `aria-label` on CountdownTimer, `aria-expanded` + `aria-haspopup="menu"` on WidgetButton, `aria-haspopup="true"` on header dropdown stubs, descriptive `alt` on award images and hero banner, `alt=""` on decorative images. Focus indicators: `outline: 2px solid #FFEA9E; outline-offset: 2px` on all interactive elements. | src/components/homepage/CountdownTimer.tsx, src/components/homepage/WidgetButton.tsx, src/components/shared/Header.tsx
- [x] T043 Verify keyboard navigation tab order: Header nav → CTA buttons → RootFurther links (if any) → Award cards (left-to-right, top-to-bottom) → Kudos "Chi tiết" → Footer links → Widget button. Enter/Space activates buttons and links. Card `focus-within` matches hover state. | All interactive components

### Responsive Verification

- [x] T044 Verify responsive rendering at all breakpoints: Mobile (< 640px): `px-4`, stacked CTAs, 2-col grid, reduced padding, ~32px countdown digits. Tablet (640-1023px): `sm:px-12`, 2-col grid, medium padding. Desktop (>= 1024px): `lg:px-36`, 3-col grid, full padding, full hero height. Award grid transitions smoothly at 1024px breakpoint (Edge Case 4). | All components

### Performance

- [x] T045 [P] Verify performance optimizations: hero banner `next/image` with `priority` prop (LCP), `placeholder="blur"` with `blurDataURL`. Award images: lazy loading (default). Font loading: `display: swap` on all custom fonts. Run `yarn build` to verify bundle. | src/components/homepage/HeroBanner.tsx, src/app/layout.tsx
- [x] T046 Verify Cloudflare Workers deploy succeeds: run `yarn deploy` and confirm no bundle size or runtime issues | package.json

**Checkpoint**: Homepage complete — accessible, responsive, performant, and deployable.

---

## Dependencies & Execution Order

### Phase Dependencies

```
Phase 1: Setup ──────────────────────────► No dependencies, start immediately
    │
    ▼
Phase 2: Foundation ─────────────────────► Depends on Phase 1 (deps, tokens, types)
    │
    ├──► Phase 3: Header (US6) ──────────► Depends on Phase 2 (Icon, Button)
    │       │
    │       ▼
    ├──► Phase 4: Hero + Countdown (US1) ► Depends on Phase 2 (Button, Icon, types)
    │
    ├──► Phase 5: Awards Overview (US2) ──► Depends on Phase 2 (DB, types, Icon, Button)
    │
    ├──► Phase 6: Extended Features ──────► Depends on Phase 2 (Button, Icon)
    │       │
    │       ├── US4 (Root Further) ───────► Independent
    │       ├── US5 (Sun* Kudos) ─────────► Depends on Button
    │       ├── US6 cont. (Footer) ───────► Independent
    │       └── US7 (Widget Button) ──────► Depends on Icon
    │
    ▼
Phase 7: Page Assembly ──────────────────► Depends on Phases 3-6 (all components)
    │
    ▼
Phase 8: Polish ─────────────────────────► Depends on Phase 7 (full page)
```

### Parallel Opportunities

**Within Phase 1**: T009, T010, T011, T013 can all run in parallel (after T001-T004)
**Within Phase 2**: T016, T017, T018 can all run in parallel
**Phases 3-6**: Can run in parallel once Phase 2 is complete:
  - T019 (Header) || T020+T021+T022+T023 (Hero components) || T025+T026+T027+T028 (Awards) || T030+T031+T032+T033 (Extended)
**Within Phase 7**: T035, T036, T037, T038, T039 can all run in parallel (after T034)
**Within Phase 8**: T041, T042, T045 can run in parallel

### Within Each User Story

1. Types/schemas before components (Phase 1 types → Phase 4+ components)
2. Hook before component that uses it (T020 useCountdown → T021 CountdownTimer)
3. Child components before parent (T021+T022+T023 → T024 HeroBanner)
4. API routes before page assembly (T025+T026 → T034 page.tsx)
5. All components before page assembly (Phases 3-6 → Phase 7)

---

## Implementation Strategy

### MVP First (Recommended)

1. Complete Phase 1 (Setup) + Phase 2 (Foundation)
2. Complete Phase 3 (Header) — needed for all pages
3. Complete Phase 4 (US1: Hero + Countdown) — the hero section is the homepage's primary visual
4. **STOP and VALIDATE**: Render homepage with just Header + HeroBanner, verify countdown works
5. Continue with remaining phases

### Incremental Delivery

1. **Setup + Foundation** (Phase 1-2): Project ready
2. **Header + Hero** (Phase 3-4): Homepage skeleton with hero section → Test → Deploy
3. **Awards Grid** (Phase 5): Add award cards → Test → Deploy
4. **Extended Features** (Phase 6): Root Further, Kudos promo, Footer, Widget → Test → Deploy
5. **Page Assembly** (Phase 7): Full homepage with all sections → Test → Deploy
6. **Polish** (Phase 8): Accessibility, responsive, performance → Final Deploy

---

## Bugfixes (2026-03-16)

Post-implementation bugfixes identified during visual QA against Figma design.

- [x] BF001 [US1] Add ROOT FURTHER hero logo (`MM_MEDIA_Root Further Logo`, Figma node `2788:12911`) to HeroBanner. Downloaded as `public/images/root-further-hero.png` (451x200px). Positioned as first element in hero content, left-aligned below header. | src/components/homepage/HeroBanner.tsx, public/images/root-further-hero.png
- [x] BF002 [US1] Fix CountdownTimer alignment: changed from `items-center` (center) to `items-start` (left-aligned) to match Figma design where "Coming soon" and countdown are left-aligned below the ROOT FURTHER hero logo. | src/components/homepage/CountdownTimer.tsx
- [x] BF003 [US4] Fix RootFurtherContent "ROOT FURTHER" graphic: was showing only "ROOT" (single image `root-further.png`). Added second image `root-further-bg.png` ("FURTHER") stacked vertically below to display full "ROOT FURTHER" text as per Figma (nodes `3204:10155` + `3204:10154`). | src/components/homepage/RootFurtherContent.tsx
- [x] BF004 [US1] Fix HeroBanner excessive empty space: changed from fixed `h-[1392px]` + `justify-end` to auto height with `pt-[120px]` (clears 80px sticky header + 40px gap) + `pb-24`. Eliminates ~700px dead space both above content (gap to header) and below content (gap to Root Further section). Background image still covers via `object-cover` + `fill`. | src/components/homepage/HeroBanner.tsx

---

## Notes

- Commit after each task or logical group (follow Conventional Commits: `feat(homepage): ...`)
- Run `yarn lint` and `yarn build` before moving to next phase
- Header, Footer, and SunKudosPromo are shared with Awards System page — implement once in `src/components/shared/`
- The `activeLink` prop on Header accepts `"about"` | `"awards"` | `"kudos"`
- HeroBanner is rendered OUTSIDE `<main>` — it's full-bleed (1512px), while `<main>` has padding
- Awards/event fetch failures use try/catch with null props → graceful fallback, NOT error.tsx
- Widget button menu content is TBD for v1 — just toggle `aria-expanded`
- Header dropdown panels deferred to Language/Profile/Admin dropdown specs
- Mark tasks complete as you go: `[x]`
- Update spec.md if requirements change during implementation
