# Data Model: Dashboard Chronological Sort

## Entities

### Trend Item
Represents a piece of content collected from a source.

| Field | Type | Description |
|-------|------|-------------|
| id | INTEGER | Primary Key, Auto-increment. |
| source_id | INTEGER | Foreign Key to `sources`. |
| title | TEXT | Title of the content. |
| original_url | TEXT | Unique URL of the content. |
| published_at | DATETIME | Timestamp of publication. **MANDATORY ISO8601 Format**. |
| summary | TEXT | Optional summary. |
| thumbnail_url | TEXT | Optional image link. |
| ai_selected | BOOLEAN | Flag for AI curation. |
| created_at | DATETIME | Internal record creation timestamp. |

## Indices
- `idx_trend_items_published_at` on `trend_items(published_at)`: Essential for performant descending sort.
