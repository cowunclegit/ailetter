# Research: Collect Now & Progress

**Feature**: Collect Now & Progress
**Status**: Complete
**Date**: 2026-01-14

## Unknowns & Clarifications

### 1. Backend Endpoint Availability
**Question**: Do we need to create new endpoints for manual collection?
**Investigation**: Checked `backend/src/api/trends.js`.
**Findings**:
- `POST /api/trends/collect` exists and triggers `runCollection`.
- `GET /api/trends/collect/status` exists and checks `collectionService.activeCollections`.
- The `collectionService` instance is shared between `collectionJob.js` (cron) and `trends.js` (api), ensuring state consistency.
**Resolution**: Reuse existing endpoints. No new backend API work needed other than potentially verifying robust error handling.

### 2. Real-time Updates
**Question**: How should the frontend know when collection finishes?
**Options**:
- **A. WebSockets/Server-Sent Events (SSE)**: Real-time push.
- **B. Polling**: Client periodically checks status.
**Decision**: **Option B (Polling)**
**Rationale**:
- **Simplicity**: No need to introduce a WebSocket server or SSE infrastructure.
- **Scale**: This is an admin feature with very few concurrent users. Polling overhead is negligible.
- **Existing Support**: The `/status` endpoint is already designed for this pattern.

## Implementation Decisions

### Frontend State
- Will use a `useInterval` hook or simple `setTimeout` loop in the component to poll `/status` when collection is active.
- Upon `isCollecting` transitioning from `true` to `false`, the component will trigger the `onRefresh` callback prop.

### UI/UX
- Button will show a loading spinner (MUI `CircularProgress`) when collecting.
- Button will be disabled during collection to prevent double-clicks.
