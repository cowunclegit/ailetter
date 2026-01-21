# Implementation Tasks: Source Categories

**Feature**: 012-source-categories
**Spec**: [spec.md](spec.md)
**Plan**: [plan.md](plan.md)

## Phase 1: Setup
*Goal: Initialize project structure and database schema.*

- [x] T001 Create feature directory structure for specs (already done) in specs/012-source-categories/
- [x] T002 [P] Create migration file for `source_categories` table and `sources.category_id` column in backend/src/db/migrate_012_source_categories.js
- [x] T003 [P] Create Category model definition in backend/src/models/categoryModel.js

## Phase 2: Foundational
*Goal: Core backend logic for categories.*

- [x] T004 [P] Implement `CategoryService` with CRUD operations in backend/src/services/categoryService.js
- [x] T005 [P] Create API route handler for categories in backend/src/api/categories.js
- [x] T006 Register categories route in main server file in backend/src/server.js
- [x] T007 [P] Create frontend API client for category endpoints in frontend/src/api/categoriesApi.js

## Phase 3: User Story 1 - Manage Source Categories
*Goal: Admin can create, update, and delete categories via a dedicated page.*
*Priority: P1*

- [x] T008 [US1] Create `CategoryList` component to display categories in frontend/src/components/CategoryList.jsx
- [x] T009 [US1] Create `CategoryForm` component for adding/editing categories in frontend/src/components/CategoryForm.jsx
- [x] T010 [US1] Create `CategoryManagement` page integrating list and form in frontend/src/pages/CategoryManagement.jsx
- [x] T011 [US1] Add "Categories" link to the main navigation/sidebar in frontend/src/components/Sidebar.jsx (or equivalent)
- [x] T012 [US1] Define `/categories` route in frontend/src/App.jsx

## Phase 4: User Story 2 - Assign Category to Source
*Goal: Admin can assign a category when adding/editing a source and filter the list.*
*Priority: P1*

- [x] T013 [US2] Update `Source` model/service to handle `category_id` in backend/src/models/sourceModel.js (and service)
- [x] T014 [US2] Update `SourceForm` component to include Category dropdown in frontend/src/components/SourceForm.jsx
- [x] T015 [US2] Update `SourceList` component to display assigned category in frontend/src/components/SourceList.jsx
- [x] T016 [US2] Implement category filtering logic in `SourceList` component in frontend/src/components/SourceList.jsx
- [x] T017 [US2] Update `sources` API to support filtering by category_id in backend/src/api/sources.js

## Phase 5: Polish & Cross-Cutting
*Goal: Final UI polish and edge case handling.*

- [x] T018 Ensure category list is sorted alphabetically in backend/src/services/categoryService.js
- [x] T019 Verify correct behavior when deleting a category (sources set to null) via manual test or integration test check
- [x] T020 Review UI for responsiveness and consistency with existing theme in frontend/src/pages/CategoryManagement.jsx

## Dependencies

1. **Setup & Foundational** (T001-T007) MUST be completed first.
2. **User Story 1** (T008-T012) depends on Backend API (T005).
3. **User Story 2** (T013-T017) depends on Category Model (T003) and API (T005) availability.

## Parallel Execution Opportunities

- Backend (T002-T005) and Frontend (T007, T008-T010) tasks can largely be developed in parallel once the API contract is agreed upon.
- User Story 1 and User Story 2 frontend work can be split between developers if backend support is ready.
