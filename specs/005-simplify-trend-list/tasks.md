# Tasks: Simplify Trend List and Mark Sent Items

**Input**: Design documents from `/specs/005-simplify-trend-list/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/api.yaml

**Tests**: MANDATORY (Constitution Principle II). Red-Green-Refactor cycle required.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)

---

## Phase 1: Setup

**Purpose**: Initialize feature environment and baseline checks.

- [x] T001 Verify active branch is `005-simplify-trend-list` and `GEMINI.md` reflects current technologies
- [x] T002 [P] Baseline test run to ensure current tests pass in `backend/` and `frontend/`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Utilities and database optimizations.

- [x] T003 Create `get28DayRange` helper in `frontend/src/utils/dateUtils.js` for 4-week calculation
- [x] T004 Add index to `trend_items.published_at` in `backend/src/db/migrate.js` and update `backend/src/db/schema.sql` to ensure performance (SC-003)

---

## Phase 3: User Story 2 & 1 - Backend Data & Status (Priority: P1/P2)

**Goal**: Update the API to provide 4-week trends with their newsletter status.

**Independent Test**: Call `GET /api/trends` and verify it returns items from the last 28 days with a `status` field (available, draft, sent).

### Tests for Backend Logic

- [x] T005 [P] [US1] [US2] Unit test for `TrendItemModel.getAll` with status joins and date range in `backend/tests/unit/trendItemModel.test.js`
- [x] T006 [US1] [US2] Integration test for `GET /api/trends` verifying 28-day default and status response in `backend/tests/api/trends.test.js`

### Implementation for Backend Logic

- [x] T007 [US1] [US2] Update `TrendItemModel.getAll` to include `LEFT JOIN` with `newsletters` and default 28-day filter in `backend/src/models/trendItemModel.js`
- [x] T008 [US1] Update `GET /api/trends` controller to handle default range and status field in `backend/src/api/trends.js`

---

## Phase 4: User Story 1 & 3 - Dashboard Cleanup (Priority: P1/P3)

**Goal**: Remove obsolete filters and AI indicators from the UI.

- [x] T009 [US1] [US3] Remove `WeeklyFilter` component and `ai_selected_only` filter from `frontend/src/pages/Dashboard.jsx`
- [x] T010 [US3] Remove `ai_selected` badge/icon rendering from `frontend/src/components/features/TrendCard.jsx`
- [x] T011 Delete the `frontend/src/components/features/WeeklyFilter.jsx` file as it is no longer used

---

## Phase 5: User Story 1 - Weekly Subheaders & Auto-load (Priority: P1)

**Goal**: Display the 4-week list with chronological subheaders.

- [x] T012 [P] [US1] Unit test for week grouping logic in `frontend/src/utils/dateUtils.test.js`
- [x] T013 [US1] Update `Dashboard.jsx` to fetch the full 28-day range on initial load
- [x] T014 [US1] Implement grouping logic to render weekly subheaders within the trend list in `frontend/src/pages/Dashboard.jsx`

---

## Phase 6: User Story 2 - Status Marking & Warnings (Priority: P2)

**Goal**: Clearly mark "Sent" and "In Draft" items and warn on re-selection.

**Independent Test**: Select a card marked "발송완료" and verify a confirmation warning appears.

### Tests for Status Marking

- [x] T015 [P] [US2] Component test for `TrendCard.jsx` verifying "Sent" and "In Draft" labels in `frontend/src/components/features/TrendCard.test.jsx`

### Implementation for Status Marking

- [x] T016 [US2] Add "발송완료" (Sent) and "작성 중" (In Draft) labels to `frontend/src/components/features/TrendCard.jsx`
- [x] T017 [US2] Implement selection warning dialog for items with `status === 'sent'` in `frontend/src/pages/Dashboard.jsx`

---

## Phase 7: Polish & Cross-Cutting Concerns

- [x] T018 [P] Final verification of SC-003: Dashboard initial load under 800ms
- [x] T019 Ensure all "No recent trends" empty states are user-friendly
- [x] T020 Final test suite execution and cleanup of any temporary test data

---

## Dependencies & Execution Order

### Phase Dependencies
1. **Setup & Foundational (Phases 1-2)**: MUST be complete first.
2. **Backend Logic (Phase 3)**: Provides data for all frontend stories.
3. **Cleanup (Phase 4)**: Prepares the UI for the new simplified list.
4. **User Story 1 & 2 (Phases 5-6)**: Can be implemented sequentially or partially in parallel if backend is ready.

### Parallel Opportunities
- T003 (Frontend utils) and T004 (Backend DB) can run in parallel.
- T005 and T006 (Backend tests) can run in parallel.
- T010 (Card cleanup) and T009 (Dashboard cleanup) can run in parallel.

---

## Implementation Strategy
- **MVP**: Complete Phase 1-5 to deliver the simplified 4-week list with subheaders. This covers the most visible part of the request (US1).
- **Increment**: Follow with Phase 6 to add the safety checks for sent items (US2).
- **Stability**: Full TDD cycle ensures that the join logic for newsletter statuses doesn't introduce regressions or duplicates.
