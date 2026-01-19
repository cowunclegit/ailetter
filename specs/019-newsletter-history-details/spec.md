# Feature Specification: Newsletter History Details and Actions

**Feature Branch**: `019-newsletter-history-details`  
**Created**: 2026-01-19  
**Status**: Draft  
**Input**: User description: "history메뉴에서 아이템을 클릭하면 상세한 정보가 나온다. Draft일때는 Create Draft 메뉴가 표시되어 테스트 메일을 보낼 수 있게 한다"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Viewing Newsletter Details (Priority: P1)

As a newsletter curator, I want to click on a newsletter in the history list to see its full details (subject, content, articles) so that I can review past issues or check the status of a pending draft.

**Why this priority**: Core functionality of the history view. Without details, history is just a high-level list.

**Independent Test**: Can be fully tested by clicking a row in the history table and verifying that the user is navigated to a details page displaying the newsletter's information.

**Acceptance Scenarios**:

1. **Given** the newsletter history table, **When** the user clicks on a row, **Then** the user is navigated to the details view for that newsletter.
2. **Given** the details view, **When** the newsletter is in 'sent' status, **Then** the user can see the sent date, subject, intro/outro, and the list of articles included.

---

### User Story 2 - Continuing Draft Editing (Priority: P2)

As a newsletter curator, I want to identify active drafts in the history view and quickly return to the editor to send test emails or finalize the content so that I can manage my work-in-progress efficiently.

**Why this priority**: Improves workflow efficiency for curators who might have started a draft but didn't finish it.

**Independent Test**: Can be tested by clicking a 'Draft' status newsletter in history and verifying that an option to "Continue Editing" or "Open Editor" is visible and functional.

**Acceptance Scenarios**:

1. **Given** a newsletter detail view for a 'draft', **When** the user views the page, **Then** a button/link to "Go to Draft Editor" is prominently displayed.
2. **Given** the draft editor (navigated from history), **When** the user clicks "Send Test Mail", **Then** a test email is sent as per standard draft editor behavior.

---

### Edge Cases

- **Accessing Non-existent Newsletter**: System should handle invalid IDs gracefully with a "Not Found" message.
- **Draft Status Change**: If a newsletter is sent while a user is viewing it as a draft, the action buttons should update or handle the conflict (e.g., refresh to show sent view).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: History table rows MUST be clickable or have a "View Details" action.
- **FR-002**: System MUST provide a dedicated details page for each newsletter (`/newsletters/:id`).
- **FR-003**: The details page MUST display the subject, issue date, status, introduction, conclusion, and all linked articles.
- **FR-004**: If the newsletter status is 'draft', the details page MUST include a link to the draft editor (`/newsletters/:id/draft`).
- **FR-005**: Navigation MUST allow users to return to the history list from the details page easily.

### Key Entities *(include if feature involves data)*

- **Newsletter**: Existing entity; details view will fetch all fields including articles.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can reach the details of any past newsletter in under 2 seconds.
- **SC-002**: 100% of 'draft' newsletters in history provide a clear path back to the editing/testing interface.
- **SC-003**: All content rendered in the details view (HTML intro/outro) correctly reflects the saved data.