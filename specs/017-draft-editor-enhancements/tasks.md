# Tasks: Draft Editor Enhancements

**Input**: Design documents from `/specs/017-draft-editor-enhancements/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: MANDATORY. Per Constitution Principle II, all features must be tested. Tests must be written first (TDD).

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 [P] Install frontend dependency `react-quill-new` in `frontend/package.json`
- [x] T002 [P] Create migration file `backend/src/db/migrate_017_newsletter_fields.js` to add `subject`, `introduction_html`, and `conclusion_html` to `newsletters` table
- [x] T003 Run migration `backend/src/db/migrate_017_newsletter_fields.js` to update database schema

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure and base components needed for all user stories

- [x] T004 [P] Update `NewsletterModel.getById` in `backend/src/models/newsletterModel.js` to include new fields
- [x] T005 [P] Create `backend/tests/unit/newsletterModel.test.js` to test new field retrieval and updates
- [x] T006 [P] Create `frontend/src/components/features/RichTextEditor.jsx` using `react-quill-new` as a reusable component
- [x] T007 [P] Create `frontend/tests/components/RichTextEditor.test.jsx` for editor rendering and change handling

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Refining Article List and Subject (Priority: P1) 🎯 MVP

**Goal**: Allow users to delete articles and customize the subject line.

**Independent Test**: Create a draft, delete an article, change the subject, and verify persistence.

### Tests for User Story 1 (MANDATORY)

- [x] T008 [P] [US1] Create integration test `backend/tests/integration/newsletterItems.test.js` for item deletion endpoint
- [x] T009 [P] [US1] Create integration test `backend/tests/integration/newsletterSubject.test.js` for subject update endpoint
- [x] T010 [P] [US1] Create frontend test `frontend/tests/pages/NewsletterDraft_US1.test.jsx` for delete button and subject input

### Implementation for User Story 1

- [x] T011 [US1] Implement `DELETE /api/newsletters/:id/items/:trendItemId` in `backend/src/api/newsletterRoutes.js` (or similar)
- [x] T012 [US1] Implement `PUT /api/newsletters/:id` to update `subject` in `backend/src/api/newsletterRoutes.js`
- [x] T013 [P] [US1] Add `Delete` button and handler to `frontend/src/components/features/DraggableItem.jsx`
- [x] T014 [US1] Add subject line input field to `frontend/src/pages/NewsletterDraft.jsx`
- [x] T015 [US1] Connect delete button and subject input to backend API in `frontend/src/pages/NewsletterDraft.jsx`

**Checkpoint**: User Story 1 functional - basic draft management complete.

---

## Phase 4: User Story 2 - Adding Context with Intro and Outro (Priority: P2)

**Goal**: Add introduction and conclusion sections using rich text editors.

**Independent Test**: Enter HTML content in intro/outro editors and verify it renders correctly in preview.

### Tests for User Story 2 (MANDATORY)

- [x] T016 [P] [US2] Create integration test `backend/tests/integration/newsletterContent.test.js` for intro/outro HTML persistence
- [x] T017 [P] [US2] Create frontend test `frontend/tests/pages/NewsletterDraft_US2.test.jsx` for editor interactions

### Implementation for User Story 2

- [x] T018 [US2] Update `PUT /api/newsletters/:id` in `backend/src/api/newsletterRoutes.js` to handle `introduction_html` and `conclusion_html`
- [x] T019 [US2] Add `RichTextEditor` components for Intro and Outro in `frontend/src/pages/NewsletterDraft.jsx`
- [x] T020 [US2] Persist Intro/Outro changes to backend from `frontend/src/pages/NewsletterDraft.jsx`
- [x] T021 [US2] Update `NewsletterPreview.jsx` (if needed) to display intro and outro HTML content

**Checkpoint**: User Story 2 functional - newsletters now support rich text context.

---

## Phase 5: User Story 3 - AI-Assisted Subject Line (Priority: P3)

**Goal**: Provide AI suggestions for the subject line (placeholder implementation).

**Independent Test**: Click AI Recommend button and verify text is appended.

### Tests for User Story 3 (MANDATORY)

- [x] T022 [P] [US3] Create integration test `backend/tests/integration/newsletterAI.test.js` for AI recommendation endpoint

### Implementation for User Story 3

- [x] T023 [US3] Implement `POST /api/newsletters/:id/ai-recommend-subject` in `backend/src/api/newsletterRoutes.js` (placeholder logic)
- [x] T024 [US3] Add "AI Recommend" button next to subject input in `frontend/src/pages/NewsletterDraft.jsx`
- [x] T025 [US3] Connect AI button to backend and update subject state in `frontend/src/pages/NewsletterDraft.jsx`

**Checkpoint**: All user stories functional.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final verification and UI/UX refinements.

- [x] T026 [P] Verify HTML output consistency between editors and sent emails
- [x] T027 [P] Ensure responsive layout for new editors on mobile/tablet views
- [x] T028 [P] Update `quickstart.md` with any additional troubleshooting steps
- [x] T029 Run final validation of `Success Criteria` from `spec.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Initial requirement
- **Foundational (Phase 2)**: Depends on Setup completion
- **User Stories (Phases 3-5)**: Depend on Foundational completion
- **Polish (Phase 6)**: Final step after all stories

### Parallel Opportunities

- T001, T002 can run in parallel
- T004-T007 can run in parallel (models and UI scaffolding)
- Once Foundational is done, Phase 3 and Phase 4 can partially overlap (different files), but Phase 3 is priority
- All tests marked [P] can run in parallel within their phase

---

## Implementation Strategy

### MVP First (User Story 1)

Focus on deleting items and basic subject editing first. This provides immediate value for cleaning up drafts.

### Incremental Delivery

1. Setup + Foundation
2. US1 (MVP) -> Validate independently
3. US2 (Rich Text) -> Validate independently
4. US3 (AI Suggester) -> Validate independently
5. Polish

---

## Notes

- All backend routes MUST be covered by integration tests (TDD)
- `react-quill` styling should match Material UI theme
- Placeholder AI logic is strictly `string + " (AI 추천 제목)"` as per spec
