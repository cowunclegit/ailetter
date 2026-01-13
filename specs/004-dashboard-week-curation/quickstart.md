# Quickstart: Week-Based Curation

## 1. Frontend: Date Utilities
Implement `getISOWeekRange(date)` in `src/utils/dateUtils.js`.
- Start: Monday 00:00:00 (Local to UTC)
- End: Sunday 23:59:59 (Local to UTC)

## 2. Backend: Contextual Collection
Update `CollectionService.collectAll(startDate, endDate)`.
- Key change: Use an object/Map for `isCollecting` to allow multiple concurrent weeks.
- Filtering: Pass dates down to RSS/YouTube fetchers.

## 3. Dashboard Integration
Update `Dashboard.jsx`:
- Replace `getLastNWeeks(8)` with a 12-week generator.
- Pass selected `startDate`/`endDate` to the `/api/trends/collect` POST body.
