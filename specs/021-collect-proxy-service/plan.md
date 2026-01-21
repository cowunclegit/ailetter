# Implementation Plan: Collect Proxy Service

**Branch**: `021-collect-proxy-service` | **Date**: 2026-01-20 | **Spec**: [specs/021-collect-proxy-service/spec.md](spec.md)
**Input**: Feature specification for a split backend architecture to handle internet-restricted environments via a WebSocket proxy.

## Summary
The system will be split into a **Main Backend** (restricted network) and a **Collect Proxy Service** (internet access). The Main Backend will act as a WebSocket server, and the Proxy Service will connect to it as a client. Communication will be secured via a shared secret token. Collection tasks will be delegated to the Proxy, which will stream results (including fetched thumbnails) back to the Main Backend for persistence.

## Technical Context

**Language/Version**: Node.js v18+  
**Primary Dependencies**: `ws` (WebSocket), `express` (Main Backend API), `fs-extra` (Image storage)  
**Storage**: SQLite3 (Main Backend DB), Local File System (Thumbnails)  
**Testing**: Jest + Supertest  
**Target Platform**: Linux/Docker  
**Project Type**: Multi-service (Main Backend + New Proxy Service)  
**Performance Goals**: <500ms status latency, handle 100+ items per collection  
**Constraints**: 5-minute task timeout, No cancellation of started tasks  
**Scale/Scope**: Single Proxy Service instance, Sequential task processing

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Tech Stack**: Uses Node.js for both services. (Pass)
- **TDD**: Plans to include integration tests for WebSocket handshake and data transmission. (Pass)

## Project Structure

### Documentation (this feature)

```text
specs/021-collect-proxy-service/
├── plan.md              # This file
├── research.md          # Research on ws library, handshake, and streaming
├── data-model.md        # Entities: Collection Task, Proxy Status, Trend Item DTO
├── quickstart.md        # Setup instructions
└── contracts/           
    └── websocket-protocol.md # JSON message schemas
```

### Source Code (repository root)

```text
backend/
├── src/
│   ├── services/
│   │   └── websocket/
│   │       ├── proxy-server.js   # WebSocket server logic
│   │       └── message-handler.js # Logic for processing proxy data
│   └── utils/
│       └── image-storage.js      # Base64 to local file utility
└── tests/
    └── integration/
        └── proxy-collection.test.js

proxy-service/ (NEW SERVICE)
├── src/
│   ├── client.js       # WebSocket client logic
│   ├── collector.js    # Existing collector logic (moved/copied)
│   └── index.js
└── package.json
```

**Structure Decision**: Option 2 (Modified). We will maintain the existing `backend/` and introduce a new `proxy-service/` directory at the root to encapsulate the collector logic.

## Implementation Phases

### Phase 0: Research (Completed)
- Selected `ws` library for high performance.
- Defined secure handshake with shared secret.
- Chose streaming strategy for individual item updates.

### Phase 1: Design & Contracts (Completed)
- Defined `data-model.md`.
- Created `contracts/websocket-protocol.md` for JSON schemas.
- Outlined `quickstart.md`.

### Phase 2: Implementation (Next Steps)
1. **Scaffold Proxy Service**: Create the new project directory and install `ws` and dependencies.
2. **Main Backend WebSocket Server**: Implement the `ws` server with token authentication.
3. **Task Delegation**: Implement the trigger logic to send `START_COLLECTION` commands.
4. **Data Handling**: Implement image storage and DB persistence for incoming items.
5. **UI Updates**: Connect the existing "Collect Now" button to the new proxy workflow.