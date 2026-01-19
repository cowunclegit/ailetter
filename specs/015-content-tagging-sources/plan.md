# Implementation Plan: Content Tagging and Source Deduplication

**Branch**: `015-content-tagging-sources` | **Date**: 2026-01-19 | **Spec**: [specs/015-content-tagging-sources/spec.md](spec.md)
**Input**: Feature specification from `/specs/015-content-tagging-sources/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

This feature updates the content collection process to tag items with categories derived from their sources. It implements source deduplication by unique URL to prevent redundant network requests and database entries. The dashboard is enhanced with multi-select category filtering to allow curators to focus on specific topics.

## Technical Context

**Language/Version**: Node.js (Backend), React.js (Frontend)
**Primary Dependencies**: Express, SQLite3 (Existing), rss-parser, googleapis, axios, MUI (Existing)
**Storage**: SQLite3 (Existing)
**Testing**: Jest (Existing)
**Target Platform**: Web
**Project Type**: Web application (Frontend + Backend)
**Performance Goals**: Dashboard filtering < 500ms, 0% duplication for identical URLs.
**Constraints**: Absolute string match for URL deduplication, auto-only tagging at ingestion.
**Scale/Scope**: Collection job logic, database schema (Source-Category and TrendItem-Tag relationships), and Dashboard UI.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **I. Tech Stack**: Uses React.js for frontend and Node.js for backend.
- [x] **II. Test-Driven Development (TDD)**: All tasks will follow the Red-Green-Refactor cycle.

## Project Structure

### Documentation (this feature)

```text
specs/015-content-tagging-sources/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.quickstart command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
backend/
├── src/
│   ├── api/              # Update trends.js for category filtering
│   ├── models/           # Update SourceModel, TrendItemModel for tagging
│   ├── services/         # Update collectionService.js for deduplication/tagging
│   └── db/               # Migration for Source-Category & TrendItem-Tag tables
└── tests/
    ├── integration/      # Test deduplication and filtering
    └── unit/             # Model and service tests

frontend/
├── src/
│   ├── api/              # Update trendsApi.js for filtering
│   ├── components/       # New TagFilter, Tag display components
│   └── pages/            # Update Dashboard.jsx for multi-select filtering
└── tests/
```

**Structure Decision**: Web application structure with separate `backend` and `frontend` directories, following the established project pattern.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None      | N/A        | N/A                                 |