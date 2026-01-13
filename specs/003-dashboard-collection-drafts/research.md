# Research: Dashboard Improvements

## 1. Asynchronous Manual Collection
- **Problem**: Collection can take 10-30 seconds, blocking the UI.
- **Solution**: 
    - Frontend triggers `POST /api/trends/collect`.
    - Backend starts the `collectionService.collectAll()` without waiting for it to finish (or use a simple flag).
    - Since we don't have a complex message broker (Redis/Bull), we will use a simple in-memory flag in `collectionService` to track if a job is running.
    - Frontend will poll or just wait for a reasonable time, but the requirement specifies a toast notification. We will implement a "Fire and Forget" style API that returns `202 Accepted`.

## 2. Weekly Filtering
- **Format**: `YYYY-WXX (MM.DD ~ MM.DD)` starting Monday.
- **Logic**: Use `date-fns` or standard JS `Date` to calculate the week number and the range of dates.
- **Backend**: `GET /api/trends?startDate=...&endDate=...`

## 3. Duplicate Detection
- **Logic**: When fetching trends for the dashboard, join with `newsletter_items` and `newsletters` to mark items that were already in a `sent` newsletter.
- **UI**: Add a badge or gray out items that are duplicates.
