# Tasks: Collect Proxy Service

**Feature Name**: Collect Proxy Service
**Branch**: `021-collect-proxy-service`
**Implementation Plan**: [specs/021-collect-proxy-service/plan.md](plan.md)

## Implementation Strategy
We will implement the split architecture incrementally, starting with a basic authenticated WebSocket connection between the Main Backend and the new Proxy Service. We'll then move the existing collection logic into the Proxy Service and implement the streaming protocol to pass results and images back to the Main Backend. Finally, we'll add real-time monitoring and fault tolerance.

## Phase 1: Setup
Initial project scaffolding and environment configuration.

- [X] T001 Initialize `proxy-service` project with `npm init` and install dependencies (`ws`, `dotenv`, `axios`, `rss-parser`) in `proxy-service/package.json`
- [X] T002 Configure environment variables (`PROXY_SHARED_SECRET`, `MAIN_BACKEND_WS_URL`, `PROXY_CLIENT_ID`) in `proxy-service/.env` and `backend/.env`
- [X] T003 [P] Create the basic project structure for `proxy-service` in `proxy-service/src/`

## Phase 2: Foundational
Establish secure bi-directional communication between services.

- [X] T004 Create unit tests for WebSocket authentication and handshake logic in `backend/tests/unit/proxy-auth.test.js`
- [X] T005 Implement WebSocket Server in the Main Backend to listen for proxy connections in `backend/src/services/websocket/proxy-server.js`
- [X] T006 Implement secure handshake with token validation in `backend/src/services/websocket/proxy-server.js`
- [X] T007 Create unit tests for proxy client connection and identification logic in `proxy-service/tests/client.test.js`
- [X] T008 Implement WebSocket Client in the Proxy Service with automatic connection logic in `proxy-service/src/client.js`
- [X] T009 Implement the `IDENTIFY` message exchange to register the proxy in `proxy-service/src/client.js` and `backend/src/services/websocket/proxy-server.js`

## Phase 3: User Story 1 - Trigger Remote Collection (Priority: P1) [US1]
Goal: Enable the Main Backend to delegate collection tasks and receive results.
Independent Test: Trigger a collection from the dashboard and verify items and thumbnails are saved to the database and local storage.

- [X] T010 [US1] Create unit tests for image storage utility and data sanitization logic in `backend/tests/unit/image-storage.test.js`
- [X] T011 [US1] Create unit tests for source scraping and item translation in `proxy-service/tests/collector.test.js`
- [X] T012 [US1] Implement `START_COLLECTION` message handler in the Proxy Service to trigger scraping in `proxy-service/src/collector.js`
- [X] T013 [US1] Move/Adapt existing collection logic (RSS/YouTube) to the Proxy Service in `proxy-service/src/collector.js`
- [X] T014 [US1] Implement thumbnail fetching and Base64 conversion in `proxy-service/src/collector.js`
- [X] T015 [US1] Implement streaming of `ITEM_COLLECTED` messages from Proxy to Main Backend in `proxy-service/src/client.js`
- [X] T016 [US1] Implement image storage utility to save Base64 data as local files in `backend/src/utils/image-storage.js`
- [X] T017 [US1] Implement handler for `ITEM_COLLECTED` messages to validate, sanitize, and persist data in `backend/src/services/websocket/message-handler.js`
- [X] T018 [US1] Modify the "Collect Now" API endpoint to delegate tasks to the Proxy Service in `backend/src/api/routes/collect.js`

## Phase 4: User Story 2 - Real-time Progress Monitoring (Priority: P2) [US2]
Goal: Provide users with real-time feedback during the collection process.
Independent Test: Observe the collection progress bar/status on the dashboard during a collection run.

- [X] T019 [US2] Implement `PROGRESS_UPDATE` and `COLLECTION_COMPLETE` message sending in the Proxy Service in `proxy-service/src/collector.js`
- [X] T020 [US2] Implement broadcasting of progress messages to frontend clients via Socket.io in `backend/src/services/websocket/message-handler.js`
- [X] T021 [P] [US2] Update the frontend dashboard to display real-time status updates in `frontend/src/pages/Dashboard.jsx`

## Phase 5: User Story 3 - Connection Fault Tolerance (Priority: P3) [US3]
Goal: Ensure the system gracefully handles disconnection and reconnection.
Independent Test: Disconnect the proxy and verify the dashboard reflects the status and prevents collection triggers.

- [X] T022 [US3] Implement reconnection logic with exponential backoff in the Proxy Service in `proxy-service/src/client.js`
- [X] T023 [US3] Implement a health check/heartbeat mechanism in `backend/src/services/websocket/proxy-server.js`
- [X] T024 [US3] Add UI error handling and status indicators for proxy availability in `frontend/src/pages/Dashboard.jsx`

## Phase 6: Polish & Cross-Cutting Concerns
Final touches and integration verification.

- [X] T025 Implement a 5-minute timeout for collection tasks on the Main Backend in `backend/src/services/websocket/proxy-server.js`
- [X] T026 [P] Final integration test verifying handshake, streaming, and database persistence in `backend/tests/integration/proxy-collection.test.js`
- [X] T027 [US3] Verify connection recovery time is under 30s (SC-003) via automated script
- [X] T028 [US2] Verify real-time status update latency is under 500ms (SC-002)
- [X] T029 Remove deprecated local collection code from the Main Backend once proxy is stable

## Dependencies
US1 → US2 → US3

## Parallel Execution Examples
- T003 (Proxy Structure) and T004 (Backend Server) can be developed in parallel.
- T012 (Image Utility) and T013 (DB Handler) can be developed in parallel.
- T017 (Frontend UI) can be developed in parallel with backend progress broadcasting (T016).
