# Feature Specification: Dropdown List Hashtag (Multi-Select)

**Frame ID**: `1002:13013`
**Frame Name**: `Dropdown list hashtag`
**File Key**: `9ypp4enmFmdK3YAFJLIu6C`
**Created**: 2026-03-09
**Status**: Draft

---

## Overview

A multi-select hashtag dropdown component that allows users to select up to 5 hashtags from a predefined list. The dropdown is triggered by a button showing a "+" icon and label ("Hashtag / Tối đa 5"). Selected items display with a gold-tinted background and a checkmark icon; unselected items appear with transparent background and no icon. This component is reusable wherever hashtag tagging is needed, such as awards nominations or content categorization.

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Select hashtags from dropdown (Priority: P1)

As a user, I want to select one or more hashtags from the dropdown list so that I can tag or categorize my content with relevant hashtags.

**Why this priority**: Core functionality — the primary purpose of the component. Without this, the component serves no purpose.

**Independent Test**: Open the dropdown, click an unselected hashtag, verify it becomes selected with gold background and checkmark.

**Acceptance Scenarios**:

1. **Given** the dropdown is open with all items unselected, **When** I click on "#BE A TEAM", **Then** that item becomes visually selected (gold background + checkmark icon appears) and the `onSelectionChange` callback is invoked with the updated selection array including "BE A TEAM".
2. **Given** "#BE PROFESSIONAL" is already selected, **When** I click on "#BE PROFESSIONAL" again, **Then** it becomes deselected (transparent background, checkmark disappears) and the `onSelectionChange` callback is invoked with the updated selection array excluding "BE PROFESSIONAL".
3. **Given** I have selected 2 hashtags, **When** I click a third unselected hashtag, **Then** that hashtag is added to the selection (now 3 selected) with gold background and checkmark.

---

### User Story 2 - View selected state clearly (Priority: P1)

As a user, I want to clearly distinguish which hashtags are selected and which are not so that I can verify my choices.

**Why this priority**: Essential UX feedback — users must know their current selection state at a glance.

**Independent Test**: Pre-select 3 hashtags and verify the visual distinction between selected and unselected items.

**Acceptance Scenarios**:

1. **Given** 3 hashtags are selected, **When** I look at the dropdown list, **Then** the 3 selected items show a gold-tinted background (`rgba(255, 234, 158, 0.20)`) with a checkmark icon (24×24px) on the right side.
2. **Given** 3 hashtags are selected, **When** I look at the unselected items, **Then** they show transparent background with no checkmark icon.

---

### User Story 3 - Enforce maximum 5 selections (Priority: P1)

As a user, I need the system to prevent me from selecting more than 5 hashtags so that the selection limit is respected.

**Why this priority**: Business rule enforcement — the "Tối đa 5" (maximum 5) label in the trigger explicitly states this constraint.

**Independent Test**: Select 5 hashtags, then try to select a 6th.

**Acceptance Scenarios**:

1. **Given** I have already selected 5 hashtags, **When** I try to click an unselected hashtag, **Then** nothing happens — the item does not become selected, and the `onSelectionChange` callback is NOT invoked.
2. **Given** I have 5 hashtags selected, **When** I look at unselected items, **Then** they appear visually disabled (reduced opacity, cursor: not-allowed) to indicate they cannot be selected.
3. **Given** I have 5 hashtags selected, **When** I deselect one (now 4 selected), **Then** the remaining unselected items become interactive again (normal opacity, pointer cursor).

---

### User Story 4 - Open and close dropdown via trigger button (Priority: P2)

As a user, I want to open the dropdown by clicking the trigger button and close it when I'm done so that I can manage my hashtag selections without obstructing other content.

**Why this priority**: Standard dropdown behavior — users need to control dropdown visibility.

**Independent Test**: Click the trigger button to open, verify dropdown appears. Click outside to close.

**Acceptance Scenarios**:

1. **Given** the dropdown is closed, **When** I click the trigger button (with "+" icon and two-line "Hashtag" / "Tối đa 5" label), **Then** the dropdown opens below the trigger (left-aligned, 6px gap) with a smooth animation (fade + scale, 150ms ease-out).
2. **Given** the dropdown is open, **When** I click outside the dropdown and trigger, **Then** the dropdown closes with a smooth animation (fade + scale, 100ms ease-in).
3. **Given** the dropdown is open, **When** I press the Escape key, **Then** the dropdown closes.
4. **Given** the dropdown is open, **When** I click the trigger button again, **Then** the dropdown closes (toggle behavior).

---

### User Story 5 - Scroll through hashtag list (Priority: P2)

As a user, I want to scroll through the list when there are more hashtags than fit in the visible area so that I can access all options.

**Why this priority**: The full list has 13 hashtags; the dropdown height is limited, so scrolling is necessary.

**Independent Test**: Open the dropdown with 13 hashtags and verify scrolling works.

**Acceptance Scenarios**:

1. **Given** the dropdown is open with 13 hashtags, **When** the list exceeds the visible height, **Then** the dropdown becomes scrollable with smooth scroll behavior.
2. **Given** I am scrolling the dropdown, **When** I reach the end, **Then** scrolling stops and the last item is fully visible.

---

### User Story 6 - Keyboard navigation (Priority: P3)

As a keyboard user, I want to navigate through hashtag options and toggle selections using the keyboard so that I can use the component without a mouse.

**Why this priority**: WCAG AA compliance — ensures accessibility for keyboard-only users.

**Independent Test**: Open the dropdown with keyboard, navigate, and toggle selections using arrow keys, Enter, and Space.

**Acceptance Scenarios**:

1. **Given** the dropdown is closed and the trigger button has focus, **When** I press Enter or Space, **Then** the dropdown opens and focus moves to the first selected item (or first item if none selected).
2. **Given** the dropdown is open, **When** I press Arrow Down, **Then** focus moves to the next hashtag item.
3. **Given** focus is on an unselected hashtag item, **When** I press Enter or Space, **Then** that hashtag is toggled to selected (if under the 5-item limit).
4. **Given** focus is on a selected hashtag item, **When** I press Enter or Space, **Then** that hashtag is toggled to deselected.
5. **Given** focus is on the last item, **When** I press Arrow Down, **Then** focus wraps to the first item.
6. **Given** focus is on the first item, **When** I press Arrow Up, **Then** focus wraps to the last item.
7. **Given** 5 items are selected and focus is on an unselected item, **When** I press Enter or Space, **Then** nothing happens (max limit enforced).
8. **Given** the dropdown is open, **When** I press Tab, **Then** the dropdown closes and focus moves to the next focusable element on the page (standard ARIA listbox Tab behavior).

---

### Edge Cases

- What happens when the hashtags list is empty? -> Display an empty dropdown with a "Không có hashtag" (No hashtags available) message.
- What happens when a hashtag text is very long? -> Text MUST truncate with ellipsis (`truncate`). The text area uses `flex-1` to fill available space, and checkmark icon stays fixed at 24px.
- What happens when two rapid clicks occur on the same item? -> Toggle should be debounced or the state should correctly reflect the final click; no flickering.
- What happens on touch devices? -> Touch events MUST work identically to click events. Desktop item height is 40px; on mobile, items MUST be at least 44px tall to meet the WCAG/constitution minimum touch target requirement (44×44px).
- What happens when `maxSelections` is reached during a rapid multi-click sequence? -> The component must count current selections before each toggle. Only allow if under limit.

---

## UI/UX Requirements *(from Figma)*

### Screen Components

| Component | Node ID | Description | Interactions |
|-----------|---------|-------------|--------------|
| Trigger Button | `1002:15115` | White button with "+" icon and "Hashtag / Tối đa 5" label | Click to toggle dropdown open/close |
| Dropdown Container | `1002:13102` | Dark container with gold border, holds all hashtag items | Scroll when overflow |
| A: Selected Item 1 | `1002:13185` | "#High-perorming" with gold bg + checkmark | Click to deselect |
| B: Selected Item 2 | `1002:13207` | "#BE PROFESSIONAL" with gold bg + checkmark | Click to deselect |
| C: Selected Item 3 | `1002:13216` | "#BE OPTIMISTIC" with gold bg + checkmark | Click to deselect |
| D: Unselected Item | `1002:13104` | "#BE A TEAM" default state, no checkmark | Click to select |
| E–H: Unselected Items | `1002:13131`, `1002:13137`, `1002:13151`, `1002:13227` | More unselected hashtags | Click to select |
| Checkmark Icon | `1002:13204` | 24×24px check icon for selected state | Part of selected item |
| Plus Icon | `I1002:15115;186:2759` | 24×24px plus icon in trigger | Part of trigger button |

### Navigation Flow

- From: Parent page with the trigger button (opens this dropdown)
- To: Stays on same page; dropdown closes when clicking outside or pressing Escape
- Triggers:
  - Click on trigger button toggles dropdown open/close
  - Click on item toggles selection (dropdown stays open for multi-select)
  - Click outside or Escape closes dropdown

### Visual Requirements

- Responsive breakpoints: mobile (< 640px), tablet (640px-1023px), desktop (>= 1024px)
- See `design-style.md` for complete visual specifications
- Animations/Transitions: Smooth open/close transition (fade + scale 0.95→1, 150ms ease-out on open, 100ms ease-in on close); item background-color transitions at 150ms ease-in-out; checkmark opacity transition at 150ms
- Accessibility: WCAG AA compliance:
  - `role="listbox"` on the dropdown container with `aria-label="Chọn hashtag"` and `aria-multiselectable="true"`
  - `role="option"` on each hashtag item
  - `aria-selected="true|false"` on each item reflecting selection state
  - `aria-activedescendant` for keyboard navigation — references the `id` of the currently focused option
  - Each `role="option"` element MUST have a unique `id` following the pattern `hashtag-option-{index}`
  - `aria-haspopup="listbox"` and `aria-expanded` on the trigger button
  - Keyboard: Arrow Up/Down to navigate, Enter/Space to toggle, Escape to close, Tab to exit widget
  - Focus visible states on all items via `data-focused` attribute

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display a trigger button with a "+" icon and a two-line label: "Hashtag" (line 1) and "Tối đa 5" (line 2).
- **FR-002**: Clicking the trigger button MUST toggle the dropdown open/close.
- **FR-003**: Dropdown MUST display a scrollable list of hashtag options.
- **FR-004**: System MUST support multi-select — users can select multiple hashtags simultaneously.
- **FR-005**: System MUST enforce a maximum of 5 selected hashtags. When the limit is reached, unselected items MUST appear disabled.
- **FR-006**: Clicking a selected item MUST deselect it (toggle off), removing the gold background and checkmark.
- **FR-007**: Clicking an unselected item (when under limit) MUST select it (toggle on), showing gold background and checkmark.
- **FR-008**: System MUST invoke the `onSelectionChange` callback with the updated array of selected hashtag values on each toggle.
- **FR-009**: Dropdown MUST stay open after toggling a selection (multi-select pattern — unlike single-select which closes on selection).
- **FR-010**: Dropdown MUST close when clicking outside the component or pressing Escape.
- **FR-011**: System MUST render each hashtag prefixed with "#" (e.g., "#BE A TEAM").
- **FR-012**: Dropdown MUST be positioned relative to its trigger element: left-aligned with the trigger's left edge, 6px below the trigger's bottom edge. The dropdown (318px) is wider than the trigger (116px).
- **FR-013**: System MUST support keyboard navigation (Arrow keys, Enter, Space, Escape).
- **FR-014**: When the `hashtags` array is empty, the dropdown MUST display a "Không có hashtag" placeholder message (Montserrat 14px/400, #FFFFFF at 50% opacity, centered, padding 16px).

### Technical Requirements

- **TR-001**: Component MUST be a client component (`"use client"`) since it requires event handlers and state.
- **TR-002**: Component MUST handle click-outside detection to close the dropdown (via `useEffect` with document event listener, cleaned up on unmount).
- **TR-003**: Component MUST NOT use `dangerouslySetInnerHTML` (per constitution — XSS prevention).
- **TR-004**: Component MUST be responsive — dropdown width adapts on mobile.
- **TR-005**: Dropdown MUST use a z-index strategy to render above other page content.
- **TR-006**: All icons MUST be rendered via Icon Component, not as SVG files or img tags.

### Component Props Interface

```typescript
interface HashtagMultiSelectProps {
  hashtags: string[];
  selectedHashtags: string[];
  onSelectionChange: (selected: string[]) => void;
  maxSelections?: number; // defaults to 5
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}
```

- `hashtags`: Array of hashtag strings (without "#" prefix — component prepends it).
- `selectedHashtags`: Array of currently selected hashtag values.
- `onSelectionChange`: Called with the updated array of selected hashtags on each toggle.
- `maxSelections`: Maximum number of hashtags that can be selected. Defaults to 5.
- `isOpen`: Controls dropdown visibility (controlled component pattern).
- `onOpenChange`: Called when dropdown should open or close.

### Key Entities *(if feature involves data)*

- **Hashtag**: A string value representing a tag. The full list of hashtags:
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
| selectedHashtags | string[] | `[]` | Array of currently selected hashtag strings |
| isDropdownOpen | boolean | `false` | Whether the dropdown is visible |

### State Transitions

1. **Open** → Dropdown becomes visible, focus moves to first selected item (or first item if none selected).
2. **Hover item** → Item shows hover highlight (gold bg at 10% opacity).
3. **Click unselected item (under limit)** → Add to selectedHashtags, show gold bg + checkmark, invoke onSelectionChange. Dropdown stays open.
4. **Click selected item** → Remove from selectedHashtags, hide checkmark, invoke onSelectionChange. Dropdown stays open.
5. **Click unselected item (at limit)** → No change. Item is visually disabled.
6. **Arrow Down/Up** → Move focusedIndex, scroll item into view if needed.
7. **Enter/Space on focused item** → Same as click (toggle if allowed).
8. **Escape / Click outside** → Call onOpenChange(false), no selection change.
9. **Deselect when at limit** → Remaining unselected items become interactive again.

---

## API Dependencies

| Endpoint | Method | Purpose | Status |
|----------|--------|---------|--------|
| N/A | N/A | Hashtag list is passed as props. No API required for the dropdown itself. Parent component fetches data if needed. | N/A |

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: User can select up to 5 hashtags with correct visual feedback (gold bg + checkmark) within 100ms of each click.
- **SC-002**: Selecting a 6th hashtag when 5 are already selected has no effect; unselected items appear disabled.
- **SC-003**: User can deselect any selected hashtag by clicking it, and the checkmark disappears.
- **SC-004**: Dropdown opens/closes with smooth animation (150ms/100ms).
- **SC-005**: Keyboard-only users can navigate and toggle selections without a mouse.
- **SC-006**: Component pixel-matches the Figma design within 2px tolerance on desktop.

---

## Out of Scope

- Search/filter within the dropdown (no search input in design)
- Hashtag creation or editing
- Drag-and-drop reordering of selected hashtags
- Displaying selected hashtags as tags/chips outside the dropdown (parent component responsibility)
- Hashtag data fetching (parent component responsibility)
- Single-select mode (see `.momorph/specs/3-Dropdown-Hashtag-filter/` for that variant)

---

## Dependencies

- [x] Constitution document exists (`.momorph/constitution.md`)
- [ ] API specifications available (`.momorph/API.yml`) — N/A for this component
- [ ] Database design completed (`.momorph/database.sql`) — N/A for this component
- [x] Screen flow documented (`.momorph/contexts/SCREENFLOW.md`)

---

## Notes

- The Figma design shows English placeholder hashtags ("#High-perorming", "#BE PROFESSIONAL", etc.) as sample data. The actual hashtag values are in Vietnamese (listed in Key Entities above).
- "#High-perorming" appears to be a typo for "#High-performing" — actual data uses Vietnamese hashtags, so this is moot.
- This component is distinct from the single-select Dropdown Hashtag Filter (frame `721:5580`, spec at `.momorph/specs/3-Dropdown-Hashtag-filter/`). Key differences: multi-select (up to 5), dropdown stays open after selection, checkmark icon instead of text glow, different item height (40px vs 56px).
- Montserrat font is used for all text. Verify it is configured in Tailwind and `layout.tsx`.
- The trigger button uses a white background with gold border, contrasting with the dark dropdown — this creates a clear visual separation between trigger and panel.
- The trigger label has two lines: "Hashtag" (line 1) and "Tối đa 5" (line 2), both in Montserrat 11px/700 with color #999.
