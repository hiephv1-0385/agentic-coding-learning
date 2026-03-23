# Screen Flow Mapping

**Figma File Key**: `9ypp4enmFmdK3YAFJLIu6C`
**Last Updated**: 2026-03-16

---

## Screen Inventory

| # | Screen Name | Frame ID | Spec Path | Description | Entry Point | Exit Point |
|---|-------------|----------|-----------|-------------|-------------|------------|
| 1 | Add Link Box | `1002:12917` | `.momorph/specs/1-Addlink-Box/` | Modal dialog for adding hyperlinks with content text and URL fields | Triggered from content editor (parent TBD) | Cancel/Save closes dialog, returns to parent |
| 2 | Countdown - Prelaunch Page | `2268:35127` | `.momorph/specs/2-Countdown-Prelaunch-page/` | Full-page prelaunch countdown showing days, hours, minutes until event | Direct URL (standalone landing page) | Redirects to event page on countdown expiry |
| 3 | Dropdown Hashtag Filter | `721:5580` | `.momorph/specs/3-Dropdown-Hashtag-filter/` | Dropdown list for filtering content by hashtag selection (single-select, 13 options) | Triggered from filter button on parent page (TBD) | Closes after selection, applies filter to parent |
| 4 | Dropdown List Hashtag (Multi-Select) | `1002:13013` | `.momorph/specs/4-Dropdown-list-hashtag/` | Multi-select hashtag dropdown with trigger button, max 5 selections, checkmark icons for selected state | Triggered from "+" trigger button on parent page (TBD) | Stays open during selection; closes on click outside or Escape |
| 5 | Language Dropdown | `721:4942` | `.momorph/specs/721_4942-dropdown-ngon-ngu/` | Language selector dropdown with VN/EN options, country flags, and dark theme styling | Global UI component in header/navigation bar | Closes after selection; applies language switch in-place |
| 6 | Dropdown Phòng ban (Department Dropdown) | `721:5684` | `.momorph/specs/721-5684-Dropdown-Phong-ban/` | Department selection dropdown allowing users to filter or select a department from a list. Dark-themed dropdown with gold border styling consistent with other dropdowns. | Triggered from filter/form on parent page (TBD) | Closes after selection; applies department filter |
| 7 | Dropdown Profile | `721:5223` | `.momorph/specs/721-5223-Dropdown-profile/` | Profile dropdown menu showing user information (avatar, name, email) with options for Profile, Settings, and Logout. Dark-themed with gold border styling. | Click on user avatar/profile area in header/navigation | Closes after menu item selection; navigates to Profile/Settings or performs Logout |
| 8 | Dropdown Profile Admin | `721:5277` | `.momorph/specs/721-5277-Dropdown-profile-Admin/` | Admin profile dropdown menu extending the regular profile dropdown with additional admin-specific options (e.g., Admin Dashboard, Settings). Dark-themed with gold border styling. | Click on admin user avatar/profile area in header/navigation | Closes after menu item selection; navigates to Profile/Admin Dashboard/Settings or performs Logout |
| 9 | Hệ thống giải (Awards System) | `313:8436` | `.momorph/specs/313-8436-he-thong-giai/` | Full-page awards system for SAA 2025 showing 6 award categories (Top Talent, Top Project, Top Project Leader, Best Manager, Signature 2025, MVP) with sidebar navigation, descriptions, quantities, and prize values. Includes Sun* Kudos promotional section. | Header "Award Information" nav link, direct URL, Homepage SAA links | "Chi tiết" → Sun* Kudos Live Board (/kudos), header/footer nav links to other pages |
| 10 | Homepage SAA | `2167:9026` | `.momorph/specs/2167-9026-Homepage-SAA/` | Main homepage/landing page for Sun* Annual Awards 2025. Features hero banner with "ROOT FURTHER" branding, event overview, award categories summary, and navigation to detailed sections. | Direct URL (main landing page) or redirect after countdown expires | Navigation to Awards System page, Sun* Kudos page, or other sections via header/CTAs |
| 11 | Login | `662:14387` | `.momorph/specs/662-14387-Login/` | Authentication entry point with Google OAuth. Full-page layout with ROOT FURTHER key visual branding, "LOGIN With Google" button, language selector (VN/EN), and minimal footer. | Direct URL (`/login`), middleware redirect for unauthenticated users, or logout action | Redirect to Homepage SAA (`/`) on successful login, or to original protected route via `redirect` query param |
| 12 | Sun* Kudos - Live Board | `2940:13431` | `.momorph/specs/2940-13431-sun-kudos-live-board/` | Main Kudos page: hero banner, highlight carousel (top 5 kudos), spotlight word cloud, infinite-scroll kudos feed, personal stats sidebar (hearts, secret boxes), leaderboard. Dark theme with gold accents. | Header navigation "Sun* Kudos" from any page; CTA from Homepage SAA | Kudos submission dialog (Viet Kudo), profile pages, secret box dialog, hashtag/department filter dropdowns |
| 13 | Viet Kudo (Write Kudos) | `520:11602` | `.momorph/specs/520-11602-Viet-Kudo/` | Modal dialog for composing and sending a Kudo. Includes recipient search, title/honor field, rich text editor with toolbar (B/I/S/list/link/quote), @-mentions, hashtags (max 5), image attachments (max 5), anonymous option. | Kudos input pill on Sun* Kudos Live Board | Cancel closes modal; Submit creates kudos and closes modal, returns to Live Board |
| 14 | Floating Action Button (FAB) | `313:9137` | `.momorph/specs/313_9137-floating-action-button/` | Persistent floating action button in bottom-right corner. Golden pill-shaped (106x64px) with pen icon, "/" separator, and lightning/rules icon. Expands on click to reveal two actions: write kudos and view thể lệ. Global component visible on all authenticated pages. | Always visible on authenticated pages (global component in root layout) | Click → expanded FAB (313:9139) → Write Kudos modal (520:11602) or "Thể lệ" page (/awards/rules, 3204:6051) |
| 15 | Thể lệ (Rules Panel) | `3204:6051` | `.momorph/specs/3204_6051-the-le-update/` | Right-side slide-in panel displaying Kudos rules: Hero badge tiers (4 levels for receivers), icon collection mechanic (6 badges via Secret Box for senders), and Kudos Quốc Dân (top 5 recognition). Static informational content with dark theme. | FAB expanded "Thể lệ" button (313:9139), direct URL `/awards/rules` | "Đóng" closes panel (returns to previous), "Viết KUDOS" opens Write Kudos modal (520:11602) |

---

## Flow Diagram

```
                    ┌─────────────────────────┐
                    │   Countdown - Prelaunch  │
                    │   (Standalone Page)      │
                    │   /prelaunch             │
                    └───────────┬──────────────┘
                                │ countdown expires
                                ▼
                    ┌─────────────────────────┐
                    │   Event / Main Page     │
                    │   (TBD)                 │
                    └─────────────────────────┘


    ┌─────────────────────────┐
    │   Content Editor Page   │         ┌──────────────────────┐
    │   (TBD)                 │ ──────► │   Add Link Box       │
    │                         │ trigger │   (Modal Dialog)     │
    └─────────────────────────┘         │                      │
                                        │  Cancel ──► Close    │
                                        │  Save   ──► Close    │
                                        └──────────────────────┘


    ┌─────────────────────────┐
    │   Content / List Page   │         ┌──────────────────────┐
    │   (TBD)                 │ ──────► │  Hashtag Filter      │
    │                         │ trigger │  (Dropdown)          │
    └─────────────────────────┘         │                      │
                                        │  Select ──► Close    │
                                        │  Escape ──► Close    │
                                        └──────────────────────┘


    ┌─────────────────────────┐
    │   Awards / Tagging Page │         ┌──────────────────────┐
    │   (TBD)                 │ ──────► │  Hashtag Multi-Select│
    │                         │ trigger │  (Dropdown, max 5)   │
    └─────────────────────────┘         │                      │
                                        │  Toggle ──► Stay Open│
                                        │  Escape ──► Close    │
                                        └──────────────────────┘


    ┌─────────────────────────┐
    │   Any Page              │         ┌──────────────────────┐
    │   (Global Header)       │ ──────► │  Language Dropdown    │
    │                         │ click   │  (VN / EN)           │
    └─────────────────────────┘         │                      │
                                        │  Select ──► Close    │
                                        │  (switches language) │
                                        │  Escape ──► Close    │
                                        └──────────────────────┘


    ┌─────────────────────────┐
    │   Filter / Form Page    │         ┌──────────────────────┐
    │   (TBD)                 │ ──────► │  Department Dropdown  │
    │                         │ trigger │  (Phòng ban)         │
    └─────────────────────────┘         │                      │
                                        │  Select ──► Close    │
                                        │  (applies dept filter)│
                                        │  Escape ──► Close    │
                                        └──────────────────────┘


    ┌─────────────────────────┐
    │   Any Page              │         ┌──────────────────────┐
    │   (Global Header)       │ ──────► │  Profile Dropdown     │
    │                         │ click   │  (Avatar/Name/Email)  │
    └─────────────────────────┘         │                      │
                                        │  Profile ──► Profile │
                                        │  Settings──► Settings│
                                        │  Logout  ──► Logout  │
                                        │  Escape  ──► Close   │
                                        └──────────────────────┘


    ┌─────────────────────────┐
    │   Any Page              │         ┌──────────────────────┐
    │   (Global Header,       │ ──────► │  Profile Admin       │
    │    Admin User)          │ click   │  Dropdown            │
    └─────────────────────────┘         │  (Avatar/Name/Email) │
                                        │                      │
                                        │  Profile ──► Profile │
                                        │  Admin   ──► Admin   │
                                        │  Dashboard   Dashboard│
                                        │  Settings──► Settings│
                                        │  Logout  ──► Logout  │
                                        │  Escape  ──► Close   │
                                        └──────────────────────┘


    ┌─────────────────────────┐
    │   Homepage SAA           │         ┌──────────────────────┐
    │   (Header / CTA)        │ ──────► │  Awards System        │
    └─────────────────────────┘  nav    │  (Hệ thống giải)     │
                                        │  /awards             │
    ┌─────────────────────────┐         │                      │
    │   Any Page              │ ──────► │  "Chi tiết" button   │
    │   (Header nav)          │  nav    │  ──► /kudos          │
    └─────────────────────────┘         └──────────────────────┘


    ┌─────────────────────────┐
    │   Login                  │◄──── /login (direct URL)
    │   (Google OAuth)         │◄──── Middleware redirect (unauth)
    │   /login                 │◄──── Logout action
    └───────────┬──────────────┘
                │ successful auth
                ▼
                    ┌─────────────────────────┐
                    │   Countdown - Prelaunch  │
                    │   /prelaunch             │
                    └───────────┬──────────────┘
                                │ countdown expires
                                ▼
                    ┌─────────────────────────┐
                    │   Homepage SAA           │◄──── Direct URL
                    │   (Main Landing Page)    │      (main landing page)
                    │   /                      │◄──── Login redirect
                    └───┬───────────┬──────────┘
                        │           │
           ┌────────────┘           └────────────┐
           ▼                                     ▼
    ┌──────────────────┐              ┌──────────────────────┐
    │  Awards System   │              │  Sun* Kudos          │
    │  Page            │              │  Live Board          │
    └──────────────────┘              │  /kudos              │
                                      └───┬──────┬──────┬───┘
                                          │      │      │
                          ┌───────────────┘      │      └───────────────┐
                          ▼                      ▼                      ▼
                   ┌─────────────┐     ┌──────────────────┐    ┌───────────────┐
                   │ Hashtag     │     │  Secret Box      │    │ Department    │
                   │ Multi-Select│     │  Dialog           │    │ Dropdown      │
                   │ (1002:13013)│     │  (1466:7676)     │    │ (721:5684)   │
                   └─────────────┘     └──────────────────┘    └───────────────┘

                                      │ (from Live Board input pill)
                                      ▼
                               ┌──────────────────────┐
                               │  Viet Kudo           │
                               │  (Write Kudos Modal) │
                               │  (520:11602)         │
                               └───┬──────────┬───────┘
                                   │          │
                          Cancel   │          │ Submit
                                   ▼          ▼
                               ┌──────────────────────┐
                               │  Sun* Kudos          │
                               │  Live Board          │
                               │  (feed refreshed)    │
                               └──────────────────────┘


    ┌─────────────────────────┐
    │   Any Authenticated     │         ┌──────────────────────┐
    │   Page (Global FAB)     │ ──────► │  Floating Action     │
    │                         │ click   │  Button (Expanded)   │
    └─────────────────────────┘         │  (313:9139)          │
                                        │                      │
                                        │  ✏️ Kudos ──► Viet   │
                                        │      Kudo (520:11602)│
                                        │  ⚡ Thể lệ ──►       │
                                        │      /awards/rules   │
                                        │      (3204:6051)     │
                                        │  Outside ──► Collapse│
                                        └──────────────────────┘


    ┌─────────────────────────┐
    │   FAB Expanded          │         ┌──────────────────────┐
    │   (313:9139)            │ ──────► │  Thể lệ Panel        │
    │   "Thể lệ" button      │ click   │  (Rules, 3204:6051)  │
    └─────────────────────────┘         │  /awards/rules       │
                                        │                      │
    ┌─────────────────────────┐         │  Content: Hero badge │
    │   Direct URL            │ ──────► │  tiers, 6 collection │
    │   /awards/rules         │  nav    │  badges, Kudos Quốc  │
    └─────────────────────────┘         │  Dân top 5           │
                                        │                      │
                                        │  Đóng ──► Close panel│
                                        │  Viết KUDOS ──►      │
                                        │    Viet Kudo modal   │
                                        │    (520:11602)       │
                                        └──────────────────────┘
```

---

## Notes

- There is **no direct navigation** between the Countdown page and the Add Link Box. They are independent features.
- The Countdown page is a standalone prelaunch landing page accessed before the event begins.
- The Add Link Box is a reusable modal component invoked from a content editor context (parent screen not yet specified).
- The Dropdown Hashtag Filter is a reusable dropdown component triggered from a filter button; applies single-select hashtag filtering to parent page content.
- The Dropdown List Hashtag (Multi-Select) is a reusable multi-select dropdown triggered from a "+" button; allows selecting up to 5 hashtags with checkmark indicators. Distinct from the single-select filter variant.
- The Language Dropdown is a global UI component (likely in the header/navigation) that allows switching between Vietnamese and English. It persists across all pages.
- The Dropdown Phòng ban (Department Dropdown) is a reusable dropdown component triggered from a filter or form context; allows single-select department filtering from a list of 50+ departments. Dark-themed with gold border styling consistent with other dropdowns.
- The Dropdown Profile is a global UI component (header/navigation) showing user information (avatar, name, email) with navigation options to Profile, Settings, and Logout. Dark-themed with gold border styling consistent with other dropdowns.
- The Dropdown Profile Admin extends the regular Profile Dropdown with additional admin-specific menu options (Admin Dashboard, Settings). It is shown for users with admin roles and includes the same dark-themed gold border styling. Available globally in the header/navigation for authenticated admin users.
- The Hệ thống giải (Awards System) is a full-page display at `/awards` showing all 6 SAA 2025 award categories with sidebar navigation, descriptions, quantities, and prize values. It includes a Sun* Kudos promotional section with a "Chi tiết" CTA that navigates to the Kudos Live Board (`/kudos`). Entry via header "Award Information" nav link or Homepage SAA. Exit via "Chi tiết" button and header/footer nav links.
- The Homepage SAA is the main landing page for Sun* Annual Awards 2025. It serves as the central hub featuring a hero banner with "ROOT FURTHER" branding, event overview, and award categories summary. Users arrive here via direct URL or redirect after the Countdown page expires. From the Homepage, users can navigate to the Awards System page, Sun* Kudos page, or other sections via the header navigation and CTA buttons.
- The Login screen is the authentication gateway using Google OAuth via Supabase Auth. It has a simplified header (logo + language selector only, no navigation). Unauthenticated users accessing any protected route are redirected here via Next.js middleware. On successful login, users are redirected to the Homepage SAA or their original destination via `redirect` query param.
- The Sun* Kudos Live Board is the main kudos page accessed from Homepage SAA or header navigation. It connects to the Hashtag Multi-Select dropdown (1002:13013), Department Dropdown (721:5684), Profile Preview tooltip (721:5827), and Secret Box dialog (1466:7676). Features include a highlight carousel, spotlight word cloud, infinite-scroll kudos feed, personal stats, and leaderboard. Route: `/kudos`.
- The Viet Kudo (Write Kudos) screen is a modal dialog launched from the Kudos Live Board's input pill. It provides a rich kudos composition form with recipient search (autocomplete), custom title/honor ("Danh hieu"), rich text editor with 6 toolbar actions (Bold, Italic, Strikethrough, Numbered List, Link, Quote) + @-mention support, hashtag selection (max 5, required), image attachments (max 5, optional), and anonymous sending option. Connects to Hashtag Multi-Select dropdown (1002:13013) and Add Link Box (1002:12917). Route: modal overlay on `/kudos`.
- The Floating Action Button (FAB) is a global UI component (root layout) that provides quick access to two primary actions: writing kudos (pen icon → Viet Kudo modal 520:11602) and viewing thể lệ/rules (lightning icon → /awards/rules, 3204:6051). It appears as a golden pill-shaped button (106x64px, #FFEA9E) with a golden glow shadow (#FAE287) in the bottom-right corner. Clicking expands it to the expanded state (313:9139) showing two labeled buttons ("Thể lệ" 149x64px, "Viết KUDOS" 214x64px) and a red close button (56x56px, #D4271D). Only visible to authenticated users.
- The Thể lệ (Rules Panel) is an informational slide-in panel at `/awards/rules` displaying the complete Kudos reward system rules. It contains three sections: (1) Kudos Receiver Hero badge tiers — New Hero (1-4 senders), Rising Hero (5-9), Super Hero (10-20), Legend Hero (20+), each displayed with a styled badge pill and description; (2) Kudos Sender icon collection — every 5 hearts on posted Kudos opens a Secret Box revealing one of 6 collectible icons (REVIVAL, TOUCH OF LIGHT, STAY GOLD, FLOW TO HORIZON, BEYOND THE BOUNDARY, ROOT FURTHER), completing the set earns a mystery gift; (3) Kudos Quốc Dân — top 5 most-hearted Kudos earn special recognition. Entry via FAB expanded state (313:9139) "Thể lệ" button or direct URL. Exit via "Đóng" (close panel) or "Viết KUDOS" (opens Write Kudos modal 520:11602). No API calls — static content.
- Additional screens will be added to this document as they are specified.
