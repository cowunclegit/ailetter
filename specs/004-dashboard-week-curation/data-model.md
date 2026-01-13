# Data Model: Dashboard Week-Based Curation

## Virtual Entities (Logic Only)

### WeekRange
Represents the temporal boundary for curation and collection.
- `startDate`: ISO8601 String (Monday 00:00:00.000Z)
- `endDate`: ISO8601 String (Sunday 23:59:59.999Z)
- `weekLabel`: String (e.g., "Week 2 (01.05 ~ 01.11)")

## Updated Entities

### TrendItem (Existing)
- No schema changes.
- **Filtering Rule**: `published_at >= startDate AND published_at <= endDate`.

## State & Concurrency

### CollectionLock
- **Storage**: In-memory `Map` in `CollectionService`.
- **Key**: `week_identifier` (String, "YYYY-WXX").
- **Value**: `Boolean` (isCollecting).
- **Rule**: Multiple collection jobs can run if they target different weeks.
