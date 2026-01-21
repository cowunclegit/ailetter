# Implementation Plan: Newsletter History Details and Actions

**Branch**: `019-newsletter-history-details` | **Date**: 2026-01-19 | **Spec**: [specs/019-newsletter-history-details/spec.md](spec.md)
**Input**: Feature specification from `/specs/019-newsletter-history-details/spec.md`

## Summary
Implement a detailed view for newsletters in the history section. This includes a new `/newsletters/:id` route in the frontend, fetching detailed data from the existing backend endpoint, and providing action buttons to return to the draft editor if the newsletter is still a draft.

## Technical Context

**Language/Version**: Node.js, React  
**Primary Dependencies**: Express, Axios, @mui/material, React Router  
**Storage**: SQLite3 (Existing)  
**Testing**: Jest, Supertest  
**Target Platform**: Web  
**Project Type**: Web application (Frontend + Backend)  
**Performance Goals**: Detail page load < 500ms  
**Constraints**: Must handle HTML rendering for intro/outro  
**Scale/Scope**: View-only for sent newsletters, Actionable for drafts

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] I. Tech Stack (React.js + Node.js): Compliant.
- [x] II. Test-Driven Development (TDD): Mandatory.

## Project Structure

### Documentation (this feature)

```text
specs/019-newsletter-history-details/
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
│   │   └── newsletters.js # Verify/Update GET /:id endpoint
│   └── models/
│       └── newsletterModel.js # Verify getById logic
└── tests/
    └── integration/
        └── newsletterHistoryDetails.test.js

frontend/
├── src/
│   ├── pages/
│   │   ├── NewsletterHistory.jsx # Add click handlers to rows
│   │   └── NewsletterDetails.jsx # New detail page component
│   └── components/
│       └── features/
│           └── NewsletterDetailView.jsx # Reusable detail renderer
└── tests/
    └── pages/
        └── NewsletterDetails.test.jsx
```

**Structure Decision**: Web application (Option 2) as detect "frontend" and "backend" directories.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| N/A | | |
