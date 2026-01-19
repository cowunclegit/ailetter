# Research & Decisions: Daily Curation

**Feature**: 014-daily-curation

## Decisions

### Infinite Scroll Implementation
- **Decision**: Use `IntersectionObserver` API on the frontend to detect when the user nears the bottom of the list.
- **Rationale**: Standard browser API, performant, and avoids scroll event listener performance issues.
- **Alternatives Considered**: 
  - `scroll` event listener: Can be janky and requires debouncing.
  - "Load More" button: Rejected based on user preference for infinite scroll.

### Grouping Strategy
- **Decision**: Grouping will happen on the **Frontend** based on the flat list of sorted items returned by the backend.
- **Rationale**: The backend should be responsible for efficient sorting and pagination (getting the next batch of N items). Grouping logic is display logic. Grouping on the backend complicates pagination (what if a page break splits a day?).
- **Constraints**: Backend MUST return items sorted by `published_at DESC`.

### API Design
- **Decision**: Use cursor-based pagination (or `limit`/`offset` if simple ID/timestamp cursor is complex to implement quickly) on `GET /api/trends`.
- **Rationale**: Necessary for infinite scroll performance.
- **Query Params**: `limit` (default 20), `offset` (or `cursor`).

### Sticky Headers
- **Decision**: Use CSS `position: sticky; top: [header_height]px` on the date group headers.
- **Rationale**: Native CSS solution, very performant.
