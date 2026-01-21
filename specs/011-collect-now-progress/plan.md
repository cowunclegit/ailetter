# Implementation Plan: Collect Now & Progress

**Branch**: `011-collect-now-progress` | **Date**: 2026-01-14 | **Spec**: [specs/011-collect-now-progress/spec.md](../specs/011-collect-now-progress/spec.md)
**Input**: Feature specification from `/specs/011-collect-now-progress/spec.md`

## Summary

Implement a "Collect NOW" button in the admin dashboard that triggers the existing backend collection process. The UI will poll the collection status to display a loading indicator and automatically refresh the trend list upon completion.

## Technical Context

**Language/Version**: Node.js (Backend), React.js (Frontend)
**Primary Dependencies**: Express, Axios, MUI
**Storage**: SQLite3
**Testing**: Jest (Backend/Frontend)
**Target Platform**: Web (Browser + Server)
**Project Type**: Web application (Frontend + Backend)
**Performance Goals**: Response within 500ms for starting collection
**Constraints**: Prevent concurrent manual collections
**Scale/Scope**: Admin dashboard feature

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Tech Stack**: Uses React.js and Node.js. (Pass)
- **TDD**: Tests will be written first for the new frontend component logic. (Pass)
- **Code Quality**: Will follow standard linting. (Pass)

## Project Structure

### Documentation (this feature)

```text
specs/011-collect-now-progress/
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
│   │   └── trends.js    # Existing endpoint to be utilized
│   └── jobs/
│       └── collectionJob.js # Shared instance source
tests/
├── integration/
└── unit/

frontend/
├── src/
│   ├── components/
│   │   └── CollectButton.jsx # New component
│   ├── pages/
│   │   └── Dashboard.jsx     # Integration point
│   └── services/
│       └── api.js            # API client update
└── tests/
```

**Structure Decision**: Standard React/Node app structure.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| (None) | | |