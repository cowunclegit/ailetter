# Feature Specification: Collect Now & Progress

**Feature Branch**: `011-collect-now-progress`
**Created**: 2026-01-14
**Status**: Draft
**Input**: User description: "Collect NOW 버튼으로 Collect 하고 Progress를 보여줄 수 있으면 보여주고 완료 하면 list를 refresh 자동으로 해야해"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Trigger Immediate Collection (Priority: P1)

As an admin user, I want to manually trigger the content collection process immediately so that I can fetch the latest trends without waiting for the scheduled job.

**Why this priority**: Core functionality requested. Enables on-demand updates.

**Independent Test**: Can be tested by clicking the button and verifying network requests and subsequent data updates.

**Acceptance Scenarios**:

1. **Given** the dashboard is loaded, **When** I click the "Collect NOW" button, **Then** a request to start collection is sent to the server.
2. **Given** a collection is started, **When** the process is running, **Then** the UI shows a visual indicator (e.g., loading spinner or text) that collection is in progress.
3. **Given** the collection is running, **When** I try to click "Collect NOW" again, **Then** the button is disabled or handles the click gracefully (e.g., shows "Already running").

---

### User Story 2 - Auto-Refresh on Completion (Priority: P1)

As an admin user, I want the trend list to automatically update after a manual collection completes so that I can see the new items immediately without refreshing the page.

**Why this priority**: Improves workflow efficiency and user experience.

**Independent Test**: Trigger collection and observe the list component updates automatically upon completion.

**Acceptance Scenarios**:

1. **Given** a manual collection is in progress, **When** the server response indicates completion (success), **Then** the application automatically fetches the latest trend items.
2. **Given** the list is refreshed, **When** new items were found, **Then** they appear in the list.
3. **Given** a manual collection is in progress, **When** the server response indicates failure, **Then** an error message is displayed, and the loading state ends.

### Edge Cases

- **Network Failure**: If the request to start collection fails (e.g., network offline), an error message should be displayed to the user.
- **Server Timeout**: If the collection process takes longer than the browser/proxy timeout, the UI should handle the timeout gracefully (e.g., "Collection is taking longer than expected, please check back later").
- **Empty Result**: If collection runs successfully but finds no new items, the UI should still refresh (or indicate "No new items found") and clear the loading state.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The Dashboard MUST have a "Collect NOW" button.
- **FR-002**: Clicking "Collect NOW" MUST trigger the backend collection process (likely via a new or existing API endpoint).
- **FR-003**: The UI MUST display a "loading" or "collecting" state while the collection request is pending.
  - *Assumption*: Granular progress (e.g., "50%") is not required based on "if possible" phrasing and current backend architecture; a simple indeterminate loading state is sufficient.
- **FR-004**: The system MUST prevent concurrent manual collections initiated by the same user session (e.g., disable button).
- **FR-005**: Upon successful completion of the collection request, the frontend MUST automatically re-fetch the list of trend items.
- **FR-006**: The backend MUST expose an endpoint to trigger the collection job manually.
- **FR-007**: The backend MUST return a success response when the collection (and optional AI curation) is finished.

### Key Entities

- **CollectionJob**: The background process that fetches data.
- **TrendItem**: The data entities being collected and listed.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Clicking "Collect NOW" initiates a backend process within 500ms.
- **SC-002**: The UI reflects the "Collecting" state within 200ms of user interaction.
- **SC-003**: The Trend List updates with new items (if any) within 1 second of the collection process completing.
- **SC-004**: Users can successfully trigger a collection and see results without a full page reload.