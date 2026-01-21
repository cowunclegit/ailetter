# Implementation Plan: Mock AI Service Integration

**Branch**: `023-mock-ai-service` | **Date**: 2026-01-21 | **Spec**: [specs/023-mock-ai-service/spec.md](spec.md)
**Input**: Feature specification from `/specs/023-mock-ai-service/spec.md`

## Summary
Replace the direct dependency on the `openai` library in `AiService` with a `MockAiProvider`. This involves abstracting the AI provider logic into an interface, allowing the system to run without an OpenAI API key and simplifying future integration of a custom AI API.

## Technical Context

**Language/Version**: Node.js v18+  
**Primary Dependencies**: `express`, `sqlite3` (Backend)  
**Storage**: N/A (Mock responses are deterministic)  
**Testing**: `jest` (Existing)  
**Target Platform**: Node.js Backend  
**Project Type**: Web application (Frontend + Backend)  
**Performance Goals**: AI responses in < 50ms  
**Constraints**: Zero `openai` library imports in `AiService`  
**Scale/Scope**: Impacts `AiService` and its consumers (`NewsletterService`, `CollectionJob`)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Tech Stack**: Backend uses Node.js (Verified).
- **TDD**: Tests will be updated/created first to ensure mock behavior matches expectations (Verified).

## Project Structure

### Documentation (this feature)

```text
specs/023-mock-ai-service/
├── plan.md              # This file
├── research.md          # Research on AI usage and provider pattern
├── data-model.md        # AI Provider abstraction
├── quickstart.md        # Guide for local development with mock
├── contracts/
│   └── ai-provider.md   # AI Provider interface contract
└── checklists/
    └── requirements.md  # Quality checklist
```

### Source Code (repository root)

```text
backend/
├── src/
│   ├── services/
│   │   ├── aiService.js      # Updated to use providers
│   │   └── providers/
│   │       ├── aiProvider.js  # Base interface
│   │       └── mockAiProvider.js # Mock implementation
└── tests/
    └── unit/
        ├── aiService.test.js  # Updated
        └── mockAiProvider.test.js # New
```

**Structure Decision**: Web application structure (Option 2) as the project is divided into `backend/` and `frontend/`.

## Complexity Tracking

*No violations identified.*