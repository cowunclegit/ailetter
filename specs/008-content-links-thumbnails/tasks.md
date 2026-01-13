# Tasks: Content Links and Visual Thumbnails

**Input**: Design documents from `/specs/008-content-links-thumbnails/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/api.yaml

**Tests**: MANDATORY (Constitution Principle II). Red-Green-Refactor cycle required.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)

---

## Phase 1: Setup

**Purpose**: Initialize feature environment and install dependencies.

- [x] T001 Verify active branch is `008-content-links-thumbnails` and `GEMINI.md` reflects current technologies
- [x] T002 [P] Baseline test run to ensure current tests pass in `backend/` and `frontend/`
- [x] T003 [P] Install backend dependencies `metascraper`, `metascraper-image`, `axios` in `backend/package.json`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Database schema updates and utility setup.

- [x] T004 [P] Update `backend/src/db/schema.sql` to add `thumbnail_url` column to `trend_items` table
- [x] T005 Create migration script in `backend/src/db/migrate.js` to add `thumbnail_url` to existing databases
- [x] T006 [P] Update `TrendItemModel.create` in `backend/src/models/trendItemModel.js` to persist `thumbnail_url`

---

## Phase 3: User Story 1 & 2 - Content Links and Type Indicators (Priority: P1/P2)

**Goal**: Make titles clickable and identify YouTube content.

**Independent Test**: Navigate to the Dashboard and verify titles open the original URL in a new tab. Verify YouTube items show an indicator.

### Implementation for Links and Indicators

- [x] T007 [US1] Wrap titles in `TrendCard.jsx` with a link leading to `original_url` in `frontend/src/components/features/TrendCard.jsx`
- [x] T008 [US1] Update `backend/src/utils/newsletter.ejs` to make trend item titles clickable links
- [x] T009 [US2] Implement a YouTube icon/badge in `TrendCard.jsx` for items where source type is 'youtube' in `frontend/src/components/features/TrendCard.jsx`

---

## Phase 4: User Story 3 - Visual Enrichment (YouTube Thumbnails) (Priority: P2)

**Goal**: Extract and display thumbnails for YouTube items.

**Independent Test**: Trigger a YouTube collection and verify the `thumbnail_url` is saved and displayed on the card.

### Tests for YouTube Thumbnails

- [x] T010 [P] [US3] Unit test for `fetchYoutube` ensuring it extracts high-res thumbnail URL in `backend/tests/unit/rssService.test.js` (or similar unit test file)

### Implementation for YouTube Thumbnails

- [x] T011 [US3] Update `CollectionService.fetchYoutube` to extract `snippet.thumbnails.high.url` in `backend/src/services/collectionService.js`
- [x] T012 [US3] Update `TrendCard.jsx` to render the thumbnail using MUI `CardMedia` in `frontend/src/components/features/TrendCard.jsx`

---

## Phase 5: User Story 3 - Visual Enrichment (RSS Thumbnails) (Priority: P2)

**Goal**: Scrape OpenGraph images for RSS items during collection.

**Independent Test**: Trigger an RSS collection and verify article thumbnails are extracted from the source and displayed.

### Tests for RSS Scraping

- [x] T013 [P] [US3] Unit test for RSS thumbnail extraction logic in `backend/tests/unit/rssService.test.js`

### Implementation for RSS Scraping

- [x] T014 [US3] Implement `extractThumbnail` helper using `metascraper` in `backend/src/services/collectionService.js`
- [x] T015 [US3] Update `CollectionService.fetchRss` to call `extractThumbnail` for each item during the collection loop in `backend/src/services/collectionService.js`

---

## Phase 6: Polish & Cross-Cutting Concerns

- [x] T016 [P] Ensure SC-005: Dashboard load time increase is minimal (<200ms) with multiple images
- [x] T017 Implement image loading fallbacks in `TrendCard.jsx` using a standard MUI Newspaper icon when `thumbnail_url` is missing or fails to load
- [x] T018 Final test suite execution and cleanup of temporary test data