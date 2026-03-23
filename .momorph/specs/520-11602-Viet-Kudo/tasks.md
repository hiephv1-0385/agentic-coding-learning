# Tasks: Viet Kudo (Write Kudos Modal)

**Frame**: `520:11602-Viet-Kudo`
**Prerequisites**: plan.md (required), spec.md (required), design-style.md (required), research.md (recommended)

---

## Task Format

```
- [ ] T### [P?] [Story?] Description | file/path.ts
```

- **[P]**: Can run in parallel (different files, no dependencies on incomplete tasks in same phase)
- **[Story]**: Which user story this belongs to (US1, US2, etc.)
- **|**: File path affected by this task

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Install dependencies, download assets, prepare database and storage, register design tokens.

- [x] T001 Install Tiptap and sanitize-html dependencies: `yarn add @tiptap/react @tiptap/pm @tiptap/starter-kit @tiptap/extension-link @tiptap/extension-mention @tiptap/extension-placeholder @tiptap/extension-character-count sanitize-html && yarn add -D @types/sanitize-html` | package.json
- [x] T002 Download 10 SVG icons from Figma via `get_media_files` (format-bold, format-italic, format-strikethrough, format-list-numbered, format-link, format-quote, plus, close, close-tiny, send) and add as inline SVG definitions to Icon component. Use Node IDs from research.md Figma Media Assets table. | src/components/ui/Icon.tsx
- [x] T003 [P] Create database migration: ALTER TABLE kudos ADD COLUMN danh_hieu/is_anonymous/anonymous_name, INSERT RLS policy (sender_id = auth.uid() AND sender_id != receiver_id), and create_kudos RPC function for atomic insert + counter updates. See plan.md Phase 0 step 3 + Phase 1 step 3 for full SQL. | supabase/migrations/00003_add_kudos_modal_fields.sql
- [x] T004 [P] Create Supabase Storage bucket `kudos-images` — public read, 5MB file size limit, allowed MIME types: image/jpeg, image/png, image/gif, image/webp. Create via Supabase dashboard or SQL migration. | supabase/migrations/00003_add_kudos_modal_fields.sql
- [x] T005 [P] Register 3 new design tokens in globals.css `@theme` block: `--color-required: #CF1322`, `--color-link-red: #E46060`, `--color-delete-badge: #D4271D`. Do NOT duplicate existing tokens (see plan.md Phase 0 step 5 for full list of reusable tokens). | src/app/globals.css

**Checkpoint**: Infrastructure ready — all dependencies installed, database migrated, storage bucket created, icons and tokens registered.

---

## Phase 2: Foundation (Blocking Prerequisites)

**Purpose**: Core types, utilities, API endpoints, and modal shell required by ALL user stories.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

### Types & Utilities

- [x] T006 [P] Update kudos types: add `createKudosSchema` (Zod: receiver_id UUID, danh_hieu max 100, content max 15000 for HTML string, hashtags string[] min 1 max 5, images string[] max 5 URL, is_anonymous boolean, anonymous_name max 50). Update `kudosSchema` with 3 new fields (danh_hieu, is_anonymous, anonymous_name). See plan.md Phase 1 step 1 for content length rationale. | src/types/kudos.ts
- [x] T007 [P] Create HTML sanitizer utility: configure `sanitize-html` with strict allowlist — tags: p, strong, em, s, ol, li, a[href|target|rel], blockquote, span[data-mention|data-id]. Export `sanitizeKudosContent(html: string): string`. | src/utils/sanitizeHtml.ts
- [x] ~~T008~~ [P] REMOVED — profanity filter logic removed per user request.
- [x] T009 [P] Create image compression utility: `compressImage(file: File, maxDimension: number, quality: number): Promise<Blob>`. Use Canvas API to resize images exceeding maxDimension on longest side and compress to target quality JPEG/WebP. Pass through small images unchanged. Browser-only (Canvas API). | src/utils/compressImage.ts

### API Endpoints

- [x] T010 Add POST handler to existing kudos route: auth check → Zod validate with `createKudosSchema` → self-kudos check (sender_id !== receiver_id) → sanitize content via `sanitizeKudosContent()` → profanity filter on anonymous_name → call `create_kudos` RPC function (atomic insert + counter updates) → return 201 with created kudos. Set video_url: null, category: null. Follow existing GET handler pattern. | src/app/api/kudos/route.ts
- [x] T011 [P] Create image upload endpoint: auth check → extract file from `request.formData()` → validate MIME type (JPEG/PNG/GIF/WebP) + size (max 5MB) → generate unique filename → upload to Supabase Storage `kudos-images` bucket via server client → return JSON with public URL. | src/app/api/upload/image/route.ts

### Modal Shell (US6 — Cancel/Close)

- [x] T012 Create modal container component with: `isOpen`/`onClose`/`onSuccess` props, fixed overlay (bg rgba(0,16,26,0.8) click-to-close with dirty check), centered modal (max-w-[752px] w-full, bg --color-card-bg, rounded-[24px], p-10), title "Gửi lời cám ơn và ghi nhận đến đồng đội" (32px/700/center), Cancel button (close icon + "Hủy", secondary style), Submit button ("Gửi" + send icon, primary style, disabled by default), focus trap (Tab/Shift+Tab), Escape key closes (with dirty check), fade-in/out animation 200ms, `role="dialog"` + `aria-modal="true"` + `aria-label`. Dirty check uses `window.confirm()`. See plan.md Phase 2 + design-style.md for full visual specs. | src/components/kudos/kudo-modal/KudoModal.tsx
- [x] T013 Modify KudosInputPill: accept `onClick?: () => void` prop, call it inside existing `handleClick` function (replacing TODO comment). | src/components/kudos/KudosInputPill.tsx
- [x] T014 Create KudoModalWrapper client component: `"use client"`, manages `isModalOpen` state, lazy-loads KudoModal via `next/dynamic` with `{ ssr: false }`, renders `<KudosInputPill onClick={() => setIsModalOpen(true)} />`, renders dynamically-imported `<KudoModal>` when open, `onSuccess` callback dispatches `window.dispatchEvent(new Event('kudos-created'))` then closes modal. Does NOT call `useKudosFeed` directly. | src/components/kudos/KudoModalWrapper.tsx
- [x] T015 Modify HeroBanner (was AllKudosSection — KudosInputPill is rendered in HeroBanner): replace direct `<KudosInputPill />` render with `<KudoModalWrapper />`. AllKudosSection remains a Server Component — no state changes. | src/components/kudos/AllKudosSection.tsx

**Checkpoint**: Foundation ready — types defined, APIs functional, modal opens/closes from Live Board input pill. User story implementation can now begin.

---

## Phase 3: US1 + US7 — Send Basic Kudos + Custom Danh Hiệu (Priority: P1) 🎯 MVP

**Goal**: Implement recipient search and danh hiệu input — the two form fields that define "who" and "what title" for a kudos.

**Independent Test**: Open modal, search and select a recipient, type a danh hiệu title. Verify both fields retain values and show validation errors when empty.

### Frontend (US1 + US7)

- [x] T016 [P] [US1] Create RecipientSearch component: debounced autocomplete (300ms) calling `/api/users/search?q=...`, min 2 chars to trigger, dropdown showing avatar + display_name + department, "Không tìm thấy kết quả" empty state, click-outside close, controlled `value` (Profile | null) + `onChange`, error state red border (--color-required), field label "Người nhận*" with required asterisk (Noto Sans JP, 16px, #CF1322). See design-style.md Search Input section for exact dimensions (flex:1, h:56px, p:16px 24px, r:8px, border --color-border). | src/components/kudos/kudo-modal/RecipientSearch.tsx
- [x] T017 [P] [US7] Create DanhHieuInput component: text input with placeholder "Dành tặng một danh hiệu cho đồng đội", hint text "Ví dụ: Người truyền động lực cho tôi. Danh hiệu sẽ hiển thị làm tiêu đề Kudos của bạn." (16px/700, --color-text-gray), max 100 chars (client-side enforcement), required validation with error state, field label "Danh hiệu*". See design-style.md Danh hiệu Input section (w:514px, h:56px, same input styling). | src/components/kudos/kudo-modal/DanhHieuInput.tsx
- [x] T018 [US1] Wire form state in KudoModal: add useState for recipientId, recipientQuery, danhHieu, selectedHashtags (default []), attachedImages (default []), uploadedImageUrls (default []), isAnonymous (default false), anonymousName (default ""), isUploading (default false), errors (default {}). Render RecipientSearch and DanhHieuInput with controlled values. Submit button disabled when any required field empty (recipientId, danhHieu, content, selectedHashtags length). See plan.md Phase 3 step 3 for full state list. | src/components/kudos/kudo-modal/KudoModal.tsx

**Checkpoint**: Recipient search and Danh Hiệu fields functional within modal.

---

## Phase 4: US2 — Write Rich Text Kudos Message (Priority: P1)

**Goal**: Implement Tiptap-based rich text editor with toolbar and @-mention autocomplete.

**Independent Test**: Type formatted text using all 6 toolbar buttons (Bold, Italic, Strikethrough, Numbered List, Link, Quote). Type "@" to trigger mention autocomplete. Verify character count enforces 3000-char limit.

### Frontend (US2)

- [x] T019 [P] [US2] Create RichTextToolbar component: 6 formatting buttons (Bold/Italic/Strikethrough/Numbered List/Link/Quote) using new icons from Icon.tsx, each toggles `aria-pressed` state, connected top border (first button r:8px 0 0 0, all h:40px, p:10px 16px, border --color-border). Link button opens URL input dialog (reference Add Link Box spec `.momorph/specs/1-Addlink-Box/`). "Tiêu chuẩn cộng đồng" link (--color-link-red, right-aligned, opens new tab). Receives `editor` prop from Tiptap. See design-style.md Rich Text Toolbar section. | src/components/kudos/kudo-modal/RichTextToolbar.tsx
- [x] T020 [P] [US2] Create MentionSuggestion component: custom suggestion renderer for Tiptap Mention extension, fetches from `/api/users/search?q=...` (debounced 300ms), shows avatar + name + department in dropdown, keyboard navigation (arrow keys + Enter to select). Used as `suggestion` config for `@tiptap/extension-mention`. | src/components/kudos/kudo-modal/MentionSuggestion.tsx
- [x] T021 [US2] Create RichTextEditor component: Tiptap `useEditor()` with extensions — StarterKit (bold, italic, strike, orderedList, blockquote), Link, Mention (with MentionSuggestion), Placeholder ("Hãy gửi gắm lời cám ơn và ghi nhận đến đồng đội tại đây nhé!"), CharacterCount(limit: 3000). Connected bottom border (r:0 0 8px 8px, h:200px, min-h:120px, bg white, border --color-border). Hint below: "Bạn có thể '@ + tên' để nhắc tới đồng nghiệp khác" (16px/700, --color-text-dark, ls:0.5px). Expose `editor.getHTML()` for form submission. Wire into KudoModal form state. See design-style.md Textarea section. | src/components/kudos/kudo-modal/RichTextEditor.tsx

**Checkpoint**: Rich text editor functional with all 6 formatting actions + @-mentions.

---

## Phase 5: US3 — Add Hashtags to Kudos (Priority: P1)

**Goal**: Implement hashtag multi-select with chips. Hashtags are required (min 1, max 5).

**Independent Test**: Click "+ Hashtag", select 1-5 hashtags from dropdown, verify chips appear with remove (x) button. Add 5 and verify button hides. Remove one and verify button reappears. Try to submit with 0 hashtags — button should be disabled.

### Frontend (US3)

- [x] T022 [US3] Create HashtagSelector component: fetch hashtags from `/api/hashtags` on mount, "+ Hashtag" button (h:48px, p:4px 8px, r:8px, border --color-border, plus icon) opens dropdown (reuse pattern from Dropdown List Hashtag spec `1002:13013`), selected hashtags render as removable chips (gap:8px), "Tối đa 5" sub-label (11px/700, --color-text-gray), hide button when 5 selected, required (min 1). Error state in dropdown with retry if API fails. Wire into KudoModal `selectedHashtags` state. See design-style.md Hashtag section. | src/components/kudos/kudo-modal/HashtagSelector.tsx

**Checkpoint**: All P1 required form fields complete (Recipient + Danh Hiệu + Content + Hashtags). Submission can now be wired.

---

## Phase 6: US1 Completion — Submission Flow (Priority: P1)

**Goal**: Wire the full kudos submission flow: collect all form data, validate, submit via API, show feedback, refresh feed.

**Independent Test**: Fill all required fields (recipient, danh hiệu, rich text content, at least 1 hashtag), click "Gửi". Verify: loading state on button ("Đang gửi..."), all fields disabled during submission, success toast "Gửi Kudos thành công!", modal closes, Kudos Live Board feed refreshes to show new kudos.

### Frontend (US1)

- [x] T023 [US1] Create useCreateKudos hook: accepts form data object, calls `POST /api/kudos` with JSON body, returns `{ submit, isSubmitting, error }`. On submit: validate client-side with `createKudosSchema` → show loading → disable fields → call API → on success: show toast + call onSuccess callback → on error: show error toast "Gửi Kudos thất bại. Vui lòng thử lại." + re-enable form. | src/hooks/useCreateKudos.ts
- [x] T024 [US1] Wire full submission flow in KudoModal: collect recipientId, danhHieu, editor.getHTML(), selectedHashtags, uploadedImageUrls, isAnonymous, anonymousName. Submit button disabled conditions: (a) any required field empty, (b) isUploading true, (c) isSubmitting true. On success: toast + onSuccess callback (which dispatches 'kudos-created' event in KudoModalWrapper). On error: toast + keep modal open. | src/components/kudos/kudo-modal/KudoModal.tsx
- [x] T025 [US1] Update useKudosFeed hook: add internal `reset()` function that clears kudos array, resets cursor to null, re-fetches first page. Add `useEffect` listener for window event `'kudos-created'` that calls `reset()`. Clean up event listener on unmount. | src/hooks/useKudosFeed.ts

**Checkpoint**: 🎯 **MVP Complete** — All P1 user stories (US1+US2+US3+US7) functional end-to-end. User can open modal, fill all fields, submit kudos, see success feedback, and see the new kudos in the feed.

---

## Phase 7: US4 — Attach Images to Kudos (Priority: P2)

**Goal**: Implement image upload with thumbnails, client-side compression, and upload state tracking.

**Independent Test**: Click "+ Image", select image files, verify 80x80px thumbnails appear with red delete badges. Verify max 5 limit (button hides). Delete an image and verify slot freed. Upload a >1920px image and verify compression occurs. Verify "Gửi" button is disabled while images are uploading.

### Frontend (US4)

- [x] T026 [US4] Create ImageUploader component: "+ Image" button (h:48px, same style as Hashtag add button, plus icon) opens file picker (accept: image/jpeg, image/png, image/gif, image/webp), client-side validation (type + max 5MB per file, toast on failure), call `compressImage()` before upload for images >1920px, upload to `POST /api/upload/image` with FormData, show loading state on thumbnail slot during upload, 80x80px thumbnails with red circular delete badge (20x20, bg --color-delete-badge, r:50%, absolute top-right, close-tiny icon 17x17 white), max 5 images (hide button when reached), "Tối đa 5" sub-label, expose `isUploading` boolean to parent, error handling: toast on failure + allow retry/remove. Wire into KudoModal: `uploadedImageUrls` state + `isUploading` for submit button disable. See design-style.md Image Thumbnail section. | src/components/kudos/kudo-modal/ImageUploader.tsx

**Checkpoint**: Image attachments functional with compression, upload, preview, and delete.

---

## Phase 8: US5 — Send Kudos Anonymously (Priority: P2)

**Goal**: Implement anonymous sending checkbox with conditional name input.

**Independent Test**: Check "Gửi ẩn danh" checkbox — verify anonymous name field slides down (200ms). Enter a name and submit. Verify kudos shows anonymous name on Live Board instead of real sender. Submit without name — verify "Ẩn danh" is used as default.

### Frontend (US5)

- [x] T027 [US5] Create AnonymousSection component: checkbox (24x24, r:4px, border #999, bg white; checked: bg --color-gold-primary, border --color-border) with label "Gửi lời cám ơn và ghi nhận ẩn danh" (22px/700, --color-text-gray), gap:16px. When checked: slide-down animation (200ms ease-out) reveals anonymous name text input (w:100%, h:56px, same input styling, mt:16px). Anonymous name: max 50 chars, optional (server defaults to "Ẩn danh"). Profanity validation is server-side only. Wire into KudoModal `isAnonymous` + `anonymousName` state. See design-style.md Anonymous sections. | src/components/kudos/kudo-modal/AnonymousSection.tsx

**Checkpoint**: Anonymous sending mode functional.

---

## Phase 9: Live Board Display Updates (FR-013, FR-019, TR-008)

**Purpose**: Update existing feed components to display new kudos fields (danh_hieu, anonymous sender, rich text content).

- [x] T028 [P] Modify QuoteBox for safe HTML rendering: add `"use client"` directive (needed for `useEditor` hook). Detect HTML content via regex `/<[a-z][\s\S]*>/i`. If plain text (legacy): render as-is in current `<p>` tag. If HTML: render via Tiptap read-only mode (`editable: false`, StarterKit + Link + Mention extensions, `content` prop = HTML string). Replace outer `<p>` with `<div>` to allow block-level children (`<ol>`, `<blockquote>`). Preserve line-clamp behavior on outer container. See plan.md Phase 7 step 1 for full details. | src/components/kudos/QuoteBox.tsx
- [x] T029 [P] Modify KudosCard: display `danh_hieu` as kudos title/headline above QuoteBox content. If `danh_hieu` is empty string (legacy kudos), show no title (current behavior). Style: 22px/700, --color-text-dark per design-style.md field label spec. | src/components/kudos/KudosCard.tsx
- [x] T030 [P] Modify KudosCardHeader: check `is_anonymous` flag. If true: replace sender display_name with `anonymous_name` (or "Ẩn danh" if empty/null), replace avatar with generic anonymous placeholder, hide sender department. If false (default): current behavior unchanged. | src/components/kudos/KudosCardHeader.tsx

**Checkpoint**: New kudos display correctly on Live Board with danh_hieu titles, anonymous senders, and rich text content.

---

## Phase 10: Polish & Cross-Cutting Concerns

**Purpose**: Loading states, error handling, responsive design, animations, and accessibility improvements across all components.

### Loading States

- [ ] T031 [P] Add loading states to all async components: RecipientSearch (spinner in dropdown during fetch), ImageUploader (loading indicator on thumbnail slot), KudoModal submit button ("Đang gửi..." with spinner + all fields disabled during submission), MentionSuggestion (inline loading in autocomplete popup). | src/components/kudos/kudo-modal/*.tsx

### Error States

- [ ] T032 [P] Add error states per spec Error States table: red border (--color-required) on invalid fields, toast messages for all error scenarios (image too large, unsupported format, upload failure, submit failure, hashtag API failure with retry), session expired handling (toast "Phiên đăng nhập hết hạn" + redirect to login after 2 seconds). | src/components/kudos/kudo-modal/*.tsx

### Responsive Design

- [ ] T033 [P] Implement responsive breakpoints per design-style.md: Mobile (<640px): full-screen modal w-full h-screen r-0 p-6, title 24px, labels 18px, stacked action buttons (flex-col gap-4, both w-full), thumbnails 60x60, toolbar flex-wrap. Tablet (640-1023px): w-[90%] max-w-[752px] p-8. Desktop (>=1024px): w-[752px] centered. | src/components/kudos/kudo-modal/KudoModal.tsx

### Animations

- [ ] T034 [P] Add animations per design-style.md: modal open/close (opacity + transform, 200ms ease-out), button hover (background-color, 150ms ease-in-out), input focus (border-color, 150ms ease-in-out), toolbar toggle (background-color, 100ms ease-in-out), image delete badge hover (opacity + transform, 150ms ease-out), checkbox toggle (background-color + border-color, 100ms ease-in-out), anonymous field reveal (slide-down 200ms ease-out via max-height transition). | src/components/kudos/kudo-modal/*.tsx

### Accessibility

- [ ] T035 Verify and complete accessibility: focus trap within modal (Tab/Shift+Tab cycle), `role="dialog"` + `aria-modal="true"` on modal, `aria-label` on all toolbar icon buttons, `aria-required="true"` on required fields (Người nhận, Danh hiệu, Hashtag), `aria-pressed` on toolbar toggle buttons, tab order: Người nhận → Danh hiệu → Toolbar buttons → Textarea → Hashtag → Image → Checkbox → Hủy → Gửi, focus visible: `outline: 2px solid var(--color-gold-primary) outline-offset-2` on all focusable elements, Escape key closes modal (with dirty check). | src/components/kudos/kudo-modal/*.tsx

**Checkpoint**: Feature complete with full polish — all states, responsive design, animations, and accessibility.

---

## Phase 11: Testing

**Purpose**: Comprehensive test coverage per constitution III (TDD) and plan.md Phase 9.

### Component Tests (Vitest + Testing Library)

- [ ] T036 [P] Test KudoModal: open/close behavior, Escape key closes (with dirty check confirmation), overlay click closes (with dirty check), focus trap (Tab cycles within modal), submit button disabled states (missing required fields, isUploading, isSubmitting), form state management. | src/__tests__/components/kudos/kudo-modal/KudoModal.test.tsx
- [ ] T037 [P] Test KudoModalWrapper: opens modal on KudosInputPill click, dispatches 'kudos-created' event on success, lazy loads KudoModal component. | src/__tests__/components/kudos/kudo-modal/KudoModalWrapper.test.tsx
- [ ] T038 [P] Test RecipientSearch: 300ms debounce, min 2 chars trigger, selection updates value, "Không tìm thấy kết quả" empty state, API error handling, click-outside closes dropdown. | src/__tests__/components/kudos/kudo-modal/RecipientSearch.test.tsx
- [ ] T039 [P] Test DanhHieuInput: placeholder text, hint text visible, max 100 chars enforcement, required validation error state. | src/__tests__/components/kudos/kudo-modal/DanhHieuInput.test.tsx
- [ ] T040 [P] Test RichTextEditor: all 6 toolbar toggles (Bold/Italic/Strikethrough/List/Link/Quote), placeholder text, character count limit (3000), @-mention trigger, editor.getHTML() output. | src/__tests__/components/kudos/kudo-modal/RichTextEditor.test.tsx
- [ ] T041 [P] Test HashtagSelector: add hashtag from dropdown, remove chip, max 5 limit (button hides), required validation (min 1), API error with retry. | src/__tests__/components/kudos/kudo-modal/HashtagSelector.test.tsx
- [ ] T042 [P] Test ImageUploader: file type validation (reject non-image), file size validation (reject >5MB), compression called for large images, max 5 limit, delete removes image, isUploading tracks upload state, error toast on upload failure. | src/__tests__/components/kudos/kudo-modal/ImageUploader.test.tsx
- [ ] T043 [P] Test AnonymousSection: checkbox toggles isAnonymous, anonymous name field appears/disappears with animation, max 50 chars enforcement, defaults to "Ẩn danh" when empty. | src/__tests__/components/kudos/kudo-modal/AnonymousSection.test.tsx
- [ ] T044 [P] Test QuoteBox: plain text renders as-is (legacy), HTML content renders via Tiptap read-only (bold/italic/lists/links/mentions displayed correctly), HTML detection regex works, line-clamp preserved. | src/__tests__/components/kudos/QuoteBox.test.tsx
- [ ] T045 [P] Test KudosCard: danh_hieu displays as title, no title for legacy kudos (empty danh_hieu), anonymous sender shows anonymous_name, anonymous sender hides department. | src/__tests__/components/kudos/KudosCard.test.tsx

### Hook Tests

- [ ] T046 [P] Test useCreateKudos: successful submission returns data, API error returns error state, isSubmitting toggles correctly, client-side Zod validation catches invalid data before API call. | src/__tests__/hooks/useCreateKudos.test.ts

### API Route Tests (Vitest + MSW)

- [ ] T047 [P] Test POST /api/kudos: auth check (401 if unauthenticated), Zod validation errors (422 with field errors), self-kudos rejection (400), HTML sanitization (dangerous tags stripped, allowed tags preserved), successful insert returns 201, profile counters updated via RPC. | src/__tests__/app/api/kudos/post.test.ts
- [ ] T048 [P] Test POST /api/upload/image: auth check (401), file type validation (reject non-image MIME types), file size validation (reject >5MB), successful upload returns public URL, Supabase Storage error handling (500). | src/__tests__/app/api/upload/image.test.ts

### Utility Tests

- [ ] T049 [P] Test sanitizeHtml: allowlisted tags pass through unchanged (p, strong, em, s, ol, li, a, blockquote, span[data-mention]), dangerous tags stripped (script, iframe, style, onerror), attributes filtered (only allowed attrs preserved), empty input returns empty string. | src/__tests__/utils/sanitizeHtml.test.ts
- [ ] T050 [P] Test compressImage: images above maxDimension are resized (output dimensions ≤ max), quality reduced (output size < input), output format correct (JPEG/WebP), small images pass through unchanged (no resize), non-image input rejected. | src/__tests__/utils/compressImage.test.ts
- [x] T051 ~~REMOVED~~ — profanityFilter utility was deleted per user request. No test needed.

**Checkpoint**: All tests passing. Feature complete and verified.

---

## Dependencies & Execution Order

### Phase Dependencies

```
Phase 1 (Setup)
  └─► Phase 2 (Foundation) — BLOCKS all user stories
        ├─► Phase 3 (US1+US7: Form Fields)
        │     └─► Phase 4 (US2: Rich Text) ─┐
        │           └─► Phase 5 (US3: Hashtags) ─┤
        │                 └─► Phase 6 (US1: Submission) ◄─┘  ← MVP Checkpoint
        │
        ├─► Phase 7 (US4: Images) — can start after Phase 2, parallel with Phase 3-5
        ├─► Phase 8 (US5: Anonymous) — can start after Phase 2, parallel with Phase 3-5
        │
        └─► Phase 9 (Live Board) — after Phase 6 (needs new fields to display)
              └─► Phase 10 (Polish) — after all feature phases
                    └─► Phase 11 (Testing) — after all implementation
```

### Parallel Opportunities

**Within Phase 2 (Foundation)**:
- T006, T007, T009 can all run in parallel (different utility files; T008 removed)
- T010 and T011 can run in parallel (different API files), but both depend on T006
- T013 depends on T012; T015 depends on T013+T014

**Across User Story Phases**:
- Phase 7 (US4: Images) can start immediately after Phase 2 — it only needs the modal shell + upload API
- Phase 8 (US5: Anonymous) can start immediately after Phase 2 — it only needs the modal shell
- These can proceed in parallel with Phases 3-5 if multiple developers are available

**Within Phase 9 (Live Board)**:
- T028, T029, T030 can all run in parallel (different component files)

**Within Phase 11 (Testing)**:
- ALL test tasks (T036-T051) can run in parallel (different test files)

### Critical Path (Sequential)

```
T001 → T006 → T012 → T018 → T021 → T022 → T024 → T025 (MVP)
```

This is the minimum sequential chain to reach the MVP checkpoint.

---

## Implementation Strategy

### MVP First (Recommended)

1. Complete Phase 1 (Setup) + Phase 2 (Foundation)
2. Complete Phase 3 (Form Fields) + Phase 4 (Rich Text) + Phase 5 (Hashtags)
3. Complete Phase 6 (Submission Flow)
4. **STOP and VALIDATE**: Open modal → fill all required fields → submit → verify toast + modal closes + feed refreshes
5. Deploy if ready — core kudos creation works

### Incremental Delivery

1. Setup + Foundation → Modal opens/closes from Live Board
2. Add US1+US7 (Form Fields) → Recipient search + Danh Hiệu functional
3. Add US2 (Rich Text) → Formatted messages with @-mentions
4. Add US3 (Hashtags) → Categorized kudos
5. **MVP deployed** (Phases 1-6)
6. Add US4 (Images) → Photo attachments
7. Add US5 (Anonymous) → Anonymous sending
8. Add Live Board Display → New fields visible in feed
9. Polish → Full UX refinement
10. Testing → Comprehensive coverage

### Per-Task Workflow

For each task:
1. Read the task description and referenced plan.md/design-style.md sections
2. Implement the minimum code to fulfill the task
3. Verify: `yarn build` passes, no TypeScript errors
4. Commit with conventional format: `feat(kudos): <description>`

---

## Notes

- US6 (Cancel/Close) is implemented in Phase 2 (Foundation) as T012 since the modal shell is a prerequisite for all other stories
- The content character limit (FR-020: 3000 chars) applies to TEXT characters enforced by Tiptap CharacterCount on the client. Server-side Zod validates the HTML string at a generous 15000-char ceiling. See plan.md notes for rationale.
- The `kudos.hashtags` column stores `TEXT[]` (array of name strings), not foreign keys. HashtagSelector sends `["hashtag1", "hashtag2"]` format.
- Feed refresh uses a custom DOM event (`'kudos-created'`), NOT direct hook coupling. See plan.md Architecture Decisions for the full rationale.
- All modal components use `"use client"` directive per constitution V (event handlers + React state).
- Tiptap extensions must be imported individually for tree-shaking — do NOT import full bundles.
- Image compression via Canvas API is browser-only — this is fine since ImageUploader is a client component.
- QuoteBox needs `"use client"` after Phase 9 modifications (useEditor hook for Tiptap read-only rendering).
- Commit after each task or logical group. Run `yarn lint` and `yarn build` before each commit.
