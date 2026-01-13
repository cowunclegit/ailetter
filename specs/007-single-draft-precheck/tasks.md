# Tasks: Single Draft Constraint and Dashboard Pre-check

**Input**: Design documents from `/specs/007-single-draft-precheck/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/api.yaml

**Tests**: MANDATORY (Constitution Principle II). Red-Green-Refactor cycle required.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)

---

## Phase 1: Setup

**Purpose**: Initialize feature environment and baseline checks.

- [ ] T001 Verify active branch is `007-single-draft-precheck` and `GEMINI.md` reflects current technologies
- [ ] T002 [P] Baseline test run to ensure current tests pass in `backend/` and `frontend/`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Backend logic updates required for draft management.

- [x] T003 Implement atomic overwrite logic in `backend/src/models/newsletterModel.js` using a database transaction
- [x] T004 [P] Implement `NewsletterModel.getActiveDraft` to fetch the single record with `status = 'draft'` in `backend/src/models/newsletterModel.js`

---

## Phase 3: User Story 1 - Single Active Draft Constraint (Priority: P1)

**Goal**: Ensure only one active draft exists by replacing any previous draft upon creation.

- [x] T005 [P] [US1] Unit test for overwrite logic in `backend/tests/unit/newsletterModel.test.js`
- [x] T006 [US1] Integration test for draft overwrite in `backend/tests/api/newsletters.test.js`
- [x] T007 [US1] Update `NewsletterModel.createDraft` to delete existing drafts within the creation transaction in `backend/src/models/newsletterModel.js`

---

## Phase 4: User Story 2 - Dashboard Draft Item Visibility (Priority: P2)

**Goal**: Automatically pre-check items on the dashboard if an active draft exists.

- [x] T008 [P] [US2] Integration test for `GET /api/newsletters/active-draft` in `backend/tests/api/newsletters.test.js`
- [x] T009 [US2] Implement `GET /api/newsletters/active-draft` endpoint in `backend/src/api/newsletters.js`
- [x] T010 [US2] Implement draft detection and state hydration logic in `frontend/src/pages/Dashboard.jsx` (useEffect hook)

---

## Phase 5: User Story 3 & FR-005 - Real-time Sync (Priority: P3)

**Goal**: Synchronize dashboard checkbox toggles immediately with the active draft.

- [x] T011 [P] [US3] Integration test for `POST /api/newsletters/active-draft/toggle-item` in `backend/tests/api/newsletters.test.js`
- [x] T012 [US3] Implement `NewsletterModel.toggleItem` to add/remove items from a draft in `backend/src/models/newsletterModel.js`
- [x] T013 [US3] Implement `POST /api/newsletters/active-draft/toggle-item` endpoint in `backend/src/api/newsletters.js`
- [x] T014 [US3] Update `handleToggleTrend` in `frontend/src/pages/Dashboard.jsx` to perform an optimistic UI update and call the sync endpoint if an active draft is detected

---

## Phase 6: Polish & Cross-Cutting Concerns

- [x] T015 [P] Ensure SC-002: Dashboard reflects active draft contents within 500ms target
- [x] T016 [P] Ensure SC-003: Checkbox synchronization completes within 300ms target
- [x] T017 Final test suite execution and cleanup of temporary test data

---

## Dependencies & Execution Order

### Phase Dependencies
1. **Setup & Foundational (Phases 1-2)**: MUST be complete first to provide the transaction logic.
2. **User Story 1 (Phase 3)**: Core constraint must be established before hydration or sync.
3. **User Story 2 (Phase 4)**: Hydration depends on the detection endpoint.
4. **User Story 3 (Phase 5)**: Sync depends on hydration state being managed.

### Parallel Opportunities
- T005 (Unit tests) and T009 (Detection API) can run in parallel.
- T008 (Integration tests) can run while frontend hydration (T010) is being prepared.

---

## Implementation Strategy
- **MVP**: Complete Phase 1-4. This ensures the "One Draft" rule is enforced and curators see their progress on the dashboard.
- **Increment**: Phase 5 adds the real-time sync, improving the curator's "quick edit" experience.
- **Stability**: Atomic transactions in T007 are critical to prevent "orphaned" newsletter items during the overwrite process.
