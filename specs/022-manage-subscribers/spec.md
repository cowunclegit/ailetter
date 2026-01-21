# Feature Specification: Subscriber Management UI & Sync

**Feature Branch**: `022-manage-subscribers`
**Created**: 2026-01-21
**Status**: Draft
**Input**: User description: "Subscribe 매니징 ui를 만들어야 하는데 기본적으로 수동으로 subscribe 사용자 등록하고 메일 수신 여부 결정을 하게 해야해 사용자 삭제는 되지 않고 메일 수신 가부만 수정 할 수 있게 해야해 사용자가 메일에서 unsubscribe 버튼을 클릭하면 subscribe 리스트에서 메일 수신 안함으로 변경해야해 메일의 template의 unsubscribe 버튼을 각 메일을 사용자에게 발송할때 사용자마다의 unique uuid를 이용하여 unsubscribe 유저를 판단하는게 어떨까 하는데 최적의 솔루션을 찾아줘 sync 버튼을 누르면 사내의 custom rest api가 있는데 거기의 api를 호출하여 전체 조직의 멤버 리스트를 얻을 수 있어 여기서는 구현이 어려우니 일단 custom rest api skeleton을 만들고 가상으로 sync 되었다고 콘솔 로그를 찍어줘 사용자도 카테고리를 지정해야 하는데 현재 Settings의 AI Subject presets가 지정되어 있는데 거기에 지정된 Preset을 카테고리처럼 사용해서 사용자마다 지정할 수 있게해야해 (다중 지정 가능)"

## Clarifications

### Session 2026-01-21
- Q: How should multiple category assignments be stored in the database? → A: Join Table (many-to-many relationship)
- Q: What should happen when an email from the Sync API already exists in the local database? → A: Merge & Update (Update details, preserve subscription status)
- Q: How should the unsubscribe request be technically processed? → A: Internal API (Frontend calls a dedicated backend endpoint)
- Q: How should unsubscribed users be visually distinguished in the list? → A: Status Column (Clear labels for Subscribed/Unsubscribed)
- Q: Who is responsible for assigning interest categories to subscribers? → A: Admin Only (Managed during manual entry or sync)

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Manual Subscriber Management (Priority: P1)

The administrator needs a dedicated interface to view and manage the list of newsletter subscribers. They must be able to add new subscribers manually and update existing ones, specifically managing their subscription status and interest categories.

**Why this priority**: This is the core administrative function required to populate and maintain the subscriber base.

**Independent Test**: Can be tested by navigating to the new UI, adding a user, and verifying they appear in the list with correct details.

**Acceptance Scenarios**:

1. **Given** the subscriber list view, **When** the admin clicks "Add Subscriber", **Then** a form appears allowing entry of Name, Email, and selection of Categories (from AI Subject Presets).
2. **Given** an existing subscriber, **When** the admin toggles the "Subscribed" status, **Then** the user's status is updated immediately without deleting the record.
3. **Given** an existing subscriber, **When** the admin edits the user, **Then** they can modify the assigned Categories (multi-select) but cannot delete the user record.
4. **Given** the subscriber list, **When** viewing users, **Then** each user displays their subscription status (Subscribed/Unsubscribed) in a dedicated Status column with clear visual labels.

---

### User Story 2 - User Unsubscribe Flow (Priority: P1)

Subscribers need a way to opt-out of emails securely. When they click an unsubscribe link in an email, the system should identify them via a unique token (UUID) and update their status to "Unsubscribed" without requiring them to log in.

**Why this priority**: Essential for user trust and compliance with email standards (CAN-SPAM, etc.).

**Independent Test**: Can be tested by generating a link with a valid user UUID, visiting it, and verifying the user's status changes to "Unsubscribed" in the admin UI.

**Acceptance Scenarios**:

1. **Given** a subscriber with a unique UUID, **When** the unique unsubscribe URL is accessed (e.g., `/unsubscribe/:uuid`), **Then** the system identifies the user and updates their status to "Unsubscribed".
2. **Given** a successful unsubscribe action, **When** the user views the page, **Then** a confirmation message is displayed.
3. **Given** an invalid or non-existent UUID, **When** the unsubscribe URL is accessed, **Then** a graceful error message is displayed.

---

### User Story 3 - External Directory Sync Skeleton (Priority: P3)

The system needs to prepare for integration with an internal organization directory. Since the actual API is not yet available/reachable, a skeleton implementation is needed to simulate the sync process.

**Why this priority**: Establishes the architectural placeholder for future integration without blocking current development.

**Independent Test**: Can be tested by clicking the "Sync" button and observing the server logs.

**Acceptance Scenarios**:

1. **Given** the subscriber management UI, **When** the admin clicks the "Sync" button, **Then** the frontend triggers a backend request to a custom skeleton API.
2. **Given** the skeleton API endpoint, **When** triggered, **Then** it logs "Simulating sync with external organization directory..." to the server console and returns a success response to the frontend.
3. **Given** the frontend receives a success response, **Then** a "Sync Completed" notification is shown to the admin.

### Edge Cases

- **Duplicate Email**: Attempting to add a user manually with an email that already exists should update the existing record or show an error (prefer updating/notifying).
- **Deleted Presets**: If an AI Subject Preset is removed from global settings, it should be handled gracefully for users who had that category assigned (e.g., ignore or show as invalid).
- **Sync Timeout**: Even though it's a skeleton, the UI should handle potential network failures during the sync request.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide a "Subscriber Management" page accessible to admins.
- **FR-002**: System MUST allow creating a new subscriber with Name, Email, and Categories.
- **FR-003**: System MUST automatically generate a unique, immutable UUID for each subscriber upon creation.
- **FR-004**: System MUST allow updating a subscriber's Categories (referencing existing AI Subject Presets) and Subscription Status.
- **FR-005**: System MUST prevent deletion of subscriber records via the UI; only status changes are allowed.
- **FR-006**: System MUST provide an internal API endpoint that accepts a Subscriber UUID to update their status to unsubscribed, allowing the frontend to show a confirmation.
- **FR-007**: System MUST provide a "Sync" button in the UI that calls a backend skeleton API.
- **FR-008**: The backend skeleton API MUST log a simulation message and process data such that existing records (by email) are updated with new details while preserving their current `is_subscribed` status.
- **FR-009**: The UI MUST allow multiple AI Subject Presets to be selected for a single subscriber.
- **FR-010**: Category assignment MUST be restricted to the Admin interface; the public unsubscribe flow only modifies the subscription status.

### Key Entities *(include if feature involves data)*

- **Subscriber**:
    - `uuid` (Unique Identifier, string)
    - `name` (String)
    - `email` (String, Unique)
    - `is_subscribed` (Boolean, default true)
    - `created_at` (Timestamp)

- **SubscriberCategory** (Join Table):
    - `subscriber_uuid` (References Subscriber)
    - `preset_id` (References AI Subject Preset)

- **AI Subject Preset** (Existing):
    - Used as a reference for subscriber categories.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Admin can add a new subscriber and see them appear in the list within 2 seconds.
- **SC-002**: Visiting the unsubscribe link with a valid UUID updates the user's subscription status to `false` immediately.
- **SC-003**: The "Sync" button triggers a verifiable console log event on the server side 100% of the time.
- **SC-004**: Users can be assigned multiple categories, and these persist after page reload.