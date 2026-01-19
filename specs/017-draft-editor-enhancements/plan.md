# Implementation Plan: Draft Editor Enhancements

**Branch**: `017-draft-editor-enhancements` | **Date**: 2026-01-19 | **Spec**: [specs/017-draft-editor-enhancements/spec.md](spec.md)
**Input**: Feature specification from `/specs/017-draft-editor-enhancements/spec.md`

## Summary
Enhance the newsletter draft editor with subject line customization, AI-driven subject suggestions (initial placeholder), and rich text (HTML) editors for introduction and conclusion sections. Additionally, add the ability to delete individual items from the draft list.

## Technical Context

**Language/Version**: Node.js (v18+), React (v19+)
**Primary Dependencies**: `@dnd-kit/core`, `@mui/material`, `react-quill`, `axios`, `express`, `sqlite3`
**Storage**: SQLite3 (newsletters table updated with subject, introduction_html, conclusion_html)
**Testing**: Jest, Supertest
**Target Platform**: Web (Chrome, Safari, Firefox, Edge)
**Project Type**: Web application (Frontend + Backend)
**Performance Goals**: UI should remain responsive while editing rich text; drag and drop should be fluid.
**Constraints**: HTML output from editors must be compatible with common email clients.
**Scale/Scope**: Single newsletter draft management.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] Tech Stack: Uses React.js + Node.js (Compliant)
- [x] TDD: Mandatory for all new backend routes and frontend logic (Compliant)

## Project Structure

### Documentation (this feature)

```text
specs/017-draft-editor-enhancements/
├── plan.md              # This file
├── research.md          # Research findings and decisions
├── data-model.md        # Updated entity definitions
├── quickstart.md        # Setup and verification guide
├── contracts/           # API definitions
└── tasks.md             # Implementation tasks
```

### Source Code (repository root)

```text
backend/
├── src/
│   ├── models/
│   │   └── newsletterModel.js  # Update with new fields and methods
│   ├── api/
│   │   └── newsletterRoutes.js # Add new endpoints
│   └── db/
│       └── migrate_017_newsletter_fields.js # New migration
└── tests/
    ├── unit/
    │   └── newsletterModel.test.js
    └── integration/
        └── newsletterApi.test.js

frontend/
├── src/
│   ├── components/
│   │   └── features/
│   │       ├── DraggableItem.jsx # Add delete button
│   │       └── RichTextEditor.jsx # New shared component
│   ├── pages/
│   │   └── NewsletterDraft.jsx # Add subject field, AI button, and editors
│   └── api/
│       └── newsletter.js # Update API calls
└── tests/
    └── components/
        └── DraggableItem.test.jsx
```

**Structure Decision**: Web application (Option 2) as the project has distinct `backend/` and `frontend/` directories.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| N/A | | |