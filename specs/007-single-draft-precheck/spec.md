# Feature Specification: Single Draft Constraint and Dashboard Pre-check

**Feature Branch**: `007-single-draft-precheck`  
**Created**: 2026-01-13  
**Status**: Draft  
**Input**: User description: "Draft는 한번에 1개만 생성 가능하고 Draft 작성 되고 발송 전의 Draft의 컨텐츠는 대시보드에서 미리 체크 표시가 되어야 해"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Single Active Draft Constraint (Priority: P1)

As a curator, I want the system to ensure only one newsletter draft exists at a time so that I can focus on a single publication cycle without confusion or data conflicts.

**Why this priority**: Prevents data fragmentation and maintains a clear linear workflow for newsletter production.

**Independent Test**: Can be tested by creating a draft and then attempting to create another one from the dashboard. The system should block the second attempt.

**Acceptance Scenarios**:

1. **Given** an active draft already exists, **When** I navigate to the Dashboard, **Then** the "Create Draft" button remains available but will overwrite the current draft if clicked.
2. **Given** an active draft already exists, **When** I trigger the draft creation API, **Then** the system replaces the old draft with the new one atomically.

---

### User Story 2 - Dashboard Draft Item Visibility (Priority: P2)

As a curator, I want trend items that are already part of an active draft to be automatically selected when I open the dashboard, so that I can see the current progress of my newsletter.

**Why this priority**: Provides visual continuity between the dashboard and the draft organization screen.

**Independent Test**: Can be tested by adding items to a draft, returning to the dashboard, and verifying those items are automatically checked.

**Acceptance Scenarios**:

1. **Given** an active draft contains items A and B, **When** I open the Dashboard, **Then** items A and B are shown as "Selected" by default.
2. **Given** I am viewing items in an active draft on the dashboard, **When** I uncheck an item, **Then** the item is immediately removed from the active draft in the database.

---

### User Story 3 - Draft Overwrite Behavior (Priority: P3)

As a curator, I want the system to allow me to restart or update my draft by simply clicking "Create Draft" again with new selections, even if a draft already exists.

**Why this priority**: Allows for a fast iterative workflow since there is currently no separate menu to manage or view existing drafts.

**Independent Test**: Create a draft, change selections on the dashboard, click "Create Draft" again, and verify the old draft is replaced by the new one immediately.

**Acceptance Scenarios**:

1. **Given** an active draft exists, **When** I click "Create Draft" with new selections, **Then** the system immediately deletes the old draft and creates a new one with the current items.

---

### Edge Cases

- **Concurrent Access**: If two curators are working, the last one to click "Create Draft" defines the single active draft.
- **Empty Selection Sync**: If all items are unchecked from the dashboard, the active draft remains as an empty container.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST allow only one newsletter with `status = 'draft'` to exist at any time.
- **FR-002**: Dashboard MUST detect the existence of an active draft upon loading.
- **FR-003**: System MUST fetch items associated with the active draft and mark them as selected in the Dashboard trend list.
- **FR-004**: If a draft exists and the user triggers "Create Draft", the system MUST immediately replace the existing draft with a new one containing the current selections.
- **FR-005**: System MUST sync dashboard checkbox toggles immediately with the active draft's item list if a draft exists.

## Clarifications

### Session 2026-01-13

- Q: What should happen if a curator clicks "Create Draft" while one already exists? → A: Overwrite immediately without confirmation.
- Q: If a draft exists, what should happen if you check/uncheck items on the dashboard? → A: Sync immediately with the active draft.

### Key Entities

- **Newsletter**: Updated with logic to ensure only one record has `status = 'draft'`.
- **TrendItem**: Visual state on dashboard depends on its association with the active `Newsletter` draft.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of attempts to create a second draft without confirmation are blocked.
- **SC-002**: Dashboard accurately reflects the contents of the active draft within 500ms of page load.
- **SC-003**: Synchronization of a checkbox toggle to the database completes in under 300ms.