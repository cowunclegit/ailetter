# Implementation Plan: Dashboard Content List Reset

**Branch**: `009-dashboard-reset-list` | **Date**: 2026-01-14 | **Spec**: [specs/009-dashboard-reset-list/spec.md](spec.md)
**Input**: Feature specification from `/specs/009-dashboard-reset-list/spec.md`

## Summary
Implement a "Reset" feature for the dashboard that allows curators to clear the current newsletter draft and reset all view filters (search, date range) to their default state. This involves a new backend endpoint to uncheck all items and a frontend update to include the reset action with a confirmation dialog.

## Technical Context

**Language/Version**: Node.js (Backend), React.js (Frontend)
**Primary Dependencies**: `@mui/material` (Frontend UI), `axios` (API Client), `express` (Backend API)
**Storage**: SQLite3 (Existing)
**Testing**: Jest (Unit & Integration)
**Target Platform**: Web Browser
**Project Type**: Web application
**Performance Goals**: UI update < 200ms
**Constraints**: Must use existing `newsletter_items` table structure.
**Scale/Scope**: Impacts single active draft.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **I. Tech Stack**: Uses React.js and Node.js.
- [x] **II. TDD**: Mandatory. Tests will be written for the new endpoint and UI interaction.

## Project Structure

### Documentation (this feature)

```text
specs/009-dashboard-reset-list/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
└── tasks.md             # Phase 2 output
```

### Source Code (repository root)

```text
backend/
├── src/
│   ├── api/
│   │   └── newsletters.js    # Add POST /active-draft/clear endpoint
│   ├── services/
│   │   └── newsletterService.js # Add clearDraft logic
│   └── app.js
└── tests/
    ├── api/
    │   └── newsletters.test.js # Test clear endpoint
    └── services/
        └── newsletterService.test.js # Test service logic

frontend/
├── src/
│   ├── pages/
│   │   └── Dashboard.jsx     # Add Reset button and handler
│   ├── components/
│   │   └── features/
│   │       └── ResetDialog.jsx # (Optional) Confirmation component
│   └── api/
│       └── newsletterApi.js  # Add clearDraft function
└── tests/
    └── pages/
        └── Dashboard.test.jsx # Test reset flow
```

**Structure Decision**: Web application structure (Option 2) is maintained.