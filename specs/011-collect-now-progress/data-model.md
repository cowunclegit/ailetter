# Data Model: Collect Now & Progress

**Feature**: Collect Now & Progress
**Status**: Final
**Date**: 2026-01-14

## Existing Entities

### TrendItem
*The content items being collected.*

| Field | Type | Description |
|-------|------|-------------|
| id | Integer | Primary Key |
| title | String | Title of the trend/article |
| original_url | String | Source URL |
| published_at | DateTime | Publication date |
| source_id | Integer | Foreign Key to Source |
| ... | ... | ... |

### CollectionJob (Runtime State)
*In-memory state managed by `CollectionService`.*

| Field | Type | Description |
|-------|------|-------------|
| activeCollections | Map<String, Boolean> | Tracks running collections to prevent concurrency. Key is `startDate` or 'auto'. |
