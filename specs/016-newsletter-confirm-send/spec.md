# Feature Specification: Newsletter Approval and Sending Workflow

**Feature Branch**: `016-newsletter-confirm-send`  
**Created**: 2026-01-19  
**Status**: Draft  
**Input**: User description: "백엔드에 메일을 보내는 function을 추가해줘 해당 function은 각 플랫폼에 맞게 customize할거라 일단 콘솔로 메일을 보냈다고만 하면 됨 workflow가 레터를 보낼 메일을 선택하여 Create Draft를 하고 Send TEST Mail을 선택하여 어드민에게 메일을 보내면 어드민이 메일을 수신후 메일 내의 Confirm 버튼을 통하여 실제 메일링 리스트에 전체 메일을 보내는 방식으로 할거야 Create Draft -> Send Test Mail -> Admin에게만 메일 전달 -> 메일 내의 Confirm 버튼 선택 -> 백엔드 특정 API 호출 -> 전체 메일링 전달 중복 메일 전달 방지를 위해 Confirm 버튼에 uuid 등을 추가하여 한번 Confirm한 메일은 다시 메일링 하지 않도록 해야해 Send Test Mail 버튼을 누르기 전 실제 메일 Preview도 제공하면 좋을거 같아"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Newsletter Preview and Test Send (Priority: P1)

As an admin curator, I want to preview the drafted newsletter and send a test email to myself before sending it to all subscribers, so that I can verify the layout and content.

**Why this priority**: Essential first step in the manual approval workflow to ensure quality control.

**Independent Test**: Can be tested by creating a draft, viewing the preview in the dashboard, and clicking "Send Test Mail" which results in a success message and a console log indicating the email was sent to the admin.

**Acceptance Scenarios**:

1. **Given** a drafted newsletter with selected trend items, **When** I view the preview page, **Then** I see the formatted content exactly as it will appear in the email.
2. **Given** a drafted newsletter, **When** I click "Send Test Mail", **Then** the system generates a unique confirmation UUID and logs "Sent TEST email to Admin" to the console.

---

### User Story 2 - Admin Confirmation Workflow (Priority: P1)

As an admin curator, I want to click a "Confirm" button in the test email to trigger the final distribution, so that I have final control over when the newsletter is sent to the full mailing list.

**Why this priority**: The core security and process requirement to prevent accidental or unauthorized mass mailings.

**Independent Test**: Can be tested by invoking the confirmation API endpoint with a valid UUID and verifying that the system logs the final mailing to all subscribers and marks the UUID as used.

**Acceptance Scenarios**:

1. **Given** a valid and unused confirmation UUID, **When** the confirmation API is called (via the email button), **Then** the system logs "Sending final newsletter to mailing list..." and redirects the admin to a success page.
2. **Given** a confirmation UUID that has already been used, **When** the confirmation API is called again, **Then** the system returns an error message and does NOT send the mail again.

---

### User Story 3 - Subscriber Distribution (Priority: P2)

As a subscriber, I want to receive the finalized newsletter after it has been approved by the admin.

**Why this priority**: Delivers the ultimate value of the system to the end-users.

**Independent Test**: Verified by checking the backend logs after admin confirmation to see entries for all active subscribers.

**Acceptance Scenarios**:

1. **Given** the admin has confirmed the mailing, **When** the distribution job runs, **Then** every active subscriber in the database is included in the sending log.

---

### Edge Cases

- **Multiple Confirmations**: If the admin clicks "Confirm" multiple times, the system must detect the status of the newsletter and prevent duplicate sends.
- **Expired UUID**: How long should the confirmation link remain valid? (Assumption: 24 hours).
- **Invalid UUID**: The system must handle requests with non-existent or malformed UUIDs gracefully.
- **Draft Modification after Test Send**: The system snapshots the newsletter content at the moment the "Send Test Mail" action is triggered. Any subsequent modifications to the draft items in the dashboard are ignored for that specific confirmation UUID; clicking "Confirm" will distribute the version that was sent in the test email.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide a newsletter preview component in the dashboard showing the finalized HTML/text content.
- **FR-002**: System MUST implement a `sendEmail` service function that, for now, logs the action to the console (e.g., `console.log('Sending email to: [email] with subject: [subject]')`).
- **FR-003**: System MUST generate a unique UUID for each newsletter test send and store it in the database associated with that newsletter draft.
- **FR-004**: The "Send Test Mail" action MUST include a "Confirm and Send to All" button in the email body that links to a backend confirmation endpoint with the unique UUID.
- **FR-005**: System MUST expose a GET or POST endpoint `/api/newsletters/confirm/:uuid` to process approvals.
- **FR-006**: System MUST track the status of each newsletter (e.g., `draft`, `sending`, `sent`) to prevent duplicate distributions.
- **FR-007**: Upon successful confirmation, the system MUST iterate through all active subscribers and trigger the `sendEmail` function for each.

### Key Entities *(include if feature involves data)*

- **Newsletter**: Represents a single newsletter issue. Attributes: `id`, `status` (draft/sending/sent), `confirmation_uuid`, `content` (list of items), `created_at`, `sent_at`.
- **Subscriber**: (Existing) Represents an active member of the mailing list.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of "Send Test Mail" actions result in a unique UUID being generated and saved.
- **SC-002**: 0% of newsletters are sent more than once to the full mailing list (duplicate prevention via UUID and status tracking).
- **SC-003**: Admins can view the newsletter preview in under 1 second on the dashboard.
- **SC-004**: The system logs the correct number of intended recipients (subscribers) upon final confirmation.
- **SC-005**: Admin redirection from the "Confirm" link to a success page occurs in under 2 seconds.