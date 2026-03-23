# Implementation Plan: Login Screen

**Frame**: `662:14387` — Login
**Date**: 2026-03-11
**Spec**: `specs/662-14387-Login/spec.md`
**Reviewed**: 2026-03-11 (plan review pass 4 — approved, no new issues)

---

## Summary

Build the authentication entry point for SAA 2025 using Supabase Auth with Google OAuth. The Login screen features a full-viewport immersive layout with ROOT FURTHER branding, a single "LOGIN With Google" button, a language selector (VN/EN), and a minimal footer. Implementation includes the OAuth callback handler (with error/cancel handling), middleware updates for protected route enforcement (with cookie propagation on redirects), and the LanguageSelector as a reusable component.

---

## Technical Context

**Language/Framework**: TypeScript (strict) / Next.js 15.x (App Router)
**Primary Dependencies**: React 19, TailwindCSS 4, @supabase/ssr, @supabase/supabase-js, Zod
**Database**: N/A (auth only — Supabase Auth manages sessions)
**Testing**: Vitest + @testing-library/react
**State Management**: Local component state (`useState`) + URL-driven state (`searchParams`)
**API Style**: Supabase SDK calls + Next.js Route Handler (callback)

---

## Constitution Compliance Check

*GATE: Must pass before implementation can begin*

- [x] **I. Clean Code** — TypeScript strict, PascalCase components, `@/*` imports, one component per file, feature-based folder structure
- [x] **II. Responsive Design** — Mobile-first with 3 breakpoints (< 640px, sm:, lg:), Flexbox layout, 44px+ touch targets on button
- [x] **III. Test-First Development** — Integration tests for happy path + error scenarios, co-located test files, mock Supabase at boundary (not internal modules)
- [x] **IV. Security (OWASP)** — Server-side session check via middleware, Zod validation for redirect param (open redirect prevention), no `dangerouslySetInnerHTML`, CSRF via Supabase built-in, secrets only in server env vars
- [x] **V. Platform Best Practices** — Server Components by default, `"use client"` only for LoginButton + LanguageSelector, `next/image` for all images, `next/link` for logo, data fetching in middleware/server (no `useEffect` fetch), Supabase Auth SDK (no custom auth logic), Cloudflare Workers compatible (no Node.js native modules)

**Violations**: None

---

## Architecture Decisions

### Frontend Approach

- **Component Structure**: Feature-based — `src/components/auth/` for Login-specific components
- **Server vs Client split**:
  - **Server Components**: `LoginPage` (page), `LoginHeader`, `LoginHero`, `LoginFooter` — no interactivity needed
  - **Client Components**: `LoginButton` (OAuth trigger + loading/error states), `LanguageSelector` (dropdown toggle)
- **Styling Strategy**: Tailwind utility classes only. 3 new color tokens added to `globals.css @theme inline`. Button hover/active use arbitrary values (`bg-[#FFE07A]`, `active:bg-[#FFD754]`) per design-style.md decision — not promoted to tokens since they're Login-specific. No `@apply`.
- **Data Fetching**: No data fetching on the login page itself. Session check is handled exclusively by middleware (see below). The page is a pure presentational Server Component that composes its children.
- **Search params via Server Component props (NOT `useSearchParams`)**: The login page receives `searchParams` as a prop (Next.js 15 App Router convention: `{ searchParams: Promise<{ error?: string; redirect?: string }> }`). The page awaits and passes `error` and `redirect` as props to `LoginButton`. This avoids `useSearchParams()` in the Client Component, which would require a `<Suspense>` boundary and force the page to opt into client-side rendering. This approach aligns with constitution V: "Data fetching MUST happen in Server Components."
- **No `(auth)` layout file needed**: The root `layout.tsx` is minimal (fonts + body wrapper) and applies correctly. No custom `(auth)/layout.tsx` required.
- **No `loading.tsx` / `error.tsx` for login route**: The login page has no async data fetching and no server-side operations that could fail. Route-level UX states are not needed.

### Backend Approach

- **Auth Callback** (`/auth/callback`): Next.js Route Handler (GET). Handles two scenarios:
  1. **Success**: Receives `code` param → exchanges via `exchangeCodeForSession(code)` → redirects to validated `redirect` or `/`
  2. **Error/Cancel**: Receives `error` param (OAuth cancelled, denied, or provider error) → redirects to `/login?error=auth_failed` (or silently to `/login` if error indicates user cancellation)
  - Validates `redirect` param with Zod (must be relative path starting with `/`, no `://` protocol) to prevent open redirect vulnerability.
- **Middleware** (`src/middleware.ts`): Extend existing with protected route logic.
  - **Critical implementation detail**: When middleware needs to redirect (e.g., unauthenticated user → `/login`), it creates a `NextResponse.redirect()`. This new response does NOT carry the session cookies that Supabase set during `getUser()`. Must copy all cookies from `supabaseResponse` to the redirect response before returning it. Pattern:
    ```
    const redirectResponse = NextResponse.redirect(url)
    supabaseResponse.cookies.getAll().forEach(cookie => {
      redirectResponse.cookies.set(cookie.name, cookie.value, cookie)
    })
    return redirectResponse
    ```

### Integration Points

- **Existing Supabase clients**: Reuse `@/libs/supabase/server` (callback route), `@/libs/supabase/middleware` (middleware), and `@/libs/supabase/client` (LoginButton)
- **Redirect validation utility**: Extract Zod schema for redirect param validation into a shared utility (e.g., `src/utils/validateRedirect.ts`) — used by both callback route and middleware to prevent open redirect. Schema: must start with `/`, must NOT contain `://`, must NOT start with `//`.
- **Existing assets**: `hero-banner.png`, `logo-saa.png` from `public/images/`
- **Existing fonts**: SVN-Gotham (`--font-gotham`), Montserrat (`--font-montserrat`) already loaded in `layout.tsx`
- **Language Dropdown spec**: Frame `721:4942` defines the LanguageSelector dropdown — build as reusable component in `src/components/shared/` (used by both LoginHeader and future shared Header)

---

## Project Structure

### Documentation (this feature)

```text
.momorph/specs/662-14387-Login/
├── spec.md              # Feature specification ✅
├── design-style.md      # Design specifications ✅
├── plan.md              # This file ✅
└── tasks.md             # Task breakdown (next step)
```

### Source Code (affected areas)

```text
# New Files
src/
├── app/
│   ├── (auth)/
│   │   └── login/
│   │       ├── page.tsx                    # Login page (Server Component)
│   │       └── __tests__/
│   │           └── page.test.tsx           # Login page render tests
│   └── auth/
│       └── callback/
│           ├── route.ts                    # OAuth callback handler (Route Handler)
│           └── __tests__/
│               └── route.test.ts           # Callback route tests
├── components/
│   ├── auth/
│   │   ├── LoginHeader.tsx                 # Simplified header (Server Component)
│   │   ├── LoginHero.tsx                   # Hero content wrapper (Server Component)
│   │   ├── LoginButton.tsx                 # Google OAuth button (Client Component)
│   │   ├── LoginFooter.tsx                 # Minimal footer (Server Component)
│   │   ├── GoogleIcon.tsx                  # Multicolor Google "G" inline SVG (standalone)
│   │   └── __tests__/
│   │       └── LoginButton.test.tsx        # LoginButton interaction tests
│   └── shared/
│       ├── LanguageSelector.tsx            # VN/EN dropdown (Client Component, reusable)
│       └── __tests__/
│           └── LanguageSelector.test.tsx   # LanguageSelector interaction tests
├── utils/
│   └── validateRedirect.ts                 # Shared Zod schema for redirect param validation
└── middleware.ts                            # (modified — see below)
```

### Modified Files

| File | Changes |
|------|---------|
| `src/app/globals.css` | Add 3 new color tokens to `@theme inline`: `--color-text-cream`, `--color-footer-border`, `--color-error-text` |
| `src/middleware.ts` | Add protected route matching (`/kudos`, `/kudos/*`), authenticated user redirect from `/login`, cookie propagation on redirect responses |

### New Files Summary

| File | Type | Purpose |
|------|------|---------|
| `src/app/(auth)/login/page.tsx` | Server Component | Login page — composes Header, Hero, Button, Footer with full-viewport layout |
| `src/app/auth/callback/route.ts` | Route Handler | OAuth callback — exchanges code for session, handles error/cancel, validates redirect |
| `src/components/auth/LoginHeader.tsx` | Server Component | Simplified header: logo (linked to `/`) + LanguageSelector |
| `src/components/auth/LoginHero.tsx` | Server Component | Hero content: ROOT FURTHER heading + description + LoginButton slot |
| `src/components/auth/LoginButton.tsx` | Client Component | Google OAuth trigger with loading/error/disabled states |
| `src/components/auth/LoginFooter.tsx` | Server Component | Minimal footer: border-top + centered copyright text |
| `src/components/auth/GoogleIcon.tsx` | Static Component | Multicolor Google "G" logo as inline SVG (standalone — NOT added to `Icon.tsx` because `Icon.tsx` uses single-color `fill="currentColor"` pattern, incompatible with multicolor SVG) |
| `src/components/shared/LanguageSelector.tsx` | Client Component | VN/EN dropdown with flag icons, keyboard nav, cookie persistence |
| `src/utils/validateRedirect.ts` | Utility | Zod schema for redirect param validation (shared by callback route + middleware) — must start with `/`, no `://`, no `//` |

### Dependencies

No new packages required. All dependencies already present:
- `@supabase/ssr` ^0.8.0 — SSR auth with cookies
- `@supabase/supabase-js` ^2.90.1 — OAuth SDK
- `zod` ^4.3.6 — Redirect param validation

---

## Implementation Strategy

### Phase 0: Asset & Token Preparation

- Add 3 new color tokens to `globals.css` `@theme inline`:
  - `--color-text-cream: #E8DCC8` (description text)
  - `--color-footer-border: #2E3940` (footer divider)
  - `--color-error-text: #FF6B6B` (error messages)
- **Not adding** `--color-btn-hover` (`#FFE07A`) or `--color-btn-active` (`#FFD754`) as tokens — these are Login-specific and will use Tailwind arbitrary values (`hover:bg-[#FFE07A]`, `active:bg-[#FFD754]`) per design-style.md decision.
- Create `GoogleIcon.tsx` as standalone component (NOT in `Icon.tsx`) — multicolor SVG with 4 Google brand colors (blue `#4285F4`, red `#EA4335`, yellow `#FBBC05`, green `#34A853`). Existing `Icon.tsx` uses `fill="currentColor"` pattern for single-color icons, which is incompatible.
- No media downloads needed — reuse existing `hero-banner.png` and `logo-saa.png`

### Phase 1: Auth Infrastructure (US1 — Backend)

- **Auth callback route** (`src/app/auth/callback/route.ts`):
  - GET handler: extract `code`, `redirect`, `error`, `error_description` from searchParams
  - **Success path** (`code` present):
    - Validate `redirect` with Zod: must be relative path starting with `/`, no `://` (prevent open redirect)
    - Create Supabase server client, exchange code via `exchangeCodeForSession(code)`
    - On success → redirect to validated `redirect` or `/`
    - On exchange failure → redirect to `/login?error=auth_failed`
  - **Error/cancel path** (`error` present, no `code`):
    - If `error === 'access_denied'` (user cancelled) → redirect to `/login` (no error shown, per US1 Scenario 3)
    - Otherwise → redirect to `/login?error=auth_failed`
  - **No params** → redirect to `/login` (safety fallback)
- **Middleware update** (`src/middleware.ts`):
  - Define protected route patterns: `/kudos`, `/kudos/*`
  - Define public routes: `/`, `/awards`, `/awards/*`, `/login`, `/auth/callback`
  - Logic (after existing `getUser()` call):
    1. If protected route AND `getUser()` returns no user → redirect to `/login?redirect={currentPath}`
    2. If `/login` AND `getUser()` returns valid user → **validate `redirect` param** (same Zod schema as callback: relative path, no `://`, no `//`) → redirect to validated `redirect` or `/`
    3. Otherwise → return `supabaseResponse` (existing behavior)
  - **Cookie propagation on redirect**: When creating `NextResponse.redirect()`, copy all cookies from `supabaseResponse` to the redirect response (session refresh cookies must not be lost).
  - Keep existing security headers on all responses (including redirects).

### Phase 2: Login Page UI (US1 + US3 — Frontend)

- **LoginPage** (`src/app/(auth)/login/page.tsx`):
  - Server Component — **no session check here** (middleware handles redirect for authenticated users, avoiding a redundant `getUser()` call)
  - Receives `searchParams` prop: `{ searchParams: Promise<{ error?: string; redirect?: string }> }`
  - Awaits `searchParams`, passes `error` and `redirect` as props to `LoginButton` (avoids `useSearchParams()` in Client Component — no `<Suspense>` needed)
  - Full-page layout: `h-screen flex flex-col bg-page-bg relative`
  - Background image: `next/image` with `fill`, `priority`, `hero-banner.png`, `aria-hidden="true"`, `alt=""`
  - Gradient overlay: `<div>` with inline style `background: linear-gradient(to right, rgba(0,16,26,0.85) 0%, rgba(0,16,26,0.1) 60%, transparent 100%)` — NOT Tailwind `via` (design requires 60% midpoint, Tailwind defaults to 50%)
  - Composes: `LoginHeader` → `LoginHero` (wraps `LoginButton`) → `LoginFooter`
- **LoginHeader** (`src/components/auth/LoginHeader.tsx`):
  - Server Component
  - `h-20`, `bg-header-bg`, `backdrop-blur-md`, `z-10`, flex row justify-between
  - Logo: `next/image` 64x60px linked to `/` via `next/link`
  - Right side: `<LanguageSelector />` (Client Component child)
  - Responsive padding: `px-4 sm:px-12 lg:px-[72px]`
- **LoginHero** (`src/components/auth/LoginHero.tsx`):
  - Server Component
  - `flex-1`, `z-10`, flex column `justify-start`
  - Responsive padding: `pt-[60px] lg:pt-[120px] px-6 sm:px-12 lg:px-0 lg:pl-36`
  - `<h1>` ROOT FURTHER: SVN-Gotham, `font-normal` (NOT `font-bold` — font file itself renders bold), responsive sizes `text-[48px] sm:text-[80px] lg:text-[120px]`
  - Description `<p>`: Montserrat, `font-medium`, `text-text-cream`, responsive sizes, `mt-10` (40px gap)
  - Accepts `children: React.ReactNode` — renders children in a `<div className="mt-6">` wrapper (24px gap from description). LoginPage passes `<LoginButton>` as children, so LoginHero stays auth-agnostic.
- **LoginButton** (`src/components/auth/LoginButton.tsx`):
  - Client Component (`"use client"`)
  - **Props**: `{ error?: string; redirect?: string }` — passed directly from LoginPage as child of LoginHero (no `useSearchParams()`, no prop drilling through LoginHero)
  - Calls `supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: '{origin}/auth/callback?redirect={redirect}' } })`
  - On mount: if `error` prop is set → sets error state → clears `?error=` from URL via `window.history.replaceState`
  - Error message: `<p role="alert">` below button, `text-error-text`, `text-sm font-medium`, `mt-3 max-w-[305px]`, responsive text alignment `text-center sm:text-left` (per design-style.md Section E), fade-in animation on appear
  - Error messages (with distinct dismiss behavior per spec):
    - `error` prop = `"auth_failed"` → "Đăng nhập thất bại. Vui lòng thử lại." → **auto-dismiss after 5s** (URL-based error, stale after re-landing)
    - Network/SDK error → "Đã xảy ra lỗi. Vui lòng thử lại." → **persists until next click** (actionable, user should retry)
  - `signInWithOAuth` returns `{ data, error }` (does NOT throw). Handle error via return value check: `if (error) { setError(...); setIsLoading(false); return; }`. Wrap the call in try/catch as safety net for network-level failures only.
  - `aria-label="Đăng nhập bằng Google"` on button element (per design-style.md Accessibility)
  - Button states per design-style.md: default (`bg-gold-primary`), hover (`bg-[#FFE07A]` + shadow), active (`bg-[#FFD754]`), focus (`outline-2 outline-gold-primary outline-offset-2`), disabled (`bg-gray-400 cursor-not-allowed`), loading (`opacity-70 pointer-events-none` + spinner replaces GoogleIcon)
  - Loading spinner: `w-6 h-6 animate-spin text-page-bg` (24x24px, same position as Google icon)
  - Loading state accessibility: wrap spinner area in `<span aria-live="polite">` to announce loading to screen readers (per spec.md Accessibility: "Loading state announced via `aria-live` region")
- **LoginFooter** (`src/components/auth/LoginFooter.tsx`):
  - Server Component
  - `<footer>` semantic element
  - `h-16`, `z-10`, `border-t border-footer-border`, flex center
  - Copyright text: Montserrat 14px regular, white
  - Responsive padding: `px-4 lg:px-[72px]`

### Phase 3: Language Selector (US2)

- **LanguageSelector** (`src/components/shared/LanguageSelector.tsx`):
  - Client Component with dropdown state (`isOpen`, `locale`)
  - Trigger: Flag icon (inline SVG, 20x14px) + "VN"/"EN" text (14px bold white) + chevron-down (12px, rotates 180deg when open)
  - Dropdown: VN/EN options with flag icons, current selection highlighted
  - Close behavior: select option, click outside (via `useEffect` document listener), Escape key
  - Persists preference in cookie `locale` (for SSR readability)
  - Keyboard navigation: Enter/Space to open, Arrow keys to navigate options, Escape to close
  - ARIA: `aria-haspopup="listbox"`, `aria-expanded`, `aria-label="Chọn ngôn ngữ"`
  - Hover state: text color changes to `gold-primary`
  - Focus state: `outline-2 outline-gold-primary outline-offset-2`

### Phase 4: Polish & Error Handling

- Error message fade-in animation: CSS transition on opacity (0 → 1) when error appears, per design-style.md Section E
- Error auto-dismiss: **only for URL-based errors** (`auth_failed`) — `setTimeout` 5s, then fade-out and clear. Network/SDK errors persist until next user interaction.
- Responsive verification: test all 3 breakpoints against design-style.md layout diagrams
- Accessibility audit: focus indicators (gold outline), ARIA labels, screen reader announcements (`role="alert"` for errors, `aria-live` implicit)
- Clean URL: remove `?error=` from URL after reading (via `window.history.replaceState`)

---

## Integration Testing Strategy

### Test Scope

- [x] **Component interactions**: LoginButton ↔ Supabase Auth SDK, LanguageSelector state
- [x] **External dependencies**: Supabase Auth (mock at SDK boundary)
- [x] **User workflows**: Full login flow, error handling, redirect behavior, OAuth cancellation

### Test Categories

| Category | Applicable? | Key Scenarios |
|----------|-------------|---------------|
| UI ↔ Logic | Yes | LoginButton click → OAuth initiation, error display from URL params |
| App ↔ External API | Yes | Supabase `signInWithOAuth`, `exchangeCodeForSession` |
| Cross-platform | Yes | Responsive layout at 3 breakpoints |

### Test Environment

- **Environment type**: Local (Vitest + jsdom)
- **Test data strategy**: Mock Supabase client responses
- **Isolation approach**: Fresh state per test, mock Supabase at SDK boundary

### Mocking Strategy

| Dependency Type | Strategy | Rationale |
|-----------------|----------|-----------|
| Supabase Auth SDK | Mock | External service — mock `signInWithOAuth`, `getUser`, `exchangeCodeForSession` |
| Next.js navigation | Mock | `redirect` (server), `NextResponse` (middleware/callback), `window.history.replaceState` (LoginButton URL cleanup) |
| Cookies | Mock | `next/headers` cookies for server-side tests |

### Test Scenarios Outline

1. **Happy Path**
   - [ ] LoginButton initiates OAuth with correct provider and redirectTo URL
   - [ ] LoginButton passes `redirect` search param through to OAuth redirectTo
   - [ ] Callback route exchanges code and redirects to `/`
   - [ ] Callback route redirects to `?redirect=` path when present and valid
   - [ ] Middleware redirects unauthenticated user from `/kudos` to `/login?redirect=/kudos`
   - [ ] Middleware redirects authenticated user from `/login` to `/`
   - [ ] Middleware allows unauthenticated access to public routes (`/`, `/awards`, `/login`)

2. **Error Handling**
   - [ ] LoginButton shows "Đăng nhập thất bại..." when `?error=auth_failed` in URL
   - [ ] LoginButton shows "Đã xảy ra lỗi..." when `signInWithOAuth` returns error or network fails
   - [ ] URL-based error (`auth_failed`) auto-dismisses after 5 seconds; network errors persist
   - [ ] Error param is cleaned from URL after reading
   - [ ] Callback route redirects to `/login?error=auth_failed` on code exchange failure
   - [ ] Callback route rejects non-relative `redirect` param (open redirect prevention)
   - [ ] Callback route rejects `redirect` param containing `://` (protocol injection)

3. **Edge Cases**
   - [ ] Callback route handles OAuth cancellation (`error=access_denied`) → redirects to `/login` silently (no error param)
   - [ ] Callback route handles missing `code` and `error` params → redirects to `/login`
   - [ ] LoginButton loading state disables button and shows spinner during OAuth initiation
   - [ ] LanguageSelector toggles VN/EN and persists preference in cookie
   - [ ] LanguageSelector closes on Escape key and outside click
   - [ ] LanguageSelector is keyboard-navigable (Enter/Space/Arrow keys)
   - [ ] Middleware preserves session cookies on redirect responses
   - [ ] Middleware validates `redirect` param before redirecting authenticated user (rejects `://`, `//`)

### Test File Locations

| Test File | Tests For |
|-----------|-----------|
| `src/app/(auth)/login/__tests__/page.test.tsx` | LoginPage rendering, component composition |
| `src/app/auth/callback/__tests__/route.test.ts` | Callback handler: code exchange, error handling, redirect validation |
| `src/components/auth/__tests__/LoginButton.test.tsx` | OAuth initiation, loading state, error display, conditional auto-dismiss |
| `src/components/shared/__tests__/LanguageSelector.test.tsx` | Dropdown toggle, keyboard nav, cookie persistence |
| `src/middleware.test.ts` (or `src/__tests__/middleware.test.ts`) | Protected route redirect, login redirect, cookie propagation |

### Coverage Goals

| Area | Target | Priority |
|------|--------|----------|
| Auth flow (LoginButton + callback) | 90%+ | High |
| Middleware redirect logic | 85%+ | High |
| UI components (Header, Hero, Footer) | 70%+ | Medium |
| LanguageSelector interactions | 75%+ | Medium |

---

## Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Supabase OAuth redirect not working in Cloudflare Workers | Low | High | Test with `@opennextjs/cloudflare` adapter locally; Supabase SSR cookie-based flow is Workers-compatible. No Node.js native modules used. |
| SVN-Gotham font weight rendering inconsistency | Low | Medium | Font registered as weight 400 in layout.tsx; always use `font-normal` (never `font-bold`) per design-style.md note. The font file itself renders as bold. |
| Open redirect vulnerability via `?redirect=` param | Medium | High | Validate with Zod schema: must start with `/`, must NOT contain `://`. Applied in both callback route and middleware. |
| Session cookies lost on middleware redirect | Medium | High | Explicit cookie propagation: copy all cookies from `supabaseResponse` to `NextResponse.redirect()` before returning. See Architecture Decisions > Backend Approach for pattern. |
| Language selector persistence across SSR | Low | Medium | Use cookie for language preference (readable on server); consistent between middleware render and client hydration. |
| OAuth cancel behavior varies by provider | Low | Medium | Handle `error=access_denied` in callback route for user cancellation. Treat all other OAuth errors as auth failures. |

---

## Dependencies & Prerequisites

### Required Before Start

- [x] `constitution.md` reviewed and understood
- [x] `spec.md` approved by stakeholders (reviewed pass 8 — approved)
- [x] `design-style.md` approved (reviewed pass 8 — approved)
- [x] Supabase Auth Google OAuth configured (env vars in `.env.example`)
- [x] Existing assets available (`hero-banner.png`, `logo-saa.png`)

### External Dependencies

- Google OAuth client ID/secret configured in Supabase dashboard
- `@sun-asterisk.com` domain restriction configured in Supabase Auth provider settings

---

## Next Steps

After plan approval:

1. **Run** `/momorph.tasks` to generate task breakdown
2. **Review** tasks.md for parallelization opportunities
3. **Begin** implementation following task order

---

## Notes

- **LanguageSelector placement**: Built in `src/components/shared/` (not `auth/`) because it's reusable across Login and the shared Header component. Per spec, it links to the Language Dropdown spec (Frame `721:4942`).
- **No i18n framework yet**: Language switching will initially toggle static text on the login page. Full i18n framework (e.g., `next-intl`) can be introduced later as a separate feature if needed across multiple pages.
- **LoginHeader vs shared Header**: The login page uses a simplified header (no nav links, no bell, no profile). This is a separate `LoginHeader` component, NOT the shared `Header` from `src/components/shared/Header.tsx`.
- **LoginFooter vs shared Footer**: Same pattern — simplified footer with only copyright text.
- **Background image**: Reuses `hero-banner.png` (same as Homepage). The gradient overlay uses a custom inline style (not Tailwind `via`) because the design requires 60% midpoint (Tailwind defaults to 50%).
- **GoogleIcon is standalone**: NOT added to `src/components/ui/Icon.tsx` because that component uses `fill="currentColor"` for single-color SVGs. The Google "G" logo requires 4 hardcoded brand colors — a fundamentally different rendering pattern.
- **Disabled button uses `bg-gray-400`**: Tailwind's `gray-400` (`#9ca3af`) matches the design-style.md disabled background `#9CA3AF` exactly. No custom token needed.
- **No `useSearchParams()` in LoginButton**: Search params (`error`, `redirect`) are read by the page Server Component via `searchParams` prop and passed down as props. This avoids the need for a `<Suspense>` boundary (which `useSearchParams()` requires in Next.js 15 App Router) and keeps the page statically analyzable.
- **Redirect validation is shared**: Both callback route and middleware use the same Zod schema from `src/utils/validateRedirect.ts` to prevent open redirect attacks at both entry points.
