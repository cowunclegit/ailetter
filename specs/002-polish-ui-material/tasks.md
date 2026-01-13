---

description: "Task list for UI Polish & Material Design"
---

# Tasks: UI Polish & Material Design

**Input**: Design documents from `/specs/002-polish-ui-material/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/ui-components.yaml

**Tests**: MANDATORY. Per Constitution Principle II, all features must be tested. Tests must be written first (TDD) for components and logic.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Frontend**: `frontend/src/`
- **Tests**: `frontend/tests/` (or `frontend/src/__tests__` / `frontend/src/**/*.test.jsx` depending on setup)

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and dependency installation

- [x] T001 Install MUI v5 dependencies (`@mui/material`, `@emotion/react`, `@emotion/styled`, `@mui/icons-material`) in `frontend/package.json`
- [x] T002 Configure basic MUI Theme (System Default) in `frontend/src/theme/index.js`
- [x] T003 Wrap App with `ThemeProvider` and `CssBaseline` in `frontend/src/App.jsx`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core UI components that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T004 [P] Create `FeedbackContext` and `FeedbackProvider` for global snackbars in `frontend/src/contexts/FeedbackContext.jsx`
- [x] T005 [P] Create reusable `FeedbackSnackbar` component in `frontend/src/components/common/FeedbackSnackbar.jsx`
- [x] T006 Test `FeedbackSnackbar` component in `frontend/src/components/common/FeedbackSnackbar.test.jsx`
- [x] T007 Create `Layout` component with `AppBar` (Top Navigation) in `frontend/src/components/layout/Layout.jsx`
- [x] T008 Test `Layout` component rendering in `frontend/src/components/layout/Layout.test.jsx`
- [x] T009 Update `App.jsx` to use the new `Layout` and `FeedbackProvider`
- [x] T010 [P] Create `PageHeader` component for consistent page titles/actions in `frontend/src/components/common/PageHeader.jsx`

**Checkpoint**: Application has a consistent shell (Header, Theme, Feedback system).

---

## Phase 3: User Story 1 - Public Subscriber Experience (Priority: P1)

**Goal**: Polish public-facing Subscribe and Unsubscribe pages.

**Independent Test**: Visit public pages on mobile/desktop, verify responsive layout and styled form interactions.

### Tests for User Story 1 (MANDATORY) ⚠️

- [x] T011 [P] [US1] Create test for `PublicSubscribe` page rendering and form feedback in `frontend/src/pages/PublicSubscribe.test.jsx`

### Implementation for User Story 1

- [x] T012 [P] [US1] Refactor `Public.jsx` (Subscribe) to use MUI components (`Card`, `TextField`, `Button`, `Container`) in `frontend/src/pages/Public.jsx`
- [x] T013 [US1] Integrate `FeedbackContext` for success/error toasts in `frontend/src/pages/Public.jsx`
- [x] T014 [P] [US1] Ensure responsiveness (mobile stacking) for Public pages in `frontend/src/pages/Public.jsx`

**Checkpoint**: Public pages are visually polished and responsive.

---

## Phase 4: User Story 2 - Curator Dashboard Redesign (Priority: P1)

**Goal**: Redesign Dashboard with responsive Grid of Cards.

**Independent Test**: View Dashboard, verify card grid layout, select items, create draft with visual feedback.

### Tests for User Story 2 (MANDATORY) ⚠️

- [x] T015 [P] [US2] Create test for `TrendCard` component props and rendering in `frontend/src/components/features/TrendCard.test.jsx`
- [x] T016 [P] [US2] Create integration test for Dashboard grid rendering in `frontend/src/pages/Dashboard.test.jsx`

### Implementation for User Story 2

- [x] T017 [US2] Create `TrendCard` component (MUI Card with actions) in `frontend/src/components/features/TrendCard.jsx`
- [x] T018 [US2] Refactor `TrendList.jsx` to use MUI `Grid` and `TrendCard` components in `frontend/src/components/TrendList.jsx`
- [x] T019 [US2] Refactor `Dashboard.jsx` to use `PageHeader` and handle actions with `FeedbackContext` in `frontend/src/pages/Dashboard.jsx`
- [x] T020 [P] [US2] Polish "Create Draft" flow with loading states (MUI `CircularProgress`) in `frontend/src/pages/Dashboard.jsx`

**Checkpoint**: Dashboard uses card grid and polished interactions.

---

## Phase 5: User Story 3 - Source Management UI (Priority: P2)

**Goal**: Style Source Management with MUI Table/List.

**Independent Test**: Manage sources (Add/Delete) using the styled interface.

### Tests for User Story 3 (MANDATORY) ⚠️

- [x] T021 [P] [US3] Create test for `SourceForm` validation and styling in `frontend/src/components/SourceForm.test.jsx`

### Implementation for User Story 3

- [x] T022 [P] [US3] Refactor `SourceForm.jsx` to use MUI `TextField` and `Button` with validation styles in `frontend/src/components/SourceForm.jsx`
- [x] T023 [US3] Refactor `Sources.jsx` list to use MUI `Table` or `List` component in `frontend/src/pages/Sources.jsx`
- [x] T024 [US3] Integrate `FeedbackContext` for Add/Delete source actions in `frontend/src/pages/Sources.jsx`

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final review and responsiveness checks

- [x] T025 [P] Verify and fix responsive layout on small screens (320px) for all pages
- [x] T026 [P] Ensure consistent error handling (try/catch -> Snackbar) across all API calls
- [x] T027 Check and normalize typography (headings, body text) across the app using Theme
- [x] T028 Run full frontend test suite to ensure no regressions

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies.
- **Foundational (Phase 2)**: Depends on Phase 1. Blocks all stories.
- **User Story 1 (P1)**: Depends on Phase 2.
- **User Story 2 (P1)**: Depends on Phase 2.
- **User Story 3 (P2)**: Depends on Phase 2. Can run parallel to US1/US2.

### Parallel Opportunities

- T004, T005, T010 (Foundational components) can be built in parallel.
- US1 (Public) and US2 (Dashboard) can be implemented in parallel after Phase 2 is done.
- T011, T015, T021 (Tests) can be written in parallel with or before implementation tasks.

---

## Parallel Example: User Story 2

```bash
# Launch tests:
Task: "Create test for TrendCard component props..." (T015)
Task: "Create integration test for Dashboard grid..." (T016)

# Launch Implementation:
Task: "Create TrendCard component..." (T017)
Task: "Refactor Dashboard.jsx..." (T019)
```
