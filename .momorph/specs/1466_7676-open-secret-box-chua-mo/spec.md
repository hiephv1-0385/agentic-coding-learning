# Feature Specification: Open Secret Box (Chưa Mở)

**Frame ID**: `1466:7676`
**Frame Name**: `Open secret box- chưa mở`
**File Key**: `9ypp4enmFmdK3YAFJLIu6C`
**Created**: 2026-03-16
**Status**: Reviewed

---

## Overview

The Secret Box modal allows users to open mystery reward boxes that contain collection badges. When a user has accumulated secret boxes (earned through KUDOS activities), they can open this modal to reveal which badge they receive. Each box contains exactly one badge, randomly assigned based on predefined probabilities.

This frame represents the **unopened state** — the user sees a wrapped gift box and can click it to trigger the opening animation and reveal their badge.

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Open a Secret Box (Priority: P1)

A logged-in user who has at least one unopened secret box wants to click on the box to reveal the badge inside. This is the core interaction of the feature.

**Why this priority**: This is the primary purpose of the modal. Without this, the feature has no value.

**Independent Test**: Open the modal with ≥1 box → click the gift box → verify a badge is revealed and count decrements.

**Acceptance Scenarios**:

1. **Given** the user has 5 unopened secret boxes, **When** the modal opens, **Then** the modal displays the unopened gift box image, instruction "Click vào box để mở", and counter shows "Secretbox chưa mở 05".
2. **Given** the user is viewing the modal with ≥1 box, **When** the user clicks the gift box image, **Then** the system randomly assigns a badge based on the probability distribution and transitions to the "opened" state showing the received badge.
3. **Given** the user has just opened a box, **When** the badge is revealed, **Then** the remaining box count decrements by 1 (e.g., 05 → 04).

---

### User Story 2 - View Empty State (Priority: P1)

A user who has zero unopened secret boxes opens the modal and sees that there are no boxes to open.

**Why this priority**: Prevents confusion and broken interactions when the user has no boxes.

**Independent Test**: Open the modal with 0 boxes → verify the box is not clickable and instruction text is hidden.

**Acceptance Scenarios**:

1. **Given** the user has 0 unopened secret boxes, **When** the modal opens, **Then** the counter shows "Secretbox chưa mở 00", the instruction text "Click vào box để mở" is hidden, and the gift box is not clickable (disabled state).

---

### User Story 3 - Close the Modal (Priority: P2)

A user can dismiss the modal at any time using the close button (X).

**Why this priority**: Basic modal UX pattern, necessary but secondary to the core open-box interaction.

**Independent Test**: Open the modal → click X → verify modal closes.

**Acceptance Scenarios**:

1. **Given** the modal is open, **When** the user clicks the X close button, **Then** the modal closes with a fade-out animation.
2. **Given** the modal is open, **When** the user clicks outside the modal (overlay/backdrop), **Then** the modal closes.
3. **Given** the modal is open, **When** the user presses the Escape key, **Then** the modal closes.

---

### User Story 4 - Multiple Sequential Opens (Priority: P2)

A user with multiple secret boxes can open them one after another without closing the modal.

**Why this priority**: Improves UX for users with many boxes, but depends on the opened state (separate frame).

**Independent Test**: Open box → after reveal, verify "Click vào box để mở" reappears if count > 0, and the box resets to unopened state for the next open.

**Acceptance Scenarios**:

1. **Given** the user has just opened a box and has remaining boxes (count > 0), **When** the opening animation completes, **Then** the modal returns to the unopened state with updated count and the user can click to open another box.
2. **Given** the user has just opened their last box (count was 1), **When** the opening animation completes, **Then** the modal shows the empty state (count 00, no instruction text, box disabled).

---

### Edge Cases

- What happens if the network request to open a box fails? → Show an error toast/message, do not decrement the count, allow retry.
- What happens if the user opens the modal and their box count changes server-side? → Fetch fresh count on modal open.
- What happens if two tabs try to open the same box? → Server-side validation ensures each box is only opened once; second attempt should show an error or refresh state.
- What happens if the box count number exceeds 2 digits (e.g., 100)? → The counter should handle dynamic width gracefully.

---

## UI/UX Requirements *(from Figma)*

### Screen Components

| Component | Description | Interactions |
|-----------|-------------|--------------|
| Backdrop Overlay | Semi-transparent dark overlay behind modal | Click to dismiss modal |
| Modal Container | Dark-themed modal with rounded corners (~13px radius) | Centered on screen over backdrop |
| Title Bar | "KHÁM PHÁ SECRET BOX CỦA BẠN" with close button | Close button dismisses modal |
| Separator Lines | Thin horizontal lines (#2E3940) dividing sections | Static display |
| Instruction Text | "Click vào box để mở" centered below first separator | Hidden when count = 0 |
| Gift Box Image | Large square image of unopened gift box with sparkle overlay | Click to open box (triggers API call + animation); disabled when count = 0 |
| Box Counter | Shows "Secretbox chưa mở" label + number in gold | Updates dynamically after each open |

### Navigation Flow

- **From**: Awards page / Homepage → `SecretBoxButton` component (existing: `src/components/kudos/SecretBoxButton.tsx`)
- **To**: After clicking box → transitions to "opened" state (separate frame showing revealed badge)
- **Triggers**: User clicks the "Mở Secret Box" button, which opens this modal

### Visual Requirements

> See `design-style.md` for complete visual specifications.

- Responsive across mobile, tablet, desktop breakpoints
- Modal should appear with a smooth entrance animation (opacity + scale)
- Gift box should have hover feedback (subtle scale transform) when clickable
- Gift box should appear dimmed/disabled (opacity 0.5, cursor not-allowed) when count = 0
- Sparkle effect overlay creates an ambient magical feel
- All text uses Montserrat font, bold weight throughout
- Dark theme consistent with the rest of the SAA 2025 application
- Follow existing modal pattern from `RulesPanel.tsx` (backdrop, body scroll lock, focus management)

### Loading & Error States

| State | UI Behavior |
|-------|-------------|
| Loading box count | Show skeleton/placeholder for counter area |
| Opening box (API in-flight) | Show loading indicator on gift box; disable further clicks |
| API error on open | Show error toast (reuse existing `Toast` component); do not decrement count; allow retry |
| Network offline | Disable gift box click; show connectivity warning |

### Accessibility Requirements

- **Keyboard navigation**: Modal must trap focus while open; Escape key closes the modal
- **ARIA**: Modal container has `role="dialog"`, `aria-modal="true"`, `aria-labelledby` pointing to title
- **Focus management**: On open, focus moves to the modal; on close, focus returns to the trigger element
- **Body scroll lock**: `document.body.style.overflow = "hidden"` while modal is open (see `RulesPanel.tsx` pattern)
- **Close button**: Must be focusable and operable via keyboard (Enter/Space)
- **Gift box**: Must be operable via keyboard (Enter/Space) when clickable

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display the secret box modal when triggered by the user.
- **FR-002**: System MUST show the correct number of remaining unopened secret boxes for the current user.
- **FR-003**: System MUST randomly assign exactly one badge per box open, using the probability distribution: Stay Gold 30%, Flow to Horizon 25%, Touch of Light 20%, Beyond the Boundary 10%, Revival 10%, Root Further 5%.
- **FR-004**: System MUST decrement the unopened box count after a successful box open.
- **FR-005**: System MUST prevent opening when the user has zero remaining boxes (disable click, hide instruction text).
- **FR-006**: System MUST persist the opened badge to the user's badge collection.
- **FR-007**: The close button (X) MUST dismiss the modal.

### Technical Requirements

- **TR-001**: The box-open operation MUST be atomic — either the badge is assigned and count decremented, or neither happens (server-side transaction).
- **TR-002**: Badge assignment randomization MUST happen server-side to prevent client manipulation.
- **TR-003**: Modal MUST use Next.js `<Image>` for the gift box and sparkle effect assets for optimization.
- **TR-004**: Modal MUST be rendered as a client component (`"use client"`) due to interactive state management.

### Key Entities *(if feature involves data)*

- **SecretBox**: Represents an unopened reward box. Key attributes: id, user_id, status (unopened/opened), badge_id (null until opened), opened_at.
- **Badge/Collection**: The badge awarded from opening. Links to the 6 collection badge types (REVIVAL, TOUCH OF LIGHT, STAY GOLD, FLOW TO HORIZON, BEYOND THE BOUNDARY, ROOT FURTHER).

---

## State Management

### Local Component State

| State | Type | Initial | Description |
|-------|------|---------|-------------|
| isOpen | boolean | false | Whether the modal is visible |
| isVisible | boolean | false | Animation state (delayed from isOpen for transitions) |
| isOpening | boolean | false | Whether a box-open API request is in-flight |
| remainingBoxes | number | (from props/fetch) | Count of unopened boxes |

### Global / Shared State

- **User session**: From Supabase Auth (required to identify user)
- **Box count**: Passed as prop from parent or fetched on modal open via Supabase client

### Cache & Refresh

- Box count should be refreshed each time the modal opens (stale data protection)
- After successful open, optimistically decrement count and then confirm with server response

---

## API Dependencies

| Endpoint | Method | Purpose | Status |
|----------|--------|---------|--------|
| /api/users/me/secret-box | POST | Open a box, assign random badge, return result | Exists (called from `SecretBoxButton.tsx:24`) |
| Supabase: `secret_boxes` table | SELECT | Get remaining unopened box count for current user | Predicted (direct Supabase query) |
| Supabase: `user_badges` table | SELECT | Get user's collected badges (for post-open display) | Predicted (direct Supabase query) |

> **Note**: The existing `SecretBoxButton.tsx` already calls `POST /api/users/me/secret-box`. The modal should reuse this endpoint. Count queries should use Supabase client directly per constitution (data fetching in Server Components).

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of box opens result in exactly one badge assignment with correct probability distribution (verifiable via server logs).
- **SC-002**: Modal opens within 300ms of trigger interaction.
- **SC-003**: Box count is always accurate and consistent with server state.

---

## Out of Scope

- The "opened" state / badge reveal animation (separate frame: needs its own spec)
- How users earn/accumulate secret boxes (part of KUDOS system)
- Badge collection gallery view (separate feature)
- Admin controls for adjusting badge probabilities

---

## Dependencies

- [x] Constitution document exists (`.momorph/constitution.md`)
- [ ] API specifications available (`.momorph/contexts/api-docs.yaml`)
- [ ] Database design completed (`.momorph/contexts/database-schema.sql`)
- [x] Screen flow documented (`.momorph/specs/SCREENFLOW.md`)
- [ ] "Opened" state frame specified (companion to this frame)
- [ ] Gift box media assets exported from Figma ("box quà chưa mở", "hiệu ứng box quà")
- [x] Existing trigger component exists (`src/components/kudos/SecretBoxButton.tsx`)
- [x] Existing modal pattern to follow (`src/components/rules/RulesPanel.tsx`)

---

## Notes

- The badge probability distribution is defined in the Figma design specs: Stay Gold (30%), Flow to Horizon (25%), Touch of Light (20%), Beyond the Boundary (10%), Revival (10%), Root Further (5%). These percentages MUST be configurable server-side, not hardcoded in the client.
- The box count format uses zero-padded 2-digit numbers (e.g., "05", "00"). Consider using `String(count).padStart(2, '0')` in implementation.
- This modal has two states: "chưa mở" (this spec) and "đã mở" (opened/revealed, separate frame). They share the same modal container but swap content.
- The Close icon uses Component ID 214:3851 from Component Set 178:1020, which is shared across the application (same as in the Rules panel).
