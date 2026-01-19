# Data Model: Content Tagging and Source Deduplication

## Entities

### Category (Existing)
Represents a topic or label for sources and trend items.

| Field | Type | Description |
|-------|------|-------------|
| id | INTEGER (PK) | Unique identifier. |
| name | TEXT | Name of the category. |
| is_deleted | BOOLEAN | Soft-delete flag. |

### Source (Existing)
Information about content sources (RSS, YouTube).

| Field | Type | Description |
|-------|------|-------------|
| id | INTEGER (PK) | Unique identifier. |
| url | TEXT (Unique) | Source URL used for deduplication. |

### SourceCategory (New Junction)
Maps Sources to Categories.

| Field | Type | Description |
|-------|------|-------------|
| source_id | INTEGER (FK) | Reference to sources.id. |
| category_id | INTEGER (FK) | Reference to categories.id. |

### TrendItem (Existing)
Collected content items.

| Field | Type | Description |
|-------|------|-------------|
| id | INTEGER (PK) | Unique identifier. |
| original_url | TEXT (Unique) | URL used for deduplication. |

### TrendItemTag (New Junction)
Maps TrendItems to Categories.

| Field | Type | Description |
|-------|------|-------------|
| trend_item_id | INTEGER (FK) | Reference to trend_items.id. |
| category_id | INTEGER (FK) | Reference to categories.id. |

## Relationships

- **Source M:N Category**: Via `source_categories` table.
- **TrendItem M:N Category**: Via `trend_item_tags` table.

## Validation Rules

- `trends_items.original_url` must be unique (Absolute match).
- `sources.url` must be unique (Absolute match).
- `trend_item_tags` are created at ingestion and never modified manually.