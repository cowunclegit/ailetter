# Tasks: Dashboard Week-Based Curation and Collection

**Input**: Design documents from `/specs/004-dashboard-week-curation/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/api.yaml

**Tests**: MANDATORY (Constitution Principle II). Red-Green-Refactor cycle required.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2)

---

## Phase 1: Setup

**Purpose**: Initialize feature environment and baseline checks.

- [x] T001 Verify active branch is `004-dashboard-week-curation` and `GEMINI.md` reflects current technologies
- [x] T002 [P] Baseline test run to ensure current tests pass in `backend/` and `frontend/`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core logic and service updates required for both user stories.

- [x] T003 [P] Update ISO week calculation in `frontend/src/utils/dateUtils.js` to support 12-week history and "Week N (MM.DD ~ MM.DD)" format
- [x] T004 Implement `activeCollections` Map in `backend/src/services/collectionService.js` to support per-week locking
- [x] T005 Update `CollectionService.collectAll` in `backend/src/services/collectionService.js` to accept `startDate` and `endDate`
- [x] T006 [P] Update `fetchRss` and `fetchYoutube` in `backend/src/services/collectionService.js` to filter by the provided date range

**Checkpoint**: Foundational logic for week calculation and filtered collection is ready.

---

## Phase 3: User Story 1 - Week-Based Trend Exploration (Priority: P1)

**Goal**: Select a week from a 12-week list and see filtered trends with a loading state.

**Independent Test**: Select "Week 2 (01.05 ~ 01.11)" in the dashboard and verify the trend list clears, shows loading, then displays only items from Jan 5-11.

### Tests for User Story 1

- [x] T007 [P] [US1] Unit test for 12-week generation and ISO formatting in `frontend/src/utils/dateUtils.test.js`
- [x] T008 [US1] Integration test for `GET /api/trends` with specific week range in `backend/tests/api/trends.test.js`

### Implementation for User Story 1

- [x] T009 [US1] Update `WeeklyFilter.jsx` in `frontend/src/components/features/WeeklyFilter.jsx` to show 12 weeks with ISO labels
- [x] T010 [US1] Implement immediate list clearing and loading state in `frontend/src/pages/Dashboard.jsx` upon week change
- [x] T011 [P] [US1] Verify `TrendItemModel.getAll` in `backend/src/models/trendItemModel.js` uses inclusive `startDate` and `endDate` (Monday 00:00:00 to Sunday 23:59:59)

---

## Phase 4: User Story 2 - Targeted Week Collection (Priority: P2)

**Goal**: Trigger data collection specifically for the selected week with concurrent execution for different weeks.

**Independent Test**: Trigger "Collect Now" for a past week while another week is being collected and verify both jobs proceed using their respective date ranges.

### Tests for User Story 2

- [x] T012 [P] [US2] Unit test for per-week locking logic in `backend/tests/unit/collectionService.test.js`
- [x] T013 [US2] Integration test for `POST /api/trends/collect` with `startDate`/`endDate` payload in `backend/tests/api/trends.test.js`

### Implementation for User Story 2

- [x] T014 [US2] Update `runCollection` signature in `backend/src/jobs/collectionJob.js` to accept optional `startDate` and `endDate`
- [x] T015 [US2] Update `POST /api/trends/collect` endpoint in `backend/src/api/trends.js` to pass payload dates to `runCollection`
- [x] T016 [US2] Update manual collection trigger in `frontend/src/pages/Dashboard.jsx` to send the selected week's date range to the backend

---

## Phase 5: Polish & Cross-Cutting Concerns

- [x] T017 [P] Final verification of date formatting consistency across Dashboard and History views
- [x] T018 Ensure all "Collect Now" toasts correctly reflect the specific week being collected
- [x] T019 Verify FR-006: Ensure dashboard week selection resets to "Current Week" on browser reload and navigation return
- [x] T020 Validate SC-001: Ensure week switching results in updated views within the 500ms performance target
- [x] T021 Final test suite execution and cleanup of any temporary test data

---

## Dependencies & Execution Order

### Phase Dependencies
1. **Setup & Foundational (Phases 1-2)**: MUST be complete first to provide the date arithmetic and collection infrastructure.
2. **User Story 1 (US1)**: Priority P1. Enables the primary curation workflow.
3. **User Story 2 (US2)**: Priority P2. Depends on US1 being able to select the context for collection.

### Parallel Opportunities
- T003 (Frontend dates) and T004 (Backend locking) can run in parallel.
- T007 (Frontend tests) can run while backend logic (T005, T006) is being implemented.

---

## Implementation Strategy
- **MVP**: Focus on completing US1 (Week Exploration) first so the curator can at least browse past weeks.
- **Increment**: Follow with US2 (Targeted Collection) to allow filling in gaps for those past weeks.
- **Stability**: Per-week locking ensures that background jobs for different weeks don't block each other.