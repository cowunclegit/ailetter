# Feature Specification: Debug Clear Trend Items

**Feature Branch**: `010-debug-clear-trends`
**Created**: 2026-01-14
**Status**: Draft
**Input**: User description: "debug용으로 대시보드 컨텐츠만 삭제하는 기능 추가해줘"

## Clarifications

### Session 2026-01-14
- Q: Where should the "Debug Clear" button be placed? → A: Debug Page - A separate route (`/debug`).
- Q: Confirm data scope for deletion? → A: Wipe Trends and Newsletters. Keep Sources and Subscribers.
- Q: Should the debug page be restricted? → A: Always Enabled - Accessible via URL in all environments.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - System Reset for Testing (Priority: P1)

As a developer or tester, I want to quickly clear collected data (trends, newsletters) while PRESERVING configured sources and subscribers, so I can re-run collection without re-entering configuration or test users.

**Independent Test**:
1. Populate DB with sources, trends, and subscribers.
2. Navigate to `/debug`.
3. Click "Clear System Data".
4. Verify `sources` and `subscribers` tables still have data, while others are empty.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide a backend capability to delete records from `trend_items`, `newsletter_items`, and `newsletters`. `sources` and `subscribers` MUST NOT be deleted.
- **FR-002**: The debug route `/debug` and its backend endpoints MUST only be enabled when `NODE_ENV` is `development`.
- **FR-003**: The `/debug` page MUST include a "Clear Content (Keep Config)" button.
- **FR-004**: The action MUST require explicit user confirmation via a Modal Dialog to prevent accidental destruction.
- **FR-005**: After a successful wipe, the user SHOULD be notified and redirected or prompted to refresh state.

### Key Entities
- **All Data Tables**: `trend_items`, `newsletters`, `newsletter_items`, `sources`, `subscribers`.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Database clearance of all tables executes in < 2 seconds.
- **SC-002**: Verification of zero records in all 5 target tables post-action.
- **SC-003**: Navigation to `/debug` works immediately without requiring complex setup.
