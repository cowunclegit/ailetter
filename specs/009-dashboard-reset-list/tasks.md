# Tasks: Dashboard Content List Reset

**Input**: Design documents from `/specs/009-dashboard-reset-list/`
**Prerequisites**: plan.md, spec.md, research.md, contracts/api.yaml

**Tests**: MANDATORY (Constitution Principle II). Red-Green-Refactor cycle required.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)

---

## Phase 1: Setup

**Purpose**: Initialize feature environment and ensure baseline stability.

- [x] T001 Verify active branch is `009-dashboard-reset-list` and project is clean
- [x] T002 [P] Run baseline tests for `backend/` and `frontend/` to ensure green state

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Prepare shared utilities or database changes (none required for this feature).

*No foundational tasks required.*

---

## Phase 3: User Story 1 - Clear Curation Selection (Priority: P1)

**Goal**: Implement the "Reset" button that clears the active draft and resets filters.

**Independent Test**: Select items, apply filters, click Reset, confirm. Verify items unchecked and filters reset.

### Tests for Backend Logic (TDD)

- [x] T003 [US1] Create unit test for `clearDraftItems` method in `backend/tests/unit/newsletterService.test.js`
- [x] T004 [US1] Create integration test for `POST /api/newsletters/active-draft/clear` endpoint in `backend/tests/api/newsletters.test.js`

### Backend Implementation

- [x] T005 [US1] Implement `clearDraftItems` logic in `backend/src/services/newsletterService.js` to delete from `newsletter_items`
- [x] T006 [US1] Implement `POST /active-draft/clear` route in `backend/src/api/newsletters.js` using the service

### Tests for Frontend Logic (TDD)

- [x] T007 [US1] Add unit tests for Reset button state (disabled/enabled) in `frontend/src/pages/Dashboard.test.jsx`
- [x] T008 [US1] Add integration test for the full Reset flow (click -> dialog -> confirm -> API call -> state update) in `frontend/src/pages/Dashboard.test.jsx`

### Frontend Implementation

- [x] T009 [P] [US1] Add `clearActiveDraft` function to `frontend/src/api/newsletterApi.js` (or inline in Dashboard if no separate file)
- [x] T010 [US1] Implement `ResetDialog` logic (using MUI Dialog) and "Reset" button in `frontend/src/pages/Dashboard.jsx`
- [x] T011 [US1] Integrate `handleReset` handler in `frontend/src/pages/Dashboard.jsx` to call API, reset `search`/`date` state, and clear selection

---

## Phase 4: Polish & Cross-Cutting Concerns

- [x] T012 Verify SC-002: UI updates within 200ms (check manual feel or performance profile)
- [x] T013 Verify SC-003: Confirm no "Undo" is needed and Dialog prevents accidental data loss
- [x] T014 Final test suite execution (backend & frontend) and cleanup

---

## Dependencies

- **Sequential**: Phase 1 -> Phase 3 (Backend) -> Phase 3 (Frontend) -> Phase 4
- **Parallel**: 
  - Backend Tests (T003, T004) can be written in parallel.
  - Frontend API stub (T009) can be done while Backend is in progress.

## Implementation Strategy

1. **Backend First**: Secure the data operation with tests.
2. **Frontend Logic**: Build the API connector and state logic.
3. **UI Integration**: specific button placement and Dialog connection.
