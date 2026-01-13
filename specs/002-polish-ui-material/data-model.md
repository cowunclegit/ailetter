# Data Model: UI Polish & Material Design

**Feature**: UI Polish & Material Design
**Date**: 2026-01-13
**Scope**: Frontend UI State & Component Data

## UI Entities

### Notification (Snackbar) State
Represents a temporary feedback message displayed to the user.

| Field | Type | Description |
|-------|------|-------------|
| id | String | Unique identifier for the notification |
| message | String | The text content to display |
| severity | Enum | 'success', 'error', 'info', 'warning' |
| open | Boolean | Visibility state |

### Navigation Item
Represents a link in the global navigation bar.

| Field | Type | Description |
|-------|------|-------------|
| label | String | Display text |
| path | String | Router path (e.g., '/dashboard') |
| icon | Component | Optional icon component |
| roles | Array<String> | Roles allowed to see this item (e.g., ['admin']) |

### Trend Card Data
Transformation of the `TrendItem` entity for UI display.

| Field | Type | Description |
|-------|------|-------------|
| title | String | Truncated title |
| sourceName | String | Name of the source |
| summary | String | Truncated summary |
| aiScore | String | Formatted score/selection indicator |
| isSelected | Boolean | Selection state for newsletter |
| date | String | Localized date string |
