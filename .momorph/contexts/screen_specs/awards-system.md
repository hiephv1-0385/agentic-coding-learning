# Screen Spec: Hệ thống giải (Awards System)

**Screen #**: 9
**Frame ID**: `313:8436`
**Frame Name**: `Hệ thống giải`
**File Key**: `9ypp4enmFmdK3YAFJLIu6C`
**Spec Path**: `.momorph/specs/313-8436-He-thong-giai/`

---

## Purpose

Awards/prize system display showing the hierarchy of award tiers with icons, names, and point thresholds. Displays the gamification tier structure for the recognition platform.

## Component Type

Informational display component (awards/recognition pages).

## Visual Summary

Display presenting the award tier hierarchy for the gamification system. Each tier includes an icon, award name, and point threshold, arranged to communicate the progression of recognition levels within the platform.

## Key Interactions

| Action | Result |
|--------|--------|
| View | Displays the full award tier hierarchy |
| No direct actions | Informational display only (no interactive elements) |

## Data

- **Award Tiers**: Hierarchy of award levels with icons, names, and point thresholds
- **Persistence**: Server-side (read-only display)
- **API**: Awards/recognition endpoint (TBD)

## Navigation Context

- **Entry**: Visible on awards/recognition pages or as an informational component
- **Exit**: Informational display (no direct navigation out)
- **Scope**: Awards/recognition section of the platform

## Design Items

| # | Node ID | Name | Type | Description |
|---|---------|------|------|-------------|
| A | 313:8436 | Hệ thống giải | Container | Main awards system container displaying tier hierarchy |
