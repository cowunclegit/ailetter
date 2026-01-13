# Implementation Plan: Dashboard Week-Based Curation and Collection

**Branch**: `004-dashboard-week-curation` | **Date**: 2026-01-13 | **Spec**: [specs/004-dashboard-week-curation/spec.md](spec.md)

## Summary
Replace the generic trend filter with a dedicated 12-week selector. Update the "Collect Now" feature to be context-aware, allowing curators to trigger data collection for specific past weeks concurrently. This involves frontend UI updates, week-based date utility creation, and backend collection service enhancements to support date ranges and per-week locking.

## Technical Context
**Language/Version**: Node.js (Backend), React.js (Frontend)
**Primary Dependencies**: Express, Axios, MUI, rss-parser, googleapis
**Storage**: SQLite3
**Testing**: Jest (Unit & Integration)
**Performance Goals**: <500ms for week switching (SC-001)
**Constraints**: 12-week history limit, Monday-start ISO weeks.

## Constitution Check
- [x] **Tech Stack**: Uses React.js and Node.js.
- [x] **TDD**: Tests for week calculation, filtered collection, and concurrent locking will be written first.

## Project Structure

### Documentation (this feature)

```text
specs/004-dashboard-week-curation/
├── plan.md              # This file
├── research.md          # Week arithmetic and locking strategies
├── data-model.md        # No schema changes, but logic definitions
├── quickstart.md        # Integration of week-based collection
└── contracts/
    └── api.yaml         # Updated /trends and /trends/collect
```

### Source Code
```text
backend/
├── src/
│   ├── api/
│   │   └── trends.js    # Update /collect to accept week param
│   ├── services/
│   │   └── collectionService.js # Per-week locking and date filters
│   └── jobs/
│       └── collectionJob.js # Update runCollection signature
└── tests/
    ├── integration/
    └── unit/

frontend/
├── src/
│   ├── components/
│   │   └── features/
│   │       └── WeeklyFilter.jsx # Update to handle 12-week logic
│   ├── utils/
│   │   └── dateUtils.js # Monday-start ISO week logic
│   └── pages/
│       └── Dashboard.jsx # Context-aware Collect Now
└── tests/
```

**Structure Decision**: Web application structure (Option 2) is maintained.