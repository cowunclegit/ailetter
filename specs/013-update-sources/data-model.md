# Data Model: Update Sources

## Entities

### Source (Existing Entity Update)

| Field | Type | Required | Mutable | Description |
|-------|------|----------|---------|-------------|
| id | Integer | Yes | No | Primary Key |
| name | String | Yes | **Yes** | Display name of the source |
| type | String | Yes | **No** | 'rss' or 'youtube'. **Immutable** after creation. |
| url | String | Yes | **Yes** | RSS Feed URL or YouTube Channel ID |
| category_id | Integer | No | **Yes** | FK to SourceCategory |
| reliability_score | Float | No | **Yes** | Trust score (default 1.0) |

## Constraints

- **Type Immutability**: The `type` field CANNOT be changed once a source is created. Attempting to update it should be ignored or rejected.
- **Validation**: `name` and `url` must not be empty.
