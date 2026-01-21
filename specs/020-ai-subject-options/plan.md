# Implementation Plan: AI Subject Recommendation Options

**Branch**: `020-ai-subject-options` | **Date**: 2026-01-19 | **Spec**: [specs/020-ai-subject-options/spec.md](spec.md)
**Input**: Feature specification from `/specs/020-ai-subject-options/spec.md`

## Summary
Implement a CRUD system for AI subject presets and integrate them into the newsletter draft workflow. This includes a new management UI on the Settings page, a persistence layer in SQLite (with protection for system-provided defaults), and backend logic to process templates (replacing `${contentList}`) before calling the LLM REST API.

## Technical Context

**Language/Version**: Node.js v18+, React v19  
**Primary Dependencies**: Express, Axios, @mui/material, SQLite3  
**Storage**: SQLite3 (New table: `ai_subject_presets`)  
**Testing**: Jest, Supertest  
**Target Platform**: Web  
**Project Type**: Web application (Frontend + Backend)  
**Performance Goals**: Prompt resolution < 100ms  
**Constraints**: LLM REST API endpoint must be configurable via environment variables.  
**Scale/Scope**: ~10-20 presets, single-user curator context.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] I. Tech Stack (React.js + Node.js): Compliant.
- [x] II. Test-Driven Development (TDD): Mandatory for preset CRUD and prompt logic.

## Project Structure

### Documentation (this feature)

```text
specs/020-ai-subject-options/
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
│   │   └── aiPresets.js      # New API for preset CRUD
│   ├── models/
│   │   └── aiPresetModel.js  # SQLite model for presets
│   └── services/
│       └── aiService.js      # Updated to handle templates and contentList
└── tests/
    └── integration/
        └── aiPresets.test.js

frontend/
├── src/
│   ├── pages/
│   │   ├── Settings.jsx      # New Settings page for CRUD
│   │   └── NewsletterDraft.jsx # Integrated dropdown and AI trigger
│   └── components/
│       └── features/
│           └── AIPresetForm.jsx # Component for create/edit presets
└── tests/
    └── pages/
        └── Settings.test.jsx
```

**Structure Decision**: Web application (Option 2) as detected "frontend" and "backend" directories.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| N/A | | |