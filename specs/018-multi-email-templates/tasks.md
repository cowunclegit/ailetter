# Tasks: Multiple Email Templates

**Input**: Design documents from `/specs/018-multi-email-templates/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: MANDATORY. Per Constitution Principle II, all features must be tested. Tests must be written first (TDD).

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and base requirements

- [x] T001 [P] Create migration file `backend/src/db/migrate_018_template_id.js` to add `template_id` to `newsletters` table (DEFAULT 'classic-list')
- [x] T002 Run migration `backend/src/db/migrate_018_template_id.js` to update database schema
- [x] T003 [P] Create directory for template EJS files in `backend/src/utils/templates/`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core logic and API structure needed for all stories

- [x] T004 [P] Implement `templateService.js` with a static registry of 10+ templates in `backend/src/services/templateService.js`
- [x] T005 [P] Create integration test `backend/tests/integration/templates.test.js` for template retrieval and assignment
- [x] T006 Implement `GET /api/templates` endpoint in `backend/src/api/templates.js`
- [x] T007 [P] Update `NewsletterModel.js` to support the `template_id` field in `backend/src/models/newsletterModel.js`
- [x] T008 Update `generateNewsletterHtml` in `backend/src/utils/emailTemplate.js` to dynamically load EJS files from the new templates directory

---

## Phase 3: User Story 1 - Choosing a Template during Draft Creation (Priority: P1) 🎯 MVP

**Goal**: Allow users to select a layout when creating or editing a draft.

**Independent Test**: Create a draft, select a template ID, and verify the choice is persisted in the database.

### Tests for User Story 1 (MANDATORY)

- [x] T009 [P] [US1] Create unit tests for template persistence in `backend/tests/unit/templateSelection.test.js`
- [x] T010 [P] [US1] Create frontend tests for `TemplateGrid.jsx` rendering in `frontend/tests/components/TemplateGrid.test.jsx`

### Implementation for User Story 1

- [x] T011 [US1] Update `PUT /api/newsletters/:id` to handle `template_id` updates in `backend/src/api/newsletters.js`
- [x] T012 [P] [US1] Create 10 structural EJS templates (Grid, List, Bold, etc.) in `backend/src/utils/templates/`
- [x] T013 [P] [US1] Implement `TemplateGrid.jsx` selection component in `frontend/src/components/features/TemplateGrid.jsx`
- [x] T014 [US1] Update `NewsletterDraft.jsx` to fetch and display the current `template_id` from the backend
- [x] T015 [US1] Integrate `TemplateGrid` into the settings section of `frontend/src/pages/NewsletterDraft.jsx`
- [x] T016 [US1] Implement the "Live Switch" logic in `NewsletterDraft.jsx` to refresh the preview upon selection
- [x] T017 [US1] Ensure `NewsletterModel.getById` includes `template_id` in the returned object

**Checkpoint**: User Story 1 complete - Curators can successfully select and persist a template.

---

## Phase 4: User Story 2 - Previewing Templates (Priority: P2)

**Goal**: Provide visual feedback for each template option.

**Independent Test**: Navigate to the selection grid and verify that each card displays a representative thumbnail.

### Implementation for User Story 2

- [x] T018 [P] [US2] Create or source 10+ visual thumbnails (PNG/SVG) in `frontend/src/assets/templates/`
- [x] T019 [P] [US2] Implement `TemplatePreview.jsx` card component in `frontend/src/components/features/TemplatePreview.jsx`
- [x] T020 [US2] Add hover effects and selection indicators to `TemplatePreview.jsx`
- [x] T021 [US2] Map the `thumbnail_url` in the backend static registry to the frontend assets
- [x] T022 [P] [US2] Add accessibility labels (alt text) to template thumbnails in `TemplatePreview.jsx`

**Checkpoint**: User Story 2 complete - Template selection is now a rich visual experience.

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Final verification and UX refinement

- [x] T023 [P] Verify that all 10 templates strictly include thumbnails, titles, and summaries for all articles
- [x] T024 [P] Ensure responsive grid behavior for template selection on mobile devices
- [x] T025 [P] Optimize template loading time (caching EJS reads) in `backend/src/utils/emailTemplate.js`
- [x] T026 Update `quickstart.md` with the final list of template slugs and descriptions
- [x] T027 Run final validation of all Success Criteria from `spec.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies.
- **Foundational (Phase 2)**: Depends on Phase 1.
- **User Story 1 (Phase 3)**: Depends on Phase 2.
- **User Story 2 (Phase 4)**: Depends on Phase 3 UI structure.
- **Polish (Phase 5)**: Depends on all stories being complete.

### Parallel Opportunities

- T001 and T003 can run together.
- T004, T005, and T007 can run in parallel within Phase 2.
- T009 and T010 (tests) can run in parallel with early UI scaffolding (T013).
- T018, T019, and T022 can run in parallel in Phase 4.

---

## Implementation Strategy

### MVP First (User Story 1)

1. Complete migration and base logic.
2. Implement API support for `template_id`.
3. Create minimal EJS files to verify structural switching.
4. Implement basic selection buttons in the draft editor.

### Incremental Delivery

1. Foundation ready.
2. Add template selection (P1).
3. Add visual thumbnails and cards (P2).
4. Refine designs and responsive behavior (Polish).

---

## Notes

- All 10 templates MUST support the content thumbnail requirement.
- Use the existing `feedbackContext` for success/error messages during template switching.
- Verify EJS rendering compatibility with common email clients (Gmail, Outlook).
