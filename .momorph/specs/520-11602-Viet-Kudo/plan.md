# Implementation Plan: Viet Kudo (Write Kudos Modal)

**Frame**: `520:11602-Viet-Kudo`
**Date**: 2026-03-12
**Spec**: `specs/520-11602-Viet-Kudo/spec.md`

---

## Summary

Implement a modal dialog for composing and sending kudos on the SAA 2025 platform. The modal is triggered from the existing `KudosInputPill` on the Kudos Live Board and includes: recipient search with autocomplete, custom title/honor ("Danh hiệu"), a Tiptap-powered rich text editor with 6 formatting tools + @-mention support, hashtag selection (max 5, required), image attachments (max 5, optional), anonymous sending mode, and form submission via a new POST API endpoint with server-side HTML sanitization.

---

## Technical Context

**Language/Framework**: TypeScript (strict mode) / Next.js 15 App Router
**Primary Dependencies**: React 19, TailwindCSS 4, Supabase (Auth + DB + Storage), Tiptap (rich text), sanitize-html (XSS prevention)
**Database**: PostgreSQL (via Supabase) — requires migration to add 3 columns
**Testing**: Vitest + Testing Library + MSW
**State Management**: Local component state (React useState) — no global store needed
**API Style**: REST (Next.js API Routes)

---

## Constitution Compliance Check

*GATE: Must pass before implementation can begin*

- [x] Follows project coding conventions — PascalCase components, camelCase hooks/utils, `@/*` imports
- [x] Uses approved libraries and patterns — Tiptap is browser-only (Workers-compatible), sanitize-html is pure JS
- [x] Adheres to folder structure guidelines — `src/components/kudos/`, `src/hooks/`, `src/app/api/`
- [x] Meets security requirements — Server-side Zod validation, HTML sanitization, RLS policies, no `dangerouslySetInnerHTML`
- [x] Follows testing standards — TDD approach, integration tests for happy path + error scenarios

**New Dependencies Requiring Justification**:

| Library | Justification | Alternative Rejected |
|---------|---------------|---------------------|
| `@tiptap/react` + extensions | Rich text editor with @-mention, link, formatting — spec requires 6 toolbar actions + mentions. No existing editor in project. | Lexical (heavier, more complex API, harder @-mention setup); textarea with markdown (doesn't match Figma design) |
| `sanitize-html` | Server-side HTML sanitization (constitution IV: XSS Prevention). Pure JS, no DOM dependency, works in Cloudflare Workers. | `isomorphic-dompurify` (requires jsdom, incompatible with Workers runtime); regex-based (fragile, insecure) |

---

## Architecture Decisions

### Frontend Approach

- **Component Structure**: Feature-scoped under `src/components/kudos/kudo-modal/`. Main `KudoModal.tsx` orchestrates child components. All are `"use client"` (per constitution V: event handlers + React state).
- **Styling Strategy**: Tailwind utility classes with design tokens from `globals.css` `@theme` block. Reuse existing tokens (e.g., `--color-card-bg` for modal background, `--color-gold-primary` for submit button) and add only truly new ones (`--color-required`, `--color-link-red`). Minimize arbitrary Tailwind values — register frequently-used modal-specific sizes as tokens where practical.
- **Data Fetching**: Client-side `fetch()` calls from the modal to existing API endpoints (`/api/users/search`, `/api/hashtags`) and new endpoints (`POST /api/kudos`, `POST /api/upload/image`). No Server Components within the modal.
- **Rich Text Editor**: Tiptap v2 with modular extensions:
  - `@tiptap/starter-kit` (bold, italic, strike, ordered list, blockquote, paragraph)
  - `@tiptap/extension-link` (hyperlinks)
  - `@tiptap/extension-mention` (@-mentions with custom suggestion popup)
  - `@tiptap/extension-placeholder` (placeholder text)
  - `@tiptap/extension-character-count` (enforce 3000 char limit)

### Backend Approach

- **API Design**: New `POST /api/kudos` route following existing GET route pattern. New `POST /api/upload/image` for Supabase Storage uploads.
- **Data Access**: Supabase server client with RLS. Insert via `.from('kudos').insert()`.
- **Validation**: Zod schemas for both client-side (instant feedback) and server-side (security). `createKudosSchema` validates all fields including character limits.
- **Sanitization**: `sanitize-html` with strict allowlist (spec TR-008 tags only) applied before database insert.

### Integration Points

- **KudosInputPill → KudoModal**: New `KudoModalWrapper` (client component) manages `isModalOpen` state and lazy-loads `KudoModal` via `next/dynamic`. Placed inside `AllKudosSection` (Server Component) replacing the direct `<KudosInputPill />` render. KudosInputPill receives `onClick` prop.
- **KudoModal → Feed Refresh**: On successful submission, `KudoModalWrapper.onSuccess` dispatches a custom DOM event `window.dispatchEvent(new Event('kudos-created'))`. The existing `useKudosFeed` hook (inside `InfiniteScrollFeed`) listens for this event and calls its internal `reset()` to clear and re-fetch the feed. This avoids the hook-per-instance problem — `KudoModalWrapper` does NOT call `useKudosFeed` directly (that would create a separate instance). The custom event decouples the modal from the feed without requiring architectural changes.
- **Existing APIs**: `/api/users/search` (recipient autocomplete) and `/api/hashtags` (hashtag selector) are reused as-is.
- **Shared Components**: Toast (notifications), Icon (new icons added).

---

## Project Structure

### Documentation (this feature)

```text
.momorph/specs/520-11602-Viet-Kudo/
├── spec.md              # Feature specification ✅
├── design-style.md      # Design specifications ✅
├── plan.md              # This file ✅
├── research.md          # Codebase research ✅
├── tasks.md             # Task breakdown (next step)
└── assets/
    └── frame.png        # Figma screenshot ✅
```

### Source Code (affected areas)

```text
# New files
src/
├── components/kudos/kudo-modal/
│   ├── KudoModal.tsx              # Main modal container + form state
│   ├── RecipientSearch.tsx        # Autocomplete recipient search
│   ├── DanhHieuInput.tsx          # Title/honor input with hint
│   ├── RichTextEditor.tsx         # Tiptap editor wrapper
│   ├── RichTextToolbar.tsx        # 6 formatting buttons + community link
│   ├── MentionSuggestion.tsx      # @-mention autocomplete dropdown
│   ├── HashtagSelector.tsx        # Hashtag multi-select with chips
│   ├── ImageUploader.tsx          # Image attachments with thumbnails
│   └── AnonymousSection.tsx       # Checkbox + conditional name input
├── hooks/
│   └── useCreateKudos.ts          # Form submission hook (API call + state)
├── app/api/
│   ├── kudos/route.ts             # ADD POST handler to existing file
│   └── upload/image/route.ts      # New image upload endpoint
└── utils/
    ├── sanitizeHtml.ts            # Server-side HTML sanitizer config
    └── compressImage.ts           # Client-side image compression via Canvas API

# New files (integration)
src/
└── components/kudos/KudoModalWrapper.tsx  # Client wrapper: modal state + lazy-loaded KudoModal + feed refresh

# Modified files
src/
├── components/kudos/KudosInputPill.tsx    # Add onClick prop, call in handleClick
├── components/kudos/AllKudosSection.tsx    # Replace <KudosInputPill /> with <KudoModalWrapper /> (remains Server Component)
├── components/kudos/QuoteBox.tsx            # Safe HTML rendering via Tiptap read-only (TR-008); backward compat with plain text
├── components/kudos/KudosCard.tsx          # Display danh_hieu as kudos title (FR-019, P1 MUST)
├── components/kudos/KudosCardHeader.tsx    # Handle is_anonymous: show anonymous_name or "Ẩn danh" instead of sender info (FR-013)
├── components/ui/Icon.tsx                  # Add 10 new icon definitions
├── types/kudos.ts                          # Add createKudosSchema, update kudosSchema with danh_hieu/is_anonymous/anonymous_name
├── app/globals.css                         # Add 3 new design tokens (--color-required, --color-link-red, --color-delete-badge)
└── hooks/useKudosFeed.ts                   # Add internal reset() + useEffect listener for 'kudos-created' custom DOM event

# Database
supabase/migrations/
└── 00003_add_kudos_modal_fields.sql       # Add danh_hieu, is_anonymous, anonymous_name

# Tests
src/__tests__/
├── components/kudos/kudo-modal/
│   ├── KudoModal.test.tsx
│   ├── KudoModalWrapper.test.tsx
│   ├── RecipientSearch.test.tsx
│   ├── DanhHieuInput.test.tsx
│   ├── RichTextEditor.test.tsx
│   ├── HashtagSelector.test.tsx
│   ├── ImageUploader.test.tsx
│   └── AnonymousSection.test.tsx
├── components/kudos/QuoteBox.test.tsx
├── components/kudos/KudosCard.test.tsx
├── hooks/useCreateKudos.test.ts
├── app/api/kudos/post.test.ts
├── app/api/upload/image.test.ts
└── utils/
    ├── sanitizeHtml.test.ts
    └── compressImage.test.ts
```

### Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `@tiptap/react` | ^2.x | React integration for Tiptap editor |
| `@tiptap/pm` | ^2.x | ProseMirror wrapper (required peer dependency for all Tiptap packages) |
| `@tiptap/starter-kit` | ^2.x | Core extensions (bold, italic, strike, list, blockquote, paragraph, history) |
| `@tiptap/extension-link` | ^2.x | Hyperlink support in editor |
| `@tiptap/extension-mention` | ^2.x | @-mention with autocomplete |
| `@tiptap/extension-placeholder` | ^2.x | Placeholder text in empty editor |
| `@tiptap/extension-character-count` | ^2.x | Character count + limit enforcement |
| `sanitize-html` | ^2.x | Server-side HTML sanitization (XSS prevention) |
| `@types/sanitize-html` | ^2.x | TypeScript types (devDependency) |

---

## Implementation Strategy

### Phase 0: Asset Preparation & Infrastructure

**Goal**: Download Figma icons, install dependencies, prepare database, register design tokens.

1. Download all 10 SVG icons from Figma using `get_media_files` URLs and add to `Icon.tsx`:
   - Toolbar: `format-bold`, `format-italic`, `format-strikethrough`, `format-list-numbered`, `format-link`, `format-quote`
   - Actions: `plus`, `close`, `close-tiny`, `send`
2. Install new dependencies: `yarn add @tiptap/react @tiptap/pm @tiptap/starter-kit @tiptap/extension-link @tiptap/extension-mention @tiptap/extension-placeholder @tiptap/extension-character-count sanitize-html && yarn add -D @types/sanitize-html`
3. Create database migration `00003_add_kudos_modal_fields.sql`:
   - Add `danh_hieu TEXT NOT NULL DEFAULT ''` to kudos
   - Add `is_anonymous BOOLEAN NOT NULL DEFAULT false` to kudos
   - Add `anonymous_name TEXT` to kudos
   - Add INSERT policy: `sender_id = auth.uid() AND sender_id != receiver_id`
4. Create Supabase Storage bucket `kudos-images` (public, 5MB limit, image MIME types only)
5. Register new design tokens in `globals.css` `@theme` block (only tokens NOT already in the theme):
   - `--color-required: #CF1322` — required field asterisk and error border (new)
   - `--color-link-red: #E46060` — community standards link text (new)
   - `--color-delete-badge: #D4271D` — image delete badge (alias of existing `--color-red`, add for semantic clarity)
   - Note: many modal colors already exist as Kudos tokens: `--color-card-bg` (#FFF8E1), `--color-gold-primary` (#FFEA9E), `--color-border` (#998C5F), `--color-text-gray` (#999), `--color-text-dark` (#00101A), `--color-gold-10` (10% opacity), `--color-red` (#D4271D), `--radius-kudos-card` (24px). Reuse these directly — do NOT create duplicates.

### Phase 1: Foundation (Types + Utilities + API)

**Goal**: Establish data contracts, server-side sanitization, and API endpoints.

1. Update `src/types/kudos.ts`:
   - Add `createKudosSchema` (Zod: receiver_id, danh_hieu max 100, content max 15000 for HTML string, hashtags min 1 max 5, images max 5 URL strings, is_anonymous, anonymous_name max 50)
   - **Important: content length discrepancy** — The spec limit (FR-020) is 3000 **text** characters, enforced client-side via Tiptap's `CharacterCount(limit: 3000)` extension (counts text, not markup). However, the server receives an HTML string where markup tags inflate the length (e.g., `<strong>text</strong>` = 23 chars for 5 chars of text). Set the server-side Zod `content.max()` to a generous HTML-safe ceiling (~15000) to prevent false rejections. The client-side CharacterCount remains the primary enforcement of the 3000-text-char limit; the server limit is a safety net against oversized payloads.
   - Update `kudosSchema` to include `danh_hieu`, `is_anonymous`, `anonymous_name`
2. Create `src/utils/sanitizeHtml.ts`:
   - Configure `sanitize-html` with allowlist: `p, strong, em, s, ol, li, a[href|target|rel], blockquote, span[data-mention|data-id]`
   - Export `sanitizeKudosContent(html: string): string`
3. Add POST handler to `src/app/api/kudos/route.ts`:
   - Auth check → Zod validation → self-kudos check → sanitize content → insert into DB → increment sender's `kudos_sent_count` and receiver's `kudos_received_count` → return 201
   - **Atomicity**: The insert + two profile counter updates are 3 separate DB operations. For consistency, create a Supabase RPC function `create_kudos(...)` (similar to existing `toggle_like`) that performs all 3 operations atomically in a single PL/pgSQL transaction. This prevents orphaned kudos without counter updates. Add this function to the migration file `00003_add_kudos_modal_fields.sql`.
4. Create `src/app/api/upload/image/route.ts`:
   - Auth check → validate file type (JPEG/PNG/GIF/WebP) + size (max 5MB) → upload to Supabase Storage `kudos-images` bucket → return public URL

### Phase 2: Modal Shell (US6 - Cancel/Close)

**Goal**: Implement the modal container, overlay, open/close behavior, and keyboard support.

1. Create `src/components/kudos/kudo-modal/KudoModal.tsx`:
   - Props: `isOpen`, `onClose`, `onSuccess`
   - Overlay (`fixed inset-0`, click to close with confirmation if dirty)
   - **Dirty check**: Track whether any field has been modified (compare against initial empty state). If dirty, overlay click or Escape/Cancel triggers a browser `window.confirm("Bạn có chắc muốn hủy? Nội dung đã nhập sẽ bị mất.")` dialog. If confirmed, close and discard. If not dirty, close immediately.
   - Modal container (752px, cream bg, 24px radius, 40px padding)
   - Title "Gửi lời cám ơn và ghi nhận đến đồng đội"
   - Focus trap (trap Tab/Shift+Tab within modal)
   - Escape key closes modal (FR-022, with dirty check)
   - Cancel button with close icon
   - Submit button (disabled by default)
   - Fade-in/out animation (200ms)
   - `role="dialog"`, `aria-modal="true"`, `aria-label`
2. Modify `src/components/kudos/KudosInputPill.tsx`:
   - Accept `onClick` prop, call it in `handleClick`
3. Create `src/components/kudos/KudoModalWrapper.tsx` (new **client** component):
   - `AllKudosSection.tsx` is a **Server Component** and cannot hold state. Create a new client wrapper component that manages modal state and feed refresh.
   - Contains `isModalOpen` state
   - Lazy-loads `KudoModal` via `next/dynamic` with `{ ssr: false }` to avoid loading Tiptap's ~80KB bundle on initial page load. The modal is only loaded when the user clicks the input pill.
   - Renders `<KudosInputPill onClick={() => setIsModalOpen(true)} />`
   - Renders `<KudoModal isOpen={isModalOpen} onClose={...} onSuccess={...} />` (dynamically imported)
   - `onSuccess` callback dispatches `window.dispatchEvent(new Event('kudos-created'))` and closes the modal. Does NOT call `useKudosFeed` directly (hooks are per-instance).
4. Modify `src/components/kudos/AllKudosSection.tsx`:
   - Replace direct `<KudosInputPill />` render with `<KudoModalWrapper />` (the new client component)
   - AllKudosSection remains a Server Component — no state changes needed

### Phase 3: Form Fields (US1 + US7)

**Goal**: Implement recipient search, danh hiệu input, and client-side validation.

1. Create `src/components/kudos/kudo-modal/RecipientSearch.tsx`:
   - Debounced autocomplete (300ms) calling `/api/users/search?q=...`
   - Dropdown showing avatar, display_name, department
   - Min 2 characters to trigger search
   - "Không tìm thấy kết quả" empty state
   - Click-outside to close dropdown
   - Controlled: `value` (ProfilePreview | null) + `onChange`
   - Error state: red border (#CF1322) when validation fails
2. Create `src/components/kudos/kudo-modal/DanhHieuInput.tsx`:
   - Text input with placeholder "Dành tặng một danh hiệu cho đồng đội"
   - Hint text below: "Ví dụ: Người truyền động lực cho tôi. Danh hiệu sẽ hiển thị làm tiêu đề Kudos của bạn."
   - Max 100 characters (client-side enforcement)
   - Required field validation
3. Wire up form state in `KudoModal.tsx`:
   - `recipientId`, `recipientQuery`, `danhHieu`, `selectedHashtags`, `attachedImages`, `isAnonymous`, `anonymousName`, `errors`
   - Submit button enabled only when all required fields are filled (FR-015)

### Phase 4: Rich Text Editor (US2)

**Goal**: Implement Tiptap-based editor with toolbar and @-mentions.

1. Create `src/components/kudos/kudo-modal/RichTextToolbar.tsx`:
   - 6 formatting buttons: Bold (B), Italic (I), Strikethrough (S), Numbered List, Link, Quote
   - Each button toggles active state (`aria-pressed`)
   - Connected top border with toolbar (radius: 8px 8px 0 0 on first/last)
   - **Link button**: On click, opens a link dialog/popup for URL input. Reference the existing Add Link Box component spec (`.momorph/specs/1-Addlink-Box/`) for the dialog behavior and styling. If that spec's component is already implemented, reuse it; otherwise implement a simple inline URL input (text field + confirm/cancel) matching the Figma design.
   - "Tiêu chuẩn cộng đồng" link (red #E46060, right-aligned, opens in new tab)
2. Create `src/components/kudos/kudo-modal/RichTextEditor.tsx`:
   - Tiptap `useEditor()` with extensions: StarterKit (bold, italic, strike, orderedList, blockquote), Link, Mention, Placeholder, CharacterCount(limit: 3000)
   - Placeholder: "Hãy gửi gắm lời cám ơn và ghi nhận đến đồng đội tại đây nhé!"
   - Connected bottom border (radius: 0 0 8px 8px)
   - Hint below: "Bạn có thể '@ + tên' để nhắc tới đồng nghiệp khác"
   - Expose `editor.getHTML()` for form submission
3. Create `src/components/kudos/kudo-modal/MentionSuggestion.tsx`:
   - Custom suggestion renderer for Tiptap Mention extension
   - Fetches from `/api/users/search?q=...` (debounced 300ms)
   - Shows avatar, name, department in dropdown
   - Keyboard navigation (arrow keys + Enter)

### Phase 5: Hashtags & Images (US3 + US4)

**Goal**: Implement hashtag multi-select and image upload with thumbnails.

1. Create `src/components/kudos/kudo-modal/HashtagSelector.tsx`:
   - Fetch hashtags from `/api/hashtags` on mount
   - "+ Hashtag" button opens dropdown (reuse pattern from existing Dropdown List Hashtag spec `1002:13013`)
   - Selected hashtags render as removable chips (max 5)
   - "Tối đa 5" sub-label on button
   - Hide button when 5 selected
   - Required: at least 1 hashtag
2. Create `src/components/kudos/kudo-modal/ImageUploader.tsx`:
   - "+ Image" button opens file picker (accept: image/jpeg, image/png, image/gif, image/webp)
   - Client-side validation: type + size (max 5MB per file)
   - **Client-side compression/resizing before upload** (per TR-003): Use Canvas API to resize images exceeding 1920px on longest side and compress to ~80% quality JPEG/WebP. This reduces upload time and storage usage. Implement as a utility function `compressImage(file: File, maxDimension: number, quality: number): Promise<Blob>`.
   - Upload to `/api/upload/image`, show progress/loading state on thumbnail slot
   - **Track upload state**: Expose `isUploading` boolean (true while any image is still uploading). Parent `KudoModal` uses this to disable the "Gửi" button (per edge case: "Disable Gửi until all uploads complete").
   - 80x80px thumbnails with red circular delete badge (20x20, #D4271D)
   - Max 5 images; hide button when limit reached
   - "Tối đa 5" sub-label on button
   - Error handling: toast on upload failure, retry or remove failed uploads

### Phase 6: Anonymous Mode & Submission (US5 + US1 completion)

**Goal**: Complete the form with anonymous option and full submission flow.

1. Create `src/components/kudos/kudo-modal/AnonymousSection.tsx`:
   - Checkbox: "Gửi lời cám ơn và ghi nhận ẩn danh"
   - When checked: slide-down (200ms) reveals anonymous name text input
   - Anonymous name: max 50 characters, optional (defaults to "Ẩn danh")
2. Create `src/hooks/useCreateKudos.ts`:
   - Accepts form data, calls POST `/api/kudos`
   - Returns `{ submit, isSubmitting, error }`
   - On submit: validate with Zod client-side → show loading on button ("Đang gửi...") → disable all fields → call API → on success: toast + onSuccess callback → on error: toast + re-enable form
3. Wire up full submission flow in `KudoModal.tsx`:
   - Collect: recipientId, danhHieu, editor.getHTML(), selectedHashtags, uploadedImageUrls, isAnonymous, anonymousName
   - **Submit button disabled conditions** (FR-015 + edge case): disabled when (a) any required field is empty, OR (b) `isUploading` is true (images still uploading), OR (c) `isSubmitting` is true
   - Client-side validation via `createKudosSchema`
   - Server-side validation + sanitization in API route
   - Success: toast "Gửi Kudos thành công!", close modal, refresh feed
   - Error: toast "Gửi Kudos thất bại. Vui lòng thử lại.", keep modal open
4. Update `src/hooks/useKudosFeed.ts`:
   - Add internal `reset()` function: clears kudos array, resets cursor to null, re-fetches first page
   - Add `useEffect` listener for `window` event `'kudos-created'` that calls `reset()`. This allows the feed to refresh when a kudos is created from any component (KudoModal), without direct hook coupling.

### Phase 7: Live Board Display Updates (FR-013, FR-019, TR-008)

**Goal**: Update existing Kudos feed components to display new fields from submitted kudos and safely render rich text HTML content.

1. Modify `src/components/kudos/QuoteBox.tsx`:
   - **Critical**: Currently renders `{content}` as plain text inside a `<p>` tag. New kudos store sanitized HTML. Must update to render HTML safely.
   - **Rendering strategy**: Add `"use client"` directive to QuoteBox (required for `useEditor` hook). Use Tiptap's read-only mode (`editable: false`) to render HTML content. This reuses the same editor that created the content, ensures correct rendering of all supported tags (bold, italic, strike, lists, links, blockquotes, mentions), and avoids `dangerouslySetInnerHTML` (per constitution IV / TR-008). Import `@tiptap/react` + same extensions as the editor (StarterKit, Link, Mention) with `editable: false` and `content` set to the HTML string.
   - **Backward compatibility**: Legacy kudos have plain text in `content` (no HTML tags). Detect by checking if content contains any HTML tags (`/<[a-z][\s\S]*>/i`). If plain text, render as-is (current behavior). If HTML, render via Tiptap read-only.
   - **Bundle consideration**: QuoteBox is used in every KudosCard in the feed. Tiptap read-only mode loads a subset of extensions (no toolbar, no editable features) but still adds bundle weight. Consider lazy-loading the Tiptap renderer only when HTML content is detected. For MVP, accept the bundle cost since most new kudos will use rich text.
   - Replace the `<p>` wrapper with a `<div>` to allow block-level children (`<ol>`, `<blockquote>`, etc.). Preserve the `line-clamp` behavior on the outer container.
2. Modify `src/components/kudos/KudosCard.tsx`:
   - Display `danh_hieu` as the kudos title/headline above the content (FR-019). If `danh_hieu` is empty (legacy kudos), fall back to current behavior (no title).
   - Style: use field label typography (22px, 700, `--color-text-dark`) per design-style.md label spec.
3. Modify `src/components/kudos/KudosCardHeader.tsx`:
   - Check `is_anonymous` flag. If true, replace sender display_name with `anonymous_name` (or "Ẩn danh" if anonymous_name is empty/null).
   - Replace sender avatar with a generic anonymous avatar placeholder.
   - Hide sender department for anonymous kudos.
4. Update `src/types/kudos.ts` `kudosSchema`:
   - Ensure `danh_hieu`, `is_anonymous`, `anonymous_name` fields are present (done in Phase 1, verify here).
   - The existing `GET /api/kudos` route uses `SELECT *` with joins, so new columns are automatically included in responses — no API changes needed.

### Phase 8: Polish & Accessibility

**Goal**: Loading states, error handling, responsive design, animations, a11y.

1. **Loading states**:
   - Recipient search: spinner in dropdown during fetch
   - Image upload: progress/loading indicator on thumbnail slot
   - Form submission: "Gửi" → "Đang gửi..." with spinner, all fields disabled
   - @-mention: inline loading in autocomplete popup
2. **Error states**:
   - Red border (#CF1322) on invalid fields
   - Toast messages for all error scenarios (spec Error States table)
   - Session expired handling: toast + redirect to login
3. **Responsive design** (per design-style.md):
   - Mobile (< 640px): full-screen modal, 24px padding, stacked action buttons, 60px thumbnails
   - Tablet (640-1023px): 90% width, max 752px, 32px padding
   - Desktop (>= 1024px): 752px centered
4. **Animations** (per design-style.md):
   - Modal open/close: opacity + transform (200ms ease-out)
   - Button hover: background-color (150ms)
   - Input focus: border-color (150ms)
   - Toolbar toggle: background-color (100ms)
   - Anonymous field reveal: slide-down (200ms ease-out)
5. **Accessibility**:
   - Focus trap within modal
   - `role="dialog"`, `aria-modal="true"`
   - `aria-label` on toolbar icon buttons
   - `aria-required="true"` on required fields
   - `aria-pressed` on toolbar toggle buttons
   - Tab order: Người nhận → Danh hiệu → Toolbar → Textarea → Hashtag → Image → Checkbox → Hủy → Gửi
   - Focus visible: 2px solid #FFEA9E outline with 2px offset
   - Escape key closes modal

### Phase 9: Testing

**Goal**: Comprehensive test coverage for the feature.

1. **Component tests** (Vitest + Testing Library):
   - `KudoModal.test.tsx`: open/close, escape key, overlay click with dirty check, focus trap, submit button disabled states (missing fields, uploading, submitting)
   - `RecipientSearch.test.tsx`: search debounce, selection, empty state, error state
   - `RichTextEditor.test.tsx`: toolbar toggles, placeholder, character limit
   - `HashtagSelector.test.tsx`: add/remove chips, max 5 limit, required validation
   - `ImageUploader.test.tsx`: file validation (type, size), compression, max 5 limit, delete, isUploading state
   - `QuoteBox.test.tsx`: plain text rendering (legacy), HTML content rendering via Tiptap read-only, mixed content detection, line-clamp behavior preserved
   - `KudosCard.test.tsx`: danh_hieu display, anonymous sender display, legacy kudos without danh_hieu
2. **Hook tests**:
   - `useCreateKudos.test.ts`: success flow, error handling, loading state
3. **API route tests** (Vitest + MSW):
   - `post.test.ts`: auth check, Zod validation errors, self-kudos rejection, HTML sanitization, successful insert, profile counter updates
   - `image.test.ts`: auth check, file type validation (reject non-image), file size validation (reject >5MB), successful upload returns public URL, storage error handling
4. **Utility tests**:
   - `sanitizeHtml.test.ts`: allowlisted tags pass through, dangerous tags stripped, attributes filtered
   - `compressImage.test.ts`: images above max dimension are resized, quality reduced, output format correct, small images pass through unchanged

---

## Integration Testing Strategy

### Test Scope

- [x] **Component/Module interactions**: KudoModal ↔ child components, KudosInputPill → KudoModal open
- [x] **External dependencies**: Supabase (Auth + DB + Storage) via MSW mocks
- [x] **Data layer**: Kudos insert, image upload to Storage
- [x] **User workflows**: Full kudos submission flow (open → fill → submit → verify)

### Test Categories

| Category | Applicable? | Key Scenarios |
|----------|-------------|---------------|
| UI ↔ Logic | Yes | Form validation, submit flow, toolbar ↔ editor state |
| App ↔ External API | Yes | POST /api/kudos, POST /api/upload/image, GET /api/users/search |
| App ↔ Data Layer | Yes | Kudos insert + profile counter updates |
| Cross-platform | Yes | Responsive modal (mobile/tablet/desktop) |

### Test Environment

- **Environment type**: Local (Vitest + JSDOM)
- **Test data strategy**: MSW handlers returning fixtures; Vitest mock factories
- **Isolation approach**: Fresh state per test (React Testing Library cleanup)

### Mocking Strategy

| Dependency Type | Strategy | Rationale |
|-----------------|----------|-----------|
| Supabase Auth | Mock via MSW | Consistent test user, no network dependency |
| Supabase DB | Mock via MSW | Control response data, simulate errors |
| Supabase Storage | Mock via MSW | Simulate upload success/failure without network |
| Tiptap Editor | Partial mock | Mock `getHTML()` for submission tests; real editor for toolbar tests |
| /api/users/search | Mock via MSW | Control search results for autocomplete tests |
| /api/hashtags | Mock via MSW | Provide consistent hashtag list |

### Test Scenarios Outline

1. **Happy Path**
   - [ ] Open modal from KudosInputPill click
   - [ ] Fill all required fields and submit successfully
   - [ ] Toast shows success message, modal closes, feed refreshes
   - [ ] Submit with anonymous mode enabled

2. **Error Handling**
   - [ ] Submit with missing required fields → button disabled
   - [ ] API returns 500 → error toast, form remains open
   - [ ] Session expired during submission → redirect to login
   - [ ] Image upload fails → error on thumbnail, allow retry

3. **Edge Cases**
   - [ ] Submit with exactly 5 hashtags and 5 images
   - [ ] Character limit at boundary (3000 chars content, 100 chars danh_hieu)
   - [ ] Self-kudos attempt rejected

### Coverage Goals

| Area | Target | Priority |
|------|--------|----------|
| Core submission flow | 90%+ | High |
| Form validation | 85%+ | High |
| API routes | 90%+ | High |
| UI interactions | 75%+ | Medium |
| Edge cases | 70%+ | Medium |

---

## Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Tiptap bundle size impacts page load | Medium | Medium | Tree-shake: import only needed extensions. Lazy-load modal (dynamic import with `next/dynamic`). |
| `sanitize-html` incompatible with Cloudflare Workers | Low | High | Test in Workers runtime early (Phase 1). Fallback: implement lightweight custom sanitizer using regex-based tag allowlist. |
| @-mention autocomplete UX complexity | Medium | Medium | Start with basic implementation (text matching), iterate. Follow SearchPill pattern that already works. |
| Database migration breaks existing kudos feed | Low | High | Migration adds columns with defaults (`danh_hieu DEFAULT ''`, `is_anonymous DEFAULT false`). Existing data unaffected. Update KudosCard to handle empty danh_hieu gracefully. |
| Image upload performance (5 images × 5MB) | Medium | Medium | Client-side compression/resizing before upload (required per TR-003, implemented in Phase 5). Parallel uploads with individual progress tracking. |
| Tiptap SSR issues in Workers | Low | High | Tiptap is browser-only in `"use client"` components — no SSR rendering of the editor. Verify with `next build`. |

---

## Dependencies & Prerequisites

### Required Before Start

- [x] `constitution.md` reviewed and understood
- [x] `spec.md` approved (7 review passes, all issues resolved)
- [x] `design-style.md` approved (pixel-perfect visual specs)
- [x] `research.md` completed (codebase analysis)
- [ ] Database migration planned (00003_add_kudos_modal_fields.sql)
- [ ] Supabase Storage bucket created (kudos-images)

### External Dependencies

- Supabase project running (local via `make up` or remote)
- Google Fonts: Montserrat (already loaded), Noto Sans JP (already loaded)
- Figma asset URLs (temporary, 10-minute expiry — download during Phase 0)

---

## Next Steps

After plan approval:

1. **Run** `/momorph.tasks` to generate task breakdown
2. **Review** tasks.md for parallelization opportunities
3. **Begin** implementation following phase order

---

## Notes

- The modal is entirely client-rendered (`"use client"`). No Server Components within it. This avoids any Cloudflare Workers runtime issues with Tiptap.
- The `kudos.hashtags` column stores an array of hashtag name strings (`TEXT[]`), not UUIDs. The HashtagSelector should send `["hashtag1", "hashtag2"]` format matching the existing schema.
- `KudosInputPill` currently has a `handleClick` TODO — this is the exact integration point for opening the modal.
- The feed refresh uses a custom DOM event pattern (`'kudos-created'`), NOT direct hook coupling. `KudoModalWrapper` dispatches the event; `useKudosFeed` listens for it and calls its internal `reset()`. This is necessary because React hooks are per-instance — calling `useKudosFeed` in `KudoModalWrapper` would create a separate instance from the one in `InfiniteScrollFeed`.
- Tiptap extensions should be imported individually for tree-shaking. Do NOT import the full `@tiptap/extension-*` bundle.
- The plan uses lazy loading (`next/dynamic` with `{ ssr: false }`) for the KudoModal in `KudoModalWrapper.tsx` to avoid loading Tiptap's ~80KB bundle on initial page load. The modal is only loaded when the user clicks the input pill.
- All "predicted" states in design-style.md (hover, focus, active, disabled) should be validated during implementation and adjusted if they don't match the overall project aesthetic.
- Image compression utility (`compressImage`) uses the Canvas API which is browser-only. This is fine since `ImageUploader` is a `"use client"` component. No server-side image processing needed — compression happens before upload.
- `KudosCard`, `KudosCardHeader`, and `QuoteBox` changes (Phase 7) must handle legacy kudos where `danh_hieu` is empty string, `is_anonymous` is false, and `content` is plain text (not HTML). These are the defaults set by the migration, so all existing kudos will display unchanged.
- `QuoteBox.tsx` currently renders content as plain text in a `<p>` tag. Phase 7 updates it to detect HTML content and render via Tiptap read-only mode, avoiding `dangerouslySetInnerHTML` per constitution IV / TR-008. Plain text content (legacy kudos) continues to render as-is.
- The `POST /api/kudos` endpoint should set `video_url: null` and `category: null` for kudos created via this modal (these fields exist in the DB schema but are not part of the Write Kudos form).
- The 3000-character limit (FR-020) applies to **text content**, not HTML markup. Client-side: Tiptap `CharacterCount(limit: 3000)` counts text characters. Server-side: Zod validates the HTML string with a generous ceiling (~15000 chars) since HTML tags inflate length. The client is the primary enforcement; the server is a safety net.
