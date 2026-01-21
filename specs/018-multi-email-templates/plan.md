# Implementation Plan: Multiple Email Templates

**Branch**: `018-multi-email-templates` | **Date**: 2026-01-19 | **Spec**: [specs/018-multi-email-templates/spec.md](spec.md)
**Input**: Feature specification from `/specs/018-multi-email-templates/spec.md`

## Summary
Implement support for selecting from 10+ distinct email templates during newsletter draft creation. This includes a visual selection UI (responsive grid), metadata storage for chosen templates, and dynamic rendering of previews and final emails using the selected layout.

## Technical Context

**Language/Version**: Node.js v18+, React v19  
**Primary Dependencies**: Express, EJS (templating), @mui/material (UI components), Axios, uuid  
**Storage**: SQLite3 (Updating `newsletters` table)  
**Testing**: Jest, Supertest, React Testing Library  
**Target Platform**: Web (Desktop/Mobile)
**Project Type**: Web application (Frontend + Backend)  
**Performance Goals**: Live template switching in < 500ms  
**Constraints**: All templates must support content thumbnails, titles, and summaries.  
**Scale/Scope**: 10+ predefined templates, fixed styles, structural variety.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] I. Tech Stack (React.js + Node.js): Compliant.
- [x] II. Test-Driven Development (TDD): Mandatory for all new endpoints and UI logic.

## Project Structure

### Documentation (this feature)

```text
specs/018-multi-email-templates/
├── plan.md              # This file
├── research.md          # Research findings and template definitions
├── data-model.md        # Update to newsletters table
├── quickstart.md        # Setup guide
├── contracts/           # API for template retrieval and selection
└── tasks.md             # Execution steps
```

### Source Code (repository root)

```text
backend/
├── src/
│   ├── api/
│   │   └── templates.js      # New API for listing templates
│   ├── services/
│   │   └── templateService.js # Logic for template management
│   └── utils/
│       └── emailTemplate.js  # Updated to support multiple EJS files
└── tests/
    └── integration/
        └── templates.test.js

frontend/
├── src/
│   ├── components/
│   │   └── features/
│   │       ├── TemplateGrid.jsx    # Selection UI
│   │       └── TemplatePreview.jsx # Visual thumbnail/sketch
│   └── pages/
│       └── NewsletterDraft.jsx     # Integration of selection UI
└── tests/
    └── components/
        └── TemplateGrid.test.jsx
```

**Structure Decision**: Web application (Option 2) as detect "frontend" and "backend" directories.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| N/A | | |
