# Implementation Plan: Infrastructure Reliability and Communication Update

**Branch**: `024-infra-setup-http-polling` | **Date**: 2026-01-21 | **Spec**: [specs/024-infra-setup-http-polling/spec.md](spec.md)
**Input**: Feature specification from `/specs/024-infra-setup-http-polling/spec.md`

## Summary
The goal is to improve the reliability and deployability of the application by automating database initialization, transitioning the backend from HTTPS to HTTP (to better support reverse proxies), and replacing the WebSocket-based communication between the proxy service and backend with robust HTTP polling.

## Technical Context

**Language/Version**: Node.js v18+, React.js (Frontend)
**Primary Dependencies**: `express`, `sqlite3`, `axios`, `uuid`
**Storage**: SQLite3
**Testing**: `jest`
**Target Platform**: Linux server (Reverse Proxy ready)
**Project Type**: Web application
**Performance Goals**: Startup < 5s, Polling interval default 5s
**Constraints**: Insecure HTTP backend, No WebSockets between services
**Scale/Scope**: Reliability and connectivity focus

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] Tech Stack: React + Node.js (Compliant)
- [x] TDD: Mandatory tests before implementation (Compliant)

## Project Structure

### Documentation (this feature)

```text
specs/024-infra-setup-http-polling/
├── plan.md              # This file
├── research.md          # Research on HTTP transition and polling
├── data-model.md        # New proxy_tasks table
├── quickstart.md        # Setup instructions
├── contracts/           
│   └── proxy-api.md     # Polling API contracts
└── checklists/
    └── requirements.md
```

### Source Code (repository root)

```text
backend/
├── src/
│   ├── db/
│   │   ├── index.js     # Auto-init logic
│   │   └── schema.sql   # Updated with proxy_tasks
│   ├── api/
│   │   └── proxy.js     # NEW: Polling endpoints
│   └── server.js        # Reverted to HTTP
└── tests/

proxy-service/
├── src/
│   ├── client.js        # Replaced WS with Polling
│   └── index.js
└── tests/
```

**Structure Decision**: Standard Web application structure with an additional `proxy-service`.

## Complexity Tracking

*No violations detected.*