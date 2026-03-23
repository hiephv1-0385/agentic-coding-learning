# Screen Spec: Sun* Kudos - Live Board

**Screen #**: 12
**Frame ID**: `2940:13431`
**Frame Name**: `Sun* Kudos - Live board`
**File Key**: `9ypp4enmFmdK3YAFJLIu6C`
**Spec Path**: `.momorph/specs/2940-13431-sun-kudos-live-board/`

---

## Purpose

Main Kudos page for the Sun* Annual Awards 2025 platform. Allows Sunners to browse, send, and interact with kudos (messages of appreciation). Features a hero banner, highlight carousel, spotlight word cloud, infinite-scroll kudos feed, personal stats sidebar, and gamification elements (hearts, secret boxes, leaderboards).

## Component Type

Full page (main content page).

## Visual Summary

Dark-themed page (navy #00101A background with gold #FFEA9E accents) featuring:
1. **Navigation bar** - Fixed top nav with logo, page links, language switcher, notification bell, user avatar
2. **Hero banner** - Full-width decorative banner with title, KUDOS logo, kudos input pill, and search pill
3. **Highlight Kudos** - Carousel of top 5 kudos by heart count with filter dropdowns (Hashtag, Department)
4. **Spotlight Board** - Interactive word cloud of kudos recipients inside a rounded container
5. **All Kudos** - Two-column layout: infinite-scroll kudos feed (left) + stats/leaderboard sidebar (right)
6. **Footer** - Logo, navigation links, copyright

## Key Interactions

| Action | Result |
|--------|--------|
| Click kudos input pill | Opens kudos submission dialog |
| Click hashtag/department filter | Opens dropdown, filters both Highlight and All Kudos sections |
| Navigate carousel (arrows) | Slides through top 5 highlighted kudos (disabled at boundaries) |
| Click "Xem chi tiet" on carousel card | Opens kudos detail view |
| Click heart icon on kudos card | Toggles like (1 per user per kudos, sender excluded; +1/+2 hearts to sender) |
| Click "Copy Link" | Copies kudos URL to clipboard; shows toast notification |
| Click hashtag on any card | Filters both Highlight and All Kudos sections by that hashtag |
| Scroll kudos feed | Loads more kudos cards (infinite scroll) |
| Hover user name/avatar | Shows profile preview tooltip |
| Click user name/avatar | Opens user profile |
| Click "Mo Secret Box" button | Opens secret box dialog |
| Search in Spotlight | Highlights matching name in word cloud |
| Toggle pan/zoom on Spotlight | Enables pan/zoom interaction on word cloud |
| Click name in word cloud | Opens kudos detail or profile for that person |

## Data

- **Kudos Feed**: Paginated list of kudos posts (sender, receiver, content, images, hashtags, hearts, timestamp)
- **Highlight Kudos**: Top 5 kudos by heart count
- **Spotlight Data**: Recipient names with kudos counts for word cloud
- **User Stats**: Kudos received/sent, hearts received, secret boxes opened/remaining
- **Leaderboard**: Top 10 most recent gift recipients
- **Hashtags**: Available hashtag list for filter dropdown
- **Departments**: Available department list for filter dropdown
- **Persistence**: Server-side (Supabase), real-time updates for hearts
- **APIs**: See spec.md for predicted API endpoints

## Navigation Context

- **Entry**: Header navigation "Sun* Kudos" link from any page; CTA from Homepage SAA
- **Exit**: Header navigation to other pages (About SAA 2025, Award Information); profile/settings via dropdown; secret box dialog; kudos submission dialog
- **Scope**: Top-level page within SAA 2025 platform
- **Auth required**: Yes

## Linked Frames

| Target | Frame ID | Trigger |
|--------|----------|---------|
| Dropdown Hashtag (Multi-Select) | `1002:13013` | Click "Hashtag" filter button |
| Dropdown Phong ban (Department) | `721:5684` | Click "Phong ban" filter button |
| Profile Preview Tooltip | `721:5827` | Hover on user name/avatar |
| Open Secret Box Dialog | `1466:7676` | Click "Mo Secret Box" button |

## Design Items

| # | Node ID | Name | Type | Description |
|---|---------|------|------|-------------|
| A | 2940:13437 | KV Kudos | Hero banner | Full-width banner with title + KUDOS logo |
| A.1 | 2940:13449 | Button ghi nhan | Text form | Pill input to open kudos submission dialog |
| B | 2940:13451 | Highlight | Carousel | Top kudos carousel with filters |
| B.1 | 2940:13452 | Header | Section header | "HIGHLIGHT KUDOS" title + filter buttons |
| B.2 | 2940:13461 | HIGHLIGHT KUDOS | Carousel | Carousel content (5 slides) |
| B.3 | 2940:13465 | KUDO - Highlight | Card | Highlight kudos card |
| B.5 | 2940:13471 | Slide nav | Navigation | Carousel arrows + page indicator |
| B.6 | 2940:13476 | Header Giai thuong | Section header | Spotlight section header |
| B.7 | 2940:14174 | Spotlight | Word cloud | Interactive word cloud board |
| C | 2940:13475 | All kudos | List | Kudos feed + sidebar layout |
| C.2 | 2940:13482 | Danh sach loi cam on | List | Kudos cards list (infinite scroll) |
| C.3 | 3127:21871 | KUDO Post | Card | Full kudos post card |
| D | 2940:13488 | Thong menu phai | Sidebar | Stats + leaderboard sidebar |
| D.1 | 2940:13489 | Thong ke tong quat | Info block | Personal stats card |
| D.3 | 2940:13510 | 10 SUNNER nhan qua | List | Gift recipients leaderboard |
