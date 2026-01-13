# Implementation Plan: UI Polish & Material Design

**Branch**: `002-polish-ui-material` | **Date**: 2026-01-13 | **Spec**: [specs/002-polish-ui-material/spec.md](spec.md)
**Input**: Feature specification from `/specs/002-polish-ui-material/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

The project will undergo a UI redesign to implement Material Design principles using the MUI (Material-UI) library. This includes applying a consistent "System Default" theme, implementing a responsive Top Navigation Bar, redesigning the Curator Dashboard with a grid of cards layout, styling the Source Management interface, and polishing public subscriber pages with responsive forms and Toast/Snackbar feedback for asynchronous actions.

## Technical Context

**Language/Version**: Node.js (Backend), React.js (Frontend)
**Primary Dependencies**: `@mui/material`, `@mui/icons-material`, `@emotion/react`, `@emotion/styled`
**Storage**: SQLite (Existing)
**Testing**: Jest (Unit/Integration), React Testing Library (Frontend Components)
**Target Platform**: Web Application (Responsive Mobile/Desktop)
**Project Type**: Web Application (Frontend + Backend)
**Performance Goals**: No horizontal scroll on 320px viewports; Instant visual feedback for async actions
**Constraints**: Must use MUI System Default theme; Must use Top Navigation Bar
**Scale/Scope**: 3 main functional areas (Public, Dashboard, Sources), ~5-7 key reusable components

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **Tech Stack**: Uses React.js for Frontend and Node.js for Backend as mandated by Principle I.
- [x] **TDD**: Plan includes creating tests for components and flows first as mandated by Principle II.

## Project Structure

### Documentation (this feature)

```text
specs/002-polish-ui-material/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
# Option 2: Web application
backend/
├── src/
│   └── (No major backend structure changes, mainly API responses if needed)
└── tests/

frontend/
├── src/
│   ├── components/
│   │   ├── common/      # New: Reusable MUI wrappers (Button, Card, etc.)
│   │   ├── layout/      # New: Layout components (AppBar, Container)
│   │   └── features/    # New: Feature-specific components
│   ├── pages/
│   ├── services/
│   ├── theme/           # New: MUI Theme configuration
│   └── App.jsx
└── tests/
```

**Structure Decision**: Standard Web Application structure. Adding `components/common`, `components/layout`, and `theme/` directories to organize the new UI architecture efficiently.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| N/A       |            |                                     |