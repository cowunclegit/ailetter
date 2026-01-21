# Implementation Plan: Daily Curation

**Branch**: `014-daily-curation` | **Date**: 2026-01-19 | **Spec**: [specs/014-daily-curation/spec.md](spec.md)
**Input**: Feature specification from `/specs/014-daily-curation/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

This feature updates the curator dashboard to display collected content grouped by publication date (descending order) instead of a flat or weekly list. It introduces infinite scroll for loading historical data and sticky date headers for better navigation context. The implementation involves updating the backend API to support cursor-based pagination (or efficient offset) and sorting, and refactoring the frontend `TrendList` component to handle grouped rendering and scroll events.

## Technical Context

**Language/Version**: Node.js (Backend), React.js (Frontend)
**Primary Dependencies**: Express, SQLite3 (Backend); MUI, Axios, Intersection Observer API (Frontend)
**Storage**: SQLite3 (Existing)
**Testing**: Jest (Backend & Frontend)
**Target Platform**: Web Application
**Project Type**: Full-stack Web (Node.js + React)
**Performance Goals**: Dashboard load time < 1s, smooth scrolling at 60fps
**Constraints**: Sticky headers must work on mobile and desktop
**Scale/Scope**: Impacts main dashboard view, potentially high volume of trend items

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **I. Tech Stack**: Uses React.js for frontend and Node.js for backend.
- [x] **II. Test-Driven Development (TDD)**: Plan includes testing requirements (Jest).

## Project Structure

### Documentation (this feature)

```text
specs/014-daily-curation/
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
│   ├── api/              # Update trends.js for pagination/sorting
│   ├── models/           # Update TrendItemModel for efficient date querying
│   └── services/         # Update trendService.js logic
└── tests/
    ├── integration/      # API tests for paginated trends
    └── unit/             # Model tests

frontend/
├── src/
│   ├── api/              # Update trendsApi.js
│   ├── components/       # Update TrendList.jsx, add DailyGroup component
│   ├── pages/            # Update Dashboard.jsx to handle infinite scroll
│   └── hooks/            # Add useInfiniteScroll hook (if not existing)
└── tests/                # Component tests for grouped list
```

**Structure Decision**: Standard full-stack web application structure (Backend: Node.js/Express, Frontend: React/MUI), consistent with existing patterns.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None      | N/A        | N/A                                 |
