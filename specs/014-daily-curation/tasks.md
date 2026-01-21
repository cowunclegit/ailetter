# Implementation Tasks: Daily Curation

**Feature**: 014-daily-curation
**Spec**: [spec.md](spec.md)
**Plan**: [plan.md](plan.md)

## Phase 1: Setup
*Goal: Initialize project structure and prepare for implementation.*

- [x] T001 Create feature directory structure for specs (already done) in specs/014-daily-curation/
- [x] T002 [P] Review `TrendItem` model in backend/src/models/trendItemModel.js to ensure `published_at` is indexed or efficient for sorting

## Phase 2: Foundational
*Goal: Core backend logic for pagination and sorting.*

- [x] T003 [P] Update `TrendItemModel` to support `limit` and `offset` in `getAll` method in backend/src/models/trendItemModel.js
- [x] T004 [P] Update `trends` API handler to accept `limit` and `offset` query params and pass to model in backend/src/api/trends.js
- [x] T005 [P] Update frontend API client to support pagination params in frontend/src/api/trendsApi.js

## Phase 3: User Story 1 - View Content Grouped by Day
*Goal: Display trends grouped by date with infinite scroll.*
*Priority: P1*

- [x] T006 [US1] Create `DailyGroup` component to render a date header and a list of items in frontend/src/components/features/DailyGroup.jsx
- [x] T007 [US1] Implement grouping logic (utility function) to group flat list by date in frontend/src/utils/dateUtils.js
- [x] T008 [US1] Update `Dashboard` page to maintain a list of trends and append new items on load in frontend/src/pages/Dashboard.jsx
- [x] T009 [US1] Implement infinite scroll using `IntersectionObserver` in `Dashboard` page in frontend/src/pages/Dashboard.jsx
- [x] T010 [US1] Update `TrendList` usage in `Dashboard` to render `DailyGroup` components instead of a flat grid (or update TrendList to handle grouping) in frontend/src/pages/Dashboard.jsx
- [x] T011 [US1] Style date headers to be sticky using CSS in frontend/src/components/features/DailyGroup.jsx (or appropriate CSS file)

## Phase 4: Polish & Cross-Cutting
*Goal: Final UI polish and performance verification.*

- [x] T012 Verify infinite scroll smoothness and loading states in frontend/src/pages/Dashboard.jsx
- [x] T013 Ensure empty states are handled gracefully (e.g., end of list) in frontend/src/pages/Dashboard.jsx
- [x] T014 Verify date formatting matches requirements (e.g. "YYYY년 MM월 DD일") in frontend/src/utils/dateUtils.js

## Dependencies

1. **Setup & Foundational** (T001-T005) MUST be completed first.
2. **User Story 1** (T006-T011) depends on Backend API (T004) and Frontend API Client (T005).

## Parallel Execution Opportunities

- Backend (T003-T004) and Frontend (T005-T007) tasks can largely be developed in parallel.
- Component creation (T006) can happen while API logic is being updated.