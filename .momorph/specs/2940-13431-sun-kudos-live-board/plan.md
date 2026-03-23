# Implementation Plan: Sun* Kudos Live Board

**Frame**: `2940:13431-sun-kudos-live-board`
**Date**: 2026-03-11
**Spec**: `specs/2940-13431-sun-kudos-live-board/spec.md`

---

## Summary

The Kudos Live Board is the main recognition page for SAA 2025, featuring a hero banner, highlight carousel (top 5 kudos by hearts), interactive spotlight word cloud, infinite-scroll kudos feed, personal stats sidebar with secret box rewards, and a leaderboard. The implementation requires new database tables (kudos, likes, secret boxes, leaderboard), 12 API endpoints, and ~20 frontend components following the existing Next.js 15 App Router + Supabase + TailwindCSS patterns already established in the codebase.

---

## Technical Context

**Language/Framework**: TypeScript (strict) / Next.js 15 (App Router)
**Primary Dependencies**: React 19, TailwindCSS 4, Supabase (Auth + DB + Storage), Zod
**Database**: PostgreSQL via Supabase
**Testing**: Vitest + Testing Library + MSW (already configured)
**State Management**: Server Components (primary) + React state for interactive widgets
**API Style**: Next.js Route Handlers (REST)
**Deployment**: Cloudflare Workers via OpenNext

---

## Constitution Compliance Check

*GATE: Must pass before implementation can begin*

- [x] Follows project coding conventions (TypeScript strict, PascalCase components, `@/*` imports)
- [x] Uses approved libraries and patterns (Next.js App Router, Supabase, TailwindCSS, Zod)
- [x] Adheres to folder structure guidelines (`src/app/kudos/`, `src/components/kudos/`, `src/types/`)
- [x] Meets security requirements (Supabase RLS, server-side validation, no `dangerouslySetInnerHTML`)
- [x] Follows testing standards (Vitest + Testing Library, integration tests for happy path + errors)

**Additional compliance notes**:

| Constitution Rule | How This Plan Complies |
|-------------------|----------------------|
| TDD (Red-Green-Refactor) | Each phase writes tests first: API route tests before route implementation, component rendering tests before component code. MSW fixtures are set up in Phase 0 to enable test-first for Phase 1+. |
| No fixed pixel widths for containers | Design uses 680px/422px at desktop. Implementation uses `max-w-*` + `w-full` with responsive overrides: `lg:max-w-[680px]` for feed, `lg:max-w-[422px]` for sidebar. Mobile/tablet use full width. |
| Mobile-first responsive | Base styles target mobile. Larger breakpoints add complexity via `sm:` and `lg:` prefixes. |
| `next/image` for all images | All user avatars, sticker images, hero banner, and media thumbnails use `<Image>` with appropriate `sizes` prop. |

**Violations (if any)**:

| Violation | Justification | Alternative Rejected |
|-----------|---------------|---------------------|
| Word cloud may need canvas/SVG library | No existing word cloud primitives in project; SVG-based approach preferred for bundle size | Full canvas library (d3-cloud) too heavy for Cloudflare Workers |

---

## Architecture Decisions

### Frontend Approach

- **Component Structure**: Feature-based under `src/components/kudos/`. Split into Server Components (data fetching) and Client Components (interactive widgets).
- **Styling Strategy**: TailwindCSS 4 uses CSS-first configuration. Design tokens (colors, spacing, radii from design-style.md) are added via `@theme` block in `globals.css`, NOT in a `tailwind.config.ts` file. Existing CSS variables (e.g., `--color-page-bg`, `--color-gold-primary`) are reused; only missing tokens are added. Per constitution: use Tailwind utility classes with design tokens rather than arbitrary `bg-[#hex]` values.
- **Data Fetching**: Server Components for initial page load (kudos feed, highlights, stats, leaderboard, spotlight). Client-side fetching only for infinite scroll pagination and like/unlike mutations.
- **Server vs Client boundary**:
  - **Server Components**: `KudosLiveBoard` (page), `HighlightKudos`, `SpotlightBoard` (initial data), `AllKudosSection`, `StatsCard` (initial data), `LeaderboardCard`, `Footer` (reuse existing)
  - **Client Components**: `KudosCarousel` (slide state), `HeartButton` (optimistic UI), `CopyLinkButton` (clipboard API), `InfiniteScrollFeed` (pagination), `SpotlightInteractive` (pan/zoom/search), `SecretBoxButton` (dialog trigger), `FilterBar` (dropdown state)

### Backend Approach

- **API Design**: Next.js Route Handlers under `src/app/api/kudos/`. Follow existing pattern from `/api/awards` and `/api/event`.
- **Data Access**: Supabase client SDK with parameterized queries. RLS policies for all tables.
- **Validation**: Zod schemas for all API request/response types (following existing `eventSchema` / `awardCategorySchema` pattern).
- **Atomic Operations**: Like/unlike uses Supabase RPC (database function) to ensure atomicity for heart count + like record in a single transaction.

### Integration Points

- **Existing Services**:
  - `@/libs/supabase/server` and `@/libs/supabase/client` for data access
  - `@/components/shared/Header` (already has "Sun* Kudos" active link)
  - `@/components/shared/Footer` (reuse directly)
  - `@/components/ui/Icon` (extend with new icons: heart, copy-link, gift, arrow, pan-zoom)
  - `@/components/ui/Button` (reuse for CTA, extend variants if needed)
  - Supabase Auth session (already in middleware for `/kudos` route protection)
- **Shared Components to Reuse**: Header, Footer, Button, Icon, LanguageSelector
- **API Contracts**: Defined in spec.md (12 predicted endpoints)

---

## Project Structure

### Documentation (this feature)

```text
.momorph/specs/2940-13431-sun-kudos-live-board/
├── spec.md              # Feature specification
├── design-style.md      # Design specifications
├── plan.md              # This file
├── tasks.md             # Task breakdown (next step)
└── assets/
    └── frame.png        # Figma frame screenshot
```

### Source Code (affected areas)

```text
src/
├── app/
│   ├── kudos/
│   │   ├── page.tsx                    # MODIFY - Replace placeholder with full page
│   │   ├── loading.tsx                 # NEW - Skeleton loading state
│   │   └── error.tsx                   # NEW - Error boundary
│   ├── api/
│   │   ├── kudos/
│   │   │   ├── route.ts               # NEW - GET paginated feed
│   │   │   ├── highlights/
│   │   │   │   └── route.ts           # NEW - GET top 5 highlights
│   │   │   ├── [id]/
│   │   │   │   └── like/
│   │   │   │       └── route.ts       # NEW - POST like / DELETE unlike
│   │   │   └── spotlight/
│   │   │       └── route.ts           # NEW - GET word cloud data
│   │   ├── users/
│   │   │   ├── me/
│   │   │   │   ├── stats/
│   │   │   │   │   └── route.ts       # NEW - GET user stats
│   │   │   │   └── secret-box/
│   │   │   │       └── route.ts       # NEW - POST open secret box
│   │   │   ├── search/
│   │   │   │   └── route.ts           # NEW - GET search profiles
│   │   │   └── [id]/
│   │   │       └── profile-preview/
│   │   │           └── route.ts       # NEW - GET profile preview tooltip data
│   │   ├── leaderboard/
│   │   │   └── gifts/
│   │   │       └── route.ts           # NEW - GET top 10 gift recipients
│   │   ├── hashtags/
│   │   │   └── route.ts               # NEW - GET hashtags list
│   │   └── departments/
│   │       └── route.ts               # NEW - GET departments list
│   └── globals.css                     # MODIFY - Add kudos design tokens via @theme
├── components/
│   ├── kudos/
│   │   ├── HeroBanner.tsx              # NEW - Kudos hero with input + search pills
│   │   ├── KudosInputPill.tsx          # NEW - "Gui loi cam on" input trigger
│   │   ├── SearchPill.tsx              # NEW - "Tim kiem profile" search trigger
│   │   ├── SectionHeader.tsx           # NEW - Reusable section header (subtitle + title + divider)
│   │   ├── HighlightKudos.tsx          # NEW - Server Component wrapper for carousel section
│   │   ├── KudosCarousel.tsx           # NEW - Client: carousel with slide state
│   │   ├── HighlightCard.tsx           # NEW - Carousel card with "Xem chi tiet"
│   │   ├── FilterBar.tsx               # NEW - Client: hashtag + department filter dropdowns
│   │   ├── SpotlightBoard.tsx          # NEW - Server Component wrapper for word cloud
│   │   ├── SpotlightInteractive.tsx    # NEW - Client: pan/zoom/search interaction layer
│   │   ├── AllKudosSection.tsx         # NEW - Server Component for feed + sidebar layout
│   │   ├── InfiniteScrollFeed.tsx      # NEW - Client: infinite scroll pagination
│   │   ├── KudosCard.tsx               # NEW - Full kudos post card
│   │   ├── KudosCardHeader.tsx         # NEW - Sender -> Receiver info row
│   │   ├── UserInfo.tsx                # NEW - Avatar + name + badge block
│   │   ├── AwardBadge.tsx              # NEW - Star badge (10/20/50 kudos)
│   │   ├── CategoryLabel.tsx           # NEW - Category badge (e.g., "IDOL GIOI TRE") per FR-017
│   │   ├── QuoteBox.tsx                # NEW - Message content with gold bg
│   │   ├── MediaRow.tsx                # NEW - Image thumbnails + video play overlay
│   │   ├── HashtagList.tsx             # NEW - Clickable hashtag tags
│   │   ├── HeartButton.tsx             # NEW - Client: optimistic like/unlike
│   │   ├── CopyLinkButton.tsx          # NEW - Client: clipboard copy + toast
│   │   ├── ProfilePreviewTooltip.tsx   # NEW - Client: hover tooltip for user profile preview
│   │   ├── StatsCard.tsx               # NEW - Personal stats sidebar card
│   │   ├── SecretBoxButton.tsx         # NEW - Client: CTA with disabled state
│   │   └── LeaderboardCard.tsx         # NEW - Top 10 gift recipients sidebar
│   └── ui/
│       ├── Icon.tsx                    # MODIFY - Add new icon variants
│       └── Toast.tsx                   # NEW - Toast notification component
├── hooks/
│   ├── useKudosFeed.ts                 # NEW - Infinite scroll + filter state
│   ├── useLikeKudos.ts                 # NEW - Optimistic like/unlike mutation
│   └── useClipboard.ts                # NEW - Copy to clipboard + toast
├── types/
│   └── kudos.ts                        # NEW - All Kudos-related Zod schemas + types
└── utils/
    └── formatDate.ts                   # NEW - "HH:mm - MM/DD/YYYY" formatter

supabase/
└── migrations/
    └── 00002_create_kudos_tables.sql   # NEW - Kudos database schema

public/
└── images/
    └── kudos/
        ├── hero-banner.png             # NEW - Downloaded from Figma
        └── spotlight-bg.png            # NEW - Spotlight background image
```

### New Files Summary

| Category | Count | Key Files |
|----------|-------|-----------|
| Page / Route UI | 3 | `page.tsx`, `loading.tsx`, `error.tsx` |
| API Routes | 11 | 11 route handlers under `/api/` (including profile-preview) |
| Components | 25 | Feature components in `src/components/kudos/` (incl. CategoryLabel, ProfilePreviewTooltip) |
| UI Primitives | 1 new + 1 modify | `Toast.tsx` new, `Icon.tsx` extended |
| Hooks | 3 | `useKudosFeed`, `useLikeKudos`, `useClipboard` |
| Types | 1 | `kudos.ts` with all Zod schemas |
| Utils | 1 | `formatDate.ts` |
| Database | 1 | Migration file |
| Assets | 2+ | Hero banner, spotlight background |

### Modified Files

| File | Changes |
|------|---------|
| `src/app/kudos/page.tsx` | Replace placeholder with full Kudos Live Board page (Server Component using `searchParams` for filters) |
| `src/app/globals.css` | Add kudos design tokens via TailwindCSS 4 `@theme` block (new colors, spacing, radii not yet in globals) |
| `src/components/ui/Icon.tsx` | Add icon variants: heart, heart-filled, copy-link, gift, arrow-sent, pan-zoom, play |
| `next.config.ts` | Add external image domains for Google profile photos (e.g., `lh3.googleusercontent.com`) to `images.remotePatterns` |

### Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| (none) | - | No new dependencies needed. Word cloud will use inline SVG. Clipboard via navigator.clipboard API. |

**Note**: No new npm packages required. This keeps bundle size minimal per constitution (Cloudflare Workers constraint). The word cloud will be implemented with SVG text elements and CSS transforms rather than a heavy library like d3-cloud.

---

## Implementation Strategy

### Phase 0: Asset Preparation & Foundation

**Goal**: Set up database schema, types, design tokens, and download required assets.

1. **Database migration** (`00002_create_kudos_tables.sql`):
   - `profiles` table (extends Supabase auth.users with display_name, department, avatar_url, kudos_received_count)
   - `kudos` table (id, sender_id, receiver_id, content, hashtags[], images[], video_url, category, heart_count, created_at)
   - `kudos_likes` table (kudos_id, user_id, is_special_day, created_at) with unique constraint on (kudos_id, user_id)
   - `secret_boxes` table (user_id, total_count, opened_count)
   - `gift_recipients` table (user_id, gift_description, awarded_at) for leaderboard
   - `hashtags` table (id, name) for filter dropdown
   - `departments` table (id, name) for filter dropdown
   - `special_days` table (id, date DATE UNIQUE, multiplier INTEGER DEFAULT 2) — stores admin-configured special days for FR-004. Admin UI is out of scope but the table is needed for the `toggle_like` function to check multiplier.
   - RLS policies: authenticated read on all; authenticated insert/delete on kudos_likes (with sender exclusion check via `auth.uid() != kudos.sender_id`); authenticated update on secret_boxes for own record
   - Database functions: `toggle_like(kudos_id, user_id)` as atomic RPC — checks `special_days` table for current date, inserts/deletes like, updates `kudos.heart_count` and `profiles.hearts_received` in a single transaction
   - Indexes: `kudos(created_at DESC)`, `kudos_likes(kudos_id, user_id)` UNIQUE, `kudos(heart_count DESC)` for highlights, `profiles(display_name)` for search

2. **Seed data**: Create seed file at `supabase/seeds/common/002_seed_kudos.sql` (following existing `001_seed_saa2025.sql` pattern) with sample kudos, profiles, hashtags, departments, and a few special_days entries for development.

3. **Type definitions** (`src/types/kudos.ts`):
   - Zod schemas for: Kudos, KudosLike, UserStats, SpotlightEntry, LeaderboardEntry, Hashtag, Department, ProfilePreview
   - Request/response schemas for all API endpoints
   - Cursor pagination types

4. **Design tokens**: Update `globals.css` with missing kudos-specific variables. Tokens that already exist (e.g., `--color-page-bg`, `--color-gold-primary`, `--spacing-page-padding-x`) will be reused directly.

5. **Download Figma assets**: Hero banner background, spotlight background image via `get_media_files`.

6. **Extend Icon component**: Add heart, heart-filled, copy-link, gift, arrow-sent, pan-zoom, play icon variants.

7. **Create Toast component**: Reusable toast notification for copy link feedback and error messages.

8. **Create utility**: `formatDate.ts` for "HH:mm - MM/DD/YYYY" format.

### Phase 1: Core Feed (US1 - P1, US2 - P1)

**Goal**: Display kudos cards with like functionality. This is the highest-value vertical slice.

1. **API routes**:
   - `GET /api/kudos` - Paginated feed with cursor, hashtag, department filters
   - `POST /api/kudos/[id]/like` - Like a kudos (atomic via RPC)
   - `DELETE /api/kudos/[id]/like` - Unlike a kudos

2. **Components**:
   - `KudosCard` (Server-renderable structure)
   - `KudosCardHeader` (sender -> receiver with avatars, badges)
   - `UserInfo` + `AwardBadge`
   - `CategoryLabel` (category badge e.g., "IDOL GIOI TRE" per FR-017; renders conditionally when category is assigned)
   - `QuoteBox` (message content)
   - `MediaRow` (image thumbnails, video play overlay)
   - `HashtagList` (clickable tags — click navigates to `?hashtag=X` search param)
   - `HeartButton` (Client Component, optimistic UI)
   - `CopyLinkButton` (Client Component)

3. **Hooks**:
   - `useLikeKudos` - Optimistic like/unlike with rollback
   - `useClipboard` - Copy to clipboard + toast

4. **Page structure**:
   - `AllKudosSection` wrapping feed column + sidebar placeholder
   - `InfiniteScrollFeed` with cursor-based pagination via `useKudosFeed`

### Phase 2: Highlight Carousel (US3 - P1)

**Goal**: Top 5 kudos carousel with navigation.

1. **API route**: `GET /api/kudos/highlights` - Top 5 by heart count (with filter support)

2. **Components**:
   - `HighlightKudos` (Server Component: fetches data + renders section)
   - `KudosCarousel` (Client Component: slide state, arrows, page indicator)
   - `HighlightCard` (carousel card variant with "Xem chi tiet")
   - `SectionHeader` (reusable: subtitle + divider + title row)

3. **Carousel behavior**: CSS transform-based sliding, disabled arrows at boundaries, fade overlays for side cards.

4. **"Xem chi tiet" link**: Navigates to `/kudos/[id]` detail route. The detail page itself is out of scope for this feature but the link must be functional. Implement as `next/link` with the correct href so it's ready when the detail page is built.

### Phase 3: Hero Banner & Send Kudos Entry (US7 - P1)

**Goal**: Hero section with kudos input and search pills.

1. **Components**:
   - `HeroBanner` (background image + gradient + content)
   - `KudosInputPill` (click triggers submission dialog - dialog itself is out of scope)
   - `SearchPill` (search trigger - links to US11)

2. **Assets**: Download and optimize hero banner image.

### Phase 4: Filters (US4 - P2)

**Goal**: Hashtag and department filtering affecting both Highlight and All Kudos sections.

1. **API routes**:
   - `GET /api/hashtags` - Available hashtags
   - `GET /api/departments` - Available departments

2. **Components**:
   - `FilterBar` (Client Component: dropdown state, selection, AND logic)

3. **Filter state via URL search params** (architecture decision):
   - Filter state lives in URL search params (`?hashtag=X&department=Y`), NOT in React local state. This deviates from the spec's state table which shows `activeFilters` as local state — URL params are superior because:
     - The page (`KudosLiveBoard`) remains a **Server Component** and reads `searchParams` prop directly
     - Server Components (`HighlightKudos`, `AllKudosSection`) receive filter values as props from the page
     - `FilterBar` (Client Component) updates filters via `useRouter().push()` from `next/navigation` (NOT `next/router`) with new search params. Wrap in `useTransition()` to show pending state during Server Component re-render
     - Filtered views are shareable via URL and work with browser back/forward
   - Clicking a hashtag on any kudos card also navigates via search params (same mechanism as FilterBar)

### Phase 5: Sidebar - Stats & Leaderboard (US5 - P2, US9 - P3)

**Goal**: Personal stats card with secret box CTA and gift recipients leaderboard.

1. **API routes**:
   - `GET /api/users/me/stats` - Current user's stats
   - `POST /api/users/me/secret-box` - Open a secret box
   - `GET /api/leaderboard/gifts` - Top 10 gift recipients

2. **Components**:
   - `StatsCard` (Server Component initial render, Client for CTA)
   - `SecretBoxButton` (Client: disabled when 0 boxes, triggers dialog)
   - `LeaderboardCard` (Server Component with scrollable list)

3. **Sidebar layout**: Fixed-position sidebar that scrolls independently (CSS `position: sticky; top: X; overflow-y: auto; max-height: calc(100vh - X)`).

### Phase 6: Spotlight Word Cloud (US6 - P2)

**Goal**: Interactive word cloud visualization.

1. **API route**: `GET /api/kudos/spotlight` - Recipient names + kudos counts

2. **Components**:
   - `SpotlightBoard` (Server Component: container + initial data)
   - `SpotlightInteractive` (Client Component: pan/zoom toggle, search highlight, hover tooltips)

3. **Implementation**: SVG-based word cloud with:
   - Text elements positioned with randomized coordinates
   - Font size mapped to kudos count (6.66px - 11.34px range)
   - Opacity mapped to relative count (0.1 - 1.0)
   - Search highlighting via CSS class toggle
   - Pan/zoom via CSS `transform` with pointer events

### Phase 7: Search & Profile Preview (US11 - P3)

**Goal**: Sunner profile search and hover previews.

1. **API routes**:
   - `GET /api/users/search` - Search profiles by name (query: `q`, max 100 chars)
   - `GET /api/users/[id]/profile-preview` - Profile tooltip data (name, department, avatar, kudos count)

2. **Components**:
   - `ProfilePreviewTooltip` (Client Component: fetches on hover, shows avatar + name + department + kudos count. Used on `UserInfo` throughout feed cards, carousel cards, and leaderboard rows. Linked frame: 721:5827.)
   - `SearchPill` behavior: debounced input (300ms), max 100 chars, dropdown results list

3. **Integration**: `ProfilePreviewTooltip` wraps `UserInfo` in all locations: `KudosCardHeader`, `LeaderboardCard` rows. On hover, it fetches `/api/users/[id]/profile-preview` and displays a positioned tooltip. On click, navigates to `/profile/[id]` (profile page is out of scope but link must work).

### Phase 8: Polish & Responsiveness

**Goal**: Loading states, error handling, accessibility, responsive layout, edge cases.

1. **Loading states**: `loading.tsx` skeleton, infinite scroll skeleton, optimistic UI for likes.
2. **Error states**: `error.tsx` with retry, inline feed error, toast for mutation errors.
3. **Session expiry**: API routes return 401 when session is invalid. Client-side: detect 401 responses and redirect to `/login?redirect=/kudos` (consistent with middleware behavior). Server-side: Supabase auth check in Server Components redirects via `redirect()`.
4. **Accessibility**: Tab order per spec (Nav -> Input pill -> Search pill -> Filters -> Carousel -> Feed cards -> Sidebar -> Footer). ARIA labels on all icon-only buttons. `aria-live="polite"` on heart count, carousel indicator, toast. Skip-to-content link. Carousel `role="region"` with `aria-roledescription="carousel"`.
5. **Responsive**: Mobile-first approach per constitution. Base styles target mobile, `sm:` for tablet, `lg:` for desktop. Key changes per design-style.md responsive specs (hamburger nav, stacked layout, reduced padding, single-card carousel).
6. **Notification bell**: Red dot indicator when unread notifications exist (FR-020). Extend existing Header component's bell icon with conditional red dot overlay.
7. **`next.config.ts`**: Add Google profile photo domains to `images.remotePatterns` for `next/image` support.
8. **Performance audit**: Run Lighthouse on desktop to verify TR-001 (score >= 80). Key optimizations: hero banner with `priority` prop (LCP), lazy-loaded images below fold, Server Components for initial data (no client JS for static sections), minimal Client Component boundaries.
9. **Stale data handling**: API routes return 404 for deleted kudos. Client-side: if a kudos card's heart/copy action returns 404, show inline "Kudos not found" message and fade the card (spec edge case: "Kudos deleted while viewing").

---

## Figma Media Assets

The following unique assets need to be downloaded from Figma during Phase 0:

| Asset | Figma Node ID | Type | Target Path |
|-------|---------------|------|-------------|
| Hero banner background | I2940:13432;2167:5141 | PNG | `public/images/kudos/hero-banner.png` |
| KUDOS logo (hero) | 2940:13440 | SVG | Add to `Icon.tsx` or inline SVG |
| Pen/edit icon | I2940:13449;186:2759 | SVG | Add to `Icon.tsx` |
| Search icon | I2940:13450;186:2759 | SVG | Already exists in `Icon.tsx` |
| Chevron left (carousel) | I2940:13468;186:1420 | SVG | Add to `Icon.tsx` |
| Chevron right (carousel) | I2940:13470;186:1420 | SVG | Add to `Icon.tsx` |
| Arrow (sent) | I3127:21871;256:5147 | SVG | Add to `Icon.tsx` |
| Heart icon | I3127:21871;256:5171 | SVG | Add to `Icon.tsx` |
| Copy link icon | I3127:21871;256:5216;186:1441 | SVG | Add to `Icon.tsx` |
| Gift/box icon | I2940:13497;186:1766 | SVG | Add to `Icon.tsx` |
| Spotlight background | (from Spotlight Board) | PNG | `public/images/kudos/spotlight-bg.png` |
| Footer logo | I2940:13522;342:1408;178:1030 | PNG | Already exists (reuse) |

---

## Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Word cloud performance with 100+ names | Medium | Medium | Use SVG with virtualization; limit visible nodes; debounce search |
| Carousel animation jank on mobile | Low | Medium | Use CSS transforms (GPU-accelerated); `will-change: transform` |
| Like race conditions (double-click) | Medium | High | Atomic DB function via RPC; client-side `isLiking` lock per kudos ID |
| Bundle size exceeding Cloudflare limits | Low | High | No new dependencies; tree-shake; monitor with `next build` analyzer |
| Infinite scroll memory leak | Medium | Medium | Virtualize feed if > 100 cards; use IntersectionObserver cleanup |
| Supabase RLS performance with complex queries | Low | Medium | Add proper indexes; use views for computed fields (heart_count) |
| Hero banner image size | Low | Low | Optimize with Next.js `<Image>`; serve WebP; set priority for LCP |

### Estimated Complexity

- **Frontend**: High (25 new components, carousel animation, word cloud, infinite scroll, optimistic UI)
- **Backend**: Medium (11 API route files / 12 endpoints, 1 DB migration, RPC function for atomic likes)
- **Testing**: Medium (Integration tests for feed, like/unlike, filters; unit tests for formatDate, hooks)

---

## Integration Testing Strategy

### Test Scope

- [x] **Component/Module interactions**: Feed + filters, carousel + highlights API, heart button + like API
- [x] **External dependencies**: Supabase (mocked via MSW)
- [x] **Data layer**: Cursor pagination, filter combinations, like atomicity
- [x] **User workflows**: Browse feed -> like kudos -> filter by hashtag -> view carousel

### Test Categories

| Category | Applicable? | Key Scenarios |
|----------|-------------|---------------|
| UI <-> Logic | Yes | Feed renders cards from API, heart toggle updates count, filter changes re-fetch |
| Service <-> Service | Yes | Like API calls Supabase RPC, stats depend on likes/kudos data |
| App <-> External API | Yes | All Supabase queries mocked via MSW |
| App <-> Data Layer | Yes | Cursor pagination, filter AND logic, RLS enforcement |
| Cross-platform | Yes | Responsive layout at 3 breakpoints |

### Test Environment

- **Environment type**: Local (Vitest + jsdom/happy-dom)
- **Test data strategy**: MSW handlers returning fixture data; factory functions for kudos/user objects
- **Isolation approach**: Fresh MSW handlers per test; `beforeEach` reset

### Mocking Strategy

| Dependency Type | Strategy | Rationale |
|-----------------|----------|-----------|
| Supabase client | Mock via MSW | Constitution: mock external services at boundary |
| Supabase Auth | Mock session | Test authenticated vs unauthenticated states |
| Clipboard API | Mock `navigator.clipboard` | Not available in jsdom |
| IntersectionObserver | Mock | Not available in jsdom; needed for infinite scroll |

### Test Scenarios Outline

1. **Happy Path**
   - [ ] Page loads and displays kudos cards with correct data
   - [ ] Infinite scroll loads next page on scroll
   - [ ] Heart click increments count and shows red icon
   - [ ] Heart click on already-liked kudos decrements count
   - [ ] Carousel displays 5 cards, arrows navigate correctly
   - [ ] Filter by hashtag updates both carousel and feed
   - [ ] Copy link copies URL and shows toast
   - [ ] Stats card shows correct values for authenticated user

2. **Error Handling**
   - [ ] Feed API failure shows inline retry message
   - [ ] Like API failure reverts optimistic UI and shows error toast
   - [ ] Page-level error shows error.tsx with retry button
   - [ ] Network timeout shows appropriate error state

3. **Edge Cases**
   - [ ] Empty feed shows "Hien tai chua co Kudos nao." message
   - [ ] Sender cannot like own kudos (button disabled)
   - [ ] Secret box button disabled when 0 boxes
   - [ ] Both filters active use AND logic
   - [ ] Carousel arrows disabled at boundaries (page 1 and 5)
   - [ ] Kudos content truncation (3 lines carousel, 5 lines feed)

### Tooling & Framework

- **Test framework**: Vitest + @testing-library/react (already configured)
- **Supporting tools**: MSW for API mocking (already in devDependencies)
- **CI integration**: `yarn test` in pre-deployment checks

### Coverage Goals

| Area | Target | Priority |
|------|--------|----------|
| Core user flows (feed, like, filter) | 90%+ | High |
| API route handlers | 85%+ | High |
| Component rendering | 80%+ | Medium |
| Edge cases & error states | 75%+ | Medium |
| Utility functions | 100% | Low |

---

## Dependencies & Prerequisites

### Required Before Start

- [x] `constitution.md` reviewed and understood
- [x] `spec.md` approved (3 review passes completed)
- [x] `design-style.md` approved (3 review passes completed)
- [ ] Database migration planned (Phase 0 of this plan)
- [ ] Seed data prepared (Phase 0 of this plan)

### External Dependencies

- Supabase project (already configured and running)
- Google OAuth (already configured for auth)
- Figma media assets (downloadable via MoMorph tools)

---

## Next Steps

After plan approval (3 review passes completed):

1. **Run** `/momorph.tasks` to generate task breakdown from this plan
2. **Review** tasks.md for parallelization opportunities
3. **Begin** implementation following task order (Phase 0 first)

---

## Notes

- The existing `src/app/kudos/page.tsx` is a placeholder that will be completely replaced.
- Header and Footer components are already implemented and will be reused directly.
- The middleware already protects `/kudos` routes, so no auth changes are needed.
- Several CSS variables from design-style.md already exist in `globals.css` (e.g., `--color-page-bg`, `--color-gold-primary`, `--spacing-page-padding-x`). Only missing tokens need to be added.
- The `Icon.tsx` component already supports `bell`, `chevron-down`, `pencil`, `arrow-right`, `saa-logo`. New icon variants will follow the same SVG inline pattern.
- URL search params strategy for filters enables server-side rendering of filtered results and shareable filtered views. This deviates from the spec's state management table which shows `activeFilters` as local state — URL params are the correct approach for Server Component compatibility.
- No BACKEND_API_TESTCASES.md was found. API test cases should be generated after plan approval.
- Word cloud uses SVG rather than canvas to maintain SSR compatibility and avoid Cloudflare Workers issues with canvas polyfills.
- The `profiles` table extends Supabase `auth.users` rather than duplicating user data; it uses `auth.uid()` as foreign key for RLS.
- The `special_days` table is created in this migration even though admin UI is out of scope, because the `toggle_like` RPC function needs it to determine the heart multiplier.
- `next.config.ts` must be updated to allow Google avatar domains (`lh3.googleusercontent.com`) for `next/image` optimization.
- TailwindCSS 4 uses CSS-first config via `@theme` in `globals.css`. There is no `tailwind.config.ts` to modify.
- "Xem chi tiet" on carousel cards links to `/kudos/[id]`. The detail page is out of scope but the route must be valid.
