# Data Model: Source Categories

## Entities

### Source Category (`source_categories`)
Represents a classification topic for a source.

| Field | Type | Required | Unique | Description |
|-------|------|----------|--------|-------------|
| id | Integer (PK) | Yes | Yes | Auto-incrementing primary key. |
| name | String | Yes | Yes | The display name of the category (e.g., "AI", "UX"). |
| created_at | DateTime | Yes | No | Timestamp of creation. |
| updated_at | DateTime | Yes | No | Timestamp of last update. |

### Source (Existing Entity Update)
Existing entity representing an RSS feed or content source.

| Field | Type | Required | Unique | Description |
|-------|------|----------|--------|-------------|
| category_id | Integer (FK) | No | No | Foreign key referencing `source_categories.id`. Nullable. |

## Relationships

- **One-to-Many**: A `Source Category` can be assigned to multiple `Sources`.
- **Many-to-One**: A `Source` belongs to at most one `Source Category`.

## Constraints

- **Unique Name**: Category names must be unique (case-insensitive preferred).
- **On Delete**: If a category is deleted, the `category_id` on linked `Sources` MUST be set to NULL (SET NULL behavior).
