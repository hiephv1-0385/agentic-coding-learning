# Tasks: Sun* Kudos Live Board

**Frame**: `2940:13431-sun-kudos-live-board`
**Prerequisites**: plan.md (reviewed x3), spec.md (reviewed x3), design-style.md (reviewed x3)

---

## Task Format

```
- [ ] T### [P?] [Story?] Description | file/path.ts
```

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this belongs to (US1, US2, etc.)
- **|**: File path affected by this task

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Download assets, extend shared UI primitives, create utility functions

- [x] T001 Download hero banner background image from Figma (node I2940:13432;2167:5141) to `public/images/kudos/hero-banner.png` using `get_media_files`
- [x] T002 Download spotlight background image from Figma (Spotlight Board section) to `public/images/kudos/spotlight-bg.png` using `get_media_files`
- [x] T003 Download all SVG icons from Figma (KUDOS logo 2940:13440, pen I2940:13449;186:2759, chevron-left I2940:13468;186:1420, chevron-right I2940:13470;186:1420, arrow-sent I3127:21871;256:5147, heart I3127:21871;256:5171, copy-link I3127:21871;256:5216;186:1441, gift I2940:13497;186:1766) using `get_media_files`
- [x] T004 Extend Icon component with new icon variants (heart, heart-filled, copy-link, gift, arrow-sent, chevron-left, chevron-right, pan-zoom, play, kudos-logo) | `src/components/ui/Icon.tsx`
- [x] T005 [P] Create Toast notification component (show/hide with 300ms fade, position bottom-center, auto-dismiss after 3s) | `src/components/ui/Toast.tsx`
- [x] T006 [P] Create formatDate utility function for "HH:mm - MM/DD/YYYY" format (FR-012) | `src/utils/formatDate.ts`

---

## Phase 2: Foundation (Blocking Prerequisites)

**Purpose**: Database schema, type definitions, design tokens, seed data. ALL user stories depend on this phase.

**CRITICAL**: No user story work can begin until this phase is complete.

- [x] T007 Create database migration with tables: `profiles` (extends auth.users), `kudos` (with heart_count), `kudos_likes` (unique kudos_id+user_id), `secret_boxes`, `gift_recipients`, `hashtags`, `departments`, `special_days`. Add RLS policies (authenticated read all; insert/delete on kudos_likes with sender exclusion; update own secret_boxes). Create `toggle_like(kudos_id, user_id)` RPC function (checks special_days, atomic insert/delete + heart_count update). Add indexes on `kudos(created_at DESC)`, `kudos_likes(kudos_id, user_id) UNIQUE`, `kudos(heart_count DESC)`, `profiles(display_name)` | `supabase/migrations/00002_create_kudos_tables.sql`
- [x] T008 Create seed data file with sample profiles, kudos (with various hashtags/images/videos), kudos_likes, hashtags, departments, secret_boxes, gift_recipients, and special_days entries for development | `supabase/seeds/common/002_seed_kudos.sql`
- [x] T009 Create Zod schemas and TypeScript types: `kudosSchema`, `kudosLikeSchema`, `userStatsSchema`, `spotlightEntrySchema`, `leaderboardEntrySchema`, `hashtagSchema`, `departmentSchema`, `profilePreviewSchema`. Add request/response schemas for all 12 API endpoints. Add cursor pagination types (`CursorPaginationParams`, `CursorPaginatedResponse`) | `src/types/kudos.ts`
- [x] T010 Add kudos-specific design tokens to TailwindCSS 4 `@theme` block. Only add tokens NOT already in globals.css. Tokens to add: `--color-container-dark: #00070C`, `--color-card-bg: #FFF8E1`, `--color-gold-10: rgba(255,234,158,0.10)`, `--color-gold-40: rgba(255,234,158,0.40)`, `--color-border: #998C5F`, `--color-text-gray: #999`, `--color-text-dark: #00101A`, `--color-divider: #2E3940`, `--color-red: #D4271D`, `--color-red-light: #F17676`, `--color-badge-bg: #FFF3C6`, `--radius-kudos-card: 24px`, `--radius-carousel-card: 16px`, `--radius-sidebar-card: 17px`, `--radius-spotlight: 47px`, `--radius-pill: 68px`, `--radius-quote-box: 12px`, `--radius-badge-pill: 48px` (and any other missing tokens from design-style.md). Reuse existing tokens: `--color-page-bg`, `--color-gold-primary`, `--spacing-page-padding-x` | `src/app/globals.css`
- [x] T011 Add Google profile photo domain (`lh3.googleusercontent.com`) to `images.remotePatterns` for `next/image` optimization | `next.config.ts`

**Checkpoint**: Foundation ready - database deployed, types defined, tokens available. User story implementation can now begin.

---

## Phase 3: User Story 1 - Browse All Kudos Feed (Priority: P1) MVP

**Goal**: Display infinite-scroll kudos feed with cards showing sender/receiver info, message, images, hashtags, and heart count.

**Independent Test**: Load `/kudos` page and verify kudos cards render with correct data. Scroll to bottom and verify more cards load. Verify empty state when no kudos exist.

### Backend (US1)

- [x] T012 [US1] Create GET `/api/kudos` route handler with cursor-based pagination (query params: `cursor`, `limit`, `hashtag`, `department`). Validate with Zod. Return paginated kudos with sender/receiver profiles, heart count, user's like status. Use Supabase server client | `src/app/api/kudos/route.ts`

### Frontend (US1)

- [x] T013 [P] [US1] Create SectionHeader component (reusable: subtitle text + divider line + title row with optional right-side content). Props: subtitle, title, children (for filter buttons etc.) Per design-style.md: subtitle 700 24px white, divider 1px #2E3940, title 700 57px gold | `src/components/kudos/SectionHeader.tsx`
- [x] T014 [P] [US1] Create UserInfo component (avatar 64x64 circle with 1.87px white border + name 700 16px + department text). Props: avatarUrl, name, department, size. Use `next/image` for avatar with alt="{name} profile photo" | `src/components/kudos/UserInfo.tsx`
- [x] T015 [P] [US1] Create AwardBadge component (star badge pill: 1 star=10 kudos, 2 stars=20, 3 stars=50 per FR-009). Props: kudosReceivedCount. Rounded-full, border 0.5px gold, bg #FFF3C6 | `src/components/kudos/AwardBadge.tsx`
- [x] T016 [P] [US1] Create CategoryLabel component (category badge e.g. "IDOL GIOI TRE" per FR-017). Props: category. Render conditionally when category is assigned. Font 700 16px #00101A | `src/components/kudos/CategoryLabel.tsx`
- [x] T017 [P] [US1] Create QuoteBox component (message content with gold-40% bg, 1px gold border, 12px radius, padding 16px 24px). Props: content, maxLines (3 or 5). Text 700 20px/32px #00101A, text-align justify, overflow ellipsis truncation | `src/components/kudos/QuoteBox.tsx`
- [x] T018 [P] [US1] Create MediaRow component (flex row of image thumbnails max 5, gap 16px, each 88x88 with 18px radius and 1px #998C5F border. Video thumbnails get play icon overlay 30x30. Use `next/image` with lazy loading per TR-006). Props: images[], videoUrl | `src/components/kudos/MediaRow.tsx`
- [x] T019 [P] [US1] Create HashtagList component (flex row of clickable hashtag tags, max 5 per line, font 700 16px #D4271D. Click navigates to `?hashtag=X` search param per FR-015). Props: hashtags[] | `src/components/kudos/HashtagList.tsx`
- [x] T020 [P] [US1] Create KudosCardHeader component (flex row: SenderInfo -> ArrowIcon 32x32 -> ReceiverInfo, gap 24px, justify space-between). Props: sender, receiver. Compose UserInfo + AwardBadge | `src/components/kudos/KudosCardHeader.tsx`
- [x] T021 [US1] Create KudosCard component (full post card: KudosCardHeader + timestamp 700 14px #999 + divider 1px gold + QuoteBox + MediaRow + HashtagList + action bar with HeartButton + CopyLinkButton. Card: bg #FFF8E1, padding 40px 40px 16px, radius 24px, gap 16px. Feed cards: 5-line truncation per FR-013. Use formatDate for timestamp) | `src/components/kudos/KudosCard.tsx`
- [x] T022 [US1] Create useKudosFeed hook (cursor-based infinite scroll pagination via `GET /api/kudos`. Manages: pages array, hasMore, isLoading, error. Uses IntersectionObserver for scroll trigger. Accepts hashtag/department filter params from URL. Cleanup observer on unmount) | `src/hooks/useKudosFeed.ts`
- [x] T023 [US1] Create InfiniteScrollFeed client component ("use client". Renders KudosCard list from useKudosFeed. Shows skeleton card at bottom while loading. Shows "Hien tai chua co Kudos nao." empty state. Shows "Failed to load. Tap to retry." on error. Announces "Loading more kudos" / "No more kudos to load" to screen readers via aria-live) | `src/components/kudos/InfiniteScrollFeed.tsx`
- [x] T024 [US1] Create AllKudosSection server component (flex row layout: InfiniteScrollFeed column `lg:flex-1 lg:min-w-0` + 80px gap + sidebar `lg:w-[422px] lg:flex-shrink-0`. Feed stretches to fill remaining space; sidebar stays fixed width. This ensures left/right edges align with other full-width sections like SpotlightBoard. Mobile/tablet: stack vertically. Reads searchParams for initial data fetch, passes to children) | `src/components/kudos/AllKudosSection.tsx`
- [x] T025 [US1] Update page.tsx: Replace placeholder with Server Component page. Import Header (activeLink="kudos"), SectionHeader for "ALL KUDOS", AllKudosSection. Read `searchParams` prop for hashtag/department filters. Pass filter values to AllKudosSection. Keep Footer | `src/app/kudos/page.tsx`

**Checkpoint**: User Story 1 complete - kudos feed displays with cards, infinite scroll works, empty state handled.

---

## Phase 4: User Story 2 - Like (Heart) a Kudos Post (Priority: P1) MVP

**Goal**: Users can like/unlike kudos with optimistic UI. Sender cannot like own kudos. Special day doubles hearts.

**Independent Test**: Click heart on a card - count increments and icon turns red. Click again - reverts. Verify sender's heart is disabled. Verify API atomicity.

### Backend (US2)

- [x] T026 [US2] Create POST/DELETE `/api/kudos/[id]/like` route handler. POST: call `toggle_like` RPC, return updated heart count. DELETE: call `toggle_like` RPC, return updated heart count. Validate kudos_id param with Zod. Return 403 if user is sender. Return 404 if kudos not found. Use Supabase server client | `src/app/api/kudos/[id]/like/route.ts`

### Frontend (US2)

- [x] T027 [P] [US2] Create useLikeKudos hook ("use client". Optimistic like/unlike with rollback on error. Manages `isLiking` Map per kudos ID to prevent double-click. Calls POST/DELETE `/api/kudos/[id]/like`. On success: update heart count. On error: revert count, show error toast. Sender exclusion check via currentUserId prop) | `src/hooks/useLikeKudos.ts`
- [x] T028 [US2] Create HeartButton client component ("use client". Props: kudosId, senderId, initialCount, initialIsLiked. Uses useLikeKudos hook. States per design-style.md: default gray heart, liked red heart #D4271D, hover scale 1.1, disabled opacity 0.4 cursor-not-allowed for own kudos. Heart icon 32x32, count 700 24px #00101A. ARIA label "Like this kudos" / "Unlike this kudos". aria-live="polite" on count) | `src/components/kudos/HeartButton.tsx`
- [x] T029 [P] [US2] Create useClipboard hook (copy text to navigator.clipboard, show Toast on success "Link copied -- ready to share!", handle error with fallback toast) | `src/hooks/useClipboard.ts`
- [x] T030 [US2] Create CopyLinkButton client component ("use client". Props: kudosId. Uses useClipboard to copy `/kudos/{id}` URL. States: default #00101A, hover opacity 0.7. Icon 24x24 copy-link + text "Copy Link" 700 16px. Padding 16px, gap 4px, radius 4px) | `src/components/kudos/CopyLinkButton.tsx`
- [x] T031 [US2] Integrate HeartButton and CopyLinkButton into KudosCard action bar (flex row, gap 24px, justify space-between). Pass currentUserId from session to HeartButton for sender exclusion | `src/components/kudos/KudosCard.tsx`

**Checkpoint**: User Story 2 complete - like/unlike works with optimistic UI, sender excluded, copy link functional.

---

## Phase 5: User Story 3 - View Highlight Kudos Carousel (Priority: P1) MVP

**Goal**: Top 5 kudos by heart count in a carousel with navigation arrows and "Xem chi tiet" link.

**Independent Test**: Page loads carousel with top 5 cards. Arrows navigate slides. Previous disabled at page 1, next disabled at page 5. "Xem chi tiet" links to `/kudos/[id]`.

### Backend (US3)

- [x] T032 [US3] Create GET `/api/kudos/highlights` route handler. Return top 5 kudos by heart_count descending. Support hashtag/department filter query params. Include sender/receiver profiles. Validate with Zod | `src/app/api/kudos/highlights/route.ts`

### Frontend (US3)

- [x] T033 [P] [US3] Create HighlightCard component (carousel card variant: 528px width, padding 24px 24px 16px, bg #FFF8E1, border 4px gold, radius 16px, gap 16px. Includes KudosCardHeader, QuoteBox with 3-line truncation, HashtagList, HeartButton, CopyLinkButton, and "Xem chi tiet" link via `next/link` to `/kudos/[id]` per FR-021. Active card: full opacity. Inactive: opacity 0.5, smaller scale) | `src/components/kudos/HighlightCard.tsx`
- [x] T034 [US3] Create KudosCarousel client component ("use client". State: carouselPage (1-5). Renders HighlightCard array with CSS transform-based sliding (300ms ease-in-out, GPU-accelerated `will-change: transform`). Fade overlays: left gradient 90deg, right gradient 270deg per design-style.md. Center card highlighted, side cards dimmed. `role="region"` `aria-label="Highlight Kudos"` `aria-roledescription="carousel"`) | `src/components/kudos/KudosCarousel.tsx`
- [x] T035 [US3] Add carousel navigation to KudosCarousel: arrow buttons 48x48 with states (default, hover opacity 0.7, disabled opacity 0.3 cursor-not-allowed at boundaries, focus outline 2px gold). Page indicator "2/5" font 700 28px #999. Gap 32px between arrows and indicator. Disabled prev at page 1, disabled next at page 5. aria-live="polite" on page indicator | `src/components/kudos/KudosCarousel.tsx`
- [x] T036 [US3] Create HighlightKudos server component (fetches top 5 from Supabase directly. Renders SectionHeader with "Sun* Annual Awards 2025" subtitle + "HIGHLIGHT KUDOS" title + FilterBar placeholder slot on right. Renders KudosCarousel with fetched data. Accepts hashtag/department filter props from page searchParams) | `src/components/kudos/HighlightKudos.tsx`
- [x] T037 [US3] Integrate HighlightKudos into page.tsx between hero banner and spotlight sections. Pass searchParams filter values | `src/app/kudos/page.tsx`

**Checkpoint**: User Story 3 complete - carousel shows top 5, navigation works, boundaries respected, links functional.

---

## Phase 6: User Story 7 - Send a Kudos (Entry Point) (Priority: P1)

**Goal**: Hero banner with kudos input pill and search pill entry points.

**Independent Test**: Page displays hero banner with background image. Click input pill area (dialog opens - out of scope, verify click handler exists). Search pill visible.

### Frontend (US7)

- [x] T038 [P] [US7] Create KudosInputPill component (pill-shaped button: padding 24px 16px, radius 68px, border 1px #998C5F, bg gold-10%. Pen icon 24x24 left + placeholder "Hom nay, ban muon gui loi cam on va ghi nhan den ai?" 700 16px white. States: default, hover bg gold-40%, focus outline 2px gold. Click handler: opens submission dialog - for now console.log placeholder. cursor-pointer) | `src/components/kudos/KudosInputPill.tsx`
- [x] T039 [P] [US7] Create SearchPill component (pill-shaped input: same styling as KudosInputPill. Magnifier icon 24x24 left + placeholder "Tim kiem profile Sunner" 700 16px white. Max 100 chars per FR-018. Click/focus triggers search behavior - linked to US11) | `src/components/kudos/SearchPill.tsx`
- [x] T040 [US7] Create HeroBanner component (1440px width responsive, height 512px. Background: hero-banner.png center/cover + gradient overlay `linear-gradient(25deg, #00101A 14.74%, rgba(0,19,32,0) 47.8%)`. Content area padded 144px responsive. Title "He thong ghi nhan va cam on" 700 36px gold. KUDOS logo in SVN-Gotham 139.78px. Input row: KudosInputPill + SearchPill flex row gap 8px. Use `next/image` with `priority` prop for LCP optimization) | `src/components/kudos/HeroBanner.tsx`
- [x] T041 [US7] Integrate HeroBanner into page.tsx as first section after Header. Remove placeholder content | `src/app/kudos/page.tsx`

**Checkpoint**: User Story 7 complete - hero banner displays with input and search pills.

---

## Phase 7: User Story 4 - Filter Kudos by Hashtag and Department (Priority: P2)

**Goal**: Dropdown filters for hashtag and department affecting both Highlight and All Kudos sections via URL search params.

**Independent Test**: Select hashtag filter - both carousel and feed update. Select department - both update. Both active = AND logic. Clear filter returns all. URL updates and is shareable.

### Backend (US4)

- [x] T042 [P] [US4] Create GET `/api/hashtags` route handler. Return all hashtags from hashtags table. Validate with Zod. Cache-friendly (static data) | `src/app/api/hashtags/route.ts`
- [x] T043 [P] [US4] Create GET `/api/departments` route handler. Return all departments from departments table. Validate with Zod. Cache-friendly | `src/app/api/departments/route.ts`

### Frontend (US4)

- [x] T044 [US4] Create FilterBar client component ("use client". Fetches hashtags and departments lists on mount. Two filter buttons: "Hashtag" and "Phong ban" per design-style.md (padding 16px, gap 8px, border 1px #998C5F, radius 4px, bg gold-10%, chevron-down icon). States: default, hover gold-40%, active (filter applied) gold-40% + gold border. Dropdown opens on click showing options list. Selection updates URL search params via `useRouter().push()` from `next/navigation` wrapped in `useTransition()` for pending state. Clear option resets param. AND logic when both active per FR-005) | `src/components/kudos/FilterBar.tsx`
- [x] T045 [US4] Integrate FilterBar into HighlightKudos SectionHeader right-side slot. FilterBar renders alongside section title | `src/components/kudos/HighlightKudos.tsx`
- [x] T046 [US4] Update HashtagList click handler: clicking a hashtag navigates to `?hashtag={tag}` via router.push, same mechanism as FilterBar (per FR-015). Update component to accept router or use `useRouter` internally | `src/components/kudos/HashtagList.tsx`
- [x] T047 [US4] Verify page.tsx reads `searchParams` and passes hashtag/department values to HighlightKudos and AllKudosSection. Both sections should re-render with filtered data on URL change (Server Component re-render triggered by searchParams change) | `src/app/kudos/page.tsx`

**Checkpoint**: User Story 4 complete - filters work via URL params, both sections update, AND logic, shareable URLs.

---

## Phase 8: User Story 5 - Personal Stats and Secret Box (Priority: P2)

**Goal**: Sidebar stats card with 6 metrics and "Mo Secret Box" CTA button.

**Independent Test**: Sidebar displays correct stats for logged-in user. Button disabled when 0 boxes. Button triggers dialog (out of scope).

### Backend (US5)

- [x] T048 [P] [US5] Create GET `/api/users/me/stats` route handler. Return stats for authenticated user: kudos_received, kudos_sent, hearts_received, secret_boxes_opened, secret_boxes_remaining. Use Supabase auth session. Validate with Zod | `src/app/api/users/me/stats/route.ts`
- [x] T049 [P] [US5] Create POST `/api/users/me/secret-box` route handler. Open one secret box for authenticated user. Validate boxes_remaining > 0. Update secret_boxes table. Return result. Return 400 if no boxes available | `src/app/api/users/me/secret-box/route.ts`

### Frontend (US5)

- [x] T050 [P] [US5] Create SecretBoxButton client component ("use client". Props: remainingBoxes. Gift icon 24x24 + text "Mo Secret Box" 700 22px. CTA styling: padding 16px, gap 8px, bg #FFEA9E, radius 8px, color #00101A. States: default, hover #FFF8E1, active #FFE082, disabled opacity 0.5 cursor-not-allowed when remainingBoxes=0, focus outline 2px gold. Click triggers POST /api/users/me/secret-box, then opens dialog - dialog out of scope, for now show toast) | `src/components/kudos/SecretBoxButton.tsx`
- [x] T051 [US5] Create StatsCard component (server-side initial fetch + client CTA. Container: bg #00070C, border 1px #998C5F, radius 17px, padding 24px, gap 16px. 5 stat rows: label 700 16px white + value 700 32px gold, separated by divider 1px #2E3940. Stats: "So Kudos ban nhan duoc", "So Kudos ban da gui", "So tim ban nhan duoc", "So Secret Box ban da mo", "So Secret Box chua mo". SecretBoxButton at bottom. Show 0 values for new users) | `src/components/kudos/StatsCard.tsx`
- [x] T052 [US5] Integrate StatsCard into AllKudosSection sidebar column (first item in sidebar, above leaderboard). Sidebar: `lg:w-[422px] lg:flex-shrink-0`, sticky positioning `position: sticky; top: 100px; overflow-y: auto; max-height: calc(100vh - 120px)`. Mobile: full width below feed | `src/components/kudos/AllKudosSection.tsx`

**Checkpoint**: User Story 5 complete - stats display correctly, secret box button works with disabled state.

---

## Phase 9: User Story 9 - Top 10 Gift Recipients Leaderboard (Priority: P3)

**Goal**: Scrollable leaderboard in sidebar showing top 10 most recent gift recipients.

**Independent Test**: Sidebar leaderboard shows up to 10 entries with avatar, name, gift description. List scrolls. Empty state "Chua co du lieu".

### Backend (US9)

- [x] T053 [US9] Create GET `/api/leaderboard/gifts` route handler. Return top 10 most recent gift recipients with avatar, name, department, gift description. Ordered by awarded_at DESC. Validate with Zod | `src/app/api/leaderboard/gifts/route.ts`

### Frontend (US9)

- [x] T054 [US9] Create LeaderboardCard server component (container: bg #00070C, border 1px #998C5F, radius 17px, padding 24px 16px 24px 24px. Title "10 SUNNER NHAN QUA MOI NHAT" 700 22px gold. Scrollable list area 382x384px, gap 16px, overflow-y auto, scrollbar 2px #999 radius 8px. Each row 364x64: avatar 64x64 circle + name 700 22px gold + description 700 16px white. Empty state "Chua co du lieu". Use `next/image` for avatars) | `src/components/kudos/LeaderboardCard.tsx`
- [x] T055 [US9] Integrate LeaderboardCard into AllKudosSection sidebar column (below StatsCard, gap 24px) | `src/components/kudos/AllKudosSection.tsx`

**Checkpoint**: User Story 9 complete - leaderboard displays in sidebar with scroll.

---

## Phase 10: User Story 6 - Spotlight Word Cloud (Priority: P2)

**Goal**: Interactive SVG word cloud of kudos recipients with search and pan/zoom.

**Independent Test**: Spotlight board renders with total count header. Names display with variable sizes. Search highlights matching name. Pan/zoom toggle works.

### Backend (US6)

- [x] T056 [US6] Create GET `/api/kudos/spotlight` route handler. Return recipient names with kudos count for word cloud. Aggregate kudos by receiver, return name + count. Validate with Zod | `src/app/api/kudos/spotlight/route.ts`

### Frontend (US6)

- [x] T057 [US6] Create SpotlightInteractive client component ("use client". SVG-based word cloud: text elements with randomized positions, font size mapped to count (6.66px-11.34px range), opacity mapped to relative count (0.1-1.0). Search input: "Tim kiem" placeholder, 700 16px white, magnifier icon. Search highlights matching name with #F17676 color + opacity 1.0. Pan/zoom toggle button 40x40 icon, enables CSS transform-based pan (pointer drag) and zoom (wheel/pinch). Click name opens profile. Debounce search 300ms) | `src/components/kudos/SpotlightInteractive.tsx`
- [x] T058 [US6] Create SpotlightBoard server component (fetches spotlight data from Supabase directly. Container: full width (no max-w constraint — aligns with other sections via shared page padding), radius 47px, border 1px #998C5F, overflow hidden. Background: spotlight-bg.png + dark overlay 70%. Header: total "X KUDOS" count 700 36px white + pan/zoom button + search input. Passes data to SpotlightInteractive) | `src/components/kudos/SpotlightBoard.tsx`
- [x] T059 [US6] Integrate SpotlightBoard into page.tsx between HighlightKudos and AllKudosSection. Add SectionHeader with "Sun* Annual Awards 2025" subtitle + "SPOTLIGHT BOARD" title | `src/app/kudos/page.tsx`

**Checkpoint**: User Story 6 complete - word cloud renders with search, pan/zoom, and name interaction.

---

## Phase 11: User Story 10 - Video/Media Attachments (Priority: P2)

**Goal**: Kudos with video display play button overlay and inline playback.

**Independent Test**: Kudos with video shows play icon overlay on thumbnail. Clicking plays video inline.

### Frontend (US10)

- [x] T060 [US10] Enhance MediaRow component: add video playback support. When videoUrl is provided, show 30x30 triangular play icon overlay (semi-transparent bg) on thumbnail. Click triggers inline `<video>` playback within the card (FR-016). Use `next/image` for thumbnail, native `<video>` for playback | `src/components/kudos/MediaRow.tsx`

**Checkpoint**: User Story 10 complete - video kudos display and play correctly.

---

## Phase 12: User Story 8 - Copy Kudos Link (Priority: P3)

**Goal**: Copy shareable link for a kudos post.

**Independent Test**: Click "Copy Link" on a card, verify clipboard contains kudos URL, toast notification appears.

*Note*: CopyLinkButton was already created in Phase 4 (US2). This phase validates the complete integration.

- [x] T061 [US8] Verify CopyLinkButton integration across all card types (KudosCard in feed, HighlightCard in carousel). Ensure copied URL format is `{origin}/kudos/{id}`. Verify Toast appears with "Link copied -- ready to share!" and auto-dismisses. Verify accessibility: button has aria-label "Copy link to this kudos" | `src/components/kudos/CopyLinkButton.tsx`

**Checkpoint**: User Story 8 complete - copy link works everywhere with toast feedback.

---

## Phase 13: User Story 11 - Search Sunner Profiles (Priority: P3)

**Goal**: Search for Sunner profiles via hero search pill and view profile preview tooltips on hover.

**Independent Test**: Type name in search pill - matching results appear. Hover user name anywhere - profile tooltip shows. Click navigates to profile.

### Backend (US11)

- [x] T062 [P] [US11] Create GET `/api/users/search` route handler. Query param: `q` (max 100 chars, validated). Search profiles by display_name (case-insensitive ILIKE). Return max 20 results with id, name, department, avatar_url, kudos_received_count. Validate with Zod | `src/app/api/users/search/route.ts`
- [x] T063 [P] [US11] Create GET `/api/users/[id]/profile-preview` route handler. Return profile preview data: name, department, avatar_url, kudos_received_count. Return 404 if user not found. Validate with Zod | `src/app/api/users/[id]/profile-preview/route.ts`

### Frontend (US11)

- [x] T064 [US11] Create ProfilePreviewTooltip client component ("use client". Wraps children (UserInfo). On hover/focus: fetches `/api/users/[id]/profile-preview`, shows positioned tooltip with avatar + name + department + kudos count. On click: navigates to `/profile/[id]` via `next/link` (profile page out of scope but link must work). Tooltip: fade-in 200ms ease-out, bg #00070C, border 1px #998C5F, radius 8px, padding 12px. Linked frame: 721:5827) | `src/components/kudos/ProfilePreviewTooltip.tsx`
- [x] T065 [US11] Integrate ProfilePreviewTooltip into KudosCardHeader (wrap sender and receiver UserInfo), LeaderboardCard rows (wrap each name/avatar), and HighlightCard user sections. Each wrapped UserInfo triggers tooltip on hover | `src/components/kudos/KudosCardHeader.tsx`, `src/components/kudos/LeaderboardCard.tsx`, `src/components/kudos/HighlightCard.tsx`
- [x] T066 [US11] Enhance SearchPill with search behavior: debounced input (300ms), fetches `/api/users/search?q=`, dropdown results list below pill, max 100 chars enforced. Each result: avatar + name + department. Click result navigates to `/profile/[id]`. Empty results shows "Khong tim thay ket qua" | `src/components/kudos/SearchPill.tsx`

**Checkpoint**: User Story 11 complete - search and profile preview tooltips functional.

---

## Phase 14: Polish & Cross-Cutting Concerns

**Purpose**: Loading states, error handling, accessibility, responsive design, performance, notification bell.

### Loading & Error States

- [x] T067 [P] Create loading.tsx skeleton (full page skeleton: hero banner placeholder, 3 skeleton cards in carousel area, 2 skeleton cards in feed, sidebar placeholders) | `src/app/kudos/loading.tsx`
- [x] T068 [P] Create error.tsx error boundary (error message with retry button. "Something went wrong" heading + description + "Try again" button that calls reset(). Styled per dark theme) | `src/app/kudos/error.tsx`
- [x] T069 Add session expiry handling: API routes return 401 when session invalid. Client-side: detect 401 in useKudosFeed and useLikeKudos, redirect to `/login?redirect=/kudos`. Server-side: Supabase auth check in Server Components, redirect via `redirect()` | `src/hooks/useKudosFeed.ts`, `src/hooks/useLikeKudos.ts`
- [x] T070 [P] Add stale data handling: if heart/copy action returns 404 (deleted kudos), show inline "Kudos not found" message and fade the card with opacity transition | `src/components/kudos/KudosCard.tsx`

### Accessibility

- [x] T071 [P] Add skip-to-content link targeting main kudos feed section. Add to page layout before Header | `src/app/kudos/page.tsx`
- [x] T072 Verify tab order matches spec: Nav -> Input pill -> Search pill -> Filters -> Carousel arrows -> Feed cards (heart, copy link) -> Sidebar CTA -> Leaderboard links -> Footer. Add `tabIndex` adjustments if needed. Verify all icon-only buttons have ARIA labels. Verify `aria-live="polite"` on heart count, carousel indicator, toast | All kudos components

### Responsive Design

- [x] T073 Implement responsive styles for all components. Mobile (<640px): page gutters 16px, hamburger nav, stack pills vertically, single-card carousel full-width, stack feed/sidebar, card padding 24px 16px 12px, section titles 32px, footer stacked centered. Tablet (640-1023px): gutters 48px, 1-2 carousel cards, stacked feed/sidebar, stats 2-column grid. Desktop (>=1024px): gutters 144px, side-by-side feed+sidebar, full carousel. Use mobile-first with `sm:` and `lg:` breakpoints | All kudos components

### Notification Bell

- [x] T074 [P] Add red dot notification indicator to Header bell icon. Conditional 8x8 red (#D4271D) dot, radius 100px, positioned top-right of bell. Requires unread notification count check (can be a simple prop/API check for now) | `src/components/shared/Header.tsx`

### Performance

- [x] T075 Run Lighthouse audit on `/kudos` page (desktop). Target score >= 80 per TR-001. Verify: hero banner has `priority` prop (LCP), images below fold are lazy-loaded, Server Components minimize client JS, no unused CSS. Fix any issues found | `src/app/kudos/page.tsx`

### Footer Integration

- [x] T076 Verify Footer displays correct links per FR-022: "About SAA 2025", "Award Information", "Sun* Kudos" (active with gold-10% bg + glow), "Tieu chuan chung". Verify copyright "Ban quyen thuoc ve Sun* (c) 2025" in Montserrat Alternates. Update if needed | `src/components/shared/Footer.tsx`

**Checkpoint**: All polish complete. Feature ready for final review.

---

## Dependencies & Execution Order

### Phase Dependencies

```
Phase 1 (Setup) ─────────► Phase 2 (Foundation) ─────────► User Story Phases
                                                              │
                                    ┌─────────────────────────┤
                                    ▼                         ▼
                              Phase 3 (US1) ──► Phase 4 (US2) ──┐
                              Browse Feed       Like/Heart      │
                                    │                           │
                                    ▼                           ▼
                              Phase 5 (US3) ──────────► Phase 6 (US7)
                              Carousel                  Hero Banner
                                    │
                                    ▼
                              Phase 7 (US4) ──► Phase 8 (US5) ──► Phase 9 (US9)
                              Filters            Stats            Leaderboard
                                    │
                                    ▼
                              Phase 10 (US6) ──► Phase 11 (US10) ──► Phase 12 (US8)
                              Spotlight           Video              Copy Link verify
                                    │
                                    ▼
                              Phase 13 (US11) ──► Phase 14 (Polish)
                              Search/Preview
```

### Critical Path

1. **Phase 1 + 2** must complete first (database, types, tokens)
2. **Phase 3 (US1)** is MVP - feed cards are reused by carousel, filters, etc.
3. **Phase 4 (US2)** adds interactivity to cards (heart/copy) - needed by carousel too
4. **Phase 5 (US3)** reuses KudosCard components from US1 + HeartButton from US2
5. Phases 6-13 can be reordered but follow natural dependency chain

### Within Each User Story

- Backend routes created before frontend components that consume them
- Shared sub-components (UserInfo, QuoteBox, etc.) created before parent components
- Hooks created before components that use them
- Page integration is always last task in a phase

### Parallel Opportunities

**Within Phase 1**: T004, T005, T006 can all run in parallel
**Within Phase 2**: T007 first, then T008-T011 in parallel after migration
**Within Phase 3 (US1)**: T013-T020 (sub-components) can ALL run in parallel, then T021 (KudosCard), then T022-T025 sequentially
**Within Phase 4 (US2)**: T027 and T029 in parallel, then T028 and T030, then T031
**Within Phase 7 (US4)**: T042 and T043 in parallel
**Within Phase 8 (US5)**: T048 and T049 in parallel, then T050
**Within Phase 13 (US11)**: T062 and T063 in parallel
**Within Phase 14**: T067, T068, T070, T071, T074 all in parallel

---

## Implementation Strategy

### MVP First (Recommended)

1. Complete Phase 1 + 2 (Setup + Foundation)
2. Complete Phase 3 (US1 - Browse Feed)
3. Complete Phase 4 (US2 - Like/Heart)
4. **STOP and VALIDATE**: Test feed display, infinite scroll, like/unlike, empty states
5. Deploy preview if ready

### Incremental Delivery

1. Setup + Foundation (T001-T011)
2. Add US1 (Feed) + US2 (Like) + US3 (Carousel) + US7 (Hero) -> Test -> Deploy **(P1 complete)**
3. Add US4 (Filters) + US5 (Stats) + US6 (Spotlight) + US10 (Video) -> Test -> Deploy **(P2 complete)**
4. Add US9 (Leaderboard) + US8 (Copy Link verify) + US11 (Search/Preview) -> Test -> Deploy **(P3 complete)**
5. Polish (Phase 14) -> Final Test -> Deploy **(Feature complete)**

---

## Notes

- Commit after each completed phase or logical group of tasks
- Run `yarn lint` and `yarn build` between phases to catch issues early
- Mark tasks complete as you go: `- [x]`
- The constitution mandates TDD (Red-Green-Refactor) - write tests first for each API route and hook before implementing. Test tasks are embedded within each phase rather than separate.
- Update spec.md if requirements change during implementation
- FilterBar uses URL search params (not local state) - this is an intentional deviation from spec's state table for Server Component compatibility
- All `useRouter` imports must be from `next/navigation` (not `next/router`)
- TailwindCSS 4 tokens go in `@theme` block in globals.css, not in tailwind.config.ts
- No new npm packages - keep bundle minimal for Cloudflare Workers
