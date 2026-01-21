# Tasks: Subscriber Management UI & Sync

**Branch**: `022-manage-subscribers`
**Spec**: [Link](./spec.md)
**Plan**: [Link](./plan.md)

## Implementation Strategy
- **Phase 1 (Setup)**: Prepare backend models and migrations for the new subscriber entities.
- **Phase 2 (Foundational)**: Establish the `Subscriber` model and basic service layer methods.
- **Phase 3 (User Stories)**: Implement features incrementally:
    - **US1**: Manual management UI and API (CRUD).
    - **US2**: Public unsubscribe flow (Backend endpoint + Frontend page).
    - **US3**: Sync skeleton (Mock integration).
- **MVP Scope**: Phases 1, 2, and 3 (US1 + US2) provide the core value. US3 is a placeholder.

---

## Phase 1: Setup & Data Modeling

- [x] T001 Create migration for `subscribers` and `subscriber_categories` tables in `backend/src/db/migrations/migrate_022_subscribers.js`
- [x] T002 [P] Register the new migration in `backend/src/db/migrate.js` (if manual registration is required, otherwise verify migration runs)

---

## Phase 2: Foundational (Backend Core)

- [x] T003 Create `Subscriber` model class in `backend/src/models/Subscriber.js` with CRUD methods and UUID generation
- [x] T004 Implement `SubscriberService` in `backend/src/services/subscriberService.js` to handle business logic (create, update categories, toggle status)
- [x] T005 [P] Implement unit tests for `SubscriberService` in `backend/tests/unit/subscriberService.test.js`

---

## Phase 3: User Story 1 - Manual Subscriber Management (Priority: P1)
**Goal**: Admin can add, edit, and view subscribers with their categories and status.

- [x] T006 [P] [US1] Create integration tests for Subscriber API in `backend/tests/api/subscribers.test.js` (TDD Red Phase)
- [x] T007 [US1] Create API routes for subscribers (GET/POST/PUT) in `backend/src/api/subscribers.js`
- [x] T008 [P] [US1] Register subscriber routes in `backend/src/server.js`
- [x] T009 [US1] Create frontend API client functions in `frontend/src/api/subscribers.js`
- [x] T010 [US1] Create `SubscriberList` component in `frontend/src/components/SubscriberList.jsx` using MUI DataGrid
- [x] T011 [US1] Create `SubscriberForm` dialog component in `frontend/src/components/SubscriberForm.jsx` for adding/editing users
- [x] T012 [US1] Integrate `SubscriberList` into the admin dashboard page (e.g., `frontend/src/pages/Dashboard.jsx` or new `SubscribersPage.jsx`)
- [x] T013 [P] [US1] Add "Subscribers" navigation link in `frontend/src/components/Sidebar.jsx` (or equivalent nav component)

---

## Phase 4: User Story 2 - User Unsubscribe Flow (Priority: P1)
**Goal**: Users can unsubscribe via a secure public link using their UUID.

- [x] T014 [US2] Create integration test for unsubscribe flow in `backend/tests/integration/unsubscribe.test.js` (TDD Red Phase)
- [x] T015 [US2] Implement `unsubscribe` method in `SubscriberService` (update status only)
- [x] T016 [US2] Add POST `/api/subscribers/unsubscribe/:uuid` endpoint in `backend/src/api/subscribers.js`
- [x] T017 [US2] Create public `UnsubscribePage` in `frontend/src/pages/UnsubscribePage.jsx`
- [x] T018 [US2] Add route for `/unsubscribe/:uuid` in `frontend/src/App.jsx`

---

## Phase 5: User Story 3 - External Directory Sync Skeleton (Priority: P3)
**Goal**: Simulate sync with an external directory via a backend skeleton.

- [x] T019 [US3] Create unit tests for sync logic in `backend/tests/unit/subscriberService.sync.test.js` (TDD Red Phase)
- [x] T020 [US3] Implement `syncSubscribers` method in `SubscriberService` (mock logic: log to console, mock update existing)
- [x] T021 [US3] Add POST `/api/subscribers/sync` endpoint in `backend/src/api/subscribers.js`
- [x] T022 [US3] Add "Sync" button to `SubscriberList` component in `frontend/src/components/SubscriberList.jsx`
- [x] T023 [P] [US3] Verify sync logs in backend console (manual verification task or script)

---

## Final Phase: Polish & Cross-Cutting

- [x] T024 Ensure all ESLint warnings are resolved in `backend/src/api/subscribers.js` and `frontend/src/components/SubscriberList.jsx`
- [x] T025 Run full regression test suite `npm test`
- [x] T026 Verify UI responsiveness for Subscriber management on smaller screens

## Dependencies

- Phase 2 (Models) MUST complete before Phase 3 (API/UI).
- T003 (Model) -> T004 (Service) -> T007 (API) -> T009 (Frontend API).
- US2 (Unsubscribe) depends on T004 (Service) for the unsubscribe logic.

## Parallel Execution

- **Frontend/Backend**: After T007 (API definition), T009 (Frontend API) and T010 (UI) can proceed in parallel with T007 implementation if contracts are agreed.
- **US2 & US3**: Can be developed in parallel after Phase 2 is complete.
