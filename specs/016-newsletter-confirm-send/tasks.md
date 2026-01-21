# Implementation Tasks: Newsletter Approval and Sending Workflow

**Feature**: 016-newsletter-confirm-send
**Spec**: [spec.md](spec.md)
**Plan**: [plan.md](plan.md)

## Phase 1: Setup
*Goal: Initialize database schema and project dependencies.*

- [x] T001 Add `confirmation_uuid` and `sent_at` columns to `newsletters` table via migration script in backend/src/db/migrations/016_add_newsletter_approval_fields.js
- [x] T002 Install `uuid` and `ejs` dependencies in backend/package.json
- [x] T003 [P] Create `ConfirmationSuccess` and `ConfirmationFailed` pages in frontend/src/pages/

## Phase 2: Foundational
*Goal: Implement core email and templating logic.*

- [x] T004 [P] Create `EmailService` with dummy console logs for `sendEmail` in backend/src/services/emailService.js
- [x] T005 [P] Implement EJS template for the newsletter HTML in backend/src/utils/emailTemplate.js
- [x] T006 Update `NewsletterModel` to support UUID storage and status transitions in backend/src/models/newsletterModel.js

## Phase 3: User Story 1 - Newsletter Preview and Test Send
*Goal: Allow admin to preview and trigger test emails.*
*Priority: P1*

- [x] T007 [P] [US1] Implement unit tests for `EmailService` test mail generation in backend/tests/unit/emailService.test.js
- [x] T008 [US1] Implement `GET /api/newsletters/:id/preview` endpoint returning HTML in backend/src/api/newsletters.js
- [x] T009 [US1] Implement `POST /api/newsletters/:id/send-test` endpoint generating UUID and logging email in backend/src/api/newsletters.js
- [x] T010 [US1] Create `NewsletterPreview` component in frontend/src/components/features/NewsletterPreview.jsx
- [x] T011 [US1] Add "Preview" and "Send Test Mail" actions to the dashboard in frontend/src/pages/Dashboard.jsx or appropriate view

## Phase 4: User Story 2 - Admin Confirmation Workflow
*Goal: Process approval links and secure the workflow.*
*Priority: P1*

- [x] T012 [P] [US2] Create integration tests for the confirmation UUID workflow in backend/tests/integration/confirmation.test.js
- [x] T013 [US2] Implement `GET /api/newsletters/confirm/:uuid` endpoint with TTL check and status gate in backend/src/api/newsletters.js
- [x] T014 [US2] Ensure `NewsletterModel` prevents edits to newsletters with status `pending_confirmation` or `sent` in backend/src/models/newsletterModel.js

## Phase 5: User Story 3 - Subscriber Distribution
*Goal: Distribute approved newsletters to the mailing list.*
*Priority: P2*

- [x] T015 [US3] Implement the distribution loop in `NewsletterService` to iterate through all active subscribers in backend/src/services/newsletterService.js
- [x] T016 [US3] Verify `SubscriberModel` correctly fetches the active mailing list in backend/src/models/subscriberModel.js

## Phase 6: Polish & Cross-Cutting
*Goal: Final refinements and performance validation.*

- [x] T017 Ensure email template responsiveness and layout matches spec in backend/src/utils/emailTemplate.js
- [x] T018 Verify SC-002 (no duplicate sends) via automated concurrent request tests in backend/tests/integration/confirmation.test.js
- [x] T019 Final manual verification of the end-to-one flow per quickstart.md

## Dependencies

- Phase 2 depends on Phase 1 (Schema and deps must exist).
- Phase 3 depends on Phase 2 (Service and template needed for preview/send).
- Phase 4 depends on Phase 3 (UUID must be generated to be confirmed).
- Phase 5 depends on Phase 4 (Confirmation triggers distribution).

## Implementation Strategy

1. **MVP First**: Focus on the test-send and manual confirmation endpoint (Phases 1-4).
2. **Incremental Delivery**: Add the distribution loop (Phase 5) once the approval gate is solid.
3. **Red-Green-Refactor**: Strictly follow TDD for the confirmation logic and status transitions.
