# Research: Content Tagging and Source Deduplication

## Research Tasks

### R01: SQLite Many-to-Many Schema for Tagging
**Decision**: Implement junction tables for `source_categories` and `trend_item_tags`.
**Rationale**: Sources can belong to multiple categories, and trend items can have multiple tags. SQLite junction tables provide a normalized and efficient way to query these relationships.
**Alternatives considered**: JSON columns (Rejected due to complexity in cross-category filtering).

### R02: Deduplication Logic in CollectionService
**Decision**: Fetch unique URLs once, then multi-tag.
**Rationale**: To satisfy FR-004, the collection job will first identify unique URLs across all active sources. It will then fetch each URL once and apply all tags associated with all sources that share that URL.
**Implementation**: Use a Map to group categories by URL before the fetch operation.

### R03: MUI Multi-Select Filtering UI
**Decision**: Use MUI `Autocomplete` or `Select` with checkboxes.
**Rationale**: Provides a standard and intuitive UX for "OR" logic multi-selection on the dashboard.
**Alternatives considered**: Filter chips with toggles (Good for small sets, but less scalable).

---

## Technical Decisions Summary

| Topic | Chosen Solution | Key Rationale |
|-------|-----------------|---------------|
| Schema | Junction Tables | Normalization and query performance for many-to-many relationships. |
| Deduplication | Unique URL Map | Minimizes network requests and prevents database duplicates. |
| UI | MUI Autocomplete | Best UX for multi-select filtering with potentially many categories. |