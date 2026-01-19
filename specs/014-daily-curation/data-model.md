# Data Model: Daily Curation

## Entities

### Trend Item (Existing Entity Update)

No schema changes required for the entity itself, but querying patterns change.

| Field | Type | Description |
|-------|------|-------------|
| published_at | DateTime | **Key Sorting Field**. Must be indexed for performance (if not already). |

## Access Patterns

- **Pagination**: Queries will now heavily rely on `ORDER BY published_at DESC LIMIT N OFFSET M`.
- **Filtering**: Existing filters (read status, etc.) must work in conjunction with this sort order.
