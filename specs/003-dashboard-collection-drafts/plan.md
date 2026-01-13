# Implementation Plan: Dashboard Collection and Draft History

**Branch**: `003-dashboard-collection-drafts` | **Date**: 2026-01-13 | **Spec**: [specs/003-dashboard-collection-drafts/spec.md](spec.md)

## Summary
Improve the curator dashboard by adding a manual "Collect Now" button with asynchronous notifications, implementing weekly filtering for trend items, and providing a history view for all created drafts. The system will also detect and warn about duplicate items already sent in previous newsletters.

## Technical Context
**Language/Version**: Node.js (Backend), React.js (Frontend)
**Storage**: SQLite3
**Testing**: Jest (Unit/Integration)
**Concurrency**: Simple in-memory locking for manual collection.

## Constitution Check
- [x] **Tech Stack**: Uses React.js and Node.js.
- [x] **TDD**: Plan includes writing tests for new API endpoints and filtering logic.

## Implementation Steps

### Phase 1: Backend - Collection & History APIs
1. **Manual Collection**: Update `TrendController` to handle asynchronous collection.
2. **Filtering Logic**: Update `TrendModel.getAll()` to support date range filtering.
3. **Duplicate Detection**: Update the trend item query to join with `newsletter_items` to identify previously sent items.
4. **History API**: Enhance `NewsletterModel.getAll()` to include item counts for each newsletter.

### Phase 2: Frontend - Dashboard Improvements
1. **Collect Now Button**: Add button with loading state and integration with `FeedbackContext` for snackbar notifications.
2. **Weekly Filter**: Create a new `WeeklyFilter` component that calculates and displays the current and past weeks.
3. **Duplicate Warning**: Update `TrendCard` to display a warning icon or label if an item is marked as a duplicate.
4. **Draft History Page**: Create a new page (or section) to list past newsletters with their metadata.

## Tasks (Detailed decomposition in tasks.md)
- [ ] T001: Backend: Implement `POST /api/trends/collect` with basic locking.
- [ ] T002: Backend: Update `TrendModel` for date range and duplicate flag.
- [ ] T003: Frontend: Add "Collect Now" button and snackbar logic.
- [ ] T004: Frontend: Implement weekly filter UI and logic.
- [ ] T005: Frontend: Create Draft History view.
