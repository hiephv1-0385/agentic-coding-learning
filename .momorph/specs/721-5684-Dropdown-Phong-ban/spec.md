# Feature Specification: Department Dropdown

**Frame ID**: `721:5684`
**Frame Name**: `Dropdown Phòng ban`
**File Key**: `9ypp4enmFmdK3YAFJLIu6C`
**Created**: 2026-03-10
**Status**: Draft

---

## Overview

A department selection dropdown component that allows users to filter content (e.g., thank-you/appreciation messages) by department. The dropdown displays a "Tất cả" (All) option at the top followed by department codes (e.g., CEVC2, CEVC3, OPD, Infra) sorted alphabetically in a scrollable dark-themed list. The currently selected item is visually highlighted with a glowing text effect and subtle background. The default selection is "Tất cả" (showing all departments). The system supports approximately 50 departments.

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Filter Content by Department (Priority: P1)

A user wants to filter displayed content (thank-you messages, awards, etc.) to show only items related to a specific department, so they can focus on their team or a department of interest.

**Why this priority**: This is the core function of the dropdown — without filtering, the component serves no purpose.

**Independent Test**: Render the dropdown, open it, select a department, verify the page content filters to show only items related to that department.

**Acceptance Scenarios**:

1. **Given** the dropdown is closed showing the current department filter (e.g., "CEVC2"), **When** the user clicks the dropdown trigger, **Then** the dropdown opens showing "Tất cả" (All) at the top followed by all available departments sorted alphabetically by code, with the current selection highlighted.
2. **Given** the dropdown is open and "CEVC2" is selected, **When** the user clicks "CEVC3", **Then** the dropdown closes, the trigger displays "CEVC3", the selected item highlight moves to "CEVC3", and page content filters to show CEVC3-related items.
3. **Given** the dropdown is open and "CEVC2" is selected, **When** the user clicks "Tất cả", **Then** the dropdown closes, the trigger displays "Tất cả", and page content shows items from all departments (filter cleared).
4. **Given** the dropdown is open, **When** the user clicks outside the dropdown, **Then** the dropdown closes without changing the selected department.
5. **Given** the dropdown is open with ~50 departments, **When** the user scrolls within the dropdown, **Then** additional department options become visible while the dropdown stays open.

---

### User Story 2 - Identify Current Department Filter (Priority: P2)

A user wants to quickly see which department filter is currently active so they know what content is being displayed.

**Why this priority**: Important for UX clarity, but secondary to the filtering functionality itself.

**Independent Test**: Render the dropdown in closed state with a selected department and verify the correct department code is displayed and visually distinct.

**Acceptance Scenarios**:

1. **Given** the department filter is set to "OPD", **When** the user views the closed dropdown trigger, **Then** they see "OPD" displayed as the current filter with a chevron-down icon.
2. **Given** the department filter is set to "Tất cả" (default), **When** the user views the closed dropdown trigger, **Then** they see "Tất cả" displayed as the current filter.
3. **Given** the dropdown is open, **When** the user looks at the list, **Then** the currently selected item ("OPD" or "Tất cả") has a highlighted background and glowing text effect, distinguishing it from other options.

---

### User Story 3 - Browse All Available Departments (Priority: P2)

A user wants to browse the complete list of departments to find the one they need, especially when they don't know the exact department code.

**Why this priority**: With ~50 departments, the browsability and scroll experience is important for usability.

**Independent Test**: Open the dropdown and verify all departments are accessible via scrolling.

**Acceptance Scenarios**:

1. **Given** the dropdown is open, **When** there are more departments than can fit in the visible area, **Then** a scrollbar appears and the user can scroll to see all departments.
2. **Given** the dropdown is open, **When** the user uses keyboard arrow keys, **Then** focus moves between department options sequentially.

---

### User Story 4 - Search/Filter Departments (Priority: P3)

With ~50 departments, a user may want to type to quickly find a specific department.

**Why this priority**: Nice-to-have for UX improvement with large lists, but the design doesn't explicitly show a search field.

**Independent Test**: Open the dropdown, type characters, verify matching departments are highlighted or filtered.

**Acceptance Scenarios**:

1. **Given** the dropdown is open, **When** the user types "Infra", **Then** the "Infra" option is highlighted/scrolled into view (type-ahead behavior).

---

### Edge Cases

- **Empty department list**: If the API returns zero departments (fetch failure or no data), display a disabled dropdown trigger with placeholder text "—" and show an inline error message or toast notification. Do not open the dropdown.
- **Selected department removed**: If the currently selected department is no longer in the fetched list (e.g., department was deactivated), automatically reset to "Tất cả" (All) and trigger a content re-filter to show all departments.
- **Viewport overflow**: If the dropdown would overflow the bottom of the viewport, open it upward (above the trigger) using CSS `bottom: 100%` positioning or a library-managed flip behavior.
- **Long department names**: Department codes like "CEVC1 - DSV - UI/UX 1" MUST be fully visible. The dropdown width MUST adapt to the longest item (`width: auto` with `min-width`). No truncation. If the container width exceeds the parent container on mobile, allow horizontal text overflow with `white-space: nowrap`.
- **Rapid selection**: If the user clicks multiple departments in quick succession, only the last selection should trigger a content filter (debounce or cancel previous fetch).
- **Network failure on content filter**: If the content API call fails after department selection, show an error state on the content area (not the dropdown) and keep the selected department active so the user can retry.

---

## UI/UX Requirements *(from Figma)*

**Reference screenshot**: [assets/dropdown-phong-ban-721-5684.png](assets/dropdown-phong-ban-721-5684.png)

### Screen Components

| Component | Description | Interactions |
|-----------|-------------|--------------|
| Dropdown Trigger | Shows currently selected department code or "Tất cả"; includes chevron icon | Click to open/close dropdown |
| Dropdown List | Scrollable container with "Tất cả" + all department options | Appears on trigger click, positioned below (or above if viewport overflow) |
| "Tất cả" Option | First item in list — virtual "All" filter option, same style as department items | Click to clear department filter (show all) |
| Department Option (Selected) | Highlighted item with glow text effect and warm background | Click to re-select (closes dropdown) |
| Department Option (Default) | Standard item with white text on dark background | Click to select department and close dropdown |

### Navigation Flow

- **Parent screen**: Sun* Kudos Live Board (`/kudos`, frame `2940:13431`) — the department dropdown is used here to filter the kudos feed by department.
- **Entry point**: Clicking the department filter trigger on the Kudos Live Board page.
- **Exit point**: Same page — filter is applied in-place, no page navigation occurs.
- **Deep link support**: The selected department MUST be reflected in the URL query parameter (e.g., `/kudos?department=CEVC2`) so that filtered views are shareable and bookmarkable. Selecting "Tất cả" removes the `department` param.
- **Triggers**: Click on dropdown trigger to open; click on department option to apply filter and close.

### Visual Requirements

- See `design-style.md` for complete visual specifications
- Dark themed component (#00070C background with #998C5F gold border)
- Selected item has subtle warm highlight (rgba(255, 234, 158, 0.1)) with glowing text-shadow
- Montserrat Bold 16px for department codes with 0.5px letter-spacing
- Scrollable list for ~50 departments (max-height with overflow)
- Responsive: Component works at all breakpoints; items are 56px tall (touch-friendly)
- Accessibility: Must support keyboard navigation (Tab, Arrow keys, Enter, Escape, type-ahead)

### Accessibility Requirements

- **ARIA roles**: The dropdown trigger MUST have `role="combobox"` with `aria-expanded`, `aria-haspopup="listbox"`, and `aria-controls` pointing to the list ID. The dropdown list MUST have `role="listbox"`. Each department option MUST have `role="option"` with `aria-selected` for the active item.
- **Keyboard navigation**:
  - `Tab`: Focus the dropdown trigger
  - `Enter` / `Space`: Open the dropdown when trigger is focused; select the focused option when dropdown is open
  - `ArrowDown` / `ArrowUp`: Move focus between options (with wrap-around)
  - `Escape`: Close the dropdown without changing selection, return focus to trigger
  - `Home` / `End`: Jump to first/last option
  - Type-ahead: Typing characters focuses the first matching option
- **Screen reader**: Announce the currently selected department when the trigger receives focus (e.g., "Department filter, CEVC2 selected"). Announce option changes as the user navigates with arrow keys.
- **Focus management**: When the dropdown opens, focus moves to the currently selected option. When it closes, focus returns to the trigger.
- **Focus visible**: All interactive elements MUST have a visible focus indicator (e.g., `ring-2 ring-[#998C5F]`).

### State Management

| State | Scope | Description |
|-------|-------|-------------|
| `isOpen` | Local (component) | Whether the dropdown list is visible |
| `selectedDepartment` | URL query param + local | The currently selected department code; synced to URL `?department=` |
| `departments` | Server-fetched, cached | The full list of departments fetched from API on page load |
| `isLoading` | Local | True while the department list is being fetched |
| `error` | Local | Error state if department list fetch fails |

**Loading state**: While departments are loading, the trigger shows a skeleton/pulse animation and is not interactive (disabled).
**Error state**: If the department list fails to load, the trigger shows "—" and is disabled. A retry mechanism or page-level error toast should be available.
**Initial selection**: On first load, the default selection is **"Tất cả" (All)** — showing content from all departments. If a URL query param `?department=CEVC2` is present, that department is pre-selected instead.

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display the currently selected department code (or "Tất cả") in the closed dropdown trigger.
- **FR-002**: System MUST open the dropdown showing a "Tất cả" (All) option at the top, followed by all available departments sorted alphabetically by code, when the user clicks the trigger.
- **FR-003**: System MUST highlight the currently selected department (or "Tất cả") with a distinct background and glowing text effect.
- **FR-004**: System MUST close the dropdown and update the filter when the user clicks a department option or "Tất cả".
- **FR-005**: System MUST close the dropdown without changes when the user clicks outside of it.
- **FR-006**: System MUST provide scrollable access to all ~50 departments within a constrained max-height.
- **FR-007**: System MUST filter/update page content based on the selected department. Selecting "Tất cả" clears the filter and shows content from all departments.
- **FR-008**: System MUST support keyboard navigation (Tab to focus, Enter/Space to open, Arrow keys to navigate, Enter to select, Escape to close).
- **FR-009**: System SHOULD support type-ahead keyboard filtering when the dropdown is open.
- **FR-010**: System MUST default to "Tất cả" (All) on initial page load when no URL query parameter is present.

### Technical Requirements

- **TR-001**: Dropdown open/close animation must complete within 150ms.
- **TR-002**: Department list must be fetched from the API (not hardcoded) to support dynamic department changes.
- **TR-003**: Selected department filter MUST be reflected in the URL query parameter (e.g., `/kudos?department=CEVC2`) for shareability and persistence. Selecting "Tất cả" removes the `department` param.
- **TR-004**: Component must be a Client Component (`"use client"`) as it requires click handlers and state.
- **TR-005**: Dropdown MUST show full department names without truncation. The dropdown width adapts to the longest item (`width: auto`, `min-width: 102px`, `white-space: nowrap`).

### Key Entities *(if feature involves data)*

- **Department**: Represents an organizational department with attributes: `id` (string/number), `code` (string, e.g., "CEVC2"), `name` (string, full name). The list is flat — hierarchical display is out of scope (see Out of Scope).

---

## API Dependencies

| Endpoint | Method | Purpose | Request Params | Response Shape | Status |
|----------|--------|---------|----------------|----------------|--------|
| /api/departments | GET | Fetch list of all departments | `sort=code` (alphabetical, default) | `{ data: Array<{ id: string, code: string, name: string }> }` — sorted alphabetically by `code` | Predicted |
| /api/kudos?department={code} | GET | Fetch kudos filtered by department | `department` (string, optional — omit for all), `page` (number, optional), `limit` (number, optional) | `{ data: Kudo[], total: number, page: number }` | Predicted |

**Caching strategy**: The department list (~50 items) SHOULD be fetched once on page load and cached client-side for the session duration. Consider using `staleWhileRevalidate` pattern or React Server Component data fetching with `revalidate`.

**"Tất cả" (All) option**: This is a client-side virtual option (not from API). When selected, the content API is called without the `department` param to fetch all departments' content.

**Error handling**:
- `GET /api/departments` failure: Disable the dropdown, show error toast. Retry on next page visit.
- `GET /api/kudos?department=` failure: Show error state in the content area. Keep department selection active for retry.

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Department selection and content filtering completes within 300ms (perceived by user).
- **SC-002**: All ~50 departments are accessible via scroll within the dropdown.
- **SC-003**: Dropdown is keyboard-accessible and passes WCAG 2.1 AA compliance for interactive controls.
- **SC-004**: Component renders correctly at all three breakpoints (mobile, tablet, desktop) per constitution.
- **SC-005**: Selected department persists across page navigations within the same session.

---

## Out of Scope

- Multi-select department filtering (only single department selection is supported)
- Department management (add/edit/delete departments)
- Hierarchical/nested department display (flat list only in current design)
- Search input field within the dropdown (only type-ahead is considered as P3)

---

## Dependencies

- [ ] Constitution document exists (`.momorph/constitution.md`) - **YES**
- [ ] API specifications available (`.momorph/API.yml`) - **TBD** (department list endpoint needed)
- [ ] Database design completed (`.momorph/database.sql`) - **TBD** (departments table needed)
- [ ] Screen flow documented (`.momorph/SCREENFLOW.md`) - **In progress**

---

## Related Specs

- **Language Dropdown** (`.momorph/specs/721_4942-dropdown-ngon-ngu/`): Shares the same visual theme (dark bg, gold border, Montserrat font) and Figma component set (`186:1426`). Consider creating a shared base dropdown component.
- **Hashtag Filter Dropdown** (`.momorph/specs/3-Dropdown-Hashtag-filter/`): Similar filter dropdown pattern; may share interaction logic.

---

## Notes

- The Figma frame shows 6 visible departments (CEVC2, CEVC3, CEVC4, CEVC1, OPD, Infra) but the full list contains ~50 departments. The implementation must support scrolling.
- Department codes are abbreviated (e.g., "CEVC2", "OPD", "Infra"). Some departments have longer hierarchical names (e.g., "CEVC1 - DSV - UI/UX 1") — the dropdown width adapts automatically to fit the longest name without truncation (see TR-005).
- The selected item uses a glowing text-shadow effect (`0 4px 4px rgba(0,0,0,0.25), 0 0 6px #FAE287`) which is unique compared to the language dropdown — this is a design distinction for the department dropdown.
- The dropdown shares the same base button component set (`186:1426`) with the language dropdown, suggesting a shared `DropdownOption` component could be created.
- The purpose is to filter "thank-you/appreciation messages" by department according to the design item descriptions.

### Full Department List (from Figma specs)

```
CTO, SPD, FCOV, CEVC1, CEVC2, STVC - R&D, CEVC2 - CySS, FCOV - LRM,
CEVC2 - System, OPDC - HRF, CEVC1 - DSV - UI/UX 1, CEVC1 - DSV, CEVEC,
OPDC - HRD - C&C, STVC, FCOV - F&A, CEVC1 - DSV - UI/UX 2, CEVC1 - AIE,
OPDC - HRF - C&B, FCOV - GA, FCOV - ISO, STVC - EE, GEU - HUST,
CEVEC - SAPD, OPDC - HRF - OD, CEVEC - GSD, GEU - TM, STVC - R&D - DTR,
STVC - R&D - DPS, CEVC3, STVC - R&D - AIR, CEVC4, PAO, GEU, GEU - DUT,
OPDC - HRD - L&D, OPDC - HRD - TI, OPDC - HRF - TA, GEU - UET,
STVC - R&D - SDX, OPDC - HRD - HRBP, PAO - PEC, IAV, STVC - Infra,
CPV - CGP, GEU - UIT, OPDC - HRD, BDV, CPV, PAO - PAO
```
