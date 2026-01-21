# Tasks: AI Subject Recommendation Options

**Input**: Design documents from `/specs/020-ai-subject-options/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: MANDATORY. Per Constitution Principle II, all features must be tested. Tests must be written first (TDD).

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and database preparation

- [x] T001 [P] Create migration file `backend/src/db/migrate_020_ai_presets.js` for `ai_subject_presets` table
- [x] T002 Run migration `backend/src/db/migrate_020_ai_presets.js` to create the table

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core model and service logic needed for all stories

- [x] T003 [P] Implement `AiPresetModel` in `backend/src/models/aiPresetModel.js` with basic CRUD methods
- [x] T004 [P] Create unit test `backend/tests/unit/aiPresetModel.test.js` for preset persistence
- [x] T005 Update `AiService.js` in `backend/src/services/aiService.js` to include `${contentList}` replacement logic
- [x] T006 [P] Create unit test `backend/tests/unit/aiService_templates.test.js` for prompt template resolution

**Checkpoint**: Foundation ready - Preset management and prompt logic can now be implemented

---

## Phase 3: User Story 1 - Managing AI Recommendation Presets (Priority: P1) 🎯 MVP

**Goal**: Allow curators to create, edit, and delete audience-specific prompt presets.

**Independent Test**: Use the Settings page to create a "Technical" preset, edit its prompt, and delete it.

### Tests for User Story 1 (MANDATORY)

- [x] T007 [P] [US1] Create integration test `backend/tests/integration/aiPresets.test.js` for CRUD endpoints
- [x] T008 [P] [US1] Create frontend test `frontend/src/tests/pages/Settings.test.jsx` for preset management UI

### Implementation for User Story 1

- [x] T009 [US1] Implement CRUD API routes in `backend/src/api/aiPresets.js` (including protection against deleting `is_default` presets)
- [x] T010 [US1] Register `aiPresets` routes in `backend/src/server.js`
- [x] T011 [P] [US1] Create `AIPresetForm.jsx` component in `frontend/src/components/features/AIPresetForm.jsx`
- [x] T012 [US1] Create `Settings.jsx` page in `frontend/src/pages/Settings.jsx` with preset list and CRUD actions
- [x] T013 [US1] Add "Settings" link to navigation in `frontend/src/components/Navbar.jsx` (or similar)

**Checkpoint**: User Story 1 complete - Curators can manage their own AI presets.

---

## Phase 4: User Story 2 - Using Presets for Subject Generation (Priority: P1)

**Goal**: Generate subjects based on selected presets and draft content.

**Independent Test**: In the draft editor, select a preset, click "AI Recommend", and verify the subject is generated using the specific prompt instructions.

### Tests for User Story 2 (MANDATORY)

- [x] T014 [P] [US2] Create integration test `backend/tests/integration/aiRecommend_v2.test.js` for preset-based generation
- [x] T015 [P] [US2] Create frontend test `frontend/tests/pages/NewsletterDraft_AI.test.jsx` for the dropdown and AI trigger

### Implementation for User Story 2

- [x] T016 [US2] Update `POST /api/newsletters/:id/ai-recommend-subject` in `backend/src/api/newsletters.js` to accept `preset_id`
- [x] T017 [US2] Update `NewsletterService.js` to fetch selected preset/items and delegate prompt resolution to `AiService.js`
- [x] T018 [US2] Add preset selection dropdown next to "AI Recommend" button in `frontend/src/pages/NewsletterDraft.jsx`
- [x] T019 [US2] Update "AI Recommend" handler in `frontend/src/pages/NewsletterDraft.jsx` to send `preset_id` and enforce mandatory selection

**Checkpoint**: User Story 2 complete - Curators can now leverage tailored AI recommendations.

---

## Phase 5: User Story 3 - Default Presets (Priority: P2)

**Goal**: Provide out-of-the-box presets for immediate value.

**Independent Test**: Verify "For Leaders" and "For Developers" exist in the database and UI without manual entry.

### Implementation for User Story 3

- [x] T020 [US3] Update migration `backend/src/db/migrate_020_ai_presets.js` to seed default presets
- [x] T021 [US3] Ensure `is_default` presets are visually distinguished or protected in `Settings.jsx`

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final verification and UX refinements

- [x] T022 [P] Ensure responsive layout for the Settings page and Draft Editor components
- [x] T023 [P] Add loading indicators to the preset management list
- [x] T024 [P] Update `quickstart.md` with examples of effective prompt templates
- [x] T025 Run final validation of success criteria in `specs/020-ai-subject-options/spec.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Phase 1 completion
- **User Stories (Phases 3-4)**: Both depend on Phase 2 completion
- **User Story 3 (Phase 5)**: Depends on Phase 1 (Migration seeding)
- **Polish (Final Phase)**: Depends on all user stories being functional

### Parallel Opportunities

- T001 and T003/T004 (Model structure) can be developed in parallel
- T007 and T008 (Tests) can start together
- Phase 3 (CRUD) and Phase 4 (Integration) can proceed semi-independently once the API contract is established

---

## Implementation Strategy

### MVP First (User Story 1 & 2)

1. Establish the database table.
2. Build the CRUD API and Settings page.
3. Integrate the selection into the draft editor.
4. **STOP and VALIDATE**: Verify end-to-end subject generation with a custom preset.

### Incremental Delivery

1. CRUD Foundation -> Draft Editor Integration -> Defaults -> Polish.
2. Each increment provides a testable piece of the audience-specific AI capability.

---

## Notes

- Use the `${contentList}` keyword exactly as specified.
- Enforce mandatory preset selection in the UI before calling the AI API.
- All backend changes MUST be covered by integration tests (TDD).
