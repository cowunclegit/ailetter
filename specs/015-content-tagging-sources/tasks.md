# Implementation Tasks: Content Tagging and Source Deduplication

**Feature**: 015-content-tagging-sources
**Spec**: [spec.md](spec.md)
**Plan**: [plan.md](plan.md)

## Phase 1: Setup
*Goal: Initialize database schema and project structure.*

- [x] T001 Create migration for `source_categories` junction table in backend/src/db/migrations/015_create_source_categories.js
- [x] T002 Create migration for `trend_item_tags` junction table in backend/src/db/migrations/015_create_trend_item_tags.js
- [x] T003 Add `is_deleted` column to `categories` table in backend/src/db/migrations/015_add_is_deleted_to_categories.js
- [x] T004 Run migrations and verify table structure in backend/src/db/index.js

## Phase 2: Foundational
*Goal: Update models to support many-to-many relationships.*

- [x] T005 [P] Implement unit tests for `SourceModel` many-to-many category support in backend/tests/unit/sourceModel.test.js
- [x] T006 Update `SourceModel` to support multiple categories per source in backend/src/models/sourceModel.js
- [x] T007 [P] Implement unit tests for `TrendItemModel` tagging support in backend/tests/unit/trendItemModel.test.js
- [x] T008 Update `TrendItemModel` to support multiple tags and filtering by `categoryIds` in backend/src/models/trendItemModel.js

## Phase 3: User Story 1 - Categorized Content Collection
*Goal: Automatically tag items during ingestion.*
*Priority: P1*

- [x] T009 [P] [US1] Create unit tests for `CollectionService` category mapping in backend/tests/unit/collectionService.test.js
- [x] T010 [US1] Update `CollectionService` to map sources to their categories before saving trend items in backend/src/services/collectionService.js
- [x] T011 [US1] Ensure `TrendItemModel.create` applies all relevant category tags in backend/src/models/trendItemModel.js

## Phase 4: User Story 2 - Source Deduplication and Multi-Tagging
*Goal: Prevent redundant network requests and duplicate DB entries.*
*Priority: P1*

- [x] T012 [P] [US2] Create integration tests for unique URL deduplication in backend/tests/integration/deduplication.test.js
- [x] T013 [US2] Refactor `CollectionService.collectAll` to group sources by unique URL before fetching in backend/src/services/collectionService.js
- [x] T014 [US2] Implement metadata inheritance from the first encountered source for duplicate URLs in backend/src/services/collectionService.js
- [x] T015 [US2] Verify `TrendItemModel` handles unique URL constraints and junction table updates correctly in backend/src/models/trendItemModel.js

## Phase 5: User Story 3 - Category-Based Filtering
*Goal: Multi-select filtering on the Curator Dashboard.*
*Priority: P2*

- [x] T016 [P] [US3] Update frontend API client to support `categoryIds` query parameter in frontend/src/api/trendsApi.js
- [x] T017 [US3] Create `TagFilter` component using MUI Autocomplete for multi-selection in frontend/src/components/features/TagFilter.jsx
- [x] T018 [US3] Create unit tests for `TagFilter` component in frontend/src/tests/components/TagFilter.test.js
- [x] T019 [US3] Integrate `TagFilter` into `Dashboard` page and handle multi-select filtering logic in frontend/src/pages/Dashboard.jsx
- [x] T020 [US3] Update `TrendCard` to display category tags for each item in frontend/src/components/features/TrendCard.jsx

## Phase 6: Polish & Cross-Cutting
*Goal: Final UI refinements and edge case handling.*

- [x] T021 Handle "Uncategorized" default tag for items without categories in backend/src/services/collectionService.js
- [x] T022 Implement cascading soft-delete logic for categories in backend/src/models/categoryModel.js
- [x] T023 Verify dashboard filtering performance (< 500ms) and default "All Content" view in frontend/src/pages/Dashboard.jsx
- [x] T024 Ensure date headers remain sticky and layout is responsive with new tags in frontend/src/pages/Dashboard.jsx

## Dependencies

- Phase 2 depends on Phase 1 (Schema must exist).
- Phase 3 & 4 depend on Phase 2 (Models must support tags/dedupe).
- Phase 5 depends on Phase 2 & 3 (API must return tags for UI).

## Parallel Execution Opportunities

- T005, T007 (Unit tests) can be developed in parallel.
- T012 (Integration tests) can be started as soon as Phase 2 is complete.
- T016, T017, T018 (Frontend) can be developed in parallel with Backend Phase 3/4.