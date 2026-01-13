# Feature Specification: Newsletter Draft and Secure Sending

**Feature Branch**: `006-newsletter-draft-send`  
**Created**: 2026-01-13  
**Status**: Draft  
**Input**: User description: "Create Draft 버튼을 누르면 Draft 화면으로 전환되고 선택 된 컨텐츠 리스트가 보이고 순서를 바꿀 수 있고 (드래그 앤드랍) 최종적으로 Send Test Mail로 테스트 메일을 보낸다 테스트 메일 안에는 최종 결과 물과 Confirm Link가 제공 되고 Confirm Link를 누르면 실제 전체 발송 되는 api 호출을 한다 (api 호출 시 uuid를 함께 전달하여 임의 발송 금지 및 보안성 증대)"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Draft Content Organization (Priority: P1)

As a curator, I want to organize and reorder the selected news items in a dedicated draft screen so that I can control the narrative flow of the newsletter.

**Why this priority**: Core functionality for creating a professional newsletter.

**Independent Test**: Can be fully tested by selecting items, clicking "Create Draft", and verifying the reordering works via drag-and-drop.

**Acceptance Scenarios**:

1. **Given** I have selected trend items on the dashboard, **When** I click "Create Draft", **Then** I am navigated to the Draft screen showing those items.
2. **Given** I am on the Draft screen, **When** I drag an item to a new position, **Then** its display order is updated and persisted.

---

### User Story 2 - Preview and Quality Check (Priority: P2)

As a curator, I want to receive a test email of the newsletter so that I can verify its appearance and content before it is sent to all subscribers.

**Why this priority**: Essential for quality assurance and preventing errors in the final product.

**Independent Test**: Can be tested by clicking "Send Test Mail" and verifying the email arrives at the fixed administrator address with the correct content.

**Acceptance Scenarios**:

1. **Given** I am on the Draft screen, **When** I click "Send Test Mail", **Then** a preview email is sent to a fixed administrator address (configured in system settings).
2. **Given** I receive the test email, **When** I open it, **Then** I see the newsletter items in the order I specified.

---

### User Story 3 - Secure Final Confirmation (Priority: P3)

As a curator, I want a secure way to trigger the final distribution of the newsletter from the test email so that the full send only happens after a final manual review.

**Why this priority**: Adds a security layer and a final "point of no return" confirmation.

**Independent Test**: Can be tested by clicking the "Confirm" link in the test email and verifying the newsletter is distributed to all active subscribers.

**Acceptance Scenarios**:

1. **Given** I have received a test email, **When** I click the "Confirm Link", **Then** the system validates the request using a unique UUID and triggers the full distribution API.
2. **Given** a confirmation request is sent without a valid UUID or a used/expired UUID, **When** the API is called, **Then** it returns an error and no emails are sent.

---

### Edge Cases

- **Empty Draft**: What happens if "Create Draft" is clicked without selections? (Assumption: Button should be disabled or show a warning).
- **Network Failure during Drag & Drop**: The system should handle reordering failures gracefully and potentially offer a retry or show an error state.
- **Link Expiration**: How long is the Confirm Link valid? (Assumption: 24 hours).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide a Draft screen accessible after selecting trend items.
- **FR-002**: Draft screen MUST support drag-and-drop reordering of selected items.
- **FR-003**: System MUST persist the item order in the database for each newsletter draft.
- **FR-004**: System MUST allow curators to trigger a "Send Test Mail" function from the Draft screen.
- **FR-005**: Test emails MUST include a "Confirm" link containing a unique, cryptographically secure UUID.
- **FR-006**: System MUST expose an API endpoint that triggers the full distribution when called with a valid UUID.
- **FR-007**: The full distribution API MUST be idempotent and prevent multiple sends for the same newsletter draft.
- **FR-008**: System MUST update the newsletter status from 'draft' to 'sent' after successful distribution.

### Key Entities *(include if feature involves data)*

- **Newsletter (Updated)**: Added attributes: `confirmation_uuid` (UUID), `status` (draft/sent/sending).
- **NewsletterItem (Updated)**: Added attribute: `display_order` (integer).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Curators can reorder 10 items in under 30 seconds via drag-and-drop.
- **SC-002**: Test emails are delivered within 60 seconds of clicking "Send Test Mail".
- **SC-003**: 100% of unauthorized distribution attempts (missing or invalid UUID) are blocked by the system.
- **SC-004**: Final distribution starts within 10 seconds of clicking the "Confirm" link.