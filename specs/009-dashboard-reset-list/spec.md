# Feature Specification: Dashboard Content List Reset

**Feature Branch**: `009-dashboard-reset-list`
**Created**: 2026-01-14
**Status**: Draft
**Input**: User description: "대시보드에 컨텐츠 리스트 reset 하는 기능 추가해줘"

## Clarifications

### Session 2026-01-14

- Q: Is an "Undo" feature required after a successful reset? → A: No Undo - The confirmation dialog is sufficient protection.
- Q: How should the "Reset" button behave when no items are selected? → A: Disabled - Button is visible but grayed out.
- Q: What type of confirmation UI should be used? → A: MUI Dialog - Custom modal matching the app theme.
- Q: Should the "Reset" action also clear active filters? → A: Full Reset - Unchecks items AND resets all filters (search, date ranges, etc.).
- Q: Should "Reset" clear items hidden by active filters? → A: Global Clear - Clear all items from the current draft, even if hidden.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Clear Curation Selection (Priority: P1)

As a content curator, I want to quickly reset my current selection of trend items (clear the current draft) so that I can start over with a fresh slate if I decide the current mix is not right.

**Why this priority**: Curators often experiment with different content mixes. Manually deselecting items one by one is tedious and error-prone. A bulk reset function significantly improves the workflow efficiency.

**Independent Test**: Can be tested by selecting multiple items on the dashboard, clicking the "Reset" button, confirming the action, and verifying that all items are deselected.

**Acceptance Scenarios**:

1. **Given** a dashboard with multiple trend items selected (checked), **When** I click the "Reset Selection" button, **Then** a custom confirmation dialog appears warning me about clearing the draft.
2. **Given** the confirmation dialog is open, **When** I click "Confirm", **Then** all items (even those filtered out) are deselected AND the "Draft" status indicators are removed AND all filters (search, date range) return to default.
3. **Given** the confirmation dialog is open, **When** I click "Cancel", **Then** the dialog closes and the selection remains unchanged.
4. **Given** a dashboard with NO items selected, **When** I look at the toolbar, **Then** the "Reset Selection" button is disabled.

### Edge Cases

- **Network Failure**: What happens if the backend "clear draft" request fails? The UI should show an error and retain the current selection state.
- **Concurrent Edits**: What happens if another tab has modified the draft? The reset should attempt to force-clear the state based on the user's intent.
- **Session Expiry**: If the user's session expires before confirmation, the action should fail with a 401/403, and the UI should prompt for re-login without executing the reset.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The dashboard toolbar MUST include a "Reset" or "Clear Selection" action.
- **FR-002**: Invoking the reset action MUST require user confirmation using a custom modal (MUI Dialog). No "Undo" function is required after confirmation.
- **FR-003**: Upon confirmation, the system MUST deselect ALL `TrendItem`s currently marked as selected or "in draft" for the active newsletter (regardless of current visibility) AND reset all dashboard filters (search keywords, date ranges) to their default states.
- **FR-004**: The system MUST update the local UI state immediately to reflect the cleared selection and reset filters.
- **FR-005**: The system MUST persist this change to the backend (clearing the `newsletter_items` association for the current active draft).
- **FR-006**: The "Reset" action MUST be disabled (non-interactive, visually dimmed) when there are no items currently selected/in-draft.

### Key Entities *(include if feature involves data)*

- **Newsletter Draft**: The collection of `TrendItem`s currently selected for the upcoming issue. The reset action empties this collection.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can clear a draft containing any number of items in exactly 2 interactions (Click Reset -> Click Confirm).
- **SC-002**: The UI reflects the "cleared" state (all checkboxes empty, filters reset) within 200ms of confirmation.
- **SC-003**: Zero accidental data loss reports (mitigated by confirmation dialog).
