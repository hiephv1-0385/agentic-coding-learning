# Feature Specification: Login Screen

**Frame**: `662:14387` — Login
**Figma File**: `9ypp4enmFmdK3YAFJLIu6C`
**Created**: 2026-03-10
**Reviewed**: 2026-03-10 (pass 8 — approved)

---

## Overview

The Login screen is the authentication entry point for Sun* Annual Awards 2025. It features a visually immersive full-page layout with the "ROOT FURTHER" key visual branding, a single Google OAuth login button, and a language selector. The screen is minimal by design — authentication is handled entirely via Supabase Auth with Google OAuth provider.

**Target users**: Sun* employees (Sunners) who need to log in to access SAA 2025 features (awards, kudos, profile).

**Business context**: SAA 2025 uses Google Workspace accounts for authentication. All Sunners already have `@sun-asterisk.com` Google accounts, making Google OAuth the single sign-on method.

**Route**: `src/app/(auth)/login/page.tsx` (per constitution: auth pages use `(auth)` route group)

---

## User Stories

### US1: Google OAuth Login [P1]

**As a** Sunner
**I want to** log in using my Google account
**So that** I can access SAA 2025 features securely without creating a new account

#### Acceptance Scenarios

**Scenario 1: Successful Login (Happy Path)**
- Given: User is on the login page and not authenticated
- When: User clicks "LOGIN With Google" button
- Then: User is redirected to Google OAuth consent screen (full-page redirect, not popup)
- And: After successful Google authentication, user is redirected to the Homepage SAA (`/`)
- And: User session is created and persisted via Supabase cookies

**Scenario 2: Login with non-allowed domain**
- Given: User is on the login page
- When: User authenticates with a Google account NOT in the allowed domain
- Then: Authentication fails (enforced by Supabase Auth provider config — no custom validation needed in callback)
- And: User is redirected to `/login?error=auth_failed`
- And: User sees an error message: "Đăng nhập thất bại. Vui lòng thử lại."
- And: User remains on the login page

**Scenario 3: User cancels Google OAuth**
- Given: User clicked "LOGIN With Google" and was redirected to Google consent screen
- When: User clicks "Cancel" or navigates back from Google consent
- Then: User is redirected back to the login page with no error shown
- And: No session is created

**Scenario 4: Network error during login**
- Given: User clicks "LOGIN With Google"
- When: Network request fails (timeout, server error)
- Then: User sees an error message: "Đã xảy ra lỗi. Vui lòng thử lại."
- And: Login button returns to default state (not stuck in loading)

**Scenario 5: Already authenticated user visits login page**
- Given: User already has a valid session
- When: User navigates to `/login`
- Then: User is automatically redirected to Homepage SAA (`/`)
- And: If `redirect` query param is present, redirect to that path instead

**Scenario 6: Login with redirect query param**
- Given: User was redirected to `/login?redirect=/kudos` from a protected route
- When: User successfully authenticates via Google OAuth
- Then: User is redirected to `/kudos` (the original protected route) instead of `/`
- And: The `redirect` param is passed through the OAuth callback flow

**Scenario 7: Login button loading state**
- Given: User clicks "LOGIN With Google"
- When: OAuth flow is initiating (before redirect to Google)
- Then: Button shows loading spinner replacing the Google icon (text stays "LOGIN With Google")
- And: Button is disabled (`pointer-events: none`, `opacity: 0.7`) to prevent double-click
- And: Since this is a redirect flow, loading state is brief (< 1s typically)

### US2: Language Selection [P2]

**As a** Sunner
**I want to** switch the interface language between Vietnamese and English
**So that** I can use SAA 2025 in my preferred language

#### Acceptance Scenarios

**Scenario 1: View current language**
- Given: User is on the login page
- When: Page loads
- Then: Language selector shows current language with flag icon (default: VN with Vietnam flag)

**Scenario 2: Open language dropdown**
- Given: User sees the language selector in the header
- When: User clicks on the language selector
- Then: A dropdown appears with language options (VN, EN) with corresponding flag icons
- And: Current selection is highlighted

**Scenario 3: Switch language**
- Given: Language dropdown is open
- When: User selects a different language (e.g., EN)
- Then: Dropdown closes
- And: All UI text on the page updates to the selected language
- And: Language preference is persisted (cookie or localStorage)

**Scenario 4: Close dropdown without selection**
- Given: Language dropdown is open
- When: User clicks outside the dropdown or presses Escape
- Then: Dropdown closes
- And: Language remains unchanged

### US3: Branding & Visual Experience [P3]

**As a** Sunner
**I want to** see the ROOT FURTHER branding and key visual on the login page
**So that** I feel engaged with the SAA 2025 event theme from the first interaction

#### Acceptance Scenarios

**Scenario 1: Page renders correctly**
- Given: User navigates to `/login`
- When: Page loads
- Then: Full-page key visual background is displayed
- And: "ROOT FURTHER" heading is prominently visible
- And: Description text is readable over the background
- And: Login button is clearly visible and accessible

**Scenario 2: Responsive layout**
- Given: User accesses login page on mobile device
- When: Page renders at < 640px width
- Then: Layout adapts to mobile: smaller heading (48px), left-aligned content with 24px padding
- And: Login button is 305px width (or `max-w-[305px] w-full` if viewport is narrower)
- And: Key visual background remains visible and attractive

---

## UI/UX Requirements

### Components

| Component | Type | Description |
|-----------|------|-------------|
| LoginHeader | Server Component | Simplified header with logo + LanguageSelector child. NOT the shared `Header` component — no nav links, no bell, no profile. |
| LoginHero | Server Component | Full-viewport hero with background image, gradient overlay, content. Wraps LoginButton (Client). |
| LoginButton | Client Component | Google OAuth trigger button with loading/error/disabled states. Calls `supabase.auth.signInWithOAuth`. |
| LanguageSelector | Client Component | Dropdown trigger for VN/EN language switch. Reusable across Login and other headers. |
| LoginFooter | Server Component | Minimal footer with copyright text and top border divider. NOT the shared `Footer` component — no nav links, no logo. |
| GoogleIcon | Static inline SVG | Google "G" multicolor logo (inline SVG, not external asset). |

> **Error message** is rendered as a sub-element within `LoginButton` (not a separate component). It appears as a `<p role="alert">` below the button when `error` state is non-null. Auto-dismisses after 5s for domain errors. See `design-style.md` section E.

### Visual Specifications

See `design-style.md` for complete visual specs including:
- Color tokens and usage
- Typography details for all text elements
- Spacing and layout values
- Component state definitions (hover, focus, active, disabled, loading)
- ASCII layout diagrams for desktop and mobile
- Implementation mapping table

### Layout

- **Single-viewport layout**: `h-screen` — entire page fits within one viewport, no scrolling
- **Flex column structure**: `h-screen flex flex-col` — Header (normal flow, top) → Hero (`flex-1`, fills remaining space) → Footer (normal flow, bottom)
- **Header is NOT fixed/sticky**: Since there's no scrolling, header is in normal document flow (no `position: fixed/sticky`)
- **Content alignment**: Left-aligned on desktop, left-aligned on mobile with smaller padding
- **Background**: Full-bleed key visual image (`absolute inset-0` on page wrapper) with left-to-right gradient overlay. Image covers the ENTIRE viewport (behind header and footer too). Header, hero, footer all use `z-10` to sit above the background.

### Responsive Behavior

| Breakpoint | Behavior |
|------------|----------|
| Mobile (< 640px) | Stacked layout, smaller heading (48px), left-aligned content, padded 24px (px-6) |
| Tablet (640-1023px) | Intermediate sizing, heading ~80px, padded 48px |
| Desktop (>= 1024px) | Full design as specified, heading 120px, left padding 144px |

### Accessibility

- All interactive elements meet WCAG 2.1 AA contrast requirements
- Login button has clear focus indicator (visible outline)
- Language selector is keyboard-navigable (Enter/Space to open, Arrow keys to navigate, Escape to close)
- Screen reader announces: page title, heading, description, button label
- Background image is decorative (`aria-hidden`)
- Loading state announced via `aria-live` region

---

## Data Requirements

### Input Fields

| Field | Type | Validation | Notes |
|-------|------|------------|-------|
| N/A | — | — | No manual input; Google OAuth handles all credential collection |

### Display Fields

| Field | Source | Description |
|-------|--------|-------------|
| ROOT FURTHER | Static | Heading text (hardcoded) |
| Description text | Static / i18n | Two-line description (localized) |
| Button text | Static / i18n | "LOGIN With Google" (localized) |
| Copyright | Static / i18n | "Bản quyền thuộc về Sun* (C) 2025" |
| Language indicator | Client state | Current language code + flag |

### Data Relationships

- **Supabase Auth**: Google OAuth provider configuration
- **User profile**: Created/updated on first login via Supabase Auth trigger or client-side check
- **Session**: Managed by Supabase Auth, persisted via cookies (SSR-compatible)

---

## API Requirements (Predicted)

| Endpoint | Method | Purpose |
|----------|--------|---------|
| Supabase Auth `signInWithOAuth` | SDK call | Initiate Google OAuth flow |
| Supabase Auth `getUser` | SDK call | Check existing session on page load |
| `/auth/callback` | GET | OAuth callback route (handles code exchange) |

### Authentication Flow

1. User clicks "LOGIN With Google"
2. LoginButton reads `redirect` from URL search params (if present)
3. Client calls `supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: '{origin}/auth/callback?redirect={redirect}' } })`
4. User is redirected to Google consent screen (full-page redirect)
5. After consent, Google redirects to `/auth/callback?code={code}&redirect={redirect}`
6. `/auth/callback` route handler exchanges code for session via `supabase.auth.exchangeCodeForSession(code)`
7. On success, redirect to `redirect` param value or `/` (Homepage SAA) as default
8. On failure, redirect to `/login?error=auth_failed`

### Callback Route (`src/app/auth/callback/route.ts`)

> Note: This is NOT inside the `(auth)` route group — it's a standalone API route at `/auth/callback`.

```
GET /auth/callback?code={code}&redirect={redirect}
- Exchange code for Supabase session via `exchangeCodeForSession(code)`
- Set session cookie (handled by Supabase SSR)
- Redirect to `redirect` param (validated, default `/`) on success
- Redirect to `/login?error=auth_failed` on failure
- Validate `redirect` is a relative path (prevent open redirect vulnerability)
```

### Middleware Changes Required (scoped to Login feature)

The existing middleware (`src/middleware.ts`) currently only refreshes sessions. Must be updated as part of the Login feature implementation:

**Protected routes** (require authentication):
- `/kudos` and `/kudos/*`

**Public routes** (no auth required):
- `/` (Homepage SAA)
- `/awards` and `/awards/*`
- `/login`
- `/auth/callback`

**Middleware logic:**
1. Refresh session (existing behavior — keep)
2. Check if current path matches a protected route
3. If protected AND `getUser()` returns no user → redirect to `/login?redirect={currentPath}`
4. If `/login` AND `getUser()` returns a valid user → redirect to `redirect` param or `/`
5. Set security headers (existing behavior — keep)

---

## State Management

### Local Component State

| State | Component | Type | Description |
|-------|-----------|------|-------------|
| `isLoading` | LoginButton | `boolean` | True while OAuth flow is initiating (set true on click, reset on error/cancel) |
| `error` | LoginButton | `string \| null` | Error message from failed auth, read from URL `?error=` param on mount |
| `isLangOpen` | LanguageSelector | `boolean` | Language dropdown open/closed |
| `locale` | LanguageSelector | `'vi' \| 'en'` | Selected language |

### URL-driven State

| Param | Type | Description |
|-------|------|-------------|
| `?redirect={path}` | `string` | Original protected route to redirect to after login |
| `?error=auth_failed` | `string` | Set by callback route on auth failure, read by LoginButton to show error |

### Global State

- **Session**: Managed by Supabase Auth (cookie-based, SSR-compatible)
- **Language preference**: Stored in cookie or localStorage, read on server for SSR

### Cache Requirements

- None specific to login page
- Session token cached by Supabase client library

---

## Navigation

### Entry Points

| From | Trigger | Route |
|------|---------|-------|
| Direct URL | User navigates to `/login` | `/login` |
| Middleware redirect | Unauthenticated user accesses protected route | `/login?redirect={originalPath}` |
| Logout action | User clicks Logout from profile dropdown | `/login` |

### Exit Points

| To | Trigger | Route |
|----|---------|-------|
| Homepage SAA | Successful login | `/` |
| Original page | Successful login with `redirect` query param | `/{redirect}` |
| Google OAuth | Click login button | External (accounts.google.com) |

---

## Error Handling

> Error messages are displayed below the login button. See `design-style.md` section E for visual specs.

| Error | User Message (VN) | Behavior |
|-------|-------------------|----------|
| OAuth cancelled | (none) | Stay on login page silently, button returns to default |
| Invalid domain | Handled by Supabase Auth config | Supabase rejects at provider level → callback receives error → redirects to `/login?error=auth_failed`. No custom domain-check code needed. |
| Network error | "Đã xảy ra lỗi. Vui lòng thử lại." | Show error below button, button returns to default |
| Server error | "Đã xảy ra lỗi. Vui lòng thử lại." | Show error below button, button returns to default |
| Callback error (`?error=auth_failed`) | "Đăng nhập thất bại. Vui lòng thử lại." | Read from URL param on mount, show error, clear param from URL. Covers: invalid domain, expired code, any Supabase auth failure. |

Error messages use `role="alert"` for screen reader announcement and `#FF6B6B` color.

---

## Dependencies

- **Supabase Auth**: Google OAuth provider must be configured
- **Google Cloud Console**: OAuth client ID with authorized redirect URIs
- **Homepage SAA**: Must exist as redirect target after login
- **Language Dropdown component** (Frame `721:4942`): Reusable component for VN/EN switch
