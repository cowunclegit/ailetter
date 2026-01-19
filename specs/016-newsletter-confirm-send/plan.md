# Implementation Plan: Newsletter Approval and Sending Workflow

**Branch**: `016-newsletter-confirm-send` | **Date**: 2026-01-19 | **Spec**: [specs/016-newsletter-confirm-send/spec.md](spec.md)
**Input**: Feature specification from `/specs/016-newsletter-confirm-send/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

This feature implements a multi-step approval workflow for sending newsletters. It includes a preview component, a test-send mechanism to the admin with a unique confirmation UUID, and a final distribution process to all active subscribers. The system ensures data integrity via "snapshot" behavior, where the newsletter content is fixed at the moment the test email is sent.

## Technical Context

**Language/Version**: Node.js (Backend), React.js (Frontend)
**Primary Dependencies**: Express, SQLite3, axios, uuid, EJS (for email templates)
**Storage**: SQLite3 (Existing)
**Testing**: Jest (Backend & Frontend)
**Target Platform**: Web
**Project Type**: Web application (Frontend + Backend)
**Performance Goals**: Newsletter preview < 1s, Admin redirect < 2s.
**Constraints**: Confirmation UUIDs must be unique and expire after 24 hours. Status tracking must prevent duplicate sends.
**Scale/Scope**: Impacts `newsletters` and `newsletter_items` tables, and introduces a new `EmailService`.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **I. Tech Stack**: Uses React.js for frontend and Node.js for backend. (PASS)
- [x] **II. Test-Driven Development (TDD)**: All tasks will follow the Red-Green-Refactor cycle. (PASS)

## Project Structure

### Documentation (this feature)

```text
specs/016-newsletter-confirm-send/
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
│   ├── api/              # Update newsletters.js, add confirm endpoint
│   ├── models/           # Update newsletterModel.js for status/UUID tracking
│   ├── services/         # Create emailService.js
│   └── utils/            # Create emailTemplate.js
└── tests/
    ├── integration/      # Test confirmation workflow
    └── unit/             # Model and service tests

frontend/
├── src/
│   ├── api/              # Update newsletterApi.js
│   ├── components/       # New NewsletterPreview component
│   └── pages/            # New ConfirmationSuccess/Failed pages
└── tests/
```

**Structure Decision**: Web application structure with separate `backend` and `frontend` directories, following the project's established pattern.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None      | N/A        | N/A                                 |