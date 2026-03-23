# Feature Specification: Dropdown Hashtag Filter

**Frame ID**: `721:5580`
**Frame Name**: `Dropdown Hashtag filter`
**File Key**: `9ypp4enmFmdK3YAFJLIu6C`
**Created**: 2026-03-09
**Status**: Draft

---

## Overview

A dropdown list component that allows users to filter content by selecting a hashtag. The dropdown displays a scrollable list of hashtag options with a visually distinct selected state (glowing text effect on a highlighted background). Selecting a hashtag applies a filter to the parent page's content. This is a reusable UI component used within pages that require hashtag-based filtering.

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Select a hashtag filter (Priority: P1)

As a user browsing content, I want to select a hashtag from the dropdown so that I can filter the displayed content to match that topic.

**Why this priority**: Core functionality — without this the component has no purpose.

**Independent Test**: Open the dropdown, click a hashtag item, verify the selection is applied and the dropdown closes.

**Acceptance Scenarios**:

1. **Given** the dropdown is open with a list of hashtags, **When** I click on "#Cống hiến", **Then** that item becomes visually selected (glow effect + highlighted background) and the `onSelect` callback is invoked with the selected hashtag value.
2. **Given** a hashtag is already selected, **When** I open the dropdown and click a different hashtag, **Then** the new hashtag becomes selected and the previous selection is deselected.
3. **Given** the dropdown is open, **When** I click an already-selected hashtag, **Then** the selection is toggled off (deselected) and the `onSelect` callback is invoked with `null`.

---

### User Story 2 - View selected state (Priority: P1)

As a user, I want to clearly see which hashtag is currently selected so that I know which filter is active.

**Why this priority**: Essential UX — users must have visual feedback for the active filter.

**Independent Test**: Pre-select a hashtag and verify the selected item shows the glow/highlight styling.

**Acceptance Scenarios**:

1. **Given** the dropdown is open with "#Dedicated" selected, **When** I look at the list, **Then** the "#Dedicated" item has a highlighted background (rgba(255, 234, 158, 0.10)) and glowing text effect (gold text shadow).
2. **Given** no hashtag is selected, **When** I open the dropdown, **Then** all items display in their default state (white text, no highlight).

---

### User Story 3 - Scroll through hashtags (Priority: P2)

As a user, I want to scroll through the list when there are more hashtags than fit in the visible area so that I can access all options.

**Why this priority**: The full list has 13 hashtags; the dropdown height is limited, so scrolling is necessary.

**Independent Test**: Open the dropdown with 13 hashtags and verify scrolling works smoothly.

**Acceptance Scenarios**:

1. **Given** the dropdown is open with 13 hashtags, **When** the list exceeds the visible height, **Then** the dropdown becomes scrollable with a smooth scroll behavior.
2. **Given** I am scrolling the dropdown, **When** I reach the end of the list, **Then** scrolling stops and the last item is fully visible.

---

### User Story 4 - Close dropdown (Priority: P2)

As a user, I want to close the dropdown when I'm done so that it doesn't obstruct other content.

**Why this priority**: Standard dropdown behavior — users need to dismiss it.

**Independent Test**: Open the dropdown and verify it closes via the expected triggers.

**Acceptance Scenarios**:

1. **Given** the dropdown is open, **When** I click outside the dropdown, **Then** the dropdown closes.
2. **Given** the dropdown is open, **When** I press the Escape key, **Then** the dropdown closes.
3. **Given** the dropdown is open, **When** I select a hashtag, **Then** the dropdown closes after applying the selection.

---

### User Story 5 - Keyboard navigation (Priority: P3)

As a keyboard user, I want to navigate through hashtag options using the keyboard so that I can select a filter without a mouse.

**Why this priority**: WCAG AA compliance — ensures accessibility for keyboard-only users.

**Independent Test**: Open the dropdown with keyboard and navigate/select using arrow keys and Enter.

**Acceptance Scenarios**:

1. **Given** the dropdown is open, **When** I press Arrow Down, **Then** focus moves to the next hashtag item.
2. **Given** focus is on a hashtag item, **When** I press Enter or Space, **Then** that hashtag is selected.
3. **Given** focus is on the first item, **When** I press Arrow Up, **Then** focus wraps to the last item (standard listbox wrapping behavior).
4. **Given** focus is on the last item, **When** I press Arrow Down, **Then** focus wraps to the first item.

---

### Edge Cases

- What happens when the hashtags list is empty? -> Display an empty dropdown with a "No hashtags available" message.
- What happens when a hashtag text is very long? -> Text MUST truncate with ellipsis (`overflow-hidden text-ellipsis whitespace-nowrap`). The dropdown has a `max-width` constraint (300px on mobile, content-driven with reasonable limit on desktop).
- What happens when two rapid clicks occur on different items? -> Only the last clicked item should be selected; no race condition.
- What happens on touch devices? -> Touch events MUST work identically to click events; touch targets are 48px on mobile and 56px on tablet/desktop (both exceed 44px WCAG minimum).

---

## UI/UX Requirements *(from Figma)*

### Screen Components

| Component | Node ID | Description | Interactions |
|-----------|---------|-------------|--------------|
| A: Dropdown Container | `563:8026` | Dark container with gold border, holds all hashtag items | Scroll when overflow |
| A.1: Selected Tag Item | `I563:8026;525:13508` | Hashtag item in selected state with glow effect | Click to deselect |
| A.2–A.6: Default Tag Items | `I563:8026;525:14864`, etc. | Hashtag items in default (unselected) state | Click to select, hover highlight |

### Navigation Flow

- From: Parent page with a filter trigger button (opens this dropdown)
- To: Stays on same page; dropdown closes after selection
- Triggers:
  - Click on trigger button opens dropdown
  - Click on item selects and closes
  - Click outside or Escape closes without change

### Visual Requirements

- Responsive breakpoints: mobile (< 640px), tablet (640px-1023px), desktop (>= 1024px)
- See `design-style.md` for complete visual specifications
- Animations/Transitions: Smooth open/close transition (fade + scale 0.95→1, 150ms ease-out on open, 100ms ease-in on close); item background-color transitions at 150ms ease-in-out
- Accessibility: WCAG AA compliance:
  - `role="listbox"` on the dropdown container with `aria-label="Hashtag filter"` (accessible name required by WCAG)
  - `role="option"` on each hashtag item
  - `aria-selected="true"` on the currently selected item
  - `aria-activedescendant` for keyboard navigation — references the `id` of the currently focused option
  - Each `role="option"` element MUST have a unique `id` following the pattern `hashtag-option-{index}` (e.g., `hashtag-option-0`, `hashtag-option-1`)
  - `aria-expanded` on the trigger button
  - Keyboard: Arrow Up/Down to navigate, Enter/Space to select, Escape to close
  - Focus visible states on all items — applied via `data-focused` attribute (not native `:focus-visible`) since `aria-activedescendant` keeps DOM focus on the listbox container

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display a dropdown list of hashtag options when triggered.
- **FR-002**: System MUST visually distinguish the selected item with a highlighted background and glowing text effect.
- **FR-003**: System MUST allow single-selection — only one hashtag can be selected at a time.
- **FR-004**: System MUST invoke the `onSelect` callback with the selected hashtag value (or `null` for deselection) when an item is clicked.
- **FR-005**: System MUST close the dropdown when an item is selected, when clicking outside, or when pressing Escape.
- **FR-006**: System MUST support scrolling when the list of hashtags exceeds the visible dropdown height.
- **FR-007**: System MUST support keyboard navigation (Arrow keys, Enter, Space, Escape).
- **FR-008**: System MUST render each hashtag prefixed with "#" (e.g., "#Cống hiến").
- **FR-009**: Dropdown MUST be positioned relative to its trigger element (below or above depending on available space).
- **FR-010**: When the dropdown opens with a selected item that is not in the visible area, the dropdown MUST scroll the selected item into view.
- **FR-011**: When the `hashtags` array is empty, the dropdown MUST display a "No hashtags available" placeholder message (Montserrat 14px/400, #FFFFFF at 50% opacity, centered, padding 16px) instead of an empty container.

### Technical Requirements

- **TR-001**: Component MUST be a client component (`"use client"`) since it requires event handlers and state.
- **TR-002**: Component MUST handle click-outside detection to close the dropdown (via `useEffect` with document event listener, cleaned up on unmount).
- **TR-003**: Component MUST NOT use `dangerouslySetInnerHTML` for hashtag content (per constitution — XSS prevention).
- **TR-004**: Component MUST be responsive — dropdown width adapts to container or content width.
- **TR-005**: Dropdown MUST use a portal or z-index strategy to render above other page content.

### Component Props Interface

```typescript
interface HashtagFilterDropdownProps {
  hashtags: string[];
  selectedHashtag: string | null;
  onSelect: (hashtag: string | null) => void;
  isOpen: boolean;
  onClose: () => void;
}
```

- `hashtags`: Array of hashtag strings (without "#" prefix — component prepends it).
- `selectedHashtag`: Currently selected hashtag value, or `null` if none selected.
- `onSelect`: Called with the hashtag string when selected, or `null` when deselected.
- `isOpen`: Controls dropdown visibility (controlled component pattern).
- `onClose`: Called when dropdown should close (click outside, Escape, after selection).

### Key Entities *(if feature involves data)*

- **Hashtag**: A string value representing a filter tag. The full list of hashtags:
  1. Toàn diện
  2. Giỏi chuyên môn
  3. Hiệu suất cao
  4. Truyền cảm hứng
  5. Cống hiến
  6. Aim High
  7. Be Agile
  8. Wasshoi
  9. Hướng mục tiêu
  10. Hướng khách hàng
  11. Chuẩn quy trình
  12. Giải pháp sáng tạo
  13. Quản lý xuất sắc

---

## State Management

### Local Component State

| State | Type | Initial Value | Description |
|-------|------|---------------|-------------|
| focusedIndex | number | `-1` | Index of the currently focused item for keyboard navigation |

### Parent-Managed State (Controlled)

| State | Type | Initial Value | Description |
|-------|------|---------------|-------------|
| selectedHashtag | string \| null | `null` | Currently selected hashtag |
| isDropdownOpen | boolean | `false` | Whether the dropdown is visible |

### State Transitions

1. **Open** -> Dropdown becomes visible, focus moves to selected item (or first item if none selected). If the selected item is outside the visible scroll area, scroll it into view.
2. **Hover item** -> Item shows hover highlight.
3. **Click item** -> Set selectedHashtag, call onSelect, call onClose.
4. **Click selected item** -> Set selectedHashtag to null, call onSelect(null), call onClose.
5. **Arrow Down/Up** -> Move focusedIndex, scroll item into view if needed.
6. **Enter/Space on focused item** -> Same as click.
7. **Escape / Click outside** -> Call onClose, no selection change.

---

## API Dependencies

| Endpoint | Method | Purpose | Status |
|----------|--------|---------|--------|
| N/A | N/A | Hashtag list is passed as props. No API required for dropdown itself. Parent component fetches data if needed. | N/A |

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: User can select a hashtag and see it visually highlighted within 100ms of clicking.
- **SC-002**: Dropdown closes within 150ms of selection/dismissal trigger.
- **SC-003**: Keyboard-only users can navigate and select hashtags without a mouse.
- **SC-004**: Component pixel-matches the Figma design within 2px tolerance on desktop.
- **SC-005**: Dropdown scrolls smoothly when the list exceeds the visible area.

---

## Out of Scope

- Multi-select (only single-selection supported in this design)
- Search/filter within the dropdown (no search input shown)
- Hashtag creation or editing
- Trigger button design (this spec covers only the dropdown list itself)
- Hashtag data fetching (parent component responsibility)
- Complex animations beyond CSS transitions (item background-color and text-shadow transitions ARE in scope; see design-style.md Animation & Transitions)

---

## Dependencies

- [x] Constitution document exists (`.momorph/constitution.md`)
- [ ] API specifications available (`.momorph/API.yml`) - N/A for this component
- [ ] Database design completed (`.momorph/database.sql`) - N/A for this component
- [x] Screen flow documented (`.momorph/contexts/SCREENFLOW.md`)

---

## Notes

- The Figma design uses English placeholder text ("#Dedicated", "#Inspring") as sample data. The actual hashtag values are in Vietnamese (listed in Key Entities above).
- The hashtag text "#Inspring" in the design appears to be a typo for "#Inspiring" — however, actual data uses Vietnamese hashtags, so this is moot.
- The selected state uses a text-shadow glow effect (`0 4px 4px rgba(0,0,0,0.25), 0 0 6px #FAE287`) which creates a golden glow on the text. This is a key visual differentiator.
- The dropdown container uses component `563:8026` which is an instance of Figma component `525:13420` (component set `563:8216`). Tag items use component set `186:1426` with two variants: selected (`186:1496`) and default (`186:1433`).
- Montserrat font is used for all text. Verify it is configured in Tailwind and `layout.tsx`.
