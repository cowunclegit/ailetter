# Implementation Plan: Update Sources

**Branch**: `013-update-sources` | **Date**: 2026-01-19 | **Spec**: [specs/013-update-sources/spec.md](spec.md)
**Input**: Feature specification from `/specs/013-update-sources/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

This feature implements the ability for administrators to edit existing Source details (Name, Category, URL/Channel ID) while strictly preventing modification of the Source Type. It involves adding an update endpoint to the backend API, extending the Source model with update logic, and enhancing the frontend Source management UI with an edit form/modal that enforces the read-only constraint on the Type field.

## Technical Context

**Language/Version**: Node.js (Backend), React.js (Frontend)
**Primary Dependencies**: Express, SQLite3 (Backend); MUI, Axios (Frontend)
**Storage**: SQLite3 (Existing)
**Testing**: Jest (Backend & Frontend)
**Target Platform**: Web Application
**Project Type**: Full-stack Web (Node.js + React)
**Performance Goals**: Update operation should complete < 200ms
**Constraints**: Source Type must remain immutable to preserve processing integrity
**Scale/Scope**: Affects Source management module only

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **I. Tech Stack**: Uses React.js for frontend and Node.js for backend.
- [x] **II. Test-Driven Development (TDD)**: Plan includes testing requirements (Jest).

## Project Structure

### Documentation (this feature)

```text
specs/013-update-sources/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
backend/
├── src/
│   ├── models/           # Update SourceModel with update method
│   ├── api/              # Add PUT /api/sources/:id endpoint
│   └── services/         # Update service logic if separated
└── tests/
    ├── integration/      # API tests for source update
    └── unit/             # Model/Service tests

frontend/
├── src/
│   ├── api/              # Add update method to source API client
│   ├── components/       # Update SourceForm to handle editing state
│   ├── pages/            # Update Sources page to handle edit action
│   └── utils/            # Validation helpers
└── tests/                # Component and integration tests
```

**Structure Decision**: Standard full-stack web application structure (Backend: Node.js/Express, Frontend: React/MUI), consistent with existing patterns.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None      | N/A        | N/A                                 |
