# Research: Viet Kudo (Write Kudos Modal)

**Frame**: `520:11602-Viet-Kudo`
**Date**: 2026-03-12
**Spec**: `specs/520-11602-Viet-Kudo/spec.md`

---

## Purpose

This document captures findings from codebase analysis to inform the implementation plan for the Write Kudos Modal.

---

## Codebase Analysis

### Existing Patterns Identified

#### Component Patterns
| Pattern | Location | Relevance |
|---------|----------|-----------|
| Client component with `"use client"` | `src/components/kudos/KudosInputPill.tsx` | KudoModal trigger — currently has TODO placeholder for opening the modal |
| Icon-based SVG component | `src/components/ui/Icon.tsx` | 17 existing icons; new toolbar/modal icons must follow this pattern |
| Toast notifications | `src/components/ui/Toast.tsx` | Reuse for success/error feedback on kudos submission |
| Button variants (cta/outlined/link) | `src/components/ui/Button.tsx` | May need new "primary" and "secondary" variants for Submit/Cancel |
| Infinite scroll feed | `src/components/kudos/InfiniteScrollFeed.tsx` | Must trigger feed refresh after successful kudos submission |
| Filter bar dropdowns | `src/components/kudos/FilterBar.tsx` | Pattern for hashtag/department dropdown fetching on mount |
| Search autocomplete | `src/components/kudos/SearchPill.tsx` | Pattern for debounced user search (300ms, min 2 chars, click-outside close) |

#### API Patterns
| Pattern | Location | Relevance |
|---------|----------|-----------|
| Auth-gated GET with Zod validation | `src/app/api/kudos/route.ts` | Follow same pattern for POST /api/kudos |
| Supabase server client | `src/libs/supabase/server.ts` | Use `createClient()` for server-side DB operations |
| Supabase browser client | `src/libs/supabase/client.ts` | Use for client-side image upload to Supabase Storage |
| User search endpoint | `src/app/api/users/search/` | Already exists — reuse for recipient autocomplete |
| Hashtags endpoint | `src/app/api/hashtags/` | Already exists — reuse for hashtag selector dropdown |

#### Testing Patterns
| Pattern | Location | Relevance |
|---------|----------|-----------|
| Vitest + Testing Library | `vitest.config.ts`, `vitest.setup.ts` | Use same setup for KudoModal tests |
| MSW for API mocking | `src/__tests__/` | Mock POST /api/kudos and upload endpoints |
| Component tests | `src/__tests__/components/auth/LoginButton.test.tsx` | Pattern for testing client components with user interactions |

---

## Reusable Components

### Components to Leverage

| Component | Path | Usage in Feature |
|-----------|------|------------------|
| Icon | `src/components/ui/Icon.tsx` | Add 10 new icons (toolbar, plus, close, send); reuse existing `chevron-down` for dropdown |
| Toast | `src/components/ui/Toast.tsx` | Success ("Gửi Kudos thành công!") and error toasts |
| KudosInputPill | `src/components/kudos/KudosInputPill.tsx` | Modify to open KudoModal on click (currently TODO) |
| SearchPill (pattern) | `src/components/kudos/SearchPill.tsx` | Reference for RecipientSearch autocomplete implementation (debounce, dropdown, click-outside) |
| FilterBar (pattern) | `src/components/kudos/FilterBar.tsx` | Reference for hashtag dropdown fetching pattern |

### Hooks to Leverage

| Hook | Path | Usage in Feature |
|------|------|------------------|
| useKudosFeed | `src/hooks/useKudosFeed.ts` | Expose a refresh/reset mechanism to reload feed after kudos submission |

### Services to Leverage

| Service | Path | Usage in Feature |
|---------|------|------------------|
| Supabase Server Client | `src/libs/supabase/server.ts` | POST /api/kudos: insert kudos record, validate user session |
| Supabase Browser Client | `src/libs/supabase/client.ts` | Client-side image upload to Supabase Storage |

---

## Integration Points

### APIs to Connect

| API Endpoint | Method | Current Status | Notes |
|--------------|--------|----------------|-------|
| /api/kudos | POST | **New** | Must be created — insert kudos with sanitized content |
| /api/kudos | GET | Exists | Feed refresh after submission (already used by useKudosFeed) |
| /api/users/search | GET | Exists | Recipient autocomplete — reuse as-is |
| /api/hashtags | GET | Exists | Hashtag selector dropdown — reuse as-is |
| /api/upload/image | POST | **New** | Must be created — upload to Supabase Storage, return URL |

### Database Entities

| Entity | Table | Status | Notes |
|--------|-------|--------|-------|
| Profile | profiles | Exists | Used for recipient search. Has display_name, email, department, avatar_url |
| Kudos | kudos | Exists | **Needs migration**: add `danh_hieu`, `is_anonymous`, `anonymous_name` columns |
| Hashtag | hashtags | Exists | Used for selector dropdown. Has id, name |
| Department | departments | Exists | Used for department info in recipient search |

### Database Migration Required

The existing `kudos` table is missing three columns required by the spec:

```sql
-- Current columns: id, sender_id, receiver_id, content, hashtags, images, video_url, category, heart_count, created_at
-- Missing:
ALTER TABLE kudos ADD COLUMN danh_hieu TEXT NOT NULL DEFAULT '';
ALTER TABLE kudos ADD COLUMN is_anonymous BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE kudos ADD COLUMN anonymous_name TEXT;
```

RLS policy needed for kudos INSERT:
```sql
CREATE POLICY "Users can insert kudos" ON kudos FOR INSERT TO authenticated
  WITH CHECK (sender_id = auth.uid() AND sender_id != receiver_id);
```

### Supabase Storage

A storage bucket for kudos image attachments needs to be created:
- Bucket name: `kudos-images`
- Public access: Yes (images displayed on Live Board)
- File size limit: 5MB
- Allowed MIME types: image/jpeg, image/png, image/gif, image/webp

### External Services

| Service | Purpose | Integration Method |
|---------|---------|-------------------|
| Supabase Auth | Validate user session for submission | `supabase.auth.getUser()` in API route |
| Supabase Storage | Store kudos image attachments | `supabase.storage.from('kudos-images').upload()` |

---

## Potential Challenges

### Technical Challenges

| Challenge | Impact | Proposed Solution |
|-----------|--------|-------------------|
| Rich text editor in Cloudflare Workers | High | Tiptap is browser-only (client component); server only receives HTML string for sanitization. No SSR of editor needed. |
| HTML sanitization in Workers runtime | Medium | Use `sanitize-html` (pure JS, no DOM dependency) or implement lightweight allowlist-based sanitizer |
| Image upload with progress tracking | Medium | Use Supabase Storage JS client with XMLHttpRequest for progress events, or accept no progress and use simple fetch |
| @-mention autocomplete within Tiptap | Medium | Use `@tiptap/extension-mention` with custom suggestion plugin that calls /api/users/search |
| Feed refresh after submission | Low | Add a callback/event mechanism to trigger `useKudosFeed` reset from KudoModal |
| Focus trap in modal | Low | Implement with `useEffect` + keydown listener, or use a lightweight focus-trap library |
| Bundle size with Tiptap | Medium | Import only needed extensions (StarterKit minus unused, Mention, Link). Tree-shake aggressively. |

### Integration Challenges

| Challenge | Impact | Proposed Solution |
|-----------|--------|-------------------|
| KudosInputPill → KudoModal connection | Low | Lift modal state to parent (KudosPage or AllKudosSection), pass `onOpen` to KudosInputPill |
| Existing kudos feed displaying new fields (danh_hieu) | Medium | Update KudosCard to render danh_hieu as title. Requires updating the Kudos type and KudosCard component. |
| Type schema changes propagating | Low | Update Zod schemas in `src/types/kudos.ts`, types will auto-propagate |

---

## Figma Media Assets

### Icons Available for Download

| Node ID | Asset | Purpose | Format |
|---------|-------|---------|--------|
| I520:11647;520:9881;186:1420 | Bold icon | Toolbar: Bold toggle | SVG |
| I520:11647;662:11119;186:1420 | Italic icon | Toolbar: Italic toggle | SVG |
| I520:11647;662:11213;186:1420 | Strikethrough icon | Toolbar: Strikethrough toggle | SVG |
| I520:11647;662:10376;186:1420 | Numbered list icon | Toolbar: Ordered list toggle | SVG |
| I520:11647;662:10507;186:1420 | Link icon | Toolbar: Insert link | SVG |
| I520:11647;662:10647;186:1420 | Quote icon | Toolbar: Blockquote toggle | SVG |
| I520:11647;662:8911;186:2759 | Plus icon | "+ Hashtag" / "+ Image" button | SVG |
| I520:11647;662:9197;662:9287;186:1420 | Close (tiny) icon | Image delete badge (17x17) | SVG |
| I520:11647;520:9906;186:2761 | Close icon | Cancel button (24x24) | SVG |
| I520:11647;520:9907;186:1766 | Send icon | Submit button (24x24) | SVG |

### Existing Icons in Codebase (Reusable)

| Icon Name | Usage |
|-----------|-------|
| `chevron-down` | Recipient search dropdown arrow |
| `arrow-sent` | Could be used for submit, but Figma has a different send icon |
| `search` | Could augment recipient search field |

---

## Recommendations

### Architecture Recommendations

1. **Tiptap for rich text editor**: Tiptap v2 is the best choice — browser-only rendering (no Workers conflict), modular extensions, native HTML output, good TypeScript support, @-mention extension available. Import only: `@tiptap/react`, `@tiptap/starter-kit`, `@tiptap/extension-mention`, `@tiptap/extension-link`.

2. **`sanitize-html` for server-side sanitization**: Pure JS library that works in Cloudflare Workers. Configure with strict allowlist matching spec TR-008 tags: `<p>`, `<strong>`, `<em>`, `<s>`, `<ol>`, `<li>`, `<a>`, `<blockquote>`, `<span>` (with `data-mention` attribute).

3. **Local component state (no global store)**: The modal is self-contained. All state lives in KudoModal and its children. The only cross-component interaction is: (a) opening the modal from KudosInputPill, and (b) refreshing the feed after submission. Both are simple callback props.

### Implementation Recommendations

1. **Start with**: Database migration + types → Modal shell → Form fields → Rich text editor → Submission API. This allows vertical testing at each stage.
2. **Leverage**: Existing `SearchPill` pattern for RecipientSearch, existing `/api/users/search` and `/api/hashtags` endpoints, existing Toast component for notifications.
3. **Avoid**: Over-engineering the editor — use Tiptap's built-in toolbar rendering pattern. Avoid adding a state management library (Zustand/Redux) — local state is sufficient.

### Testing Recommendations

1. **Focus on**: Form validation (required fields, character limits), kudos submission API route (auth, sanitization, self-kudos prevention), modal open/close/escape behavior.
2. **Mock**: Supabase client (auth + DB + storage) via MSW, Tiptap editor (mock `getHTML()` for form submission tests).
3. **E2E scenarios**: Open modal → fill all fields → submit → verify toast + modal closes + feed refreshes.

---

## Files to Review Before Implementation

### Must Read

- [x] `src/components/kudos/KudosInputPill.tsx` — Modal trigger (has TODO to implement)
- [x] `src/components/kudos/SearchPill.tsx` — Autocomplete pattern to replicate
- [x] `src/app/api/kudos/route.ts` — Existing GET pattern for POST implementation
- [x] `src/types/kudos.ts` — Zod schemas to extend
- [x] `supabase/migrations/00002_create_kudos_tables.sql` — Schema to extend

### Recommended

- [x] `src/components/kudos/FilterBar.tsx` — Hashtag fetch pattern
- [x] `src/hooks/useKudosFeed.ts` — Feed refresh mechanism
- [x] `src/components/ui/Icon.tsx` — Icon pattern for new icons
- [x] `src/app/globals.css` — Existing design tokens

---

## Open Questions

- [x] All questions resolved in spec review passes (Q1-Q5)

---

## Notes

- The existing `arrow-sent` icon in Icon.tsx is visually similar to the Figma send icon but not identical. Download the exact Figma asset for pixel-perfect accuracy.
- The `KudosInputPill` component already exists with a TODO comment — implementation just needs to add modal state and pass an `onOpen` callback.
- The `kudos` table stores `hashtags` as `TEXT[]` (array of hashtag names/slugs), not as foreign keys. The modal should send hashtag names in this array format.
- No `kudos_images` storage bucket exists yet. This needs to be created as part of the infrastructure setup (via Supabase dashboard or migration).
- The existing `SearchPill.tsx` searches with minimum 2 characters. RecipientSearch should follow the same pattern for consistency.
