# Screen Spec: Department Dropdown

**Screen #**: 6
**Frame ID**: `721:5684`
**Frame Name**: `Dropdown Phòng ban`
**File Key**: `9ypp4enmFmdK3YAFJLIu6C`
**Spec Path**: `.momorph/specs/721-5684-Dropdown-Phong-ban/`

---

## Purpose

Department selection dropdown allowing users to filter or select a department from a list. Used to filter content (e.g., appreciation messages) by the selected department.

## Component Type

Reusable filter/form UI component (parent page TBD).

## Visual Summary

Dark-themed dropdown with gold border styling on dark background, consistent with other dropdowns. Vertically stacked department options (101x348px container with rounded corners). The selected department is highlighted with a warm semi-transparent background. Department names are displayed as center-aligned text items.

## Key Interactions

| Action | Result |
|--------|--------|
| Click trigger (closed) | Opens dropdown showing all department options |
| Click department option | Selects department, closes dropdown, applies department filter to parent page |
| Hover over option | Pointer cursor, subtle highlight effect |
| Click outside | Closes dropdown, no change |
| Escape key | Closes dropdown, no change |

## Data

- **Departments**: 50+ departments including CTO, SPD, FCOV, CEVC1, CEVC2, STVC - R&D, CEVC2 - CySS, FCOV - LRM, CEVC2 - System, OPDC - HRF, CEVC1 - DSV - UI/UX 1, CEVC1 - DSV, CEVEC, OPDC - HRD - C&C, STVC, FCOV - F&A, CEVC1 - DSV - UI/UX 2, CEVC1 - AIE, OPDC - HRF - C&B, FCOV - GA, FCOV - ISO, STVC - EE, GEU - HUST, CEVEC - SAPD, OPDC - HRF - OD, CEVEC - GSD, GEU - TM, STVC - R&D - DTR, STVC - R&D - DPS, CEVC3, STVC - R&D - AIR, CEVC4, PAO, GEU, GEU - DUT, OPDC - HRD - L&D, OPDC - HRD - TI, OPDC - HRF - TA, GEU - UET, STVC - R&D - SDX, OPDC - HRD - HRBP, PAO - PEC, IAV, STVC - Infra, CPV - CGP, GEU - UIT, OPDC - HRD, BDV, CPV, PAO - PAO
- **Persistence**: Applies filter to parent page content
- **API**: Department list fetched from backend

## Navigation Context

- **Entry**: Click on department filter trigger on parent page (filter/form context, TBD)
- **Exit**: Selection closes dropdown and applies department filter to parent page
- **Scope**: Reusable filter component on pages that require department-based filtering

## Design Items

| # | Node ID | Name | Type | Description |
|---|---------|------|------|-------------|
| A | 563:8027 | Dropdown-List | Container | Main dropdown container with border and dark bg (101x348px, rounded corners) |
| A.1 | I563:8027;563:7956 | Phòng ban 1 | List Item | Selected department option (e.g., 'CEVC2') with highlight state |
| A.2 | I563:8027;563:7957 | Phòng ban 2 | List Item | Department option (e.g., 'CEVC3') in default state |
| A.3 | I563:8027;563:7958 | Phòng ban 3 | List Item | Department option (e.g., 'CEVC4') in default state |
