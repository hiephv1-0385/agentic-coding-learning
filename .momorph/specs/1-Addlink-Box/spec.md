# Feature Specification: Add Link Box

**Frame ID**: `1002:12917`
**Frame Name**: `Addlink Box`
**File Key**: `9ypp4enmFmdK3YAFJLIu6C`
**Created**: 2026-03-09
**Status**: Draft

---

## Overview

A modal/dialog box that allows users to add a hyperlink by entering display text ("Nội dung" / Content) and a URL. The component includes form validation and two actions: Cancel ("Hủy") and Save ("Lưu"). This is a reusable UI component used within a content editor or profile management context.

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Save a valid link (Priority: P1)

As a user editing content, I want to add a hyperlink with custom display text and URL so that I can embed clickable links in my content.

**Why this priority**: Core functionality - without this the component has no purpose.

**Independent Test**: Open the Add Link dialog, fill in both fields with valid data, click Save, and verify the link data is returned/saved.

**Acceptance Scenarios**:

1. **Given** the Add Link dialog is open, **When** I enter "Google" in the Content field and "https://google.com" in the URL field and click Save, **Then** the link is saved with text="Google" and url="https://google.com" and the dialog closes.
2. **Given** the Add Link dialog is open with both fields filled, **When** I click Save, **Then** the onSave callback is invoked with `{ text: string, url: string }`.
3. **Given** the Add Link dialog is open, **When** I click Save while a save is already in progress, **Then** the Save button is disabled and no duplicate submission occurs.

---

### User Story 2 - Cancel adding a link (Priority: P1)

As a user, I want to cancel the Add Link dialog without saving so that I can dismiss it if I change my mind.

**Why this priority**: Essential UX - users must always have an escape path.

**Independent Test**: Open the dialog, optionally type something, click Cancel, verify the dialog closes without saving.

**Acceptance Scenarios**:

1. **Given** the Add Link dialog is open with data entered, **When** I click Cancel ("Hủy"), **Then** the dialog closes and no data is saved.
2. **Given** the Add Link dialog is open, **When** I click Cancel, **Then** the onCancel callback is invoked.
3. **Given** the Add Link dialog is open, **When** I press the Escape key, **Then** the dialog closes without saving (same as Cancel).

---

### User Story 3 - Validation feedback (Priority: P2)

As a user, I want to see validation errors when I try to save with invalid data so that I know what to fix.

**Why this priority**: Prevents invalid data from being saved; improves UX.

**Independent Test**: Leave fields empty or enter invalid URL, click Save, verify error messages appear.

**Acceptance Scenarios**:

1. **Given** the Add Link dialog is open with empty Content field, **When** I click Save, **Then** an inline error message is displayed below the Content field indicating it is required.
2. **Given** the Add Link dialog is open with Content filled but an invalid URL (e.g., "not-a-url"), **When** I click Save, **Then** an inline error message is displayed below the URL field indicating the format is invalid.
3. **Given** the Add Link dialog is open with Content exceeding 100 characters, **When** I click Save, **Then** an inline error message is displayed indicating maximum length exceeded.
4. **Given** the URL field contains only whitespace, **When** I blur the URL field, **Then** an error is shown indicating the field is required.
5. **Given** the Content field contains only whitespace, **When** I blur the Content field, **Then** an error is shown indicating the field is required.
6. **Given** a validation error is displayed for a field, **When** I correct the input and blur or type, **Then** the error message disappears.

---

### Edge Cases

- What happens when the user enters only whitespace in Content? -> Validation error: field is required (trim before validation).
- What happens when the URL exceeds 2048 characters? -> Validation error: maximum length exceeded.
- What happens when the user pastes a URL without protocol? -> Validation error: URL must start with http:// or https://.
- How does the dialog behave on mobile screens? -> The dialog MUST be responsive, stacking fields vertically with full-width inputs.
- What happens if user double-clicks Save rapidly? -> Save button MUST be disabled after first click until the onSave callback completes.

---

## UI/UX Requirements *(from Figma)*

### Screen Components

| Component | Node ID | Description | Interactions |
|-----------|---------|-------------|--------------|
| A: Title | `I1002:12682;1002:12500` | Heading "Thêm đường dẫn" (Add link), static label | None |
| B: Content Field | `I1002:12682;1002:12501` | Label "Nội dung" + text input | Focus, blur, type, validation |
| B.1: Content Label | `I1002:12682;1002:12502` | Label text "Nội dung" | Click focuses input |
| B.2: Content Input | `I1002:12682;1002:12503` | Text input field | Focus highlight, type text |
| C: URL Field | `I1002:12682;1002:12652` | Label "URL" + text input with icon | Focus, blur, type, validation |
| C.1: URL Label | `I1002:12682;1002:12653` | Label text "URL" | Click focuses input |
| C.2: URL Input | `I1002:12682;1002:12654` | Text input field with trailing icon | Focus highlight, type URL |
| D: Button Group | `I1002:12682;1002:12543` | Cancel and Save buttons | Click |
| D.1: Cancel Button | `I1002:12682;1002:12544` | Outlined button with "Hủy" text + Close icon | Click to dismiss |
| D.2: Save Button | `I1002:12682;1002:12545` | Primary button with "Lưu" text + Link icon | Click to save |

### Navigation Flow

- From: Content editor page or profile page (parent component triggers the dialog)
- To: Closes dialog, returns to parent component
- Triggers:
  - Cancel button ("Hủy") closes without saving
  - Save button ("Lưu") validates and closes on success
  - Escape key closes without saving
- Overlay/Backdrop: The dialog SHOULD render with a semi-transparent backdrop overlay. Clicking the backdrop SHOULD close the dialog (same as Cancel).

### Visual Requirements

- Responsive breakpoints: mobile (< 640px), tablet (640px-1023px), desktop (>= 1024px)
- See `design-style.md` for complete visual specifications
- Animations/Transitions: Smooth open/close transition for modal (fade + scale)
- Accessibility: WCAG AA compliance:
  - `<label>` elements MUST use `htmlFor` to associate with their inputs
  - Keyboard navigation: Tab between fields, Enter to save, Escape to cancel
  - Focus MUST be trapped within the dialog while open
  - Focus visible states on all interactive elements
  - `role="dialog"` and `aria-modal="true"` on the container
  - `aria-labelledby` pointing to the title element
  - Error messages MUST use `aria-describedby` on their associated inputs

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display the Add Link dialog with title, two input fields (Content and URL), and two action buttons (Cancel and Save).
- **FR-002**: System MUST validate the Content field: required, 1-100 characters, no whitespace-only values (trim before validation).
- **FR-003**: System MUST validate the URL field: required, 5-2048 characters, valid URL format (must start with http:// or https://).
- **FR-004**: System MUST display inline validation errors below the corresponding field when validation fails on Save or blur.
- **FR-005**: System MUST invoke the onSave callback with `{ text: string, url: string }` (both values trimmed) when validation passes and Save is clicked.
- **FR-006**: System MUST invoke the onCancel callback when Cancel is clicked or Escape is pressed, without saving data.
- **FR-007**: System MUST support keyboard navigation: Tab between fields, Enter to submit, Escape to cancel.
- **FR-008**: Both fields MUST validate on blur to provide early feedback.
- **FR-009**: Save button MUST be disabled while an onSave callback is in progress to prevent double submission.
- **FR-010**: Validation errors MUST clear when the user corrects the input (on change or blur).
- **FR-011**: Dialog MUST open with empty fields and focus on the Content input.

### Technical Requirements

- **TR-001**: Component MUST render within 100ms (lightweight, no external data fetching).
- **TR-002**: Input validation MUST use Zod schema (per constitution - OWASP compliance). Note: Zod needs to be added as a dependency if not already present.
- **TR-003**: Component MUST be a client component (`"use client"`) since it requires form state and event handlers.
- **TR-004**: Component MUST be responsive across all breakpoints defined in constitution.
- **TR-005**: Component MUST NOT use `dangerouslySetInnerHTML` for any content (per constitution - XSS prevention).

### Key Entities *(if feature involves data)*

- **LinkData**: `{ text: string, url: string }` - The data structure passed to the parent on save. Values are trimmed before being passed.

### Component Props Interface

```typescript
interface AddLinkBoxProps {
  onSave: (data: { text: string; url: string }) => void | Promise<void>;
  onCancel: () => void;
}
```

- `onSave`: Called with trimmed `{ text, url }` when validation passes. May be async (component awaits it and disables Save during execution).
- `onCancel`: Called when Cancel is clicked, Escape is pressed, or backdrop is clicked.

---

## State Management

### Local Component State

| State | Type | Initial Value | Description |
|-------|------|---------------|-------------|
| text | string | `""` | Content field value |
| url | string | `""` | URL field value |
| errors | `{ text?: string; url?: string }` | `{}` | Validation error messages per field |
| isSubmitting | boolean | `false` | Whether onSave is in progress |

### State Transitions

1. **Open** -> Fields empty, errors empty, isSubmitting false, focus on Content input.
2. **Type** -> Update field value, clear error for that field if present.
3. **Blur** -> Validate the blurred field, set error if invalid.
4. **Save click** -> Validate all fields. If errors, display them and do NOT submit. If valid, set isSubmitting=true, call onSave, set isSubmitting=false on completion.
5. **Cancel click / Escape** -> Call onCancel, close dialog. No state cleanup needed (parent unmounts).

---

## API Dependencies

| Endpoint | Method | Purpose | Status |
|----------|--------|---------|--------|
| N/A | N/A | This is a client-side UI component. Data persistence is handled by the parent component. | N/A |

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: All form validation rules pass for valid input and reject invalid input (100% test coverage on validation schema).
- **SC-002**: Component renders correctly at all three breakpoints (mobile, tablet, desktop).
- **SC-003**: Keyboard-only users can complete the full flow (add link) without using a mouse.
- **SC-004**: Component pixel-matches the Figma design within 2px tolerance.
- **SC-005**: Focus is trapped within the dialog while open.

---

## Out of Scope

- Link preview/fetching (no URL metadata fetching)
- Edit existing link (this spec covers adding a new link only)
- Link type selection (internal vs external)
- Rich text formatting in the Content field
- Pre-populating fields with existing data (edit mode)

---

## Dependencies

- [x] Constitution document exists (`.momorph/constitution.md`)
- [ ] API specifications available (`.momorph/API.yml`) - N/A for this component
- [ ] Database design completed (`.momorph/database.sql`) - N/A for this component
- [ ] Screen flow documented (`.momorph/SCREENFLOW.md`)

---

## Notes

- The UI text is in Vietnamese with proper diacritical marks as shown in Figma:
  - Title: "Thêm đường dẫn" (Add link)
  - Content label: "Nội dung" (Content)
  - Cancel button: "Hủy" (Cancel)
  - Save button: "Lưu" (Save)
- The Close icon (X) on the Cancel button and the Link icon on the Save button are SVG icons from the design system. Media files are available via MoMorph:
  - Close icon: Node `I1002:12682;1002:12544;186:2761` (MM_MEDIA_Close)
  - Link icon: Node `I1002:12682;1002:12545;186:1766` (MM_MEDIA_Link)
- This component is an INSTANCE of component `1002:12663` ("Add link box") in Figma, meaning it is a reusable design system component.
- Montserrat font MUST be loaded in the project (via Google Fonts or local) - verify it is configured in Tailwind and `layout.tsx`.
