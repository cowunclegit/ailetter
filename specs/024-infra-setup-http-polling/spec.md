# Feature Specification: Infrastructure Reliability and Communication Update

**Feature Branch**: `024-infra-setup-http-polling`  
**Created**: 2026-01-21  
**Status**: Draft  
**Input**: User description: "최초 infra 설치시 db가 없을때 혹은 table이 없을때는 기본적인 테이블과 (데이터는 없어도 됨) Settings의 현재 기본적인 2개 AI Preset을 넣어줘야해 안그러면 SQL 오류가 발생해서 (no such table) 500 오류가 발생해 현재 https서버로 만들었는데 http 서버로 만들어줘 운영시 역방향 프록시를 이용할거라 http로 해야해 proxy와backend통신은 websocket을 이용하는데 인프라 환경상 websocket이 막혀있는 경우가 있어 단순히 http polling으로 하면 어떨까?"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Self-Healing Database Initialization (Priority: P1)

As a system administrator, I want the application to automatically create its required data structures and default configuration on the first run, so that I can deploy the application without manual database preparation.

**Why this priority**: This is critical for the "first-run" experience and prevents immediate 500 errors that block all other functionality.

**Independent Test**: Can be tested by deleting the database file/folder and starting the backend; the system should start without errors and show default AI presets in the settings.

**Acceptance Scenarios**:

1. **Given** no database file exists, **When** the backend server starts, **Then** the server creates the necessary tables and seeds exactly 2 default AI presets.
2. **Given** the database exists but is missing tables, **When** the backend server starts, **Then** it identifies and creates the missing tables without losing existing data in other tables.

---

### User Story 2 - Reverse Proxy Friendly Connectivity (Priority: P2)

As an operations engineer, I want the backend to serve traffic over HTTP instead of HTTPS, so that I can easily integrate it with standard reverse proxies (like Nginx or Caddy) which handle SSL termination.

**Why this priority**: Essential for standard production deployment architectures where SSL is managed at the edge.

**Independent Test**: Can be tested by attempting to connect to the backend via `http://` and verifying that the connection is successful and not redirected or blocked by SSL requirements.

**Acceptance Scenarios**:

1. **Given** the server is configured for production, **When** the service starts, **Then** it listens on an insecure HTTP port.
2. **Given** a request is made to the backend, **When** the request is sent via HTTP, **Then** the server responds normally without SSL errors.

---

### User Story 3 - Restricted Environment Communication (Priority: P3)

As a user in a restricted network environment, I want the communication between the proxy service and the backend to use standard HTTP requests instead of WebSockets, so that the application remains functional even if WebSockets are blocked by firewalls.

**Why this priority**: Ensures the application works in corporate or legacy environments where non-standard protocols are restricted.

**Independent Test**: Can be tested by disabling WebSocket support in the network/browser and verifying that data still updates between the proxy and backend.

**Acceptance Scenarios**:

1. **Given** a network where WebSockets are unavailable, **When** the proxy service needs updates from the backend, **Then** it retrieves them via periodic HTTP requests.
2. **Given** the system is running, **When** data changes on the backend, **Then** the proxy service reflects these changes within the defined polling interval.

---

### Edge Cases

- **Partial Initialization**: What happens if the server crashes halfway through creating tables? (System should be able to resume initialization on next start).
- **Polling Collision**: How does the system handle high-frequency polling from multiple proxy instances? (Should have a reasonable minimum interval to prevent self-DDoS).
- **Concurrent DB Access**: How is initialization handled if multiple backend processes start simultaneously? (File-level locking or atomic "if not exists" checks).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST check for the existence of required database tables on every startup.
- **FR-002**: System MUST execute a schema initialization script if the database is empty or missing.
- **FR-003**: System MUST seed at least two default "AI Subject Presets" during the initialization phase if the table is empty.
- **FR-004**: Backend server MUST listen for incoming connections using the HTTP protocol by default.
- **FR-005**: Proxy service MUST communicate with the backend via periodic HTTP GET requests (polling) instead of a persistent WebSocket connection.
- **FR-006**: System MUST allow the polling interval to be configurable, with a default value of 5 seconds.
- **FR-007**: System MUST provide a health check endpoint that returns the initialization status.

### Key Entities *(include if feature involves data)*

- **AI Subject Preset**: Represents a saved configuration for AI-generated subjects.
    - Attributes: Name, Description, Prompt Template, isDefault flag.
- **System Configuration**: Represents environment settings.
    - Attributes: Server Port, Protocol (HTTP), Polling Interval.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: New installations reach a "Ready" state within 5 seconds of the first startup without manual intervention.
- **SC-002**: 100% of proxy-to-backend communication succeeds in environments where Port 80/443 (HTTP) is open but WebSocket protocols (WS/WSS) are blocked.
- **SC-003**: Backend successfully receives and processes HTTP requests on the configured port without requiring local SSL certificates.
- **SC-004**: Users see two active AI presets in the "Settings" interface immediately after the first login on a fresh installation.