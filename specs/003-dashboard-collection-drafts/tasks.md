# Tasks: Dashboard Collection and Draft History Improvements

**Input**: Design documents from `/specs/003-dashboard-collection-drafts/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/api.yaml

**Tests**: MANDATORY. All new logic (filtering, async collection status, duplicate check) must be covered by tests.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3, US4)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 Verify project structure and ensure `backend/src/services/collectionService.js` is accessible
- [X] T002 [P] Configure environment variables if needed for testing manual collection

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

- [X] T003 Implement `isCollecting` in-memory lock in `backend/src/services/collectionService.js`
- [X] T004 Create `TrendController.collectNow` method in `backend/src/api/trends.js` to handle asynchronous collection
- [X] T005 [P] Add `item_count` subquery to `NewsletterModel.getAll` in `backend/src/models/newsletterModel.js`
- [X] T006 [P] Update `TrendModel.getAll` in `backend/src/models/trendItemModel.js` to support `startDate` and `endDate` parameters
- [X] T007 [P] Implement duplicate check logic in `TrendModel.getAll` using a JOIN with `newsletter_items` and `newsletters` (status='sent')

**Checkpoint**: Foundation ready - manual collection API and enhanced queries are testable.

---

## Phase 3: User Story 1 - Manual Data Collection (Priority: P1) 🎯 MVP

**Goal**: Trigger data collection manually with async notifications.

**Independent Test**: Click "Collect Now", see start toast, wait, see success toast and refreshed list.

### Tests for User Story 1

- [X] T008 [P] [US1] Integration test for `POST /api/trends/collect` in `backend/tests/api/trends.test.js`
- [X] T009 [US1] Frontend test for manual collection trigger in `frontend/src/pages/Dashboard.test.jsx`

### Implementation for User Story 1

- [X] T010 [US1] Implement `POST /api/trends/collect` endpoint in `backend/src/api/trends.js`
- [X] T011 [US1] Add "Collect Now" button to `frontend/src/pages/Dashboard.jsx` with loading state
- [X] T012 [US1] Integrate `FeedbackContext` for snackbar notifications in `frontend/src/pages/Dashboard.jsx`

---

## Phase 4: User Story 2 - Weekly Trend Filtering (Priority: P1)

**Goal**: Filter trend items by week (Monday-Sunday) with clear date ranges.

**Independent Test**: Select a week from the dropdown and verify the list only shows items from that period.

### Tests for User Story 2

- [X] T013 [P] [US2] Unit test for week calculation logic in `frontend/src/utils/dateUtils.js`
- [X] T014 [US2] Integration test for filtered trend fetching in `backend/tests/api/trends.test.js`
- [X] T015 [US2] Create `WeeklyFilter` component in `frontend/src/components/features/WeeklyFilter.jsx`
- [X] T016 [US2] Implement Monday-start ISO week calculation logic in `frontend/src/utils/dateUtils.js`
- [X] T017 [US2] Integrate `WeeklyFilter` into `frontend/src/pages/Dashboard.jsx` and update fetch logic

---

## Phase 5: User Story 3 - Draft Creation History (Priority: P2)

**Goal**: View a list of past newsletters (drafts and sent).

**Independent Test**: Navigate to the history view and see a list of newsletters with dates and item counts.

### Tests for User Story 3

- [X] T018 [P] [US3] Unit test for `NewsletterModel.getAll` returning `item_count` in `backend/tests/unit/newsletterModel.test.js`
- [X] T019 [US3] Frontend test for history list rendering in `frontend/src/pages/NewsletterHistory.test.jsx`

### Implementation for User Story 3

- [X] T020 [US3] Create `NewsletterHistory` page/component in `frontend/src/pages/NewsletterHistory.jsx`
- [X] T021 [US3] Add navigation link to History in `frontend/src/components/Navbar.jsx`
- [X] T022 [US3] Integrate `GET /api/newsletters` API call in `frontend/src/pages/NewsletterHistory.jsx`

---

## Phase 6: User Story 4 - Duplicate Selection Prevention (Priority: P2)

**Goal**: Detect and warn about previously sent items during selection.

**Independent Test**: Select an item marked as duplicate and see a warning/confirmation dialog.

### Tests for User Story 4

- [X] T023 [P] [US4] Unit test for duplicate detection SQL query in `backend/tests/unit/trendItemModel.test.js`
- [X] T024 [US4] Frontend test for duplicate warning display in `frontend/src/components/features/TrendCard.test.jsx`

### Implementation for User Story 4

- [X] T025 [US4] Update `TrendCard.jsx` to display "Previously Sent" indicator based on `isDuplicate` prop
- [X] T026 [US4] Implement confirmation dialog logic in `frontend/src/pages/Dashboard.jsx` when duplicates are in selection
- [X] T027 [US4] Add visual indicator for duplicate items in `frontend/src/components/features/TrendCard.jsx`

---

## Phase 7: Polish & Cross-Cutting Concerns

- [X] T028 [P] Update `GEMINI.md` with new features and components
- [X] T029 Code cleanup and ensuring consistent date formatting across frontend and backend
- [X] T030 Final integration check of manual collection and filtering

---

## Dependencies & Execution Order

### Phase Dependencies
1. **Setup & Foundational (Phases 1-2)**: MUST be complete first.
2. **User Stories 1 & 2 (P1)**: Can be worked on in parallel once Foundational is done.
3. **User Stories 3 & 4 (P2)**: Depend on Foundational but can be worked on after P1 stories.

### Parallel Opportunities
- Backend model updates (T005, T006, T007) can be done in parallel.
- Frontend component creation (T015, T020, T025) can start as soon as their respective story phases begin.

---

## Implementation Strategy
- **MVP**: Complete US1 (Manual Collection) and US2 (Weekly Filtering) first to provide immediate value for curation.
- **Incremental**: Add History (US3) and Duplicate Prevention (US4) as the second increment to enhance the workflow quality.