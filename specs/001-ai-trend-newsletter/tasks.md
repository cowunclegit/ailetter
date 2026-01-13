---

description: "Task list for AI Trend Weekly Newsletter"
---

# Tasks: AI Trend Weekly Newsletter

**Input**: Design documents from `/specs/001-ai-trend-newsletter/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/api.yaml

**Tests**: MANDATORY. Per Constitution Principle II, all features must be tested. Tests must be written first (TDD).

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Web app**: `backend/src/`, `frontend/src/`
- **Tests**: `backend/tests/`, `frontend/tests/`

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Create project structure (frontend/backend directories) per plan in `backend/` and `frontend/`
- [x] T002 Initialize Node.js backend with `express`, `sqlite3`, `rss-parser`, `googleapis`, `openai`, `node-cron`, `@sendgrid/mail` in `backend/package.json`
- [x] T003 Initialize React frontend with `vite` or `create-react-app` in `frontend/package.json`
- [x] T004 [P] Configure Jest and Supertest for backend testing in `backend/jest.config.js`
- [x] T005 [P] Configure ESLint and Prettier for both frontend and backend in `.eslintrc.js` and `.prettierrc`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T006 Setup SQLite database connection and initialization logic in `backend/src/db/index.js`
- [x] T007 Create database schema migration script for Source, TrendItem, Newsletter, Subscriber tables in `backend/src/db/schema.sql`
- [x] T008 [P] Implement shared error handling middleware in `backend/src/middleware/errorHandler.js`
- [x] T009 [P] Setup environment variable configuration (dotenv) in `backend/src/config/env.js`
- [x] T010 [P] Setup basic Express server with API routing structure in `backend/src/server.js`

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Trend Collection & Review (Priority: P1) 🎯 MVP

**Goal**: Automatically collect AI trends from RSS/YouTube, filter with AI, and present to curator.

**Independent Test**: Trigger collection job, verify items in DB (flagged by AI), view list in Admin UI.

### Tests for User Story 1 (MANDATORY) ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [x] T011 [P] [US1] Unit test for RSS parsing service in `backend/tests/unit/rssService.test.js`
- [x] T012 [P] [US1] Unit test for AI curation logic in `backend/tests/unit/aiService.test.js`
- [x] T013 [P] [US1] Integration test for collection job flow in `backend/tests/integration/collectionJob.test.js`
- [x] T014 [P] [US1] API test for `GET /trends` endpoint in `backend/tests/api/trends.test.js`

### Implementation for User Story 1

- [x] T015 [P] [US1] Create `Source` and `TrendItem` models/repositories in `backend/src/models/sourceModel.js` and `backend/src/models/trendItemModel.js`
- [x] T016 [US1] Implement RSS/YouTube fetching service in `backend/src/services/collectionService.js`
- [x] T017 [US1] Implement OpenAI integration for trend ranking in `backend/src/services/aiService.js`
- [x] T018 [US1] Create background job for weekly collection in `backend/src/jobs/collectionJob.js`
- [x] T019 [P] [US1] Implement `GET /trends` API endpoint in `backend/src/api/trends.js`
- [x] T020 [P] [US1] Frontend: Create Trend List component in `frontend/src/components/TrendList.jsx`
- [x] T021 [US1] Frontend: Create Dashboard page to view trends in `frontend/src/pages/Dashboard.jsx`

**Checkpoint**: At this point, collection is automated and visible.

---

## Phase 4: User Story 2 - Selection & Curation (Priority: P1)

**Goal**: Select specific items and create a newsletter draft.

**Independent Test**: Select items in UI, create draft, verify Newsletter record created in DB.

### Tests for User Story 2 (MANDATORY) ⚠️

- [x] T022 [P] [US2] API test for `POST /newsletters` (create draft) in `backend/tests/api/newsletters.test.js`
- [x] T023 [P] [US2] Unit test for Newsletter model creation in `backend/tests/unit/newsletterModel.test.js`

### Implementation for User Story 2

- [x] T024 [P] [US2] Create `Newsletter` and `NewsletterItem` models in `backend/src/models/newsletterModel.js`
- [x] T025 [US2] Implement draft creation service logic in `backend/src/services/newsletterService.js`
- [x] T026 [P] [US2] Implement `POST /newsletters` API endpoint in `backend/src/api/newsletters.js`
- [x] T027 [US2] Frontend: Add selection checkboxes to Trend List in `frontend/src/components/TrendList.jsx`
- [x] T028 [US2] Frontend: Implement "Create Draft" button and flow in `frontend/src/pages/Dashboard.jsx`

**Checkpoint**: Curator can create drafts from collected items.

---

## Phase 5: User Story 3 - Newsletter Distribution (Priority: P1)

**Goal**: Send curated newsletter to subscribers.

**Independent Test**: Click send, verify email sent via SendGrid mock/logs.

### Tests for User Story 3 (MANDATORY) ⚠️

- [x] T029 [P] [US3] Unit test for email generation (HTML) in `backend/tests/unit/emailTemplate.test.js`
- [x] T030 [P] [US3] API test for `POST /newsletters/:id/send` in `backend/tests/api/sendNewsletter.test.js`

### Implementation for User Story 3

- [x] T031 [P] [US3] Create `Subscriber` model in `backend/src/models/subscriberModel.js`
- [x] T032 [US3] Implement SendGrid email service wrapper in `backend/src/services/emailService.js`
- [x] T033 [US3] Create HTML email template generator in `backend/src/utils/emailTemplate.js`
- [x] T034 [P] [US3] Implement `POST /newsletters/:id/send` endpoint in `backend/src/api/newsletters.js`
- [x] T035 [P] [US3] Implement public `POST /subscribers` (signup) and `POST /subscribers/unsubscribe` endpoints in `backend/src/api/subscribers.js`
- [x] T035a [US3] Frontend: Add "Send Newsletter" action to Draft view in `frontend/src/pages/Drafts.jsx`
- [x] T035b [P] [US3] Frontend: Create simple Public Subscribe/Unsubscribe pages in `frontend/src/pages/Public.jsx`

**Checkpoint**: Newsletter cycle is complete (Collect -> Curate -> Send).

---

## Phase 6: User Story 0 - Source Management (Priority: P2)

**Goal**: Manage sources via UI.

**Independent Test**: Add/Remove source in UI, verify DB updates.

### Tests for User Story 0 (MANDATORY) ⚠️

- [x] T036 [P] [US0] API tests for `GET/POST/DELETE /sources` in `backend/tests/api/sources.test.js`

### Implementation for User Story 0

- [x] T037 [P] [US0] Implement Source management API endpoints in `backend/src/api/sources.js`
- [x] T038 [P] [US0] Frontend: Create Source Management page in `frontend/src/pages/Sources.jsx`
- [x] T039 [US0] Frontend: Implement Add/Remove Source forms in `frontend/src/components/SourceForm.jsx`

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T040 [P] Update `quickstart.md` with final API usage details
- [x] T041 Code cleanup: Remove hardcoded secrets, ensure environment vars used everywhere
- [x] T042 [P] Add basic authentication for Admin UI routes (if not already covered by Foundational)
- [x] T043 Run full integration test suite to ensure all stories work together

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies.
- **Foundational (Phase 2)**: Depends on Phase 1. Blocks all stories.
- **User Story 1 (P1)**: Depends on Phase 2.
- **User Story 2 (P1)**: Depends on Phase 2. Logically follows US1 (needs items to curate), but models can be built in parallel.
- **User Story 3 (P1)**: Depends on Phase 2. Logically follows US2 (needs draft to send).
- **User Story 0 (P2)**: Depends on Phase 2. Can run parallel to US1/2/3.

### Parallel Opportunities

- Frontend and Backend tasks within each story are largely independent once contracts are defined.
- US1 (Collection) and US0 (Source Management) can be developed in parallel by different devs.

---

## Parallel Example: User Story 1

```bash
# Launch all tests for User Story 1 together:
Task: "Unit test for RSS parsing service in backend/tests/unit/rssService.test.js"
Task: "API test for GET /trends endpoint in backend/tests/api/trends.test.js"

# Launch Frontend and Backend implementation together:
Task: "Implement GET /trends API endpoint in backend/src/api/trends.js"
Task: "Frontend: Create Trend List component in frontend/src/components/TrendList.jsx"
```
