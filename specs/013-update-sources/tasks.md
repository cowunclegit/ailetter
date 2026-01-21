# Implementation Tasks: Update Sources

**Feature**: 013-update-sources
**Spec**: [spec.md](spec.md)
**Plan**: [plan.md](plan.md)

## Phase 1: Setup
*Goal: Initialize project structure and prepare for implementation.*

- [x] T001 Create feature directory structure for specs (already done) in specs/013-update-sources/
- [x] T002 [P] Review `Source` model in backend/src/models/sourceModel.js to confirm structure for updates (validation, fields)

## Phase 2: Foundational
*Goal: Core backend logic for updating sources.*

- [x] T003 [P] Update `SourceModel` to include `update` method in backend/src/models/sourceModel.js
- [x] T004 [P] Create `PUT /api/sources/:id` endpoint in backend/src/api/sources.js
- [x] T005 [P] Implement validation middleware or logic to ignore `type` updates in backend/src/api/sources.js
- [x] T006 [P] Update frontend API client to include `update` method in frontend/src/api/sourcesApi.js (or equivalent file)

## Phase 3: User Story 1 - Edit Source Details
*Goal: Admin can edit Name, Category, and URL of existing sources.*
*Priority: P1*

- [x] T007 [US1] Update `SourceForm` to accept `initialData` or `source` prop for editing in frontend/src/components/SourceForm.jsx
- [x] T008 [US1] Update `SourceForm` to populate fields when editing in frontend/src/components/SourceForm.jsx
- [x] T009 [US1] Add "Edit" button to `SourceList` (in Sources page) in frontend/src/pages/Sources.jsx
- [x] T010 [US1] Implement edit mode state and handler in `Sources` page in frontend/src/pages/Sources.jsx
- [x] T011 [US1] Connect "Save" action in `SourceForm` to `PUT` API call in frontend/src/pages/Sources.jsx

## Phase 4: User Story 2 - Prevent Type Modification
*Goal: Source Type cannot be changed during editing.*
*Priority: P1*

- [x] T012 [US2] Update `SourceForm` to accept `isEditing` prop (or derive from data) in frontend/src/components/SourceForm.jsx
- [x] T013 [US2] Disable or make read-only the "Type" field in `SourceForm` when in edit mode in frontend/src/components/SourceForm.jsx
- [x] T014 [US2] Ensure backend `SourceModel.update` or API handler explicitly excludes `type` from update query in backend/src/models/sourceModel.js

## Phase 5: Polish & Cross-Cutting
*Goal: Final testing and UI consistency.*

- [x] T015 Verify error handling for invalid IDs or validation errors in frontend/src/pages/Sources.jsx
- [x] T016 Ensure UI updates immediately after successful edit (optimistic or re-fetch) in frontend/src/pages/Sources.jsx
- [x] T017 Verify that canceling edit mode clears the form and resets state in frontend/src/pages/Sources.jsx

## Dependencies

1. **Setup & Foundational** (T001-T006) MUST be completed first.
2. **User Story 1** (T007-T011) depends on Backend API (T004) and Frontend API Client (T006).
3. **User Story 2** (T012-T014) enhances User Story 1 components.

## Parallel Execution Opportunities

- Backend (T003-T005) and Frontend (T006-T008) tasks can largely be developed in parallel.
- User Story 1 and User Story 2 frontend work can be combined or split.
