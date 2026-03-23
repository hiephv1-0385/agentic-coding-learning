# Feature Specification: Sun* Kudos Live Board

**Frame ID**: `2940:13431`
**Frame Name**: `Sun* Kudos - Live board`
**File Key**: `9ypp4enmFmdK3YAFJLIu6C`
**Created**: 2026-03-11
**Status**: Reviewed

---

## Overview

The **Kudos Live Board** is the main page of the Sun* Kudos system within the SAA 2025 (Sun* Annual Awards) platform. It allows Sunners (Sun* employees) to send, browse, and interact with kudos -- messages of appreciation and recognition. The page features a hero banner, a highlight carousel of top kudos, an interactive spotlight word cloud, an infinite-scroll feed of all kudos, and a sidebar with personal stats, secret box rewards, and leaderboards.

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Browse All Kudos Feed (Priority: P1)

A logged-in Sunner visits the Kudos Live Board to read recent kudos posted by colleagues. The feed shows kudos cards with sender/receiver info, message content, attached images, hashtags, and engagement actions.

**Why this priority**: The all-kudos feed is the core content of the page. Without it, there is no value to display.

**Independent Test**: Load the page and verify kudos cards render with correct sender, receiver, timestamp, content, images, hashtags, and heart count. Verify infinite scroll loads more cards.

**Acceptance Scenarios**:

1. **Given** the user is authenticated and kudos exist in the database, **When** they navigate to the Kudos Live Board, **Then** they see a list of kudos cards ordered by most recent, each showing sender avatar/name/department, receiver avatar/name/department, timestamp (HH:mm - MM/DD/YYYY), message content (max 5 lines with "..." truncation), attached images (max 5 thumbnails), hashtags (max 5 per line), and heart count.
2. **Given** the user scrolls to the bottom of the kudos list, **When** more kudos exist, **Then** additional kudos cards load automatically (infinite scroll).
3. **Given** no kudos exist in the database, **When** the user views the feed, **Then** an empty state message "Hien tai chua co Kudos nao." is displayed.

---

### User Story 2 - Like (Heart) a Kudos Post (Priority: P1)

A Sunner can express appreciation for a kudos by clicking the heart icon, which increments the heart count and awards hearts to the kudos sender.

**Why this priority**: Engagement (hearts) is a core interaction mechanic that drives the recognition system and feeds into stats/leaderboards.

**Independent Test**: Click the heart on a kudos card and verify the count increments. Verify business rules around one-like-per-user and sender self-like restriction.

**Acceptance Scenarios**:

1. **Given** the user has not yet liked a specific kudos, **When** they click the heart icon, **Then** the heart icon turns red (active), the count increments by 1, and +1 heart is added to the kudos sender's account.
2. **Given** the user has already liked a kudos, **When** they click the heart icon again, **Then** the like is revoked, the heart icon returns to gray (inactive), the count decrements by 1, and the corresponding hearts are deducted from the sender's account.
3. **Given** the user is the sender of a kudos, **When** they view that kudos, **Then** the heart button is disabled or hidden (sender cannot like own kudos).
4. **Given** an admin has configured a "special day", **When** a user likes a kudos on that day, **Then** +2 hearts are added to the sender's account instead of +1, and revoking deducts 2.

---

### User Story 3 - View Highlight Kudos Carousel (Priority: P1)

A Sunner sees the top kudos (by heart count) in a prominent carousel at the top of the page.

**Why this priority**: Highlights drive engagement by surfacing the most appreciated kudos prominently.

**Independent Test**: Load the page and verify the carousel displays top 5 kudos with navigation arrows and page indicator.

**Acceptance Scenarios**:

1. **Given** kudos with hearts exist, **When** the page loads, **Then** the Highlight Kudos section shows a carousel with the top 5 kudos by heart count, centered card highlighted, side cards dimmed.
2. **Given** the carousel is on page 1, **When** the user clicks the previous arrow, **Then** nothing happens (button is disabled).
3. **Given** the carousel is on page 5, **When** the user clicks the next arrow, **Then** nothing happens (button is disabled).
4. **Given** the user clicks a carousel card, **When** the card's "Xem chi tiet" link is clicked, **Then** the full kudos detail is displayed.

---

### User Story 4 - Filter Kudos by Hashtag and Department (Priority: P2)

A Sunner can filter both the Highlight Kudos carousel and the All Kudos feed simultaneously using hashtag and department dropdown filters.

**Why this priority**: Filtering enhances discoverability and is important for users looking for specific recognition topics or team-based kudos.

**Independent Test**: Select a hashtag filter and verify both the Highlight carousel and All Kudos feed update to show only matching kudos.

**Acceptance Scenarios**:

1. **Given** the user clicks the "Hashtag" dropdown, **When** they select a hashtag, **Then** both the Highlight Kudos carousel and the All Kudos feed filter to show only kudos containing that hashtag.
2. **Given** the user clicks the "Phong ban" (Department) dropdown, **When** they select a department, **Then** both sections filter to show only kudos from that department.
3. **Given** the user clicks a hashtag tag on any kudos card, **When** the tag is clicked, **Then** the same filter is applied to both sections.
4. **Given** filters are active, **When** the user clears the filter, **Then** both sections return to showing all kudos.

---

### User Story 5 - View Personal Stats and Open Secret Box (Priority: P2)

A Sunner sees their personal stats (kudos received, sent, hearts, secret boxes) in the right sidebar and can open secret box rewards.

**Why this priority**: Personal stats drive motivation and the secret box mechanic is a gamification feature that encourages engagement.

**Independent Test**: Verify the sidebar displays correct stats for the logged-in user and the "Mo qua" button opens the secret box dialog.

**Acceptance Scenarios**:

1. **Given** the user is authenticated, **When** they view the sidebar, **Then** they see: "So Kudos ban nhan duoc", "So Kudos ban da gui", "So tim ban nhan duoc", "So Secret Box ban da mo", "So Secret Box chua mo" with correct values.
2. **Given** the user has unopened secret boxes, **When** they click "Mo Secret Box", **Then** the secret box opening dialog appears (linked frame: 1466:7676).
3. **Given** the user has 0 unopened secret boxes, **When** they view the sidebar, **Then** the "Mo Secret Box" button is disabled (grayed out, not clickable).
4. **Given** the user has no data yet, **When** they view the sidebar, **Then** stats show 0 values and leaderboard shows "Chua co du lieu".

---

### User Story 6 - View Spotlight Word Cloud (Priority: P2)

A Sunner sees an interactive word cloud visualization of kudos recipients, showing names sized by kudos count.

**Why this priority**: The spotlight board is a visual engagement feature that provides an overview of recognition distribution.

**Independent Test**: Load the page and verify the spotlight board renders with a total kudos count header and interactive name nodes.

**Acceptance Scenarios**:

1. **Given** kudos data exists, **When** the page loads, **Then** the Spotlight Board displays a word cloud with recipient names and a total "388 KUDOS" count header.
2. **Given** the word cloud is rendered, **When** the user hovers over a name, **Then** a tooltip with details appears.
3. **Given** the user clicks a name node, **When** the click occurs, **Then** the user's kudos detail or profile is displayed.
4. **Given** the user enables pan/zoom mode, **When** they interact with the board, **Then** they can pan and zoom the word cloud.
5. **Given** the user types in the search bar, **When** they search for a Sunner name, **Then** the matching name is highlighted in the word cloud.

---

### User Story 7 - Send a Kudos (Priority: P1)

A Sunner initiates the kudos sending flow by clicking the input/button area in the hero section.

**Why this priority**: Sending kudos is the primary action that generates all content on the board.

**Independent Test**: Click the kudos input pill and verify the kudos submission dialog opens.

**Acceptance Scenarios**:

1. **Given** the user is authenticated, **When** they click the pill-shaped input with placeholder "Hom nay, ban muon gui loi cam on va ghi nhan den ai?", **Then** the kudos submission dialog opens.

---

### User Story 8 - Copy Kudos Link (Priority: P3)

A Sunner can copy a shareable link to a specific kudos post.

**Why this priority**: Sharing kudos links is a secondary engagement feature.

**Independent Test**: Click "Copy Link" on a kudos card and verify the URL is copied to clipboard with a toast notification.

**Acceptance Scenarios**:

1. **Given** a kudos card is displayed, **When** the user clicks "Copy Link", **Then** the kudos URL is copied to the clipboard and a toast "Link copied -- ready to share!" is shown.

---

### User Story 9 - View Top 10 Sunners Who Received Gifts (Priority: P3)

A Sunner can see the 10 most recent gift recipients in the sidebar leaderboard.

**Why this priority**: Leaderboard is a secondary engagement and discovery feature.

**Independent Test**: Verify the sidebar leaderboard shows up to 10 entries with avatar, name, and gift description. Verify scrollability.

**Acceptance Scenarios**:

1. **Given** gift recipients exist, **When** the sidebar loads, **Then** a scrollable list titled "10 SUNNER NHAN QUA MOI NHAT" shows entries with avatar, name, and gift description.
2. **Given** the user clicks a name or avatar, **When** clicked, **Then** the Sunner's profile is opened.
3. **Given** the user hovers over a name, **When** hovered, **Then** a profile preview tooltip appears (linked frame: 721:5827).

---

### User Story 10 - View Kudos with Video/Media Attachments (Priority: P2)

A Sunner sees kudos cards that include video content indicated by a play button overlay on the media thumbnail.

**Why this priority**: Media-rich kudos enhance the recognition experience and are visible in the design.

**Independent Test**: Verify kudos cards with video attachments display a play icon overlay on the thumbnail. Clicking opens the video player.

**Acceptance Scenarios**:

1. **Given** a kudos has a video attachment, **When** the card renders, **Then** the thumbnail displays with a triangular play button overlay.
2. **Given** the user clicks the play button, **When** clicked, **Then** the video plays inline within the kudos card.

---

### User Story 11 - Search Sunner Profiles (Priority: P3)

A Sunner searches for other Sunners using the search pill in the hero section.

**Why this priority**: Profile search is a secondary discovery feature.

**Independent Test**: Type a name in the search pill and verify matching results appear.

**Acceptance Scenarios**:

1. **Given** the user is on the Kudos page, **When** they type a name in the search pill (placeholder: "Tim kiem profile Sunner"), **Then** matching Sunner profiles are displayed (max 100 characters input).
2. **Given** no results match the search query, **When** the search completes, **Then** an appropriate empty state is shown.

---

### Edge Cases

- What happens when the user's session expires while browsing? Redirect to login.
- How does the system handle a kudos being deleted while a user is viewing it? Show a graceful "Kudos not found" message.
- What happens if the Spotlight word cloud has too many names to display? Implement opacity-based depth (0.1 to 1.0) for visual prioritization.
- What if a special day configuration changes mid-day? Hearts already awarded keep their original value; new likes use the current configuration.
- What happens when a network error occurs during infinite scroll? Show a "Failed to load. Tap to retry." message at the bottom of the feed.
- What happens when the heart/like API call fails? Revert the optimistic UI update and show an error toast.
- What if both hashtag and department filters are active simultaneously? They combine with AND logic to show only kudos matching both criteria.

---

## UI/UX Requirements *(from Figma)*

### Screen Components

| Component | Description | Interactions |
|-----------|-------------|--------------|
| Navigation Bar | Fixed top nav with logo, links (About SAA 2025, Award Information, Sun* Kudos), language switcher, notification bell, user avatar | Click nav links to navigate; active link has gold underline + glow |
| Hero Banner (KV Kudos) | Full-width banner with gradient overlay, title "He thong ghi nhan va cam on", KUDOS logo | Read-only display |
| Kudos Input Pill | Pill-shaped text field with pen icon and placeholder | Click to open kudos submission dialog |
| Search Sunner Pill | Pill-shaped search input with magnifier icon | Type to search Sunner profiles (max 100 chars) |
| Highlight Kudos Section | Section header + filter dropdowns + carousel | Filter by hashtag/department; navigate carousel |
| Kudos Carousel Card | Card with sender/receiver info, message (3 lines), hashtags, hearts, actions. Includes "Xem chi tiet" link (not present on feed cards) | Click heart, copy link, "Xem chi tiet" opens detail |
| Carousel Navigation | Left/right arrows + page indicator (e.g., "2/5") | Click arrows to navigate slides |
| Spotlight Board | Word cloud in rounded container with search and pan/zoom | Hover for tooltip, click for detail, search to highlight |
| All Kudos Section | Section header + infinite scroll list of kudos cards | Scroll to load more |
| Kudos Post Card | Full card with sender/receiver, timestamp, message (5 lines), images, hashtags, hearts, copy link | Click heart, copy link, click hashtag to filter, click images for full view |
| Sidebar Stats | Stats card with 6 metrics + "Mo Secret Box" CTA | Click CTA to open secret box dialog |
| Sidebar Leaderboard | Scrollable list of top 10 gift recipients | Click/hover name for profile/preview |
| Footer | Logo, nav links, copyright | Click nav links to navigate |

### Navigation Flow

- From: Any page via top navigation bar
- To: Kudos submission dialog (via input pill), Profile preview (via hover), Secret box dialog (via "Mo qua" button), Hashtag/Department dropdown panels
- Triggers: Click on input pill, click on "Mo qua", hover on user names, click on filter dropdowns

### Visual Requirements

- Responsive breakpoints: Mobile (< 640px), Tablet (640px - 1023px), Desktop (>= 1024px)
- Animations/Transitions: Carousel slide transitions, heart icon state changes, tooltip fade-in on hover
- See `design-style.md` for complete visual specifications

### Accessibility Requirements

| Requirement | Implementation |
|-------------|----------------|
| WCAG AA color contrast | 4.5:1 minimum for normal text; gold (#FFEA9E) on dark (#00101A) passes |
| Touch targets | Minimum 44x44px on mobile for all interactive elements |
| Keyboard navigation | Tab order: Nav links -> Input pill -> Search pill -> Filter buttons -> Carousel arrows -> Kudos cards (heart, copy link) -> Sidebar CTA -> Leaderboard links -> Footer links |
| Focus indicators | 2px solid #FFEA9E outline with 2px offset on all focusable elements (per design-style.md) |
| Screen reader | ARIA labels on icon-only buttons (heart, copy link, carousel arrows, pan/zoom, bell); `aria-live="polite"` on heart count, carousel page indicator, and toast notifications |
| Skip navigation | Skip-to-content link for main kudos feed |
| Image alt text | All avatars: "{name} profile photo"; sticker images: descriptive alt; decorative banner: `alt=""` |
| Carousel | `role="region"` with `aria-label="Highlight Kudos"`, `aria-roledescription="carousel"`; slides use `role="tabpanel"` |
| Infinite scroll | Announce "Loading more kudos" to screen readers when fetching; announce "No more kudos to load" when end reached |

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display a paginated/infinite-scroll feed of kudos posts ordered by most recent.
- **FR-002**: System MUST display a highlight carousel of top 5 kudos by heart count.
- **FR-003**: Users MUST be able to like/unlike a kudos post (one like per user per post, sender excluded).
- **FR-004**: Each like MUST add +1 heart to the kudos sender's account (+2 on admin-configured special days).
- **FR-005**: System MUST support filtering kudos by hashtag and department, affecting both Highlight and All Kudos sections simultaneously. When both filters are active, they combine with AND logic (only kudos matching both hashtag AND department are shown).
- **FR-006**: System MUST display personal stats: kudos received, kudos sent, hearts received, secret boxes opened, secret boxes remaining.
- **FR-007**: System MUST render a Spotlight word cloud of kudos recipients with interactive hover/click.
- **FR-008**: System MUST allow users to copy a kudos post link to clipboard.
- **FR-009**: System MUST display user asterisk badges based on kudos received (1 star = 10, 2 stars = 20, 3 stars = 50 kudos).
- **FR-010**: System MUST display a leaderboard of top 10 most recent gift recipients with avatar, name, and gift description.
- **FR-011**: Users MUST be able to open secret boxes via the "Mo Secret Box" button. The button MUST be disabled when the user has 0 unopened boxes.
- **FR-012**: System MUST display timestamps in format "HH:mm - MM/DD/YYYY" (per Figma design item C.3.4).
- **FR-013**: System MUST truncate kudos content to 3 lines in highlight cards and 5 lines in feed cards with "..." overflow.
- **FR-014**: System MUST display up to 5 hashtags per line and up to 5 image thumbnails per kudos card.
- **FR-015**: Clicking a hashtag on any card MUST filter both Highlight and All Kudos sections.
- **FR-016**: Kudos cards with video attachments MUST show a play button overlay on the media thumbnail. Clicking plays the video inline within the card.
- **FR-017**: System MUST display a category label badge (e.g., "IDOL GIOI TRE") on kudos cards when a category tag is assigned (design item D.4).
- **FR-018**: The Search Sunner pill MUST allow users to search for profiles with a maximum input of 100 characters.
- **FR-019**: The sidebar MUST scroll independently from the main kudos feed.
- **FR-020**: System MUST display the notification bell icon in the navigation bar with a red dot indicator when unread notifications exist.
- **FR-021**: Highlight carousel cards MUST include a "Xem chi tiet" link that navigates to the full kudos detail view. This link is NOT present on All Kudos feed cards.
- **FR-022**: Footer MUST display navigation links: "About SAA 2025", "Award Information", "Sun* Kudos", "Tieu chuan chung", with the current page link highlighted, and copyright text "Ban quyen thuoc ve Sun* (c) 2025".

### Technical Requirements

- **TR-001**: Page must achieve Lighthouse Performance score >= 80 on desktop.
- **TR-002**: All API calls must be authenticated via Supabase Auth session tokens.
- **TR-003**: Heart/like operations must be atomic to prevent double-counting race conditions.
- **TR-004**: Infinite scroll must use cursor-based pagination for consistent results.
- **TR-005**: Word cloud rendering should use canvas or SVG for performance with 100+ name nodes.
- **TR-006**: Image thumbnails should use Next.js `<Image>` component with lazy loading.

### Key Entities *(if feature involves data)*

- **Kudos**: A recognition message from one Sunner to another, containing text content, hashtags, attached images, and a timestamp.
- **Heart/Like**: A user's endorsement of a kudos post; tracks normal vs special-day for correct revocation.
- **Secret Box**: A gamification reward that Sunners can open; tracks opened vs unopened count.
- **Sunner Profile**: Employee profile with name, department, avatar (Gmail photo), and asterisk badge level.
- **Hashtag**: Tags attached to kudos for categorization and filtering.

---

## State Management

### Local Component State

| State | Type | Initial | Component | Purpose |
|-------|------|---------|-----------|---------|
| carouselPage | number | 1 | KudosCarousel | Current carousel slide index (1-5) |
| activeFilters | { hashtag?: string, department?: string } | {} | KudosLiveBoard | Active filter selections |
| isLiking | Map<string, boolean> | {} | KudosCard | Optimistic UI lock per kudos ID |
| searchQuery | string | "" | SpotlightBoard | Spotlight search input value |
| isPanZoom | boolean | false | SpotlightBoard | Pan/zoom mode toggle |

### Server/Global State

| State | Source | Purpose |
|-------|--------|---------|
| kudosFeed | Server Component + cursor pagination | Paginated kudos list for All Kudos section |
| highlightKudos | Server Component | Top 5 kudos by heart count |
| spotlightData | Server Component | Word cloud recipient data |
| userStats | Server Component | Current user's stats (kudos, hearts, secret boxes) |
| leaderboard | Server Component | Top 10 gift recipients |
| session | Supabase Auth | Current user session for auth/like operations |

### Loading States

| Component | Loading Behavior |
|-----------|-----------------|
| Page (initial) | Show `loading.tsx` skeleton with placeholder cards |
| Kudos Feed (infinite scroll) | Show skeleton card at bottom while loading next batch |
| Heart/Like action | Optimistic UI: immediately toggle icon/count, revert on error |
| Carousel | Pre-render all 5 cards; show skeleton if data is fetching |
| Spotlight | Show container with loading spinner while word cloud computes |
| Sidebar stats | Show skeleton number placeholders |

### Error States

| Component | Error Behavior |
|-----------|----------------|
| Page (initial) | Show `error.tsx` with retry button |
| Kudos Feed (pagination) | Show inline "Failed to load. Tap to retry." at feed bottom |
| Heart/Like | Revert optimistic UI, show error toast |
| Filter | Show toast "Failed to apply filter", keep previous results |
| Spotlight | Show fallback message inside board container |

---

## API Dependencies

| Endpoint | Method | Purpose | Status |
|----------|--------|---------|--------|
| /api/kudos | GET | Fetch paginated kudos feed (supports cursor, hashtag, department filters) | Predicted |
| /api/kudos/highlights | GET | Fetch top 5 kudos by heart count (supports hashtag, department filters) | Predicted |
| /api/kudos/[id]/like | POST | Like a kudos post | Predicted |
| /api/kudos/[id]/like | DELETE | Unlike a kudos post | Predicted |
| /api/kudos/spotlight | GET | Fetch spotlight word cloud data (recipient names + counts) | Predicted |
| /api/users/me/stats | GET | Fetch current user's stats (kudos sent/received, hearts, secret boxes) | Predicted |
| /api/users/me/secret-box | POST | Open a secret box | Predicted |
| /api/leaderboard/gifts | GET | Fetch top 10 recent gift recipients | Predicted |
| /api/hashtags | GET | Fetch available hashtags for filter dropdown | Predicted |
| /api/departments | GET | Fetch available departments for filter dropdown | Predicted |
| /api/users/search | GET | Search Sunner profiles by name (query param: q, max 100 chars) | Predicted |
| /api/users/[id]/profile-preview | GET | Fetch profile preview data for hover tooltip | Predicted |

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Page loads and displays first batch of kudos within 2 seconds on desktop (3G: < 5s).
- **SC-002**: Heart/like action completes with visual feedback within 300ms (optimistic UI).
- **SC-003**: Carousel navigation is smooth with < 100ms transition latency.
- **SC-004**: All 64 design items from Figma are implemented with pixel-perfect accuracy per design-style.md.
- **SC-005**: Zero critical accessibility violations (axe-core audit).

---

## Out of Scope

- Kudos submission form/dialog (separate frame)
- User profile page (separate frame)
- Secret box opening dialog UI (linked frame: 1466:7676)
- Admin configuration for special days
- Push notifications for new kudos
- Hashtag and department dropdown panel UIs (linked frames: 1002:13013, 721:5684)

---

## Dependencies

- [x] Constitution document exists (`.momorph/constitution.md`)
- [ ] API specifications available (`.momorph/API.yml`)
- [ ] Database design completed (`.momorph/database.sql`)
- [x] Screen flow documented (`.momorph/contexts/SCREENFLOW.md`)

---

## Notes

- All text content is in Vietnamese. The UI supports a language switcher (Vietnamese flag + dropdown) but only Vietnamese content is specified in this frame.
- The hero banner uses a decorative background image from Figma assets.
- The Spotlight word cloud uses variable font sizes (6.66px to 11.34px) and opacity levels (0.1 to 1.0) to create depth.
- Asterisk/star badges follow specific thresholds: 10, 20, 50 kudos received.
- The heart system distinguishes between normal and special-day likes in the database for accurate revocation logic.
- The page is designed at 1440px width; responsive behavior needs to be implemented per constitution breakpoints (Mobile < 640px, Tablet 640-1023px, Desktop >= 1024px).
- **Confirmed**: Timestamp format is "HH:mm - MM/DD/YYYY" per Figma design (FR-012).
- **Confirmed**: Hashtag + Department filters use AND logic when both active.
- **Confirmed**: "Mo Secret Box" button is disabled when user has 0 unopened boxes.
- **Confirmed**: Video attachments play inline within the kudos card (no modal player).
