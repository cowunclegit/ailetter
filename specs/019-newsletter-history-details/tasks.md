# Tasks: Newsletter History Details and Actions

**Input**: Design documents from `/specs/019-newsletter-history-details/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: MANDATORY. Per Constitution Principle II, all features must be tested. Tests must be written first (TDD).

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic requirements

- [x] T001 [P] [US1] Create unit test `frontend/src/tests/pages/NewsletterDetails.test.jsx` for the detail page rendering (Mock backend response)
- [x] T002 [P] Create integration test `backend/tests/integration/newsletterDetails.test.js` to verify existing `GET /api/newsletters/:id` endpoint returns all fields

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Base components and routing needed for all stories

- [x] T003 [P] [US1] Create reusable `NewsletterDetailView.jsx` component in `frontend/src/components/features/NewsletterDetailView.jsx`
- [x] T004 [US1] Add `/newsletters/:id` route to `frontend/src/App.jsx`
- [x] T005 [US1] Implement navigation logic in `frontend/src/pages/NewsletterHistory.jsx` to make table rows clickable

**Checkpoint**: Routing and basic scaffolding ready - detail view implementation can begin

---

## Phase 3: User Story 1 - Viewing Newsletter Details (Priority: P1) 🎯 MVP

**Goal**: View newsletter details on click from history.

**Independent Test**: Navigate to `/history`, click a row, verify navigation to `/newsletters/:id` and correct rendering of subject, items, and rich text content.

### Implementation for User Story 1

- [x] T006 [US1] Implement `NewsletterDetails.jsx` page in `frontend/src/pages/NewsletterDetails.jsx` (fetch data from API)
- [x] T007 [US1] Integrate `NewsletterDetailView` into `NewsletterDetails.jsx`
- [x] T008 [US1] Add "Back to History" button in `NewsletterDetails.jsx`
- [x] T009 [US1] Ensure HTML content (introduction/conclusion) renders safely in `NewsletterDetailView.jsx`

**Checkpoint**: User Story 1 complete - Curators can view detailed history.

---

## Phase 4: User Story 2 - Continuing Draft Editing (Priority: P2)

**Goal**: Provide a quick path back to the editor for pending drafts.

**Independent Test**: Open a 'Draft' status newsletter detail page, verify the "Go to Draft Editor" button exists, and verify it navigates to `/newsletters/:id/draft`.

### Implementation for User Story 2

- [x] T010 [US2] Add conditional "Go to Draft Editor" button in `frontend/src/pages/NewsletterDetails.jsx` based on status
- [x] T011 [P] [US2] Update `frontend/src/tests/pages/NewsletterDetails.test.jsx` to verify visibility of draft action buttons based on status

**Checkpoint**: User Story 2 complete - Workflow for active drafts is improved.

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: UI/UX refinement and final validation

- [x] T012 [P] Ensure responsive layout for `NewsletterDetailView.jsx` on mobile devices
- [x] T013 [P] Add loading and error states to `NewsletterDetails.jsx`
- [x] T014 Run final validation of success criteria in `specs/019-newsletter-history-details/spec.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Can start immediately.
- **Foundational (Phase 2)**: Depends on Phase 1 tests being established.
- **User Story 1 (Phase 3)**: Depends on Foundational routing.
- **User Story 2 (Phase 4)**: Depends on User Story 1 detail page.
- **Polish (Phase 5)**: Final step.

### Parallel Opportunities

- T001 and T002 can run together.
- T003 can be developed in parallel with routing tasks (T004, T005).
- T011 and T012 can run in parallel during the polish phase.

---

## Implementation Strategy

### MVP First (User Story 1)

1. Verify backend provides the correct data.
2. Setup frontend routing and row clicking.
3. Build the detail display page.

### Incremental Delivery

1. Basic detail view (P1).
2. Add draft-specific actions (P2).
3. Responsive design and error handling (Polish).

---

## Notes

- Backend `GET /api/newsletters/:id` is assumed to be fully functional; if tests fail, adjust `newsletterModel.js`.
- Use `dangerouslySetInnerHTML` carefully or a dedicated library for the HTML sections in `NewsletterDetailView`.
- Maintain consistent styling with the existing `NewsletterDraft.jsx` where possible.
