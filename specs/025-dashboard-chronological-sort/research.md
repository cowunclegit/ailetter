# Research: Dashboard Chronological Sort

## Unknown 1: Data Consistency of `published_at`
*   **Decision**: Enforce ISO8601 storage format for all `published_at` entries in `trend_items`.
*   **Rationale**: SQLite sorts strings lexicographically. ISO8601 (`YYYY-MM-DDTHH:MM:SSZ`) allows correct chronological sorting as strings. If inconsistent formats (e.g., RFC 2822) are used, `ORDER BY` will fail to produce chronological order.
*   **Alternatives considered**: Using `strftime` or `datetime()` function in SQL `ORDER BY`. Rejected as it's computationally more expensive than index-assisted string sorting and format consistency is better for data integrity.

## Unknown 2: Secondary Sort Key for Pagination
*   **Decision**: Use `id DESC` as a secondary sort key in `ORDER BY t.published_at DESC, t.id DESC`.
*   **Rationale**: If multiple items have the exact same timestamp (common in high-frequency collections), the sort order becomes non-deterministic without a secondary key. This can lead to items shifting between pages when using `OFFSET/LIMIT`.
*   **Alternatives considered**: `rowid`. Rejected as `id` is the explicit primary key and already unique.

## Unknown 3: Impact of Background Collection on Pagination
*   **Decision**: Acknowledge that `OFFSET/LIMIT` pagination is susceptible to "skipping" items if new items are inserted at the beginning of the list between page loads.
*   **Rationale**: While cursor-based pagination (e.g., `WHERE published_at < ?`) is more robust, the current system uses `OFFSET/LIMIT`. For this feature, we will focus on the SQL `DESC` sorting requirement as requested.
*   **Alternatives considered**: Cursor-based pagination. Rejected for now to stay within the requested scope of fixing the SQL sort.

## Consolidation of Findings
*   The primary goal is to ensure `ORDER BY t.published_at DESC` is present and effective.
*   We must ensure the `idx_trend_items_published_at` index is utilized.
*   We will add a secondary sort key `t.id DESC` to ensure stable sorting for items with the same timestamp.
