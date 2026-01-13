# Tasks: Newsletter Draft and Secure Sending

**Input**: Design documents from `/specs/006-newsletter-draft-send/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/api.yaml

**Tests**: MANDATORY (Constitution Principle II). Red-Green-Refactor cycle required.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)

---

## Phase 1: Setup

**Purpose**: Initialize feature environment and install dependencies.

- [x] T001 Verify active branch is `006-newsletter-draft-send` and `GEMINI.md` reflects current technologies
- [x] T002 [P] Baseline test run to ensure current tests pass in `backend/` and `frontend/`
- [x] T003 [P] Install backend dependency `uuid` in `backend/package.json`
- [x] T004 [P] Install frontend dependencies `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities` in `frontend/package.json`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Database schema updates required for all user stories.

- [x] T005 [P] Update `backend/src/db/schema.sql` to add `status` (Enum: draft, sending, sent) and `confirmation_uuid` (UUID) to `newsletters` table
- [x] T006 [P] Update `backend/src/db/schema.sql` to add `display_order` (Integer) to `newsletter_items` table
- [x] T007 Create migration script in `backend/src/db/migrate.js` to apply new columns to existing databases

---

## Phase 3: User Story 1 - Draft Content Organization (Priority: P1)

**Goal**: Organize and reorder selected items in a dedicated draft screen.

**Independent Test**: Create a draft, navigate to the Draft screen, drag items to reorder, and verify the new order persists after page refresh.

### Tests for User Story 1

- [x] T008 [P] [US1] Unit test for `NewsletterModel.updateItemOrder` in `backend/tests/unit/newsletterModel.test.js`
- [x] T009 [US1] Integration test for `PUT /api/newsletters/{id}/reorder` in `backend/tests/api/newsletters.test.js`

### Implementation for User Story 1

- [x] T010 [US1] Update `NewsletterModel.getById` to fetch items sorted by `display_order` in `backend/src/models/newsletterModel.js`
- [x] T011 [US1] Implement `updateItemOrder` in `backend/src/models/newsletterModel.js` using a transaction
- [x] T012 [US1] Implement `GET /api/newsletters/{id}/items` endpoint in `backend/src/api/newsletters.js`
- [x] T013 [US1] Implement `PUT /api/newsletters/{id}/reorder` endpoint in `backend/src/api/newsletters.js`
- [x] T014 [US1] Create `NewsletterDraft.jsx` skeleton and add route in `frontend/src/App.jsx`
- [x] T015 [US1] Update "Create Draft" button in `frontend/src/pages/Dashboard.jsx` to navigate to `/newsletters/:id/draft` upon success
- [x] T016 [US1] Implement `DraggableItem.jsx` component using `@dnd-kit/sortable` in `frontend/src/components/features/DraggableItem.jsx`
- [x] T017 [US1] Implement sortable list in `frontend/src/pages/NewsletterDraft.jsx` with automatic persistence on drop

---

## Phase 4: User Story 2 - Preview and Quality Check (Priority: P2)

**Goal**: Receive a test email to verify appearance and order.

**Independent Test**: Click "Send Test Mail" on the Draft screen and verify an email is received at the admin address with the correct content and order.

### Tests for User Story 2

- [x] T018 [P] [US2] Unit test for `EmailService.sendTestNewsletter` in `backend/tests/unit/emailService.test.js`
- [x] T019 [US2] Integration test for `POST /api/newsletters/{id}/send-test` in `backend/tests/api/newsletters.test.js`

### Implementation for User Story 2

- [x] T020 [US2] Implement `sendTestNewsletter` in `backend/src/services/emailService.js` (generates and stores `confirmation_uuid`)
- [x] T021 [US2] Implement `POST /api/newsletters/{id}/send-test` endpoint in `backend/src/api/newsletters.js`
- [x] T022 [US2] Update `backend/src/utils/newsletter.ejs` to include the "Confirm and Send to All" link using the `confirmation_uuid`
- [x] T023 [US2] Add "Send Test Mail" button and feedback handling in `frontend/src/pages/NewsletterDraft.jsx`

---

## Phase 5: User Story 3 - Secure Final Confirmation (Priority: P3)

**Goal**: Securely trigger final distribution from the test email link.

**Independent Test**: Click the "Confirm" link in the test email and verify the newsletter status changes to `sent` and subscribers receive the mail.

### Tests for User Story 3

- [x] T024 [P] [US3] Unit test for idempotency and status transition in `backend/tests/unit/newsletterService.test.js`
- [x] T025 [US3] Integration test for `GET /api/newsletters/confirm/{uuid}` in `backend/tests/api/newsletters.test.js`

### Implementation for User Story 3

- [x] T026 [US3] Implement confirmAndSendNewsletter in backend/src/services/newsletterService.js using a database transaction for atomic status check and 24h expiration validation
- [x] T027 [US3] Implement GET /api/newsletters/confirm/{uuid} endpoint in `backend/src/api/newsletters.js`
- [x] T028 [US3] Create a simple confirmation success/failure page in `frontend/src/pages/Public.jsx` (or similar)

---

## Phase 6: Polish & Cross-Cutting Concerns

- [x] T029 [P] Ensure `ADMIN_EMAIL` environment variable is documented and handled in `backend/src/config/env.js`
- [x] T030 Add loading states and error boundaries to the Drag & Drop list in `frontend/src/pages/NewsletterDraft.jsx`
- [x] T031 Final verification of SC-003: Verify that arbitrary UUID calls return 404
- [x] T032 Final test suite execution and cleanup of temporary test data

---

## Dependencies & Execution Order

### Phase Dependencies
1. **Setup & Foundational (Phases 1-2)**: MUST be complete first to provide the schema and libraries.
2. **User Story 1 (Phase 3)**: Core draft organization must work before previewing.
3. **User Story 2 (Phase 4)**: Test mail generation depends on organized drafts.
4. **User Story 3 (Phase 5)**: Secure sending depends on the UUID generated in Phase 4.

### Parallel Opportunities
- T003, T004 (Installations) can run simultaneously.
- T005, T006 (Schema updates) can run together.
- Backend tests (T008, T018, T024) can often be prepared while frontend UI (T014) is being scaffolded.

---

## Implementation Strategy
- **MVP**: Focus on US1 and US2. This allows curators to organize content and see a preview. US3 can be simulated or handled manually if needed for an early demo.
- **Increment**: Deliver US3 to finalize the secure automated workflow.
- **Stability**: Using transactions for reordering and status updates is critical to prevent database corruption or multiple sends.