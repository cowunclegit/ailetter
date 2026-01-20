# Feature Specification: Collect Proxy Service

**Feature Branch**: `021-collect-proxy-service`  
**Created**: 2026-01-20  
**Status**: Draft  
**Input**: User description: "Collect 시 실제 운영하는 backend는 인터넷이 되지 않아서 외부 접속이 되지 않는 문제가 있어 1.실제 운영하는 backend 2.collect 전용 node.js 서비스 2개를 나눠서 1번과 2번이 서로 웹소켓으로 통신하며 사용자가 collect now를 하게 되면 1번 서버는 2번 collect 전용 node.js 서비스와 통신하여(여기는 인터넷이 됨) 2번 서비스에서 collect를 대리 수행해서 1번으로 넘겨주는 역할을 해주도록 해야해"

## Clarifications

### Session 2026-01-20
- Q: Which service acts as the WebSocket server? → A: Main Backend acts as WebSocket Server; Proxy Service connects as Client.
- Q: How are collection results transmitted? → A: Items are streamed individually to avoid large payload issues.
- Q: How are thumbnails transferred? → A: Proxy downloads image data and sends it as Base64/Binary to the Main Backend.
- Q: How are partial collection failures handled? → A: Partial Success; valid items are streamed, and failures are reported per source.
- Q: Can the Proxy handle concurrent tasks? → A: Sequential; tasks are queued and processed one by one.
- Q: Can a collection task be cancelled? → A: No; once started, a task runs to completion or timeout.
- Q: Where does the Proxy get sources? → A: Sent by Main Backend; full source list provided in each command.
- Q: How are thumbnails stored? → A: Local Storage; Main Backend saves binary to local disk.
- Q: What is the collection timeout? → A: 5 Minutes; Main Backend terminates task if exceeded.
- Q: How is the Proxy identified? → A: Static ID; Proxy identifies as "collect-proxy-01" during handshake.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Trigger Remote Collection (Priority: P1)

As a curator using the system in a restricted network environment, I want to trigger a content collection so that I can gather the latest trends even though the main server cannot access the internet directly.

**Why this priority**: This is the core functionality required to bypass the network restriction and maintain system utility.

**Independent Test**: Can be tested by initiating a "Collect Now" action from the dashboard and verifying that content from external sources is successfully added to the system database via the proxy service.

**Acceptance Scenarios**:

1. **Given** the Main Backend is running as a WebSocket server and the Proxy Service is connected, **When** a user clicks "Collect Now", **Then** the Main Backend should send a collection command to the Proxy Service.
2. **Given** the Proxy Service receives a collection command, **When** it completes gathering data from external sources, **Then** it should transmit the collected data back to the Main Backend.
3. **Given** the Main Backend receives data from the Proxy Service, **When** the data is valid, **Then** it should persist the items to the database and update the UI status.

---

### User Story 2 - Real-time Progress Monitoring (Priority: P2)

As a user, I want to see the progress of the remote collection task in real-time so that I know the system is working and when it will finish.

**Why this priority**: Collection can take time; providing feedback prevents users from thinking the system has hung.

**Independent Test**: Can be tested by observing the status indicators on the dashboard while the Proxy Service is actively collecting and transmitting data.

**Acceptance Scenarios**:

1. **Given** a collection is in progress, **When** the Proxy Service updates its internal status, **Then** it should send these status updates (e.g., "Starting", "X items found", "Complete") to the Main Backend.
2. **Given** the Main Backend receives a status update, **When** it relates to an active task, **Then** it should broadcast this update to the connected frontend clients.

---

### User Story 3 - Connection Fault Tolerance (Priority: P3)

As a system administrator, I want the connection between the main backend and the proxy service to be resilient so that temporary network issues don't require manual intervention.

**Why this priority**: Ensures reliability and reduces maintenance overhead.

**Independent Test**: Can be tested by temporarily disconnecting the network between the two services and verifying that they reconnect and resume operation when restored.

**Acceptance Scenarios**:

1. **Given** the WebSocket connection is lost, **When** the network becomes available again, **Then** the services should automatically attempt to re-establish the connection.
2. **Given** a collection task is triggered while the Proxy Service is disconnected, **When** the command fails to send, **Then** the system should inform the user that the "Collection Proxy is currently unreachable".

---

### Edge Cases

- **Large Payload Handling**: Handled by streaming items individually (see FR-004) rather than sending one massive payload.
- **Proxy Timeout**: Main Backend MUST enforce a 5-minute timeout for any single collection task.
- **Version Mismatch**: How do the two services behave if their communication protocol versions differ?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST establish a persistent bi-directional communication channel where the Main Backend acts as the WebSocket Server and the Collect Proxy Service connects as a Client.
- **FR-002**: Main Backend MUST be able to delegate collection tasks (including the full list of source URLs and parameters) to the Proxy Service, and the Proxy Service MUST report both successful item streams and individual source failures.
- **FR-003**: Collect Proxy Service MUST have outbound internet access to reach external APIs and RSS feeds.
- **FR-004**: Collect Proxy Service MUST translate external data formats into the internal `trend_item` schema, fetch thumbnail image data, and stream items (including image data) individually to the Main Backend.
- **FR-005**: Main Backend MUST validate and sanitize all data received from the Proxy Service and MUST persist received thumbnail images to local storage before updating the database.
- **FR-006**: System MUST support secure authentication/handshake between the Main Backend and Proxy Service via a shared secret token and a static client identifier.
- **FR-007**: System MUST provide a health check mechanism to verify the availability of the Proxy Service from the Main Backend.

### Key Entities *(include if feature involves data)*

- **Collection Task**: Represents a single request to gather data, processed sequentially by the Proxy Service, containing source identifiers and current status.
- **Proxy Status**: Represents the health and connectivity state of the remote collection service.
- **Trend Item (Data Transfer Object)**: The structured representation of a collected item being passed from Proxy to Main.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of "Collect Now" requests triggered on the Main Backend are successfully proxied when the connection is active.
- **SC-002**: Data latency for status updates (from Proxy action to Main UI update) is under 500ms.
- **SC-003**: System successfully recovers and reconnects within 30 seconds of network restoration after a failure.
- **SC-004**: Users receive a clear error message within 5 seconds if the Proxy Service is unreachable when a collection is attempted.