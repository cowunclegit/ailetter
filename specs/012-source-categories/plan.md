# Implementation Plan: Source Categories

**Branch**: `012-source-categories` | **Date**: 2026-01-19 | **Spec**: [specs/012-source-categories/spec.md](spec.md)
**Input**: Feature specification from `/specs/012-source-categories/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

This feature adds category management to the system, allowing administrators to define topics like "AI Development" or "UX" and assign them to sources. It involves creating a dedicated management page for categories (CRUD), updating the Source entity to link to a category, and enabling filtering by category in the source list. The implementation will span both the Node.js backend (new API endpoints, database schema update) and the React frontend (management UI, source form updates).

## Technical Context

**Language/Version**: Node.js (Backend), React.js (Frontend)
**Primary Dependencies**: Express, SQLite3 (Backend); MUI, Axios (Frontend)
**Storage**: SQLite3
**Testing**: Jest (Backend & Frontend)
**Target Platform**: Web Application
**Project Type**: Full-stack Web (Node.js + React)
**Performance Goals**: Source list load < 1s with category data
**Constraints**: Standard web responsiveness
**Scale/Scope**: ~10-20 categories initially, applied to all sources

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **I. Tech Stack**: Uses React.js for frontend and Node.js for backend.
- [x] **II. Test-Driven Development (TDD)**: Plan includes testing requirements (Jest).

## Project Structure

### Documentation (this feature)

```text
specs/012-source-categories/
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
│   ├── models/           # Update Source model, add Category model
│   ├── db/               # Migration for categories table & foreign key
│   ├── api/              # New categories.js route, update sources.js
│   └── services/         # Category service logic
└── tests/
    ├── integration/      # API tests for categories
    └── unit/             # Model/Service tests

frontend/
├── src/
│   ├── api/              # Add category API client methods
│   ├── components/       # Category selection dropdown
│   ├── pages/            # New CategoryManagement page
│   └── utils/            # Sorting helpers if needed
└── tests/                # Component and integration tests
```

**Structure Decision**: Standard full-stack web application structure (Backend: Node.js/Express, Frontend: React/MUI), consistent with existing patterns.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None      | N/A        | N/A                                 |
