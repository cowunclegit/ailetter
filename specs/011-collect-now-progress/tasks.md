# Tasks: Collect Now & Progress

**Input**: Design documents from `/specs/011-collect-now-progress/`
**Prerequisites**: plan.md, spec.md, research.md, contracts/openapi.yaml
**Tests**: MANDATORY. Tests must be written first (TDD).

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel
- **[Story]**: [US1] or [US2]
- Paths: `backend/src/`, `frontend/src/`

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Verify environment and dependencies.

- [x] T001 Verify project structure and ensure `backend/src/api/trends.js` and `backend/src/jobs/collectionJob.js` are accessible.

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Verify backend endpoints defined in contracts/openapi.yaml are fully functional and adhere to requirements before frontend integration.

- [x] T002 [P] Create backend integration test for manual collection API (`POST /collect`, `GET /status`) in `backend/tests/api/manualCollection.test.js`.
- [x] T003 Ensure `backend/src/api/trends.js` correctly implements `POST /collect` with concurrency locking (returns 409 if active) and non-blocking execution.
- [x] T004 Ensure `backend/src/api/trends.js` correctly implements `GET /collect/status` reflecting the `collectionService` state.

## Phase 3: User Story 1 - Trigger Immediate Collection (Priority: P1) 🎯 MVP

**Goal**: Admin can click a button to start collection and see a "loading" state.

**Independent Test**: Click button -> Backend log shows start -> Button shows spinner -> Button disabled.

### Tests for User Story 1 (MANDATORY) ⚠️

- [x] T005 [P] [US1] Create frontend unit test for `CollectButton` component (render, click, loading state) in `frontend/src/components/CollectButton.test.jsx`.

### Implementation for User Story 1

- [x] T006 [P] [US1] Add `triggerCollection` method to `frontend/src/api/trends.js` (or relevant API service file).
- [x] T007 [US1] Implement `CollectButton` component layout (MUI Button, CircularProgress) in `frontend/src/components/CollectButton.jsx`.
- [x] T008 [US1] Implement click handler in `CollectButton.jsx` to call API and set local loading state.
- [x] T009 [US1] Integrate `CollectButton` into the toolbar/header of `frontend/src/pages/Dashboard.jsx`.

**Checkpoint**: User can click button, see spinner, and backend logs show job started.

## Phase 4: User Story 2 - Auto-Refresh on Completion (Priority: P1)

**Goal**: UI polls for completion and refreshes the list automatically.

**Independent Test**: Start collection -> Wait -> List updates without manual reload.

### Tests for User Story 2 (MANDATORY) ⚠️

- [x] T010 [P] [US2] Update `CollectButton.test.jsx` to test polling logic and `onCollectionComplete` callback.

### Implementation for User Story 2

- [x] T011 [P] [US2] Add `getCollectionStatus` method to `frontend/src/api/trends.js`.
- [x] T012 [US2] Implement polling logic (e.g., `setInterval` or `useEffect`) in `frontend/src/components/CollectButton.jsx` to check status while loading.
- [x] T013 [US2] Implement completion logic in `CollectButton.jsx`: stop polling, clear loading state, call `onCollectionComplete` prop.
- [x] T014 [US2] Update `frontend/src/pages/Dashboard.jsx` to pass a refresh callback (to reload trends) into `CollectButton`.

**Checkpoint**: Full flow: Click -> Load -> Poll -> Auto-refresh list.

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Error handling and UX improvements.

- [x] T015 [US2] Add error handling in `CollectButton.jsx` for network failures or API errors (display Snackbar or Alert).
- [x] T016 [US2] Verify edge case: Handle server timeout or very long collection times gracefully (optional timeout in polling).
- [x] T017 Run manual verification using `specs/011-collect-now-progress/quickstart.md`.

---

## Dependencies & Execution Order

### Phase Dependencies
- **Foundational (Phase 2)**: Verification of backend ensures frontend has a stable API to talk to.
- **User Story 1 (Phase 3)**: Depends on Phase 2 APIs.
- **User Story 2 (Phase 4)**: Extends US1 component. Depends on US1 completion.

### Parallel Opportunities
- Backend tests (T002) and Frontend tests (T005) can be written in parallel.
- API service methods (T006, T011) can be implemented in parallel with Component shells.

## Implementation Strategy

### MVP First
1. Verify Backend (Phase 2).
2. Build Button (Phase 3) - allows triggering even if refresh is manual.
3. Add Polling (Phase 4) - completes the automation loop.
