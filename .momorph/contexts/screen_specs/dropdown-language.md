# Screen Spec: Language Dropdown

**Screen #**: 5
**Frame ID**: `721:4942`
**Frame Name**: `Dropdown-ngôn ngữ`
**File Key**: `9ypp4enmFmdK3YAFJLIu6C`
**Spec Path**: `.momorph/specs/721-4942-Dropdown-ngon-ngu/`

---

## Purpose

Global language selector dropdown allowing users to switch the application interface between Vietnamese (VN) and English (EN).

## Component Type

Reusable global UI component (header/navigation bar).

## Visual Summary

Dark-themed dropdown with gold (#998C5F) border on dark (#00070C) background. Two language options displayed vertically, each with a country flag icon (24x24px) and bold language code text (Montserrat 700, 16px, white). The selected language is highlighted with a warm semi-transparent background (rgba(255, 234, 158, 0.2)).

## Key Interactions

| Action | Result |
|--------|--------|
| Click trigger (closed) | Opens dropdown showing all options |
| Click language option | Selects language, closes dropdown, switches app language |
| Click outside | Closes dropdown, no change |
| Escape key | Closes dropdown, no change |
| Arrow keys | Navigate between options |

## Data

- **Languages**: VN (Vietnamese), EN (English)
- **Persistence**: Cookie or localStorage
- **API**: None (client-side i18n only)

## Navigation Context

- **Entry**: Click on language trigger in global header/nav
- **Exit**: Selection closes dropdown (stays on same page, language switches in-place)
- **Scope**: Available on every page (global component)

## Design Items

| # | Node ID | Name | Type | Description |
|---|---------|------|------|-------------|
| A | 525:11713 | Dropdown-List | Container | Main dropdown container with border and dark bg |
| A.1 | I525:11713;362:6085 | tiếng Việt | List Item | Vietnamese option (selected state shown) |
| A.2 | I525:11713;362:6128 | tiếng Anh | Button | English option (default state shown) |
