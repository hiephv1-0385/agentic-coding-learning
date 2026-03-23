# Feature Specification: Viet Kudo (Write Kudos Modal)

**Frame ID**: `520:11602`
**Frame Name**: `Viet Kudo`
**File Key**: `9ypp4enmFmdK3YAFJLIu6C`
**Created**: 2026-03-12
**Status**: Reviewed

---

## Overview

The **Viet Kudo** (Write Kudos) modal is the primary interface for Sunners (Sun* employees) to send kudos -- messages of appreciation and recognition -- to their colleagues within the SAA 2025 platform. It appears as a centered modal dialog overlaying the Kudos Live Board page. The form collects a recipient, a custom title/honor ("Danh hiệu"), a rich-text message body with formatting and @-mentions, hashtags, optional image attachments, and an anonymous sending option.

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Send a Basic Kudos (Priority: P1)

A logged-in Sunner opens the Write Kudos modal, selects a recipient, enters a title and message, adds at least one hashtag, and submits the kudos.

**Why this priority**: This is the core action of the entire Kudos system. Without the ability to send kudos, there is no content for the Live Board.

**Independent Test**: Open the modal, fill all required fields (recipient, danh hiệu, message, hashtag), click "Gửi", and verify the kudos is created and the modal closes.

**Acceptance Scenarios**:

1. **Given** the user is authenticated and clicks the kudos input pill on the Live Board, **When** the modal opens, **Then** an overlay (rgba(0,16,26,0.8)) covers the page and a centered modal (752px wide, cream background #FFF8E1, rounded 24px) appears with all form fields empty.
2. **Given** the modal is open, **When** the user searches for a recipient in the "Người nhận" field, **Then** an autocomplete dropdown filters and shows matching Sunner names as they type.
3. **Given** all required fields (Người nhận, Danh hiệu, message content, at least 1 hashtag) are filled, **When** the user clicks "Gửi", **Then** the form validates, submits the kudos to the API, shows a loading state on the button, and closes the modal on success.
4. **Given** a required field is empty, **When** the user attempts to submit, **Then** the "Gửi" button MUST be disabled (grayed out, not clickable) until all required fields are filled. If the user somehow bypasses client-side validation, server-side validation rejects the request and returns field-level errors displayed with red borders (border-color: #CF1322) on invalid fields.

---

### User Story 2 - Write Rich Text Kudos Message (Priority: P1)

A Sunner uses the rich text editor toolbar to format their kudos message with bold, italic, strikethrough, numbered lists, links, and block quotes.

**Why this priority**: The rich text editor is integral to the kudos form -- it is the primary content area and must function correctly.

**Independent Test**: Toggle each toolbar button (B, I, S, numbered list, link, quote) and verify formatting is applied to selected text or new input.

**Acceptance Scenarios**:

1. **Given** the editor toolbar is visible, **When** the user clicks the Bold (B) button, **Then** the button toggles active and subsequent text is bold; clicking again deactivates bold.
2. **Given** the editor toolbar is visible, **When** the user clicks the Italic (I) button, **Then** italic formatting toggles for selected/new text.
3. **Given** the editor toolbar is visible, **When** the user clicks the Strikethrough (S) button, **Then** strikethrough formatting toggles.
4. **Given** the editor toolbar is visible, **When** the user clicks the Numbered List button, **Then** a numbered list is inserted/toggled.
5. **Given** the editor toolbar is visible, **When** the user clicks the Link button, **Then** a dialog/popup appears to input a URL, and a hyperlink is inserted.
6. **Given** the editor toolbar is visible, **When** the user clicks the Quote button, **Then** a blockquote is inserted/toggled.
7. **Given** the user types "@" followed by characters in the textarea, **When** matching names appear, **Then** an autocomplete dropdown shows Sunner names to mention.

---

### User Story 3 - Add Hashtags to Kudos (Priority: P1)

A Sunner adds hashtags to categorize their kudos, with a maximum of 5 hashtags.

**Why this priority**: Hashtags are required for every kudos and drive the filtering/discovery system on the Live Board.

**Independent Test**: Click "+ Hashtag", add 1-5 hashtags from dropdown, verify chips appear. Try adding a 6th and verify it is blocked.

**Acceptance Scenarios**:

1. **Given** the Hashtag section shows the "+ Hashtag" button, **When** the user clicks it, **Then** a dropdown appears showing available hashtags to select from.
2. **Given** the user selects a hashtag from the dropdown, **When** selected, **Then** a chip/tag appears in the hashtag row and the count increments.
3. **Given** 5 hashtags have been added, **When** the user tries to add another, **Then** the "+ Hashtag" button is hidden or disabled.
4. **Given** hashtag chips are displayed, **When** the user clicks the "x" on a chip, **Then** the chip is removed and the count decrements.
5. **Given** no hashtags are selected, **When** the user tries to submit, **Then** validation prevents submission (hashtag is required).

---

### User Story 4 - Attach Images to Kudos (Priority: P2)

A Sunner attaches up to 5 images to their kudos message.

**Why this priority**: Image attachments enrich kudos but are optional, making this lower priority than required fields.

**Independent Test**: Click "+ Image", select files, verify thumbnails appear with delete badges. Verify max 5 limit.

**Acceptance Scenarios**:

1. **Given** the Image section shows the "+ Image" button, **When** the user clicks it, **Then** a file picker opens allowing image selection.
2. **Given** an image is selected, **When** the file picker closes, **Then** an 80x80px thumbnail appears with a red delete badge (x) in the top-right corner.
3. **Given** 5 images have been added, **When** the limit is reached, **Then** the "+ Image" button is hidden.
4. **Given** image thumbnails are displayed, **When** the user clicks the red delete badge (x), **Then** the image is removed and the "+ Image" button reappears if previously hidden.

---

### User Story 5 - Send Kudos Anonymously (Priority: P2)

A Sunner chooses to send their kudos anonymously so the recipient does not see the sender's identity.

**Why this priority**: Anonymous sending is an optional feature that adds flexibility but is not core to the kudos flow.

**Independent Test**: Check the "Gửi ẩn danh" checkbox and submit a kudos. Verify the sender is hidden on the resulting kudos card.

**Acceptance Scenarios**:

1. **Given** the checkbox "Gửi lời cám ơn và ghi nhận ẩn danh" is unchecked (default), **When** the user checks it, **Then** the checkbox becomes checked, anonymous mode is enabled, and an additional text field appears for entering an anonymous display name.
2. **Given** anonymous mode is enabled and the anonymous name field is visible, **When** the user enters a display name, **Then** that name is used as the sender identity on the Live Board instead of the user's real name.
3. **Given** anonymous mode is enabled, **When** the user submits the kudos, **Then** the kudos is created with the sender's real identity hidden from the recipient and on the Live Board, replaced by the anonymous display name (or a default "Ẩn danh" label if no name entered).
4. **Given** the checkbox is checked, **When** the user unchecks it, **Then** anonymous mode is disabled, the anonymous name field is hidden, and the kudos will show the sender's real identity.

---

### User Story 6 - Cancel Kudos Writing (Priority: P2)

A Sunner decides to cancel the kudos they were writing and close the modal.

**Why this priority**: Users need an escape hatch to abandon the form without submitting.

**Independent Test**: Fill some fields, click "Hủy", verify modal closes and no kudos is created.

**Acceptance Scenarios**:

1. **Given** the modal is open with data entered, **When** the user clicks the "Hủy" (Cancel) button, **Then** the modal closes and all entered data is discarded.
2. **Given** the modal is open, **When** the user clicks the overlay outside the modal, **Then** the modal closes (or a confirmation dialog appears if data was entered).

---

### User Story 7 - Enter Custom Danh Hiệu (Title/Honor) (Priority: P1)

A Sunner enters a custom title or honor ("Danh hiệu") for the recipient, which will display as the kudos headline.

**Why this priority**: The Danh hiệu is a required field that personalizes each kudos and appears as its title.

**Independent Test**: Type a custom title in the Danh hiệu field and verify it is saved with the kudos.

**Acceptance Scenarios**:

1. **Given** the Danh hiệu field is empty with placeholder "Dành tặng một danh hiệu cho đồng đội", **When** the user types a title, **Then** the input accepts text and the placeholder disappears.
2. **Given** the Danh hiệu field is empty, **When** the user tries to submit, **Then** validation prevents submission (Danh hiệu is required).
3. **Given** the hint text below shows examples ("Ví dụ: Người truyền động lực cho tôi. Danh hiệu sẽ hiển thị làm tiêu đề Kudos của bạn."), **When** the field is visible, **Then** the hint is always displayed below the input.

---

### Edge Cases

- What happens when the user's session expires while the modal is open? Show a session expired message and redirect to login.
- What happens if the API call to submit kudos fails? Show an error toast, keep the modal open with data intact, allow retry.
- What if the recipient search returns no results? Show "Không tìm thấy kết quả" in the dropdown.
- What if the user pastes an image larger than the allowed size? Show a validation error toast with file size limit.
- What happens when the user tries to @-mention someone not in the system? Only allow mentions from the autocomplete list.
- What if network is lost while uploading images? Show an error on the failed thumbnail and allow retry or removal.
- What happens if the "Tiêu chuẩn cộng đồng" (Community Standards) link is clicked? Open community standards in a new tab/modal without losing form data.
- What if the user sends a kudos to themselves? System should prevent self-kudos (validate recipient_id != sender_id server-side).
- What if the user submits while images are still uploading? Disable "Gửi" button until all uploads complete.
- What happens when anonymous mode is enabled but no anonymous name is entered? Use default label "Ẩn danh" (Anonymous).
- What if the anonymous name contains inappropriate content? No filtering — the anonymous name is accepted as-is (max 50 characters).
- Are there limits on how many kudos a user can send to the same recipient? No limits -- users can send unlimited kudos to the same person.

---

## UI/UX Requirements *(from Figma)*

### Screen Components

| Component | Description | Interactions |
|-----------|-------------|--------------|
| Modal Overlay | Full-screen dark overlay (rgba(0,16,26,0.8)) | Click to close modal (with confirmation if data entered) |
| Modal Container | Centered 752px cream card (#FFF8E1) with 24px radius, 40px padding | Scrollable if content overflows |
| Modal Title | "Gửi lời cám ơn và ghi nhận đến đồng đội" (32px, bold, centered) | Display only |
| Người Nhận Field | Label + search dropdown with autocomplete | Type to search, select from dropdown |
| Danh Hiệu Field | Label + text input with placeholder and hint text | Type custom title |
| Rich Text Toolbar | 6 formatting buttons (B, I, S, list, link, quote) + community standards link | Toggle formatting, click link |
| Textarea | Rich text area with placeholder and @-mention support | Type message, @-mention colleagues |
| Hint Text | "Bạn có thể '@+tên' để nhắc tới đồng nghiệp khác" | Display only |
| Hashtag Section | Label + "+ Hashtag" button + tag chips | Add/remove hashtags (max 5) |
| Image Section | Label + image thumbnails with delete badges + "+ Image" button | Upload/remove images (max 5) |
| Anonymous Checkbox | Checkbox + label "Gửi lời cám ơn và ghi nhận ẩn danh" | Toggle anonymous mode; reveals anonymous name field when checked |
| Anonymous Name Field | Text input for anonymous display name (hidden by default) | Type anonymous name; visible only when checkbox is checked |
| Cancel Button | "Hủy" with close icon, secondary style | Close modal, discard data |
| Submit Button | "Gửi" with send icon, primary yellow style (#FFEA9E) | Validate and submit form |

### Navigation Flow

- From: Kudos Live Board (click kudos input pill)
- To: Back to Kudos Live Board (on submit success or cancel)
- Triggers: Click input pill opens modal; click "Gửi" submits and closes; click "Hủy" or overlay closes without submitting

### Visual Requirements

- Responsive breakpoints: Mobile (< 640px), Tablet (640px - 1023px), Desktop (>= 1024px)
- Animations/Transitions: Modal fade-in/out (200ms), button hover transitions (150ms)
- See `design-style.md` for complete visual specifications

### Accessibility Requirements

| Requirement | Implementation |
|-------------|----------------|
| WCAG AA color contrast | 4.5:1 minimum; #00101A on #FFF8E1 passes |
| Touch targets | Minimum 44x44px on mobile for all interactive elements |
| Keyboard navigation | Tab order: Người nhận -> Danh hiệu -> Toolbar buttons -> Textarea -> Hashtag -> Image -> Checkbox -> Hủy -> Gửi |
| Focus indicators | 2px solid #FFEA9E outline with 2px offset on all focusable elements |
| Screen reader | ARIA labels: `aria-label` on toolbar icon buttons, `aria-required="true"` on required fields, `role="dialog"` on modal, `aria-modal="true"` |
| Focus trap | Focus must be trapped within the modal while open |
| Escape key | Pressing Escape closes the modal |
| Rich text a11y | Toolbar buttons use `aria-pressed` for toggle state |

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display a modal dialog when the user clicks the kudos input pill on the Live Board.
- **FR-002**: System MUST provide a "Người nhận" (Recipient) search field with autocomplete that filters Sunner names as the user types. Field is required.
- **FR-003**: System MUST provide a "Danh hiệu" (Title/Honor) text input field. Field is required. Hint text shows example ("Ví dụ: Người truyền động lực cho tôi").
- **FR-004**: System MUST provide a rich text editor with toolbar buttons for Bold, Italic, Strikethrough, Numbered List, Link, and Block Quote formatting.
- **FR-005**: System MUST support @-mention autocomplete in the rich text editor -- typing "@" followed by characters shows matching Sunner names.
- **FR-006**: Rich text content field is required. System MUST prevent submission with empty content.
- **FR-007**: System MUST provide a "Hashtag" selector with a "+ Hashtag" button that opens a dropdown. Required, minimum 1, maximum 5 hashtags.
- **FR-008**: System MUST display selected hashtags as removable chips.
- **FR-009**: System MUST provide an "Image" attachment section with a "+ Image" button that opens a file picker. Optional, maximum 5 images.
- **FR-010**: System MUST display uploaded images as 80x80px thumbnails with a red circular delete badge.
- **FR-011**: When 5 images are attached, the "+ Image" button MUST be hidden.
- **FR-012**: System MUST provide an "Gửi ẩn danh" (Send Anonymously) checkbox. Default unchecked.
- **FR-013**: When anonymous mode is enabled, the kudos sender identity MUST be hidden from the recipient and on the Live Board display.
- **FR-014**: When the anonymous checkbox is checked, system MUST reveal an additional text field for the user to enter an anonymous display name. When unchecked, the field MUST be hidden.
- **FR-015**: The "Gửi" (Submit) button MUST be disabled when required fields (Người nhận, Danh hiệu, content, hashtag) are not filled.
- **FR-016**: Clicking "Gửi" MUST validate all fields, submit the kudos via API, show loading state, and close the modal on success.
- **FR-017**: Clicking "Hủy" (Cancel) MUST close the modal and discard all entered data.
- **FR-018**: System MUST display a "Tiêu chuẩn cộng đồng" (Community Standards) link in the toolbar area that opens community guidelines.
- **FR-019**: The "Danh hiệu" MUST be displayed as the kudos title/headline on the Live Board after submission.
- **FR-020**: System MUST enforce the following field character limits: Danh hiệu max 100 characters, rich text content max 3000 characters, anonymous name max 50 characters.
- **FR-021**: On successful submission, system MUST show a success toast notification (e.g., "Gửi Kudos thành công!") and close the modal. The Kudos Live Board feed MUST refresh to show the new kudos.
- **FR-022**: System MUST allow pressing the Escape key to close the modal (equivalent to clicking "Hủy").
- **FR-023**: System MUST prevent users from sending kudos to themselves (validate recipient_id != sender_id server-side).

### Technical Requirements

- **TR-001**: Modal MUST trap keyboard focus and support Escape key to close.
- **TR-002**: Rich text editor MUST use a library compatible with Cloudflare Workers runtime (e.g., Tiptap, Lexical). Editor MUST output sanitized HTML for storage.
- **TR-003**: Image upload MUST use Supabase Storage with client-side compression/resizing before upload.
- **TR-004**: All form data MUST be validated both client-side (for UX) and server-side (for security) using Zod schemas.
- **TR-005**: @-mention search MUST debounce API calls (300ms minimum).
- **TR-006**: Form submission MUST use Server Actions or API route with proper CSRF protection.
- **TR-007**: Image files MUST be validated for type (JPEG, PNG, GIF, WebP) and size (max 5MB per image). Files exceeding limits MUST be rejected with a user-facing error toast before upload.
- **TR-008**: Rich text content is stored as **sanitized HTML**. Editor output MUST be sanitized server-side (e.g., DOMPurify or similar allowlist-based sanitizer) before storage to prevent XSS (per constitution IV). Allowed tags: `<p>`, `<strong>`, `<em>`, `<s>`, `<ol>`, `<li>`, `<a>`, `<blockquote>`, `<span data-mention>`. Never render stored HTML via `dangerouslySetInnerHTML` — use a safe renderer or re-parse through the editor's read-only mode.

### Key Entities *(if feature involves data)*

- **Kudos**: Recognition message containing: recipient_id, sender_id, danh_hieu (title, max 100 chars), content (sanitized HTML, max 3000 chars), hashtag_ids[], image_urls[], is_anonymous (boolean), anonymous_name (string, optional, max 50 chars).
- **Sunner**: Employee profile used for recipient search and @-mention autocomplete (id, name, department, avatar_url).
- **Hashtag**: Pre-defined tags for kudos categorization (id, name, slug).
- **Image Attachment**: Uploaded image file stored in Supabase Storage (id, kudos_id, storage_path, url).

---

## State Management

### Local Component State

| State | Type | Initial | Component | Purpose |
|-------|------|---------|-----------|---------|
| recipientId | string \| null | null | KudoModal | Selected recipient Sunner ID |
| recipientQuery | string | "" | RecipientSearch | Search input value |
| danhHieu | string | "" | KudoModal | Title/honor text |
| editorContent | string | "" | RichTextEditor | Rich text content (sanitized HTML string) |
| selectedHashtags | string[] | [] | HashtagSelector | Selected hashtag IDs |
| attachedImages | File[] | [] | ImageUploader | Uploaded image files |
| imagePreviewUrls | string[] | [] | ImageUploader | Blob URLs for thumbnails |
| isAnonymous | boolean | false | KudoModal | Anonymous send toggle |
| anonymousName | string | "" | KudoModal | Anonymous display name (visible when isAnonymous=true) |
| isSubmitting | boolean | false | KudoModal | Submission loading state |
| errors | Record<string, string> | {} | KudoModal | Field validation errors |

### Server/Global State

| State | Source | Purpose |
|-------|--------|---------|
| session | Supabase Auth | Current user session for authenticated submission |
| sunnersList | API (cached) | Autocomplete data for recipient search and @-mentions |
| hashtagsList | API (cached) | Available hashtags for selection dropdown |

### Loading States

| Component | Loading Behavior |
|-----------|-----------------|
| Modal (initial) | Open immediately with empty form; hashtags list loaded async |
| Recipient search | Show spinner in dropdown while fetching results (debounced 300ms) |
| Image upload | Show progress indicator on thumbnail slot while uploading |
| Form submission | "Gửi" button shows spinner, text changes to "Đang gửi...", all fields disabled |
| @-mention search | Inline loading indicator in autocomplete popup |

### Error States

| Component | Error Behavior |
|-----------|----------------|
| Recipient search | Show "Không tìm thấy kết quả" if no matches; show error toast on API failure |
| Image upload | Show error icon on failed thumbnail, allow retry or removal; toast "Tải ảnh thất bại" |
| Image validation | Toast "Ảnh vượt quá 5MB" or "Định dạng ảnh không hỗ trợ" before upload attempt |
| Form submission | Keep modal open with data intact; show error toast "Gửi Kudos thất bại. Vui lòng thử lại."; re-enable form |
| Hashtag load failure | Show error state in dropdown with retry option |
| Session expired | Show toast "Phiên đăng nhập hết hạn", redirect to login after 2 seconds |

---

## API Dependencies

| Endpoint | Method | Purpose | Status |
|----------|--------|---------|--------|
| /api/kudos | POST | Submit new kudos (recipient, danh_hieu, content, hashtags, images, is_anonymous) | Predicted |
| /api/users/search | GET | Search Sunner profiles for recipient autocomplete (query: q) | Predicted |
| /api/hashtags | GET | Fetch available hashtags for selector dropdown | Predicted |
| /api/upload/image | POST | Upload image attachment to Supabase Storage | Predicted |

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Modal opens within 200ms of clicking the kudos input pill.
- **SC-002**: Recipient autocomplete shows results within 500ms of typing (after 300ms debounce).
- **SC-003**: Form submission completes within 3 seconds (including image uploads).
- **SC-004**: All 25 design items from Figma are implemented with pixel-perfect accuracy per design-style.md.
- **SC-005**: Zero critical accessibility violations (axe-core audit); modal passes focus trap and keyboard navigation tests.

---

## Out of Scope

- Kudos Live Board page (separate spec: `2940-13431-sun-kudos-live-board`)
- Community Standards page content (linked via "Tiêu chuẩn cộng đồng" link)
- Recipient profile preview/detail page
- Hashtag creation/management (only selection from existing)
- Image editing/cropping
- Draft saving / auto-save of in-progress kudos
- Push notifications for kudos received

---

## Dependencies

- [x] Constitution document exists (`.momorph/constitution.md`)
- [ ] API specifications available (`.momorph/API.yml`)
- [ ] Database design completed (`.momorph/database.sql`)
- [x] Screen flow documented (`.momorph/contexts/SCREENFLOW.md`)
- [x] Related spec: Kudos Live Board (`.momorph/specs/2940-13431-sun-kudos-live-board/spec.md`)

---

## Notes

- All text content is in Vietnamese. The UI supports a language switcher but only Vietnamese content is specified in this frame.
- The modal is designed at 752px width on a 1440px viewport; responsive behavior per constitution breakpoints.
- The rich text toolbar and textarea share a connected border (toolbar has top-left radius, textarea has bottom radius) creating a unified editor component.
- The "Danh hiệu" field serves as the kudos card title on the Live Board -- this is confirmed by the hint text: "Danh hiệu sẽ hiển thị làm tiêu đề Kudos của bạn."
- Font families used: Montserrat (primary), Noto Sans JP (required asterisk only).
- The "Tiêu chuẩn cộng đồng" link (community standards) in the toolbar uses red text (#E46060) to stand out.
- Anonymous checkbox label color is #999 (gray), suggesting it is a secondary/optional feature.
- The Submit button (502px) is significantly wider than the Cancel button, emphasizing the primary action.
- Per constitution V (Next.js): `KudoModal` and its children MUST use `"use client"` directive since they require browser APIs, event handlers, and React state/effects. Data fetching (hashtags list, user search) should use Server Actions or API routes called from the client component.
- The Hashtag selector reuses the existing Dropdown List Hashtag (Multi-Select) component (frame `1002:13013`, spec at `.momorph/specs/4-Dropdown-list-hashtag/`). Implementation should reference that spec for the dropdown behavior and styling.
- The Link toolbar button may open the Add Link Box component (frame `1002:12917`, spec at `.momorph/specs/1-Addlink-Box/`). Implementation should reference that spec for the link dialog behavior.
